-- ==============================================================================
-- DARKSPOT AI — Supabase Database Migration
-- Phase 2: Hackathon Production Schema (8 Core Tables)
-- ==============================================================================

-- 1. Investigator Profiles Table
CREATE TABLE IF NOT EXISTS public.investigator_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE,
  name TEXT NOT NULL DEFAULT 'Lead Investigator',
  role TEXT NOT NULL DEFAULT 'Research Intelligence Analyst',
  organization TEXT NOT NULL DEFAULT 'Shinchan Hackathon Team',
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.investigator_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to investigator profiles"
  ON public.investigator_profiles FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated or demo users to manage investigator profiles"
  ON public.investigator_profiles FOR ALL
  USING (true);

-- 2. Investigations Table
CREATE TABLE IF NOT EXISTS public.investigations (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES public.investigator_profiles(user_id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  research_question TEXT,
  primary_question TEXT,
  research_objective TEXT,
  objective TEXT,
  context TEXT,
  status TEXT DEFAULT 'completed' NOT NULL,
  dark_spot_index INTEGER DEFAULT 0 NOT NULL,
  is_starred BOOLEAN DEFAULT FALSE NOT NULL,
  is_demo BOOLEAN DEFAULT FALSE NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

ALTER TABLE public.investigations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to investigations"
  ON public.investigations FOR SELECT
  USING (true);

CREATE POLICY "Allow insert and update to investigations"
  ON public.investigations FOR ALL
  USING (true);

-- 3. Sources Table
CREATE TABLE IF NOT EXISTS public.sources (
  id TEXT PRIMARY KEY,
  investigation_id TEXT REFERENCES public.investigations(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  retrieved_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  source_label TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT,
  content TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  source_type TEXT DEFAULT 'url' NOT NULL,
  extraction_status TEXT DEFAULT 'success' NOT NULL,
  temporal_status TEXT DEFAULT 'current' NOT NULL,
  word_count INTEGER DEFAULT 0 NOT NULL,
  reliability_score INTEGER DEFAULT 85 NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to sources"
  ON public.sources FOR SELECT
  USING (true);

CREATE POLICY "Allow management of sources"
  ON public.sources FOR ALL
  USING (true);

-- 4. Extracted Claims Table
CREATE TABLE IF NOT EXISTS public.extracted_claims (
  id TEXT PRIMARY KEY,
  investigation_id TEXT REFERENCES public.investigations(id) ON DELETE CASCADE NOT NULL,
  source_id TEXT REFERENCES public.sources(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  claim_text TEXT NOT NULL,
  research_dimension TEXT DEFAULT 'General',
  claim_category TEXT NOT NULL,
  supporting_excerpt TEXT NOT NULL,
  extraction_confidence INTEGER DEFAULT 90 NOT NULL,
  analysis_status TEXT DEFAULT 'verified' NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

ALTER TABLE public.extracted_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to extracted_claims"
  ON public.extracted_claims FOR SELECT
  USING (true);

CREATE POLICY "Allow management of extracted_claims"
  ON public.extracted_claims FOR ALL
  USING (true);

-- 5. Information Gaps Table
CREATE TABLE IF NOT EXISTS public.information_gaps (
  id TEXT PRIMARY KEY,
  investigation_id TEXT REFERENCES public.investigations(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  dimension TEXT NOT NULL,
  missing_category TEXT NOT NULL,
  title TEXT NOT NULL,
  explanation TEXT NOT NULL,
  why_it_matters TEXT NOT NULL,
  evidence_reviewed TEXT[] DEFAULT '{}',
  suggested_next_step TEXT NOT NULL,
  severity TEXT DEFAULT 'Medium' NOT NULL,
  status TEXT DEFAULT 'unresolved' NOT NULL,
  evidence_coverage TEXT DEFAULT 'none' NOT NULL,
  confidence_level INTEGER DEFAULT 85 NOT NULL,
  signal_label TEXT DEFAULT 'Potential Gap — Unverified in provided sources' NOT NULL
);

ALTER TABLE public.information_gaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to information_gaps"
  ON public.information_gaps FOR SELECT
  USING (true);

CREATE POLICY "Allow management of information_gaps"
  ON public.information_gaps FOR ALL
  USING (true);

-- 6. Contradictions Table
CREATE TABLE IF NOT EXISTS public.contradictions (
  id TEXT PRIMARY KEY,
  investigation_id TEXT REFERENCES public.investigations(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  claim_a_id TEXT,
  claim_b_id TEXT,
  claim_a TEXT NOT NULL,
  claim_b TEXT NOT NULL,
  source_a TEXT NOT NULL,
  source_b TEXT NOT NULL,
  supporting_excerpt_a TEXT NOT NULL,
  supporting_excerpt_b TEXT NOT NULL,
  conflict_category TEXT DEFAULT 'direct_contradiction' NOT NULL,
  comparison_dimension TEXT NOT NULL,
  explanation TEXT NOT NULL,
  confidence INTEGER DEFAULT 90 NOT NULL,
  status TEXT DEFAULT 'possible_conflict' NOT NULL,
  verification_recommendation TEXT NOT NULL,
  is_contextual_divergence BOOLEAN DEFAULT FALSE NOT NULL
);

ALTER TABLE public.contradictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to contradictions"
  ON public.contradictions FOR SELECT
  USING (true);

CREATE POLICY "Allow management of contradictions"
  ON public.contradictions FOR ALL
  USING (true);

-- 7. Verification Tasks Table
CREATE TABLE IF NOT EXISTS public.verification_tasks (
  id TEXT PRIMARY KEY,
  investigation_id TEXT REFERENCES public.investigations(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  priority INTEGER DEFAULT 1 NOT NULL,
  priority_level TEXT DEFAULT 'Medium' NOT NULL,
  title TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  reason TEXT,
  related_gap_id TEXT,
  related_gap_or_conflict TEXT,
  recommended_source TEXT,
  status TEXT DEFAULT 'pending' NOT NULL, -- pending, in_progress, verified, unable_to_verify
  completed BOOLEAN DEFAULT FALSE NOT NULL,
  assigned_sources TEXT[] DEFAULT '{}',
  supporting_evidence_references TEXT[] DEFAULT '{}',
  estimated_effort TEXT DEFAULT 'moderate'
);

ALTER TABLE public.verification_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to verification_tasks"
  ON public.verification_tasks FOR SELECT
  USING (true);

CREATE POLICY "Allow management of verification_tasks"
  ON public.verification_tasks FOR ALL
  USING (true);

-- 8. Analysis Runs Table
CREATE TABLE IF NOT EXISTS public.analysis_runs (
  id TEXT PRIMARY KEY DEFAULT ('run_' || gen_random_uuid()),
  investigation_id TEXT REFERENCES public.investigations(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  started_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at TIMESTAMPTZ,
  analysis_method TEXT DEFAULT 'deterministic_engine' NOT NULL, -- deterministic_engine, gemini_hybrid
  analysis_status TEXT DEFAULT 'completed' NOT NULL,
  summary TEXT,
  metrics JSONB DEFAULT '{}'::jsonb NOT NULL
);

ALTER TABLE public.analysis_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to analysis_runs"
  ON public.analysis_runs FOR SELECT
  USING (true);

CREATE POLICY "Allow management of analysis_runs"
  ON public.analysis_runs FOR ALL
  USING (true);

-- ==============================================================================
-- Backwards Compatibility Views for Existing Code
-- ==============================================================================
CREATE OR REPLACE VIEW public.claims AS 
  SELECT * FROM public.extracted_claims;

CREATE OR REPLACE VIEW public.gaps AS 
  SELECT * FROM public.information_gaps;

CREATE OR REPLACE VIEW public.conflicts AS 
  SELECT * FROM public.contradictions;

CREATE OR REPLACE VIEW public.checklist_items AS 
  SELECT * FROM public.verification_tasks;

-- ==============================================================================
-- Fast Search & Foreign Key Indexes
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_investigations_user_id ON public.investigations(user_id);
CREATE INDEX IF NOT EXISTS idx_sources_inv_id ON public.sources(investigation_id);
CREATE INDEX IF NOT EXISTS idx_claims_inv_id ON public.extracted_claims(investigation_id);
CREATE INDEX IF NOT EXISTS idx_claims_source_id ON public.extracted_claims(source_id);
CREATE INDEX IF NOT EXISTS idx_gaps_inv_id ON public.information_gaps(investigation_id);
CREATE INDEX IF NOT EXISTS idx_conflicts_inv_id ON public.contradictions(investigation_id);
CREATE INDEX IF NOT EXISTS idx_verification_tasks_inv_id ON public.verification_tasks(investigation_id);
CREATE INDEX IF NOT EXISTS idx_analysis_runs_inv_id ON public.analysis_runs(investigation_id);
