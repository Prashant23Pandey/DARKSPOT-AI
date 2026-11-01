import * as React from "react";
import { Radar, ShieldAlert, Cpu } from "lucide-react";

interface LoadingStateProps {
  topic?: string;
  message?: string;
}

export function LoadingState({
  topic,
  message = "Analyzing multi-source dossier…",
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0f172a] relative overflow-hidden">
      {/* Neo Cybernetic Radar Center */}
      <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-slate-900 bg-[#fde047] shadow-[3px_3px_0px_#0f172a]">
        <Radar className="h-10 w-10 text-slate-950 animate-spin" style={{ animationDuration: "5s" }} />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ec4899] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-[#ec4899] border border-slate-900"></span>
        </span>
      </div>

      <div className="space-y-2 max-w-md relative z-10">
        <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-[#cffafe] border-2 border-slate-900 text-xs font-mono font-bold text-slate-950 shadow-[2px_2px_0px_#0f172a] uppercase">
          <Cpu className="w-3.5 h-3.5 animate-pulse text-[#ec4899]" />
          Darkspot Inference Engine Active
        </div>
        <h4 className="text-xl font-display font-black text-slate-950 tracking-tight">
          {message}
        </h4>
        {topic && (
          <p className="text-xs text-slate-700 font-mono font-bold truncate px-4 py-1.5 rounded-lg bg-slate-50 border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
            Dossier: &quot;{topic}&quot;
          </p>
        )}
      </div>

      {/* Scanning status step indicators */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg text-left text-xs font-mono font-bold">
        <div className="p-3 rounded-xl border-2 border-slate-900 bg-[#ede9fe] flex items-center gap-2 shadow-[2px_2px_0px_#0f172a]">
          <span className="h-2.5 w-2.5 rounded-full bg-purple-600 animate-pulse" />
          <span className="text-purple-950">Extracting Evidence</span>
        </div>
        <div className="p-3 rounded-xl border-2 border-slate-900 bg-[#fefce8] flex items-center gap-2 shadow-[2px_2px_0px_#0f172a]">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-600 animate-pulse" />
          <span className="text-amber-950">Detecting Conflicts</span>
        </div>
        <div className="p-3 rounded-xl border-2 border-slate-900 bg-[#fff1f2] flex items-center gap-2 shadow-[2px_2px_0px_#0f172a]">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-600 animate-pulse" />
          <span className="text-rose-950">Auditing Dark Spots</span>
        </div>
      </div>
    </div>
  );
}
