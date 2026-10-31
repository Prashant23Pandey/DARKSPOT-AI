"use client";

import { useState, useCallback } from "react";
import type { DarkspotAnalysisResponse, ChecklistItem } from "@/types";
import type { RawSourceInput } from "@/lib/extraction";

export interface InvestigationState {
  topic: string;
  sources: RawSourceInput[];
  isAnalyzing: boolean;
  statusMessage: string;
  engineMode: "live_gemini" | "mock_blueprint" | null;
  error: string | null;
  result: DarkspotAnalysisResponse | null;
}

export function useInvestigation() {
  const [topic, setTopic] = useState<string>("Undergraduate Merit Scholarship Renewal Protocols");
  const [sources, setSources] = useState<RawSourceInput[]>([
    {
      type: "raw_text",
      title: "University Financial Aid Official Policy (Excerpts)",
      content: `The 2024-2025 Presidential Academic Fellowship awards up to $18,000 per academic year.
Eligibility requires maintaining full-time enrollment (minimum 12 credit hours per semester) and a cumulative GPA of 3.50.
Funds are credited directly to student bursar accounts at the start of each semester.
Applicants must submit certified 2024 tax filings prior to November 15 to remain in good standing.`,
    },
    {
      type: "raw_text",
      title: "Student Handbook & Advising Portal",
      content: `Fellowship recipients must fulfill departmental research commitments and retain a 3.50 GPA.
Verification of residency and income documentation requires W-2 tax forms from the 2025 financial cycle.
Applications are reviewed on a rolling basis through December 31 with applicable administrative review.
Disbursement is processed through the university comptroller upon registrar verification.`,
    },
    {
      type: "raw_text",
      title: "Campus Legacy Archive (2022-2023 Cycle)",
      content: `Historical guidelines for the 2022-2023 fellowship program noted a 3.25 GPA threshold.
Note: Students who matriculated prior to Fall 2023 follow the grandfathered credit requirements.
Refer to previous year bulletins for expired cohort deadlines.`,
    },
  ]);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [engineMode, setEngineMode] = useState<"live_gemini" | "mock_blueprint" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DarkspotAnalysisResponse | null>(null);

  const addSource = useCallback((type: "url" | "raw_text", content: string, title?: string) => {
    setSources((prev) => [...prev, { type, content, title }]);
  }, []);

  const removeSource = useCallback((index: number) => {
    setSources((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateSource = useCallback((index: number, content: string, title?: string) => {
    setSources((prev) =>
      prev.map((s, i) => (i === index ? { ...s, content, title: title ?? s.title } : s))
    );
  }, []);

  const clearSources = useCallback(() => {
    setSources([]);
  }, []);

  const loadSamplePreset = useCallback((preset: "scholarship" | "ai_safety" | "clinical") => {
    if (preset === "scholarship") {
      setTopic("Undergraduate Merit Scholarship Renewal Protocols");
      setSources([
        {
          type: "raw_text",
          title: "University Financial Aid Official Policy",
          content: `The 2024-2025 Presidential Academic Fellowship awards up to $18,000 per academic year.
Eligibility requires maintaining full-time enrollment (minimum 12 credit hours per semester) and a cumulative GPA of 3.50.
Funds are credited directly to student bursar accounts at the start of each semester.
Applicants must submit certified 2024 tax filings prior to November 15 to remain in good standing.`,
        },
        {
          type: "raw_text",
          title: "Student Handbook & Advising Portal",
          content: `Fellowship recipients must fulfill departmental research commitments and retain a 3.50 GPA.
Verification of residency and income documentation requires W-2 tax forms from the 2025 financial cycle.
Applications are reviewed on a rolling basis through December 31 with applicable administrative review.
Disbursement is processed through the university comptroller upon registrar verification.`,
        },
        {
          type: "raw_text",
          title: "Campus Legacy Archive (2022-2023 Cycle)",
          content: `Historical guidelines for the 2022-2023 fellowship program noted a 3.25 GPA threshold.
Note: Students who matriculated prior to Fall 2023 follow grandfathered credit requirements.
Expired cycles require re-verification with financial aid counselor.`,
        },
      ]);
    } else if (preset === "ai_safety") {
      setTopic("Autonomous Agent Containment and Memory Isolation Safeguards");
      setSources([
        {
          type: "raw_text",
          title: "Safety Standard Doc v2.4 (2025 Revision)",
          content: `Agent runtime environments must enforce hardware-level memory virtualization with maximum sandbox lease time of 30 minutes.
All network egress must pass through cryptographically signed proxy filters.
Cross-session persistent memory requires cryptographic token rotation every 24 hours.`,
        },
        {
          type: "raw_text",
          title: "Deployer Operational Whitepaper",
          content: `Standard deployment guidelines recommend a 60-minute sandbox lease for compute intensive tasks.
Egress proxy validation uses standard TLS inspection with unpinned certificates.
Session memories are persisted indefinitely unless explicit reset signal is dispatched by user.`,
        },
        {
          type: "raw_text",
          title: "Legacy Technical Bulletin (2021 Security Draft)",
          content: `Archive advisory for 2021 agent architectures: basic chroot jail sandboxes are considered adequate for non-root workloads.
Notice: Does not address LLM code execution injection vectors or ephemeral tool calls.`,
        },
      ]);
    } else {
      setTopic("Post-Operative Anticoagulation Protocol in High-Risk Cardiac Surgery");
      setSources([
        {
          type: "raw_text",
          title: "Hospital Clinical Guideline 2025",
          content: `Therapeutic LMWH initiation is recommended at 24 hours post-hemostasis if chest tube drainage is under 50mL/hr.
Platelet count must exceed 100,000/uL prior to full therapeutic dosing.
Routine anti-Xa monitoring required every 12 hours for renal-impaired patients.`,
        },
        {
          type: "raw_text",
          title: "Surgical Intensive Care Unit Protocol",
          content: `Prophylactic anticoagulation begins at 12 hours post-extubation regardless of chest tube volume unless active bleeding noted.
Target platelet threshold is 75,000/uL. Anti-Xa levels checked daily.`,
        },
        {
          type: "raw_text",
          title: "Historical Retrospective Study (2019 Cohort)",
          content: `Retrospective analysis of 2018-2019 cardiac procedures utilizing unfractionated heparin infusions with aPTT targets of 60-80s.
Study conducted prior to modern direct oral anticoagulant reversal protocols.`,
        },
      ]);
    }
  }, []);

  const runAnalysis = useCallback(async () => {
    if (!topic.trim()) {
      setError("Please specify a topic for investigation.");
      return;
    }
    if (sources.length === 0) {
      setError("Please provide at least one source (URL or raw text excerpt).");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setStatusMessage("Extracting and normalizing source content…");

    try {
      setStatusMessage("Cross-examining claims and detecting dark spots…");

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          sources,
          deepScan: true,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Analysis failed to complete.");
      }

      setResult(data.result);
      setEngineMode(data.engineMode);
      setStatusMessage("Analysis complete!");
    } catch (err: unknown) {
      console.error("Investigation execution error:", err);
      setError(err instanceof Error ? err.message : "Failed to run gap analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [topic, sources]);

  const toggleChecklistItem = useCallback((id: string) => {
    setResult((prev) => {
      if (!prev) return null;
      const updatedChecklist = prev.verification_checklist.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      return {
        ...prev,
        verification_checklist: updatedChecklist,
      };
    });
  }, []);

  return {
    topic,
    setTopic,
    sources,
    addSource,
    removeSource,
    updateSource,
    clearSources,
    loadSamplePreset,
    isAnalyzing,
    statusMessage,
    engineMode,
    error,
    result,
    runAnalysis,
    toggleChecklistItem,
  };
}
