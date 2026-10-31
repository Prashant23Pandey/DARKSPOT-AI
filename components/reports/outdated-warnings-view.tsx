"use client";

import * as React from "react";
import { Clock, AlertTriangle, CalendarX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { OutdatedWarning, SourceFreshnessAudit } from "@/types";
import { SourceFreshnessTimeline } from "./source-freshness-timeline";

interface OutdatedWarningsViewProps {
  warnings?: OutdatedWarning[];
  audits?: SourceFreshnessAudit[];
}

export function OutdatedWarningsView({ warnings = [], audits }: OutdatedWarningsViewProps) {
  // If source freshness audits from Phase 7 are available, render the advanced timeline view!
  if (audits && audits.length > 0) {
    return <SourceFreshnessTimeline audits={audits} warnings={warnings} />;
  }

  if (!warnings || warnings.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-slate-900 bg-white p-8 text-center text-slate-600 text-sm shadow-[3px_3px_0px_#0f172a] font-medium">
        No outdated cycle warnings detected. All temporal markers appear current.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-[3px_3px_0px_#0f172a] space-y-4">
      <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 rounded-lg bg-[#ffedd5] border border-slate-900">
              <Clock className="w-4 h-4 text-[#c2410c]" />
            </div>
            <h3 className="text-lg font-black font-display text-slate-950">
              Temporal Inconsistencies & Stale Cycles
            </h3>
          </div>
          <p className="text-xs text-slate-600 font-medium">
            Identifies outdated policy years, past academic cycles, and obsolete operational dates.
          </p>
        </div>
        <Badge variant="outdated">
          {warnings.length} Warnings
        </Badge>
      </div>

      <div className="space-y-3">
        {warnings.map((w, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border-2 border-slate-900 bg-[#ffedd5] flex items-start gap-3.5 shadow-[2px_2px_0px_#0f172a]"
          >
            <div className="p-2 rounded-lg bg-white border border-slate-900 text-[#c2410c] shrink-0 mt-0.5">
              <CalendarX className="w-4 h-4" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black text-slate-950">{w.source}</span>
                {w.detectedCycle && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white border border-slate-900 text-slate-950">
                    Cycle: {w.detectedCycle}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-900 font-semibold leading-relaxed">
                {w.warning}
              </p>
              {w.recommendedAction && (
                <p className="text-xs text-amber-900 font-bold pt-1 font-mono">
                  Action: {w.recommendedAction}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
