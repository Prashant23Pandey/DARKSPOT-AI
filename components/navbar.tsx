"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Radar, 
  Layers, 
  FileText, 
  ShieldAlert, 
  Terminal, 
  Activity, 
  Sparkles,
  Database
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavbarProps {
  engineMode?: "live_gemini" | "mock_blueprint" | null;
}

export function Navbar({ engineMode }: NavbarProps) {
  const pathname = usePathname();

  const links = [
    { label: "Intelligence Console", href: "/dashboard", icon: Radar },
    { label: "Evidence Cross-Exam", href: "/research/new", icon: Layers },
    { label: "Reports Archive", href: "/reports", icon: FileText },
    { label: "System Settings", href: "/settings", icon: Terminal },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-slate-900 bg-white/95 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        {/* Brand & Identity */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-display font-black text-lg tracking-tight text-slate-950 group-hover:text-[#ec4899] transition-colors">
              DARKSPOT
            </span>
            <span className="bg-[#ec4899] text-white border-2 border-slate-900 text-[10px] font-black px-2 py-0.5 rounded-lg shadow-[2px_2px_0px_#0f172a] font-display">
              AI
            </span>
            <span className="bg-[#fde047] text-slate-950 border-2 border-slate-900 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full shadow-[1.5px_1.5px_0px_#0f172a] uppercase tracking-wider hidden sm:inline-block">
              ONLINE
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-sm font-display font-bold">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                    isActive
                      ? "text-slate-950 bg-[#fde047] border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]"
                      : "text-slate-700 hover:text-slate-950 hover:bg-slate-100"
                  )}
                >
                  <Icon className="w-3.5 h-3.5 text-slate-950" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Status Indicators & Metadata */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hackathon Tag */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border-2 border-slate-900 text-[11px] font-mono font-bold text-slate-800 shadow-[2px_2px_0px_#0f172a]">
            <Sparkles className="w-3.5 h-3.5 text-[#ec4899]" />
            <span>Shinchan Hackathon 2026</span>
          </div>

          {/* Engine Status */}
          {engineMode === "live_gemini" ? (
            <Badge variant="cyan" className="gap-1 font-mono text-[11px] font-bold">
              <span className="h-2 w-2 rounded-full bg-cyan-600 animate-pulse" />
              Gemini 1.5 Live
            </Badge>
          ) : (
            <Badge variant="yellow" className="gap-1 font-mono text-[11px] font-bold">
              <span className="h-2 w-2 rounded-full bg-amber-600" />
              Blueprint Mock Mode
            </Badge>
          )}

          {/* Supabase Ready Pill */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg border-2 border-slate-900 bg-[#dcfce7] text-[10px] font-mono font-bold text-emerald-900 shadow-[1px_1px_0px_#0f172a]">
            <Database className="w-3 h-3 text-emerald-800" />
            Supabase Ready
          </div>
        </div>
      </div>
    </header>
  );
}
