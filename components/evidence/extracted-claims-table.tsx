"use client";

import * as React from "react";
import { 
  FileCheck2, 
  Search, 
  Quote, 
  ExternalLink, 
  Calendar, 
  Hash, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Filter
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ExtractedClaim, ClaimCategory } from "@/types";

interface ExtractedClaimsTableProps {
  claims: ExtractedClaim[];
  className?: string;
}

export function ExtractedClaimsTable({ claims, className = "" }: ExtractedClaimsTableProps) {
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [selectedSource, setSelectedSource] = React.useState<string>("all");

  const categories = Array.from(new Set(claims.map((c) => c.claim_category)));
  const sourceIds = Array.from(new Set(claims.map((c) => c.source_id)));

  const filteredClaims = claims.filter((claim) => {
    if (selectedCategory !== "all" && claim.claim_category !== selectedCategory) return false;
    if (selectedSource !== "all" && claim.source_id !== selectedSource) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        claim.claim_text.toLowerCase().includes(q) ||
        claim.supporting_excerpt.toLowerCase().includes(q) ||
        claim.source_title.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getCategoryBadge = (cat: ClaimCategory) => {
    switch (cat) {
      case "Eligibility":
        return <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] border border-emerald-400">Eligibility</span>;
      case "Deadlines":
        return <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#ffe4e6] text-[#be123c] border border-rose-400">Deadlines</span>;
      case "Requirements":
        return <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#cffafe] text-[#0e7490] border border-cyan-400">Requirements</span>;
      case "Documents":
        return <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#fef3c7] text-[#b45309] border border-amber-400">Documents</span>;
      case "Fees":
        return <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#ede9fe] text-[#6d28d9] border border-purple-400">Fees</span>;
      case "Procedures":
        return <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#e0f2fe] text-[#0369a1] border border-blue-400">Procedures</span>;
      default:
        return <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300">{cat}</span>;
    }
  };

  return (
    <div className={`rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-[3px_3px_0px_#0f172a] space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-slate-900">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 rounded-lg bg-[#dcfce7] border border-slate-900">
              <FileCheck2 className="w-4 h-4 text-emerald-700" />
            </div>
            <h3 className="text-lg font-black font-display text-slate-950">
              Extracted Grounded Claims
            </h3>
          </div>
          <p className="text-slate-600 text-xs font-medium font-sans">
            Every factual claim extracted with exact verbatim supporting excerpt and source attribution.
          </p>
        </div>

        <Badge variant="yellow" className="font-mono text-xs self-start sm:self-auto">
          {filteredClaims.length} Claims Indexed
        </Badge>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search claims or excerpts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search claims or excerpts"
            className="w-full bg-white border-2 border-slate-900 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-900 placeholder:text-slate-400 shadow-[2px_2px_0px_#0f172a] focus:outline-none"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          aria-label="Filter claims by category"
          className="bg-white border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 shadow-[2px_2px_0px_#0f172a] focus:outline-none"
        >
          <option value="all">All Categories ({categories.length})</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          aria-label="Filter claims by source"
          className="bg-white border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 shadow-[2px_2px_0px_#0f172a] focus:outline-none"
        >
          <option value="all">All Sources ({sourceIds.length})</option>
          {sourceIds.map((src) => (
            <option key={src} value={src}>{src}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3 pt-2">
        {filteredClaims.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 font-medium">
            No claims found matching search criteria.
          </div>
        ) : (
          filteredClaims.map((claim, idx) => (
            <div
              key={claim.claim_id || idx}
              className="p-5 rounded-2xl border-2 border-slate-900 bg-white hover:shadow-[4px_4px_0px_#0f172a] transition-all space-y-3 shadow-[2px_2px_0px_#0f172a]"
            >
              {/* Row 1: Category, Source ID & Title, Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2 flex-wrap">
                  {getCategoryBadge(claim.claim_category)}
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-[#ede9fe] text-[#6d28d9] border border-purple-300 font-bold">
                    {claim.source_id}
                  </span>
                  <span className="text-xs text-slate-800 font-bold truncate max-w-xs font-sans">
                    {claim.source_title}
                  </span>
                  {claim.source_url && (
                    <a
                      href={claim.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-black"
                      title="Open source URL"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-slate-600 font-bold">
                    Confidence: <strong className="text-emerald-700">{Math.round(claim.extraction_confidence * 100)}%</strong>
                  </span>
                  <Badge variant="verified" className="text-[10px] py-0 px-2 font-mono">
                    {claim.analysis_status}
                  </Badge>
                </div>
              </div>

              {/* Row 2: Factual Claim Statement */}
              <p className="text-sm font-extrabold text-slate-950 leading-snug font-display">
                {claim.claim_text}
              </p>

              {/* Row 3: Verbatim Supporting Excerpt */}
              <div className="p-3 rounded-xl border-2 border-slate-900 bg-[#fafaf8] space-y-1 shadow-[1px_1px_0px_#0f172a]">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Quote className="w-3 h-3 text-[#db2777]" />
                  Supporting Verbatim Excerpt:
                </span>
                <p className="text-xs text-slate-800 italic leading-relaxed pl-3 border-l-2 border-[#db2777] font-medium font-sans">
                  "{claim.supporting_excerpt}"
                </p>
              </div>

              {/* Row 4: Entities, Dates, Numbers detected */}
              {((claim.dates_detected && claim.dates_detected.length > 0) ||
                (claim.numerical_values && claim.numerical_values.length > 0) ||
                (claim.conditions && claim.conditions.length > 0)) && (
                <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px] font-mono font-bold text-slate-700">
                  {claim.dates_detected && claim.dates_detected.length > 0 && (
                    <div className="flex items-center gap-1 bg-[#cffafe] px-2.5 py-0.5 rounded-lg border border-cyan-400 text-[#0e7490]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{claim.dates_detected.join(", ")}</span>
                    </div>
                  )}

                  {claim.numerical_values && claim.numerical_values.length > 0 && (
                    <div className="flex items-center gap-1 bg-[#fef3c7] px-2.5 py-0.5 rounded-lg border border-amber-400 text-[#b45309]">
                      <Hash className="w-3.5 h-3.5" />
                      <span>{claim.numerical_values.join(", ")}</span>
                    </div>
                  )}

                  {claim.conditions && claim.conditions.length > 0 && (
                    <div className="flex items-center gap-1 bg-[#ede9fe] px-2.5 py-0.5 rounded-lg border border-purple-400 text-[#6d28d9]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{claim.conditions.join(", ")}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
