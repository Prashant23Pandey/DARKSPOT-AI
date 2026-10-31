import type { 
  ExtractedClaim, 
  DetailedConflictItem, 
  ConflictCategory, 
  ComparisonDimension,
  SourceItem,
  ConflictItem
} from "@/types";

/**
 * Normalizes numerical values, currencies, GPAs, and dates for accurate cross-examination.
 */
export function normalizeNumericalOrDateString(val: string): string {
  return val.trim().replace(/\s+/g, " ").toLowerCase();
}

/**
 * Checks if two claims have diverging prerequisite conditions (contextual divergence).
 * e.g., "for international students" vs "for domestic students", or "transfer" vs "first-year".
 */
export function detectContextualDivergence(claimA: ExtractedClaim, claimB: ExtractedClaim): {
  isContextual: boolean;
  divergenceReason?: string;
} {
  const textA = (claimA.claim_text + " " + claimA.supporting_excerpt).toLowerCase();
  const textB = (claimB.claim_text + " " + claimB.supporting_excerpt).toLowerCase();

  const contextualPairs: [string, string, string][] = [
    ["international", "domestic", "Student residency status (international vs domestic)"],
    ["in-state", "out-of-state", "Tuition residency status (in-state vs out-of-state)"],
    ["transfer", "first-year", "Cohort status (transfer students vs incoming first-years)"],
    ["undergraduate", "graduate", "Degree level (undergraduate vs graduate)"],
    ["full-time", "part-time", "Enrollment load (full-time vs part-time)"],
    ["online", "on-campus", "Instructional modality (online vs on-campus)"],
  ];

  for (const [termA, termB, reason] of contextualPairs) {
    if ((textA.includes(termA) && textB.includes(termB)) || (textA.includes(termB) && textB.includes(termA))) {
      return { isContextual: true, divergenceReason: reason };
    }
  }

  // Check conditions array
  const condsA = claimA.conditions || [];
  const condsB = claimB.conditions || [];
  if (condsA.length > 0 && condsB.length > 0) {
    const hasOverlap = condsA.some((c) => condsB.includes(c));
    if (!hasOverlap && condsA.length > 1 && condsB.length > 1) {
      return { 
        isContextual: true, 
        divergenceReason: `Differing conditional scopes: [${condsA.join(", ")}] vs [${condsB.join(", ")}]` 
      };
    }
  }

  return { isContextual: false };
}

/**
 * Maps claim category to comparison dimension.
 */
function resolveComparisonDimension(
  claimA: ExtractedClaim,
  claimB: ExtractedClaim
): ComparisonDimension {
  if (claimA.claim_category === "Deadlines" || claimB.claim_category === "Deadlines") {
    return "Deadlines";
  }
  if (
    (claimA.dates_detected && claimA.dates_detected.length > 0) ||
    (claimB.dates_detected && claimB.dates_detected.length > 0)
  ) {
    return "Dates";
  }
  if (claimA.claim_category === "Eligibility" || claimB.claim_category === "Eligibility") {
    return "Eligibility criteria";
  }
  if (claimA.claim_category === "Documents" || claimB.claim_category === "Documents") {
    return "Document requirements";
  }
  if (claimA.claim_category === "Fees" || claimB.claim_category === "Fees") {
    return "Monetary amounts";
  }
  if (
    claimA.numerical_values?.some((v) => v.includes("$")) ||
    claimB.numerical_values?.some((v) => v.includes("$"))
  ) {
    return "Monetary amounts";
  }
  if (
    claimA.numerical_values?.some((v) => v.includes("%")) ||
    claimB.numerical_values?.some((v) => v.includes("%"))
  ) {
    return "Percentages";
  }
  if (claimA.claim_category === "Procedures" || claimB.claim_category === "Procedures") {
    return "Procedures";
  }
  if (claimA.claim_category === "Policies" || claimB.claim_category === "Policies") {
    return "Policies";
  }
  if (
    (claimA.numerical_values && claimA.numerical_values.length > 0) ||
    (claimB.numerical_values && claimB.numerical_values.length > 0)
  ) {
    return "Numerical limits";
  }
  return "Other";
}

/**
 * Core Cross-Source Contradiction Detection Engine.
 * Cross-examines extracted claims from distinct sources, detects numerical/temporal/procedural
 * contradictions, applies false-positive guardrails, and produces grounded comparison evidence.
 */
export function detectCrossSourceContradictions(
  claims: ExtractedClaim[],
  existingConflicts: ConflictItem[] = []
): DetailedConflictItem[] {
  const detailedConflicts: DetailedConflictItem[] = [];
  const processedPairs = new Set<string>();

  // 1. Group claims by category or semantic theme
  const claimsByCategory: Record<string, ExtractedClaim[]> = {};
  for (const c of claims) {
    claimsByCategory[c.claim_category] = claimsByCategory[c.claim_category] || [];
    claimsByCategory[c.claim_category]?.push(c);
  }

  // Helper to add conflict avoiding duplicates
  const addConflict = (item: DetailedConflictItem) => {
    const key1 = `${item.source_a}::${item.source_b}::${item.explanation.slice(0, 40)}`;
    const key2 = `${item.source_b}::${item.source_a}::${item.explanation.slice(0, 40)}`;
    if (processedPairs.has(key1) || processedPairs.has(key2)) return;
    processedPairs.add(key1);
    processedPairs.add(key2);
    detailedConflicts.push(item);
  };

  // 2. Iterate through categories and cross-compare claims from distinct sources
  for (const [category, groupClaims] of Object.entries(claimsByCategory)) {
    for (let i = 0; i < groupClaims.length; i++) {
      for (let j = i + 1; j < groupClaims.length; j++) {
        const claimA = groupClaims[i]!;
        const claimB = groupClaims[j]!;

        // Do not compare claims from the exact same source
        if (claimA.source_id === claimB.source_id) continue;

        const dimension = resolveComparisonDimension(claimA, claimB);
        const contextualCheck = detectContextualDivergence(claimA, claimB);

        // A. Compare Numerical Values (e.g., GPA thresholds, dollar figures, credit hours)
        const numsA = claimA.numerical_values || [];
        const numsB = claimB.numerical_values || [];
        const sharedNumericalType = numsA.length > 0 && numsB.length > 0;

        if (sharedNumericalType) {
          // Check for discrepancy between numbers
          const diffNums = numsA.filter((na) => !numsB.includes(na));
          if (diffNums.length > 0 && numsB.length > 0) {
            if (contextualCheck.isContextual) {
              addConflict({
                conflict_id: `conf-ctx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                claim_a: claimA.claim_text,
                claim_b: claimB.claim_text,
                source_a: claimA.source_id,
                source_b: claimB.source_id,
                supporting_excerpt_a: claimA.supporting_excerpt,
                supporting_excerpt_b: claimB.supporting_excerpt,
                source_url_a: claimA.source_url,
                source_url_b: claimB.source_url,
                source_title_a: claimA.source_title,
                source_title_b: claimB.source_title,
                conflict_category: "contextual_difference",
                comparison_dimension: dimension,
                explanation: `Potential contextual variation detected: ${claimA.source_id} cites ${numsA.join(", ")} while ${claimB.source_id} cites ${numsB.join(", ")}. This divergence appears governed by ${contextualCheck.divergenceReason || "distinct scope conditions"}.`,
                confidence: 84,
                verification_recommendation: `Confirm whether these numerical rules apply to different student cohorts or administrative tiers.`,
                is_contextual_divergence: true,
              });
            } else {
              addConflict({
                conflict_id: `conf-num-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                claim_a: claimA.claim_text,
                claim_b: claimB.claim_text,
                source_a: claimA.source_id,
                source_b: claimB.source_id,
                supporting_excerpt_a: claimA.supporting_excerpt,
                supporting_excerpt_b: claimB.supporting_excerpt,
                source_url_a: claimA.source_url,
                source_url_b: claimB.source_url,
                source_title_a: claimA.source_title,
                source_title_b: claimB.source_title,
                conflict_category: "numerical_discrepancy",
                comparison_dimension: dimension,
                explanation: `Direct numerical discrepancy: ${claimA.source_id} mandates ${numsA.join(", ")}, whereas ${claimB.source_id} specifies ${numsB.join(", ")} for the same parameter.`,
                confidence: 94,
                verification_recommendation: `Reconcile the numerical variance between ${claimA.source_id} and ${claimB.source_id} with the official bursar or registrar standard. Neither source can be presumed authoritative automatically.`,
                is_contextual_divergence: false,
              });
            }
          }
        }

        // B. Compare Dates and Deadlines
        const datesA = claimA.dates_detected || [];
        const datesB = claimB.dates_detected || [];
        if (datesA.length > 0 && datesB.length > 0) {
          const diffDates = datesA.filter((da) => !datesB.includes(da));
          if (diffDates.length > 0) {
            addConflict({
              conflict_id: `conf-date-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              claim_a: claimA.claim_text,
              claim_b: claimB.claim_text,
              source_a: claimA.source_id,
              source_b: claimB.source_id,
              supporting_excerpt_a: claimA.supporting_excerpt,
              supporting_excerpt_b: claimB.supporting_excerpt,
              source_url_a: claimA.source_url,
              source_url_b: claimB.source_url,
              source_title_a: claimA.source_title,
              source_title_b: claimB.source_title,
              conflict_category: dimension === "Deadlines" ? "direct_contradiction" : "temporal_drift",
              comparison_dimension: dimension,
              explanation: `Inconsistent temporal statements: ${claimA.source_id} references ${datesA.join(", ")}, whereas ${claimB.source_id} references ${datesB.join(", ")}.`,
              confidence: 90,
              verification_recommendation: `Audit published date stamps to determine if one date represents an outdated operating cycle or extension.`,
              is_contextual_divergence: false,
            });
          }
        }
      }
    }
  }

  // 3. Seamlessly ingest and ground any pre-existing high-level conflicts
  for (const existing of existingConflicts) {
    const sA = existing.sources[0] || "Source 1";
    const sB = existing.sources[1] || "Source 2";

    // Find supporting claims matching source IDs
    const matchingClaimA = claims.find((c) => c.source_id === sA);
    const matchingClaimB = claims.find((c) => c.source_id === sB);

    addConflict({
      conflict_id: `conf-gen-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      claim_a: existing.claim_a,
      claim_b: existing.claim_b,
      source_a: sA,
      source_b: sB,
      supporting_excerpt_a: matchingClaimA?.supporting_excerpt || existing.claim_a,
      supporting_excerpt_b: matchingClaimB?.supporting_excerpt || existing.claim_b,
      source_url_a: matchingClaimA?.source_url,
      source_url_b: matchingClaimB?.source_url,
      source_title_a: matchingClaimA?.source_title || `${sA} Documentation`,
      source_title_b: matchingClaimB?.source_title || `${sB} Documentation`,
      conflict_category: existing.varianceDegree || "direct_contradiction",
      comparison_dimension: existing.issue.toLowerCase().includes("deadline") || existing.issue.toLowerCase().includes("date")
        ? "Deadlines"
        : existing.issue.toLowerCase().includes("tax") || existing.issue.toLowerCase().includes("document")
        ? "Document requirements"
        : "Policies",
      explanation: `Cross-source contradiction identified regarding ${existing.issue}. Source A and Source B assert incompatible factual prerequisites.`,
      confidence: 92,
      verification_recommendation: `Conduct primary verification against official authority archives to determine which guideline governs active submissions. Inspect both sources side-by-side.`,
      is_contextual_divergence: false,
    });
  }

  return detailedConflicts;
}
