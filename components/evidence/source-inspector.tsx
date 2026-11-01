"use client";

import * as React from "react";
import { useState } from "react";
import { FileText, Globe, Clock, ShieldCheck, ExternalLink, Hash } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SourceItem } from "@/types";

interface SourceInspectorProps {
  sources: SourceItem[];
}

export function SourceInspector({ sources }: SourceInspectorProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (!sources || sources.length === 0) {
    return null;
  }

  const active = sources[selectedIdx] || sources[0];

  return (
    <Card className="border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0f172a]">
      <CardHeader className="pb-3 border-b-2 border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-5 h-5 text-[#ec4899]" />
              <CardTitle className="text-xl font-display font-black text-slate-950">
                Source Document Inspector & Content Stream
              </CardTitle>
            </div>
            <CardDescription className="text-slate-600 font-medium">
              Raw extracted evidence with word count metrics and temporal status verification.
            </CardDescription>
          </div>
          <Badge variant="yellow" className="font-mono text-xs font-bold">
            {sources.length} Ingested Sources
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* Source Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b-2 border-slate-100">
          {sources.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shrink-0 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] ${
                selectedIdx === idx
                  ? "bg-[#fde047] text-slate-950 shadow-[1px_1px_0px_#0f172a] translate-x-[1px] translate-y-[1px]"
                  : "bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span>{s.id}</span>
              <span className="text-[10px] text-slate-600 truncate max-w-[120px]">
                {s.title}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Source Details */}
        {active && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-slate-50 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] text-xs">
              <div className="space-y-0.5">
                <div className="font-display font-bold text-slate-950 text-sm">
                  {active.title}
                </div>
                {active.url && (
                  <a
                    href={active.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-blue-700 font-mono font-bold hover:underline flex items-center gap-1"
                  >
                    {active.url}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-700 px-2 py-0.5 rounded bg-white border border-slate-900">
                  {active.wordCount} words
                </span>
                {active.temporalStatus === "outdated" ? (
                  <Badge variant="pink" className="font-bold">Outdated Cycle</Badge>
                ) : active.temporalStatus === "current" ? (
                  <Badge variant="lime" className="font-bold">Current Cycle</Badge>
                ) : (
                  <Badge variant="secondary" className="font-bold">Undated</Badge>
                )}
              </div>
            </div>

            {/* Content Pre / Viewer */}
            <div className="max-h-64 overflow-y-auto p-4 rounded-xl bg-slate-50 border-2 border-slate-900 font-mono text-xs text-slate-900 whitespace-pre-wrap leading-relaxed shadow-[2px_2px_0px_#0f172a]">
              {active.content}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
