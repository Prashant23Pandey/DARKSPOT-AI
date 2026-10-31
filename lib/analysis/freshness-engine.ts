import type { 
  SourceItem, 
  SourceFreshnessAudit, 
  OutdatedWarning, 
  FreshnessCategory 
} from "@/types";

/**
 * Extracts 4-digit years from text, filtering out realistic calendar years (1990 - 2035).
 */
export function extractReferencedYears(text: string): number[] {
  const matches = text.match(/\b(199\d|20[0-3]\d)\b/g);
  if (!matches) return [];
  const years = Array.from(new Set(matches.map((y) => parseInt(y, 10))));
  return years.sort((a, b) => b - a); // descending
}

/**
 * Extracts academic or application cycles, e.g. "2022-2023", "2024-2025", "2025-2026".
 */
export function extractAcademicOrApplicationCycle(text: string): string | undefined {
  const cycleMatch = text.match(/\b(20[1-3]\d)[-–/](20[1-3]\d|\d{2})\b/);
  if (cycleMatch && cycleMatch[0]) {
    return cycleMatch[0];
  }
  return undefined;
}

/**
 * Detects explicit expiration statements (e.g., "Expired on...", "Valid until...", "Cutoff passed").
 */
export function detectExplicitExpiration(text: string): {
  isExpired: boolean;
  expiryDate?: string;
  excerpt?: string;
} {
  const lower = text.toLowerCase();
  const expirePatterns = [
    /expired\s+(?:on|as\s+of)?\s*([a-zA-Z]+\s+\d{1,2},?\s*\d{4})/i,
    /valid\s+(?:only\s+)?through\s+([a-zA-Z]+\s+\d{1,2},?\s*\d{4})/i,
    /valid\s+until\s+([a-zA-Z]+\s+\d{1,2},?\s*\d{4})/i,
    /(?:this\s+policy\s+has\s+expired|program\s+closed|no\s+longer\s+accepting\s+applications)/i,
  ];

  for (const regex of expirePatterns) {
    const match = text.match(regex);
    if (match) {
      return {
        isExpired: true,
        expiryDate: match[1] || undefined,
        excerpt: match[0],
      };
    }
  }

  return { isExpired: false };
}

/**
 * Extracts last updated or revised date from source text or metadata.
 */
export function extractLastUpdatedDate(source: SourceItem): string | undefined {
  if (source.metadata && typeof source.metadata.lastModified === "string") {
    return source.metadata.lastModified;
  }
  const match = source.content.match(/(?:last\s+updated|revised|modified|updated\s+on):\s*([a-zA-Z]+\s+\d{1,2},?\s*\d{4}|\d{4}-\d{2}-\d{2})/i);
  return match && match[1] ? match[1] : undefined;
}

/**
 * Extracts explicit publication date from content or source item.
 * Adheres strictly to rule: Do NOT infer publication date from the URL alone!
 */
export function extractPublicationDate(source: SourceItem): string | undefined {
  if (source.publishedAt && source.publishedAt.trim().length > 3) {
    return source.publishedAt;
  }
  const match = source.content.match(/(?:published|posted|release\s+date):\s*([a-zA-Z]+\s+\d{1,2},?\s*\d{4}|\d{4}-\d{2}-\d{2})/i);
  return match && match[1] ? match[1] : undefined;
}

/**
 * Core Information Freshness Detection Engine.
 * Analyzes each source against temporal criteria, application cycles, and the current investigation year (2026).
 */
export function auditSourcesFreshness(
  sources: SourceItem[],
  currentInvestigationYear: number = new Date().getFullYear() // 2026
): {
  audits: SourceFreshnessAudit[];
  warnings: OutdatedWarning[];
} {
  const audits: SourceFreshnessAudit[] = [];
  const warnings: OutdatedWarning[] = [];

  for (const source of sources) {
    const referencedYears = extractReferencedYears(source.content);
    const academicCycle = extractAcademicOrApplicationCycle(source.content);
    const expiration = detectExplicitExpiration(source.content);
    const publicationDate = extractPublicationDate(source);
    const lastUpdatedDate = extractLastUpdatedDate(source);

    let freshnessStatus: FreshnessCategory = "undated";
    let freshnessExplanation = "";
    let temporalDriftDetected = false;
    let confidence = 85;

    // 1. Check for explicit expiration
    if (expiration.isExpired) {
      freshnessStatus = "expired";
      freshnessExplanation = `Source explicitly states expiration: "${expiration.excerpt}". This document has ceased operational validity.`;
      confidence = 98;
    }
    // 2. Check academic / operational cycle
    else if (academicCycle) {
      // Parse starting year of the cycle
      const cycleStartYear = parseInt(academicCycle.slice(0, 4), 10);
      if (cycleStartYear < currentInvestigationYear - 2) {
        // e.g. 2022-2023 or 2021-2022 relative to 2026
        freshnessStatus = "potentially_outdated";
        freshnessExplanation = `Source references operating cycle "${academicCycle}", which is prior to the active ${currentInvestigationYear} assessment cycle. Operational parameters (e.g. GPA, funding amounts) may be obsolete.`;
        temporalDriftDetected = true;
        confidence = 92;
      } else if (cycleStartYear >= currentInvestigationYear - 1) {
        freshnessStatus = "potentially_current";
        freshnessExplanation = `Source references current or recent operating cycle "${academicCycle}", aligning with active ${currentInvestigationYear} standards.`;
        confidence = 90;
      } else {
        freshnessStatus = "freshness_uncertain";
        freshnessExplanation = `Cycle "${academicCycle}" is adjacent to active cycle; requires registrar confirmation.`;
        confidence = 75;
      }
    }
    // 3. Check referenced years in content
    else if (referencedYears.length > 0) {
      const mostRecentYear = referencedYears[0]!;
      if (mostRecentYear < currentInvestigationYear - 2) {
        freshnessStatus = "potentially_outdated";
        freshnessExplanation = `Most recent referenced year in content is ${mostRecentYear}. No recent citations found for ${currentInvestigationYear}.`;
        temporalDriftDetected = true;
        confidence = 85;
      } else if (mostRecentYear >= currentInvestigationYear - 1) {
        freshnessStatus = "potentially_current";
        freshnessExplanation = `Content references modern milestones (${mostRecentYear}), consistent with current standards.`;
        confidence = 88;
      } else {
        freshnessStatus = "freshness_uncertain";
        freshnessExplanation = `Referenced year ${mostRecentYear} is moderately dated; contemporary validity unverified.`;
        confidence = 70;
      }
    }
    // 4. Undated classification (if no cycle, no years, and no explicit publication date)
    else if (!publicationDate && !lastUpdatedDate) {
      freshnessStatus = "undated";
      freshnessExplanation = "No publication date, revision timestamp, or specific application cycle could be established from page content or metadata.";
      confidence = 95;
    } else {
      freshnessStatus = "freshness_uncertain";
      freshnessExplanation = "Date signals are ambiguous or insufficient to establish active operating status.";
      confidence = 65;
    }

    const audit: SourceFreshnessAudit = {
      source_id: source.id,
      source_title: source.title,
      source_url: source.url,
      publication_date: publicationDate,
      last_updated_date: lastUpdatedDate,
      academic_cycle: academicCycle,
      referenced_years: referencedYears,
      expiry_date: expiration.expiryDate,
      freshness_status: freshnessStatus,
      freshness_explanation: freshnessExplanation,
      is_expired: expiration.isExpired,
      temporal_drift_detected: temporalDriftDetected,
      confidence,
    };
    audits.push(audit);

    // If source is outdated, expired, or exhibits temporal drift, emit a structured OutdatedWarning
    if (freshnessStatus === "potentially_outdated" || freshnessStatus === "expired") {
      warnings.push({
        source: source.id,
        sourceUrl: source.url,
        warning: freshnessExplanation,
        detectedCycle: academicCycle || (referencedYears.length > 0 ? String(referencedYears[0]) : undefined),
        freshnessStatus,
        recommendedAction: freshnessStatus === "expired"
          ? `Disregard ${source.id} for active requirements as explicit expiration was detected.`
          : `Audit ${source.id} against modern ${currentInvestigationYear} official archives. Do not assume older publication date automatically invalidates core principles, but verify numerical limits.`,
      });
    }
  }

  return { audits, warnings };
}
