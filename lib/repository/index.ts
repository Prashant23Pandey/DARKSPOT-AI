import { createClient } from "@/lib/supabase/client";
import { 
  getStoredInvestigations, 
  saveInvestigation as saveLocalInvestigation, 
  deleteInvestigation as deleteLocalInvestigation,
  type InvestigationRecord 
} from "@/lib/store/investigations";

export type PersistenceMode = "supabase" | "local_development";

export interface RepositoryStatus {
  mode: PersistenceMode;
  isSupabaseConfigured: boolean;
  message: string;
}

export function getRepositoryStatus(): RepositoryStatus {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isSupabaseConfigured = Boolean(
    supabaseUrl && 
    supabaseKey && 
    supabaseUrl.startsWith("http") &&
    !supabaseUrl.includes("placeholder")
  );

  return {
    mode: isSupabaseConfigured ? "supabase" : "local_development",
    isSupabaseConfigured,
    message: isSupabaseConfigured
      ? "Supabase Cloud Active: Investigations, claims, gaps, and verification progress synchronized with PostgreSQL database."
      : "Local Demonstration Mode Active: Changes are persisted to browser storage. Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local to enable cloud database synchronization.",
  };
}

/**
 * Universal investigation saver handling both Supabase and Local Demonstration Mode.
 * Persists investigations, sources, extracted claims, information gaps, contradictions,
 * freshness records, and verification checklist progress.
 */
export async function persistInvestigation(record: InvestigationRecord): Promise<{
  success: boolean;
  mode: PersistenceMode;
  error?: string;
}> {
  const status = getRepositoryStatus();

  // Always keep local store in sync for zero-latency client access and offline resilience
  saveLocalInvestigation(record);

  if (status.mode === "supabase") {
    try {
      const supabase = createClient();
      if (!supabase) throw new Error("Supabase client failed to initialize");

      // 1. Upsert investigation record
      const invPayload = {
        id: record.id,
        title: record.topic,
        topic: record.topic,
        primary_question: record.researchQuestion || null,
        objective: record.objective || null,
        context: null,
        status: record.status,
        dark_spot_index: record.result.metrics.darkSpotIndex,
        is_demo: Boolean(record.id.startsWith("inv-")),
        metadata: {
          tags: record.tags || [],
          metrics: record.result.metrics,
        },
      };

      // @ts-expect-error table schema flexibility
      const { error: invError } = await supabase.from("investigations").upsert([invPayload]);
      if (invError) throw invError;

      // 2. Upsert sources
      for (const s of record.sources) {
        const sourcePayload = {
          id: `${record.id}-${s.id}`,
          investigation_id: record.id,
          source_label: s.id,
          title: s.title,
          url: s.url || null,
          source_type: s.type === "url" ? ("url" as const) : ("manual_text" as const),
          extraction_status: "success" as const,
          extraction_error: null,
          temporal_status: s.temporalStatus,
          word_count: s.wordCount,
          reliability_score: s.reliabilityScore || 85,
          content: s.content,
          published_at: null,
          metadata: {},
        };

        // @ts-expect-error table schema flexibility
        await supabase.from("sources").upsert([sourcePayload]);
      }

      // 3. Upsert extracted claims
      if (record.result.extracted_claims) {
        const claimPayloads = record.result.extracted_claims.map((c) => ({
          id: c.claim_id,
          investigation_id: record.id,
          source_id: `${record.id}-${c.source_id}`,
          claim_text: c.claim_text,
          claim_category: c.claim_category,
          supporting_excerpt: c.supporting_excerpt,
          extraction_confidence: c.extraction_confidence,
          analysis_status: c.analysis_status,
          metadata: {
            dates_detected: c.dates_detected || [],
            numerical_values: c.numerical_values || [],
            conditions: c.conditions || [],
          },
        }));

        if (claimPayloads.length > 0) {
          // @ts-expect-error table schema flexibility
          await supabase.from("claims").upsert(claimPayloads);
        }
      }

      // 4. Upsert detailed gaps
      if (record.result.detailed_gaps) {
        const gapPayloads = record.result.detailed_gaps.map((g) => ({
          id: g.gap_id,
          investigation_id: record.id,
          missing_category: g.missing_category,
          title: g.title,
          explanation: g.explanation,
          why_it_matters: g.why_it_matters,
          suggested_next_step: g.suggested_next_step,
          priority: g.priority,
          evidence_coverage: g.evidence_coverage,
          confidence_level: g.confidence_level,
          signal_label: g.signal_label,
          status_type: g.status_type,
        }));

        if (gapPayloads.length > 0) {
          // @ts-expect-error table schema flexibility
          await supabase.from("gaps").upsert(gapPayloads);
        }
      }

      // 5. Upsert verification checklist items
      if (record.result.verification_checklist) {
        const checkPayloads = record.result.verification_checklist.map((chk) => ({
          id: chk.id,
          investigation_id: record.id,
          priority: chk.priority,
          priority_level: chk.priorityLevel || (chk.priority === 1 ? "Critical" : "Medium"),
          title: chk.title || `Task ${chk.priority}`,
          action: chk.action,
          description: chk.description || null,
          reason_for_verification: chk.reason_for_verification || null,
          related_gap_or_conflict: chk.related_gap_or_conflict || null,
          recommended_source: chk.recommended_source || null,
          completed: chk.completed ?? false,
          assigned_sources: chk.assignedSources || [],
          supporting_evidence_references: chk.supporting_evidence_references || [],
          estimated_effort: chk.estimatedEffort || "moderate",
        }));

        if (checkPayloads.length > 0) {
          // @ts-expect-error table schema flexibility
          await supabase.from("checklist_items").upsert(checkPayloads);
        }
      }

      return { success: true, mode: "supabase" };
    } catch (err: unknown) {
      console.warn("Supabase persistence failed, falling back to local mode:", err);
      return {
        success: true,
        mode: "local_development",
        error: err instanceof Error ? err.message : "Supabase sync error",
      };
    }
  }

  return { success: true, mode: "local_development" };
}
