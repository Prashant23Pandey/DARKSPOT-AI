"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Radar, 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  Settings, 
  ChevronRight,
  ExternalLink,
  Sparkles,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getStoredInvestigations } from "@/lib/store/investigations";

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export function Sidebar({ className, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [investigations, setInvestigations] = React.useState<Array<{ id: string; topic: string }>>([]);

  React.useEffect(() => {
    const list = getStoredInvestigations();
    setInvestigations(list.slice(0, 4).map((i) => ({ id: i.id, topic: i.topic })));
  }, [pathname]);

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "New Research", href: "/research/new", icon: PlusCircle, highlight: true },
    { label: "Executive Reports", href: "/reports", icon: FileText },
    { label: "Settings & Keys", href: "/settings", icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-white border-r-2 border-slate-900 text-slate-800 w-64 select-none shrink-0",
        className
      )}
    >
      {/* Brand Header — Styled like AEGIS AIR */}
      <div className="p-4 border-b-2 border-slate-900 bg-white">
        <Link
          href="/"
          onClick={onClose}
          className="flex flex-col group py-0.5"
        >
          <div className="flex items-center gap-2">
            <span className="font-black text-xl tracking-tight text-slate-950 font-display group-hover:text-[#ec4899] transition-colors">
              DARKSPOT
            </span>
            <span className="bg-[#ec4899] text-white border-2 border-slate-900 text-[10px] font-black px-2 py-0.5 rounded-lg shadow-[2px_2px_0px_#0f172a] font-display">
              AI
            </span>
            <span className="bg-[#fde047] text-slate-950 border-2 border-slate-900 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full shadow-[1.5px_1.5px_0px_#0f172a] uppercase tracking-wider">
              ONLINE
            </span>
          </div>
          <span className="text-[11px] text-slate-600 font-sans font-medium tracking-tight mt-1 leading-snug">
            Tactical Gap Detection & Intelligence Surveillance
          </span>
        </Link>
      </div>

      {/* Main Nav */}
      <div className="p-3 space-y-1.5">
        <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all",
                isActive
                  ? "bg-slate-900 text-white border-2 border-slate-900 shadow-[2px_2px_0px_#fde047]"
                  : "text-slate-700 hover:text-slate-950 hover:bg-slate-100 border-2 border-transparent",
                item.highlight && !isActive && "text-[#db2777] hover:text-[#be185d]"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={cn("w-4 h-4", isActive ? "text-[#fde047]" : item.highlight ? "text-[#ec4899]" : "text-slate-600")} />
                <span>{item.label}</span>
              </div>
              {item.highlight && !isActive && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#fce7f3] text-[#be185d] border border-[#f43f5e] text-[9px] font-black">
                  NEW
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Recent Investigations List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <div className="flex items-center justify-between px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
          <span>Recent Dossiers</span>
          <Link href="/reports" className="text-slate-500 hover:text-slate-900 underline font-semibold">View All</Link>
        </div>

        {investigations.map((inv) => {
          const isActive = pathname === `/research/${inv.id}` || pathname === `/evidence/${inv.id}`;
          return (
            <Link
              key={inv.id}
              href={`/research/${inv.id}`}
              onClick={onClose}
              className={cn(
                "group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all truncate",
                isActive
                  ? "bg-[#fef08a] text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-100 border border-transparent"
              )}
            >
              <span className="truncate pr-2">{inv.topic}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 shrink-0" />
            </Link>
          );
        })}
      </div>

      {/* Footer Info: Hackathon & Live Status */}
      <div className="p-3 border-t-2 border-slate-900 space-y-2 bg-slate-50">
        <div className="p-2.5 rounded-xl bg-white border-2 border-slate-900 text-[11px] space-y-1 shadow-[2px_2px_0px_#0f172a]">
          <div className="flex items-center justify-between text-slate-700 font-mono font-bold text-[10px]">
            <span>Shinchan 2026</span>
            <span className="text-[#15803d] flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Ready
            </span>
          </div>
          <p className="text-slate-500 text-[10px] leading-tight font-sans">
            AI-Assisted Information Gap & Contradiction Detection Engine.
          </p>
        </div>

        <Link
          href="/"
          className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-600 hover:text-slate-950 transition-colors"
        >
          <span>Landing Overview</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
