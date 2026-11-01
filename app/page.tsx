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
  ShieldCheck,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TopTicker } from "@/components/layout/top-ticker";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafaf8] text-slate-950 flex flex-col font-sans selection:bg-[#fde047] selection:text-slate-950 relative">
      {/* 1. Top Hot Pink Marquee Ticker */}
      <TopTicker />

      {/* 2. Professional Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b-2 border-slate-900 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-display font-black text-xl tracking-tight text-slate-950 group-hover:text-[#ec4899] transition-colors">
                DARKSPOT
              </span>
              <span className="bg-[#ec4899] text-white border-2 border-slate-900 text-[10px] font-black px-2 py-0.5 rounded-lg shadow-[2px_2px_0px_#0f172a] font-display">
                AI
              </span>
              <span className="bg-[#fde047] text-slate-950 border-2 border-slate-900 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full shadow-[1.5px_1.5px_0px_#0f172a] uppercase tracking-wider hidden sm:inline-block">
                ONLINE
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-xs font-display font-bold text-slate-700">
              <a href="#workflow" className="hover:text-slate-950 transition-colors">Workflow</a>
              <a href="#features" className="hover:text-slate-950 transition-colors">Capabilities</a>
              <a href="#how-it-works" className="hover:text-slate-950 transition-colors">Methodology</a>
              <a href="#use-cases" className="hover:text-slate-950 transition-colors">Use Cases</a>
              <a href="#technology" className="hover:text-slate-950 transition-colors">Architecture</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-xs font-display font-bold bg-white text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] hover:bg-slate-50"
            >
              <Link href="/dashboard">Console Login</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="text-xs font-display font-black bg-[#fde047] hover:bg-[#facc15] text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              <Link href="/research/new" className="flex items-center gap-1.5">
                <span>Start Investigation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* 3. Hero Section (Full-screen background video) */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-16 md:py-24">
        {/* Full-screen Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="/intro.mp4"
        >
          <source src="/intro.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay Layer for Maximum Contrast & Readability */}
        <div className="absolute inset-0 bg-black/50 z-10" />

        {/* Foreground Content: Split layout with Shinchan mascot on right */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Headline & Action Buttons */}
            <div className="lg:col-span-7 text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2 border-slate-900 bg-[#ffd84d] text-slate-950 text-xs font-mono font-bold shadow-[2px_2px_0px_#0f172a]">
                <span className="h-2 w-2 rounded-full bg-[#e85a9b] animate-pulse" />
                Shinchan Online Hackathon 2026 by DEVENGERS
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight text-white leading-[1.08] drop-shadow-md">
                Discover What <br />
                <span className="text-[#e85a9b] drop-shadow-[2px_2px_0px_#0f172a]">
                  Your Research
                </span>{" "}
                <span className="bg-[#ffd84d] px-3 py-0.5 rounded-xl border-2 border-slate-900 text-slate-950 shadow-[3px_3px_0px_#0f172a] inline-block mt-1">
                  Is Missing.
                </span>
              </h1>

              <p className="max-w-xl text-base sm:text-lg text-slate-100 leading-relaxed font-medium drop-shadow-sm font-sans">
                Information blindness is rarely about lack of data—it is about what is omitted, contradicted, or quietly outdated across fragmented sources. DARKSPOT AI audits your research dossiers with Shinchan &amp; squad to surface critical blind spots.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-12 px-8 bg-[#ffd84d] hover:bg-[#facc15] text-slate-950 font-display font-black text-sm rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                >
                  <Link href="/research/new" className="flex items-center justify-center gap-2">
                    <span>Start Investigation</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 bg-white hover:bg-slate-100 text-slate-950 font-display font-bold text-sm rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                >
                  <Link href="/dashboard" className="flex items-center justify-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#e85a9b]" />
                    <span>Explore Live Dashboard</span>
                  </Link>
                </Button>
              </div>

              {/* Research Protocol Badges */}
              <div className="pt-2 flex items-center gap-2.5 flex-wrap text-[11px] font-mono font-bold text-slate-200">
                <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20">
                  ✦ Detective Mode Active
                </span>
                <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20">
                  ✦ 100% Deterministic Extraction
                </span>
                <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20">
                  ✦ Zero Citation Hallucination
                </span>
              </div>
            </div>

            {/* Right Column: Shinchan Mascot Composition */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm sm:max-w-md">
                {/* Floating Top Badge */}
                <div className="absolute -top-4 -left-4 z-30 bg-[#ffd84d] text-slate-950 border-2 border-slate-900 font-mono font-black text-xs px-3 py-1.5 rounded-xl shadow-[3px_3px_0px_#0f172a] flex items-center gap-1.5 animate-bounce" style={{ animationDuration: "3s" }}>
                  <Sparkles className="w-3.5 h-3.5 text-[#e85a9b]" />
                  <span>Lead Investigator Shinchan</span>
                </div>

                {/* Floating Bottom Badge */}
                <div className="absolute -bottom-4 -right-4 z-30 bg-[#e85a9b] text-white border-2 border-slate-900 font-mono font-black text-xs px-3 py-1.5 rounded-xl shadow-[3px_3px_0px_#0f172a]">
                  <span>DEVENGERS Hackathon 2026</span>
                </div>

                {/* Card Container */}
                <div className="rounded-3xl border-3 border-slate-900 bg-white p-6 shadow-[6px_6px_0px_#0f172a] relative overflow-hidden space-y-4">
                  <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-[#e85a9b] animate-ping" />
                      <span className="font-display font-black text-slate-950 text-sm">
                        SHINCHAN RESEARCH DESK
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] border border-slate-900">
                      ONLINE
                    </span>
                  </div>

                  {/* Character Illustration Frame */}
                  <div className="relative rounded-2xl border-2 border-slate-900 bg-[#ffd84d] overflow-hidden aspect-[4/3] flex items-center justify-center p-2 shadow-[2px_2px_0px_#0f172a]">
                    <img
                      src="/assets/shinchan/shinchan/shinchan_avatar.png"
                      alt="Shinchan Lead Detective Mascot"
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Mascot Speech Bubble */}
                  <div className="bg-[#fafaf8] rounded-xl border-2 border-slate-900 p-3 shadow-[2px_2px_0px_#0f172a] space-y-1">
                    <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                      Shinnosuke Nohara &bull; Detective Mode
                    </div>
                    <p className="text-xs text-slate-900 font-sans font-bold leading-relaxed">
                      &ldquo;Oho! Don&apos;t make high-stakes decisions with half-cooked data! My squad checks every hidden gap and conflicting deadline for you!&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3.5 Squad Section: Meet Your Research Investigation Squad */}
      <SquadSection />

      {/* 4. Animated Research Workflow Preview */}
      <section id="workflow" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-2xl border-2 border-slate-900 bg-white p-6 sm:p-8 shadow-[4px_4px_0px_#0f172a] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ec4899] animate-pulse" />
                <span className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
                  Active Detection Pipeline
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-display font-black text-slate-950">
                Undergraduate Merit Scholarship Renewal Protocols
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-rose-900 bg-rose-100 border-2 border-slate-900 px-3 py-1 rounded-lg shadow-[2px_2px_0px_#0f172a]">
                Dark Spot Index: 78/100
              </span>
              <Button asChild size="sm" variant="outline" className="h-8 text-xs font-display font-bold bg-white text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] hover:bg-[#cffafe]">
                <Link href="/research/inv-scholarship-renewal">Open Dossier</Link>
              </Button>
            </div>
          </div>

          {/* Workflow Interactive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Omission Card */}
            <div className="p-5 rounded-xl border-2 border-slate-900 bg-[#fff1f2] space-y-2.5 shadow-[3px_3px_0px_#0f172a]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-black text-rose-800 uppercase tracking-wider">
                  Critical Omission
                </span>
                <Badge variant="high" className="text-[10px] font-bold">HIGH SEVERITY</Badge>
              </div>
              <div className="font-display font-bold text-slate-950 text-sm">
                Renewal Policy Omitted
              </div>
              <p className="text-slate-700 leading-relaxed text-xs font-medium">
                None of the provided sources specify whether eligibility renews automatically or requires an annual re-application dossier.
              </p>
              <div className="pt-2 text-[10px] font-mono font-bold text-rose-900 border-t-2 border-rose-200">
                Signal: Potential Gap — Unverified in sources
              </div>
            </div>

            {/* Conflict Card */}
            <div className="p-5 rounded-xl border-2 border-slate-900 bg-[#fefce8] space-y-2.5 shadow-[3px_3px_0px_#0f172a]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-black text-amber-900 uppercase tracking-wider">
                  Direct Contradiction
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-700">Source 1 vs Source 2</span>
              </div>
              <div className="font-display font-bold text-slate-950 text-sm">
                Tax Documentation Year Conflict
              </div>
              <p className="text-slate-700 leading-relaxed text-xs font-medium">
                Source 1 mandates certified 2024 returns; Source 2 explicitly demands W-2 forms from the 2025 financial cycle.
              </p>
              <div className="pt-2 text-[10px] font-mono font-bold text-amber-900 border-t-2 border-amber-200">
                Discrepancy: Numerical / Regulatory mismatch
              </div>
            </div>

            {/* Temporal Warning Card */}
            <div className="p-5 rounded-xl border-2 border-slate-900 bg-[#fff7ed] space-y-2.5 shadow-[3px_3px_0px_#0f172a]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-black text-orange-900 uppercase tracking-wider">
                  Stale Cycle Warning
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-700">Source 3</span>
              </div>
              <div className="font-display font-bold text-slate-950 text-sm">
                Obsolete Academic Cycle Cited
              </div>
              <p className="text-slate-700 leading-relaxed text-xs font-medium">
                Historical bulletin references a 3.25 GPA standard from the 2022-2023 cohort, invalid for 2026 students.
              </p>
              <div className="pt-2 text-[10px] font-mono font-bold text-orange-900 border-t-2 border-orange-200">
                Action: Flag grandfathered terms
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Feature Sections */}
      <section id="features" className="py-20 border-t-2 border-slate-900 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fde047] border-2 border-slate-900 text-slate-950 text-xs font-mono font-bold shadow-[2px_2px_0px_#0f172a]">
              CORE INTELLIGENCE MODULES
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-950 tracking-tight">
              Engineered for Rigorous Multi-Source Cross-Examination.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Standard LLMs summarize what exists. DARKSPOT AI operates inversely: it detects what is absent, conflicting, or temporally degraded.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border-2 border-slate-900 bg-slate-50 space-y-3 shadow-[3px_3px_0px_#0f172a]">
              <div className="h-11 w-11 rounded-xl bg-rose-100 border-2 border-slate-900 flex items-center justify-center text-rose-700 shadow-[2px_2px_0px_#0f172a]">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-950">Information Gaps</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Identifies unmentioned institutional policies, omitted renewal steps, and unanswered research questions with severity ratings.
              </p>
            </div>

            <div className="p-6 rounded-2xl border-2 border-slate-900 bg-slate-50 space-y-3 shadow-[3px_3px_0px_#0f172a]">
              <div className="h-11 w-11 rounded-xl bg-amber-100 border-2 border-slate-900 flex items-center justify-center text-amber-700 shadow-[2px_2px_0px_#0f172a]">
                <GitFork className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-950">Conflicting Claims</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Isolates contradictory requirements, incompatible deadlines, and opposing claims in side-by-side comparison cards.
              </p>
            </div>

            <div className="p-6 rounded-2xl border-2 border-slate-900 bg-slate-50 space-y-3 shadow-[3px_3px_0px_#0f172a]">
              <div className="h-11 w-11 rounded-xl bg-orange-100 border-2 border-slate-900 flex items-center justify-center text-orange-700 shadow-[2px_2px_0px_#0f172a]">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-950">Temporal Freshness</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Scans for expired cycles, outdated fiscal years, and obsolete policy documents masquerading as current guidelines.
              </p>
            </div>

            <div className="p-6 rounded-2xl border-2 border-slate-900 bg-slate-50 space-y-3 shadow-[3px_3px_0px_#0f172a]">
              <div className="h-11 w-11 rounded-xl bg-emerald-100 border-2 border-slate-900 flex items-center justify-center text-emerald-700 shadow-[2px_2px_0px_#0f172a]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-950">Verification Roadmap</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Outputs ranked, actionable human verification steps to resolve discrepancies and close blind spots with progress tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. How It Works Section */}
      <section id="how-it-works" className="py-20 border-t-2 border-slate-900 bg-[#fafaf8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#cffafe] border-2 border-slate-900 text-slate-950 text-xs font-mono font-bold shadow-[2px_2px_0px_#0f172a]">
              SYSTEMATIC METHODOLOGY
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-950 tracking-tight">
              Four Steps from Evidence to Clarity
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Designed as a deterministic, reproducible verification pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border-2 border-slate-900 bg-white space-y-2 shadow-[3px_3px_0px_#0f172a]">
              <span className="px-2 py-0.5 rounded bg-[#fde047] border border-slate-900 font-mono font-black text-xs text-slate-950">
                01
              </span>
              <h4 className="font-display font-bold text-sm text-slate-950">Source Ingestion</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Feed web URLs or pasted policy excerpts. HTML content is stripped, normalized, and auto-labeled.
              </p>
            </div>

            <div className="p-5 rounded-2xl border-2 border-slate-900 bg-white space-y-2 shadow-[3px_3px_0px_#0f172a]">
              <span className="px-2 py-0.5 rounded bg-[#cffafe] border border-slate-900 font-mono font-black text-xs text-slate-950">
                02
              </span>
              <h4 className="font-display font-bold text-sm text-slate-950">Cross-Examination</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Claims are structured and compared across all source permutations to discover contradictions.
              </p>
            </div>

            <div className="p-5 rounded-2xl border-2 border-slate-900 bg-white space-y-2 shadow-[3px_3px_0px_#0f172a]">
              <span className="px-2 py-0.5 rounded bg-[#ede9fe] border border-slate-900 font-mono font-black text-xs text-slate-950">
                03
              </span>
              <h4 className="font-display font-bold text-sm text-slate-950">Dark Spot Scoring</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Calculates the Dark Spot Index (0–100), consensus score, and temporal freshness metric.
              </p>
            </div>

            <div className="p-5 rounded-2xl border-2 border-slate-900 bg-white space-y-2 shadow-[3px_3px_0px_#0f172a]">
              <span className="px-2 py-0.5 rounded bg-[#dcfce7] border border-slate-900 font-mono font-black text-xs text-slate-950">
                04
              </span>
              <h4 className="font-display font-bold text-sm text-slate-950">Actionable Roadmap</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Interactive checklist guides human reviewers to investigate omissions with direct citations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Use Cases */}
      <section id="use-cases" className="py-20 border-t-2 border-slate-900 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fce7f3] border-2 border-slate-900 text-slate-950 text-xs font-mono font-bold shadow-[2px_2px_0px_#0f172a]">
              DOMAIN APPLICATIONS
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-950 tracking-tight">
              Where Information Blindspots Are Critical
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border-2 border-slate-900 bg-slate-50 space-y-3 shadow-[3px_3px_0px_#0f172a]">
              <div className="h-10 w-10 rounded-xl bg-purple-100 border-2 border-slate-900 flex items-center justify-center text-purple-700 shadow-[2px_2px_0px_#0f172a]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-950">Higher Ed & Grants</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Identify contradictory student eligibility guidelines, undocumented renewal requirements, and stale academic cycle rules.
              </p>
            </div>

            <div className="p-6 rounded-2xl border-2 border-slate-900 bg-slate-50 space-y-3 shadow-[3px_3px_0px_#0f172a]">
              <div className="h-10 w-10 rounded-xl bg-blue-100 border-2 border-slate-900 flex items-center justify-center text-blue-700 shadow-[2px_2px_0px_#0f172a]">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-950">Policy & Compliance</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Cross-audit internal employee handbooks against changing state/federal laws to surface regulatory omissions.
              </p>
            </div>

            <div className="p-6 rounded-2xl border-2 border-slate-900 bg-slate-50 space-y-3 shadow-[3px_3px_0px_#0f172a]">
              <div className="h-10 w-10 rounded-xl bg-cyan-100 border-2 border-slate-900 flex items-center justify-center text-cyan-700 shadow-[2px_2px_0px_#0f172a]">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-950">Clinical Guidelines</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Highlight conflicting surgical thresholds, omitted medication adjustment nomograms, and outdated trial cohorts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Technology Section */}
      <section id="technology" className="py-20 border-t-2 border-slate-900 bg-[#fafaf8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fde047] border-2 border-slate-900 text-slate-950 text-xs font-mono font-bold shadow-[2px_2px_0px_#0f172a]">
              MODERN TECHNOLOGY STACK
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-950 tracking-tight">
              Enterprise Grade & Hackathon Proven
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
            <div className="p-4 rounded-xl border-2 border-slate-900 bg-white flex flex-col items-center justify-center text-center space-y-1 shadow-[2px_2px_0px_#0f172a]">
              <span className="font-bold text-slate-950">Next.js 14</span>
              <span className="text-[10px] text-slate-600">App Router</span>
            </div>
            <div className="p-4 rounded-xl border-2 border-slate-900 bg-white flex flex-col items-center justify-center text-center space-y-1 shadow-[2px_2px_0px_#0f172a]">
              <span className="font-bold text-slate-950">TypeScript</span>
              <span className="text-[10px] text-slate-600">Strict Mode</span>
            </div>
            <div className="p-4 rounded-xl border-2 border-slate-900 bg-white flex flex-col items-center justify-center text-center space-y-1 shadow-[2px_2px_0px_#0f172a]">
              <span className="font-bold text-slate-950">Tailwind CSS</span>
              <span className="text-[10px] text-slate-600">Neo System</span>
            </div>
            <div className="p-4 rounded-xl border-2 border-slate-900 bg-white flex flex-col items-center justify-center text-center space-y-1 shadow-[2px_2px_0px_#0f172a]">
              <span className="font-bold text-slate-950">Gemini 1.5</span>
              <span className="text-[10px] text-slate-600">JSON Schema</span>
            </div>
            <div className="p-4 rounded-xl border-2 border-slate-900 bg-white flex flex-col items-center justify-center text-center space-y-1 shadow-[2px_2px_0px_#0f172a]">
              <span className="font-bold text-slate-950">Supabase</span>
              <span className="text-[10px] text-slate-600">Ready Arch</span>
            </div>
            <div className="p-4 rounded-xl border-2 border-slate-900 bg-white flex flex-col items-center justify-center text-center space-y-1 shadow-[2px_2px_0px_#0f172a]">
              <span className="font-bold text-slate-950">Zod Strict</span>
              <span className="text-[10px] text-slate-600">Validation</span>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="mt-auto border-t-2 border-slate-900 bg-white py-12 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-slate-950 text-sm">DARKSPOT</span>
            <span className="bg-[#ec4899] text-white border-2 border-slate-900 text-[9px] font-black px-1.5 py-0.5 rounded shadow-[1px_1px_0px_#0f172a] font-display">
              AI
            </span>
            <span className="font-medium text-slate-600">— Shinchan Online Hackathon 2026</span>
          </div>

          <div className="flex items-center gap-6 font-display font-bold text-slate-700">
            <Link href="/dashboard" className="hover:text-slate-950">Dashboard</Link>
            <Link href="/research/new" className="hover:text-slate-950">New Investigation</Link>
            <Link href="/reports" className="hover:text-slate-950">Reports</Link>
            <Link href="/settings" className="hover:text-slate-950">Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
