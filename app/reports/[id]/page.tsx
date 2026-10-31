"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Printer, 
  Download, 
  Copy, 
  Check, 
  ArrowLeft, 
  Share2, 
  FileText, 
  ShieldAlert, 
  ArrowRightLeft, 
  Clock, 
  CheckCircle2, 
  Layers, 
  ExternalLink,
  Quote,
  Scale,
  Calendar,
  AlertTriangle,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TopTicker } from "@/components/layout/top-ticker";
import { 
  getInvestigationById, 
  DEFAULT_INVESTIGATIONS, 
  type InvestigationRecord 
} from "@/lib/store/investigations";
import { formatDate } from "@/lib/utils";

export default function DedicatedResearchReportPage() {
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

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  useEffect(() => {
    if (id) {
      const inv = getInvestigationById(id);
      if (inv) setInvestigation(inv);
    }
  }, [id]);

  if (!investigation) {
    return (
      <div className="min-h-screen bg-[#fafaf8] text-slate-900 p-8 flex flex-col items-center justify-center space-y-4">
        <h1 className="text-xl font-black font-display">Investigation Report Not Found</h1>
        <Button asChild className="bg-[#fde047] hover:bg-[#facc15] text-slate-950 font-black border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]">
          <Link href="/reports">Return to Reports Directory</Link>
        </Button>
      </div>
    );
  }

  const { result } = investigation;
  const metrics = result.metrics;
  const completedTasks = result.verification_checklist.filter((i) => i.completed).length;
  const totalTasks = result.verification_checklist.length;

  const handlePrint = () => {
    window.print();
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(investigation, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `darkspot-report-${investigation.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] text-slate-900 font-sans print:bg-white print:text-black">
      {/* Top Illustrative Marquee Ticker (Hidden when Printing) */}
      <div className="print:hidden">
        <TopTicker />
      </div>

      {/* Top Floating Control Bar (Hidden when Printing) */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-slate-900 px-4 sm:px-6 py-3 print:hidden shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="h-8 px-2.5 text-xs bg-white hover:bg-slate-100 text-slate-900 font-bold border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]">
              <Link href={`/research/${investigation.id}`} className="flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Workspace</span>
              </Link>
            </Button>
            <span className="text-slate-400 font-bold">/</span>
            <span className="text-xs font-mono text-slate-700 font-bold truncate max-w-xs">
              Executive Research Report
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              type="button"
              size="sm"
              onClick={handlePrint}
              className="h-9 px-4 text-xs bg-[#fde047] hover:bg-[#facc15] text-slate-950 font-black border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5"
            >
              <Printer className="w-4 h-4 mr-1.5 text-slate-950" />
              Print / Save PDF
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handleDownloadJson}
              className="h-9 px-3 text-xs bg-white hover:bg-slate-50 text-slate-900 font-bold border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
              JSON
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handleShareLink}
              className="h-9 px-3 text-xs bg-white hover:bg-slate-50 text-slate-900 font-bold border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  Link Copied
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 mr-1.5 text-[#db2777]" />
                  Share Report
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Printable Document Sheet */}
      <div className="max-w-5xl mx-auto my-6 p-6 sm:p-12 rounded-3xl border-2 border-slate-900 bg-white shadow-[5px_5px_0px_#0f172a] space-y-10 print:border-none print:shadow-none print:p-0 print:my-0">
        
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6 space-y-4 print:border-black">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#fde047] border border-slate-900 text-slate-950 font-black text-xs font-mono uppercase tracking-wider print:border-black">
                DARKSPOT AI — Research Completeness Dossier
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-600 print:text-black">
              <span>Report ID: {investigation.id}</span>
              <span>•</span>
              <span>{formatDate(investigation.createdAt)}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-950 tracking-tight print:text-black">
            {investigation.topic}
          </h1>

          {/* Section 1 & 2: Investigation Overview & Research Question */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-900 space-y-1 shadow-[2px_2px_0px_#0f172a] print:bg-white print:border-gray-300">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600 font-bold block print:text-black">
                Section 1: Primary Research Objective
              </span>
              <p className="text-xs text-slate-800 font-medium leading-relaxed print:text-black">
                {investigation.objective || "Cross-examine multi-source claims, isolate hidden criteria, and detect potential information gaps."}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#cffafe] border-2 border-slate-900 space-y-1 shadow-[2px_2px_0px_#0f172a] print:bg-white print:border-gray-300">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#0e7490] font-black block print:text-black">
                Section 2: Primary Research Question
              </span>
              <p className="text-xs text-slate-950 font-bold leading-relaxed print:text-black font-sans">
                "{investigation.researchQuestion || investigation.topic}"
              </p>
            </div>
          </div>
        </div>

        {/* Executive Metrics Summary Gauges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 print:grid-cols-4">
          <div className="p-4 rounded-2xl border-2 border-slate-900 bg-[#ffe4e6] text-center space-y-1 shadow-[2px_2px_0px_#0f172a] print:border-gray-400 print:bg-white">
            <span className="text-[10px] font-mono uppercase text-[#be123c] font-black print:text-black">Dark Spot Index</span>
            <div className="text-3xl font-black text-[#be123c] font-display print:text-black">
              {metrics.darkSpotIndex}/100
            </div>
            <span className="text-[10px] text-slate-600 font-bold block print:text-black">Information Omission Level</span>
          </div>

          <div className="p-4 rounded-2xl border-2 border-slate-900 bg-[#dcfce7] text-center space-y-1 shadow-[2px_2px_0px_#0f172a] print:border-gray-400 print:bg-white">
            <span className="text-[10px] font-mono uppercase text-[#15803d] font-black print:text-black">Completeness Score</span>
            <div className="text-3xl font-black text-[#15803d] font-display print:text-black">
              {metrics.researchCompletenessScore || 65}%
            </div>
            <span className="text-[10px] text-slate-600 font-bold block print:text-black">Verified Dimension Coverage</span>
          </div>

          <div className="p-4 rounded-2xl border-2 border-slate-900 bg-[#fef3c7] text-center space-y-1 shadow-[2px_2px_0px_#0f172a] print:border-gray-400 print:bg-white">
            <span className="text-[10px] font-mono uppercase text-[#b45309] font-black print:text-black">Contradictions</span>
            <div className="text-3xl font-black text-[#b45309] font-display print:text-black">
              {result.detailed_conflicts?.length ?? metrics.conflictCount}
            </div>
            <span className="text-[10px] text-slate-600 font-bold block print:text-black">Cross-Source Variances</span>
          </div>

          <div className="p-4 rounded-2xl border-2 border-slate-900 bg-[#ede9fe] text-center space-y-1 shadow-[2px_2px_0px_#0f172a] print:border-gray-400 print:bg-white">
            <span className="text-[10px] font-mono uppercase text-[#6d28d9] font-black print:text-black">Checklist Progress</span>
            <div className="text-3xl font-black text-[#6d28d9] font-display print:text-black">
              {completedTasks}/{totalTasks}
            </div>
            <span className="text-[10px] text-slate-600 font-bold block print:text-black">Actions Verified</span>
          </div>
        </div>

        {/* Section 3: Sources Reviewed */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2 print:border-black">
            <h2 className="text-lg font-black font-display text-slate-950 print:text-black flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-600 print:hidden" />
              Section 3: Ingested Sources Reviewed ({investigation.sources.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {investigation.sources.map((src, idx) => (
              <div key={idx} className="p-4 rounded-2xl border-2 border-slate-900 bg-white space-y-2 shadow-[2px_2px_0px_#0f172a] print:bg-white print:border-gray-300">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-lg bg-slate-100 text-slate-900 border border-slate-300 print:border-black print:text-black">
                    {src.id}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-700 print:text-black">
                    Score: {src.reliabilityScore || 85}/100
                  </span>
                </div>
                <h3 className="text-xs font-extrabold text-slate-950 line-clamp-1 font-display print:text-black">
                  {src.title}
                </h3>
                {src.url && (
                  <p className="text-[10px] font-mono text-slate-500 truncate print:text-black">
                    {src.url}
                  </p>
                )}
                <div className="text-[10px] font-mono text-slate-600 flex items-center justify-between pt-1 border-t border-slate-200 print:text-black">
                  <span>Words: {src.wordCount}</span>
                  <span className="capitalize font-bold">{src.temporalStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Key Findings */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2 print:border-black">
            <h2 className="text-lg font-black font-display text-slate-950 print:text-black flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 print:hidden" />
              Section 4: Verified Multi-Source Consensus Facts
            </h2>
          </div>

          <div className="space-y-2.5">
            {result.structured_summary.map((fact, idx) => (
              <div key={idx} className="p-4 rounded-xl border-2 border-slate-900 bg-white flex items-start gap-3.5 shadow-[2px_2px_0px_#0f172a] print:bg-white print:border-gray-300">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white text-xs font-mono font-black print:border print:border-black print:text-black">
                  {idx + 1}
                </span>
                <div className="flex-1 space-y-1">
                  <p className="text-xs sm:text-sm text-slate-900 font-semibold leading-relaxed print:text-black font-sans">
                    {fact.fact}
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    <span className="text-[10px] font-mono font-bold text-slate-500 print:text-black">Corroborating Sources:</span>
                    {fact.sources.map((s, sIdx) => (
                      <span key={sIdx} className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#ede9fe] text-[#6d28d9] border border-purple-300 print:border print:border-black print:text-black">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Extracted Grounded Claims */}
        {result.extracted_claims && result.extracted_claims.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2 print:border-black">
              <h2 className="text-lg font-black font-display text-slate-950 print:text-black flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-600 print:hidden" />
                Section 5: Extracted Claims with Grounded Excerpts ({result.extracted_claims.length})
              </h2>
            </div>

            <div className="space-y-2.5">
              {result.extracted_claims.slice(0, 6).map((claim, idx) => (
                <div key={idx} className="p-4 rounded-xl border-2 border-slate-900 bg-white space-y-2 shadow-[2px_2px_0px_#0f172a] print:bg-white print:border-gray-300">
                  <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-950 print:text-black font-display">{claim.claim_text}</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300 print:border-black print:text-black">
                        {claim.claim_category}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 print:text-black">
                      {claim.source_id} ({Math.round(claim.extraction_confidence * 100)}% conf)
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 italic bg-slate-50 p-2.5 rounded-lg border border-slate-300 print:bg-white print:border-gray-200 print:text-black font-medium">
                    "{claim.supporting_excerpt}"
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 6: Potential Information Gaps */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2 print:border-black">
            <h2 className="text-lg font-black font-display text-slate-950 print:text-black flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600 print:hidden" />
              Section 6: Potential Information Gaps & Omissions ({result.detailed_gaps?.length ?? result.information_gaps.length})
            </h2>
          </div>

          <div className="space-y-3">
            {(result.detailed_gaps || []).map((gap, idx) => (
              <div key={idx} className="p-5 rounded-2xl border-2 border-slate-900 bg-white space-y-3 shadow-[3px_3px_0px_#0f172a] print:bg-white print:border-gray-400">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full bg-[#ffe4e6] text-[#be123c] border border-rose-300 print:border-black print:text-black">
                      {gap.priority.toUpperCase()} PRIORITY
                    </span>
                    <span className="font-extrabold text-sm text-slate-950 font-display print:text-black">
                      {gap.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 print:text-black">
                    Category: {gap.missing_category}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed print:text-black">
                  {gap.explanation}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-300 print:bg-white print:border-gray-200 print:text-black">
                    <strong className="text-amber-700 block mb-0.5 print:text-black font-mono text-[10px] uppercase font-black">Why It Matters:</strong>
                    <span className="text-slate-800 font-medium">{gap.why_verification_needed || gap.description}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f0fdf4] border border-emerald-300 print:bg-white print:border-gray-200 print:text-black">
                    <strong className="text-emerald-700 block mb-0.5 print:text-black font-mono text-[10px] uppercase font-black">Suggested Next Step:</strong>
                    <span className="text-slate-900 font-bold">{gap.suggested_action}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 7: Possible Contradictions */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2 print:border-black">
            <h2 className="text-lg font-black font-display text-slate-950 print:text-black flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-amber-600 print:hidden" />
              Section 7: Possible Contradictions & Discrepancies
            </h2>
          </div>

          <div className="space-y-3.5">
            {(result.detailed_conflicts || []).map((conf, idx) => (
              <div key={idx} className="p-5 rounded-2xl border-2 border-slate-900 bg-white space-y-3 shadow-[3px_3px_0px_#0f172a] print:bg-white print:border-gray-400">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-black text-amber-800 font-mono print:text-black">
                    Dimension: {conf.comparison_dimension} ({conf.conflict_category.toUpperCase().replace(/_/g, " ")})
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-500 print:text-black">
                    Confidence: {conf.confidence}%
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#fafaf8] border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a] print:bg-white print:border-gray-300 print:text-black">
                    <span className="font-black text-cyan-800 text-[10px] uppercase block mb-1 print:text-black">{conf.source_a}:</span>
                    <p className="font-bold text-slate-900">{conf.claim_a}</p>
                    <p className="text-[11px] text-slate-600 italic mt-1 font-medium">"{conf.supporting_excerpt_a}"</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#fafaf8] border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a] print:bg-white print:border-gray-300 print:text-black">
                    <span className="font-black text-purple-800 text-[10px] uppercase block mb-1 print:text-black">{conf.source_b}:</span>
                    <p className="font-bold text-slate-900">{conf.claim_b}</p>
                    <p className="text-[11px] text-slate-600 italic mt-1 font-medium">"{conf.supporting_excerpt_b}"</p>
                  </div>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed print:text-black">
                  {conf.explanation}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 8: Freshness Warnings */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2 print:border-black">
            <h2 className="text-lg font-black font-display text-slate-950 print:text-black flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600 print:hidden" />
              Section 8: Freshness Warnings & Temporal Audit
            </h2>
          </div>

          <div className="space-y-2.5">
            {result.outdated_warnings.map((w, idx) => (
              <div key={idx} className="p-4 rounded-xl border-2 border-slate-900 bg-[#ffedd5] flex items-start gap-3 shadow-[2px_2px_0px_#0f172a] print:bg-white print:border-gray-300">
                <span className="text-xs font-mono font-black text-slate-950 shrink-0 print:text-black">{w.source}:</span>
                <div className="space-y-1">
                  <p className="text-xs text-slate-900 font-semibold print:text-black">{w.warning}</p>
                  {w.recommendedAction && (
                    <p className="text-xs font-mono font-bold text-amber-900 print:text-black">Recommendation: {w.recommendedAction}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 9: Unanswered Questions */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2 print:border-black">
            <h2 className="text-lg font-black font-display text-slate-950 print:text-black flex items-center gap-2">
              <Info className="w-5 h-5 text-cyan-600 print:hidden" />
              Section 9: Unanswered Questions & Critical Blind Spots
            </h2>
          </div>

          <div className="p-5 rounded-2xl border-2 border-slate-900 bg-white space-y-2 shadow-[2px_2px_0px_#0f172a] print:bg-white print:border-gray-300">
            <ul className="space-y-2 text-xs sm:text-sm text-slate-800 list-disc pl-5 print:text-black font-medium font-sans">
              <li>Are continuation requirements evaluated on a per-semester or cumulative annual academic cycle?</li>
              <li>What specific appeals protocol exists for participants encountering unforeseen medical interruptions?</li>
              <li>How are contradictory documentation fiscal cycles reconciled by the primary auditing body?</li>
            </ul>
          </div>
        </section>

        {/* Section 10: Prioritized Verification Roadmap */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2 print:border-black">
            <h2 className="text-lg font-black font-display text-slate-950 print:text-black flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 print:hidden" />
              Section 10: Actionable Verification Roadmap ({completedTasks}/{totalTasks} Completed)
            </h2>
          </div>

          <div className="space-y-2.5">
            {result.verification_checklist.map((item, idx) => (
              <div key={item.id || idx} className="p-4 rounded-xl border-2 border-slate-900 bg-white flex items-start gap-3 shadow-[2px_2px_0px_#0f172a] print:bg-white print:border-gray-300">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  item.completed ? "bg-[#dcfce7] text-[#15803d] border border-emerald-400 print:text-black" : "bg-slate-100 text-slate-800 border border-slate-300 print:text-black"
                }`}>
                  [{item.completed ? "VERIFIED" : "PENDING"}] P{item.priority}
                </span>
                <div className="flex-1 space-y-1">
                  <p className={`text-xs sm:text-sm ${item.completed ? "line-through text-slate-400 print:text-gray-500" : "text-slate-950 print:text-black font-bold font-sans"}`}>
                    {item.action}
                  </p>
                  {item.recommended_source && (
                    <span className="text-xs font-mono font-bold text-slate-600 block print:text-black">
                      Target: {item.recommended_source}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 11 & 12: Source References Directory & Analysis Limitations */}
        <section className="pt-6 border-t-2 border-slate-900 space-y-4 print:border-black text-xs text-slate-600 print:text-black">
          <div>
            <h3 className="font-black text-slate-950 uppercase font-mono text-xs print:text-black mb-1">
              Section 11: Complete Source Reference Directory
            </h3>
            <div className="space-y-1 font-mono text-xs text-slate-700">
              {investigation.sources.map((s) => (
                <div key={s.id}>
                  • [{s.id}] {s.title} — {s.url || "Manual Submission"} (Status: {s.temporalStatus})
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl border-2 border-slate-900 bg-slate-50 space-y-1.5 shadow-[2px_2px_0px_#0f172a] print:bg-white print:border-gray-300">
            <h3 className="font-black text-slate-950 uppercase font-mono text-xs print:text-black flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#db2777] print:hidden" />
              Section 12: Methodology, Impartiality Protocol & Analysis Limitations
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed print:text-black font-medium">
              DARKSPOT AI operates as an automated evidence cross-examination platform. All detected gaps reflect information omitted from the reviewed sources, and do not constitute proof of non-existence. Contradictions preserve both evidentiary claims without bias. Reviewers must complete prioritized verification items before drawing final administrative conclusions.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
