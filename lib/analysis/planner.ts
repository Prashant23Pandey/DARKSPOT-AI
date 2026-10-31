import type { 
  ChecklistItem, 
  DetailedInformationGap, 
  DetailedConflictItem, 
  OutdatedWarning,
  GapPriority,
  SourceItem
} from "@/types";

/**
 * Synthesizes gaps, contradictions, freshness warnings, and user objectives
 * into a structured, prioritized verification roadmap.
 */
export function generateVerificationPlan(
  topic: string,
  researchQuestion: string,
  gaps: DetailedInformationGap[] = [],
  conflicts: DetailedConflictItem[] = [],
  warnings: OutdatedWarning[] = [],
  sources: SourceItem[] = []
): ChecklistItem[] {
  const checklist: ChecklistItem[] = [];
  let currentPriority = 1;

  // 1. Critical Information Gaps -> Top Priority Tasks
  for (const gap of gaps) {
    if (gap.priority === "Critical" || gap.priority === "High") {
      checklist.push({
        id: `plan-gap-${gap.gap_id || Math.random().toString(36).substring(2, 6)}`,
        priority: currentPriority++,
        priorityLevel: gap.priority,
        title: `Verify ${gap.missing_category}: ${gap.title}`,
        action: gap.suggested_next_step || `Consult official authority archives to determine missing ${gap.title}.`,
        description: gap.explanation,
        reason_for_verification: gap.why_it_matters || `Essential criterion required to eliminate blind spots in "${topic}".`,
        related_gap_or_conflict: gap.title,
        recommended_source: gap.sources_reviewed.length > 0 
          ? `Primary registrar or authority catalog (cross-check against ${gap.sources_reviewed.join(", ")})` 
          : "Primary administrative authority",
        completed: false,
        assignedSources: gap.sources_reviewed,
        supporting_evidence_references: [
          `Related to research question: "${gap.related_question || researchQuestion}"`,
          `Evidence coverage in reviewed sources: ${gap.evidence_coverage.toUpperCase()}`,
        ],
        estimatedEffort: gap.priority === "Critical" ? "deep_dive" : "moderate",
      });
    }
  }

  // 2. Cross-Source Contradictions -> Priority Reconciliation Tasks
  for (const conf of conflicts) {
    checklist.push({
      id: `plan-conf-${conf.conflict_id || Math.random().toString(36).substring(2, 6)}`,
      priority: currentPriority++,
      priorityLevel: conf.conflict_category === "direct_contradiction" ? "Critical" : "High",
      title: `Reconcile ${conf.comparison_dimension}: ${conf.source_a} vs ${conf.source_b}`,
      action: conf.verification_recommendation,
      description: conf.explanation,
      reason_for_verification: `Incompatible statements between ${conf.source_a} ("${conf.claim_a.slice(0, 50)}...") and ${conf.source_b} ("${conf.claim_b.slice(0, 50)}...") create severe operational ambiguity.`,
      related_gap_or_conflict: `Contradiction in ${conf.comparison_dimension}`,
      recommended_source: `Authoritative statutory bulletin or registrar contact to audit ${conf.source_a} and ${conf.source_b}`,
      completed: false,
      assignedSources: [conf.source_a, conf.source_b],
      supporting_evidence_references: [
        `Claim A Excerpt: "${conf.supporting_excerpt_a.slice(0, 120)}..."`,
        `Claim B Excerpt: "${conf.supporting_excerpt_b.slice(0, 120)}..."`,
      ],
      estimatedEffort: "moderate",
    });
  }

  // 3. Outdated Warnings -> Temporal Validation Tasks
  for (const warn of warnings) {
    checklist.push({
      id: `plan-warn-${Math.random().toString(36).substring(2, 6)}`,
      priority: currentPriority++,
      priorityLevel: "Medium",
      title: `Audit Temporal Freshness for ${warn.source}`,
      action: warn.recommendedAction || `Verify whether operational schedules cited in ${warn.source} govern the current ${new Date().getFullYear()} cycle.`,
      description: warn.warning,
      reason_for_verification: `Stale cycle citations (${warn.detectedCycle || "historical cycle"}) may reflect obsolete guidelines.`,
      related_gap_or_conflict: `Temporal drift in ${warn.source}`,
      recommended_source: warn.source,
      completed: false,
      assignedSources: [warn.source],
      supporting_evidence_references: [
        warn.warning,
      ],
      estimatedEffort: "quick",
    });
  }

  // 4. Moderate/Low Gaps
  for (const gap of gaps) {
    if (gap.priority === "Medium" || gap.priority === "Low") {
      checklist.push({
        id: `plan-gap-${gap.gap_id || Math.random().toString(36).substring(2, 6)}`,
        priority: currentPriority++,
        priorityLevel: gap.priority,
        title: `Clarify ${gap.missing_category}: ${gap.title}`,
        action: gap.suggested_next_step,
        description: gap.explanation,
        reason_for_verification: gap.why_it_matters,
        related_gap_or_conflict: gap.title,
        recommended_source: gap.sources_reviewed[0] || "General institutional documentation",
        completed: false,
        assignedSources: gap.sources_reviewed,
        supporting_evidence_references: [
          `Coverage: ${gap.evidence_coverage}`,
        ],
        estimatedEffort: "quick",
      });
    }
  }

  return checklist;
}
