import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Standard utility to conditionally combine and merge Tailwind CSS classes.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format date timestamp into human-readable string.
 */
export function formatDate(dateString?: string | null): string {
  if (!dateString) return "Undated";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  } catch {
    return dateString;
  }
}

/**
 * Calculates a 0-100 Dark Spot Index based on gaps, conflicts, and outdated information.
 * Higher score indicates a higher density of blind spots / risk.
 */
export function calculateDarkSpotIndex(
  gapsCount: number,
  highSeverityGaps: number,
  conflictsCount: number,
  outdatedCount: number,
  factsCount: number
): number {
  if (gapsCount === 0 && conflictsCount === 0 && outdatedCount === 0) {
    return 8; // Baseline clean
  }
  const weightedRisk =
    highSeverityGaps * 25 +
    (gapsCount - highSeverityGaps) * 12 +
    conflictsCount * 20 +
    outdatedCount * 15;

  const totalPoints = weightedRisk;
  const normalized = Math.min(Math.max(Math.round((totalPoints / (factsCount + totalPoints + 1)) * 100), 12), 96);
  return normalized;
}
