"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Layers, 
  ArrowLeft, 
  ExternalLink, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Hash, 
  Calendar,
  AlertTriangle,
  Award,
  Globe,
  Quote
} from "lucide-react";
import { WorkspaceLayout } from "@/components/layout/workspace-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExtractedClaimsTable } from "@/components/evidence/extracted-claims-table";
import { 
  getStoredInvestigations, 
  getInvestigationById, 
  DEFAULT_INVESTIGATIONS,
  type InvestigationRecord 
} from "@/lib/store/investigations";
import { formatDate } from "@/lib/utils";

export default function EvidenceExplorerPage() {
  const params = useParams();
  const rawId = params?.id;
  const id = typeof rawId === "string" ? rawId : Array.isArray(rawId) ? rawId[0] : "";

  const [investigation, setInvestigation] = useState<InvestigationRecord | null>(() => {
    if (id) {
      const match = DEFAULT_INVESTIGATIONS.find((i) => i.id === id);
      if (match) return match;
    }
    return DEFAULT_INVESTIGATIONS[0] || null;
  });

  const [selectedSourceIdx, setSelectedSourceIdx] = useState(0);

  useEffect(() => {
    if (id) {
      const inv = getInvestigationById(id);
      if (inv) {
        setInvestigation(inv);
        return;
      }
    }
    const all = getStoredInvestigations();
    if (all.length > 0 && all[0]) setInvestigation(all[0]);
  }, [id]);

  if (!investigation) {
    return (
      <WorkspaceLayout>
        <div className="p-12 text-center space-y-4 bg-white rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a]">
          <h2 className="text-xl font-black font-display text-slate-950">Investigation Not Found</h2>
          <Button asChild size="sm" className="bg-[#fde047] hover:bg-[#facc15] text-slate-950 font-black border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]">
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </WorkspaceLayout>
    );
  }

  const sources = investigation.sources || [];
  const activeSource = sources[selectedSourceIdx] || sources[0];

  // Find all claims citing this active source
  const citingFacts = investigation.result.structured_summary.filter((fact) =>
    activeSource ? fact.sources.includes(activeSource.id) : false
  );

  const citingConflicts = investigation.result.conflicts.filter((c) =>
    activeSource ? c.sources.includes(activeSource.id) : false
  );

  const citingWarnings = investigation.result.outdated_warnings.filter((w) =>
    activeSource ? w.source === activeSource.id : false
  );

  return (
    <WorkspaceLayout>
      <div className="space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-900 pb-4">
          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              className="h-8 px-2.5 text-xs bg-white hover:bg-slate-100 text-slate-900 font-bold border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]"
            >
              <Link href={`/research/${investigation.id}`} className="flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5 text-slate-900" />
                <span>Back to Investigation</span>
              </Link>
            </Button>
            <span className="text-slate-400 font-bold">/</span>
            <span className="text-xs font-mono font-bold text-slate-600">
              Evidence Explorer
            </span>
          </div>

          <Badge variant="yellow" className="font-mono text-xs">
            {sources.length} Ingested Sources Audited
          </Badge>
        </div>

        {/* Dossier Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-[#ede9fe] border border-slate-900">
              <Layers className="w-4 h-4 text-[#6d28d9]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-950 tracking-tight">
              Evidence Base & Source Traceability
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Dossier: <span className="text-slate-950 font-bold">{investigation.topic}</span>
          </p>
        </div>

        {/* Source Navigation Carousel / Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {sources.map((src, idx) => {
            const isSelected = selectedSourceIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedSourceIdx(idx)}
                className={`text-left p-4 rounded-2xl border-2 border-slate-900 transition-all space-y-1.5 ${
                  isSelected
                    ? "bg-[#fef08a] shadow-[4px_4px_0px_#0f172a]"
                    : "bg-white hover:bg-slate-50 shadow-[2px_2px_0px_#0f172a]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black text-slate-950">
                    {src.id}
                  </span>
                  <Badge variant={src.temporalStatus === "outdated" ? "outdated" : "verified"} className="text-[9px] py-0 px-2 font-mono">
                    {src.temporalStatus.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-xs font-bold text-slate-950 truncate font-display">
                  {src.title}
                </div>
                <div className="text-[11px] text-slate-600 font-mono font-bold">
                  {src.wordCount} words • {src.reliabilityScore || 85}% credibility
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Source Detail View */}
        {activeSource && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Content Reader */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-6 rounded-3xl border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0f172a] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-200 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black px-2 py-0.5 rounded-lg bg-[#cffafe] text-[#0e7490] border border-cyan-400">
                        {activeSource.id}
                      </span>
                      <h2 className="text-base font-black font-display text-slate-950">
                        {activeSource.title}
                      </h2>
                    </div>
                    {activeSource.url && (
                      <a
                        href={activeSource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-mono font-bold"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>{activeSource.url}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-600">
                    <span>Word Count:</span>
                    <span className="text-slate-950 font-black">{activeSource.wordCount}</span>
                  </div>
                </div>

                {/* Raw Ingested Text Excerpt */}
                <div className="space-y-2">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-700 font-black flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#db2777]" />
                    <span>Raw Ingested Evidence Excerpt</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-900 text-xs font-mono text-slate-900 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto shadow-[2px_2px_0px_#0f172a]">
                    {activeSource.content}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Credibility & Claim Traceability */}
            <div className="space-y-4">
              {/* Credibility Indicator */}
              <div className="p-5 rounded-2xl border-2 border-slate-900 bg-white shadow-[3px_3px_0px_#0f172a] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-slate-600 font-bold tracking-wider">
                    Credibility Rating
                  </span>
                  <Award className="w-4 h-4 text-[#db2777]" />
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-950 font-display">
                    {activeSource.reliabilityScore || 85}
                  </span>
                  <span className="text-xs text-slate-500 font-mono font-bold">/ 100</span>
                </div>

                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-900 p-0.5">
                  <div
                    className={`h-full rounded-full ${
                      (activeSource.reliabilityScore || 85) >= 80 ? "bg-[#a3e635]" : "bg-[#fde047]"
                    }`}
                    style={{ width: `${activeSource.reliabilityScore || 85}%` }}
                  />
                </div>

                <div className="text-xs text-slate-700 space-y-1.5 pt-1 font-medium font-sans">
                  <div className="flex items-center justify-between">
                    <span>Temporal Status:</span>
                    <span className="font-mono text-slate-950 font-bold capitalize">{activeSource.temporalStatus}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Accessed At:</span>
                    <span className="font-mono text-slate-950 font-bold">{formatDate(activeSource.accessedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Claims Supported By This Source */}
              <div className="p-5 rounded-2xl border-2 border-slate-900 bg-white shadow-[3px_3px_0px_#0f172a] space-y-3">
                <span className="text-xs font-mono uppercase text-slate-700 font-bold tracking-wider block">
                  Cited In Verified Claims ({citingFacts.length})
                </span>

                {citingFacts.length === 0 ? (
                  <p className="text-xs text-slate-500 font-medium">No consensus facts derived exclusively from this stream.</p>
                ) : (
                  <div className="space-y-2">
                    {citingFacts.map((fact, fIdx) => (
                      <div key={fIdx} className="p-3 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-semibold font-sans">
                        {fact.fact}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Contradictions Involving This Source */}
              {citingConflicts.length > 0 && (
                <div className="p-5 rounded-2xl border-2 border-slate-900 bg-[#fef3c7] space-y-2.5 shadow-[3px_3px_0px_#0f172a]">
                  <span className="text-xs font-mono uppercase text-[#b45309] tracking-wider font-black flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-[#b45309]" />
                    Conflict Citations ({citingConflicts.length})
                  </span>
                  {citingConflicts.map((c, cIdx) => (
                    <div key={cIdx} className="p-3 rounded-xl bg-white border border-amber-300 text-xs space-y-1">
                      <div className="font-bold text-slate-950">{c.issue}</div>
                      <p className="text-slate-700 text-xs font-medium">{c.claim_a}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Grounded Extracted Claims Matrix */}
        {investigation.result.extracted_claims && investigation.result.extracted_claims.length > 0 && (
          <div className="pt-4">
            <ExtractedClaimsTable claims={investigation.result.extracted_claims} />
          </div>
        )}
      </div>
    </WorkspaceLayout>
  );
}
