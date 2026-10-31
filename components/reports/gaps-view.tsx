"use client";

import * as React from "react";
import { ShieldAlert, AlertCircle, HelpCircle, Search, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { InformationGap, DetailedInformationGap, SeverityLevel } from "@/types";
import { DetailedGapCards } from "./detailed-gap-cards";

interface GapsViewProps {
  gaps?: InformationGap[];
  detailedGaps?: DetailedInformationGap[];
}

export function GapsView({ gaps = [], detailedGaps }: GapsViewProps) {
  // If detailed gaps from Phase 5 are provided, display the rich DetailedGapCards component!
  if (detailedGaps && detailedGaps.length > 0) {
    return <DetailedGapCards gaps={detailedGaps} />;
  }

  if (!gaps || gaps.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-slate-900 bg-white p-8 text-center text-slate-600 text-sm shadow-[3px_3px_0px_#0f172a] font-medium">
        No information gaps detected. All critical criteria appear addressed.
      </div>
    );
  }

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case "HIGH":
        return <Badge variant="high">CRITICAL GAP</Badge>;
      case "MEDIUM":
        return <Badge variant="medium">MODERATE GAP</Badge>;
      case "LOW":
        return <Badge variant="low">LOW GAP</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  return (
    <div className="rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-[3px_3px_0px_#0f172a] space-y-4">
      <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 rounded-lg bg-[#ffe4e6] border border-slate-900">
              <ShieldAlert className="w-4 h-4 text-[#be123c]" />
            </div>
            <h3 className="text-lg font-black font-display text-slate-950">
              Detected Information Gaps & Omissions
            </h3>
          </div>
          <p className="text-xs text-slate-600 font-medium">
            Critical unaddressed parameters, omitted criteria, and unanswered institutional questions.
          </p>
        </div>
        <Badge variant="high">
          {gaps.length} Gaps Found
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {gaps.map((gap, index) => (
          <div
            key={index}
            className="rounded-2xl border-2 border-slate-900 bg-white p-5 space-y-2.5 shadow-[3px_3px_0px_#0f172a] hover:shadow-[4px_4px_0px_#0f172a] transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-base text-slate-950 font-display">
                {gap.gap_title}
              </span>
              {getSeverityBadge(gap.severity)}
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs text-[#be123c] font-bold bg-[#ffe4e6] px-3 py-1 rounded-xl border border-rose-300">
              <AlertCircle className="w-3.5 h-3.5 text-[#be123c] shrink-0" />
              <span>{gap.signal_label}</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {gap.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
