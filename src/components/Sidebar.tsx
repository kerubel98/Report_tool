import * as React from "react";
import { 
  FileText, 
  Settings, 
  Layers, 
  FolderPlus, 
  Plus, 
  Bookmark, 
  ChevronRight, 
  MoreVertical,
  Edit3,
  Folder
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

interface SidebarProps {
  activePlugin: string;
  onPluginChange: (id: string) => void;
  isSidebarOpen: boolean;
}

export function Sidebar({ activePlugin, onPluginChange, isSidebarOpen }: SidebarProps) {
  if (!isSidebarOpen) return null;

  const templates = [
    { id: "tpl-1", name: "Monthly Sales" },
    { id: "tpl-2", name: "Inventory Audit" },
    { id: "tpl-3", name: "User Growth" },
  ];

  return (
    <aside className="w-72 bg-[var(--sidebar-bg)] text-[var(--sidebar-ink)] flex flex-col border-r border-white/10">
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Templates</h2>
          <Button variant="ghost" size="icon-xs" className="text-white/40 hover:text-white">
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        
        <div className="space-y-0.5">
          {templates.map((tpl) => (
            <div key={tpl.id} className="group flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-white/5 cursor-pointer transition-colors">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="text-xs font-medium truncate">{tpl.name}</span>
              </div>
              <Button variant="ghost" size="icon-xs" className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-white">
                <Edit3 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-white/5" />

      <ScrollArea className="flex-1 px-2 py-4">
        <div className="space-y-4">
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 text-white/70 hover:text-white hover:bg-white/5"
              onClick={() => onPluginChange("folders")}
            >
              <Folder className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-medium">Folders</span>
              <ChevronRight className="w-3 h-3 ml-auto opacity-30" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 text-white/70 hover:text-white hover:bg-white/5"
              onClick={() => onPluginChange("create-report")}
            >
              <Plus className="w-4 h-4 text-green-400" />
              <span className="text-xs font-medium">Create New Report</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 text-white/70 hover:text-white hover:bg-white/5"
              onClick={() => onPluginChange("bookmarks")}
            >
              <Bookmark className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-medium">Bookmarks</span>
            </Button>
          </div>

          <Separator className="bg-white/5" />

          <div className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Recent Reports</h3>
            <div className="px-3 py-2 text-[10px] text-white/30 italic">No recent reports</div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-white/5">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-white/50 hover:text-white hover:bg-white/5"
          onClick={() => onPluginChange("settings")}
        >
          <Settings className="w-4 h-4" />
          <span className="text-xs font-medium">Workspace Settings</span>
        </Button>
      </div>
    </aside>
  );
}
