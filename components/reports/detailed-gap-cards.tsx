"use client";

import * as React from "react";
import { 
  ShieldAlert, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink,
  Info,
  Clock,
  ArrowRight
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DetailedInformationGap, GapPriority, GapStatusType } from "@/types";

interface DetailedGapCardsProps {
  gaps: DetailedInformationGap[];
  className?: string;
}

export function DetailedGapCards({ gaps, className = "" }: DetailedGapCardsProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [filterPriority, setFilterPriority] = React.useState<string>("all");

  const filteredGaps = gaps.filter((gap) => {
    if (filterPriority !== "all" && gap.priority.toLowerCase() !== filterPriority.toLowerCase()) {
      return false;
    }
    return true;
  });

  const handleCopyAction = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getPriorityBadge = (priority: GapPriority) => {
    switch (priority) {
      case "Critical":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full bg-[#ffe4e6] text-[#be123c] border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
            CRITICAL PRIORITY
          </span>
        );
      case "High":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full bg-[#fef3c7] text-[#b45309] border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
            HIGH PRIORITY
          </span>
        );
      case "Medium":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full bg-[#fef9c3] text-[#854d0e] border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
            MEDIUM PRIORITY
          </span>
        );
      case "Low":
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full bg-[#e0f2fe] text-[#0369a1] border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
            LOW PRIORITY
          </span>
        );
    }
  };

  const getStatusTypeBadge = (statusType: GapStatusType) => {
    switch (statusType) {
      case "not_found":
        return (
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#ffe4e6] text-[#be123c] border border-rose-300">
            Status: Not Found in Reviewed Sources
          </span>
        );
      case "uncertain":
        return (
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#fef3c7] text-[#b45309] border border-amber-300">
            Status: Uncertain / Incomplete
          </span>
        );
      case "not_reviewed":
        return (
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
            Status: Not Reviewed
          </span>
        );
      case "not_applicable":
        return (
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-300">
            Status: Not Applicable
          </span>
        );
    }
  };

  return (
    <div className={`rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-[3px_3px_0px_#0f172a] space-y-5 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-slate-900">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 rounded-lg bg-[#ffe4e6] border border-slate-900">
              <ShieldAlert className="w-4 h-4 text-[#be123c]" />
            </div>
            <h3 className="text-lg font-black font-display text-slate-950">
              Prioritized Information Gap Cards
            </h3>
          </div>
          <p className="text-slate-600 text-xs font-medium font-sans">
            Rigorous gap analysis with strict transparency safeguards and actionable next verification steps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            aria-label="Filter by priority"
            className="bg-white border-2 border-slate-900 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 shadow-[2px_2px_0px_#0f172a] focus:outline-none"
          >
            <option value="all">All Priorities ({gaps.length})</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredGaps.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50">
            No information gaps matching criteria.
          </div>
        ) : (
          filteredGaps.map((gap, idx) => (
            <div
              key={gap.gap_id || idx}
              className="rounded-2xl border-2 border-slate-900 bg-white p-5 space-y-3.5 shadow-[3px_3px_0px_#0f172a] hover:shadow-[4px_4px_0px_#0f172a] transition-all"
            >
              {/* Header: Title, Priority, Hackathon Signal Label */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-[11px] font-mono font-black text-white shadow-[1px_1px_0px_#0f172a]">
                    {idx + 1}
                  </span>
                  <span className="font-extrabold text-base text-slate-950 font-display">
                    {gap.title}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                    {gap.missing_category}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {getPriorityBadge(gap.priority)}
                  {getStatusTypeBadge(gap.status_type)}
                </div>
              </div>

              {/* Official Transparency Phrasing Label */}
              <div className="inline-flex items-center gap-2 text-xs text-[#be123c] font-bold bg-[#ffe4e6] px-3.5 py-1.5 rounded-xl border border-rose-300">
                <AlertCircle className="w-4 h-4 text-[#be123c] shrink-0" />
                <span>{gap.signal_label}</span>
              </div>

              {/* Explanation adhering strictly to transparency rules */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans font-medium">
                {gap.explanation}
              </p>

              {/* Why This Matters & Actionable Next Step */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 space-y-1">
                  <div className="text-[10px] font-mono font-bold uppercase text-slate-600 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-slate-500" />
                    <span>Why Verification Is Necessary</span>
                  </div>
                  <p className="text-xs text-slate-800 leading-snug font-medium">
                    {gap.why_verification_needed}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#f0fdf4] border-2 border-slate-900 space-y-1 shadow-[2px_2px_0px_#0f172a]">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase text-[#15803d]">
                    <span className="flex items-center gap-1">
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                      Recommended Next Step
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyAction(gap.gap_id, gap.suggested_action || gap.suggested_next_step)}
                      className="text-slate-600 hover:text-black p-0.5"
                      title="Copy action to clipboard"
                    >
                      {copiedId === gap.gap_id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-900 font-bold leading-snug">
                    {gap.suggested_action || gap.suggested_next_step}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
