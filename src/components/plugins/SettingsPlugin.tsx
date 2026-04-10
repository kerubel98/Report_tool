import { useState } from "react";
import { Settings, Palette, Type, Layout, Save, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { toast } from "sonner";

export function SettingsPlugin() {
  const [templates, setTemplates] = useState([
    { id: "1", name: "Standard Report", primaryColor: "#141414", fontSize: "14px" },
    { id: "2", name: "Executive Summary", primaryColor: "#2563eb", fontSize: "12px" },
  ]);

  const [newTemplateName, setNewTemplateName] = useState("");

  const addTemplate = () => {
    if (!newTemplateName) return;
    const newTpl = {
      id: Date.now().toString(),
      name: newTemplateName,
      primaryColor: "#141414",
      fontSize: "14px",
    };
    setTemplates([...templates, newTpl]);
    setNewTemplateName("");
    toast.success("Template created");
  };

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    toast.info("Template removed");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Report Templates</h2>
        <p className="text-muted-foreground">Customize how your published reports look and feel.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">My Templates</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors text-left border-b last:border-0"
                  >
                    <span className="text-sm font-medium">{t.name}</span>
                    <Trash2 
                      className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors" 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTemplate(t.id);
                      }}
                    />
                  </button>
                ))}
              </div>
              <div className="p-4 space-y-2">
                <Input 
                  placeholder="New template name..." 
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  className="text-xs h-8"
                />
                <Button onClick={addTemplate} size="sm" className="w-full gap-2 text-xs h-8">
                  <Plus className="w-3 h-3" />
                  Add Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Configuration</CardTitle>
              <CardDescription>Adjust visual parameters for the selected template.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Primary Color
                  </Label>
                  <div className="flex gap-2">
                    <Input type="color" className="w-12 h-10 p-1" defaultValue="#141414" />
                    <Input defaultValue="#141414" className="font-mono" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Base Font Size
                  </Label>
                  <Input defaultValue="14px" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <Layout className="w-4 h-4" />
                  Layout Sections
                </Label>
                <div className="space-y-2">
                  {["Header Summary", "Data Table", "Attachments List", "Footer Metadata"].map((section) => (
                    <div key={section} className="flex items-center justify-between p-3 border rounded-md bg-muted/20">
                      <span className="text-sm">{section}</span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-7 text-[10px] uppercase">Hide</Button>
                        <Button variant="ghost" size="sm" className="h-7 text-[10px] uppercase">Move</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full gap-2" onClick={() => toast.success("Settings saved")}>
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
