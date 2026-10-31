import { z } from "zod";

/**
 * Zod Schemas validating inputs and outputs for the Digital Dark Spot Engine.
 * Matches backend/gap_engine.py specifications with strict parsing.
 */

export const SeverityLevelSchema = z.enum(["HIGH", "MEDIUM", "LOW"]);

export const SummaryFactSchema = z.object({
  fact: z.string().min(1, "Fact statement is required"),
  sources: z.array(z.string()).min(1, "At least one source citation is required"),
  confidence: z.number().min(0).max(100).optional(),
  verificationStatus: z.enum(["verified", "unverified", "disputed"]).default("verified"),
});

export const InformationGapSchema = z.object({
  gap_title: z.string().min(1, "Gap title is required"),
  description: z.string().min(1, "Gap description is required"),
  severity: SeverityLevelSchema,
  signal_label: z.string().default("Potential Gap — Unverified in provided sources"),
  category: z.enum(["coverage", "temporal", "methodological", "causality", "omission"]).optional(),
  suggestedSearchQueries: z.array(z.string()).optional(),
});

export const ConflictItemSchema = z.object({
  issue: z.string().min(1, "Conflict issue title is required"),
  claim_a: z.string().min(1, "Claim A is required"),
  claim_b: z.string().min(1, "Claim B is required"),
  sources: z.array(z.string()).min(1, "Citing sources are required"),
  varianceDegree: z.enum(["direct_contradiction", "numerical_discrepancy", "scope_mismatch", "temporal_drift"]).optional(),
});

export const OutdatedWarningSchema = z.object({
  source: z.string().min(1, "Source identifier is required"),
  warning: z.string().min(1, "Warning description is required"),
  detectedCycle: z.string().optional(),
});

export const ChecklistItemSchema = z.object({
  id: z.string().optional(),
  priority: z.number().int().positive(),
  action: z.string().min(1, "Action statement is required"),
  completed: z.boolean().default(false),
  assignedSources: z.array(z.string()).optional(),
});

export const AnalysisInputSourceSchema = z.object({
  type: z.enum(["url", "raw_text"]),
  content: z.string().min(5, "Source content or URL must not be empty"),
  title: z.string().optional(),
});

export const AnalysisRequestSchema = z.object({
  topic: z.string().min(2, "Topic must be at least 2 characters long"),
  sources: z.array(AnalysisInputSourceSchema).min(1, "At least one source must be provided"),
  deepScan: z.boolean().default(false),
});

export const RawGapEngineOutputSchema = z.object({
  structured_summary: z.array(SummaryFactSchema).default([]),
  information_gaps: z.array(InformationGapSchema).default([]),
  conflicts: z.array(ConflictItemSchema).default([]),
  outdated_warnings: z.array(OutdatedWarningSchema).default([]),
  verification_checklist: z.array(ChecklistItemSchema).default([]),
});

export type ValidatedAnalysisRequest = z.infer<typeof AnalysisRequestSchema>;
export type ValidatedGapEngineOutput = z.infer<typeof RawGapEngineOutputSchema>;
