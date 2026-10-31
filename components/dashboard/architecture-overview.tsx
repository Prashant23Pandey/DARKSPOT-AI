"use client";

import * as React from "react";
import { Terminal, Database, Cpu, ShieldCheck, GitFork, ArrowDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ArchitectureOverview() {
  return (
    <Card id="architecture" className="border-slate-800 bg-slate-950/70 backdrop-blur-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <CardTitle className="text-lg font-bold">
                DARKSPOT AI — Technical Architecture & Pipeline
              </CardTitle>
            </div>
            <CardDescription>
              Production modular blueprint designed for Shinchan Online Hackathon 2026.
            </CardDescription>
          </div>
          <Badge variant="cyan" className="font-mono text-xs">
            Phase 1 Foundation
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Pipeline Flow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
          {/* Step 1 */}
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
            <div className="flex items-center justify-between text-cyan-400 font-bold">
              <span>01. Ingestion</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800">lib/extraction</span>
            </div>
            <p className="text-slate-300 font-sans leading-relaxed">
              Normalizes URLs & raw excerpts. Strips HTML DOM, checks word counts, and isolates temporal headers.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
            <div className="flex items-center justify-between text-amber-400 font-bold">
              <span>02. Cross-Exam</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 border border-amber-800">lib/analysis</span>
            </div>
            <p className="text-slate-300 font-sans leading-relaxed">
              Gemini 1.5 JSON Schema mode cross-references claims, contradictions, omissions, and temporal cycles.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
            <div className="flex items-center justify-between text-rose-400 font-bold">
              <span>03. Dark Spot Audit</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 border border-rose-800">lib/validation</span>
            </div>
            <p className="text-slate-300 font-sans leading-relaxed">
              Strict Zod schemas validate JSON payloads and computes the Dark Spot Risk Index & consensus scores.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
            <div className="flex items-center justify-between text-emerald-400 font-bold">
              <span>04. Persistence</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800">lib/supabase</span>
            </div>
            <p className="text-slate-300 font-sans leading-relaxed">
              Supabase-ready tables (investigations, sources, gap_reports) ready for authentication and team sharing.
            </p>
          </div>
        </div>

        {/* Directory Blueprint */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 font-mono text-xs text-slate-300 space-y-1 overflow-x-auto">
          <div className="text-slate-500">// Project Blueprint Organization:</div>
          <div><span className="text-cyan-400">app/</span>                  → Next.js App Router (layout, error, api/analyze, page)</div>
          <div><span className="text-cyan-400">components/</span>          → Navigation, empty states, loading radar, UI atoms</div>
          <div>├── <span className="text-slate-400">dashboard/</span>        → Metrics overview, Dark Spot Index radar, architecture</div>
          <div>├── <span className="text-slate-400">research/</span>         → Investigation panel, preset benchmarks, stream cards</div>
          <div>├── <span className="text-slate-400">evidence/</span>         → Consensus facts, side-by-side contradiction cards, source inspector</div>
          <div>└── <span className="text-slate-400">reports/</span>          → Information gaps, outdated warnings, verification checklist, export modal</div>
          <div><span className="text-cyan-400">lib/</span>                 → Domain libraries & orchestration</div>
          <div>├── <span className="text-slate-400">analysis/</span>         → Engine orchestrator (Gemini 1.5 + blueprint mock) & metrics</div>
          <div>├── <span className="text-slate-400">extraction/</span>       → HTML cleaner, text normalizer, temporal cycle detector</div>
          <div>├── <span className="text-slate-400">validation/</span>       → Strict Zod schemas mirroring Python Pydantic blueprint</div>
          <div>└── <span className="text-slate-400">supabase/</span>         → Supabase client, server cookies, and typed schema</div>
          <div><span className="text-cyan-400">types/</span>                → Comprehensive TypeScript domain interfaces</div>
          <div><span className="text-cyan-400">hooks/</span>                → useInvestigation state engine and useLocalStorage</div>
        </div>
      </CardContent>
    </Card>
  );
}
