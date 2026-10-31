"use client";

import * as React from "react";
import { GitCompare, AlertTriangle, ArrowRightLeft, ShieldAlert } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ConflictItem, DetailedConflictItem } from "@/types";
import { DetailedConflictsView } from "./detailed-conflicts-view";

interface ConflictsViewProps {
  conflicts?: ConflictItem[];
  detailedConflicts?: DetailedConflictItem[];
}

export function ConflictsView({ conflicts = [], detailedConflicts }: ConflictsViewProps) {
  // If detailed conflicts from Phase 6 engine are present, render the advanced side-by-side view!
  if (detailedConflicts && detailedConflicts.length > 0) {
    return <DetailedConflictsView conflicts={detailedConflicts} />;
  }

  if (!conflicts || conflicts.length === 0) {
    return (
      <Card className="border-slate-800 bg-slate-950/60">
        <CardContent className="p-8 text-center text-slate-400 text-sm">
          No conflicting claims detected between sources. Information streams appear aligned.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-800 bg-slate-950/70 backdrop-blur-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ArrowRightLeft className="w-4 h-4 text-amber-400" />
              <CardTitle className="text-lg font-bold">
                Contradictory Claims & Discrepancies
              </CardTitle>
            </div>
            <CardDescription>
              Direct factual, numerical, or timeline inconsistencies discovered between sources.
            </CardDescription>
          </div>
          <Badge variant="medium">
            {conflicts.length} Contradictions
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {conflicts.map((conflict, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-amber-500/30 bg-slate-900/40 p-4 space-y-3"
          >
            {/* Conflict Issue Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-amber-950 border border-amber-500/50 text-[10px] font-mono font-bold text-amber-400">
                  !
                </span>
                <span className="font-semibold text-sm text-slate-100">
                  {conflict.issue}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {conflict.sources.map((src, sIdx) => (
                  <span
                    key={sIdx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-amber-500/30"
                  >
                    {src}
                  </span>
                ))}
              </div>
            </div>

            {/* Split Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {/* Claim A */}
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                    Claim A
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {conflict.sources[0] || "Source A"}
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {conflict.claim_a}
                </p>
              </div>

              {/* Claim B */}
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold">
                    Claim B
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {conflict.sources[1] || "Source B"}
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {conflict.claim_b}
                </p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
