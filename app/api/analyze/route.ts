import { NextRequest, NextResponse } from "next/server";
import { AnalysisRequestSchema } from "@/lib/validation";
import { normalizeSources } from "@/lib/extraction";
import { analyzeInformationDossier } from "@/lib/analysis";
import { DarkspotAppError, formatErrorMessage } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const validation = AnalysisRequestSchema.safeParse(json);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { topic, sources } = validation.data;

    // Transform and clean raw source inputs
    const normalizedSources = normalizeSources(sources);

    if (normalizedSources.length === 0) {
      throw new DarkspotAppError("At least one valid source is required for analysis.", "EMPTY_SOURCES", 400);
    }

    // Run the Digital Dark Spot Engine
    const { result, engineMode, rawError } = await analyzeInformationDossier(topic, normalizedSources);

    return NextResponse.json({
      success: true,
      engineMode,
      warning: rawError ? `Fallback to Blueprint Engine: ${rawError}` : undefined,
      result,
    });
  } catch (err: unknown) {
    console.error("Analysis API error:", err);
    const message = formatErrorMessage(err);
    const status = err instanceof DarkspotAppError ? err.status : 500;

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status }
    );
  }
}
