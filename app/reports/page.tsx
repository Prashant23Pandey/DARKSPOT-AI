"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FileText, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldAlert, 
  GitFork, 
  Clock, 
  Search,
  Filter,
  Calendar,
  Share2,
  ArrowUpRight
} from "lucide-react";
import { WorkspaceLayout } from "@/components/layout/workspace-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  getStoredInvestigations, 
  deleteInvestigation, 
  type InvestigationRecord 
} from "@/lib/store/investigations";
import { formatDate } from "@/lib/utils";

export default function ReportsPage() {
  const [investigations, setInvestigations] = useState<InvestigationRecord[]>([]);
  const [search, setSearch] = useState("");
  const [selectedInv, setSelectedInv] = useState<InvestigationRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const list = getStoredInvestigations();
    setInvestigations(list);
    if (list.length > 0 && list[0]) {
      setSelectedInv(list[0]);
    }
  }, []);

  const handleCopyMarkdown = (inv: InvestigationRecord) => {
    const md = `# DARKSPOT AI — Research Report
**Dossier:** ${inv.topic}  
**Date:** ${inv.createdAt}  
**Dark Spot Index:** ${inv.result.metrics.darkSpotIndex} / 100  

## Executive Summary
${inv.result.structured_summary.map((s, i) => `${i + 1}. ${s.fact}`).join("\n")}

## Critical Information Gaps (${inv.result.information_gaps.length})
${inv.result.information_gaps.map((g) => `- [${g.severity}] **${g.gap_title}**: ${g.description}`).join("\n")}

## Contradictions (${inv.result.conflicts.length})
${inv.result.conflicts.map((c) => `- **${c.issue}**: Claim A: "${c.claim_a}" vs Claim B: "${c.claim_b}"`).join("\n")}

## Verification Checklist
${inv.result.verification_checklist.map((item) => `- [${item.completed ? "x" : " "}] Priority ${item.priority}: ${item.action}`).join("\n")}
`;

    navigator.clipboard.writeText(md);
    setCopiedId(inv.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadJson = (inv: InvestigationRecord) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(inv, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `darkspot-report-${inv.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filtered = investigations.filter((i) =>
    i.topic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <WorkspaceLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-900 pb-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-3xl font-black font-display text-slate-950 tracking-tight flex items-center gap-2.5">
              <FileText className="w-6 h-6 text-[#db2777]" />
              Intelligence Dossiers & Saved Reports
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Browse, inspect, and export cross-examination dossiers generated across research sessions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reports..."
                className="h-10 w-full pl-9 pr-3 text-xs font-bold bg-white border-2 border-slate-900 rounded-xl text-slate-900 placeholder:text-slate-400 shadow-[2px_2px_0px_#0f172a] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Master-Detail Report Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Col: Reports List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider block">
              Saved Investigations ({filtered.length})
            </span>

            {filtered.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border-2 border-dashed border-slate-300 text-slate-500 text-xs bg-white font-medium">
                No reports found.
              </div>
            ) : (
              <div className="space-y-2.5">
                {filtered.map((inv) => {
                  const isSelected = selectedInv?.id === inv.id;
                  const darkSpotIndex = inv.result.metrics.darkSpotIndex;
                  return (
                    <div
                      key={inv.id}
                      onClick={() => setSelectedInv(inv)}
                      className={`p-4 rounded-2xl border-2 border-slate-900 cursor-pointer transition-all space-y-2 ${
                        isSelected
                          ? "bg-[#fef08a] shadow-[4px_4px_0px_#0f172a]"
                          : "bg-white hover:bg-slate-50 shadow-[2px_2px_0px_#0f172a]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-extrabold text-sm text-slate-950 font-display line-clamp-1">
                          {inv.topic}
                        </span>
                        <span className={`text-xs font-mono font-black shrink-0 ${
                          darkSpotIndex >= 70 ? "text-[#be123c]" : darkSpotIndex >= 40 ? "text-[#b45309]" : "text-[#0e7490]"
                        }`}>
                          {darkSpotIndex}/100
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-600 font-mono font-bold">
                        <span>{formatDate(inv.createdAt)}</span>
                        <span>{inv.sources.length} Sources • {inv.result.information_gaps.length} Gaps</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Col: Report Preview & Export Actions (7 cols) */}
          <div className="lg:col-span-7">
            {selectedInv ? (
              <div className="p-6 sm:p-8 rounded-3xl border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0f172a] space-y-6">
                {/* Header & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 pb-4">
                  <div className="space-y-1">
                    <Badge variant="cyan" className="text-[10px] font-mono">
                      Report ID: {selectedInv.id}
                    </Badge>
                    <h2 className="text-xl font-black font-display text-slate-950 tracking-tight">
                      {selectedInv.topic}
                    </h2>
                    <span className="text-xs font-mono font-bold text-slate-500 block">
                      Generated: {selectedInv.createdAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleDownloadJson(selectedInv)}
                      className="text-xs h-9 bg-white hover:bg-slate-50 text-slate-900 font-bold border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5"
                    >
                      <Download className="w-3.5 h-3.5 mr-1 text-blue-600" />
                      JSON
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleCopyMarkdown(selectedInv)}
                      className="text-xs h-9 bg-white hover:bg-slate-50 text-slate-900 font-bold border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5"
                    >
                      {copiedId === selectedInv.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 mr-1 text-purple-600" />
                          Markdown
                        </>
                      )}
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className="text-xs h-9 bg-[#fde047] hover:bg-[#facc15] text-slate-950 font-black border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5"
                    >
                      <Link href={`/reports/${selectedInv.id}`}>
                        <FileText className="w-3.5 h-3.5 mr-1" />
                        Full Report
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Score Summary */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3.5 rounded-2xl bg-[#ffe4e6] border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] space-y-0.5">
                    <span className="text-[10px] font-mono uppercase text-[#be123c] font-black">Dark Spot Index</span>
                    <div className="text-2xl font-black text-[#be123c] font-display">
                      {selectedInv.result.metrics.darkSpotIndex}/100
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#fef3c7] border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] space-y-0.5">
                    <span className="text-[10px] font-mono uppercase text-[#b45309] font-black">Gaps Detected</span>
                    <div className="text-2xl font-black text-[#b45309] font-display">
                      {selectedInv.result.metrics.gapCount}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#ede9fe] border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] space-y-0.5">
                    <span className="text-[10px] font-mono uppercase text-[#6d28d9] font-black">Contradictions</span>
                    <div className="text-2xl font-black text-[#6d28d9] font-display">
                      {selectedInv.result.metrics.conflictCount}
                    </div>
                  </div>
                </div>

                {/* Information Gaps Preview */}
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-700 font-bold block">
                    Key Omissions & Dark Spots
                  </span>
                  <div className="space-y-2">
                    {selectedInv.result.information_gaps.map((gap, gIdx) => (
                      <div key={gIdx} className="p-3.5 rounded-xl border-2 border-slate-900 bg-white shadow-[2px_2px_0px_#0f172a] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-slate-950 font-display">{gap.gap_title}</span>
                          <Badge variant="high" className="text-[9px]">{gap.severity}</Badge>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">{gap.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contradictory Claims Preview */}
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-700 font-bold block">
                    Contradictory Claims
                  </span>
                  <div className="space-y-2">
                    {selectedInv.result.conflicts.map((conf, cIdx) => (
                      <div key={cIdx} className="p-3.5 rounded-xl border-2 border-slate-900 bg-white shadow-[2px_2px_0px_#0f172a] space-y-1.5">
                        <span className="font-bold text-xs text-slate-900">{conf.issue}</span>
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 pt-1">
                          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200"><strong>Claim A:</strong> {conf.claim_a}</div>
                          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200"><strong>Claim B:</strong> {conf.claim_b}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl border-2 border-dashed border-slate-300 text-slate-500 text-xs bg-white font-medium">
                Select an investigation to preview the full executive report.
              </div>
            )}
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
