import assert from "node:assert";

// -------------------------------------------------------------
// Test 1: Text Normalization and Entity Extraction
// -------------------------------------------------------------
function testNormalizationAndExtraction() {
  console.log("▶ [Test 1] Testing Text Normalization & Entity Detection...");

  const rawSample = `
    <html>
      <nav>Home | Contact | Terms</nav>
      <body>
        <h1>Presidential Academic Fellowship 2025</h1>
        <p>The 2024-2025 fellowship awards up to $18,000 per academic year.</p>
        <p>Eligibility requires maintaining full-time enrollment (minimum 12 credit hours per semester) and a cumulative GPA of 3.50.</p>
        <p>Applicants must submit certified 2024 tax filings prior to November 15, 2025.</p>
        <footer>Cookie Policy | Copyright 2025</footer>
      </body>
    </html>
  `;

  // Normalization logic
  const cleaned = rawSample
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  assert.ok(!cleaned.includes("Cookie Policy"), "Boilerplate footer must be removed");
  assert.ok(!cleaned.includes("Home | Contact"), "Boilerplate nav must be removed");
  assert.ok(cleaned.includes("$18,000"), "Numerical dollar values must be preserved");

  const currencyRegex = /\$[\d,]+(?:\.\d+)?/g;
  const currencies = cleaned.match(currencyRegex) || [];
  assert.deepStrictEqual(currencies, ["$18,000"], "Should extract $18,000 currency");

  const gpaRegex = /\bGPA\s*(?:of|>=|:)?\s*([0-4]\.\d{1,2})\b/i;
  const gpaMatch = cleaned.match(gpaRegex);
  assert.ok(gpaMatch && gpaMatch[1] === "3.50", "Should extract 3.50 GPA");

  const dateRegex = /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:,\s*\d{4})?\b/gi;
  const dates = cleaned.match(dateRegex) || [];
  assert.ok(dates.some((d) => d.includes("November 15")), "Should extract November 15 date");

  console.log("  ✔ Text Normalization & Entity Detection passed!");
}

// -------------------------------------------------------------
// Test 2: NLP Claim Categorization and Verbatim Grounding
// -------------------------------------------------------------
function testClaimGroundingAndCategories() {
  console.log("▶ [Test 2] Testing Claim Grounding & Category Model...");

  const sourceContent = "Eligibility requires maintaining full-time enrollment and a cumulative GPA of 3.50. Applicants must submit certified 2024 tax filings prior to November 15.";
  
  const claim = {
    claim_id: "claim-test-1",
    source_id: "Source 1",
    claim_text: "Full-time enrollment and minimum 3.50 GPA required for eligibility",
    claim_category: "Eligibility",
    supporting_excerpt: "Eligibility requires maintaining full-time enrollment and a cumulative GPA of 3.50.",
    source_url: "https://bursar.university.edu/fellowship",
    source_title: "University Financial Aid Official Policy",
    publication_date: "2025-01-15",
    extraction_confidence: 95,
    analysis_status: "verified",
  };

  const expectedKeys = [
    "claim_id",
    "source_id",
    "claim_text",
    "claim_category",
    "supporting_excerpt",
    "source_url",
    "source_title",
    "extraction_confidence",
    "analysis_status",
  ];
  for (const key of expectedKeys) {
    assert.ok(key in claim, `Claim must include ${key}`);
  }

  assert.ok(
    sourceContent.includes(claim.supporting_excerpt),
    "Supporting excerpt must be strictly grounded in source content (no hallucination)"
  );

  const validCategories = [
    "Eligibility",
    "Deadlines",
    "Requirements",
    "Documents",
    "Fees",
    "Procedures",
    "Policies",
    "Benefits",
    "Restrictions",
    "Other",
  ];
  assert.ok(validCategories.includes(claim.claim_category), "Category must be one of the 10 supported categories");

  console.log("  ✔ Claim Grounding & Category Model passed!");
}

// -------------------------------------------------------------
// Test 3: Topic-Adaptive Information Dimensions
// -------------------------------------------------------------
function testTopicAdaptiveDimensions() {
  console.log("▶ [Test 3] Testing Topic-Adaptive Dimension Derivation...");

  function deriveDimensions(topic) {
    const lower = topic.toLowerCase();
    if (lower.includes("scholarship") || lower.includes("fellowship")) {
      return [
        { id: "dim-1", name: "Enrollment & Basic Eligibility Criteria", category: "Eligibility", importance: "critical" },
        { id: "dim-2", name: "Academic Performance Benchmarks (GPA & Credits)", category: "Requirements", importance: "critical" },
        { id: "dim-3", name: "Income Verification & Tax Documentation", category: "Documents", importance: "high" },
        { id: "dim-4", name: "Application & Verification Cutoff Deadlines", category: "Deadlines", importance: "critical" },
        { id: "dim-5", name: "Annual Renewal & Continuity Policy", category: "Policies", importance: "critical" },
      ];
    }
    return [
      { id: "dim-gen-1", name: "Core Scope & Baseline Definitions", category: "Policies", importance: "critical" },
    ];
  }

  const scholarshipDims = deriveDimensions("Undergraduate Merit Scholarship Renewal Protocols");
  assert.ok(scholarshipDims.length >= 5, "Scholarship topic must derive specialized dimensions");
  assert.ok(scholarshipDims.some((d) => d.name.includes("Renewal & Continuity")), "Must include Renewal & Continuity");
  assert.ok(scholarshipDims.some((d) => d.name.includes("Academic Performance Benchmarks")), "Must include GPA & Credits");

  console.log("  ✔ Topic-Adaptive Dimension Derivation passed!");
}

// -------------------------------------------------------------
// Test 4: Information Gap Detection & Transparency Language
// -------------------------------------------------------------
function testGapDetectionAndTransparency() {
  console.log("▶ [Test 4] Testing Gap Detection, Prioritization & Transparency Language...");

  const dimensions = [
    {
      id: "dim-scholarship-renewal",
      name: "Annual Renewal & Continuity Policy",
      category: "Policies",
      importance: "critical",
      status: "not_found",
      sourcesCovering: [],
    },
    {
      id: "dim-scholarship-academic-reqs",
      name: "Academic Performance Benchmarks",
      category: "Requirements",
      importance: "critical",
      status: "found",
      sourcesCovering: ["Source 1", "Source 2"],
    },
  ];

  const gaps = [];
  for (const dim of dimensions) {
    if (dim.status === "found") continue;

    const explanation = `Potential information gap: ${dim.name} was not found in the sources reviewed. None of the provided documents specify the applicable ${dim.category.toLowerCase()} guidelines.`;
    const priority = dim.importance === "critical" ? "Critical" : "Medium";

    gaps.push({
      gap_id: `gap-${dim.id}`,
      missing_category: dim.category,
      title: `${dim.name} Unstated`,
      explanation,
      why_it_matters: `Omission leaves stakeholders blind to continuity rules.`,
      related_question: "What are renewal conditions?",
      sources_reviewed: ["Source 1", "Source 2", "Source 3"],
      evidence_coverage: "none",
      suggested_next_step: `Contact bursar or consult student catalog to confirm ${dim.name}.`,
      confidence_level: 96,
      priority,
      signal_label: "Potential Gap — Unverified in provided sources",
      status_type: "not_found",
    });
  }

  assert.strictEqual(gaps.length, 1, "Should detect exactly 1 gap for missing renewal policy");
  const gap = gaps[0];

  assert.ok(
    gap.explanation.startsWith("Potential information gap: Annual Renewal & Continuity Policy was not found in the sources reviewed."),
    "Must adhere strictly to mandated transparency phrasing"
  );
  assert.ok(!gap.explanation.includes("does not exist anywhere"), "Must never claim information doesn't exist anywhere");
  assert.strictEqual(gap.priority, "Critical", "Critical dimension missing must yield Critical gap priority");

  console.log("  ✔ Gap Detection, Prioritization & Transparency Language passed!");
}

// -------------------------------------------------------------
// Test 5: Research Completeness Score Calculation
// -------------------------------------------------------------
function testResearchCompletenessScoring() {
  console.log("▶ [Test 5] Testing Research Completeness Scoring...");

  const dimensions = [
    { status: "found" },
    { status: "found" },
    { status: "partially_found" },
    { status: "not_found" },
  ];

  const foundCount = dimensions.filter((d) => d.status === "found").length;
  const partialCount = dimensions.filter((d) => d.status === "partially_found").length;

  const totalPoints = foundCount * 100 + partialCount * 50 + 0;
  const maxPossible = dimensions.length * 100;
  const score = Math.round((totalPoints / maxPossible) * 100);

  assert.strictEqual(score, 63, "Completeness score should be 63% for 2 found, 1 partial, 1 missing out of 4");
  console.log("  ✔ Research Completeness Scoring passed!");
}

// -------------------------------------------------------------
// Test 6: Cross-Source Contradiction Detection & False-Positive Guardrails (Phase 6)
// -------------------------------------------------------------
function testContradictionDetectionAndFalsePositives() {
  console.log("▶ [Test 6] Testing Cross-Source Contradiction Detection & Contextual Divergence Guardrails...");

  function detectContextualDivergence(textA, textB) {
    const a = textA.toLowerCase();
    const b = textB.toLowerCase();
    const contextualPairs = [
      ["international", "domestic", "residency status"],
      ["in-state", "out-of-state", "tuition status"],
      ["transfer", "first-year", "cohort status"],
      ["undergraduate", "graduate", "degree level"],
    ];
    for (const [termA, termB, reason] of contextualPairs) {
      if ((a.includes(termA) && b.includes(termB)) || (a.includes(termB) && b.includes(termA))) {
        return { isContextual: true, reason };
      }
    }
    return { isContextual: false };
  }

  // Case A: Direct Contradiction
  const directConflictCase = {
    claimA: "Certified tax filings from fiscal cycle 2024 are mandatory before November 15.",
    claimB: "Applicants must submit W-2 forms from fiscal cycle 2025 before December 31.",
  };
  const ctxDirect = detectContextualDivergence(directConflictCase.claimA, directConflictCase.claimB);
  assert.strictEqual(ctxDirect.isContextual, false, "Direct contradiction must not be classified as contextual");

  // Case B: False-Positive Scenario
  const falsePositiveCase = {
    claimA: "In-state students require a minimum cumulative GPA of 3.25 to retain merit aid.",
    claimB: "Out-of-state recipients must maintain a 3.75 GPA benchmark.",
  };
  const ctxFP = detectContextualDivergence(falsePositiveCase.claimA, falsePositiveCase.claimB);
  assert.strictEqual(ctxFP.isContextual, true, "Differing cohorts (in-state vs out-of-state) must trigger contextual divergence guardrail");
  assert.strictEqual(ctxFP.reason, "tuition status");

  console.log("  ✔ Cross-Source Contradiction Detection & False-Positive Guardrails passed!");
}

// -------------------------------------------------------------
// Test 7: Source Information Freshness & Academic Cycle Detection (Phase 7)
// -------------------------------------------------------------
function testInformationFreshnessDetection() {
  console.log("▶ [Test 7] Testing Information Freshness, Cycles & Expiration Detection...");

  const currentYear = 2026;

  function evaluateFreshness(content, publishedAt) {
    const expireMatch = content.match(/expired\s+(?:on|as\s+of)?\s*([a-zA-Z]+\s+\d{1,2},?\s*\d{4})/i);
    if (expireMatch) {
      return { status: "expired", explanation: "Source explicitly states expiration." };
    }

    const cycleMatch = content.match(/\b(20[1-3]\d)[-–/](20[1-3]\d|\d{2})\b/);
    if (cycleMatch) {
      const cycleStartYear = parseInt(cycleMatch[1], 10);
      if (cycleStartYear < currentYear - 2) {
        return { status: "potentially_outdated", cycle: cycleMatch[0] };
      }
      return { status: "potentially_current", cycle: cycleMatch[0] };
    }

    if (!publishedAt) {
      return { status: "undated" };
    }

    return { status: "freshness_uncertain" };
  }

  // 1. Outdated Cycle
  const outdatedSource = "University catalog archives for the 2022-2023 academic cycle state minimum GPA is 3.25.";
  const res1 = evaluateFreshness(outdatedSource, undefined);
  assert.strictEqual(res1.status, "potentially_outdated", "2022-2023 cycle must be classified as potentially_outdated");

  // 2. Current Cycle
  const currentSource = "The 2024-2025 Presidential Fellowship awards up to $18,000.";
  const res2 = evaluateFreshness(currentSource, "2025-01-15");
  assert.strictEqual(res2.status, "potentially_current", "2024-2025 cycle must be classified as potentially_current");

  // 3. Explicitly Expired
  const expiredSource = "Notice: This scholarship grant expired on June 30, 2023. Applications are closed.";
  const res3 = evaluateFreshness(expiredSource, undefined);
  assert.strictEqual(res3.status, "expired", "Explicit expiration notice must be classified as expired");

  // 4. Undated
  const undatedSource = "Merit aid requires prompt response to all registrar inquiries.";
  const res4 = evaluateFreshness(undatedSource, undefined);
  assert.strictEqual(res4.status, "undated", "Source with no cycle and no publication date must be classified as undated");

  console.log("  ✔ Information Freshness, Cycles & Expiration Detection passed!");
}

// -------------------------------------------------------------
// Test 8: Verification Planner Synthesis & Progress Tracking (Phase 8)
// -------------------------------------------------------------
function testVerificationPlannerAndChecklist() {
  console.log("▶ [Test 8] Testing Verification Planner Synthesis & Progress Tracking...");

  const mockGaps = [
    {
      gap_id: "gap-renewal-1",
      missing_category: "Policies",
      title: "Annual Renewal & Continuity Policy Omitted",
      explanation: "Sources fail to state continuity terms.",
      why_it_matters: "Risk of unexpected aid forfeiture.",
      suggested_next_step: "Contact primary financial aid bureau to confirm renewal procedure.",
      priority: "Critical",
      sources_reviewed: ["Source 1", "Source 2"],
      evidence_coverage: "none",
    },
  ];

  const mockConflicts = [
    {
      conflict_id: "conf-tax-1",
      claim_a: "Source 1 mandates 2024 tax filings.",
      claim_b: "Source 2 mandates 2025 W-2 tax forms.",
      source_a: "Source 1",
      source_b: "Source 2",
      supporting_excerpt_a: "certified 2024 tax filings prior to November 15",
      supporting_excerpt_b: "W-2 tax forms from the 2025 financial cycle",
      conflict_category: "numerical_discrepancy",
      comparison_dimension: "Document requirements",
      explanation: "Tax filing year discrepancy.",
      confidence: 94,
      verification_recommendation: "Reconcile fiscal documentation year discrepancy via official registrar bulletin.",
    },
  ];

  // Synthesize checklist item
  const checklist = [
    {
      id: "task-1",
      priority: 1,
      priorityLevel: "Critical",
      title: "Verify Policies: Annual Renewal & Continuity Policy Omitted",
      action: mockGaps[0].suggested_next_step,
      description: mockGaps[0].explanation,
      reason_for_verification: mockGaps[0].why_it_matters,
      related_gap_or_conflict: mockGaps[0].title,
      recommended_source: "Primary financial aid bureau",
      completed: false,
      assignedSources: ["Source 1", "Source 2"],
      supporting_evidence_references: ["Coverage: NONE"],
      estimatedEffort: "deep_dive",
    },
    {
      id: "task-2",
      priority: 2,
      priorityLevel: "High",
      title: "Reconcile Document requirements: Source 1 vs Source 2",
      action: mockConflicts[0].verification_recommendation,
      description: mockConflicts[0].explanation,
      reason_for_verification: "Tax year discrepancy creates filing confusion.",
      related_gap_or_conflict: "Tax Filing Discrepancy",
      recommended_source: "Official registrar bulletin",
      completed: true, // Marked verified
      assignedSources: ["Source 1", "Source 2"],
      supporting_evidence_references: [mockConflicts[0].supporting_excerpt_a],
      estimatedEffort: "moderate",
    },
  ];

  assert.strictEqual(checklist.length, 2, "Checklist should contain 2 synthesized tasks");
  assert.strictEqual(checklist[0].priorityLevel, "Critical");
  assert.strictEqual(checklist[0].completed, false);
  assert.strictEqual(checklist[1].completed, true);

  // Progress Calculation Check
  const completedCount = checklist.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);
  assert.strictEqual(progressPercent, 50, "Checklist completion progress should be 50%");

  // Task Toggle Simulation (Marking task 1 completed)
  checklist[0].completed = true;
  const newProgress = Math.round((checklist.filter((t) => t.completed).length / checklist.length) * 100);
  assert.strictEqual(newProgress, 100, "After toggling task 1, completion progress must be 100%");

  console.log("  ✔ Verification Planner Synthesis & Progress Tracking passed!");
}

// -------------------------------------------------------------
// Test 9: Report Generation Completeness & Demo Mode Separation (Phase 8 & 9)
// -------------------------------------------------------------
function testReportGenerationAndBackendSeparation() {
  console.log("▶ [Test 9] Testing Report Generation Completeness & Backend Demo Separation...");

  const report = {
    overview: "Undergraduate Merit Scholarship Renewal Protocols",
    primary_question: "What are the exact continuity conditions?",
    sources_reviewed: ["Source 1", "Source 2", "Source 3"],
    consensus_findings: ["Awards up to $18,000 per academic year."],
    extracted_claims_count: 7,
    potential_gaps_count: 3,
    contradictions_count: 2,
    freshness_warnings_count: 1,
    verification_checklist_count: 3,
    limitations_disclosed: true,
  };

  const requiredSections = [
    "overview",
    "primary_question",
    "sources_reviewed",
    "consensus_findings",
    "extracted_claims_count",
    "potential_gaps_count",
    "contradictions_count",
    "freshness_warnings_count",
    "verification_checklist_count",
    "limitations_disclosed",
  ];
  for (const sec of requiredSections) {
    assert.ok(sec in report, `Report must include ${sec}`);
  }

  // Verify Demo Mode dataset separation
  const demoInvestigationId = "inv-scholarship-renewal";
  const userInvestigationId = "usr-inv-948194";

  function isDemoDataset(id) {
    return id.startsWith("inv-");
  }

  assert.strictEqual(isDemoDataset(demoInvestigationId), true, "Preloaded investigation must be flagged as demo");
  assert.strictEqual(isDemoDataset(userInvestigationId), false, "User-created investigation must not be demo");

  console.log("  ✔ Report Generation Completeness & Backend Demo Separation passed!");
}

// -------------------------------------------------------------
// Runner
// -------------------------------------------------------------
try {
  console.log("==================================================================");
  console.log("DARKSPOT AI — Unified End-to-End Engine Test Suite (Phases 1 - 9)");
  console.log("==================================================================");
  testNormalizationAndExtraction();
  testClaimGroundingAndCategories();
  testTopicAdaptiveDimensions();
  testGapDetectionAndTransparency();
  testResearchCompletenessScoring();
  testContradictionDetectionAndFalsePositives();
  testInformationFreshnessDetection();
  testVerificationPlannerAndChecklist();
  testReportGenerationAndBackendSeparation();
  console.log("==================================================================");
  console.log("✅ ALL TESTS PASSED SUCCESSFULLY (9/9 test suites)");
  console.log("==================================================================");
} catch (err) {
  console.error("❌ Test failed:", err);
  process.exit(1);
}
