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
    <Card className="border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0f172a]">
      <CardHeader className="pb-4 border-b-2 border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ec4899] animate-pulse" />
              <CardTitle className="text-xl font-display font-black text-slate-950 tracking-tight">
                Investigation Scope & Sources
              </CardTitle>
            </div>
            <CardDescription className="text-slate-600 font-medium">
              Specify the subject topic and provide multiple information sources to cross-examine for omissions, conflicts, and stale cycles.
            </CardDescription>
          </div>

          {/* Benchmark Preset Selectors */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-700 font-mono font-bold flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-[#ec4899]" />
              Presets:
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => loadSamplePreset("scholarship")}
              className="text-xs h-8 px-3 font-display font-bold bg-white text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] hover:bg-[#fde047]"
            >
              Scholarship
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => loadSamplePreset("ai_safety")}
              className="text-xs h-8 px-3 font-display font-bold bg-white text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] hover:bg-[#cffafe]"
            >
              AI Safety
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => loadSamplePreset("clinical")}
              className="text-xs h-8 px-3 font-display font-bold bg-white text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] hover:bg-[#dcfce7]"
            >
              Clinical
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-4">
        {/* Topic Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
            Topic or Target Assertion
          </label>
          <div className="relative">
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Undergraduate Merit Scholarship Renewal Protocols"
              className="bg-slate-50 border-2 border-slate-900 text-sm font-medium pl-3 pr-28 text-slate-950 shadow-[2px_2px_0px_#0f172a] focus-visible:bg-white"
            />
            <span className="absolute right-3 top-2.5 text-[10px] font-mono font-black text-slate-800 bg-[#fde047] px-2 py-0.5 rounded border border-slate-900 uppercase tracking-widest pointer-events-none">
              Dossier Target
            </span>
          </div>
        </div>

        {/* Existing Sources List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              Ingested Evidence Streams ({sources.length})
            </label>
            {sources.length > 0 && (
              <button
                type="button"
                onClick={clearSources}
                className="text-[11px] font-mono font-bold text-slate-600 hover:text-rose-600 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Clear All
              </button>
            )}
          </div>

          {sources.length === 0 ? (
            <div className="text-center p-6 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-600 text-xs font-medium">
              No sources loaded. Add a URL or paste raw text excerpts below, or pick a preset above.
            </div>
          ) : (
            <div className="space-y-2.5">
              {sources.map((s, idx) => (
                <div
                  key={idx}
                  className="group relative p-3.5 rounded-xl border-2 border-slate-900 bg-slate-50/70 shadow-[2px_2px_0px_#0f172a] transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="mt-0.5 p-1.5 rounded-lg bg-white text-slate-950 border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]">
                      {s.type === "url" ? <Globe className="w-4 h-4 text-blue-600" /> : <FileText className="w-4 h-4 text-[#ec4899]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black text-slate-950 px-2 py-0.5 rounded bg-[#fde047] border border-slate-900 shadow-[1px_1px_0px_#0f172a]">
                          Source {idx + 1}
                        </span>
                        <span className="text-xs font-display font-bold text-slate-950 truncate">
                          {s.title || (s.type === "url" ? s.content : "Text Excerpt")}
                        </span>
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-bold border-slate-900">
                          {s.type === "url" ? "URL" : "Raw Text"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-slate-700 line-clamp-2 leading-relaxed font-medium">
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
                      className="h-8 w-8 p-0 text-slate-500 hover:text-rose-600 hover:bg-rose-100 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Source Form Modal / Toggle */}
        {isAdding ? (
          <form onSubmit={handleAdd} className="p-4 rounded-xl border-2 border-slate-900 bg-white shadow-[3px_3px_0px_#0f172a] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-950 uppercase">
                Add New Source Stream
              </span>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border-2 border-slate-900">
                <button
                  type="button"
                  onClick={() => setNewType("raw_text")}
                  className={`text-xs px-2.5 py-0.5 rounded-md font-display font-bold ${newType === "raw_text" ? "bg-[#fde047] text-slate-950 border border-slate-900 shadow-[1px_1px_0px_#0f172a]" : "text-slate-600"}`}
                >
                  Raw Text
                </button>
                <button
                  type="button"
                  onClick={() => setNewType("url")}
                  className={`text-xs px-2.5 py-0.5 rounded-md font-display font-bold ${newType === "url" ? "bg-[#cffafe] text-slate-950 border border-slate-900 shadow-[1px_1px_0px_#0f172a]" : "text-slate-600"}`}
                >
                  URL
                </button>
              </div>
            </div>

            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={newType === "url" ? "Source Title / Publisher (Optional)" : "Document Label (e.g. 2025 Handbook)"}
              className="bg-slate-50 border-2 border-slate-900 text-xs font-medium text-slate-950 shadow-[1px_1px_0px_#0f172a]"
            />

            <Textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder={newType === "url" ? "https://example.edu/policy-guidelines" : "Paste policy excerpts, terms, or documentation here..."}
              rows={3}
              className="bg-slate-50 border-2 border-slate-900 text-xs font-mono text-slate-950 shadow-[1px_1px_0px_#0f172a]"
            />

            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAdding(false)}
                className="text-xs h-8 font-bold"
              >
                Cancel
              </Button>
              <Button type="submit" variant="yellow" size="sm" className="text-xs h-8">
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
            className="w-full border-2 border-dashed border-slate-900 bg-white text-slate-900 font-display font-bold hover:bg-slate-50 shadow-[2px_2px_0px_#0f172a] h-10"
          >
            <Plus className="w-4 h-4 mr-1.5 text-[#ec4899]" />
            Add Another Source Stream
          </Button>
        )}

        {/* Action Trigger */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t-2 border-slate-100">
          <div className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#ec4899]" />
            Cross-examines claim triples, detects omissions & outdated cycles.
          </div>

          <Button
            type="button"
            variant="yellow"
            size="lg"
            onClick={onAnalyze}
            disabled={isAnalyzing || sources.length === 0}
            className="w-full sm:w-auto min-w-[220px]"
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <Radar className="w-4 h-4 animate-spin text-slate-950" />
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
