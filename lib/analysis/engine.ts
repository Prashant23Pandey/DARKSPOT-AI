import type { 
  DarkspotAnalysisResponse, 
  SourceItem, 
  InformationGap, 
  ConflictItem, 
  OutdatedWarning, 
  SummaryFact, 
  ChecklistItem 
} from "@/types";
import { RawGapEngineOutputSchema, type ValidatedGapEngineOutput } from "@/lib/validation";
import { computeAnalysisMetrics } from "./metrics";
import { extractClaimsFromAllSources } from "./claim-extractor";
import { 
  deriveInformationDimensions, 
  mapClaimsToDimensions, 
  detectAndPrioritizeGaps, 
  computeResearchCompletenessReport 
} from "./gap-engine";
import { detectCrossSourceContradictions } from "./conflict-engine";
import { auditSourcesFreshness } from "./freshness-engine";
import { generateVerificationPlan } from "./planner";

const SYSTEM_INSTRUCTION = `You are DARKSPOT AI, an investigative intelligence and information gap detection engine.
Your task is to analyze multiple sources on a given topic, cross-examine claims, and produce a rigorous JSON analysis matching the exact schema.

You must detect:
1. structured_summary: Core factual statements with source citations (e.g. ["Source 1", "Source 2"]).
2. information_gaps: Missing policies, omitted criteria, critical unanswered questions. Each must have gap_title, description, severity ("HIGH", "MEDIUM", or "LOW"), and signal_label ("Potential Gap — Unverified in provided sources").
3. conflicts: Direct contradictions, numerical discrepancies, or opposing statements between sources. Include issue, claim_a, claim_b, sources.
4. outdated_warnings: Stale references, past academic/fiscal cycles (e.g. 2021-2024 cycles), or expired deadlines. Include source and warning.
5. verification_checklist: Prioritized human verification steps (priority 1, 2, 3...) to resolve discrepancies and close blind spots.

Return ONLY pure valid JSON conforming strictly to the requested schema.`;

/**
 * Realistic Mock Blueprint Generator for zero-config offline runs
 */
export function generateBlueprintMock(topic: string, sources: SourceItem[]): ValidatedGapEngineOutput {
  const s1 = sources[0]?.id ?? "Source 1";
  const s2 = sources[1]?.id ?? "Source 2";
  const s3 = sources[2]?.id ?? "Source 3";

  return {
    structured_summary: [
      {
        fact: `Core framework for "${topic}" relies on multi-source verified consensus with minimum requirement adherence.`,
        sources: [s1, s2].filter(Boolean),
        confidence: 94,
        verificationStatus: "verified",
      },
      {
        fact: "Disbursements and regulatory filing milestones are distributed across bi-annual compliance audit cycles.",
        sources: [s1],
        confidence: 88,
        verificationStatus: "verified",
      },
      {
        fact: "Application criteria stipulate formal identity verification and institutional endorsement.",
        sources: [s2],
        confidence: 82,
        verificationStatus: "verified",
      },
    ],
    information_gaps: [
      {
        gap_title: "Automated Continuity & Renewal Policy Omitted",
        description: `None of the provided sources specify whether eligibility for "${topic}" renews automatically or requires an annual re-application dossier.`,
        severity: "HIGH",
        signal_label: "Potential Gap — Unverified in provided sources",
        category: "omission",
        suggestedSearchQueries: [
          `"${topic}" annual renewal guidelines`,
          `"${topic}" sophomore continuity prerequisites`,
        ],
      },
      {
        gap_title: "Arbitration & Appeal Protocol Unstated",
        description: "The sources outline disqualification triggers but omit the procedural appeal window or oversight body.",
        severity: "MEDIUM",
        signal_label: "Potential Gap — Unverified in provided sources",
        category: "coverage",
        suggestedSearchQueries: [`"${topic}" appeal procedure guidelines`],
      },
      {
        gap_title: "Third-Party Data Retention Horizon Missing",
        description: "Privacy and verification telemetry storage periods are not disclosed across the submitted excerpts.",
        severity: "LOW",
        signal_label: "Potential Gap — Unverified in provided sources",
        category: "methodological",
      },
    ],
    conflicts: [
      {
        issue: "Fiscal Documentation & Submission Year Discrepancy",
        claim_a: `${s1} states certified tax records and balance sheets from fiscal cycle 2024 are required.`,
        claim_b: `${s2} explicitly requires verified W-2 filings and audits from fiscal cycle 2025.`,
        sources: [s1, s2],
        varianceDegree: "numerical_discrepancy",
      },
      {
        issue: "Application Submission Deadline Mismatch",
        claim_a: `${s1} lists the hard cutoff date as November 15 at 23:59 EST.`,
        claim_b: `${s2} claims rolling submissions are accepted through December 31 with late penalty.`,
        sources: [s1, s2],
        varianceDegree: "direct_contradiction",
      },
    ],
    outdated_warnings: [
      {
        source: s3,
        warning: `Page references legacy 2022-2023 operational schedules which may be obsolete for current ${new Date().getFullYear()} assessments.`,
        detectedCycle: "2022-2023",
      },
    ],
    verification_checklist: [
      {
        id: "check-1",
        priority: 1,
        action: `Contact primary administrative bureau to confirm renewal requirements and clarify the omitted continuity protocol for "${topic}".`,
        completed: false,
        assignedSources: [s1, s2],
      },
      {
        id: "check-2",
        priority: 2,
        action: "Reconcile contradictory fiscal documentation years between Source 1 and Source 2 via official registrar bulletin.",
        completed: false,
        assignedSources: [s1, s2],
      },
      {
        id: "check-3",
        priority: 3,
        action: `Audit ${s3} against modern ${new Date().getFullYear()} archives to replace stale deadline citations.`,
        completed: false,
        assignedSources: [s3],
      },
    ],
  };
}

/**
 * Primary Engine Orchestrator: Invokes Gemini API when key is present,
 * or safely executes realistic mock blueprint mode.
 */
export async function analyzeInformationDossier(
  topic: string,
  sources: SourceItem[]
): Promise<{
  result: DarkspotAnalysisResponse;
  engineMode: "live_gemini" | "mock_blueprint";
  rawError?: string;
}> {
  const apiKey = process.env.GEMINI_API_KEY;
  let parsedOutput: ValidatedGapEngineOutput;
  let engineMode: "live_gemini" | "mock_blueprint" = "mock_blueprint";
  let rawError: string | undefined;

  if (apiKey && apiKey.trim().length > 5) {
    try {
      const sourcesPayload = sources
        .map(
          (s) =>
            `--- ${s.id}: ${s.title} (${s.temporalStatus.toUpperCase()}) ---\n${s.content.slice(0, 8000)}`
        )
        .join("\n\n");

      const prompt = `Topic of Investigation: "${topic}"\n\nProvided Sources:\n${sourcesPayload}\n\nExecute full digital dark spot detection according to system instructions.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.1,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error("No response generated from Gemini API");
      }

      const jsonParsed = JSON.parse(rawText);
      const validation = RawGapEngineOutputSchema.safeParse(jsonParsed);

      if (validation.success) {
        parsedOutput = validation.data;
        engineMode = "live_gemini";
      } else {
        throw new Error(`Schema validation error: ${validation.error.message}`);
      }
    } catch (err) {
      console.warn("Live Gemini API call failed, falling back to Blueprint Mock:", err);
      rawError = err instanceof Error ? err.message : String(err);
      parsedOutput = generateBlueprintMock(topic, sources);
      engineMode = "mock_blueprint";
    }
  } else {
    parsedOutput = generateBlueprintMock(topic, sources);
    engineMode = "mock_blueprint";
  }

  // Phase 4: NLP Claim Extraction across all sources
  const extractedClaims = await extractClaimsFromAllSources(sources, topic);

  // Phase 5: Gap Detection Engine: Topic-adaptive dimensions -> Claim mapping -> Gap detection & prioritization
  const rawDimensions = deriveInformationDimensions(topic);
  const mappedDimensions = mapClaimsToDimensions(rawDimensions, extractedClaims, parsedOutput.conflicts);
  const detailedGaps = detectAndPrioritizeGaps(
    mappedDimensions, 
    topic, 
    topic, 
    sources.map((s) => s.id)
  );
  const completenessReport = computeResearchCompletenessReport(
    mappedDimensions,
    detailedGaps,
    extractedClaims
  );

  // Phase 6: Cross-Source Contradiction Detection Engine
  const detailedConflicts = detectCrossSourceContradictions(extractedClaims, parsedOutput.conflicts);

  // Phase 7: Information Freshness Detection Engine
  const { audits: freshnessAudits, warnings: freshnessWarnings } = auditSourcesFreshness(sources);

  // Merge any novel freshness warnings
  const mergedWarnings = [...parsedOutput.outdated_warnings];
  for (const fw of freshnessWarnings) {
    if (!mergedWarnings.some((w) => w.source === fw.source)) {
      mergedWarnings.push(fw);
    }
  }

  // Phase 8: Verification Planner synthesis from gaps, conflicts, and warnings
  const synthesizedChecklist = generateVerificationPlan(
    topic,
    topic,
    detailedGaps,
    detailedConflicts,
    mergedWarnings,
    sources
  );

  const verificationChecklist = synthesizedChecklist.length > 0 
    ? synthesizedChecklist 
    : parsedOutput.verification_checklist.map((item, idx) => ({
        id: item.id || `chk-${idx + 1}-${Date.now()}`,
        priority: item.priority || idx + 1,
        action: item.action,
        completed: item.completed ?? false,
        assignedSources: item.assignedSources || [],
      }));

  const metrics = computeAnalysisMetrics(
    sources,
    parsedOutput.structured_summary,
    parsedOutput.information_gaps,
    parsedOutput.conflicts,
    mergedWarnings
  );
  metrics.researchCompletenessScore = completenessReport.overallCompletenessScore;

  const result: DarkspotAnalysisResponse = {
    id: `ds-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    topic,
    timestamp: new Date().toISOString(),
    sources,
    structured_summary: parsedOutput.structured_summary,
    information_gaps: parsedOutput.information_gaps,
    conflicts: parsedOutput.conflicts,
    outdated_warnings: mergedWarnings,
    verification_checklist: verificationChecklist,
    metrics,
    extracted_claims: extractedClaims,
    dimensions: mappedDimensions,
    detailed_gaps: detailedGaps,
    completeness_report: completenessReport,
    detailed_conflicts: detailedConflicts,
    freshness_audits: freshnessAudits,
  };

  return { result, engineMode, rawError };
}
