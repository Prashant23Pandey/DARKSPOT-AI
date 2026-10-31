-- ==============================================================================
-- DARKSPOT AI — Supabase Database Migration
-- Phase 9: Complete Schema for Digital Dark Spot & Information Gap Detection Platform
-- ==============================================================================

-- 1. Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  email TEXT,
  full_name TEXT,
  organization TEXT,
  avatar_url TEXT
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Investigations Table
CREATE TABLE IF NOT EXISTS public.investigations (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  primary_question TEXT,
  objective TEXT,
  context TEXT,
  status TEXT DEFAULT 'completed' NOT NULL,
  dark_spot_index INTEGER DEFAULT 0 NOT NULL,
  is_starred BOOLEAN DEFAULT FALSE NOT NULL,
  is_demo BOOLEAN DEFAULT FALSE NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

ALTER TABLE public.investigations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own investigations or view demo records"
  ON public.investigations FOR ALL
  USING (auth.uid() = user_id OR is_demo = TRUE OR user_id IS NULL);

-- 3. Sources Table
CREATE TABLE IF NOT EXISTS public.sources (
  id TEXT PRIMARY KEY,
  investigation_id TEXT REFERENCES public.investigations(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  source_label TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT,
  source_type TEXT DEFAULT 'url' NOT NULL,
  extraction_status TEXT DEFAULT 'success' NOT NULL,
  temporal_status TEXT DEFAULT 'current' NOT NULL,
  word_count INTEGER DEFAULT 0 NOT NULL,
  reliability_score INTEGER DEFAULT 85 NOT NULL,
  content TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view sources for accessible investigations"
  ON public.sources FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.investigations i
      WHERE i.id = sources.investigation_id
      AND (i.user_id = auth.uid() OR i.is_demo = TRUE OR i.user_id IS NULL)
    )
  );

-- 4. Extracted Claims Table (Phase 4)
CREATE TABLE IF NOT EXISTS public.claims (
  id TEXT PRIMARY KEY,
  investigation_id TEXT REFERENCES public.investigations(id) ON DELETE CASCADE NOT NULL,
  source_id TEXT REFERENCES public.sources(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  claim_text TEXT NOT NULL,
  claim_category TEXT NOT NULL,
  supporting_excerpt TEXT NOT NULL,
  extraction_confidence INTEGER DEFAULT 90 NOT NULL,
  analysis_status TEXT DEFAULT 'verified' NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view claims for accessible investigations"
  ON public.claims FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.investigations i
      WHERE i.id = claims.investigation_id
      AND (i.user_id = auth.uid() OR i.is_demo = TRUE OR i.user_id IS NULL)
    )
  );

-- 5. Information Dimensions & Gaps Table (Phase 5)
CREATE TABLE IF NOT EXISTS public.gaps (
  id TEXT PRIMARY KEY,
  investigation_id TEXT REFERENCES public.investigations(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  missing_category TEXT NOT NULL,
  title TEXT NOT NULL,
  explanation TEXT NOT NULL,
  why_it_matters TEXT NOT NULL,
  suggested_next_step TEXT NOT NULL,
  priority TEXT DEFAULT 'Medium' NOT NULL,
  evidence_coverage TEXT DEFAULT 'none' NOT NULL,
  confidence_level INTEGER DEFAULT 85 NOT NULL,
  signal_label TEXT DEFAULT 'Potential Gap — Unverified in provided sources' NOT NULL,
  status_type TEXT DEFAULT 'not_found' NOT NULL
);

ALTER TABLE public.gaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view gaps for accessible investigations"
  ON public.gaps FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.investigations i
      WHERE i.id = gaps.investigation_id
      AND (i.user_id = auth.uid() OR i.is_demo = TRUE OR i.user_id IS NULL)
    )
  );

-- 6. Contradictions Table (Phase 6)
CREATE TABLE IF NOT EXISTS public.conflicts (
  id TEXT PRIMARY KEY,
  investigation_id TEXT REFERENCES public.investigations(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
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
  verification_recommendation TEXT NOT NULL,
  is_contextual_divergence BOOLEAN DEFAULT FALSE NOT NULL
);

ALTER TABLE public.conflicts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view conflicts for accessible investigations"
  ON public.conflicts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.investigations i
      WHERE i.id = conflicts.investigation_id
      AND (i.user_id = auth.uid() OR i.is_demo = TRUE OR i.user_id IS NULL)
    )
  );

-- 7. Freshness Audits Table (Phase 7)
CREATE TABLE IF NOT EXISTS public.freshness_records (
  id TEXT PRIMARY KEY,
  investigation_id TEXT REFERENCES public.investigations(id) ON DELETE CASCADE NOT NULL,
  source_id TEXT REFERENCES public.sources(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  freshness_status TEXT NOT NULL,
  publication_date TIMESTAMPTZ,
  last_updated_date TEXT,
  academic_cycle TEXT,
  freshness_explanation TEXT NOT NULL,
  temporal_drift_detected BOOLEAN DEFAULT FALSE NOT NULL,
  confidence INTEGER DEFAULT 85 NOT NULL
);

ALTER TABLE public.freshness_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view freshness records for accessible investigations"
  ON public.freshness_records FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.investigations i
      WHERE i.id = freshness_records.investigation_id
      AND (i.user_id = auth.uid() OR i.is_demo = TRUE OR i.user_id IS NULL)
    )
  );

-- 8. Verification Checklist Tasks Table (Phase 8)
CREATE TABLE IF NOT EXISTS public.checklist_items (
  id TEXT PRIMARY KEY,
  investigation_id TEXT REFERENCES public.investigations(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  priority INTEGER DEFAULT 1 NOT NULL,
  priority_level TEXT DEFAULT 'Medium' NOT NULL,
  title TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  reason_for_verification TEXT,
  related_gap_or_conflict TEXT,
  recommended_source TEXT,
  completed BOOLEAN DEFAULT FALSE NOT NULL,
  assigned_sources TEXT[] DEFAULT '{}',
  supporting_evidence_references TEXT[] DEFAULT '{}',
  estimated_effort TEXT DEFAULT 'moderate'
);

ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view and update checklist tasks for accessible investigations"
  ON public.checklist_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.investigations i
      WHERE i.id = checklist_items.investigation_id
      AND (i.user_id = auth.uid() OR i.is_demo = TRUE OR i.user_id IS NULL)
    )
  );

-- 9. Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
  id TEXT PRIMARY KEY,
  investigation_id TEXT REFERENCES public.investigations(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  summary_json JSONB NOT NULL,
  completeness_score INTEGER NOT NULL,
  is_public BOOLEAN DEFAULT TRUE NOT NULL
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public reports"
  ON public.reports FOR SELECT
  USING (is_public = TRUE);

-- Create Fast Search Indexes
CREATE INDEX IF NOT EXISTS idx_investigations_user_id ON public.investigations(user_id);
CREATE INDEX IF NOT EXISTS idx_sources_inv_id ON public.sources(investigation_id);
CREATE INDEX IF NOT EXISTS idx_claims_inv_id ON public.claims(investigation_id);
CREATE INDEX IF NOT EXISTS idx_gaps_inv_id ON public.gaps(investigation_id);
CREATE INDEX IF NOT EXISTS idx_conflicts_inv_id ON public.conflicts(investigation_id);
CREATE INDEX IF NOT EXISTS idx_checklist_inv_id ON public.checklist_items(investigation_id);
