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
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-cyan-500/20 bg-slate-950/70 backdrop-blur-md relative overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.1)]">
      {/* Background Radar Grid Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08)_0,transparent_70%)] pointer-events-none" />

      {/* Cybernetic Radar Center */}
      <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-cyan-500/40 bg-slate-900/80 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
        <Radar className="h-10 w-10 text-cyan-400 animate-spin" style={{ animationDuration: "6s" }} />
        <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ping" />
      </div>

      <div className="space-y-2 max-w-md relative z-10">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-400 tracking-widest uppercase">
          <Cpu className="w-3.5 h-3.5 animate-pulse" />
          Darkspot Inference Engine Active
        </div>
        <h4 className="text-lg font-semibold text-white tracking-tight">
          {message}
        </h4>
        {topic && (
          <p className="text-xs text-slate-400 font-mono truncate px-4 py-1 rounded bg-slate-900/80 border border-slate-800">
            Dossier: &quot;{topic}&quot;
          </p>
        )}
      </div>

      {/* Scanning status step indicators */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg text-left text-xs font-mono">
        <div className="p-2.5 rounded-lg border border-slate-800/80 bg-slate-900/50 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-slate-300">Extracting Evidence</span>
        </div>
        <div className="p-2.5 rounded-lg border border-slate-800/80 bg-slate-900/50 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-slate-300">Detecting Conflicts</span>
        </div>
        <div className="p-2.5 rounded-lg border border-slate-800/80 bg-slate-900/50 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
          <span className="text-slate-300">Auditing Dark Spots</span>
        </div>
      </div>
    </div>
  );
}
