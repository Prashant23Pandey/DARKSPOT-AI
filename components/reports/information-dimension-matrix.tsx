"use client";

import * as React from "react";
import { 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  FileText, 
  ExternalLink,
  Quote
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { InformationDimension, DimensionStatus, ExtractedClaim } from "@/types";

interface InformationDimensionMatrixProps {
  dimensions: InformationDimension[];
  className?: string;
}

export function InformationDimensionMatrix({
  dimensions,
  className = "",
}: InformationDimensionMatrixProps) {
  const [expandedDimensionId, setExpandedDimensionId] = React.useState<string | null>(null);
  const [filterCategory, setFilterCategory] = React.useState<string>("all");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");

  const categories = Array.from(new Set(dimensions.map((d) => d.category)));

  const filteredDimensions = dimensions.filter((d) => {
    if (filterCategory !== "all" && d.category !== filterCategory) return false;
    if (filterStatus !== "all" && d.status !== filterStatus) return false;
    return true;
  });

  const getStatusBadge = (status: DimensionStatus) => {
    switch (status) {
      case "found":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#dcfce7] text-[#15803d] border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Found in Reviewed Sources
          </span>
        );
      case "partially_found":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#fef3c7] text-[#b45309] border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            Partially Found
          </span>
        );
      case "not_found":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#ffe4e6] text-[#be123c] border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            Not Found in Reviewed Sources
          </span>
        );
      case "conflicting":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#ede9fe] text-[#6d28d9] border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            Conflicting Evidence
          </span>
        );
      case "unclear":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700 border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            Unclear / Ambiguous
          </span>
        );
    }
  };

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case "critical":
        return <Badge variant="high">CRITICAL</Badge>;
      case "high":
        return <Badge variant="medium">HIGH</Badge>;
      case "medium":
        return <Badge variant="yellow">MEDIUM</Badge>;
      default:
        return <Badge variant="outline">{importance.toUpperCase()}</Badge>;
    }
  };

  return (
    <div className={`rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-[3px_3px_0px_#0f172a] space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-slate-900">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 rounded-lg bg-[#ede9fe] border border-slate-900">
              <Layers className="w-4 h-4 text-[#6d28d9]" />
            </div>
            <h3 className="text-lg font-black font-display text-slate-950">
              Information Dimension Matrix
            </h3>
          </div>
          <p className="text-slate-600 text-xs font-medium font-sans">
            Dynamically derived information dimensions mapped against extracted evidence.
          </p>
        </div>

        {/* Filter dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            aria-label="Filter by category"
            className="bg-white border-2 border-slate-900 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 shadow-[2px_2px_0px_#0f172a] focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            aria-label="Filter by verification status"
            className="bg-white border-2 border-slate-900 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 shadow-[2px_2px_0px_#0f172a] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="found">Found</option>
            <option value="partially_found">Partially Found</option>
            <option value="not_found">Not Found</option>
            <option value="conflicting">Conflicting</option>
            <option value="unclear">Unclear</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filteredDimensions.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 font-medium">
            No dimensions match the selected filters.
          </div>
        ) : (
          filteredDimensions.map((dim) => {
            const isExpanded = expandedDimensionId === dim.id;
            return (
              <div
                key={dim.id}
                className="rounded-2xl border-2 border-slate-900 bg-white p-5 space-y-3 shadow-[3px_3px_0px_#0f172a] hover:shadow-[4px_4px_0px_#0f172a] transition-all"
              >
                {/* Top line: Name, Category, Status, Importance */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-base text-slate-950 font-display">
                        {dim.name}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                        {dim.category}
                      </span>
                      {getImportanceBadge(dim.importance)}
                    </div>
                    <p className="text-xs text-slate-600 font-medium">
                      {dim.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {getStatusBadge(dim.status)}
                  </div>
                </div>

                {/* Coverage Bar & Sources Info */}
                <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-600 text-xs font-bold">Evidence Coverage:</span>
                    <div className="w-28 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-900 p-0.5">
                      <div
                        className={`h-full rounded-full ${
                          dim.coveragePercentage >= 80
                            ? "bg-[#a3e635]"
                            : dim.coveragePercentage > 0
                            ? "bg-[#fde047]"
                            : "bg-[#f43f5e]"
                        }`}
                        style={{ width: `${dim.coveragePercentage}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs font-black text-slate-900">{dim.coveragePercentage}%</span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-slate-600 text-xs font-bold">Sources:</span>
                    {dim.sourcesCovering.length > 0 ? (
                      dim.sourcesCovering.map((src, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-300"
                        >
                          {src}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-rose-600 font-mono font-bold">0 sources found</span>
                    )}

                    {dim.mappedClaims && dim.mappedClaims.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setExpandedDimensionId(isExpanded ? null : dim.id)}
                        className="text-xs font-bold text-slate-900 hover:text-[#db2777] flex items-center gap-1 ml-2 underline"
                      >
                        {isExpanded ? (
                          <>
                            <span>Hide Grounded Evidence</span>
                            <ChevronUp className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            <span>View {dim.mappedClaims.length} Claims</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expandable Claims Drawer */}
                {isExpanded && dim.mappedClaims && dim.mappedClaims.length > 0 && (
                  <div className="mt-3 p-4 rounded-xl bg-slate-50 border-2 border-slate-900 space-y-2.5 animate-in fade-in-50">
                    <div className="text-[11px] font-mono font-bold uppercase text-slate-600 flex items-center gap-1.5">
                      <Quote className="w-3.5 h-3.5 text-slate-500" />
                      Grounded Claims for {dim.name}
                    </div>
                    <div className="space-y-2">
                      {dim.mappedClaims.map((claim: ExtractedClaim, cIdx: number) => (
                        <div
                          key={claim.claim_id || cIdx}
                          className="p-3 rounded-lg bg-white border border-slate-300 text-xs space-y-1 shadow-sm"
                        >
                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                            <span className="font-bold text-slate-900">{claim.source_title || claim.source_id}</span>
                            <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                              Confidence: {Math.round(claim.extraction_confidence > 1 ? claim.extraction_confidence : claim.extraction_confidence * 100)}%
                            </span>
                          </div>
                          <p className="text-slate-800 font-semibold italic">
                            "{claim.supporting_excerpt || claim.claim_text}"
                          </p>
                        </div>
                      ))}
                    </div>
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
