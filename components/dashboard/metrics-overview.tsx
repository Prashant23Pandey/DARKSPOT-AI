"use client";

import * as React from "react";
import { 
  ShieldAlert, 
  Clock, 
  GitFork, 
  TrendingUp,
  Activity
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AnalysisMetrics } from "@/types";

interface MetricsOverviewProps {
  metrics: AnalysisMetrics;
}

export function MetricsOverview({ metrics }: MetricsOverviewProps) {
  // Determine risk level based on dark spot index
  const getIndexBadge = (score: number) => {
    if (score >= 70) return "bg-[#ffe4e6] text-[#be123c] border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]";
    if (score >= 40) return "bg-[#fef3c7] text-[#b45309] border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]";
    return "bg-[#dcfce7] text-[#15803d] border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]";
  };

  const getRiskLabel = (score: number) => {
    if (score >= 70) return "Critical Blindspots";
    if (score >= 40) return "Moderate Omissions";
    return "High Coverage";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Dark Spot Index Gauge */}
      <div className="rounded-2xl border-2 border-slate-900 bg-white p-5 flex flex-col justify-between shadow-[3px_3px_0px_#0f172a]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase text-slate-600 tracking-wider">
            Dark Spot Index
          </span>
          <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full ${getIndexBadge(metrics.darkSpotIndex)}`}>
            {getRiskLabel(metrics.darkSpotIndex)}
          </span>
        </div>

        <div className="my-3 flex items-baseline gap-2">
          <span className="text-4xl font-black tracking-tight text-slate-950 font-display">
            {metrics.darkSpotIndex}
          </span>
          <span className="text-xs text-slate-500 font-mono font-bold">/ 100</span>
        </div>

        <div className="w-full bg-slate-100 h-2.5 rounded-full border border-slate-900 overflow-hidden p-0.5">
          <div
            className="h-full bg-[#f43f5e] rounded-full transition-all duration-700"
            style={{ width: `${Math.min(metrics.darkSpotIndex, 100)}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] text-slate-600 leading-tight font-medium">
          Information omission density calculated across ingested sources.
        </p>
      </div>

      {/* 2. Information Gaps Count */}
      <div className="rounded-2xl border-2 border-slate-900 bg-white p-5 flex flex-col justify-between shadow-[3px_3px_0px_#0f172a]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase text-slate-600 tracking-wider">
            Information Gaps
          </span>
          <div className="p-1.5 rounded-lg bg-[#ffe4e6] border border-slate-900 text-[#be123c] shadow-[1px_1px_0px_#0f172a]">
            <ShieldAlert className="w-4 h-4 text-[#be123c]" />
          </div>
        </div>

        <div className="my-3 flex items-baseline gap-2">
          <span className="text-4xl font-black text-[#be123c] font-display">
            {metrics.gapCount}
          </span>
          <span className="text-xs text-[#be123c] font-mono font-bold">
            ({metrics.highSeverityGaps} High Severity)
          </span>
        </div>

        <p className="text-[11px] text-slate-600 leading-tight font-medium">
          Key institutional criteria & missing operational details unstated in sources.
        </p>
      </div>

      {/* 3. Conflicting Claims */}
      <div className="rounded-2xl border-2 border-slate-900 bg-white p-5 flex flex-col justify-between shadow-[3px_3px_0px_#0f172a]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase text-slate-600 tracking-wider">
            Contradictions
          </span>
          <div className="p-1.5 rounded-lg bg-[#fef3c7] border border-slate-900 text-[#b45309] shadow-[1px_1px_0px_#0f172a]">
            <GitFork className="w-4 h-4 text-[#b45309]" />
          </div>
        </div>

        <div className="my-3 flex items-baseline gap-2">
          <span className="text-4xl font-black text-[#b45309] font-display">
            {metrics.conflictCount}
          </span>
          <span className="text-xs text-slate-600 font-mono font-bold">
            Variances Flagged
          </span>
        </div>

        <p className="text-[11px] text-slate-600 leading-tight font-medium">
          Direct or contextual claim clashes requiring human reconciliation.
        </p>
      </div>

      {/* 4. Temporal Health & Sources */}
      <div className="rounded-2xl border-2 border-slate-900 bg-white p-5 flex flex-col justify-between shadow-[3px_3px_0px_#0f172a]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase text-slate-600 tracking-wider">
            Temporal Freshness
          </span>
          <div className="p-1.5 rounded-lg bg-[#cffafe] border border-slate-900 text-[#0e7490] shadow-[1px_1px_0px_#0f172a]">
            <Clock className="w-4 h-4 text-[#0e7490]" />
          </div>
        </div>

        <div className="my-3 flex items-baseline gap-2">
          <span className="text-4xl font-black text-[#0e7490] font-display">
            {metrics.temporalFreshnessScore}%
          </span>
          <span className="text-xs text-slate-600 font-mono font-bold">
            {metrics.outdatedCount > 0 ? `${metrics.outdatedCount} Stale Warnings` : "All Current"}
          </span>
        </div>

        <p className="text-[11px] text-slate-600 leading-tight font-medium">
          Reconciles obsolete operational years against the active cycle.
        </p>
      </div>
    </div>
  );
}
