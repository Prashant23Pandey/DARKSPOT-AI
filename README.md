# DARKSPOT AI — Digital Dark Spot & Information Gap Detection Platform

> **Shinchan Online Hackathon 2026**
> Official Problem Statement: *"Digital Dark Spot – AI-Assisted Information Gap Detection Platform"*

DARKSPOT AI is a research intelligence and information verification platform built with Next.js App Router, TypeScript, Tailwind CSS, Lucide React, and Supabase. It analyzes heterogeneous documents and webpages on a topic to discover what is missing, identify conflicting claims, flag outdated temporal baselines, and formulate an evidence-grounded verification roadmap.

---

## 🌟 Key Capabilities (Phases 1 – 9)

1. **Information Extraction & Grounding (Phase 4)**:
   - Chunking, entity recognition, and sentence-level fact extraction.
   - Grounded excerpts linked to source URLs, confidence scoring, and categorical tagging.

2. **Autonomous Gap & Dark Spot Detection (Phase 5)**:
   - Topic-adaptive dimension derivation (e.g. eligibility, renewal, deadlines, documentation, funding limits).
   - Uncompromising transparency phrasing: *"Potential information gap: [Item] was not found in the sources reviewed."*
   - Research Completeness Score based on weighted dimension coverage.

3. **Cross-Source Contradiction Engine (Phase 6)**:
   - Pairwise cross-examination across dates, numerical limits, criteria, and procedures.
   - **Contextual Divergence Guardrails**: Distinguishes authentic contradictions from cohort variations (e.g., in-state vs. out-of-state, freshman vs. transfer).
   - **Impartiality Protocol**: Neither source is assumed correct; both sides of the evidence are presented side-by-side.

4. **Temporal Freshness & Cycle Engine (Phase 7)**:
   - Categorizes sources into 5 freshness states (`potentially_current`, `potentially_outdated`, `undated`, `expired`, `freshness_uncertain`).
   - Flags obsolete academic cycles (e.g. 2022-2023 vs. 2024-2026) and stale operational guidelines.

5. **Actionable Verification Planner & Executive Report Generator (Phase 8)**:
   - Synthesizes gaps, contradictions, and freshness warnings into a prioritized checklist with recommended sources and estimated effort.
   - Interactive checklist with real-time progress tracking and persistent state.
   - 12-Section Executive Research Report with Print / Save PDF styling (`@media print`), Markdown copying, and JSON export.

6. **Full-Stack Architecture & Dual Persistence Engine (Phase 9)**:
   - **Supabase Integration**: PostgreSQL schema (`supabase/migrations/001_complete_schema.sql`) with Row Level Security (RLS) policies for users, investigations, sources, claims, gaps, conflicts, freshness records, and checklists.
   - **Local Demonstration Mode**: Transparent fallback when Supabase keys are not configured, providing a complete demonstration environment with preloaded, realistic investigations kept separate from user data (`is_demo`).
   - **Security-First**: Server-side API key isolation, Zod input validation, private IP/loopback SSRF blocking, and safe content rendering.

---

## 🏛️ Architecture Overview

```
darkspot-ai/
├── app/
│   ├── api/
│   │   ├── analyze/            # AI analysis pipeline & gap detection endpoint
│   │   ├── extract/            # Safe server-side webpage scraper with SSRF protection
│   │   └── search/             # Research search provider abstraction
│   ├── dashboard/              # Investigative console with telemetry & persistence banner
│   ├── evidence/[id]/          # Detailed comparative evidence & conflict analysis
│   ├── reports/                # Executive report directory
│   │   └── [id]/               # 12-section printable & exportable research dossier
│   ├── research/
│   │   ├── [id]/               # Research workspace with Verification Roadmap
│   │   └── new/                # Guided multi-source investigation creation wizard
│   ├── settings/               # System & persistence configuration
│   └── page.tsx                # High-conversion landing page
├── components/
│   ├── dashboard/              # Metrics, persistence banner, investigation cards
│   ├── evidence/               # Detailed conflicts view with Impartiality Protocol
│   ├── reports/                # Verification checklist view, freshness timeline
│   └── ui/                     # Accessible UI components (badges, buttons, cards, progress)
├── lib/
│   ├── analysis/
│   │   ├── conflict-engine.ts  # Contradiction detection & contextual guardrails
│   │   ├── engine.ts           # Central analysis orchestrator
│   │   ├── freshness-engine.ts # Academic cycle & date expiration detector
│   │   ├── gap-engine.ts       # Topic dimension derivation & dark spot analyzer
│   │   └── planner.ts          # Verification checklist synthesizer
│   ├── extraction/             # Server-side HTML cleanup & text extraction
│   ├── repository/             # Dual-mode repository (Supabase + Local Demo)
│   ├── store/                  # Client-side investigation state manager
│   └── supabase/               # Supabase client configuration & types
└── supabase/
    └── migrations/
        └── 001_complete_schema.sql # 9 PostgreSQL tables with RLS
```

---

## 🚀 Quickstart & Setup

### 1. Installation

```bash
npm install
```

### 2. Run Unified Engine Test Suite (Phases 1 – 9)

```bash
node scripts/run-tests.mjs
```

All 9 test suites validate:
1. Text normalization & entity extraction
2. Grounded claim categorization
3. Topic-adaptive dimension derivation
4. Gap detection & transparency language
5. Completeness score calculation
6. Contradiction detection & contextual divergence guardrails
7. Information freshness & cycle classification
8. Verification checklist synthesis & progress tracking
9. 12-section report generation & demo separation

### 3. TypeScript Typecheck & Production Build

```bash
npm run typecheck
npm run build
```

### 4. Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access DARKSPOT AI.

---

## 🔒 Security & Safe Ingestion

- **SSRF Guard**: The extraction endpoint (`/api/extract`) validates all target hostnames, blocking private CIDR blocks (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), `localhost`, and AWS/cloud metadata services (`169.254.169.254`).
- **Sanitized Extraction**: HTML parsing discards script, style, and iframe tags, preserving structured text without executing client-side scripts.
- **Zero Hallucination Protocol**: Gaps and conflicts are strictly grounded in reviewed sources. Never fabricates citations or marks incomplete verification checks as completed.

---

## 📜 License & Hackathon Context

Built for the **Shinchan Online Hackathon 2026**.
Developed with pride by the DARKSPOT AI engineering team.
