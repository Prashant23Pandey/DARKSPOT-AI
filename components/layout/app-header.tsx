"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Plus, 
  Menu, 
  X, 
  Command, 
  Sparkles, 
  Database,
  Cpu,
  Clock,
  Radio
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "./sidebar";

export function AppHeader() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentTime, setCurrentTime] = React.useState("02:35:00 IST");

  React.useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) + " IST");
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full h-16 border-b-2 border-slate-900 bg-white px-4 sm:px-6 flex items-center justify-between gap-4 shadow-sm select-none">
        {/* Left: Mobile Toggle & Search */}
        <div className="flex items-center gap-3 flex-1 max-w-lg">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden h-9 w-9 p-0 text-slate-800 hover:bg-slate-100 border-2 border-slate-900 rounded-lg shadow-[2px_2px_0px_#0f172a]"
          >
            <Menu className="w-5 h-5 text-slate-900" />
          </Button>

          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search investigations, gaps, conflicts, claims..."
              className="h-10 w-full pl-9 pr-12 text-xs sm:text-sm bg-slate-50 border-2 border-slate-900 text-slate-900 placeholder:text-slate-400 rounded-xl font-medium shadow-[2px_2px_0px_#0f172a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <div className="hidden sm:flex items-center gap-0.5 absolute right-2.5 top-2.5 px-1.5 py-0.5 rounded border border-slate-400 bg-slate-200 text-[10px] text-slate-700 font-mono font-bold">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          </form>
        </div>

        {/* Right: Engine Status, Clock & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live System Clock Pill (Reference Screenshot Style) */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0fdf4] border-2 border-slate-900 text-[11px] font-mono font-bold text-[#15803d] shadow-[2px_2px_0px_#0f172a]">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{currentTime}</span>
          </div>

          {/* Engine Status Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#cffafe] border-2 border-slate-900 text-[11px] font-mono font-bold text-[#0e7490] shadow-[2px_2px_0px_#0f172a]">
            <Radio className="w-3 h-3 text-[#0e7490]" />
            <span>Sensors Online</span>
          </div>

          {/* Primary Action Button */}
          <Button
            asChild
            size="sm"
            className="h-9 px-3.5 text-xs bg-[#fde047] hover:bg-[#facc15] text-slate-950 font-black border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5"
          >
            <Link href="/research/new" className="flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-slate-950" />
              <span>New Investigation</span>
            </Link>
          </Button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-72 bg-white h-full shadow-2xl flex flex-col border-r-2 border-slate-900">
            <div className="flex items-center justify-between p-4 border-b-2 border-slate-900 bg-slate-50">
              <span className="text-sm font-bold font-display text-slate-900">Navigation</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-700 hover:text-black p-1 border border-slate-300 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
