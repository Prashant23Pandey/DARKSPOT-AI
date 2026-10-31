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
    <Card className="border-slate-800 bg-slate-950/70 backdrop-blur-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-cyan-400" />
              <CardTitle className="text-lg font-bold">
                Source Document Inspector & Content Stream
              </CardTitle>
            </div>
            <CardDescription>
              Raw extracted evidence with word count metrics and temporal status verification.
            </CardDescription>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            {sources.length} Ingested Sources
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Source Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800/80">
          {sources.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors shrink-0 ${
                selectedIdx === idx
                  ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
                  : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
              }`}
            >
              <span>{s.id}</span>
              <span className="text-[10px] text-slate-500 truncate max-w-[120px]">
                {s.title}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Source Details */}
        {active && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
              <div className="space-y-0.5">
                <div className="font-semibold text-slate-200">
                  {active.title}
                </div>
                {active.url && (
                  <a
                    href={active.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    {active.url}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-400">
                  {active.wordCount} words
                </span>
                {active.temporalStatus === "outdated" ? (
                  <Badge variant="outdated">Outdated Cycle</Badge>
                ) : active.temporalStatus === "current" ? (
                  <Badge variant="verified">Current Cycle</Badge>
                ) : (
                  <Badge variant="secondary">Undated</Badge>
                )}
              </div>
            </div>

            {/* Content Pre / Viewer */}
            <div className="max-h-64 overflow-y-auto p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
              {active.content}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
