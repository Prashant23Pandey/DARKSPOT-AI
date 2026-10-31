import { NextRequest, NextResponse } from "next/server";
import { executeSearch } from "@/lib/search/provider";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const query = typeof json?.query === "string" ? json.query : "";
    const maxResults = typeof json?.maxResults === "number" ? json.maxResults : 5;

    if (!query.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Query parameter is required.",
        },
        { status: 400 }
      );
    }

    const response = await executeSearch(query, maxResults);

    return NextResponse.json({
      success: true,
      ...response,
    });
  } catch (err: unknown) {
    console.error("Search API error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Search request failed.",
      },
      { status: 500 }
    );
  }
}
