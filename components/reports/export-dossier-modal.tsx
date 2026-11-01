"use client";

import * as React from "react";
import { useState } from "react";
import { Download, Copy, Check, FileJson, FileText, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DarkspotAnalysisResponse } from "@/types";

interface ExportDossierModalProps {
  result: DarkspotAnalysisResponse;
}

export function ExportDossierModal({ result }: ExportDossierModalProps) {
  const [copied, setCopied] = useState(false);

  const downloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `darkspot-analysis-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const copyMarkdown = () => {
    const md = `# DARKSPOT AI — Intelligence Dossier
**Topic:** ${result.topic}  
**Analyzed:** ${result.timestamp}  
**Dark Spot Index:** ${result.metrics.darkSpotIndex} / 100  

## Verified Consensus Facts
${result.structured_summary.map((f, i) => `${i + 1}. ${f.fact} (Sources: ${f.sources.join(", ")})`).join("\n")}

## Information Gaps & Omissions
${result.information_gaps.map((g) => `### [${g.severity}] ${g.gap_title}\n*Signal: ${g.signal_label}*\n${g.description}`).join("\n\n")}

## Contradictory Claims
${result.conflicts.map((c) => `### ${c.issue} (Between: ${c.sources.join(", ")})\n- Claim A: ${c.claim_a}\n- Claim B: ${c.claim_b}`).join("\n\n")}

## Outdated Temporal Warnings
${result.outdated_warnings.map((w) => `- **${w.source}:** ${w.warning}`).join("\n")}

## Verification Checklist
${result.verification_checklist.map((item) => `- [${item.completed ? "x" : " "}] Priority ${item.priority}: ${item.action}`).join("\n")}
`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        size="sm"
        onClick={downloadJson}
        className="text-xs h-9 bg-white hover:bg-slate-50 text-slate-900 font-bold border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5"
      >
        <Download className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
        JSON Export
      </Button>

      <Button
        type="button"
        size="sm"
        onClick={copyMarkdown}
        className="text-xs h-9 bg-white hover:bg-slate-50 text-slate-900 font-bold border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
            Copy Markdown
          </>
        )}
      </Button>

      {copied && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ffedd5] border border-orange-300 text-orange-950 text-[10px] font-mono font-bold animate-bounce">
          <Share2 className="w-3 h-3 text-[#e85a9b]" />
          <span>Himawari: Dossier Copied! ✨</span>
        </span>
      )}
    </div>
  );
}
