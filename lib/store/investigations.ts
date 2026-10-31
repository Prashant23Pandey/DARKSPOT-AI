"use client";

import type { 
  DarkspotAnalysisResponse, 
  SourceItem, 
  ChecklistItem,
  ExtractedClaim
} from "@/types";
import { extractClaimsDeterministically } from "@/lib/analysis/claim-extractor";
import { 
  deriveInformationDimensions, 
  mapClaimsToDimensions, 
  detectAndPrioritizeGaps, 
  computeResearchCompletenessReport 
} from "@/lib/analysis/gap-engine";
import { detectCrossSourceContradictions } from "@/lib/analysis/conflict-engine";
import { auditSourcesFreshness } from "@/lib/analysis/freshness-engine";
import { generateVerificationPlan } from "@/lib/analysis/planner";

export interface InvestigationRecord {
  id: string;
  topic: string;
  researchQuestion: string;
  objective: string;
  createdAt: string;
  status: "completed" | "analyzing" | "draft" | "error";
  sources: SourceItem[];
  result: DarkspotAnalysisResponse;
  isStarred?: boolean;
  tags?: string[];
}

export function enrichInvestigationWithGapEngine(record: InvestigationRecord): InvestigationRecord {
  if (
    record.result.extracted_claims && 
    record.result.dimensions && 
    record.result.completeness_report &&
    record.result.detailed_conflicts &&
    record.result.freshness_audits &&
    record.result.extracted_claims.length > 0
  ) {
    return record;
  }

  const claims: ExtractedClaim[] = [];
  for (const source of record.sources) {
    const extracted = extractClaimsDeterministically(source, record.researchQuestion || record.topic);
    claims.push(...extracted);
  }

  const rawDims = deriveInformationDimensions(
    record.topic, 
    record.researchQuestion, 
    record.objective
  );
  const mappedDims = mapClaimsToDimensions(rawDims, claims, record.result.conflicts || []);
  const detailedGaps = detectAndPrioritizeGaps(
    mappedDims, 
    record.topic, 
    record.researchQuestion || record.topic, 
    record.sources.map((s) => s.id)
  );
  const completenessReport = computeResearchCompletenessReport(mappedDims, detailedGaps, claims);
  const detailedConflicts = detectCrossSourceContradictions(claims, record.result.conflicts || []);
  const { audits: freshnessAudits, warnings: freshnessWarnings } = auditSourcesFreshness(record.sources);

  // Merge novel freshness warnings
  const mergedWarnings = [...(record.result.outdated_warnings || [])];
  for (const fw of freshnessWarnings) {
    if (!mergedWarnings.some((w) => w.source === fw.source)) {
      mergedWarnings.push(fw);
    }
  }

  const synthesizedChecklist = generateVerificationPlan(
    record.topic,
    record.researchQuestion || record.topic,
    detailedGaps,
    detailedConflicts,
    mergedWarnings,
    record.sources
  );

  return {
    ...record,
    result: {
      ...record.result,
      extracted_claims: claims,
      dimensions: mappedDims,
      detailed_gaps: detailedGaps,
      completeness_report: completenessReport,
      detailed_conflicts: detailedConflicts,
      freshness_audits: freshnessAudits,
      outdated_warnings: mergedWarnings,
      verification_checklist: synthesizedChecklist.length > 0 ? synthesizedChecklist : record.result.verification_checklist,
      metrics: {
        ...record.result.metrics,
        researchCompletenessScore: completenessReport.overallCompletenessScore,
        conflictCount: detailedConflicts.length,
        outdatedCount: mergedWarnings.length,
      },
    },
  };
}

// -------------------------------------------------------------
// Realistic Default Seed Investigations
// -------------------------------------------------------------
const RAW_DEFAULT_INVESTIGATIONS: InvestigationRecord[] = [
  {
    id: "inv-scholarship-renewal",
    topic: "Undergraduate Merit Scholarship Renewal Protocols",
    researchQuestion: "What are the exact continuity conditions, documentation deadlines, and renewal terms for undergraduate merit awards?",
    objective: "Identify discrepancies in required GPA, documentation tax years, and omitted annual re-application procedures.",
    createdAt: "2026-10-31T14:30:00.000Z",
    status: "completed",
    isStarred: true,
    tags: ["Higher Education", "Financial Aid", "Compliance"],
    sources: [
      {
        id: "Source 1",
        title: "University Financial Aid Official Policy (Excerpts)",
        url: "https://bursar.university.edu/fellowship-terms-2025",
        accessedAt: "2026-10-31T14:28:00.000Z",
        temporalStatus: "current",
        content: `The 2024-2025 Presidential Academic Fellowship awards up to $18,000 per academic year.
Eligibility requires maintaining full-time enrollment (minimum 12 credit hours per semester) and a cumulative GPA of 3.50.
Funds are credited directly to student bursar accounts at the start of each semester.
Applicants must submit certified 2024 tax filings prior to November 15 to remain in good standing.`,
        wordCount: 68,
        reliabilityScore: 92,
        type: "url",
      },
      {
        id: "Source 2",
        title: "Student Handbook & Advising Portal",
        url: "https://handbook.university.edu/student-services/fellowships",
        accessedAt: "2026-10-31T14:29:00.000Z",
        temporalStatus: "current",
        content: `Fellowship recipients must fulfill departmental research commitments and retain a 3.50 GPA.
Verification of residency and income documentation requires W-2 tax forms from the 2025 financial cycle.
Applications are reviewed on a rolling basis through December 31 with applicable administrative review.
Disbursement is processed through the university comptroller upon registrar verification.`,
        wordCount: 72,
        reliabilityScore: 88,
        type: "url",
      },
      {
        id: "Source 3",
        title: "Campus Legacy Archive (2022-2023 Cycle)",
        url: "https://archive.university.edu/bulletins/2022-23-aid",
        accessedAt: "2026-10-31T14:29:30.000Z",
        temporalStatus: "outdated",
        content: `Historical guidelines for the 2022-2023 fellowship program noted a 3.25 GPA threshold.
Note: Students who matriculated prior to Fall 2023 follow grandfathered credit requirements.
Expired cycles require re-verification with financial aid counselor.`,
        wordCount: 46,
        reliabilityScore: 48,
        type: "url",
      },
    ],
    result: {
      id: "ds-scholarship-01",
      topic: "Undergraduate Merit Scholarship Renewal Protocols",
      timestamp: "2026-10-31T14:30:15.000Z",
      sources: [
        {
          id: "Source 1",
          title: "University Financial Aid Official Policy (Excerpts)",
          url: "https://bursar.university.edu/fellowship-terms-2025",
          accessedAt: "2026-10-31T14:28:00.000Z",
          temporalStatus: "current",
          content: "The 2024-2025 Presidential Academic Fellowship awards up to $18,000 per academic year...",
          wordCount: 68,
          reliabilityScore: 92,
          type: "url",
        },
        {
          id: "Source 2",
          title: "Student Handbook & Advising Portal",
          url: "https://handbook.university.edu/student-services/fellowships",
          accessedAt: "2026-10-31T14:29:00.000Z",
          temporalStatus: "current",
          content: "Fellowship recipients must fulfill departmental research commitments and retain a 3.50 GPA...",
          wordCount: 72,
          reliabilityScore: 88,
          type: "url",
        },
        {
          id: "Source 3",
          title: "Campus Legacy Archive (2022-2023 Cycle)",
          url: "https://archive.university.edu/bulletins/2022-23-aid",
          accessedAt: "2026-10-31T14:29:30.000Z",
          temporalStatus: "outdated",
          content: "Historical guidelines for the 2022-2023 fellowship program noted a 3.25 GPA threshold...",
          wordCount: 46,
          reliabilityScore: 48,
          type: "url",
        },
      ],
      structured_summary: [
        {
          fact: "Eligibility strictly requires maintaining full-time enrollment and a cumulative minimum GPA of 3.50.",
          sources: ["Source 1", "Source 2"],
          confidence: 96,
          verificationStatus: "verified",
        },
        {
          fact: "Fellowship awards provide up to $18,000 per academic year, credited on a semester-by-semester basis.",
          sources: ["Source 1"],
          confidence: 90,
          verificationStatus: "verified",
        },
        {
          fact: "Recipients must fulfill designated departmental research commitments to maintain good standing.",
          sources: ["Source 2"],
          confidence: 85,
          verificationStatus: "verified",
        },
      ],
      information_gaps: [
        {
          gap_title: "Automated Renewal vs Re-Application Policy Omitted",
          description: "None of the provided sources specify whether eligibility renews automatically upon meeting the 3.50 GPA threshold or if an annual re-application dossier must be filed.",
          severity: "HIGH",
          signal_label: "Potential Gap — Unverified in provided sources",
          category: "omission",
          suggestedSearchQueries: [
            "\"Presidential Academic Fellowship\" sophomore renewal application",
            "merit fellowship continuous disbursement prerequisites",
          ],
        },
        {
          gap_title: "Probationary Academic Grace Period Unstated",
          description: "The policies do not disclose whether a single semester GPA dip below 3.50 triggers immediate termination or offers a one-semester remediation grace period.",
          severity: "MEDIUM",
          signal_label: "Potential Gap — Unverified in provided sources",
          category: "coverage",
          suggestedSearchQueries: [
            "undergraduate merit scholarship academic probation appeal",
          ],
        },
        {
          gap_title: "Leave of Absence Holding Policy Missing",
          description: "Rules regarding deferral or military/medical leaves of absence are entirely omitted from current published guidelines.",
          severity: "LOW",
          signal_label: "Potential Gap — Unverified in provided sources",
          category: "methodological",
        },
      ],
      conflicts: [
        {
          issue: "Tax Documentation & Verification Year Discrepancy",
          claim_a: "Source 1 states certified tax filings from fiscal cycle 2024 are mandatory.",
          claim_b: "Source 2 explicitly demands W-2 tax forms from fiscal cycle 2025.",
          sources: ["Source 1", "Source 2"],
          varianceDegree: "numerical_discrepancy",
        },
        {
          issue: "Application Submission Deadline Mismatch",
          claim_a: "Source 1 lists a strict cutoff of November 15 at 23:59 EST.",
          claim_b: "Source 2 claims rolling submissions are accepted through December 31.",
          sources: ["Source 1", "Source 2"],
          varianceDegree: "direct_contradiction",
        },
      ],
      outdated_warnings: [
        {
          source: "Source 3",
          warning: "Page references legacy 2022-2023 operational schedules and a 3.25 GPA threshold which is obsolete for current 2026 assessments.",
          detectedCycle: "2022-2023",
          recommendedAction: "Exclude Source 3 from active eligibility calculations and flag legacy students.",
        },
      ],
      verification_checklist: [
        {
          id: "chk-1",
          priority: 1,
          action: "Contact primary financial aid bureau to confirm whether renewal is automatic or requires re-application.",
          completed: false,
          assignedSources: ["Source 1", "Source 2"],
        },
        {
          id: "chk-2",
          priority: 2,
          action: "Reconcile contradictory fiscal documentation years (2024 vs 2025) via official registrar bulletin.",
          completed: false,
          assignedSources: ["Source 1", "Source 2"],
        },
        {
          id: "chk-3",
          priority: 3,
          action: "Audit legacy archive citations against modern 2026 student handbook standards.",
          completed: true,
          assignedSources: ["Source 3"],
        },
      ],
      metrics: {
        totalSources: 3,
        gapCount: 3,
        highSeverityGaps: 1,
        conflictCount: 2,
        outdatedCount: 1,
        verifiedFactCount: 3,
        darkSpotIndex: 78,
        consensusScore: 70,
        temporalFreshnessScore: 80,
      },
    },
  },
  {
    id: "inv-ai-containment",
    topic: "Autonomous Agent Memory Sandboxing & Network Egress",
    researchQuestion: "Are multi-agent persistent memory architectures properly isolated and cryptographically protected against session injection?",
    objective: "Compare memory lease durations, cryptographic key rotation standards, and unpinned egress proxy risks.",
    createdAt: "2026-10-30T11:15:00.000Z",
    status: "completed",
    isStarred: false,
    tags: ["AI Safety", "Cybersecurity", "Runtime Sandboxing"],
    sources: [
      {
        id: "Source 1",
        title: "Agent Safety Protocol v2.4 (2025 Revision)",
        url: "https://safety.ai-research.org/standards/v2-4",
        accessedAt: "2026-10-30T11:10:00.000Z",
        temporalStatus: "current",
        content: "Agent runtime environments must enforce hardware-level memory virtualization with maximum sandbox lease time of 30 minutes...",
        wordCount: 82,
        reliabilityScore: 95,
        type: "url",
      },
      {
        id: "Source 2",
        title: "Enterprise Deployer Operational Whitepaper",
        url: "https://docs.enterprise-agent.io/architecture/whitepaper",
        accessedAt: "2026-10-30T11:12:00.000Z",
        temporalStatus: "current",
        content: "Standard deployment guidelines recommend a 60-minute sandbox lease for compute intensive tasks with persistent memory...",
        wordCount: 78,
        reliabilityScore: 84,
        type: "url",
      },
    ],
    result: {
      id: "ds-ai-02",
      topic: "Autonomous Agent Memory Sandboxing & Network Egress",
      timestamp: "2026-10-30T11:15:20.000Z",
      sources: [
        {
          id: "Source 1",
          title: "Agent Safety Protocol v2.4 (2025 Revision)",
          url: "https://safety.ai-research.org/standards/v2-4",
          accessedAt: "2026-10-30T11:10:00.000Z",
          temporalStatus: "current",
          content: "Agent runtime environments must enforce hardware-level memory virtualization...",
          wordCount: 82,
          reliabilityScore: 95,
          type: "url",
        },
        {
          id: "Source 2",
          title: "Enterprise Deployer Operational Whitepaper",
          url: "https://docs.enterprise-agent.io/architecture/whitepaper",
          accessedAt: "2026-10-30T11:12:00.000Z",
          temporalStatus: "current",
          content: "Standard deployment guidelines recommend a 60-minute sandbox lease...",
          wordCount: 78,
          reliabilityScore: 84,
          type: "url",
        },
      ],
      structured_summary: [
        {
          fact: "Both frameworks require mandatory hardware virtualization isolation between unprivileged agent tool executions.",
          sources: ["Source 1", "Source 2"],
          confidence: 98,
          verificationStatus: "verified",
        },
      ],
      information_gaps: [
        {
          gap_title: "Subagent Identity Delegation Token Format Unspecified",
          description: "Neither source defines the cryptographic format (e.g. JWT vs mTLS) for verifying delegated tool calls between spawned child agents.",
          severity: "HIGH",
          signal_label: "Potential Gap — Unverified in provided sources",
          category: "omission",
        },
      ],
      conflicts: [
        {
          issue: "Sandbox Execution Lease Duration Contradiction",
          claim_a: "Source 1 mandates an enforced maximum session lease of 30 minutes before mandatory teardown.",
          claim_b: "Source 2 permits 60 minutes default lease time with unpinned extension permissions.",
          sources: ["Source 1", "Source 2"],
          varianceDegree: "numerical_discrepancy",
        },
      ],
      outdated_warnings: [],
      verification_checklist: [
        {
          id: "chk-ai-1",
          priority: 1,
          action: "Enforce strict 30-minute sandbox lease boundaries until formal risk assessment is conducted.",
          completed: true,
          assignedSources: ["Source 1"],
        },
      ],
      metrics: {
        totalSources: 2,
        gapCount: 1,
        highSeverityGaps: 1,
        conflictCount: 1,
        outdatedCount: 0,
        verifiedFactCount: 1,
        darkSpotIndex: 62,
        consensusScore: 85,
        temporalFreshnessScore: 98,
      },
    },
  },
  {
    id: "inv-cardiac-anticoagulation",
    topic: "Post-Operative Anticoagulation Protocol in High-Risk Cardiac Surgery",
    researchQuestion: "What is the optimal timing and platelet threshold for initiating therapeutic anticoagulation after sternotomy?",
    objective: "Highlight conflicting surgical ICU thresholds and omitted renal anti-Xa titration schedules.",
    createdAt: "2026-10-29T09:00:00.000Z",
    status: "completed",
    isStarred: false,
    tags: ["Clinical Medicine", "Cardiology", "Patient Safety"],
    sources: [
      {
        id: "Source 1",
        title: "Hospital Clinical Guideline 2025",
        url: "https://guidelines.cardiac-surgery.org/2025-anticoagulation",
        accessedAt: "2026-10-29T08:50:00.000Z",
        temporalStatus: "current",
        content: "Therapeutic LMWH initiation is recommended at 24 hours post-hemostasis if chest tube drainage is under 50mL/hr...",
        wordCount: 88,
        reliabilityScore: 98,
        type: "url",
      },
      {
        id: "Source 2",
        title: "Surgical Intensive Care Unit Protocol",
        url: "https://icu.hospital-network.net/protocols/cardiac-postop",
        accessedAt: "2026-10-29T08:52:00.000Z",
        temporalStatus: "current",
        content: "Prophylactic anticoagulation begins at 12 hours post-extubation regardless of chest tube volume...",
        wordCount: 75,
        reliabilityScore: 89,
        type: "url",
      },
    ],
    result: {
      id: "ds-cardiac-03",
      topic: "Post-Operative Anticoagulation Protocol in High-Risk Cardiac Surgery",
      timestamp: "2026-10-29T09:02:10.000Z",
      sources: [
        {
          id: "Source 1",
          title: "Hospital Clinical Guideline 2025",
          url: "https://guidelines.cardiac-surgery.org/2025-anticoagulation",
          accessedAt: "2026-10-29T08:50:00.000Z",
          temporalStatus: "current",
          content: "Therapeutic LMWH initiation is recommended at 24 hours post-hemostasis...",
          wordCount: 88,
          reliabilityScore: 98,
          type: "url",
        },
        {
          id: "Source 2",
          title: "Surgical Intensive Care Unit Protocol",
          url: "https://icu.hospital-network.net/protocols/cardiac-postop",
          accessedAt: "2026-10-29T08:52:00.000Z",
          temporalStatus: "current",
          content: "Prophylactic anticoagulation begins at 12 hours post-extubation...",
          wordCount: 75,
          reliabilityScore: 89,
          type: "url",
        },
      ],
      structured_summary: [
        {
          fact: "Both guidelines agree that active retrosternal hemorrhage requires complete cessation of therapeutic dosing.",
          sources: ["Source 1", "Source 2"],
          confidence: 100,
          verificationStatus: "verified",
        },
      ],
      information_gaps: [
        {
          gap_title: "Renal Dosage Adjustment Nomogram Missing",
          description: "Neither protocol contains dosing reduction algorithms for patients with eGFR < 30 mL/min/1.73m².",
          severity: "HIGH",
          signal_label: "Potential Gap — Unverified in provided sources",
          category: "methodological",
        },
      ],
      conflicts: [
        {
          issue: "Platelet Count Threshold Inconsistency",
          claim_a: "Source 1 requires minimum platelet count of 100,000/uL prior to full therapeutic dosing.",
          claim_b: "Source 2 allows therapeutic dosing when platelets exceed 75,000/uL.",
          sources: ["Source 1", "Source 2"],
          varianceDegree: "numerical_discrepancy",
        },
      ],
      outdated_warnings: [],
      verification_checklist: [
        {
          id: "chk-card-1",
          priority: 1,
          action: "Convene multidisciplinary hematology-surgery review to resolve platelet cutoff threshold.",
          completed: false,
          assignedSources: ["Source 1", "Source 2"],
        },
      ],
      metrics: {
        totalSources: 2,
        gapCount: 1,
        highSeverityGaps: 1,
        conflictCount: 1,
        outdatedCount: 0,
        verifiedFactCount: 1,
        darkSpotIndex: 68,
        consensusScore: 80,
        temporalFreshnessScore: 95,
      },
    },
  },
];

export const DEFAULT_INVESTIGATIONS: InvestigationRecord[] = RAW_DEFAULT_INVESTIGATIONS.map(
  enrichInvestigationWithGapEngine
);

const STORAGE_KEY = "darkspot_investigations_v3";

export function getStoredInvestigations(): InvestigationRecord[] {
  if (typeof window === "undefined") {
    return DEFAULT_INVESTIGATIONS;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INVESTIGATIONS));
      return DEFAULT_INVESTIGATIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map(enrichInvestigationWithGapEngine);
    }
    return DEFAULT_INVESTIGATIONS;
  } catch (e) {
    console.warn("Error reading investigations from localStorage:", e);
    return DEFAULT_INVESTIGATIONS;
  }
}

export function saveInvestigation(record: InvestigationRecord): void {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredInvestigations();
    const existingIndex = current.findIndex((item) => item.id === record.id);
    let updated: InvestigationRecord[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = record;
    } else {
      updated = [record, ...current];
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Error saving investigation:", e);
  }
}

export function deleteInvestigation(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredInvestigations();
    const filtered = current.filter((item) => item.id !== id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error("Error deleting investigation:", e);
  }
}

export function getInvestigationById(id: string): InvestigationRecord | undefined {
  const all = getStoredInvestigations();
  return all.find((item) => item.id === id);
}

export function toggleChecklistItem(investigationId: string, itemId: string): InvestigationRecord | undefined {
  if (typeof window === "undefined") return undefined;
  const current = getStoredInvestigations();
  const inv = current.find((i) => i.id === investigationId);
  if (!inv) return undefined;

  const updatedChecklist = inv.result.verification_checklist.map((item) => {
    if (item.id === itemId) {
      return { ...item, completed: !item.completed };
    }
    return item;
  });

  const updatedRecord: InvestigationRecord = {
    ...inv,
    result: {
      ...inv.result,
      verification_checklist: updatedChecklist,
    },
  };

  saveInvestigation(updatedRecord);
  return updatedRecord;
}
