"use client";

import * as React from "react";
import { 
  ArrowRightLeft, 
  AlertTriangle, 
  Layers, 
  ExternalLink, 
  Quote, 
  ShieldAlert, 
  HelpCircle,
  FileCheck2,
  Scale
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DetailedConflictItem, ConflictCategory, ComparisonDimension } from "@/types";
import { CharacterAvatar } from "@/components/shinchan/character-avatar";

interface DetailedConflictsViewProps {
  conflicts: DetailedConflictItem[];
  className?: string;
}

export function DetailedConflictsView({ conflicts, className = "" }: DetailedConflictsViewProps) {
  const [filterCategory, setFilterCategory] = React.useState<string>("all");
  const [filterDimension, setFilterDimension] = React.useState<string>("all");

  const categories = Array.from(new Set(conflicts.map((c) => c.conflict_category)));
  const dimensions = Array.from(new Set(conflicts.map((c) => c.comparison_dimension)));

  const filteredConflicts = conflicts.filter((c) => {
    if (filterCategory !== "all" && c.conflict_category !== filterCategory) return false;
    if (filterDimension !== "all" && c.comparison_dimension !== filterDimension) return false;
    return true;
  });

  const getCategoryBadge = (category: ConflictCategory, isContextual?: boolean) => {
    if (isContextual || category === "contextual_difference") {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
          <FileCheck2 className="w-3.5 h-3.5 text-emerald-700" />
          CONTEXTUAL DIFFERENCE (NON-CONTRADICTION)
        </span>
      );
    }
    switch (category) {
      case "direct_contradiction":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full bg-[#ffe4e6] text-[#be123c] border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            DIRECT CONTRADICTION
          </span>
        );
      case "numerical_discrepancy":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full bg-[#fef3c7] text-[#b45309] border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
            <Scale className="w-3.5 h-3.5 text-amber-700" />
            NUMERICAL DISCREPANCY
          </span>
        );
      case "potential_inconsistency":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full bg-[#fef9c3] text-[#854d0e] border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
            <AlertTriangle className="w-3.5 h-3.5 text-yellow-600" />
            POTENTIAL INCONSISTENCY
          </span>
        );
      case "insufficient_evidence":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            INSUFFICIENT EVIDENCE
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full bg-[#ede9fe] text-[#6d28d9] border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
            <ArrowRightLeft className="w-3.5 h-3.5 text-purple-600" />
            {category.toUpperCase().replace("_", " ")}
          </span>
        );
    }
  };

  return (
    <div className={`rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-[3px_3px_0px_#0f172a] space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-slate-900">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 rounded-lg bg-[#fef3c7] border border-slate-900">
              <ArrowRightLeft className="w-4 h-4 text-[#b45309]" />
            </div>
            <h3 className="text-lg font-black font-display text-slate-950">
              Cross-Source Contradiction Detection
            </h3>
          </div>
          <p className="text-slate-600 text-xs font-medium font-sans">
            Systematic comparison of statements across sources with false-positive contextual guardrails.
          </p>
        </div>

        <Badge variant="yellow" className="font-mono text-xs self-start sm:self-auto">
          {conflicts.length} Points of Variance Detected
        </Badge>
      </div>

      {/* Impartiality Banner */}
      <div className="p-4 rounded-xl border-2 border-slate-900 bg-[#fef08a] flex items-center gap-3 text-xs text-slate-950 shadow-[2px_2px_0px_#0f172a]">
        <Scale className="w-5 h-5 text-slate-950 shrink-0" />
        <span className="font-semibold">
          <strong className="font-black">Impartiality Protocol:</strong> DARKSPOT AI never automatically decides which source is correct. Both sides of the evidence are preserved side-by-side for transparent human cross-examination.
        </span>
      </div>

      {/* Masao Conflict & Variance Mascot Banner */}
      <div className="rounded-xl border-2 border-slate-900 bg-[#fef3c7] p-3.5 flex items-center gap-3 shadow-[2px_2px_0px_#0f172a]">
        <CharacterAvatar character="masao" size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-xs text-slate-950">
              Masao &bull; Conflict Auditor
            </span>
            <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full border border-amber-300">
              UNCERTAINTY WARNING
            </span>
          </div>
          <p className="text-xs text-slate-800 font-sans font-medium mt-0.5 leading-snug">
            &ldquo;Wait! These sources contain contrasting statements or dates. Both claims and their exact source quotes are shown side-by-side below.&rdquo;
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          aria-label="Filter by conflict category"
          className="bg-white border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 shadow-[2px_2px_0px_#0f172a] focus:outline-none"
        >
          <option value="all">All Conflict Categories ({categories.length})</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.replace(/_/g, " ").toUpperCase()}
            </option>
          ))}
        </select>

        <select
          value={filterDimension}
          onChange={(e) => setFilterDimension(e.target.value)}
          aria-label="Filter by comparison dimension"
          className="bg-white border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 shadow-[2px_2px_0px_#0f172a] focus:outline-none"
        >
          <option value="all">All Dimensions ({dimensions.length})</option>
          {dimensions.map((dim) => (
            <option key={dim} value={dim}>
              {dim}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4 pt-2">
        {filteredConflicts.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 font-medium">
            No contradictory claims found matching the filter criteria.
          </div>
        ) : (
          filteredConflicts.map((c, idx) => (
            <div
              key={c.conflict_id || idx}
              className="rounded-2xl border-2 border-slate-900 bg-white p-5 space-y-3.5 shadow-[3px_3px_0px_#0f172a] hover:shadow-[4px_4px_0px_#0f172a] transition-all"
            >
              {/* Header: Dimension, Category, Confidence */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-[11px] font-mono font-black text-white shadow-[1px_1px_0px_#0f172a]">
                    {idx + 1}
                  </span>
                  {getCategoryBadge(c.conflict_category, c.is_contextual_divergence)}
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-300">
                    Dimension: {c.comparison_dimension}
                  </span>
                </div>

                <span className="text-[11px] font-mono font-bold text-slate-600">
                  Detection Confidence: <strong className="text-slate-950 font-black">{c.confidence}%</strong>
                </span>
              </div>

              {/* Side-by-Side Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Side A */}
                <div className="p-4 rounded-xl border-2 border-slate-900 bg-[#fafaf8] space-y-2.5 flex flex-col justify-between shadow-[2px_2px_0px_#0f172a]">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-lg bg-[#cffafe] text-[#0e7490] border border-cyan-400">
                          {c.source_a}
                        </span>
                        <span className="text-xs text-slate-900 font-bold truncate max-w-[180px]">
                          {c.source_title_a || c.source_a}
                        </span>
                      </div>
                      {c.source_url_a && (
                        <a
                          href={c.source_url_a}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-black"
                          title="Inspect Source A"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <p className="text-xs font-bold text-slate-950 leading-snug font-sans">
                      {c.claim_a}
                    </p>
                  </div>

                  {/* Verbatim Supporting Excerpt A */}
                  <div className="pt-2 border-t border-slate-200 mt-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-600 flex items-center gap-1 mb-1">
                      <Quote className="w-3 h-3 text-[#0e7490]" />
                      Grounded Excerpt (Source A):
                    </span>
                    <p className="text-[11px] text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-300 leading-relaxed font-medium">
                      "{c.supporting_excerpt_a}"
                    </p>
                  </div>
                </div>

                {/* Side B */}
                <div className="p-4 rounded-xl border-2 border-slate-900 bg-[#fafaf8] space-y-2.5 flex flex-col justify-between shadow-[2px_2px_0px_#0f172a]">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-lg bg-[#ede9fe] text-[#6d28d9] border border-purple-400">
                          {c.source_b}
                        </span>
                        <span className="text-xs text-slate-900 font-bold truncate max-w-[180px]">
                          {c.source_title_b || c.source_b}
                        </span>
                      </div>
                      {c.source_url_b && (
                        <a
                          href={c.source_url_b}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-black"
                          title="Inspect Source B"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <p className="text-xs font-bold text-slate-950 leading-snug font-sans">
                      {c.claim_b}
                    </p>
                  </div>

                  {/* Verbatim Supporting Excerpt B */}
                  <div className="pt-2 border-t border-slate-200 mt-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-600 flex items-center gap-1 mb-1">
                      <Quote className="w-3 h-3 text-[#6d28d9]" />
                      Grounded Excerpt (Source B):
                    </span>
                    <p className="text-[11px] text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-300 leading-relaxed font-medium">
                      "{c.supporting_excerpt_b}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Cautious Explanation & Verification Recommendation */}
              <div className="p-3.5 rounded-xl border-2 border-slate-900 bg-slate-50 space-y-2 text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-600 font-bold block mb-0.5">
                    Discrepancy Analysis:
                  </span>
                  <p className="text-slate-800 leading-relaxed font-medium">
                    {c.explanation}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-start gap-2 text-slate-900">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed font-semibold">
                    <strong className="text-amber-800">Recommended Verification Action:</strong> {c.verification_recommendation}
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
