/**
 * Search Provider Abstraction for DARKSPOT AI
 * Enables pluggable integration of permitted search engines (Tavily, SerpApi, Brave).
 * Strictly enforces that no search results are ever fabricated or hallucinated.
 */

export interface SearchResultItem {
  title: string;
  url: string;
  snippet: string;
  sourceName?: string;
  publishedDate?: string;
}

export interface SearchProviderResponse {
  provider: string;
  query: string;
  isConfigured: boolean;
  results: SearchResultItem[];
  message?: string;
}

export interface SearchProvider {
  name: string;
  isConfigured(): boolean;
  search(query: string, maxResults?: number): Promise<SearchResultItem[]>;
}

/**
 * Tavily Search Engine Implementation
 */
export class TavilySearchProvider implements SearchProvider {
  name = "Tavily AI Search";

  isConfigured(): boolean {
    const key = process.env.TAVILY_API_KEY;
    return Boolean(key && key.trim().length > 5);
  }

  async search(query: string, maxResults: number = 5): Promise<SearchResultItem[]> {
    const key = process.env.TAVILY_API_KEY;
    if (!key) {
      throw new Error("Tavily API key is not configured.");
    }

    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: key,
        query,
        search_depth: "basic",
        max_results: maxResults,
        include_domains: [],
        exclude_domains: [],
      }),
    });

    if (!res.ok) {
      throw new Error(`Tavily search failed with status ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    const rawResults = data?.results || [];

    return rawResults.map((item: { title?: string; url: string; content?: string }) => ({
      title: item.title || item.url,
      url: item.url,
      snippet: item.content || "",
      sourceName: new URL(item.url).hostname.replace(/^www\./, ""),
    }));
  }
}

/**
 * SerpApi Search Implementation
 */
export class SerpApiSearchProvider implements SearchProvider {
  name = "SerpApi Google Search";

  isConfigured(): boolean {
    const key = process.env.SERPAPI_API_KEY;
    return Boolean(key && key.trim().length > 5);
  }

  async search(query: string, maxResults: number = 5): Promise<SearchResultItem[]> {
    const key = process.env.SERPAPI_API_KEY;
    if (!key) {
      throw new Error("SerpApi API key is not configured.");
    }

    const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${key}&num=${maxResults}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`SerpApi failed with status ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    const organic = data?.organic_results || [];

    return organic.slice(0, maxResults).map((item: { title?: string; link: string; snippet?: string }) => ({
      title: item.title || item.link,
      url: item.link,
      snippet: item.snippet || "",
      sourceName: new URL(item.link).hostname.replace(/^www\./, ""),
    }));
  }
}

/**
 * Null Search Provider: Active when no external Search API key is present.
 * NEVER invents or mocks search results!
 */
export class NullSearchProvider implements SearchProvider {
  name = "Manual Input & Sample Mode";

  isConfigured(): boolean {
    return false;
  }

  async search(query: string): Promise<SearchResultItem[]> {
    // Strictly returns empty results to never invent or hallucinate search results.
    return [];
  }
}

/**
 * Factory selecting the active configured search provider.
 */
export function getActiveSearchProvider(): SearchProvider {
  const tavily = new TavilySearchProvider();
  if (tavily.isConfigured()) return tavily;

  const serpApi = new SerpApiSearchProvider();
  if (serpApi.isConfigured()) return serpApi;

  return new NullSearchProvider();
}

/**
 * Primary search orchestrator
 */
export async function executeSearch(query: string, maxResults: number = 5): Promise<SearchProviderResponse> {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      provider: "None",
      query: "",
      isConfigured: false,
      results: [],
      message: "Please enter a valid search query.",
    };
  }

  const provider = getActiveSearchProvider();

  if (!provider.isConfigured()) {
    return {
      provider: provider.name,
      query: trimmed,
      isConfigured: false,
      results: [],
      message:
        "No external Search API configured (Set TAVILY_API_KEY or SERPAPI_API_KEY in .env.local). Please paste direct source URLs or use sample benchmark mode.",
    };
  }

  try {
    const results = await provider.search(trimmed, maxResults);
    return {
      provider: provider.name,
      query: trimmed,
      isConfigured: true,
      results,
    };
  } catch (err: unknown) {
    console.error("Search provider error:", err);
    return {
      provider: provider.name,
      query: trimmed,
      isConfigured: true,
      results: [],
      message: err instanceof Error ? err.message : "Search query execution failed.",
    };
  }
}
