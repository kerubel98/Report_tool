import * as React from "react";
import { useState, useMemo } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Trash2, Move, Settings2, Check } from "lucide-react";
import { ReportComponent, TableSource } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";

interface ReportEditorProps {
  components: ReportComponent[];
  tables: TableSource[];
  onUpdateComponents?: (components: ReportComponent[]) => void;
  readOnly?: boolean;
}

export function ReportEditor({ components, tables, onUpdateComponents, readOnly }: ReportEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const removeComponent = (id: string) => {
    onUpdateComponents?.(components.filter(c => c.id !== id));
  };

  const updateComponentConfig = (id: string, newConfig: Partial<ReportComponent["config"]>) => {
    onUpdateComponents?.(components.map(c => 
      c.id === id ? { ...c, config: { ...c.config, ...newConfig } } : c
    ));
  };

  const toggleColumn = (compId: string, colName: string, currentVisible: string[] = []) => {
    const next = currentVisible.includes(colName)
      ? currentVisible.filter(c => c !== colName)
      : [...currentVisible, colName];
    updateComponentConfig(compId, { visibleColumns: next });
  };

  const renderChart = (comp: ReportComponent, table: TableSource) => {
    const data = table.data.slice(0, 10);
    const xKey = comp.config.xAxisKey || table.columns[0]?.name;
    const yKey = comp.config.yAxisKey || table.columns[1]?.name || table.columns[0]?.name;
    const type = comp.config.chartType || "bar";

    if (type === "line") {
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
          <XAxis dataKey={xKey} fontSize={10} tickLine={false} axisLine={false} />
          <YAxis fontSize={10} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ backgroundColor: "white", fontSize: "10px" }} />
          <Line type="monotone" dataKey={yKey} stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      );
    }

    if (type === "pie") {
      const COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#10b981"];
      return (
        <PieChart>
          <Pie
            data={data}
            dataKey={yKey}
            nameKey={xKey}
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={{ fontSize: 10 }}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      );
    }

    return (
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
        <XAxis dataKey={xKey} fontSize={10} tickLine={false} axisLine={false} />
        <YAxis fontSize={10} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ backgroundColor: "white", fontSize: "10px" }} />
        <Bar dataKey={yKey} fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    );
  };

  return (
    <div className={cn("space-y-6 p-4 rounded-lg min-h-[400px]", !readOnly && "bg-muted/30 border border-dashed border-muted-foreground/20")}>
      {components.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <p className="text-sm italic">Your report is empty. Add tables or charts from the sidebar.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6">
        {components.map((comp) => {
          const table = tables.find(t => t.id === comp.tableId);
          if (!table && comp.type !== "text") return null;

          const visibleCols = comp.config.visibleColumns || table?.columns.map(c => c.name) || [];

          return (
            <Card key={comp.id} className={cn("group relative overflow-hidden", readOnly && "border-none shadow-none")}>
              <CardHeader className={cn("py-3 px-4 bg-muted/50 flex flex-row items-center justify-between space-y-0", readOnly && "bg-transparent border-b")}>
                <CardTitle className="text-sm font-bold uppercase tracking-wider opacity-70">
                  {comp.title}
                </CardTitle>
                {!readOnly && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Dialog open={editingId === comp.id} onOpenChange={(open) => setEditingId(open ? comp.id : null)}>
                      <DialogTrigger render={<Button variant="ghost" size="icon-xs"><Settings2 className="w-3 h-3" /></Button>} />
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Component Settings</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input 
                              value={comp.title} 
                              onChange={(e) => onUpdateComponents?.(components.map(c => c.id === comp.id ? { ...c, title: e.target.value } : c))} 
                            />
                          </div>

                          {comp.type === "text" && (
                            <div className="space-y-2">
                              <Label>Content</Label>
                              <textarea 
                                className="w-full min-h-[100px] p-2 text-sm border rounded-md"
                                value={comp.config.content || ""}
                                onChange={(e) => updateComponentConfig(comp.id, { content: e.target.value })}
                              />
                            </div>
                          )}

                          {comp.type === "table" && table && (
                            <div className="space-y-2">
                              <Label>Visible Columns</Label>
                              <div className="flex flex-wrap gap-2">
                                {table.columns.map(col => (
                                  <Badge 
                                    key={col.id} 
                                    variant={visibleCols.includes(col.name) ? "default" : "outline"}
                                    className="cursor-pointer gap-1"
                                    onClick={() => toggleColumn(comp.id, col.name, visibleCols)}
                                  >
                                    {visibleCols.includes(col.name) && <Check className="w-3 h-3" />}
                                    {col.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {comp.type === "chart" && table && (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Chart Type</Label>
                                <div className="flex gap-2">
                                  {["bar", "line", "pie"].map((t) => (
                                    <Button 
                                      key={t}
                                      variant={comp.config.chartType === t || (!comp.config.chartType && t === "bar") ? "default" : "outline"}
                                      size="sm"
                                      className="flex-1 capitalize"
                                      onClick={() => updateComponentConfig(comp.id, { chartType: t as any })}
                                    >
                                      {t}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>X-Axis (Label)</Label>
                                  <select 
                                    className="w-full p-2 text-xs border rounded-md"
                                    value={comp.config.xAxisKey || table.columns[0]?.name}
                                    onChange={(e) => updateComponentConfig(comp.id, { xAxisKey: e.target.value })}
                                  >
                                    {table.columns.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                  </select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Y-Axis (Value)</Label>
                                  <select 
                                    className="w-full p-2 text-xs border rounded-md"
                                    value={comp.config.yAxisKey || table.columns[1]?.name}
                                    onChange={(e) => updateComponentConfig(comp.id, { yAxisKey: e.target.value })}
                                  >
                                    {table.columns.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                  </select>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <Button onClick={() => setEditingId(null)}>Done</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="icon-xs" className="text-destructive" onClick={() => removeComponent(comp.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon-xs" className="cursor-move">
                      <Move className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-4">
                {comp.type === "table" && table ? (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          {table.columns.filter(c => visibleCols.includes(c.name)).map(col => (
                            <TableHead key={col.id} className="text-[10px] uppercase font-mono">
                              {col.name}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {table.data.slice(0, 5).map((row, i) => (
                          <TableRow key={i}>
                            {table.columns.filter(c => visibleCols.includes(c.name)).map(col => (
                              <TableCell key={col.id} className="text-xs">
                                {row[col.name]}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : comp.type === "chart" && table ? (
                  <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      {renderChart(comp, table)}
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="min-h-[100px] p-2 text-sm text-foreground/80 whitespace-pre-wrap">
                    {comp.config.content || "Click settings to add text content..."}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
