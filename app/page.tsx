"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Radar, 
  ArrowRight, 
  ShieldAlert, 
  GitFork, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Search, 
  Cpu, 
  Database, 
  Layers, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  BarChart3,
  Scale,
  Stethoscope,
  GraduationCap,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex flex-col selection:bg-violet-500/20 selection:text-violet-200">
      {/* 1. Professional Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-[#181c28] bg-[#08090d]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white shadow-sm">
                <Radar className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1">
                  DARKSPOT<span className="text-violet-400">.AI</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono tracking-tight -mt-0.5">
                  Shinchan Hackathon 2026
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
              <a href="#workflow" className="hover:text-slate-200 transition-colors">Workflow</a>
              <a href="#features" className="hover:text-slate-200 transition-colors">Capabilities</a>
              <a href="#how-it-works" className="hover:text-slate-200 transition-colors">Methodology</a>
              <a href="#use-cases" className="hover:text-slate-200 transition-colors">Use Cases</a>
              <a href="#technology" className="hover:text-slate-200 transition-colors">Architecture</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-xs text-slate-400 hover:text-white"
            >
              <Link href="/dashboard">Console Login</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="text-xs bg-violet-600 hover:bg-violet-500 text-white rounded-lg shadow-sm"
            >
              <Link href="/research/new" className="flex items-center gap-1.5">
                <span>Start Investigation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-950/20 text-violet-300 text-xs font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            Digital Dark Spot Platform — AI-Assisted Gap Detection
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
            Discover What Your <br />
            <span className="bg-gradient-to-r from-violet-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
              Research Is Missing.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
            Information blindness is rarely about lack of data—it is about what is omitted, contradicted, or quietly outdated across fragmented sources. DARKSPOT AI audits your dossiers to surface critical blind spots before you make high-stakes decisions.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto h-11 px-6 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-lg shadow-sm text-sm"
            >
              <Link href="/research/new" className="flex items-center gap-2">
                <span>Start Investigation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-11 px-6 border-[#242938] bg-[#0e1017] hover:bg-[#141722] text-slate-300 text-sm rounded-lg"
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-violet-400" />
                <span>Explore Live Dashboard</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 3. Animated Research Workflow Preview */}
      <section id="workflow" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-2xl border border-[#1d2230] bg-[#0c0e15] p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1a1d28] pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-violet-400" />
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Active Detection Pipeline
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Undergraduate Merit Scholarship Renewal Protocols
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-rose-400 bg-rose-950/40 border border-rose-500/30 px-2.5 py-1 rounded">
                Dark Spot Index: 78/100
              </span>
              <Button asChild size="sm" variant="outline" className="h-7 text-xs border-[#222838]">
                <Link href="/research/inv-scholarship-renewal">Open Dossier</Link>
              </Button>
            </div>
          </div>

          {/* Workflow Interactive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Omission Card */}
            <div className="p-4 rounded-xl border border-rose-500/30 bg-[#12141e] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider">
                  Critical Omission
                </span>
                <Badge variant="high" className="text-[9px]">HIGH SEVERITY</Badge>
              </div>
              <div className="font-semibold text-slate-100 text-sm">
                Renewal Policy Omitted
              </div>
              <p className="text-slate-400 leading-relaxed text-xs">
                None of the provided sources specify whether eligibility renews automatically or requires an annual re-application dossier.
              </p>
              <div className="pt-2 text-[10px] font-mono text-rose-300 border-t border-[#1d2230]">
                Signal: Potential Gap — Unverified in sources
              </div>
            </div>

            {/* Conflict Card */}
            <div className="p-4 rounded-xl border border-amber-500/30 bg-[#12141e] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                  Direct Contradiction
                </span>
                <span className="text-[10px] font-mono text-slate-400">Source 1 vs Source 2</span>
              </div>
              <div className="font-semibold text-slate-100 text-sm">
                Tax Documentation Year Conflict
              </div>
              <p className="text-slate-400 leading-relaxed text-xs">
                Source 1 mandates certified 2024 returns; Source 2 explicitly demands W-2 forms from the 2025 financial cycle.
              </p>
              <div className="pt-2 text-[10px] font-mono text-amber-300 border-t border-[#1d2230]">
                Discrepancy: Numerical / Regulatory mismatch
              </div>
            </div>

            {/* Temporal Warning Card */}
            <div className="p-4 rounded-xl border border-orange-500/30 bg-[#12141e] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-wider">
                  Stale Cycle Warning
                </span>
                <span className="text-[10px] font-mono text-slate-400">Source 3</span>
              </div>
              <div className="font-semibold text-slate-100 text-sm">
                Obsolete Academic Cycle Cited
              </div>
              <p className="text-slate-400 leading-relaxed text-xs">
                Historical bulletin references a 3.25 GPA standard from the 2022-2023 cohort, invalid for 2026 students.
              </p>
              <div className="pt-2 text-[10px] font-mono text-orange-300 border-t border-[#1d2230]">
                Action: Flag grandfathered terms
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Feature Sections */}
      <section id="features" className="py-20 border-t border-[#181c28] bg-[#090a0f]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-violet-400">
              Core Intelligence Modules
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineered for Rigorous Multi-Source Cross-Examination.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Standard LLMs summarize what exists. DARKSPOT AI operates inversely: it detects what is absent, conflicting, or temporally degraded.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl border border-[#1b1f2c] bg-[#0d0f17] space-y-3">
              <div className="h-10 w-10 rounded-lg bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Information Gaps</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Identifies unmentioned institutional policies, omitted renewal steps, and unanswered research questions with severity ratings.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#1b1f2c] bg-[#0d0f17] space-y-3">
              <div className="h-10 w-10 rounded-lg bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <GitFork className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Conflicting Claims</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Isolates contradictory requirements, incompatible deadlines, and opposing claims in side-by-side comparison cards.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#1b1f2c] bg-[#0d0f17] space-y-3">
              <div className="h-10 w-10 rounded-lg bg-orange-950/60 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Temporal Freshness</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Scans for expired cycles, outdated fiscal years, and obsolete policy documents masquerading as current guidelines.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#1b1f2c] bg-[#0d0f17] space-y-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Verification Roadmap</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Outputs ranked, actionable human verification steps to resolve discrepancies and close blind spots with progress tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section id="how-it-works" className="py-20 border-t border-[#181c28]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-violet-400">
              Systematic Methodology
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Four Steps from Evidence to Clarity
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Designed as a deterministic, reproducible verification pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl border border-[#1c202e] bg-[#0c0e15] space-y-2">
              <span className="text-xs font-mono font-bold text-violet-400">01</span>
              <h4 className="font-bold text-sm text-white">Source Ingestion</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Feed web URLs or pasted policy excerpts. HTML content is stripped, normalized, and auto-labeled.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-[#1c202e] bg-[#0c0e15] space-y-2">
              <span className="text-xs font-mono font-bold text-blue-400">02</span>
              <h4 className="font-bold text-sm text-white">Cross-Examination</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Claims are structured and compared across all source permutations to discover contradictions.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-[#1c202e] bg-[#0c0e15] space-y-2">
              <span className="text-xs font-mono font-bold text-cyan-400">03</span>
              <h4 className="font-bold text-sm text-white">Dark Spot Scoring</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates the Dark Spot Index (0–100), consensus score, and temporal freshness metric.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-[#1c202e] bg-[#0c0e15] space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-400">04</span>
              <h4 className="font-bold text-sm text-white">Actionable Roadmap</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Interactive checklist guides human reviewers to investigate omissions with direct citations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Use Cases */}
      <section id="use-cases" className="py-20 border-t border-[#181c28] bg-[#090a0f]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-violet-400">
              Domain Applications
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Where Information Blindspots Are Critical
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-[#1c202e] bg-[#0c0e15] space-y-3">
              <div className="h-9 w-9 rounded-lg bg-violet-950/70 border border-violet-500/30 flex items-center justify-center text-violet-400">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-white">Higher Ed & Grants</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Identify contradictory student eligibility guidelines, undocumented renewal requirements, and stale academic cycle rules.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#1c202e] bg-[#0c0e15] space-y-3">
              <div className="h-9 w-9 rounded-lg bg-blue-950/70 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Scale className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-white">Policy & Compliance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cross-audit internal employee handbooks against changing state/federal laws to surface regulatory omissions.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#1c202e] bg-[#0c0e15] space-y-3">
              <div className="h-9 w-9 rounded-lg bg-cyan-950/70 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Stethoscope className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-white">Clinical Guidelines</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Highlight conflicting surgical thresholds, omitted medication adjustment nomograms, and outdated trial cohorts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Technology Section */}
      <section id="technology" className="py-20 border-t border-[#181c28]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-violet-400">
              Modern Technology Stack
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Enterprise Grade & Hackathon Proven
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-lg border border-[#1c202e] bg-[#0c0e15] flex flex-col items-center justify-center text-center space-y-1">
              <span className="font-bold text-slate-200">Next.js 14</span>
              <span className="text-[10px] text-slate-500">App Router</span>
            </div>
            <div className="p-3.5 rounded-lg border border-[#1c202e] bg-[#0c0e15] flex flex-col items-center justify-center text-center space-y-1">
              <span className="font-bold text-slate-200">TypeScript</span>
              <span className="text-[10px] text-slate-500">Strict Mode</span>
            </div>
            <div className="p-3.5 rounded-lg border border-[#1c202e] bg-[#0c0e15] flex flex-col items-center justify-center text-center space-y-1">
              <span className="font-bold text-slate-200">Tailwind CSS</span>
              <span className="text-[10px] text-slate-500">Linear Palette</span>
            </div>
            <div className="p-3.5 rounded-lg border border-[#1c202e] bg-[#0c0e15] flex flex-col items-center justify-center text-center space-y-1">
              <span className="font-bold text-slate-200">Gemini 1.5</span>
              <span className="text-[10px] text-slate-500">JSON Schema</span>
            </div>
            <div className="p-3.5 rounded-lg border border-[#1c202e] bg-[#0c0e15] flex flex-col items-center justify-center text-center space-y-1">
              <span className="font-bold text-slate-200">Supabase</span>
              <span className="text-[10px] text-slate-500">Ready Arch</span>
            </div>
            <div className="p-3.5 rounded-lg border border-[#1c202e] bg-[#0c0e15] flex flex-col items-center justify-center text-center space-y-1">
              <span className="font-bold text-slate-200">Zod Strict</span>
              <span className="text-[10px] text-slate-500">Validation</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="mt-auto border-t border-[#181c28] bg-[#06070a] py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded bg-violet-600 flex items-center justify-center text-white">
              <Radar className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-300">DARKSPOT AI</span>
            <span>— Shinchan Online Hackathon 2026</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-slate-300">Dashboard</Link>
            <Link href="/research/new" className="hover:text-slate-300">New Investigation</Link>
            <Link href="/reports" className="hover:text-slate-300">Reports</Link>
            <Link href="/settings" className="hover:text-slate-300">Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
