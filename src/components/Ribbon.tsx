import * as React from "react";
import { FileText, Grid, Bell, User, Search, HelpCircle, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

interface RibbonProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export function Ribbon({ onToggleSidebar, isSidebarOpen }: RibbonProps) {
  return (
    <div className="w-14 bg-[#0a0a0a] border-r border-white/10 flex flex-col items-center py-4 gap-6 shrink-0 z-50">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="text-white/70 hover:text-white hover:bg-white/10"
      >
        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      <div className="flex flex-col items-center gap-4 w-full">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "text-white/50 hover:text-white hover:bg-white/10 w-10 h-10",
            "bg-white/5 text-white"
          )}
        >
          <FileText className="w-5 h-5" />
        </Button>
        
        <div className="w-8 h-[1px] bg-white/10" />
        
        <Button variant="ghost" size="icon" className="text-white/50 hover:text-white w-10 h-10">
          <Grid className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white/50 hover:text-white w-10 h-10">
          <Search className="w-5 h-5" />
        </Button>
      </div>

      <div className="mt-auto flex flex-col items-center gap-4 w-full">
        <Button variant="ghost" size="icon" className="text-white/50 hover:text-white w-10 h-10 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0a0a0a]" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white/50 hover:text-white w-10 h-10">
          <HelpCircle className="w-5 h-5" />
        </Button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 cursor-pointer hover:ring-2 hover:ring-white/20 transition-all" />
      </div>
    </div>
  );
}
