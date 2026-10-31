import type { 
  ExtractedClaim, 
  InformationDimension, 
  DetailedInformationGap, 
  ResearchCompletenessReport,
  ClaimCategory,
  DimensionStatus,
  GapPriority,
  SourceItem,
  ConflictItem
} from "@/types";

/**
 * STEP 1: Understand the research question & derive topic-adaptive dimensions
 */
export function deriveInformationDimensions(
  topic: string,
  question?: string,
  objective?: string,
  context?: string
): Omit<InformationDimension, "mappedClaims" | "status" | "coveragePercentage" | "sourcesCovering">[] {
  const combined = `${topic} ${question || ""} ${objective || ""} ${context || ""}`.toLowerCase();

  // 1. Scholarship, Fellowship, Financial Aid, Grant Domain
  if (
    combined.includes("scholarship") ||
    combined.includes("fellowship") ||
    combined.includes("grant") ||
    combined.includes("aid") ||
    combined.includes("tuition") ||
    combined.includes("academic")
  ) {
    return [
      {
        id: "dim-scholarship-eligibility",
        name: "Enrollment & Basic Eligibility Criteria",
        category: "Eligibility",
        description: "Full-time matriculation status, degree progress, and baseline residency conditions.",
        importance: "critical",
      },
      {
        id: "dim-scholarship-academic-reqs",
        name: "Academic Performance Benchmarks (GPA & Credits)",
        category: "Requirements",
        description: "Minimum cumulative GPA threshold and required semester credit load to retain award.",
        importance: "critical",
      },
      {
        id: "dim-scholarship-documents",
        name: "Income Verification & Tax Documentation",
        category: "Documents",
        description: "Mandatory tax filing years, W-2 forms, and financial verification records.",
        importance: "high",
      },
      {
        id: "dim-scholarship-deadlines",
        name: "Application & Verification Cutoff Deadlines",
        category: "Deadlines",
        description: "Strict submission cutoff dates, time zones, and penalties for late filings.",
        importance: "critical",
      },
      {
        id: "dim-scholarship-renewal",
        name: "Annual Renewal & Continuity Policy",
        category: "Policies",
        description: "Rules regarding whether awards renew automatically or require annual re-application dossiers.",
        importance: "critical",
      },
      {
        id: "dim-scholarship-probation",
        name: "Academic Probation & Remediation Window",
        category: "Restrictions",
        description: "Policies outlining grace periods or appeal mechanisms if GPA temporarily falls below cutoff.",
        importance: "high",
      },
      {
        id: "dim-scholarship-disbursement",
        name: "Disbursement Schedule & Method",
        category: "Benefits",
        description: "Method of funding distribution (direct bursar credit vs direct deposit) and semester timing.",
        importance: "medium",
      },
      {
        id: "dim-scholarship-appeal",
        name: "Disqualification Appeals & Committee Oversight",
        category: "Procedures",
        description: "Formal procedural channels and timelines to contest award cancellation or revocation.",
        importance: "medium",
      },
    ];
  }

  // 2. AI Safety, Software Architecture, Agent Containment Domain
  if (
    combined.includes("agent") ||
    combined.includes("memory") ||
    combined.includes("sandbox") ||
    combined.includes("safety") ||
    combined.includes("containment") ||
    combined.includes("security")
  ) {
    return [
      {
        id: "dim-ai-sandbox",
        name: "Hardware Virtualization & Isolation Boundaries",
        category: "Requirements",
        description: "Hardware-level memory and compute virtualization safeguards separating unprivileged agents.",
        importance: "critical",
      },
      {
        id: "dim-ai-lease",
        name: "Sandbox Lease Duration & Lifetime Quotas",
        category: "Policies",
        description: "Strict time limits, timeout policies, and automatic container teardown rules.",
        importance: "critical",
      },
      {
        id: "dim-ai-egress",
        name: "Network Egress Proxy & Certificate Pinning",
        category: "Restrictions",
        description: "Cryptographic proxy enforcement, domain whitelisting, and TLS inspection standards.",
        importance: "high",
      },
      {
        id: "dim-ai-memory-rotation",
        name: "Persistent Memory Cryptographic Token Rotation",
        category: "Policies",
        description: "Session lifetime token rotation schedules and memory purge mechanisms.",
        importance: "high",
      },
      {
        id: "dim-ai-delegation",
        name: "Subagent Delegation & Tool Execution Authority",
        category: "Procedures",
        description: "Cryptographic signing and privilege scoping when parent agents delegate tool calls.",
        importance: "critical",
      },
      {
        id: "dim-ai-telemetry",
        name: "Audit Logging & Egress Telemetry Retention",
        category: "Documents",
        description: "Audit trail storage horizons and tamper-evident event streaming.",
        importance: "medium",
      },
    ];
  }

  // 3. Clinical Medicine & Surgical Protocols
  if (
    combined.includes("cardiac") ||
    combined.includes("anticoagul") ||
    combined.includes("clinical") ||
    combined.includes("surgery") ||
    combined.includes("patient") ||
    combined.includes("dose")
  ) {
    return [
      {
        id: "dim-clinical-initiation",
        name: "Post-Operative Hemostasis & Initiation Window",
        category: "Deadlines",
        description: "Specific hourly cutoff post-extubation/hemostasis before starting therapeutic dosing.",
        importance: "critical",
      },
      {
        id: "dim-clinical-platelets",
        name: "Platelet & Coagulation Cutoff Thresholds",
        category: "Requirements",
        description: "Absolute minimum platelet count and coagulation metrics prior to full anticoagulation.",
        importance: "critical",
      },
      {
        id: "dim-clinical-renal",
        name: "Renal Impairment Dosing Adjustment Nomogram",
        category: "Procedures",
        description: "Explicit dose titration algorithms based on eGFR / creatinine clearance.",
        importance: "critical",
      },
      {
        id: "dim-clinical-contraindication",
        name: "Hemorrhage Signs & Absolute Contraindications",
        category: "Restrictions",
        description: "Triggers requiring immediate therapy withholding (e.g. chest tube drainage > 50 mL/hr).",
        importance: "critical",
      },
      {
        id: "dim-clinical-monitoring",
        name: "Laboratory Anti-Xa & aPTT Monitoring Frequency",
        category: "Procedures",
        description: "Recommended surveillance intervals (e.g. q12h vs daily) for therapeutic confirmation.",
        importance: "high",
      },
    ];
  }

  // 4. General / Universal Research Dimension Fallback
  return [
    {
      id: "dim-gen-scope",
      name: "Core Scope & Baseline Definitions",
      category: "Policies",
      description: "Fundamental definitions, operational scope, and jurisdictional boundaries.",
      importance: "critical",
    },
    {
      id: "dim-gen-requirements",
      name: "Mandatory Prerequisites & Qualifications",
      category: "Requirements",
      description: "Minimum requirements, qualifications, and compliance conditions.",
      importance: "critical",
    },
    {
      id: "dim-gen-deadlines",
      name: "Key Deadlines & Operational Milestones",
      category: "Deadlines",
      description: "Temporal cutoff dates, filing schedules, and statutory time limits.",
      importance: "critical",
    },
    {
      id: "dim-gen-documents",
      name: "Required Artifacts & Evidence Documentation",
      category: "Documents",
      description: "Forms, official certificates, balance sheets, and audit filings.",
      importance: "high",
    },
    {
      id: "dim-gen-procedures",
      name: "Submission & Review Protocols",
      category: "Procedures",
      description: "Step-by-step procedures, administrative pathways, and decision criteria.",
      importance: "high",
    },
    {
      id: "dim-gen-restrictions",
      name: "Restrictions, Disqualifications & Penalties",
      category: "Restrictions",
      description: "Prohibited actions, disqualification triggers, and enforcement consequences.",
      importance: "high",
    },
  ];
}

/**
 * STEP 2: Map extracted claims to dimensions using semantic & rule-based checks
 */
export function mapClaimsToDimensions(
  dimensions: ReturnType<typeof deriveInformationDimensions>,
  claims: ExtractedClaim[],
  conflicts: ConflictItem[]
): InformationDimension[] {
  return dimensions.map((dim) => {
    // Collect claims that match by category or by keyword relevance
    const dimKeywords = dim.name
      .toLowerCase()
      .split(/[\s,&()]+/)
      .filter((w) => w.length > 3);

    const mapped = claims.filter((c) => {
      // 1. Direct Category Match
      if (c.claim_category === dim.category) return true;

      // 2. Keyword relevance in claim text
      const lowerText = c.claim_text.toLowerCase();
      const hasKeywordMatch = dimKeywords.some((kw) => lowerText.includes(kw));
      return hasKeywordMatch;
    });

    // Check if any conflicts involve this dimension's scope
    const hasConflict = conflicts.some((conf) => {
      const confText = `${conf.issue} ${conf.claim_a} ${conf.claim_b}`.toLowerCase();
      return dimKeywords.some((kw) => confText.includes(kw));
    });

    const sourcesCovering = Array.from(new Set(mapped.map((c) => c.source_id)));

    let status: DimensionStatus = "not_found";
    let coveragePercentage = 0;
    let explanation = `Potential information gap: ${dim.name} was not found in the sources reviewed.`;

    if (hasConflict) {
      status = "conflicting";
      coveragePercentage = 50;
      explanation = `Conflicting evidence detected across sources regarding ${dim.name}.`;
    } else if (mapped.length >= 2 && sourcesCovering.length >= 2) {
      status = "found";
      coveragePercentage = 100;
      explanation = `Adequately addressed with consensus verified across multiple sources (${sourcesCovering.join(", ")}).`;
    } else if (mapped.length >= 1) {
      status = "partially_found";
      coveragePercentage = 55;
      explanation = `Partially addressed in ${sourcesCovering.join(", ")}, but lacks comprehensive specification.`;
    } else {
      status = "not_found";
      coveragePercentage = 0;
      explanation = `Potential information gap: ${dim.name} was not found in the sources reviewed.`;
    }

    return {
      ...dim,
      status,
      mappedClaims: mapped,
      coveragePercentage,
      sourcesCovering,
      explanation,
    };
  });
}

/**
 * STEP 3 & STEP 4: Detect Potential Gaps & Prioritize
 */
export function detectAndPrioritizeGaps(
  dimensions: InformationDimension[],
  topic: string,
  question: string,
  allSourceIds: string[]
): DetailedInformationGap[] {
  const gaps: DetailedInformationGap[] = [];

  for (const dim of dimensions) {
    // Gaps occur when dimension is "not_found", "partially_found", or "conflicting"
    if (dim.status === "found") continue;

    const gapId = `gap-${dim.id.replace(/^dim-/, "")}`;

    // Step 4: Determine priority
    let priority: GapPriority = "Medium";
    if (dim.importance === "critical") {
      priority = "Critical";
    } else if (dim.importance === "high") {
      priority = "High";
    } else if (dim.category === "Deadlines" || dim.category === "Eligibility") {
      priority = "Critical";
    } else if (dim.status === "conflicting") {
      priority = "High";
    } else {
      priority = "Medium";
    }

    // Step 5: Transparency language - NEVER claim info does not exist anywhere!
    let explanation = "";
    let evidenceCoverage: "none" | "partial" | "unclear" | "conflicting" = "none";
    let statusType: "not_found" | "not_applicable" | "not_reviewed" | "uncertain" = "not_found";

    if (dim.status === "not_found") {
      explanation = `Potential information gap: ${dim.name} was not found in the sources reviewed. None of the provided documents specify the applicable ${dim.category.toLowerCase()} guidelines.`;
      evidenceCoverage = "none";
      statusType = "not_found";
    } else if (dim.status === "partially_found") {
      explanation = `Potential information gap: Incomplete evidence for ${dim.name}. While touched upon by ${dim.sourcesCovering.join(", ")}, essential operational conditions remain unstated.`;
      evidenceCoverage = "partial";
      statusType = "uncertain";
    } else if (dim.status === "conflicting") {
      explanation = `Potential information gap: Contradictory evidence detected for ${dim.name}. Sources reviewed offer mutually incompatible statements requiring official clarification.`;
      evidenceCoverage = "conflicting";
      statusType = "uncertain";
    }

    // Why this information matters
    const whyItMatters = generateImpactRationale(dim.name, dim.category, topic);

    // Suggested next verification step
    const suggestedNextStep = generateSuggestedVerification(dim.name, dim.category, dim.sourcesCovering);

    gaps.push({
      gap_id: gapId,
      dimension_id: dim.id,
      missing_category: dim.category,
      title: `${dim.name} Omitted or Incomplete`,
      explanation,
      why_it_matters: whyItMatters,
      related_question: question || `What are the requirements for ${topic}?`,
      sources_reviewed: allSourceIds,
      evidence_coverage: evidenceCoverage,
      suggested_next_step: suggestedNextStep,
      confidence_level: dim.status === "not_found" ? 95 : 85,
      priority,
      signal_label: "Potential Gap — Unverified in provided sources",
      status_type: statusType,
    });
  }

  // Sort by priority (Critical first, then High, Medium, Low)
  const priorityOrder: Record<GapPriority, number> = {
    Critical: 0,
    High: 1,
    Medium: 2,
    Low: 3,
  };

  return gaps.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

function generateImpactRationale(dimensionName: string, category: ClaimCategory, topic: string): string {
  switch (category) {
    case "Eligibility":
      return `Without clear eligibility rules, applicants cannot determine if they qualify, risking wasted effort or disqualification.`;
    case "Deadlines":
      return `Missing or unverified deadlines risk immediate forfeiture or severe late submission penalties.`;
    case "Requirements":
      return `Omitting specific performance benchmarks prevents ongoing compliance tracking and audit readiness.`;
    case "Documents":
      return `Uncertainty in required document years or formats may cause administrative rejection during verification.`;
    case "Policies":
      return `Omission of continuity or renewal terms leaves stakeholders blind to long-term sustainability for "${topic}".`;
    case "Restrictions":
      return `Unstated restrictions risk inadvertent violation of institutional disqualification triggers.`;
    case "Procedures":
      return `Absence of formal procedural or appeal guidelines deprives participants of administrative recourse.`;
    default:
      return `Crucial parameter needed to establish comprehensive research completeness and avoid decision blindspots.`;
  }
}

function generateSuggestedVerification(dimensionName: string, category: ClaimCategory, sourcesCovering: string[]): string {
  if (sourcesCovering.length > 0) {
    return `Cross-examine ${sourcesCovering.join(" and ")} against modern registrar/administrative archives to reconcile ${dimensionName}.`;
  }
  return `Contact primary regulatory authority or consult latest official bulletin to verify missing ${dimensionName}.`;
}

/**
 * STEP 6: Compute Research Completeness Report & Metrics
 */
export function computeResearchCompletenessReport(
  dimensions: InformationDimension[],
  gaps: DetailedInformationGap[],
  claims: ExtractedClaim[]
): ResearchCompletenessReport {
  const totalDimensions = dimensions.length;
  const foundCount = dimensions.filter((d) => d.status === "found").length;
  const partialCount = dimensions.filter((d) => d.status === "partially_found").length;
  const missingCount = dimensions.filter((d) => d.status === "not_found").length;
  const conflictingCount = dimensions.filter((d) => d.status === "conflicting").length;
  const unclearCount = dimensions.filter((d) => d.status === "unclear").length;

  const totalPoints = foundCount * 100 + partialCount * 50 + conflictingCount * 25;
  const maxPossible = totalDimensions * 100;
  const overallCompletenessScore = maxPossible > 0 ? Math.round((totalPoints / maxPossible) * 100) : 0;

  const priorityDistribution = {
    critical: gaps.filter((g) => g.priority === "Critical").length,
    high: gaps.filter((g) => g.priority === "High").length,
    medium: gaps.filter((g) => g.priority === "Medium").length,
    low: gaps.filter((g) => g.priority === "Low").length,
  };

  return {
    overallCompletenessScore,
    totalDimensions,
    foundCount,
    partialCount,
    missingCount,
    conflictingCount,
    unclearCount,
    priorityDistribution,
    dimensions,
    detailedGaps: gaps,
    extractedClaims: claims,
  };
}
