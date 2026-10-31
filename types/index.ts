/**
 * DARKSPOT AI — Core Domain Type Definitions
 * Digital Dark Spot: AI-Assisted Information Gap Detection Platform
 */

export type SeverityLevel = "HIGH" | "MEDIUM" | "LOW";

export type GapPriority = "Critical" | "High" | "Medium" | "Low";

export type TemporalStatus = "current" | "outdated" | "undated";

export type SourceType = "url" | "document" | "raw_text";

export type ConflictCategory = 
  | "direct_contradiction" 
  | "numerical_discrepancy" 
  | "contextual_difference"
  | "potential_inconsistency"
  | "insufficient_evidence"
  | "scope_mismatch" 
  | "temporal_drift";

export type ComparisonDimension =
  | "Dates"
  | "Deadlines"
  | "Eligibility criteria"
  | "Percentages"
  | "Monetary amounts"
  | "Document requirements"
  | "Policies"
  | "Procedures"
  | "Numerical limits"
  | "Other";

export type FreshnessCategory =
  | "potentially_current"
  | "potentially_outdated"
  | "undated"
  | "expired"
  | "freshness_uncertain";

export type ClaimCategory =
  | "Eligibility"
  | "Deadlines"
  | "Requirements"
  | "Documents"
  | "Fees"
  | "Procedures"
  | "Policies"
  | "Benefits"
  | "Restrictions"
  | "Other";

export type DimensionStatus =
  | "found"
  | "partially_found"
  | "not_found"
  | "unclear"
  | "conflicting";

export type GapStatusType =
  | "not_found"
  | "not_applicable"
  | "not_reviewed"
  | "uncertain";

export interface SourceItem {
  id: string; // e.g., "Source 1", "Source 2"
  title: string;
  url?: string;
  author?: string;
  publishedAt?: string;
  accessedAt: string;
  temporalStatus: TemporalStatus;
  content: string;
  excerpt?: string;
  wordCount: number;
  reliabilityScore?: number; // 0 - 100
  type: SourceType;
  metadata?: Record<string, unknown>;
}

export interface SummaryFact {
  fact: string;
  sources: string[];
  confidence?: number;
  verificationStatus?: "verified" | "unverified" | "disputed";
}

export interface ExtractedClaim {
  claim_id: string;
  source_id: string;
  claim_text: string;
  claim_category: ClaimCategory;
  related_question?: string;
  supporting_excerpt: string;
  source_url?: string;
  source_title: string;
  publication_date?: string;
  extraction_confidence: number; // 0 - 100
  analysis_status: "verified" | "unverified" | "contradicted" | "provisional";
  entities_detected?: string[];
  dates_detected?: string[];
  numerical_values?: string[];
  conditions?: string[];
}

export interface InformationDimension {
  id: string;
  name: string;
  category: ClaimCategory;
  description: string;
  importance: "critical" | "high" | "medium" | "low";
  status: DimensionStatus;
  mappedClaims: ExtractedClaim[];
  coveragePercentage: number; // 0 - 100
  sourcesCovering: string[];
  explanation?: string;
}

export interface InformationGap {
  gap_title: string;
  description: string;
  severity: SeverityLevel;
  signal_label: string; // e.g. "Potential Gap — Unverified in provided sources"
  category?: "coverage" | "temporal" | "methodological" | "causality" | "omission";
  suggestedSearchQueries?: string[];
  impactNotes?: string;
}

export interface DetailedInformationGap {
  gap_id: string;
  dimension_id: string;
  missing_category: ClaimCategory;
  title: string;
  explanation: string;
  why_it_matters: string;
  related_question: string;
  sources_reviewed: string[];
  evidence_coverage: "none" | "partial" | "unclear" | "conflicting";
  suggested_next_step: string;
  suggested_action?: string;
  description?: string;
  why_verification_needed?: string;
  confidence_level: number; // 0 - 100
  priority: GapPriority;
  signal_label: string;
  status_type: GapStatusType;
}

export interface DetailedConflictItem {
  conflict_id: string;
  claim_a: string;
  claim_b: string;
  source_a: string;
  source_b: string;
  supporting_excerpt_a: string;
  supporting_excerpt_b: string;
  source_url_a?: string;
  source_url_b?: string;
  source_title_a?: string;
  source_title_b?: string;
  conflict_category: ConflictCategory;
  comparison_dimension: ComparisonDimension;
  explanation: string;
  confidence: number; // 0 - 100
  verification_recommendation: string;
  is_contextual_divergence?: boolean;
}

export interface ConflictItem {
  issue: string;
  claim_a: string;
  claim_b: string;
  sources: string[];
  varianceDegree?: ConflictCategory;
  impactSeverity?: SeverityLevel;
}

export interface SourceFreshnessAudit {
  source_id: string;
  source_title: string;
  source_url?: string;
  publication_date?: string;
  last_updated_date?: string;
  academic_cycle?: string;
  referenced_years: number[];
  expiry_date?: string;
  freshness_status: FreshnessCategory;
  freshness_explanation: string;
  is_expired: boolean;
  temporal_drift_detected: boolean;
  confidence: number;
}

export interface OutdatedWarning {
  source: string;
  warning: string;
  detectedCycle?: string;
  recommendedAction?: string;
  freshnessStatus?: FreshnessCategory;
  sourceUrl?: string;
}

export interface ChecklistItem {
  id: string;
  priority: number;
  priorityLevel?: GapPriority;
  title?: string;
  action: string;
  description?: string;
  reason_for_verification?: string;
  related_gap_or_conflict?: string;
  recommended_source?: string;
  completed?: boolean;
  assignedSources?: string[];
  supporting_evidence_references?: string[];
  estimatedEffort?: "quick" | "moderate" | "deep_dive";
}

export interface AnalysisMetrics {
  totalSources: number;
  gapCount: number;
  highSeverityGaps: number;
  conflictCount: number;
  outdatedCount: number;
  verifiedFactCount: number;
  darkSpotIndex: number; // 0 - 100
  consensusScore: number; // 0 - 100
  temporalFreshnessScore: number; // 0 - 100
  researchCompletenessScore?: number; // 0 - 100
}

export interface ResearchCompletenessReport {
  overallCompletenessScore: number; // 0 - 100
  totalDimensions: number;
  foundCount: number;
  partialCount: number;
  missingCount: number;
  conflictingCount: number;
  unclearCount: number;
  priorityDistribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  dimensions: InformationDimension[];
  detailedGaps: DetailedInformationGap[];
  extractedClaims: ExtractedClaim[];
}

export interface DarkspotAnalysisResponse {
  id: string;
  topic: string;
  timestamp: string;
  sources: SourceItem[];
  structured_summary: SummaryFact[];
  information_gaps: InformationGap[];
  conflicts: ConflictItem[];
  outdated_warnings: OutdatedWarning[];
  verification_checklist: ChecklistItem[];
  metrics: AnalysisMetrics;
  // Phase 4 & Phase 5 additions
  extracted_claims?: ExtractedClaim[];
  dimensions?: InformationDimension[];
  detailed_gaps?: DetailedInformationGap[];
  completeness_report?: ResearchCompletenessReport;
  detailed_conflicts?: DetailedConflictItem[];
  freshness_audits?: SourceFreshnessAudit[];
}

export interface InvestigationSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "analyzing" | "completed" | "error";
  sources: SourceItem[];
  result?: DarkspotAnalysisResponse;
  notes?: string;
}
