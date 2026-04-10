import { useState, useEffect } from "react";
import { FileText, Calendar, Download, ExternalLink, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ReportEditor } from "../ReportEditor";
import { PublishedReport } from "../../types";

interface ReportsPluginProps {
  reports: PublishedReport[];
  onViewReport: (report: PublishedReport) => void;
}

export function ReportsPlugin({ reports, onViewReport }: ReportsPluginProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<PublishedReport | null>(null);

  const filteredReports = reports.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Published Reports</h2>
          <p className="text-muted-foreground">Access and download reports shared by the team.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search reports..." 
              className="pl-8" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {filteredReports.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg bg-muted/10">
          <FileText className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">No reports found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <Card key={report.id} className="group hover:border-primary/50 transition-all">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="mb-2">Report</Badge>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(report.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {report.title}
                </CardTitle>
                <CardDescription>
                  {report.data.length} records • {report.attachments.length} attachments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger
                        render={
                          <Button variant="secondary" size="sm" className="flex-1 gap-2">
                            <ExternalLink className="w-3 h-3" />
                            Quick View
                          </Button>
                        }
                      />
                      <DialogContent className="max-w-5xl max-h-[90vh]">
                        <DialogHeader>
                          <DialogTitle>{report.title}</DialogTitle>
                        </DialogHeader>
                        <Tabs defaultValue="report" className="w-full">
                          <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="report">Report View</TabsTrigger>
                            <TabsTrigger value="data">Raw Data</TabsTrigger>
                          </TabsList>
                          <TabsContent value="report">
                            <ScrollArea className="h-[600px] border rounded-md p-6 bg-[#f8f9fa]">
                              <div className="max-w-4xl mx-auto bg-white shadow-sm border rounded-xl p-8 min-h-full">
                                <div className="mb-8 border-b pb-4">
                                  <h1 className="text-3xl font-black tracking-tight text-slate-900">{report.title}</h1>
                                  <p className="text-xs text-slate-400 mt-1 font-medium uppercase tracking-widest">
                                    Published on {new Date(report.publishedAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <ReportEditor 
                                  components={report.components} 
                                  tables={report.tables} 
                                  readOnly={true} 
                                />
                              </div>
                            </ScrollArea>
                          </TabsContent>
                          <TabsContent value="data">
                            <div className="space-y-4">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>Published: {new Date(report.publishedAt).toLocaleString()}</span>
                                <span>Rows: {report.data.length}</span>
                              </div>
                              <ScrollArea className="h-[500px] border rounded-md">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      {report.headers.map((h: string, i: number) => (
                                        <TableHead key={i} className="bg-muted/50 font-mono text-[10px] uppercase">
                                          {h}
                                        </TableHead>
                                      ))}
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {report.data.map((row: any, i: number) => (
                                      <TableRow key={i}>
                                        {row.map((cell: any, j: number) => (
                                          <TableCell key={j} className="text-xs">
                                            {cell}
                                          </TableCell>
                                        ))}
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </ScrollArea>
                            </div>
                          </TabsContent>
                        </Tabs>
                        {report.attachments.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <h4 className="text-sm font-semibold">Attachments</h4>
                            <div className="flex flex-wrap gap-2">
                              {report.attachments.map((att: string, i: number) => (
                                <Badge key={i} variant="secondary" className="gap-1 py-1">
                                  <Download className="w-3 h-3" />
                                  {att}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                      onClick={() => onViewReport(report)}
                    >
                      <ExternalLink className="w-3 h-3" />
                      Full Page
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full gap-2 text-muted-foreground">
                    <Download className="w-3 h-3" />
                    Export as PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
