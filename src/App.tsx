/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Ribbon } from "./components/Ribbon";
import { ExcelPlugin } from "./components/plugins/ExcelPlugin";
import { ReportsPlugin } from "./components/plugins/ReportsPlugin";
import { ReportViewPlugin } from "./components/plugins/ReportViewPlugin";
import { SettingsPlugin } from "./components/plugins/SettingsPlugin";
import { Toaster } from "./components/ui/sonner";
import { motion, AnimatePresence } from "motion/react";
import { PublishedReport } from "./types";

export default function App() {
  const [activePlugin, setActivePlugin] = useState("excel");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [reports, setReports] = useState<PublishedReport[]>([]);
  const [viewingReport, setViewingReport] = useState<PublishedReport | null>(null);

  const handlePublish = (report: PublishedReport) => {
    setReports(prev => [report, ...prev]);
    setActivePlugin("reports");
  };

  const handleViewReport = (report: PublishedReport) => {
    setViewingReport(report);
    setActivePlugin("view-report");
  };

  const renderPlugin = () => {
    if (activePlugin === "view-report" && viewingReport) {
      return (
        <ReportViewPlugin 
          report={viewingReport} 
          onBack={() => {
            setViewingReport(null);
            setActivePlugin("reports");
          }} 
        />
      );
    }

    switch (activePlugin) {
      case "excel":
      case "create-report":
        return <ExcelPlugin onPublish={handlePublish} />;
      case "reports":
      case "bookmarks":
      case "folders":
        return <ReportsPlugin reports={reports} onViewReport={handleViewReport} />;
      case "settings":
        return <SettingsPlugin />;
      default:
        return <ExcelPlugin onPublish={handlePublish} />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--bg)]">
      {activePlugin !== "view-report" && (
        <Ribbon 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen} 
        />
      )}
      <div className="flex flex-1 overflow-hidden">
        {activePlugin !== "view-report" && (
          <Sidebar 
            activePlugin={activePlugin} 
            onPluginChange={setActivePlugin} 
            isSidebarOpen={isSidebarOpen}
          />
        )}
        <main className="flex-1 overflow-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePlugin}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderPlugin()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
