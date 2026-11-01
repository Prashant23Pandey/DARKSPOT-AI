"use client";

import * as React from "react";
import { Terminal, Database, Cpu, ShieldCheck, GitFork, ArrowDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ArchitectureOverview() {
  return (
    <Card id="architecture" className="border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0f172a]">
      <CardHeader className="pb-3 border-b-2 border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Terminal className="w-5 h-5 text-[#ec4899]" />
              <CardTitle className="text-xl font-display font-black text-slate-950">
                DARKSPOT AI — Technical Architecture & Pipeline
              </CardTitle>
            </div>
            <CardDescription className="text-slate-600 font-medium">
              Production modular blueprint designed for Shinchan Online Hackathon 2026.
            </CardDescription>
          </div>
          <Badge variant="yellow" className="font-mono text-xs font-bold">
            Phase 1 Foundation
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-5">
        {/* Pipeline Flow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono font-bold">
          {/* Step 1 */}
          <div className="p-4 rounded-xl border-2 border-slate-900 bg-[#cffafe] space-y-2 shadow-[2px_2px_0px_#0f172a]">
            <div className="flex items-center justify-between text-cyan-950 font-black">
              <span>01. Ingestion</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-900 shadow-[1px_1px_0px_#0f172a]">lib/extraction</span>
            </div>
            <p className="text-slate-800 font-sans leading-relaxed font-medium">
              Normalizes URLs & raw excerpts. Strips HTML DOM, checks word counts, and isolates temporal headers.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl border-2 border-slate-900 bg-[#fefce8] space-y-2 shadow-[2px_2px_0px_#0f172a]">
            <div className="flex items-center justify-between text-amber-950 font-black">
              <span>02. Cross-Exam</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-900 shadow-[1px_1px_0px_#0f172a]">lib/analysis</span>
            </div>
            <p className="text-slate-800 font-sans leading-relaxed font-medium">
              Gemini 1.5 JSON Schema mode cross-references claims, contradictions, omissions, and temporal cycles.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl border-2 border-slate-900 bg-[#fff1f2] space-y-2 shadow-[2px_2px_0px_#0f172a]">
            <div className="flex items-center justify-between text-rose-950 font-black">
              <span>03. Dark Spot Audit</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-900 shadow-[1px_1px_0px_#0f172a]">lib/validation</span>
            </div>
            <p className="text-slate-800 font-sans leading-relaxed font-medium">
              Strict Zod schemas validate JSON payloads and computes the Dark Spot Risk Index & consensus scores.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl border-2 border-slate-900 bg-[#dcfce7] space-y-2 shadow-[2px_2px_0px_#0f172a]">
            <div className="flex items-center justify-between text-emerald-950 font-black">
              <span>04. Persistence</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-900 shadow-[1px_1px_0px_#0f172a]">lib/supabase</span>
            </div>
            <p className="text-slate-800 font-sans leading-relaxed font-medium">
              Supabase-ready tables (investigations, sources, gap_reports) ready for authentication and team sharing.
            </p>
          </div>
        </div>

        {/* Directory Blueprint */}
        <div className="p-4 rounded-xl bg-slate-900 border-2 border-slate-900 font-mono text-xs text-slate-100 space-y-1 overflow-x-auto shadow-[3px_3px_0px_#0f172a]">
          <div className="text-[#fde047] font-bold">// Project Blueprint Organization:</div>
          <div><span className="text-cyan-300 font-bold">app/</span>                  → Next.js App Router (layout, error, api/analyze, page)</div>
          <div><span className="text-cyan-300 font-bold">components/</span>          → Navigation, empty states, loading radar, UI atoms</div>
          <div>├── <span className="text-slate-300">dashboard/</span>        → Metrics overview, Dark Spot Index radar, architecture</div>
          <div>├── <span className="text-slate-300">research/</span>         → Investigation panel, preset benchmarks, stream cards</div>
          <div>├── <span className="text-slate-300">evidence/</span>         → Consensus facts, side-by-side contradiction cards, source inspector</div>
          <div>└── <span className="text-slate-300">reports/</span>          → Information gaps, outdated warnings, verification checklist, export modal</div>
          <div><span className="text-cyan-300 font-bold">lib/</span>                 → Domain libraries & orchestration</div>
          <div>├── <span className="text-slate-300">analysis/</span>         → Engine orchestrator (Gemini 1.5 + blueprint mock) & metrics</div>
          <div>├── <span className="text-slate-300">extraction/</span>       → HTML cleaner, text normalizer, temporal cycle detector</div>
          <div>├── <span className="text-slate-300">validation/</span>       → Strict Zod schemas mirroring Python Pydantic blueprint</div>
          <div>└── <span className="text-slate-300">supabase/</span>         → Supabase client, server cookies, and typed schema</div>
          <div><span className="text-cyan-300 font-bold">types/</span>                → Comprehensive TypeScript domain interfaces</div>
          <div><span className="text-cyan-300 font-bold">hooks/</span>                → useInvestigation state engine and useLocalStorage</div>
        </div>
      </CardContent>
    </Card>
  );
}
