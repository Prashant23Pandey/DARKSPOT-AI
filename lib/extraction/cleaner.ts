/**
 * Text & HTML Cleaning Utility
 * Equivalent to BeautifulSoup extraction in backend/gap_engine.py
 */

export function stripHtml(rawHtml: string): string {
  if (!rawHtml) return "";
  // Strip script and style tags and content
  let text = rawHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ");
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ");
  // Strip all HTML tags
  text = text.replace(/<[^>]+>/g, " ");
  // Decode common HTML entities
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  // Normalize whitespace
  return text.replace(/\s+/g, " ").trim();
}

export function extractDomain(urlStr?: string): string {
  if (!urlStr) return "Raw Text Excerpt";
  try {
    const parsed = new URL(urlStr.startsWith("http") ? urlStr : `https://${urlStr}`);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return urlStr;
  }
}

export function countWords(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function generateExcerpt(text: string, maxLength: number = 240): string {
  if (!text) return "";
  const cleaned = text.trim();
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.slice(0, maxLength).trim() + "…";
}
