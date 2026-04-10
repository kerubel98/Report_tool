import * as React from "react";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { 
  FileSpreadsheet, 
  Upload, 
  FileUp, 
  Send, 
  Plus, 
  Trash2, 
  Database, 
  Layout, 
  BarChart3, 
  Table as TableIcon,
  Save,
  ChevronRight,
  Settings2,
  Calendar,
  Type,
  MoreHorizontal,
  PlusCircle,
  GitMerge,
  Link2
} from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { cn } from "../../lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../ui/dialog";
import { TableSource, ReportTemplate, ReportComponent, Column } from "../../types";
import { ReportEditor } from "../ReportEditor";

interface ExcelPluginProps {
  onPublish?: (report: any) => void;
}

export function ExcelPlugin({ onPublish }: ExcelPluginProps) {
  const [tables, setTables] = useState<TableSource[]>([]);
  const [activeTableId, setActiveTableId] = useState<string | null>(null);
  const [reportTitle, setReportTitle] = useState("Untitled Report");
  const [template, setTemplate] = useState<ReportTemplate>({
    id: "new-tpl",
    name: "New Report Template",
    tableIds: [],
    components: [],
    style: { primaryColor: "#141414", fontSize: "14px" }
  });

  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [joinConfig, setJoinConfig] = useState({
    tableA: "",
    tableB: "",
    keyA: "",
    keyB: ""
  });

  const activeTable = tables.find(t => t.id === activeTableId);

  const handleJoinTables = () => {
    const tA = tables.find(t => t.id === joinConfig.tableA);
    const tB = tables.find(t => t.id === joinConfig.tableB);

    if (!tA || !tB || !joinConfig.keyA || !joinConfig.keyB) {
      toast.error("Please select both tables and join keys");
      return;
    }

    // Simple Inner Join
    const joinedData: any[] = [];
    tA.data.forEach(rowA => {
      const valA = rowA[joinConfig.keyA];
      const matchB = tB.data.find(rowB => rowB[joinConfig.keyB] === valA);
      if (matchB) {
        joinedData.push({ ...rowA, ...matchB });
      }
    });

    if (joinedData.length === 0) {
      toast.error("No matching records found for the selected keys");
      return;
    }

    const combinedColumns: Column[] = [...tA.columns];
    tB.columns.forEach(colB => {
      if (!combinedColumns.find(c => c.name === colB.name)) {
        combinedColumns.push(colB);
      }
    });

    const newTable: TableSource = {
      id: `joined-${Date.now()}`,
      name: `Joined: ${tA.name} + ${tB.name}`,
      columns: combinedColumns,
      data: joinedData
    };

    setTables(prev => [...prev, newTable]);
    setActiveTableId(newTable.id);
    setIsJoinDialogOpen(false);
    toast.success("Tables joined successfully!");
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const bstr = e.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const json = XLSX.utils.sheet_to_json(ws);
      
      if (json.length > 0) {
        const firstRow = json[0] as any;
        const columns: Column[] = Object.keys(firstRow).map(key => ({
          id: Math.random().toString(36).substr(2, 9),
          name: key,
          type: typeof firstRow[key] === "number" ? "number" : "string"
        }));

        const newTable: TableSource = {
          id: Date.now().toString(),
          name: file.name.replace(/\.[^/.]+$/, ""),
          columns,
          data: json
        };

        setTables(prev => [...prev, newTable]);
        setActiveTableId(newTable.id);
        toast.success(`Table "${newTable.name}" created from Excel`);
      }
    };
    reader.readAsBinaryString(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
  } as any);

  const addComponent = (type: "table" | "chart" | "text") => {
    if (type !== "text" && !activeTableId) {
      toast.error("Select a data table first");
      return;
    }

    const newComp: ReportComponent = {
      id: Date.now().toString(),
      type,
      title: type === "text" ? "Text Block" : `${type === "table" ? "Table" : "Chart"} - ${activeTable?.name}`,
      tableId: type === "text" ? undefined : activeTableId!,
      config: type === "text" ? { content: "" } : {}
    };

    setTemplate(prev => ({
      ...prev,
      components: [...prev.components, newComp]
    }));
    toast.success(`Added ${type} to report`);
  };

  const handlePublish = async () => {
    if (!reportTitle) {
      toast.error("Please enter a report title");
      return;
    }

    if (template.components.length === 0) {
      toast.error("Add at least one component to the report");
      return;
    }

    const newReport = {
      id: Date.now().toString(),
      title: reportTitle,
      templateId: template.id,
      publishedAt: new Date().toISOString(),
      headers: tables.length > 0 ? tables[0].columns.map(c => c.name) : [],
      data: tables.length > 0 ? tables[0].data.map(row => Object.values(row)) : [],
      attachments: tables.map(t => t.name + ".xlsx"),
      isBookmarked: false,
      components: template.components,
      tables: tables
    };

    if (onPublish) {
      onPublish(newReport);
      toast.success(`Report "${reportTitle}" published successfully!`);
    } else {
      toast.error("Publishing system not initialized");
    }
  };

  const removeTable = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTables(prev => prev.filter(t => t.id !== id));
    if (activeTableId === id) setActiveTableId(null);
    toast.info("Data source removed");
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <header className="px-6 py-4 border-b flex justify-between items-center bg-white shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <Layout className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight">Report Designer</h2>
            <p className="text-[10px] text-muted-foreground">Build and publish custom data reports</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs gap-2">
            <Save className="w-3.5 h-3.5" />
            Save Draft
          </Button>
          <Button onClick={handlePublish} size="sm" className="h-8 text-xs gap-2 bg-blue-600 hover:bg-blue-700">
            <Send className="w-3.5 h-3.5" />
            Publish Report
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex">
        {/* Left Sidebar: Data Sources */}
        <div className="w-64 border-r bg-muted/5 flex flex-col shrink-0">
          <div className="p-4 border-b bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Data Sources</h3>
              {tables.length >= 2 && (
                <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
                  <DialogTrigger render={
                    <Button variant="ghost" size="icon-xs" className="text-blue-600 hover:bg-blue-50">
                      <GitMerge className="w-3.5 h-3.5" />
                    </Button>
                  } />
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Relate Data Sources</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Table A</Label>
                          <select 
                            className="w-full p-2 text-xs border rounded-md"
                            value={joinConfig.tableA}
                            onChange={(e) => setJoinConfig(prev => ({ ...prev, tableA: e.target.value, keyA: "" }))}
                          >
                            <option value="">Select Table</option>
                            {tables.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Table B</Label>
                          <select 
                            className="w-full p-2 text-xs border rounded-md"
                            value={joinConfig.tableB}
                            onChange={(e) => setJoinConfig(prev => ({ ...prev, tableB: e.target.value, keyB: "" }))}
                          >
                            <option value="">Select Table</option>
                            {tables.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Join Key (A)</Label>
                          <select 
                            className="w-full p-2 text-xs border rounded-md"
                            value={joinConfig.keyA}
                            onChange={(e) => setJoinConfig(prev => ({ ...prev, keyA: e.target.value }))}
                            disabled={!joinConfig.tableA}
                          >
                            <option value="">Select Key</option>
                            {tables.find(t => t.id === joinConfig.tableA)?.columns.map(c => (
                              <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Join Key (B)</Label>
                          <select 
                            className="w-full p-2 text-xs border rounded-md"
                            value={joinConfig.keyB}
                            onChange={(e) => setJoinConfig(prev => ({ ...prev, keyB: e.target.value }))}
                            disabled={!joinConfig.tableB}
                          >
                            <option value="">Select Key</option>
                            {tables.find(t => t.id === joinConfig.tableB)?.columns.map(c => (
                              <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="p-3 bg-blue-50 rounded-md border border-blue-100 flex items-start gap-2">
                        <Link2 className="w-4 h-4 text-blue-500 mt-0.5" />
                        <p className="text-[10px] text-blue-700">
                          This will perform an <strong>Inner Join</strong>. Only records with matching keys in both tables will be included in the new combined table.
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsJoinDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleJoinTables}>Create Combined Table</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <div 
              {...getRootProps()} 
              className={cn(
                "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all",
                isDragActive ? "bg-blue-50 border-blue-500" : "border-muted-foreground/20 hover:border-blue-500/50"
              )}
            >
              <input {...getInputProps()} />
              <Upload className="w-4 h-4 mx-auto text-muted-foreground mb-2" />
              <p className="text-[10px] text-muted-foreground font-medium">Drop Excel or Click</p>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {tables.map(table => (
                <div
                  key={table.id}
                  onClick={() => setActiveTableId(table.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-colors group cursor-pointer",
                    activeTableId === table.id ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-muted"
                  )}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setActiveTableId(table.id);
                    }
                  }}
                >
                  <Database className={cn("w-3.5 h-3.5", activeTableId === table.id ? "text-blue-600" : "text-muted-foreground")} />
                  <span className="truncate flex-1 text-left">{table.name}</span>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-[8px] h-4 px-1 opacity-50">
                      {table.data.length}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="icon-xs" 
                      className="opacity-0 group-hover:opacity-100 h-4 w-4 text-destructive"
                      onClick={(e) => removeTable(table.id, e)}
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </Button>
                  </div>
                </div>
              ))}
              {tables.length === 0 && (
                <div className="p-4 text-center">
                  <p className="text-[10px] text-muted-foreground italic">No tables imported yet</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 bg-[#f8f9fa] overflow-auto flex flex-col">
          {/* Canvas Toolbar */}
          <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
              <Input 
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="border-none bg-transparent text-lg font-bold p-0 h-auto focus-visible:ring-0 placeholder:opacity-30"
                placeholder="Enter report title..."
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs gap-2 opacity-50">
                <Calendar className="w-3.5 h-3.5" />
                Filter Date
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger className={cn(buttonVariants({ size: "sm" }), "h-8 text-xs gap-2 bg-black hover:bg-black/90 text-white")}>
                  <PlusCircle className="w-3.5 h-3.5" />
                  Property
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-[10px] uppercase font-bold tracking-widest opacity-50">Add Component</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => addComponent("table")} className="gap-2 text-xs">
                      <TableIcon className="w-4 h-4 text-blue-500" />
                      Data Table
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addComponent("chart")} className="gap-2 text-xs">
                      <BarChart3 className="w-4 h-4 text-purple-500" />
                      Visual Chart
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addComponent("text")} className="gap-2 text-xs">
                      <Type className="w-4 h-4 text-amber-500" />
                      Text Block
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Canvas Content */}
          <div className="p-12 max-w-5xl mx-auto w-full">
            <div className="bg-white shadow-sm border rounded-xl min-h-[800px] p-8">
              <div className="mb-8 border-b pb-4 flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-900">{reportTitle}</h1>
                  <p className="text-xs text-slate-400 mt-1 font-medium uppercase tracking-widest">
                    Generated on {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-[10px] border-blue-200 text-blue-600 bg-blue-50">
                    {template.components.length} Components
                  </Badge>
                </div>
              </div>

              <ReportEditor 
                components={template.components} 
                tables={tables} 
                onUpdateComponents={(comps) => setTemplate(prev => ({ ...prev, components: comps }))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
