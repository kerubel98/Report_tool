import * as React from "react";
import { ArrowLeft, Download, Share2, Printer, Calendar, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ReportEditor } from "../ReportEditor";
import { PublishedReport } from "../../types";

interface ReportViewPluginProps {
  report: PublishedReport;
  onBack: () => void;
}

export function ReportViewPlugin({ report, onBack }: ReportViewPluginProps) {
  return (
    <div className="h-full flex flex-col bg-[#f8f9fa]">
      <header className="bg-white border-b px-8 py-4 flex items-center justify-between shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">{report.title}</h2>
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100">Published</Badge>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3" />
              Published on {new Date(report.publishedAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="report" className="h-full flex flex-col">
          <div className="bg-white border-b px-8 shrink-0">
            <TabsList className="bg-transparent h-12 p-0 gap-8">
              <TabsTrigger 
                value="report" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none h-full px-0 text-sm font-medium"
              >
                Report View
              </TabsTrigger>
              <TabsTrigger 
                value="data" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none h-full px-0 text-sm font-medium"
              >
                Raw Data Source
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="report" className="h-full m-0 p-0">
              <ScrollArea className="h-full">
                <div className="p-12 max-w-5xl mx-auto">
                  <div className="bg-white shadow-xl border rounded-2xl p-12 min-h-[1000px]">
                    <div className="mb-12 border-b pb-8">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Report ID</p>
                          <p className="text-xs font-mono">{report.id}</p>
                        </div>
                      </div>
                      <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">{report.title}</h1>
                      <div className="flex items-center gap-4 text-xs text-slate-400 font-medium uppercase tracking-widest">
                        <span>Generated: {new Date(report.publishedAt).toLocaleDateString()}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span>Author: System Generated</span>
                      </div>
                    </div>

                    <ReportEditor 
                      components={report.components} 
                      tables={report.tables} 
                      readOnly={true} 
                    />

                    <div className="mt-20 pt-8 border-t text-center">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">End of Report</p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="data" className="h-full m-0 p-0">
              <div className="h-full flex flex-col p-8">
                <div className="bg-white border rounded-xl flex-1 flex flex-col overflow-hidden shadow-sm">
                  <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
                    <h3 className="text-sm font-bold">Data Preview ({report.data.length} records)</h3>
                    <Button variant="outline" size="xs">Download CSV</Button>
                  </div>
                  <ScrollArea className="flex-1">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          {report.headers.map((h, i) => (
                            <TableHead key={i} className="font-mono text-[10px] uppercase whitespace-nowrap">
                              {h}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {report.data.map((row, i) => (
                          <TableRow key={i}>
                            {row.map((cell: any, j: number) => (
                              <TableCell key={j} className="text-xs whitespace-nowrap">
                                {cell}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
