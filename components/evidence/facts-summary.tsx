"use client";

import * as React from "react";
import { CheckCircle2, ShieldCheck, ExternalLink, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SummaryFact } from "@/types";

interface FactsSummaryProps {
  facts: SummaryFact[];
}

export function FactsSummary({ facts }: FactsSummaryProps) {
  if (!facts || facts.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-slate-900 bg-white p-8 text-center text-slate-600 text-sm shadow-[3px_3px_0px_#0f172a] font-medium">
        No consensus facts verified yet. Ingest sources and execute gap analysis.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-[3px_3px_0px_#0f172a] space-y-4">
      <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 rounded-lg bg-[#dcfce7] border border-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
            </div>
            <h3 className="text-lg font-black font-display text-slate-950">
              Consensus Facts & Verified Baseline
            </h3>
          </div>
          <p className="text-xs text-slate-600 font-medium">
            Factual claims supported by explicit citations across the analyzed sources.
          </p>
        </div>
        <Badge variant="verified">
          {facts.length} Verified Claims
        </Badge>
      </div>

      <div className="space-y-3">
        {facts.map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-xl border-2 border-slate-900 bg-white hover:shadow-[3px_3px_0px_#0f172a] transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3 shadow-[1px_1px_0px_#0f172a]"
          >
            <div className="flex items-start gap-3 flex-1">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-[11px] font-mono font-black text-white shadow-[1px_1px_0px_#0f172a]">
                {index + 1}
              </span>
              <p className="text-sm text-slate-900 font-semibold leading-relaxed font-sans">
                {item.fact}
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-center">
              {item.sources.map((src, sIdx) => (
                <span
                  key={sIdx}
                  className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#ede9fe] text-[#6d28d9] border border-purple-300"
                >
                  {src}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
