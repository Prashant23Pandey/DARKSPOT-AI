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
    { label: "Intelligence Console", href: "/", icon: Radar },
    { label: "Evidence Cross-Exam", href: "/#evidence", icon: Layers },
    { label: "Verification Roadmap", href: "/#checklist", icon: ShieldAlert },
    { label: "Architecture & Schema", href: "/#architecture", icon: Terminal },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        {/* Brand & Identity */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-cyan-600 to-slate-900 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] transition-all duration-300">
              <Radar className="h-5 w-5 text-slate-950 font-bold" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-wider text-white flex items-center gap-1.5">
                DARKSPOT<span className="text-cyan-400">.AI</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-tight font-mono hidden sm:inline">
                Information Gap Detection
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                    isActive
                      ? "text-cyan-400 bg-slate-900 border border-slate-800"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/60"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Status Indicators & Metadata */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hackathon Tag */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-400">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Shinchan Hackathon 2026</span>
          </div>

          {/* Engine Status */}
          {engineMode === "live_gemini" ? (
            <Badge variant="cyan" className="gap-1 font-mono text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Gemini 1.5 Live
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1 font-mono text-[11px] border-slate-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Blueprint Mock Mode
            </Badge>
          )}

          {/* Supabase Ready Pill */}
          <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-950/30 text-[10px] font-mono text-emerald-400">
            <Database className="w-3 h-3" />
            Supabase Ready
          </div>
        </div>
      </div>
    </header>
  );
}
