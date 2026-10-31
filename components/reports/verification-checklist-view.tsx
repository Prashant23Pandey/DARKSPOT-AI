"use client";

import * as React from "react";
import { 
  CheckSquare, 
  Square, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Filter,
  Layers,
  ExternalLink,
  Info,
  Clock,
  Compass,
  FileSearch,
  Quote
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ChecklistItem, GapPriority } from "@/types";

interface VerificationChecklistViewProps {
  checklist: ChecklistItem[];
  onToggleItem: (id: string) => void;
  className?: string;
}

export function VerificationChecklistView({
  checklist = [],
  onToggleItem,
  className = "",
}: VerificationChecklistViewProps) {
  const [filterPriority, setFilterPriority] = React.useState<string>("all");
  const [showUnresolvedOnly, setShowUnresolvedOnly] = React.useState<boolean>(false);
  const [expandedItemId, setExpandedItemId] = React.useState<string | null>(null);

  if (!checklist || checklist.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-slate-900 bg-white p-8 text-center text-slate-600 text-sm shadow-[3px_3px_0px_#0f172a] font-medium">
        No verification checklist items generated yet.
      </div>
    );
  }

  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredItems = checklist.filter((item) => {
    if (showUnresolvedOnly && item.completed) return false;
    if (filterPriority !== "all") {
      const pLevel = item.priorityLevel?.toLowerCase();
      if (pLevel) {
        if (pLevel !== filterPriority.toLowerCase()) return false;
      } else {
        if (filterPriority === "critical" && item.priority !== 1) return false;
        if (filterPriority === "high" && item.priority !== 2) return false;
        if (filterPriority === "medium" && item.priority > 2) return false;
      }
    }
    return true;
  });

  const getPriorityBadge = (item: ChecklistItem) => {
    const level = item.priorityLevel || (item.priority === 1 ? "Critical" : item.priority === 2 ? "High" : "Medium");
    switch (level) {
      case "Critical":
        return (
          <span className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full bg-[#ffe4e6] text-[#be123c] border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
            CRITICAL PRIORITY
          </span>
        );
      case "High":
        return (
          <span className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full bg-[#fef3c7] text-[#b45309] border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
            HIGH PRIORITY
          </span>
        );
      case "Medium":
        return (
          <span className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full bg-[#fef9c3] text-[#854d0e] border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
            MEDIUM PRIORITY
          </span>
        );
      case "Low":
      default:
        return (
          <span className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full bg-[#e0f2fe] text-[#0369a1] border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
            LOW PRIORITY
          </span>
        );
    }
  };

  const getEffortBadge = (effort?: string) => {
    switch (effort) {
      case "quick":
        return <span className="text-[10px] font-mono font-bold text-[#15803d] bg-[#dcfce7] px-2 py-0.5 rounded-lg border border-emerald-300">Quick Check (&lt;10m)</span>;
      case "moderate":
        return <span className="text-[10px] font-mono font-bold text-[#b45309] bg-[#fef3c7] px-2 py-0.5 rounded-lg border border-amber-300">Moderate Audit</span>;
      case "deep_dive":
        return <span className="text-[10px] font-mono font-bold text-[#6d28d9] bg-[#ede9fe] px-2 py-0.5 rounded-lg border border-purple-300">Deep Inquest</span>;
      default:
        return null;
    }
  };

  return (
    <div className={`rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-[3px_3px_0px_#0f172a] space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-slate-900">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 rounded-lg bg-[#cffafe] border border-slate-900">
              <Compass className="w-4 h-4 text-[#0e7490]" />
            </div>
            <h3 className="text-lg font-black font-display text-slate-950">
              Prioritized Verification Planner & Roadmap
            </h3>
          </div>
          <p className="text-slate-600 text-xs font-medium font-sans">
            Synthesized action items directly addressing detected dark spots, contradictions, and temporal drift.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-black text-slate-900 bg-[#fde047] px-3 py-1 rounded-full border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
            {completedCount} of {totalCount} Tasks Verified ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* Dynamic Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border-2 border-slate-900 p-0.5">
          <div
            className="bg-[#a3e635] h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Interactive Filter Toolbar */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            aria-label="Filter checklist by priority"
            className="bg-white border-2 border-slate-900 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 shadow-[2px_2px_0px_#0f172a] focus:outline-none"
          >
            <option value="all">All Priorities ({checklist.length})</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <Button
            size="sm"
            onClick={() => setShowUnresolvedOnly(!showUnresolvedOnly)}
            className={`h-8 px-3 text-xs font-bold border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_#0f172a] transition-all ${
              showUnresolvedOnly
                ? "bg-[#cffafe] text-[#0e7490]"
                : "bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            {showUnresolvedOnly ? "Showing Unresolved Only" : "Show All Tasks"}
          </Button>
        </div>

        <span className="text-xs font-mono font-bold text-slate-500">
          {filteredItems.length} tasks displayed
        </span>
      </div>

      <div className="space-y-3 pt-2">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 font-medium">
            {showUnresolvedOnly ? "All filtered tasks have been resolved!" : "No tasks matching filter criteria."}
          </div>
        ) : (
          filteredItems.map((item) => {
            const isExpanded = expandedItemId === item.id;
            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border-2 border-slate-900 transition-all space-y-3 ${
                  item.completed
                    ? "bg-slate-50 border-slate-400 opacity-60 shadow-none"
                    : "bg-white shadow-[3px_3px_0px_#0f172a] hover:shadow-[4px_4px_0px_#0f172a]"
                }`}
              >
                {/* Header Row: Checkbox, Title, Priority, Effort */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    {/* Interactive Clickable Checkbox */}
                    <button
                      type="button"
                      onClick={() => onToggleItem(item.id)}
                      className="mt-0.5 text-slate-900 hover:scale-110 transition-transform"
                      title={item.completed ? "Reopen task" : "Mark as verified"}
                    >
                      {item.completed ? (
                        <div className="h-6 w-6 rounded-md bg-[#dcfce7] border-2 border-slate-900 flex items-center justify-center text-emerald-700">
                          <CheckSquare className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="h-6 w-6 rounded-md bg-white border-2 border-slate-900 flex items-center justify-center hover:bg-yellow-100">
                          <Square className="w-5 h-5 text-slate-400" />
                        </div>
                      )}
                    </button>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getPriorityBadge(item)}
                        {item.title && (
                          <span className={`text-base font-extrabold font-display ${
                            item.completed ? "line-through text-slate-400" : "text-slate-950"
                          }`}>
                            {item.title}
                          </span>
                        )}
                        {getEffortBadge(item.estimatedEffort)}
                      </div>

                      <p className={`text-xs sm:text-sm leading-relaxed font-sans ${
                        item.completed ? "line-through text-slate-400" : "text-slate-700 font-medium"
                      }`}>
                        {item.action}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reason & Recommended Source Context Bar */}
                <div className="pt-2.5 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {item.reason_for_verification && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-300 space-y-0.5">
                      <span className="text-[10px] font-mono uppercase text-[#b45309] font-black block">
                        Reason For Verification:
                      </span>
                      <p className="text-xs text-slate-800 font-medium">
                        {item.reason_for_verification}
                      </p>
                    </div>
                  )}

                  {item.recommended_source && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-300 space-y-0.5">
                      <span className="text-[10px] font-mono uppercase text-[#0e7490] font-black block">
                        Recommended Source / Target:
                      </span>
                      <p className="text-xs text-slate-900 font-bold font-mono">
                        {item.recommended_source}
                      </p>
                    </div>
                  )}
                </div>

                {/* Supporting Evidence References Drawer */}
                {item.supporting_evidence_references && item.supporting_evidence_references.length > 0 && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                      className="text-xs font-bold text-slate-800 hover:text-[#db2777] underline flex items-center gap-1"
                    >
                      <Quote className="w-3.5 h-3.5 text-slate-500" />
                      <span>{isExpanded ? "Hide Evidence References" : "View Supporting Evidence References"}</span>
                    </button>

                    {isExpanded && (
                      <div className="mt-2 p-3.5 rounded-xl bg-slate-50 border-2 border-slate-900 text-xs font-mono text-slate-800 space-y-1">
                        {item.supporting_evidence_references.map((ref, rIdx) => (
                          <div key={rIdx} className="leading-relaxed">
                            • {ref}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
