import { z } from "zod";
import type { ExtractedClaim, ClaimCategory, SourceItem } from "@/types";
import { 
  createManageableChunks, 
  extractDateExpressions, 
  extractNumericalValues, 
  extractConditionSignals 
} from "./chunker";

export const ClaimCategorySchema = z.enum([
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
]);

export const RawClaimSchema = z.object({
  claim_text: z.string().min(3),
  claim_category: ClaimCategorySchema,
  supporting_excerpt: z.string().min(5),
  related_question: z.string().optional(),
  extraction_confidence: z.number().min(0).max(100).default(90),
  analysis_status: z.enum(["verified", "unverified", "contradicted", "provisional"]).default("verified"),
  entities_detected: z.array(z.string()).default([]),
  dates_detected: z.array(z.string()).default([]),
  numerical_values: z.array(z.string()).default([]),
  conditions: z.array(z.string()).default([]),
});

export const ClaimsBatchResponseSchema = z.object({
  claims: z.array(RawClaimSchema).default([]),
});

const CLAIM_EXTRACTION_SYSTEM_PROMPT = `You are an expert NLP evidence extraction engine.
Your objective: Extract every explicit, factual statement from the provided source text.

For every factual claim, provide:
- claim_text: Concise, clear statement of fact.
- claim_category: One of ["Eligibility", "Deadlines", "Requirements", "Documents", "Fees", "Procedures", "Policies", "Benefits", "Restrictions", "Other"].
- supporting_excerpt: The EXACT verbatim sentence or sentence fragment from the source text where this fact is stated. Never fabricate or hallucinate an excerpt!
- extraction_confidence: Score from 0 to 100 based on explicitness.
- dates_detected: Any dates or years in the statement.
- numerical_values: Any numbers, percentages, GPA, credits, or dollar figures.
- conditions: Any mandatory prerequisite or constraint keywords.

Return ONLY pure valid JSON matching:
{
  "claims": [
    {
      "claim_text": "...",
      "claim_category": "...",
      "supporting_excerpt": "...",
      "extraction_confidence": 95,
      "dates_detected": ["..."],
      "numerical_values": ["..."],
      "conditions": ["..."]
    }
  ]
}`;

/**
 * Deterministic sentence-level claim extractor fallback when no API key is present.
 * Uses linguistic heuristics, keyword categorization, and verbatim excerpt grounding.
 */
export function extractClaimsDeterministically(source: SourceItem, relatedQuestion?: string): ExtractedClaim[] {
  const text = source.content;
  if (!text || text.trim().length === 0) return [];

  // Split into sentences
  const sentences = text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  const claims: ExtractedClaim[] = [];
  let claimCounter = 1;

  for (const sentence of sentences) {
    const dates = extractDateExpressions(sentence);
    const numbers = extractNumericalValues(sentence);
    const conditions = extractConditionSignals(sentence);

    // Determine category based on pattern signals
    let category: ClaimCategory = "Policies";
    const lower = sentence.toLowerCase();

    if (lower.includes("deadline") || lower.includes("due date") || lower.includes("cutoff") || lower.includes("until") || dates.length > 0 && lower.includes("by")) {
      category = "Deadlines";
    } else if (lower.includes("eligib") || lower.includes("qualif") || lower.includes("enrolled") || lower.includes("matriculat")) {
      category = "Eligibility";
    } else if (lower.includes("document") || lower.includes("tax form") || lower.includes("w-2") || lower.includes("transcript") || lower.includes("filing")) {
      category = "Documents";
    } else if (lower.includes("require") || lower.includes("must") || lower.includes("mandatory") || lower.includes("gpa")) {
      category = "Requirements";
    } else if (lower.includes("fee") || lower.includes("tuition") || lower.includes("cost") || lower.includes("penalty")) {
      category = "Fees";
    } else if (lower.includes("procedure") || lower.includes("process") || lower.includes("submit") || lower.includes("apply") || lower.includes("step")) {
      category = "Procedures";
    } else if (lower.includes("award") || lower.includes("benefit") || lower.includes("fellowship") || lower.includes("$") || lower.includes("stipend")) {
      category = "Benefits";
    } else if (lower.includes("restrict") || lower.includes("limit") || lower.includes("prohibit") || lower.includes("disqualif")) {
      category = "Restrictions";
    }

    // High information density: has numbers, conditions, dates, or requirement words
    const isInformative = numbers.length > 0 || dates.length > 0 || conditions.length > 0 || category !== "Policies";

    if (isInformative) {
      claims.push({
        claim_id: `clm-${source.id.replace(/\s+/g, "_")}-${claimCounter++}`,
        source_id: source.id,
        claim_text: sentence,
        claim_category: category,
        related_question: relatedQuestion,
        supporting_excerpt: sentence,
        source_url: source.url,
        source_title: source.title,
        publication_date: source.publishedAt,
        extraction_confidence: 92,
        analysis_status: "verified",
        dates_detected: dates,
        numerical_values: numbers,
        conditions,
      });
    }
  }

  return claims;
}

/**
 * Extracts structured claims from a single source using Gemini LLM if configured,
 * otherwise using deterministic rule-based grounding.
 */
export async function extractClaimsFromSource(
  source: SourceItem,
  relatedQuestion?: string
): Promise<ExtractedClaim[]> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim().length <= 5) {
    return extractClaimsDeterministically(source, relatedQuestion);
  }

  try {
    const chunks = createManageableChunks(source.id, source.title, source.content, 3500);
    const aggregatedClaims: ExtractedClaim[] = [];
    let globalCounter = 1;

    for (const chunk of chunks) {
      const userPrompt = `Source: "${source.title}" (${source.id})\n\nContent Chunk:\n${chunk.text}`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userPrompt }] }],
            systemInstruction: { parts: [{ text: CLAIM_EXTRACTION_SYSTEM_PROMPT }] },
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.1,
            },
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`Gemini claim extraction failed: ${res.status}`);
      }

      const json = await res.json();
      const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      const parsed = JSON.parse(rawText);
      const validated = ClaimsBatchResponseSchema.safeParse(parsed);

      if (validated.success) {
        for (const item of validated.data.claims) {
          aggregatedClaims.push({
            claim_id: `clm-${source.id.replace(/\s+/g, "_")}-${globalCounter++}`,
            source_id: source.id,
            claim_text: item.claim_text,
            claim_category: item.claim_category,
            related_question: relatedQuestion,
            supporting_excerpt: item.supporting_excerpt || chunk.text.slice(0, 160),
            source_url: source.url,
            source_title: source.title,
            publication_date: source.publishedAt,
            extraction_confidence: item.extraction_confidence,
            analysis_status: item.analysis_status,
            dates_detected: item.dates_detected.length > 0 ? item.dates_detected : extractDateExpressions(item.claim_text),
            numerical_values: item.numerical_values.length > 0 ? item.numerical_values : extractNumericalValues(item.claim_text),
            conditions: item.conditions.length > 0 ? item.conditions : extractConditionSignals(item.claim_text),
          });
        }
      }
    }

    if (aggregatedClaims.length > 0) {
      return aggregatedClaims;
    }
    return extractClaimsDeterministically(source, relatedQuestion);
  } catch (err) {
    console.warn("LLM claim extraction failed, falling back to deterministic extractor:", err);
    return extractClaimsDeterministically(source, relatedQuestion);
  }
}

/**
 * Extracts claims across an entire multi-source dossier.
 */
export async function extractClaimsFromAllSources(
  sources: SourceItem[],
  relatedQuestion?: string
): Promise<ExtractedClaim[]> {
  const allClaims: ExtractedClaim[] = [];
  for (const source of sources) {
    const claims = await extractClaimsFromSource(source, relatedQuestion);
    allClaims.push(...claims);
  }
  return allClaims;
}
