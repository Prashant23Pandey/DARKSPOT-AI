import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { safeFetchWebpage, ExtractionError } from "@/lib/extraction/safe-fetch";

export const dynamic = "force-dynamic";

const ExtractRequestSchema = z.object({
  url: z.string().url("A valid HTTP or HTTPS URL is required."),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = ExtractRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || "Invalid URL parameter",
          code: "INVALID_URL",
        },
        { status: 400 }
      );
    }

    const { url } = parsed.data;

    const result = await safeFetchWebpage(url);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: unknown) {
    if (err instanceof ExtractionError) {
      return NextResponse.json(
        {
          success: false,
          error: err.message,
          code: err.code,
        },
        { status: err.statusCode }
      );
    }

    console.error("Extraction route unexpected error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to extract webpage content",
        code: "UNKNOWN_ERROR",
      },
      { status: 500 }
    );
  }
}
