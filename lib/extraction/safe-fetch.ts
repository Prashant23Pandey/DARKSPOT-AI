import { isIP } from "net";
import dns from "dns/promises";
import { stripHtml, countWords, generateExcerpt } from "./cleaner";
import { detectTemporalStatus } from "./sources";

export interface ExtractedPageResult {
  url: string;
  title: string;
  description?: string;
  author?: string;
  publishedDate?: string;
  content: string;
  wordCount: number;
  temporalStatus: "current" | "outdated" | "undated";
  reliabilityScore: number;
  statusCode: number;
}

export type ExtractionErrorCode =
  | "INVALID_URL"
  | "SSRF_BLOCKED"
  | "DNS_RESOLUTION_FAILED"
  | "TIMEOUT"
  | "UNSUPPORTED_CONTENT_TYPE"
  | "PAYLOAD_TOO_LARGE"
  | "HTTP_ERROR"
  | "UNKNOWN_ERROR";

export class ExtractionError extends Error {
  constructor(
    message: string,
    public readonly code: ExtractionErrorCode,
    public readonly statusCode: number = 400
  ) {
    super(message);
    this.name = "ExtractionError";
  }
}

/**
 * Checks if an IPv4 or IPv6 address belongs to private, loopback, or cloud metadata ranges.
 */
export function isPrivateOrReservedIP(ip: string): boolean {
  // IPv4 Private & Loopback ranges
  if (ip === "127.0.0.1" || ip === "0.0.0.0") return true;
  if (ip.startsWith("10.")) return true; // 10.0.0.0/8
  if (ip.startsWith("192.168.")) return true; // 192.168.0.0/16
  if (ip.startsWith("169.254.")) return true; // 169.254.0.0/16 (Link-local & AWS/GCP metadata)
  if (ip.startsWith("100.64.")) return true; // CGNAT
  if (ip.startsWith("198.18.") || ip.startsWith("198.19.")) return true; // Benchmarking

  // 172.16.0.0 - 172.31.255.255
  const parts = ip.split(".").map(Number);
  if (parts.length === 4 && parts[0] === 172) {
    const second = parts[1];
    if (second !== undefined && second >= 16 && second <= 31) return true;
  }

  // IPv6 checks
  const lower = ip.toLowerCase();
  if (lower === "::1" || lower === "::" || lower.startsWith("fc") || lower.startsWith("fd") || lower.startsWith("fe80")) {
    return true;
  }

  return false;
}

/**
 * Validates a target URL against SSRF threats.
 * Resolves DNS to ensure the destination IP is public.
 */
export async function validateUrlForSSRF(urlStr: string): Promise<URL> {
  let parsed: URL;
  try {
    parsed = new URL(urlStr.trim());
  } catch {
    throw new ExtractionError(`Invalid URL format: "${urlStr}"`, "INVALID_URL", 400);
  }

  // Enforce http or https protocol only
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new ExtractionError(
      `Unsupported protocol: "${parsed.protocol}". Only HTTP and HTTPS are permitted.`,
      "SSRF_BLOCKED",
      400
    );
  }

  const hostname = parsed.hostname.toLowerCase();

  // Block internal hostnames and aliases
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal") ||
    hostname === "metadata.google.internal"
  ) {
    throw new ExtractionError(
      `Access to internal or loopback host "${hostname}" is blocked for security.`,
      "SSRF_BLOCKED",
      403
    );
  }

  // Port restrictions
  if (parsed.port) {
    const portNum = parseInt(parsed.port, 10);
    const allowedPorts = [80, 443, 8080, 8443];
    if (!allowedPorts.includes(portNum)) {
      throw new ExtractionError(
        `Port ${portNum} is not permitted for public web extraction.`,
        "SSRF_BLOCKED",
        403
      );
    }
  }

  // If hostname is already a raw IP
  if (isIP(hostname)) {
    if (isPrivateOrReservedIP(hostname)) {
      throw new ExtractionError(
        `Target IP "${hostname}" is in a private or restricted network range.`,
        "SSRF_BLOCKED",
        403
      );
    }
    return parsed;
  }

  // DNS lookup to prevent DNS rebinding attacks to private IPs
  try {
    const records = await dns.lookup(hostname, { all: true });
    for (const record of records) {
      if (isPrivateOrReservedIP(record.address)) {
        throw new ExtractionError(
          `Domain "${hostname}" resolved to restricted IP ${record.address}.`,
          "SSRF_BLOCKED",
          403
        );
      }
    }
  } catch (err) {
    if (err instanceof ExtractionError) throw err;
    throw new ExtractionError(
      `Failed to resolve domain "${hostname}": ${err instanceof Error ? err.message : "DNS failure"}`,
      "DNS_RESOLUTION_FAILED",
      400
    );
  }

  return parsed;
}

/**
 * Extracts title, description, author, and published date from HTML using regex.
 */
export function extractHtmlMetadata(html: string): {
  title: string;
  description?: string;
  author?: string;
  publishedDate?: string;
} {
  // Title
  let title = "";
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    title = titleMatch[1].trim();
  }

  // OpenGraph or Twitter Title fallback
  if (!title) {
    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
    if (ogTitleMatch && ogTitleMatch[1]) {
      title = ogTitleMatch[1].trim();
    }
  }

  // Description
  let description: string | undefined;
  const descMatch =
    html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
  if (descMatch && descMatch[1]) {
    description = descMatch[1].trim();
  }

  // Author
  let author: string | undefined;
  const authorMatch =
    html.match(/<meta[^>]*name=["']author["'][^>]*content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]*property=["']article:author["'][^>]*content=["']([^"']+)["']/i);
  if (authorMatch && authorMatch[1]) {
    author = authorMatch[1].trim();
  }

  // Published Date
  let publishedDate: string | undefined;
  const dateMatch =
    html.match(/<meta[^>]*property=["']article:published_time["'][^>]*content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]*name=["']pubdate["'][^>]*content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]*name=["']date["'][^>]*content=["']([^"']+)["']/i);
  if (dateMatch && dateMatch[1]) {
    publishedDate = dateMatch[1].trim();
  }

  return {
    title: title || "Extracted Webpage Excerpt",
    description,
    author,
    publishedDate,
  };
}

/**
 * Safe server-side fetch that retrieves publicly accessible web content
 * with strict SSRF protection, size caps, and text cleaning.
 */
export async function safeFetchWebpage(urlStr: string): Promise<ExtractedPageResult> {
  const parsedUrl = await validateUrlForSSRF(urlStr);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8500); // 8.5s timeout

  try {
    const response = await fetch(parsedUrl.toString(), {
      method: "GET",
      signal: controller.signal,
      headers: {
        "User-Agent": "DarkspotAI-ResearchBot/1.0 (+https://darkspot.ai/bot; research-gap-detection)",
        Accept: "text/html,application/xhtml+xml,text/plain;q=0.9",
        "Accept-Language": "en-US,en;q=0.8",
      },
      redirect: "follow",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new ExtractionError(
        `Target server responded with HTTP ${response.status}: ${response.statusText}`,
        "HTTP_ERROR",
        response.status
      );
    }

    const contentType = response.headers.get("content-type") || "";
    if (
      !contentType.includes("text/html") &&
      !contentType.includes("text/plain") &&
      !contentType.includes("application/xhtml+xml")
    ) {
      throw new ExtractionError(
        `Unsupported content type: "${contentType}". Only HTML and plain text web pages are supported.`,
        "UNSUPPORTED_CONTENT_TYPE",
        415
      );
    }

    // Check payload size
    const rawHtml = await response.text();
    if (rawHtml.length > 2.5 * 1024 * 1024) {
      throw new ExtractionError(
        "Webpage exceeded maximum allowable size limit of 2.5 MB.",
        "PAYLOAD_TOO_LARGE",
        413
      );
    }

    const metadata = extractHtmlMetadata(rawHtml);
    const cleanedContent = stripHtml(rawHtml);
    const wordCount = countWords(cleanedContent);
    const temporalStatus = detectTemporalStatus(cleanedContent);

    return {
      url: parsedUrl.toString(),
      title: metadata.title,
      description: metadata.description,
      author: metadata.author,
      publishedDate: metadata.publishedDate,
      content: cleanedContent,
      wordCount,
      temporalStatus,
      reliabilityScore: temporalStatus === "outdated" ? 55 : 90,
      statusCode: response.status,
    };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof ExtractionError) throw err;
    if (err instanceof Error && err.name === "AbortError") {
      throw new ExtractionError(
        `Connection timed out after 8.5 seconds while retrieving ${parsedUrl.hostname}.`,
        "TIMEOUT",
        408
      );
    }
    throw new ExtractionError(
      `Failed to retrieve webpage: ${err instanceof Error ? err.message : "Network error"}`,
      "UNKNOWN_ERROR",
      500
    );
  }
}
