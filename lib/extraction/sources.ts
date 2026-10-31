import type { SourceItem, TemporalStatus } from "@/types";
import { stripHtml, extractDomain, countWords, generateExcerpt } from "./cleaner";

export interface RawSourceInput {
  type: "url" | "raw_text";
  content: string;
  title?: string;
}

/**
 * Detects whether a document contains signals of outdated temporal cycles
 * (e.g., 2021-2023 references when current cycle is 2026).
 */
export function detectTemporalStatus(content: string): TemporalStatus {
  const currentYear = new Date().getFullYear(); // e.g. 2026
  const outdatedRegex = /\b(201\d|202[0-4])\b/g;
  const recentRegex = new RegExp(`\\b(2025|${currentYear}|${currentYear + 1})\\b`, "g");

  const hasOutdatedYears = outdatedRegex.test(content);
  const hasCurrentYears = recentRegex.test(content);

  if (hasOutdatedYears && !hasCurrentYears) {
    return "outdated";
  }
  if (hasCurrentYears) {
    return "current";
  }
  return "undated";
}

/**
 * Normalizes user provided raw sources into structured SourceItems with IDs
 */
export function normalizeSources(inputs: RawSourceInput[]): SourceItem[] {
  const now = new Date().toISOString();

  return inputs.map((input, index) => {
    const sourceLabel = `Source ${index + 1}`;
    const cleanedText = input.type === "url" 
      ? `Extracted content from ${input.content}` 
      : stripHtml(input.content);

    const title = input.title?.trim() || (input.type === "url" ? extractDomain(input.content) : `Document Excerpt #${index + 1}`);
    const wordCount = countWords(cleanedText);
    const temporalStatus = detectTemporalStatus(cleanedText);

    return {
      id: sourceLabel,
      title,
      url: input.type === "url" ? input.content : undefined,
      accessedAt: now,
      temporalStatus,
      content: cleanedText,
      excerpt: generateExcerpt(cleanedText, 200),
      wordCount,
      reliabilityScore: temporalStatus === "outdated" ? 48 : 88,
      type: input.type === "url" ? "url" : "raw_text",
    };
  });
}
