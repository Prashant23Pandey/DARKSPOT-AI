"use client";

import * as React from "react";
import { useState } from "react";
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Globe, 
  FileText, 
  Radar, 
  RotateCcw,
  BookOpen
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { RawSourceInput } from "@/lib/extraction";

interface SourceInputPanelProps {
  topic: string;
  setTopic: (t: string) => void;
  sources: RawSourceInput[];
  addSource: (type: "url" | "raw_text", content: string, title?: string) => void;
  removeSource: (index: number) => void;
  updateSource: (index: number, content: string, title?: string) => void;
  clearSources: () => void;
  loadSamplePreset: (preset: "scholarship" | "ai_safety" | "clinical") => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export function SourceInputPanel({
  topic,
  setTopic,
  sources,
  addSource,
  removeSource,
  updateSource,
  clearSources,
  loadSamplePreset,
  onAnalyze,
  isAnalyzing,
}: SourceInputPanelProps) {
  const [newType, setNewType] = useState<"url" | "raw_text">("raw_text");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    addSource(newType, newContent.trim(), newTitle.trim() || undefined);
    setNewTitle("");
    setNewContent("");
    setIsAdding(false);
  };

  return (
    <Card className="border-slate-800 bg-slate-950/70 backdrop-blur-md shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <CardTitle className="text-xl font-bold tracking-tight">
                Investigation Scope & Sources
              </CardTitle>
            </div>
            <CardDescription>
              Specify the subject topic and provide multiple information sources to cross-examine for omissions, conflicts, and stale cycles.
            </CardDescription>
          </div>

          {/* Benchmark Preset Selectors */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-cyan-400" />
              Presets:
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => loadSamplePreset("scholarship")}
              className="text-xs h-7 px-2.5 bg-slate-900 border-slate-700 hover:border-cyan-500/50"
            >
              Scholarship
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => loadSamplePreset("ai_safety")}
              className="text-xs h-7 px-2.5 bg-slate-900 border-slate-700 hover:border-cyan-500/50"
            >
              AI Safety
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => loadSamplePreset("clinical")}
              className="text-xs h-7 px-2.5 bg-slate-900 border-slate-700 hover:border-cyan-500/50"
            >
              Clinical
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Topic Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
            Topic or Target Assertion
          </label>
          <div className="relative">
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Undergraduate Merit Scholarship Renewal Protocols"
              className="bg-slate-900/90 border-slate-800 text-base font-medium pl-3 pr-24 focus:border-cyan-500"
            />
            <span className="absolute right-3 top-2.5 text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest pointer-events-none">
              Dossier Target
            </span>
          </div>
        </div>

        {/* Existing Sources List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
              Ingested Evidence Streams ({sources.length})
            </label>
            {sources.length > 0 && (
              <button
                type="button"
                onClick={clearSources}
                className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Clear All
              </button>
            )}
          </div>

          {sources.length === 0 ? (
            <div className="text-center p-6 rounded-lg border border-dashed border-slate-800 bg-slate-900/30 text-slate-400 text-xs">
              No sources loaded. Add a URL or paste raw text excerpts below, or pick a preset above.
            </div>
          ) : (
            <div className="space-y-2.5">
              {sources.map((s, idx) => (
                <div
                  key={idx}
                  className="group relative p-3.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="mt-0.5 p-1.5 rounded-md bg-slate-800 text-cyan-400 border border-slate-700">
                      {s.type === "url" ? <Globe className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-cyan-300">
                          Source {idx + 1}
                        </span>
                        <span className="text-xs font-medium text-slate-200 truncate">
                          {s.title || (s.type === "url" ? s.content : "Text Excerpt")}
                        </span>
                        <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                          {s.type === "url" ? "URL" : "Raw Text"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {s.content}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center self-end sm:self-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSource(idx)}
                      className="h-7 w-7 p-0 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Source Form Modal / Toggle */}
        {isAdding ? (
          <form onSubmit={handleAdd} className="p-4 rounded-xl border border-cyan-500/30 bg-slate-900/90 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-cyan-300 uppercase">
                Add New Source Stream
              </span>
              <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-md border border-slate-700">
                <button
                  type="button"
                  onClick={() => setNewType("raw_text")}
                  className={`text-xs px-2 py-0.5 rounded ${newType === "raw_text" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400"}`}
                >
                  Raw Text
                </button>
                <button
                  type="button"
                  onClick={() => setNewType("url")}
                  className={`text-xs px-2 py-0.5 rounded ${newType === "url" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400"}`}
                >
                  URL
                </button>
              </div>
            </div>

            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={newType === "url" ? "Source Title / Publisher (Optional)" : "Document Label (e.g. 2025 Handbook)"}
              className="bg-slate-950 border-slate-700 text-xs"
            />

            <Textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder={newType === "url" ? "https://example.edu/policy-guidelines" : "Paste policy excerpts, terms, or documentation here..."}
              rows={3}
              className="bg-slate-950 border-slate-700 text-xs font-mono"
            />

            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAdding(false)}
                className="text-xs h-8"
              >
                Cancel
              </Button>
              <Button type="submit" variant="default" size="sm" className="text-xs h-8">
                Confirm Source
              </Button>
            </div>
          </form>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="w-full border-dashed border-slate-700 bg-slate-900/40 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 h-9"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Another Source Stream
          </Button>
        )}

        {/* Action Trigger */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800/80">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Cross-examines claim triples, detects omissions & outdated cycles.
          </div>

          <Button
            type="button"
            variant="cyber"
            size="lg"
            onClick={onAnalyze}
            disabled={isAnalyzing || sources.length === 0}
            className="w-full sm:w-auto min-w-[200px]"
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <Radar className="w-4 h-4 animate-spin" />
                Scanning Dark Spots…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Radar className="w-4 h-4" />
                Analyze Information Gaps
              </span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
