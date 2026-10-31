"use client";

import * as React from "react";
import { 
  Clock, 
  AlertTriangle, 
  CalendarX, 
  CalendarCheck2, 
  HelpCircle, 
  ExternalLink,
  Calendar,
  Layers,
  ArrowRight,
  ShieldAlert,
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SourceFreshnessAudit, OutdatedWarning, FreshnessCategory } from "@/types";
import { formatDate } from "@/lib/utils";

interface SourceFreshnessTimelineProps {
  audits?: SourceFreshnessAudit[];
  warnings?: OutdatedWarning[];
  className?: string;
}

export function SourceFreshnessTimeline({
  audits = [],
  warnings = [],
  className = "",
}: SourceFreshnessTimelineProps) {
  const [filterStatus, setFilterStatus] = React.useState<string>("all");

  const filteredAudits = audits.filter((a) => {
    if (filterStatus !== "all" && a.freshness_status !== filterStatus) return false;
    return true;
  });

  const getStatusBadge = (status: FreshnessCategory) => {
    switch (status) {
      case "potentially_current":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#dcfce7] text-[#15803d] border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
            <CalendarCheck2 className="w-3.5 h-3.5 text-emerald-600" />
            Potentially Current
          </span>
        );
      case "potentially_outdated":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#fef3c7] text-[#b45309] border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Potentially Outdated Cycle
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#ffe4e6] text-[#be123c] border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
            <CalendarX className="w-3.5 h-3.5 text-rose-600" />
            Explicitly Expired
          </span>
        );
      case "freshness_uncertain":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#fef9c3] text-[#854d0e] border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
            <HelpCircle className="w-3.5 h-3.5 text-yellow-600" />
            Freshness Uncertain
          </span>
        );
      case "undated":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700 border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            Undated Source
          </span>
        );
    }
  };

  return (
    <div className={`rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-[3px_3px_0px_#0f172a] space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-slate-900">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 rounded-lg bg-[#cffafe] border border-slate-900">
              <Clock className="w-4 h-4 text-[#0e7490]" />
            </div>
            <h3 className="text-lg font-black font-display text-slate-950">
              Source Freshness & Temporal Timeline
            </h3>
          </div>
          <p className="text-slate-600 text-xs font-medium font-sans">
            Audit of publication dates, academic cycles, and potential temporal drift.
          </p>
        </div>

        {/* Filter by freshness */}
        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            aria-label="Filter by freshness status"
            className="bg-white border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 shadow-[2px_2px_0px_#0f172a] focus:outline-none"
          >
            <option value="all">All Freshness Statuses ({audits.length})</option>
            <option value="potentially_current">Potentially Current</option>
            <option value="potentially_outdated">Potentially Outdated</option>
            <option value="expired">Explicitly Expired</option>
            <option value="freshness_uncertain">Freshness Uncertain</option>
            <option value="undated">Undated</option>
          </select>
        </div>
      </div>

      {/* Temporal Rule Guideline Banner */}
      <div className="p-4 rounded-xl border-2 border-slate-900 bg-[#cffafe] flex items-center gap-3 text-xs text-slate-950 shadow-[2px_2px_0px_#0f172a]">
        <Info className="w-5 h-5 text-[#0e7490] shrink-0" />
        <span className="font-semibold">
          <strong className="font-black text-[#0e7490]">Temporal Baseline Rule:</strong> An older publication date does not automatically imply factual falsehood; it highlights operational policies that require modern administrative confirmation.
        </span>
      </div>

      <div className="space-y-4 pt-1">
        {/* Outdated Information Warnings Panel */}
        {warnings && warnings.length > 0 && (
          <div className="space-y-3 pb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-800 font-black flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Flagged Temporal Warnings ({warnings.length}):
            </span>
            <div className="space-y-2.5">
              {warnings.map((w, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border-2 border-slate-900 bg-[#ffedd5] flex items-start gap-3.5 shadow-[2px_2px_0px_#0f172a]"
                >
                  <div className="p-2 rounded-lg bg-white border border-slate-900 text-[#c2410c] shrink-0 mt-0.5">
                    <CalendarX className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black text-slate-950">
                          {w.source}
                        </span>
                        {w.sourceUrl && (
                          <a
                            href={w.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-600 hover:text-black"
                            title="Inspect source"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
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
        )}

        {/* Source Timeline Grid */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-700 font-black block">
            Ingested Sources Temporal Chronology:
          </span>

          <div className="space-y-3">
            {filteredAudits.map((audit) => (
              <div
                key={audit.source_id}
                className="p-5 rounded-2xl border-2 border-slate-900 bg-white shadow-[2px_2px_0px_#0f172a] space-y-3"
              >
                {/* Source Title & Freshness Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-lg bg-slate-100 text-slate-900 border border-slate-300">
                      {audit.source_id}
                    </span>
                    <span className="font-extrabold text-sm text-slate-950 font-display">
                      {audit.source_title}
                    </span>
                    {audit.source_url && (
                      <a
                        href={audit.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-black"
                        title="Open source"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(audit.freshness_status)}
                  </div>
                </div>

                {/* Explanation */}
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {audit.freshness_explanation}
                </p>

                {/* Date & Cycle Metadata Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2.5 border-t border-slate-200 text-xs font-mono">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 space-y-0.5">
                    <span className="text-slate-500 block text-[10px] font-bold">PUBLICATION DATE</span>
                    <span className="text-slate-950 font-bold">
                      {audit.publication_date ? formatDate(audit.publication_date) : "Undated"}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 space-y-0.5">
                    <span className="text-slate-500 block text-[10px] font-bold">LAST UPDATED</span>
                    <span className="text-slate-950 font-bold">
                      {audit.last_updated_date || "Not reported"}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 space-y-0.5">
                    <span className="text-slate-500 block text-[10px] font-bold">OPERATIONAL CYCLE</span>
                    <span className="text-slate-950 font-bold">
                      {audit.academic_cycle || "Unspecified"}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 space-y-0.5">
                    <span className="text-slate-500 block text-[10px] font-bold">REFERENCED YEARS</span>
                    <span className="text-slate-950 font-bold">
                      {audit.referenced_years.length > 0 ? audit.referenced_years.join(", ") : "None detected"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
