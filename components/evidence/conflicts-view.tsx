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
      <Card className="border-2 border-slate-900 bg-white shadow-[3px_3px_0px_#0f172a]">
        <CardContent className="p-8 text-center text-slate-600 font-medium text-sm">
          No conflicting claims detected between sources. Information streams appear aligned.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0f172a]">
      <CardHeader className="pb-3 border-b-2 border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ArrowRightLeft className="w-5 h-5 text-amber-600" />
              <CardTitle className="text-xl font-display font-black text-slate-950">
                Contradictory Claims & Discrepancies
              </CardTitle>
            </div>
            <CardDescription className="text-slate-600 font-medium">
              Direct factual, numerical, or timeline inconsistencies discovered between sources.
            </CardDescription>
          </div>
          <Badge variant="yellow" className="font-bold">
            {conflicts.length} Contradictions
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {conflicts.map((conflict, idx) => (
          <div
            key={idx}
            className="rounded-xl border-2 border-slate-900 bg-[#fefce8] p-4 space-y-3 shadow-[3px_3px_0px_#0f172a]"
          >
            {/* Conflict Issue Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b-2 border-amber-200">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-[11px] font-mono font-black text-[#fde047] shadow-[1px_1px_0px_#fde047]">
                  !
                </span>
                <span className="font-display font-bold text-sm text-slate-950">
                  {conflict.issue}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {conflict.sources.map((src, sIdx) => (
                  <span
                    key={sIdx}
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white text-slate-900 border border-slate-900 shadow-[1px_1px_0px_#0f172a]"
                  >
                    {src}
                  </span>
                ))}
              </div>
            </div>

            {/* Split Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {/* Claim A */}
              <div className="p-3.5 rounded-xl border-2 border-slate-900 bg-white space-y-1 shadow-[2px_2px_0px_#0f172a]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-700 font-black">
                    Claim A
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-600">
                    {conflict.sources[0] || "Source A"}
                  </span>
                </div>
                <p className="text-xs text-slate-900 font-medium leading-relaxed">
                  {conflict.claim_a}
                </p>
              </div>

              {/* Claim B */}
              <div className="p-3.5 rounded-xl border-2 border-slate-900 bg-white space-y-1 shadow-[2px_2px_0px_#0f172a]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-rose-700 font-black">
                    Claim B
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-600">
                    {conflict.sources[1] || "Source B"}
                  </span>
                </div>
                <p className="text-xs text-slate-900 font-medium leading-relaxed">
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
