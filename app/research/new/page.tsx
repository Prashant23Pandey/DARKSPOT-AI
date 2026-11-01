"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Radar, 
  Plus, 
  Trash2, 
  Globe, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  BookOpen, 
  ArrowRight,
  Info,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  Loader2,
  Database
} from "lucide-react";
import { WorkspaceLayout } from "@/components/layout/workspace-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { persistInvestigation } from "@/lib/repository";
import type { InvestigationRecord } from "@/lib/store/investigations";
import type { SourceItem } from "@/types";

export interface ManagedSourceItem {
  id: string; // "Source 1", "Source 2"
  title: string;
  type: "url" | "manual_text";
  url?: string;
  publishedAt?: string;
  content: string;
  extractionStatus: "pending" | "extracting" | "success" | "failed" | "blocked";
  extractionError?: string;
  wordCount: number;
  temporalStatus: "current" | "outdated" | "undated";
  reliabilityScore: number;
}

export default function NewResearchPage() {
  const router = useRouter();

  // Core Input Fields
  const [title, setTitle] = useState("Undergraduate Fellowship Continuity & Renewal Audit");
  const [topic, setTopic] = useState("Undergraduate Merit Scholarship Renewal Protocols");
  const [question, setQuestion] = useState(
    "What are the exact continuity conditions, documentation deadlines, and renewal terms for undergraduate merit awards?"
  );
  const [objective, setObjective] = useState(
    "Identify discrepancies in required GPA, documentation tax years, and omitted annual re-application procedures."
  );
  const [context, setContext] = useState(
    "Focus on student cohorts matriculating in 2024 or later; flag references to legacy grandfathered policies."
  );

  // Source Collection
  const [sources, setSources] = useState<ManagedSourceItem[]>([
    {
      id: "Source 1",
      title: "University Financial Aid Official Policy (Excerpts)",
      type: "manual_text",
      content: `The 2024-2025 Presidential Academic Fellowship awards up to $18,000 per academic year.
Eligibility requires maintaining full-time enrollment (minimum 12 credit hours per semester) and a cumulative GPA of 3.50.
Funds are credited directly to student bursar accounts at the start of each semester.
Applicants must submit certified 2024 tax filings prior to November 15 to remain in good standing.`,
      extractionStatus: "success",
      wordCount: 68,
      temporalStatus: "current",
      reliabilityScore: 92,
    },
    {
      id: "Source 2",
      title: "Student Handbook & Advising Portal",
      type: "manual_text",
      content: `Fellowship recipients must fulfill departmental research commitments and retain a 3.50 GPA.
Verification of residency and income documentation requires W-2 tax forms from the 2025 financial cycle.
Applications are reviewed on a rolling basis through December 31 with applicable administrative review.
Disbursement is processed through the university comptroller upon registrar verification.`,
      extractionStatus: "success",
      wordCount: 72,
      temporalStatus: "current",
      reliabilityScore: 88,
    },
  ]);

  // URL Input State
  const [newUrl, setNewUrl] = useState("");
  const [urlValidationError, setUrlValidationError] = useState<string | null>(null);

  // Search Integration State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ title: string; url: string; snippet: string }>>([]);
  const [searchMessage, setSearchMessage] = useState<string | null>(null);
  const [isSearchConfigured, setIsSearchConfigured] = useState<boolean | null>(null);

  // Progress & Execution State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // -------------------------------------------------------------
  // URL Validation & Addition
  // -------------------------------------------------------------
  const validateUrlFormat = (val: string): boolean => {
    try {
      const parsed = new URL(val.trim());
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleAddUrl = async (urlToAdd?: string) => {
    const targetUrl = (urlToAdd || newUrl).trim();
    setUrlValidationError(null);

    if (!targetUrl) return;

    if (!validateUrlFormat(targetUrl)) {
      setUrlValidationError("Invalid URL format. Please include http:// or https://");
      return;
    }

    // Duplicate URL Prevention
    const isDuplicate = sources.some(
      (s) => s.type === "url" && s.url?.toLowerCase() === targetUrl.toLowerCase()
    );
    if (isDuplicate) {
      setUrlValidationError(`URL has already been added as a source stream.`);
      return;
    }

    const nextIndex = sources.length + 1;
    let domainName = "Web Source";
    try {
      domainName = new URL(targetUrl).hostname.replace(/^www\./, "");
    } catch {
      domainName = targetUrl;
    }

    const newSource: ManagedSourceItem = {
      id: `Source ${nextIndex}`,
      title: `${domainName}`,
      type: "url",
      url: targetUrl,
      content: "",
      extractionStatus: "pending",
      wordCount: 0,
      temporalStatus: "undated",
      reliabilityScore: 80,
    };

    setSources((prev) => [...prev, newSource]);
    if (!urlToAdd) setNewUrl("");

    // Trigger extraction for this URL immediately
    extractSingleUrl(newSource.id, targetUrl);
  };

  const extractSingleUrl = async (sourceId: string, url: string) => {
    setSources((prev) =>
      prev.map((s) => (s.id === sourceId ? { ...s, extractionStatus: "extracting", extractionError: undefined } : s))
    );

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || `HTTP ${res.status}: Extraction failed`);
      }

      const data = json.data;
      setSources((prev) =>
        prev.map((s) =>
          s.id === sourceId
            ? {
                ...s,
                title: data.title || s.title,
                content: data.content,
                wordCount: data.wordCount,
                temporalStatus: data.temporalStatus,
                reliabilityScore: data.reliabilityScore,
                extractionStatus: "success",
              }
            : s
        )
      );
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to extract webpage content.";
      const isBlocked = errorMessage.includes("blocked") || errorMessage.includes("restricted") || errorMessage.includes("SSRF");

      setSources((prev) =>
        prev.map((s) =>
          s.id === sourceId
            ? {
                ...s,
                extractionStatus: isBlocked ? "blocked" : "failed",
                extractionError: errorMessage,
              }
            : s
        )
      );
    }
  };

  const handleRemoveSource = (id: string) => {
    setSources((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateManualContent = (id: string, content: string) => {
    setSources((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const words = content.trim().split(/\s+/).filter(Boolean).length;
        return {
          ...s,
          content,
          wordCount: words,
          extractionStatus: words > 0 ? "success" : s.extractionStatus,
        };
      })
    );
  };

  const handleUpdateSourceTitle = (id: string, title: string) => {
    setSources((prev) => prev.map((s) => (s.id === id ? { ...s, title } : s)));
  };

  const handleUpdateSourcePublishedAt = (id: string, publishedAt: string) => {
    setSources((prev) => prev.map((s) => (s.id === id ? { ...s, publishedAt } : s)));
  };

  const getSourceDuplicateWarning = (source: ManagedSourceItem): string | null => {
    if (source.type === "url" && source.url) {
      const duplicates = sources.filter(
        (s) => s.id !== source.id && s.url?.trim().toLowerCase() === source.url?.trim().toLowerCase()
      );
      const first = duplicates[0];
      if (first) return `Duplicate URL detected (also in ${first.id})`;
    }
    if (source.content && source.content.trim().length > 40) {
      const snippet = source.content.trim().toLowerCase();
      const duplicates = sources.filter(
        (s) => s.id !== source.id && s.content.trim().toLowerCase() === snippet
      );
      const first = duplicates[0];
      if (first) return `Duplicate content detected (identical to ${first.id})`;
    }
    return null;
  };

  const handleAddManualTextSource = () => {
    const nextIndex = sources.length + 1;
    setSources((prev) => [
      ...prev,
      {
        id: `Source ${nextIndex}`,
        title: `Manual Document Excerpt #${nextIndex}`,
        type: "manual_text",
        content: "",
        extractionStatus: "pending",
        wordCount: 0,
        temporalStatus: "undated",
        reliabilityScore: 85,
      },
    ]);
  };

  // -------------------------------------------------------------
  // Optional Search Integration
  // -------------------------------------------------------------
  const handleExecuteSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchMessage(null);
    setSearchResults([]);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery.trim(), maxResults: 4 }),
      });

      const data = await res.json();
      setIsSearchConfigured(data.isConfigured);

      if (data.results && data.results.length > 0) {
        setSearchResults(data.results);
      } else {
        setSearchMessage(data.message || "No results found for this query.");
      }
    } catch (err: unknown) {
      setSearchMessage(err instanceof Error ? err.message : "Search query failed.");
    } finally {
      setIsSearching(false);
    }
  };

  // -------------------------------------------------------------
  // Sample Presets
  // -------------------------------------------------------------
  const loadPreset = (preset: "scholarship" | "ai_safety" | "clinical") => {
    if (preset === "scholarship") {
      setTitle("2025-2026 Undergraduate Merit Scholarship Renewal Audit");
      setTopic("Undergraduate Merit Scholarship Renewal Protocols");
      setQuestion("What are the exact continuity conditions, documentation deadlines, and renewal terms for undergraduate merit awards?");
      setObjective("Identify discrepancies in required GPA, documentation tax years, and omitted annual re-application procedures.");
      setContext("Focus on student cohorts matriculating in 2024 or later; flag references to legacy grandfathered policies.");
      setSources([
        {
          id: "Source 1",
          title: "University Financial Aid Official Policy (Excerpts)",
          type: "manual_text",
          content: `The 2024-2025 Presidential Academic Fellowship awards up to $18,000 per academic year.
Eligibility requires maintaining full-time enrollment (minimum 12 credit hours per semester) and a cumulative GPA of 3.50.
Funds are credited directly to student bursar accounts at the start of each semester.
Applicants must submit certified 2024 tax filings prior to November 15 to remain in good standing.`,
          extractionStatus: "success",
          wordCount: 68,
          temporalStatus: "current",
          reliabilityScore: 92,
        },
        {
          id: "Source 2",
          title: "Student Handbook & Advising Portal",
          type: "manual_text",
          content: `Fellowship recipients must fulfill departmental research commitments and retain a 3.50 GPA.
Verification of residency and income documentation requires W-2 tax forms from the 2025 financial cycle.
Applications are reviewed on a rolling basis through December 31 with applicable administrative review.
Disbursement is processed through the university comptroller upon registrar verification.`,
          extractionStatus: "success",
          wordCount: 72,
          temporalStatus: "current",
          reliabilityScore: 88,
        },
        {
          id: "Source 3",
          title: "Campus Legacy Archive (2022-2023 Cycle)",
          type: "manual_text",
          content: `Historical guidelines for the 2022-2023 fellowship program noted a 3.25 GPA threshold.
Note: Students who matriculated prior to Fall 2023 follow grandfathered credit requirements.
Expired cycles require re-verification with financial aid counselor.`,
          extractionStatus: "success",
          wordCount: 46,
          temporalStatus: "outdated",
          reliabilityScore: 48,
        },
      ]);
    } else if (preset === "ai_safety") {
      setTitle("Autonomous Agent Persistent Memory Isolation Review");
      setTopic("Autonomous Agent Memory Sandboxing & Network Egress");
      setQuestion("Are multi-agent persistent memory architectures properly isolated and cryptographically protected against session injection?");
      setObjective("Compare memory lease durations, cryptographic key rotation standards, and unpinned egress proxy risks.");
      setContext("Evaluate enterprise deployments against RFC draft specs.");
      setSources([
        {
          id: "Source 1",
          title: "Agent Safety Protocol v2.4 (2025 Revision)",
          type: "manual_text",
          content: `Agent runtime environments must enforce hardware-level memory virtualization with maximum sandbox lease time of 30 minutes.
All network egress must pass through cryptographically signed proxy filters.
Cross-session persistent memory requires cryptographic token rotation every 24 hours.`,
          extractionStatus: "success",
          wordCount: 82,
          temporalStatus: "current",
          reliabilityScore: 95,
        },
        {
          id: "Source 2",
          title: "Enterprise Deployer Operational Whitepaper",
          type: "manual_text",
          content: `Standard deployment guidelines recommend a 60-minute sandbox lease for compute intensive tasks.
Egress proxy validation uses standard TLS inspection with unpinned certificates.
Session memories are persisted indefinitely unless explicit reset signal is dispatched by user.`,
          extractionStatus: "success",
          wordCount: 78,
          temporalStatus: "current",
          reliabilityScore: 84,
        },
      ]);
    } else {
      setTitle("Post-Operative Anticoagulation Protocol Audit");
      setTopic("Post-Operative Anticoagulation Protocol in High-Risk Cardiac Surgery");
      setQuestion("What is the optimal timing and platelet threshold for initiating therapeutic anticoagulation after sternotomy?");
      setObjective("Highlight conflicting surgical ICU thresholds and omitted renal anti-Xa titration schedules.");
      setContext("High-risk adult cardiac surgeries involving cardiopulmonary bypass.");
      setSources([
        {
          id: "Source 1",
          title: "Hospital Clinical Guideline 2025",
          type: "manual_text",
          content: `Therapeutic LMWH initiation is recommended at 24 hours post-hemostasis if chest tube drainage is under 50mL/hr.
Platelet count must exceed 100,000/uL prior to full therapeutic dosing.
Routine anti-Xa monitoring required every 12 hours for renal-impaired patients.`,
          extractionStatus: "success",
          wordCount: 88,
          temporalStatus: "current",
          reliabilityScore: 98,
        },
        {
          id: "Source 2",
          title: "Surgical Intensive Care Unit Protocol",
          type: "manual_text",
          content: `Prophylactic anticoagulation begins at 12 hours post-extubation regardless of chest tube volume unless active bleeding noted.
Target platelet threshold is 75,000/uL. Anti-Xa levels checked daily.`,
          extractionStatus: "success",
          wordCount: 75,
          temporalStatus: "current",
          reliabilityScore: 89,
        },
      ]);
    }
    setFormErrors({});
  };

  // -------------------------------------------------------------
  // Full Submission Flow
  // -------------------------------------------------------------
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!title.trim()) errors.title = "Investigation title is required.";
    if (!topic.trim()) errors.topic = "Research topic is required.";

    const sourcesWithContent = sources.filter((s) => s.content.trim().length > 0);
    if (sourcesWithContent.length === 0) {
      errors.sources = "At least one source with readable text or successfully extracted URL is required.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    setCurrentStep("Validating research parameters and extracted evidence...");

    try {
      // Step 1: Format sources for gap analysis
      const analysisSourcesPayload = sourcesWithContent.map((s) => ({
        type: s.type === "url" ? ("url" as const) : ("raw_text" as const),
        content: s.content,
        title: s.title,
      }));

      setCurrentStep("Initiating Digital Dark Spot Engine & cross-examining claims...");

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          sources: analysisSourcesPayload,
          deepScan: true,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to analyze evidence dossier.");
      }

      setCurrentStep("Persisting investigation and source records to database...");

      // Step 2: Build complete InvestigationRecord entity
      const newId = `inv-${Date.now().toString(36)}`;
      const transformedSources: SourceItem[] = sourcesWithContent.map((s, idx) => ({
        id: `Source ${idx + 1}`,
        title: s.title,
        url: s.url,
        publishedAt: s.publishedAt || undefined,
        accessedAt: new Date().toISOString(),
        temporalStatus: s.temporalStatus,
        content: s.content,
        wordCount: s.wordCount,
        reliabilityScore: s.reliabilityScore,
        type: s.type === "url" ? "url" : "raw_text",
      }));

      const newRecord: InvestigationRecord = {
        id: newId,
        topic: topic.trim(),
        researchQuestion: question.trim() || `What critical omissions and conflicts exist within ${topic}?`,
        objective: objective.trim() || "Multi-source evidence cross-examination.",
        createdAt: new Date().toISOString(),
        status: "completed",
        sources: transformedSources,
        result: data.result,
        tags: ["Live Investigation", "AI Cross-Examined"],
      };

      // Step 3: Persist via dual-mode repository (Supabase if available, otherwise Local Development Mode)
      await persistInvestigation(newRecord);

      setCurrentStep("Ready! Navigating to Investigation Workspace...");
      router.push(`/research/${newId}`);
    } catch (err: unknown) {
      console.error("Submission failed:", err);
      setFormErrors({
        form: err instanceof Error ? err.message : "An unexpected error occurred during investigation execution.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <WorkspaceLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Shinchan Research Workbench Welcome Banner */}
        <div className="rounded-2xl border-2 border-slate-900 bg-white p-5 sm:p-6 shadow-[4px_4px_0px_#0f172a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ffd84d] border border-slate-900 text-slate-950 text-[10px] font-mono font-bold shadow-[1px_1px_0px_#0f172a]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e85a9b] animate-pulse" />
              Shinchan Hackathon 2026 &bull; DEVENGERS
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-black text-slate-950 tracking-tight">
              Let&apos;s Investigate Something Interesting!
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 font-sans font-medium">
              Enter your research question, collect your sources and let DARKSPOT AI uncover what might be missing.
            </p>
          </div>

          {/* Benchmark Preset Selectors */}
          <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-center shrink-0">
            <span className="text-[11px] font-mono font-bold text-slate-700 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-[#e85a9b]" />
              Presets:
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => loadPreset("scholarship")}
              className="text-xs h-8 px-3 font-display font-bold bg-white text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] hover:bg-[#ffd84d]"
            >
              Scholarship
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => loadPreset("ai_safety")}
              className="text-xs h-8 px-3 font-display font-bold bg-white text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] hover:bg-[#ffd84d]"
            >
              AI Governance
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => loadPreset("clinical")}
              className="text-xs h-8 px-3 font-display font-bold bg-white text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] hover:bg-[#dcfce7]"
            >
              Clinical
            </Button>
          </div>
        </div>

        {/* Form Error Banner */}
        {formErrors.form && (
          <div className="p-4 rounded-xl border-2 border-rose-600 bg-rose-50 text-rose-900 text-xs flex items-start gap-3 shadow-[3px_3px_0px_#e11d48]">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
            <div>
              <div className="font-display font-bold text-sm text-rose-950">Investigation Submission Error</div>
              <p className="text-rose-800 text-xs mt-0.5 font-medium">{formErrors.form}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleAnalyze} className="space-y-6">
          {/* Section 1: Research Scope & Meta */}
          <div className="p-5 sm:p-6 rounded-2xl border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0f172a] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#fde047] border border-slate-900 font-black">01</span>
                Research Scope & Parameters
              </span>
              <span className="text-[11px] font-mono text-slate-500 font-semibold">Strict Parameter Validation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Investigation Title */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-800 font-bold flex items-center justify-between">
                  <span>Investigation Title *</span>
                  {formErrors.title && <span className="text-rose-600 text-xs normal-case font-bold">{formErrors.title}</span>}
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 2025-2026 Undergraduate Merit Scholarship Renewal Audit"
                  className="h-10 bg-slate-50 border-2 border-slate-900 text-xs font-medium text-slate-950 shadow-[2px_2px_0px_#0f172a] focus-visible:bg-white"
                />
              </div>

              {/* Research Topic */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-800 font-bold flex items-center justify-between">
                  <span>Research Topic / Target Assertion *</span>
                  {formErrors.topic && <span className="text-rose-600 text-xs normal-case font-bold">{formErrors.topic}</span>}
                </label>
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Undergraduate Merit Scholarship Renewal Protocols"
                  className="h-10 bg-slate-50 border-2 border-slate-900 text-xs font-medium text-slate-950 shadow-[2px_2px_0px_#0f172a] focus-visible:bg-white"
                />
              </div>

              {/* Primary Research Question */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-700 font-bold">
                  Primary Research Question
                </label>
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What are the exact continuity conditions, documentation deadlines, and renewal terms?"
                  rows={2}
                  className="bg-slate-50 border-2 border-slate-900 text-xs font-medium text-slate-950 shadow-[2px_2px_0px_#0f172a] focus-visible:bg-white"
                />
              </div>

              {/* Research Objective */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-700 font-bold">
                  Research Objective
                </label>
                <Textarea
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="Identify discrepancies in required GPA, documentation tax years, and omitted annual re-application procedures."
                  rows={2}
                  className="bg-slate-50 border-2 border-slate-900 text-xs font-medium text-slate-950 shadow-[2px_2px_0px_#0f172a] focus-visible:bg-white"
                />
              </div>

              {/* Optional Context */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-700 font-bold">
                  Optional Context & Scope Constraints
                </label>
                <Input
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g. Focus on undergraduates matriculating in Fall 2024 or later; exclude athletic endowments."
                  className="h-9 bg-slate-50 border-2 border-slate-900 text-xs font-medium text-slate-950 shadow-[2px_2px_0px_#0f172a] focus-visible:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Optional Search Engine Integration */}
          <div className="p-5 sm:p-6 rounded-2xl border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0f172a] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
              <div className="space-y-0.5">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#cffafe] border border-slate-900 font-black">02</span>
                  <Search className="w-4 h-4 text-slate-900" />
                  <span>Optional Search Integration</span>
                </span>
                <p className="text-[11px] text-slate-600 font-medium">
                  Search across public search providers if configured (Tavily, SerpApi). Zero hallucinations.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search web for policy docs or regulatory standards..."
                className="h-10 bg-slate-50 border-2 border-slate-900 text-xs font-medium text-slate-950 shadow-[2px_2px_0px_#0f172a] flex-1 focus-visible:bg-white"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleExecuteSearch}
                disabled={isSearching}
                className="h-10 text-xs font-display font-bold bg-[#fde047] text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] hover:bg-[#facc15]"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Query Provider"}
              </Button>
            </div>

            {searchMessage && (
              <div className="p-3 rounded-xl bg-amber-50 border-2 border-amber-300 text-xs text-amber-900 flex items-start gap-2 shadow-[2px_2px_0px_#f59e0b]">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span className="font-medium">{searchMessage}</span>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="space-y-2 pt-2 border-t-2 border-slate-100">
                <span className="text-[11px] font-mono text-slate-700 font-bold uppercase">Search Results:</span>
                <div className="grid grid-cols-1 gap-2">
                  {searchResults.map((res, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3 rounded-xl border-2 border-slate-900 bg-slate-50 flex items-center justify-between gap-3 text-xs shadow-[2px_2px_0px_#0f172a]"
                    >
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="font-bold text-slate-950 truncate font-display">{res.title}</div>
                        <div className="text-[10px] text-slate-600 font-mono truncate">{res.url}</div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddUrl(res.url)}
                        className="text-xs h-7 shrink-0 font-bold bg-white text-slate-900 border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a] hover:bg-[#dcfce7]"
                      >
                        + Add Stream
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Source Collection Features (URLs & Text) */}
          <div className="p-5 sm:p-6 rounded-2xl border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0f172a] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#ec4899] text-white border border-slate-900 font-black">03</span>
                  Source Collection & Evidence Streams
                </span>
                <p className="text-[11px] text-slate-600 font-medium">
                  Protected against SSRF and private network attacks. Server-side text and metadata extraction.
                </p>
              </div>

              {formErrors.sources && (
                <span className="text-rose-600 text-xs font-mono font-bold">{formErrors.sources}</span>
              )}
            </div>

            {/* URL Ingestion Interface */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-800 font-bold flex items-center justify-between">
                <span>Add Webpage URL</span>
                {urlValidationError && (
                  <span className="text-rose-600 text-xs normal-case font-bold">{urlValidationError}</span>
                )}
              </label>

              <div className="flex items-center gap-2">
                <Input
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://example.edu/financial-aid/renewal-guidelines"
                  className="h-10 bg-slate-50 border-2 border-slate-900 text-xs font-medium text-slate-950 shadow-[2px_2px_0px_#0f172a] flex-1 focus-visible:bg-white"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddUrl()}
                  className="h-10 px-3 text-xs font-display font-bold bg-[#cffafe] text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] hover:bg-cyan-200"
                >
                  <Globe className="w-4 h-4 mr-1 text-slate-950" />
                  Fetch & Add URL
                </Button>
              </div>
            </div>

            {/* Collected Sources List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-800 font-bold">
                <span>Active Source Dossier Streams ({sources.length})</span>
                <button
                  type="button"
                  onClick={handleAddManualTextSource}
                  className="px-2.5 py-1 rounded-md bg-[#ede9fe] border-2 border-slate-900 text-purple-900 shadow-[1px_1px_0px_#0f172a] hover:bg-purple-200 flex items-center gap-1 text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Manual Text Stream
                </button>
              </div>

              {sources.map((s) => (
                <div
                  key={s.id}
                  className="p-4 rounded-xl border-2 border-slate-900 bg-slate-50/70 space-y-3 relative shadow-[3px_3px_0px_#0f172a]"
                >
                  {/* Source Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-slate-200 pb-2">
                    <div className="flex items-center gap-2 flex-1 flex-wrap">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-white border border-slate-900 shadow-[1px_1px_0px_#fde047]">
                        {s.id}
                      </span>
                      <Input
                        value={s.title}
                        onChange={(e) => handleUpdateSourceTitle(s.id, e.target.value)}
                        placeholder="Source Title / Publisher Name"
                        className="h-8 text-xs font-bold bg-white border-2 border-slate-900 max-w-xs shadow-[1px_1px_0px_#0f172a]"
                      />
                      <Input
                        type="text"
                        value={s.publishedAt || ""}
                        onChange={(e) => handleUpdateSourcePublishedAt(s.id, e.target.value)}
                        placeholder="Pub Date (YYYY-MM-DD)"
                        className="h-8 text-xs font-mono bg-white border-2 border-slate-900 w-36 shadow-[1px_1px_0px_#0f172a]"
                        title="Optional publication date for temporal freshness analysis"
                      />
                      <Badge variant="outline" className="text-[10px] uppercase font-mono font-bold bg-white text-slate-900 border-2 border-slate-900">
                        {s.type === "url" ? "Web URL" : "Manual Text"}
                      </Badge>
                    </div>

                    {/* Extraction Status Badge */}
                    <div className="flex items-center gap-2">
                      {s.extractionStatus === "pending" && (
                        <Badge variant="secondary" className="text-[10px] font-mono font-bold">
                          Pending
                        </Badge>
                      )}
                      {s.extractionStatus === "extracting" && (
                        <Badge variant="cyan" className="text-[10px] font-mono font-bold animate-pulse gap-1">
                          <Loader2 className="w-2.5 h-2.5 animate-spin" />
                          Extracting
                        </Badge>
                      )}
                      {s.extractionStatus === "success" && (
                        <Badge variant="lime" className="text-[10px] font-mono font-bold">
                          ✓ {s.wordCount} words
                        </Badge>
                      )}
                      {s.extractionStatus === "failed" && (
                        <Badge variant="pink" className="text-[10px] font-mono font-bold">
                          Extraction Failed
                        </Badge>
                      )}
                      {s.extractionStatus === "blocked" && (
                        <Badge variant="pink" className="text-[10px] font-mono font-bold">
                          SSRF Blocked
                        </Badge>
                      )}

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSource(s.id)}
                        disabled={sources.length === 1}
                        className="h-7 w-7 p-0 text-slate-500 hover:text-rose-600 hover:bg-rose-100 rounded-md"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Duplicate Source Warning */}
                  {getSourceDuplicateWarning(s) && (
                    <div className="p-2.5 rounded-lg bg-amber-50 border-2 border-amber-400 text-amber-950 text-xs font-bold flex items-center gap-2 shadow-[2px_2px_0px_#f59e0b]">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{getSourceDuplicateWarning(s)}</span>
                    </div>
                  )}

                  {/* URL Reference or Error notice */}
                  {s.url && (
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-700">
                      <span className="truncate max-w-md text-blue-700 font-semibold">{s.url}</span>
                      <button
                        type="button"
                        onClick={() => extractSingleUrl(s.id, s.url!)}
                        className="text-purple-700 hover:underline flex items-center gap-1 shrink-0 font-bold"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Re-fetch
                      </button>
                    </div>
                  )}

                  {s.extractionError && (
                    <div className="p-2.5 rounded-lg bg-rose-50 border-2 border-rose-400 text-rose-900 text-xs space-y-1 shadow-[2px_2px_0px_#f43f5e]">
                      <div className="font-bold flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        Extraction Warning: {s.extractionError}
                      </div>
                      <p className="text-[11px] text-slate-700 font-medium">
                        Webpage was unavailable or blocked. You can supply manual text below as a fallback.
                      </p>
                    </div>
                  )}

                  {/* Source Content Textarea */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-600">
                      <span>Document Text Excerpt:</span>
                      <span>{s.wordCount} words</span>
                    </div>
                    <Textarea
                      value={s.content}
                      onChange={(e) => handleUpdateManualContent(s.id, e.target.value)}
                      placeholder={
                        s.type === "url"
                          ? "Content will be populated from server extraction, or paste excerpt here if failed..."
                          : "Paste document excerpt, handbook criteria, or policy statements here..."
                      }
                      rows={3}
                      className="bg-white border-2 border-slate-900 text-xs font-mono text-slate-900 shadow-[2px_2px_0px_#0f172a]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submission Bar */}
          <div className="p-5 sm:p-6 rounded-2xl border-2 border-slate-900 bg-white shadow-[4px_4px_0px_#0f172a] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-left w-full sm:w-auto">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-950 font-bold">
                <Database className="w-4 h-4 text-[#ec4899]" />
                <span>Persistence: Auto-saved to repository upon execution</span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium">
                Cross-examines claims, detects temporal drift, and outputs prioritized roadmap.
              </p>
            </div>

            <Button
              type="submit"
              onClick={handleAnalyze}
              disabled={isSubmitting}
              className="w-full sm:w-auto h-12 px-8 bg-[#fde047] hover:bg-[#facc15] text-slate-950 font-display font-black text-sm rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all shrink-0"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2 font-mono">
                  <Radar className="w-4 h-4 animate-spin text-slate-950" />
                  <span>{currentStep || "Processing..."}</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>Analyze & Detect Dark Spots</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </WorkspaceLayout>
  );
}
