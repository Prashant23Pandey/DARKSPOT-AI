"use client";

import * as React from "react";
import { Database, HardDrive, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getRepositoryStatus, type RepositoryStatus } from "@/lib/repository";

export function PersistenceStatusBanner() {
  const [status, setStatus] = React.useState<RepositoryStatus | null>(null);

  React.useEffect(() => {
    setStatus(getRepositoryStatus());
  }, []);

  if (!status) return null;

  return (
    <div
      className={`p-4 rounded-2xl border-2 border-slate-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[3px_3px_0px_#0f172a] ${
        status.mode === "supabase"
          ? "bg-[#dcfce7] text-[#14532d]"
          : "bg-[#fef08a] text-[#713f12]"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-white border-2 border-slate-900 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#0f172a]">
          {status.mode === "supabase" ? (
            <Database className="w-5 h-5 text-emerald-700" />
          ) : (
            <HardDrive className="w-5 h-5 text-amber-800" />
          )}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-extrabold text-slate-950 font-display text-sm">
              {status.mode === "supabase" ? "Supabase Cloud Database Connected" : "Local Demonstration Mode Active"}
            </span>
            <Badge
              variant={status.mode === "supabase" ? "verified" : "yellow"}
              className="text-[10px] py-0.5 font-mono"
            >
              {status.mode === "supabase" ? "PostgreSQL Synced" : "Browser Persistence"}
            </Badge>
          </div>
          <p className="text-xs text-slate-800 font-medium mt-0.5 leading-relaxed font-sans">
            {status.message}
          </p>
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-2">
        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-900 text-[10px] font-mono font-bold text-slate-900 shadow-[1px_1px_0px_#0f172a]">
          Shinchan Online Hackathon 2026
        </span>
      </div>
    </div>
  );
}
