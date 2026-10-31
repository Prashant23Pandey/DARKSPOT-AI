"use client";

import * as React from "react";
import { 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  AlertCircle, 
  Sparkles,
  PieChart,
  BarChart3,
  Layers,
  ArrowRight
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ResearchCompletenessReport } from "@/types";

interface ResearchCoverageDashboardProps {
  report?: ResearchCompletenessReport;
  topic: string;
  className?: string;
}

export function ResearchCoverageDashboard({
  report,
  topic,
  className = "",
}: ResearchCoverageDashboardProps) {
  if (!report) {
    return null;
  }

  const {
    overallCompletenessScore,
    totalDimensions,
    foundCount,
    partialCount,
    missingCount,
    conflictingCount,
    unclearCount,
    priorityDistribution,
  } = report;

  const totalGaps =
    priorityDistribution.critical +
    priorityDistribution.high +
    priorityDistribution.medium +
    priorityDistribution.low;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Top Banner: Research Completeness Gauge & Executive Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Overall Completeness Card */}
        <div className="lg:col-span-5 p-6 rounded-2xl border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0f172a] flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#db2777]" />
                Research Completeness Index
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#fde047] border border-slate-900 text-slate-950 font-black text-[10px] font-mono shadow-[1px_1px_0px_#0f172a]">
                GAP ENGINE
              </span>
            </div>

            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-5xl font-black font-display tracking-tight text-slate-950">
                {overallCompletenessScore}%
              </span>
              <div className="space-y-0.5">
                <span className="text-xs font-extrabold text-slate-900 block font-display">
                  {overallCompletenessScore >= 80
                    ? "Comprehensive Evidence Base"
                    : overallCompletenessScore >= 50
                    ? "Substantial Knowledge Gaps"
                    : "Severe Information Dark Spot"}
                </span>
                <span className="text-xs text-slate-600 font-medium">
                  {foundCount} of {totalDimensions} dimensions fully verified
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border-2 border-slate-900 p-0.5 mt-2">
              <div
                className="h-full rounded-full transition-all duration-700 bg-[#a3e635]"
                style={{ width: `${overallCompletenessScore}%` }}
              />
            </div>
          </div>

          <div className="pt-4 border-t-2 border-slate-200 mt-4 flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Adaptive Dimensions: <strong className="text-slate-950 font-bold">{totalDimensions}</strong></span>
            <span>Unaddressed Gaps: <strong className="text-[#be123c] font-bold">{missingCount + partialCount}</strong></span>
          </div>
        </div>

        {/* Dimension Status Breakdown Grid */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Found */}
          <div className="p-4 rounded-2xl border-2 border-slate-900 bg-white shadow-[2px_2px_0px_#0f172a] space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-700">
              <span className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Found
              </span>
              <span className="font-mono text-sm font-black text-emerald-700">{foundCount}</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-tight">
              Verified by reviewed source evidence
            </p>
          </div>

          {/* Partially Found */}
          <div className="p-4 rounded-2xl border-2 border-slate-900 bg-white shadow-[2px_2px_0px_#0f172a] space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-700">
              <span className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Partially Found
              </span>
              <span className="font-mono text-sm font-black text-amber-700">{partialCount}</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-tight">
              Incomplete details or missing clauses
            </p>
          </div>

          {/* Not Found */}
          <div className="p-4 rounded-2xl border-2 border-slate-900 bg-white shadow-[2px_2px_0px_#0f172a] space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-700">
              <span className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Not Found
              </span>
              <span className="font-mono text-sm font-black text-rose-700">{missingCount}</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-tight">
              Zero evidence in reviewed sources
            </p>
          </div>

          {/* Conflicting */}
          <div className="p-4 rounded-2xl border-2 border-slate-900 bg-white shadow-[2px_2px_0px_#0f172a] space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-700">
              <span className="flex items-center gap-1.5 font-bold">
                <Layers className="w-4 h-4 text-purple-600" />
                Conflicting
              </span>
              <span className="font-mono text-sm font-black text-purple-700">{conflictingCount}</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-tight">
              Contradictory claims between sources
            </p>
          </div>

          {/* Unclear */}
          <div className="p-4 rounded-2xl border-2 border-slate-900 bg-white shadow-[2px_2px_0px_#0f172a] space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-700">
              <span className="flex items-center gap-1.5 font-bold">
                <HelpCircle className="w-4 h-4 text-slate-600" />
                Unclear
              </span>
              <span className="font-mono text-sm font-black text-slate-700">{unclearCount}</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-tight">
              Vague or subjective terminology
            </p>
          </div>

          {/* Total Dimensions */}
          <div className="p-4 rounded-2xl border-2 border-slate-900 bg-white shadow-[2px_2px_0px_#0f172a] space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-700">
              <span className="flex items-center gap-1.5 font-bold">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                Required Criteria
              </span>
              <span className="font-mono text-sm font-black text-blue-700">{totalDimensions}</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-tight">
              Dynamically derived for research topic
            </p>
          </div>
        </div>
      </div>

      {/* Priority Distribution Bar */}
      <div className="p-5 rounded-2xl border-2 border-slate-900 bg-white shadow-[3px_3px_0px_#0f172a] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#db2777]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 font-display">
              Gap Priority Distribution
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-600">
            Total Gaps Requiring Verification: <strong className="text-slate-950 font-bold">{totalGaps}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <div className="p-3 rounded-xl bg-[#ffe4e6] border border-rose-300">
            <div className="text-[10px] font-mono font-bold uppercase text-[#be123c]">Critical Priority</div>
            <div className="text-xl font-black text-[#be123c] font-display">{priorityDistribution.critical}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#fef3c7] border border-amber-300">
            <div className="text-[10px] font-mono font-bold uppercase text-[#b45309]">High Priority</div>
            <div className="text-xl font-black text-[#b45309] font-display">{priorityDistribution.high}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#fef9c3] border border-yellow-300">
            <div className="text-[10px] font-mono font-bold uppercase text-[#854d0e]">Medium Priority</div>
            <div className="text-xl font-black text-[#854d0e] font-display">{priorityDistribution.medium}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#e0f2fe] border border-sky-300">
            <div className="text-[10px] font-mono font-bold uppercase text-[#0369a1]">Low Priority</div>
            <div className="text-xl font-black text-[#0369a1] font-display">{priorityDistribution.low}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
