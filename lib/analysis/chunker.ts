/**
 * NLP Text Normalization, Paragraph Segmentation & Chunking Pipeline
 * Converts long source content into manageable, context-rich chunks with entity and date extraction.
 */

export interface ContentChunk {
  chunkIndex: number;
  sourceId: string;
  sourceTitle: string;
  text: string;
  wordCount: number;
  datesDetected: string[];
  numbersDetected: string[];
  conditionSignals: string[];
}

/**
 * Normalizes source text by removing boilerplate navigation elements,
 * repetitive whitespace, cookie consent banners, and common footer fragments.
 */
export function normalizeSourceText(text: string): string {
  if (!text) return "";

  let cleaned = text
    // Normalize line endings
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    // Remove cookie/privacy banner fragments
    .replace(/(?:accept cookies|cookie policy|we use cookies|privacy preference center|all rights reserved)[^\n]*/gi, " ")
    // Remove header/nav artifacts
    .replace(/(?:skip to content|main navigation|toggle navigation|menu\b)[^\n]*/gi, " ")
    // Collapse multiple empty lines
    .replace(/\n{3,}/g, "\n\n")
    // Collapse multiple horizontal spaces
    .replace(/[ \t]{2,}/g, " ")
    .trim();

  return cleaned;
}

/**
 * Extracts date expressions from text (e.g., "November 15", "2024-2025", "Fall 2024", "12/31/2025").
 */
export function extractDateExpressions(text: string): string[] {
  const dateRegex = /\b(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}|(?:Fall|Spring|Summer|Winter)\s+\d{4}|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}-\d{4}|\b202[0-9]\b)\b/gi;
  const matches = text.match(dateRegex) || [];
  return Array.from(new Set(matches.map((m) => m.trim())));
}

/**
 * Extracts numerical statements, currency amounts, GPA thresholds, percentages, and credit requirements.
 */
export function extractNumericalValues(text: string): string[] {
  const numRegex = /(?:\$\s*\d{1,3}(?:,\d{3})*(?:\.\d+)?|\b\d+(?:\.\d+)?\s*(?:%|percent|GPA|credit hours?|credits?|semester|semesters|hours|days|weeks|months|years|points|mL\/hr)\b)/gi;
  const matches = text.match(numRegex) || [];
  return Array.from(new Set(matches.map((m) => m.trim())));
}

/**
 * Detects conditional and institutional constraint keywords.
 */
export function extractConditionSignals(text: string): string[] {
  const conditionRegex = /\b(?:requires?|mandatory|must\s+(?:submit|maintain|have|provide)|prerequisite|contingent\s+upon|disqualification|ineligible|minimum|threshold|deadline|penalty)\b/gi;
  const matches = text.match(conditionRegex) || [];
  return Array.from(new Set(matches.map((m) => m.toLowerCase().trim())));
}

/**
 * Divides long text into manageable chunks of approximately `maxChars` length,
 * respecting paragraph boundaries and sentence ends, with an overlap.
 */
export function createManageableChunks(
  sourceId: string,
  sourceTitle: string,
  text: string,
  maxChars: number = 1800,
  overlapChars: number = 200
): ContentChunk[] {
  const normalized = normalizeSourceText(text);
  if (!normalized) return [];

  // If text is already under limit, return as single chunk
  if (normalized.length <= maxChars) {
    return [
      {
        chunkIndex: 0,
        sourceId,
        sourceTitle,
        text: normalized,
        wordCount: normalized.split(/\s+/).filter(Boolean).length,
        datesDetected: extractDateExpressions(normalized),
        numbersDetected: extractNumericalValues(normalized),
        conditionSignals: extractConditionSignals(normalized),
      },
    ];
  }

  // Split into paragraphs
  const paragraphs = normalized.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  const chunks: ContentChunk[] = [];
  let currentChunkText = "";
  let chunkIdx = 0;

  for (const para of paragraphs) {
    if (currentChunkText.length + para.length > maxChars && currentChunkText.length > 0) {
      // Finalize current chunk
      chunks.push({
        chunkIndex: chunkIdx++,
        sourceId,
        sourceTitle,
        text: currentChunkText.trim(),
        wordCount: currentChunkText.trim().split(/\s+/).filter(Boolean).length,
        datesDetected: extractDateExpressions(currentChunkText),
        numbersDetected: extractNumericalValues(currentChunkText),
        conditionSignals: extractConditionSignals(currentChunkText),
      });

      // Maintain overlap by retaining the trailing portion of the previous chunk
      const sentences = currentChunkText.split(/(?<=[.!?])\s+/);
      const lastSentence = sentences.slice(-2).join(" ");
      currentChunkText = (lastSentence ? lastSentence + "\n\n" : "") + para;
    } else {
      currentChunkText += (currentChunkText ? "\n\n" : "") + para;
    }
  }

  if (currentChunkText.trim().length > 0) {
    chunks.push({
      chunkIndex: chunkIdx,
      sourceId,
      sourceTitle,
      text: currentChunkText.trim(),
      wordCount: currentChunkText.trim().split(/\s+/).filter(Boolean).length,
      datesDetected: extractDateExpressions(currentChunkText),
      numbersDetected: extractNumericalValues(currentChunkText),
      conditionSignals: extractConditionSignals(currentChunkText),
    });
  }

  return chunks;
}
