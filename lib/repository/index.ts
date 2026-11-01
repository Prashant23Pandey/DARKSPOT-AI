import { createClient } from "@/lib/supabase/client";
import { 
  getStoredInvestigations, 
  saveInvestigation as saveLocalInvestigation, 
  deleteInvestigation as deleteLocalInvestigation,
  type InvestigationRecord,
  DEFAULT_INVESTIGATIONS
} from "@/lib/store/investigations";
import type { TaskStatus } from "@/lib/supabase/types";
import type { ChecklistItem } from "@/types";

export type { InvestigationRecord };

export type PersistenceMode = "supabase" | "local_development";

export interface RepositoryStatus {
  mode: PersistenceMode;
  isSupabaseConfigured: boolean;
  message: string;
}

export function getRepositoryStatus(): RepositoryStatus {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const isSupabaseConfigured = Boolean(
    supabaseUrl && 
    supabaseKey && 
    supabaseUrl.startsWith("http") &&
    !supabaseUrl.includes("placeholder") &&
    !supabaseUrl.includes("your-project")
  );

  return {
    mode: isSupabaseConfigured ? "supabase" : "local_development",
    isSupabaseConfigured,
    message: isSupabaseConfigured
      ? "Supabase Cloud Primary Active: Investigations, claims, gaps, and verification tasks synchronized with PostgreSQL database."
      : "Local Demonstration Mode Active: Changes are persisted to browser storage. Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable cloud synchronization.",
  };
}

/**
 * Universal investigation saver handling both Supabase and Local Demonstration Mode.
 * Persists investigations, sources, extracted claims, information gaps, contradictions,
 * and verification tasks into PostgreSQL relational tables.
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
        research_question: record.researchQuestion || null,
        objective: record.objective || null,
        research_objective: record.objective || null,
        context: null,
        status: record.status,
        dark_spot_index: record.result.metrics.darkSpotIndex,
        is_demo: Boolean(record.is_demo || record.id.startsWith("inv-")),
        metadata: {
          tags: record.tags || [],
          metrics: record.result.metrics,
          dimensions: record.result.dimensions || [],
          completeness_report: record.result.completeness_report || null,
          freshness_audits: record.result.freshness_audits || [],
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
          content: s.content,
          published_at: s.publishedAt || null,
          retrieved_at: new Date().toISOString(),
          source_type: s.type === "url" ? ("url" as const) : ("manual_text" as const),
          extraction_status: "success" as const,
          temporal_status: s.temporalStatus,
          word_count: s.wordCount,
          reliability_score: s.reliabilityScore || 85,
          metadata: s.metadata || {},
        };

        // @ts-expect-error table schema flexibility
        await supabase.from("sources").upsert([sourcePayload]);
      }

      // 3. Upsert extracted claims
      if (record.result.extracted_claims && record.result.extracted_claims.length > 0) {
        const claimPayloads = record.result.extracted_claims.map((c) => ({
          id: c.claim_id,
          investigation_id: record.id,
          source_id: `${record.id}-${c.source_id}`,
          claim_text: c.claim_text,
          research_dimension: c.claim_category || "General",
          claim_category: c.claim_category,
          supporting_excerpt: c.supporting_excerpt,
          extraction_confidence: c.extraction_confidence,
          analysis_status: c.analysis_status,
          metadata: {
            dates_detected: c.dates_detected || [],
            numerical_values: c.numerical_values || [],
            conditions: c.conditions || [],
            source_url: c.source_url || null,
            source_title: c.source_title || null,
          },
        }));

        try {
          // @ts-expect-error table schema flexibility
          await supabase.from("extracted_claims").upsert(claimPayloads);
        } catch {
          // fallback to claims view if table alias in use
          // @ts-expect-error fallback alias
          await supabase.from("claims").upsert(claimPayloads);
        }
      }

      // 4. Upsert information gaps
      if (record.result.detailed_gaps && record.result.detailed_gaps.length > 0) {
        const gapPayloads = record.result.detailed_gaps.map((g) => ({
          id: g.gap_id,
          investigation_id: record.id,
          dimension: g.missing_category,
          missing_category: g.missing_category,
          title: g.title,
          explanation: g.explanation,
          why_it_matters: g.why_it_matters,
          evidence_reviewed: g.sources_reviewed || [],
          suggested_next_step: g.suggested_next_step,
          severity: g.priority,
          status: "unresolved",
          evidence_coverage: g.evidence_coverage,
          confidence_level: g.confidence_level,
          signal_label: g.signal_label,
        }));

        try {
          // @ts-expect-error table schema flexibility
          await supabase.from("information_gaps").upsert(gapPayloads);
        } catch {
          // @ts-expect-error fallback alias
          await supabase.from("gaps").upsert(gapPayloads);
        }
      }

      // 5. Upsert contradictions
      if (record.result.detailed_conflicts && record.result.detailed_conflicts.length > 0) {
        const conflictPayloads = record.result.detailed_conflicts.map((c) => ({
          id: c.conflict_id,
          investigation_id: record.id,
          claim_a_id: null,
          claim_b_id: null,
          claim_a: c.claim_a,
          claim_b: c.claim_b,
          source_a: c.source_a,
          source_b: c.source_b,
          supporting_excerpt_a: c.supporting_excerpt_a,
          supporting_excerpt_b: c.supporting_excerpt_b,
          conflict_category: c.conflict_category,
          comparison_dimension: c.comparison_dimension,
          explanation: c.explanation,
          confidence: c.confidence,
          status: "possible_conflict",
          verification_recommendation: c.verification_recommendation,
          is_contextual_divergence: c.is_contextual_divergence,
        }));

        try {
          // @ts-expect-error table schema flexibility
          await supabase.from("contradictions").upsert(conflictPayloads);
        } catch {
          // @ts-expect-error fallback alias
          await supabase.from("conflicts").upsert(conflictPayloads);
        }
      }

      // 6. Upsert verification tasks
      if (record.result.verification_checklist && record.result.verification_checklist.length > 0) {
        const checkPayloads = record.result.verification_checklist.map((chk) => ({
          id: chk.id,
          investigation_id: record.id,
          priority: chk.priority,
          priority_level: chk.priorityLevel || (chk.priority === 1 ? "Critical" : "Medium"),
          title: chk.title || `Task ${chk.priority}`,
          action: chk.action,
          description: chk.description || null,
          reason: chk.reason_for_verification || null,
          related_gap_id: null,
          related_gap_or_conflict: chk.related_gap_or_conflict || null,
          recommended_source: chk.recommended_source || null,
          status: chk.status || (chk.completed ? "verified" : "pending"),
          completed: Boolean(chk.completed),
          assigned_sources: chk.assignedSources || [],
          supporting_evidence_references: chk.supporting_evidence_references || [],
          estimated_effort: chk.estimatedEffort || "moderate",
        }));

        try {
          // @ts-expect-error table schema flexibility
          await supabase.from("verification_tasks").upsert(checkPayloads);
        } catch {
          // @ts-expect-error fallback alias
          await supabase.from("checklist_items").upsert(checkPayloads);
        }
      }

      // 7. Record analysis run
      try {
        const runPayload = {
          id: `run_${record.id}_${Date.now()}`,
          investigation_id: record.id,
          analysis_method: "deterministic_engine",
          analysis_status: "completed",
          summary: `Analysis completed with Dark Spot Index ${record.result.metrics.darkSpotIndex}/100 across ${record.sources.length} sources.`,
          metrics: record.result.metrics,
        };
        // @ts-expect-error table schema flexibility
        await supabase.from("analysis_runs").upsert([runPayload]);
      } catch (runErr) {
        console.warn("Analysis run record failed (non-critical):", runErr);
      }

      return { success: true, mode: "supabase" };
    } catch (err: unknown) {
      console.warn("Supabase persistence failed, safely falling back to local storage:", err);
      return {
        success: true,
        mode: "local_development",
        error: err instanceof Error ? err.message : "Supabase sync error",
      };
    }
  }

  return { success: true, mode: "local_development" };
}

/**
 * Retrieves all investigations, querying Supabase when configured
 * or gracefully falling back to browser storage.
 */
export async function getAllInvestigations(): Promise<InvestigationRecord[]> {
  const status = getRepositoryStatus();

  if (status.mode === "supabase") {
    try {
      const supabase = createClient();
      if (supabase) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const client = supabase as any;
        const { data: invRows, error } = await client
          .from("investigations")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && invRows && invRows.length > 0) {
          // Return investigations with local cache synchronization
          const list: InvestigationRecord[] = [];

          for (const row of invRows) {
            // Check if local cache has full enriched record
            const localMatch = getStoredInvestigations().find((i) => i.id === row.id);
            if (localMatch) {
              list.push({
                ...localMatch,
                topic: row.topic || row.title || localMatch.topic,
                status: row.status as InvestigationRecord["status"],
                isStarred: Boolean(row.is_starred),
              });
            } else {
              // Reconstruct minimal record from Supabase row
              const meta = (row.metadata as Record<string, unknown>) || {};
              list.push({
                id: row.id,
                topic: row.topic || row.title || "Investigation Dossier",
                researchQuestion: row.research_question || row.primary_question || "",
                objective: row.research_objective || row.objective || "",
                status: (row.status as InvestigationRecord["status"]) || "completed",
                createdAt: row.created_at || new Date().toISOString(),
                isStarred: Boolean(row.is_starred),
                is_demo: Boolean(row.is_demo),
                tags: (meta.tags as string[]) || [],
                sources: [],
                result: {
                  id: `ds-${row.id}`,
                  topic: row.topic || row.title || "Investigation Dossier",
                  timestamp: row.created_at || new Date().toISOString(),
                  sources: [],
                  structured_summary: [],
                  information_gaps: [],
                  conflicts: [],
                  outdated_warnings: [],
                  verification_checklist: [],
                  metrics: (meta.metrics as InvestigationRecord["result"]["metrics"]) || {
                    totalClaims: 0,
                    gapCount: 0,
                    conflictCount: 0,
                    outdatedCount: 0,
                    darkSpotIndex: row.dark_spot_index || 0,
                    evidenceReliabilityAvg: 85,
                    researchCompletenessScore: 80,
                  },
                },
              });
            }
          }

          if (list.length > 0) {
            return list;
          }
        }
      }
    } catch (err) {
      console.warn("Supabase fetch failed, using local store:", err);
    }
  }

  return getStoredInvestigations();
}

/**
 * Updates an investigation's title in Supabase and local storage.
 */
export async function updateInvestigationTitle(id: string, newTitle: string): Promise<boolean> {
  // Update local storage
  const list = getStoredInvestigations();
  const target = list.find((i) => i.id === id);
  if (target) {
    target.topic = newTitle;
    saveLocalInvestigation(target);
  }

  // Update Supabase if active
  const status = getRepositoryStatus();
  if (status.mode === "supabase") {
    try {
      const supabase = createClient();
      if (supabase) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from("investigations")
          .update({ title: newTitle, topic: newTitle, updated_at: new Date().toISOString() })
          .eq("id", id);
      }
    } catch (err) {
      console.warn("Failed to update title in Supabase:", err);
    }
  }

  return true;
}

/**
 * Updates a verification task status (pending, in_progress, verified, unable_to_verify) or completion.
 */
export async function updateVerificationTask(
  investigationId: string,
  taskId: string,
  updates: Partial<ChecklistItem> & { status?: TaskStatus }
): Promise<boolean> {
  const list = getStoredInvestigations();
  const inv = list.find((i) => i.id === investigationId);

  if (inv && inv.result.verification_checklist) {
    const task = inv.result.verification_checklist.find((t) => t.id === taskId);
    if (task) {
      Object.assign(task, updates);
      if (updates.status === "verified") {
        task.completed = true;
      } else if (updates.status === "pending" || updates.status === "in_progress") {
        task.completed = false;
      }
      saveLocalInvestigation(inv);
    }
  }

  const status = getRepositoryStatus();
  if (status.mode === "supabase") {
    try {
      const supabase = createClient();
      if (supabase) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const client = supabase as any;
        const payload: Record<string, unknown> = {
          updated_at: new Date().toISOString(),
        };
        if (updates.completed !== undefined) payload.completed = updates.completed;
        if (updates.status) payload.status = updates.status;
        if (updates.action) payload.action = updates.action;
        if (updates.title) payload.title = updates.title;

        try {
          await client.from("verification_tasks").update(payload).eq("id", taskId);
        } catch {
          await client.from("checklist_items").update(payload).eq("id", taskId);
        }
      }
    } catch (err) {
      console.warn("Failed to update task in Supabase:", err);
    }
  }

  return true;
}

/**
 * Safely deletes an investigation and cascades across related tables.
 */
export async function deleteInvestigationSafely(id: string): Promise<boolean> {
  // Delete from local storage
  deleteLocalInvestigation(id);

  // Delete from Supabase
  const status = getRepositoryStatus();
  if (status.mode === "supabase") {
    try {
      const supabase = createClient();
      if (supabase) {
        // Cascade delete on foreign keys will remove sources, claims, gaps, conflicts, and tasks
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from("investigations").delete().eq("id", id);
      }
    } catch (err) {
      console.warn("Supabase delete failed:", err);
    }
  }

  return true;
}

/**
 * Saves investigator profile to Supabase and local storage.
 */
export async function saveInvestigatorProfile(profile: {
  name: string;
  role: string;
  organization: string;
  avatar_url?: string;
}): Promise<boolean> {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("darkspot_investigator_profile", JSON.stringify(profile));
  }

  const status = getRepositoryStatus();
  if (status.mode === "supabase") {
    try {
      const supabase = createClient();
      if (supabase) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from("investigator_profiles").upsert([
          {
            name: profile.name,
            role: profile.role,
            organization: profile.organization,
            avatar_url: profile.avatar_url || null,
            updated_at: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.warn("Failed to save profile to Supabase:", err);
    }
  }

  return true;
}

/**
 * Retrieves investigator profile from Supabase or local storage.
 */
export async function getInvestigatorProfile(): Promise<{
  name: string;
  role: string;
  organization: string;
  avatar_url?: string;
}> {
  const defaultProfile = {
    name: "Lead Investigator",
    role: "Research Intelligence Analyst",
    organization: "Shinchan Hackathon Team",
  };

  const status = getRepositoryStatus();
  if (status.mode === "supabase") {
    try {
      const supabase = createClient();
      if (supabase) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
          .from("investigator_profiles")
          .select("*")
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          return {
            name: data.name,
            role: data.role,
            organization: data.organization,
            avatar_url: data.avatar_url || undefined,
          };
        }
      }
    } catch (err) {
      console.warn("Failed to load profile from Supabase:", err);
    }
  }

  if (typeof window !== "undefined") {
    const raw = window.localStorage.getItem("darkspot_investigator_profile");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
  }

  return defaultProfile;
}
