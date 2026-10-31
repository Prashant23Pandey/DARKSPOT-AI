import type { 
  AnalysisMetrics, 
  InformationGap, 
  ConflictItem, 
  OutdatedWarning, 
  SummaryFact, 
  SourceItem 
} from "@/types";
import { calculateDarkSpotIndex } from "@/lib/utils";

export function computeAnalysisMetrics(
  sources: SourceItem[],
  facts: SummaryFact[],
  gaps: InformationGap[],
  conflicts: ConflictItem[],
  outdated: OutdatedWarning[]
): AnalysisMetrics {
  const highSeverityGaps = gaps.filter((g) => g.severity === "HIGH").length;
  const darkSpotIndex = calculateDarkSpotIndex(
    gaps.length,
    highSeverityGaps,
    conflicts.length,
    outdated.length,
    facts.length
  );

  // Consensus score: Higher if few conflicts relative to verified facts
  const conflictDeduction = conflicts.length * 15;
  const consensusScore = Math.max(10, Math.min(100, 100 - conflictDeduction));

  // Freshness score: Degraded by outdated sources
  const outdatedRatio = sources.length > 0 ? outdated.length / sources.length : 0;
  const temporalFreshnessScore = Math.round(Math.max(15, 100 - outdatedRatio * 60));

  return {
    totalSources: sources.length,
    gapCount: gaps.length,
    highSeverityGaps,
    conflictCount: conflicts.length,
    outdatedCount: outdated.length,
    verifiedFactCount: facts.length,
    darkSpotIndex,
    consensusScore,
    temporalFreshnessScore,
  };
}
