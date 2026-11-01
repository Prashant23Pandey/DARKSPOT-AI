import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export interface SupabaseHealthResponse {
  connected: boolean;
  status: "Connected to Supabase" | "Supabase connection unavailable";
  latencyMs?: number;
  tablesVerified?: string[];
  reason?: string;
  isConfigured: boolean;
  timestamp: string;
}

export async function GET() {
  const timestamp = new Date().toISOString();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  // 1. Check if environment variables exist and are not placeholders
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json<SupabaseHealthResponse>({
      connected: false,
      status: "Supabase connection unavailable",
      isConfigured: false,
      reason: "Supabase credentials are not configured in environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY).",
      timestamp,
    });
  }

  if (
    !supabaseUrl.startsWith("http") ||
    supabaseUrl.includes("placeholder") ||
    supabaseUrl.includes("your-project")
  ) {
    return NextResponse.json<SupabaseHealthResponse>({
      connected: false,
      status: "Supabase connection unavailable",
      isConfigured: false,
      reason: "NEXT_PUBLIC_SUPABASE_URL contains a placeholder URL rather than an active Supabase project endpoint.",
      timestamp,
    });
  }

  // 2. Perform genuine database ping & table verification
  const startTime = Date.now();

  try {
    const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    // Test query on investigations table
    const { error: invError, count } = await supabase
      .from("investigations")
      .select("id", { count: "exact", head: true });

    const latencyMs = Date.now() - startTime;

    if (invError) {
      return NextResponse.json<SupabaseHealthResponse>({
        connected: false,
        status: "Supabase connection unavailable",
        isConfigured: true,
        latencyMs,
        reason: `Supabase query failed: ${invError.message} (Code: ${invError.code || "UNKNOWN"})`,
        timestamp,
      });
    }

    // Secondary table existence checks
    const tablesVerified: string[] = ["investigations"];
    
    // Check sources
    const { error: srcError } = await supabase
      .from("sources")
      .select("id", { count: "exact", head: true });
    if (!srcError) tablesVerified.push("sources");

    // Check claims or extracted_claims
    const { error: claimsError } = await supabase
      .from("extracted_claims")
      .select("id", { count: "exact", head: true });
    if (!claimsError) {
      tablesVerified.push("extracted_claims");
    } else {
      // Fallback check on claims view
      const { error: altClaimsError } = await supabase
        .from("claims")
        .select("id", { count: "exact", head: true });
      if (!altClaimsError) tablesVerified.push("claims (view)");
    }

    return NextResponse.json<SupabaseHealthResponse>({
      connected: true,
      status: "Connected to Supabase",
      isConfigured: true,
      latencyMs,
      tablesVerified,
      timestamp,
    });
  } catch (err: unknown) {
    const latencyMs = Date.now() - startTime;
    return NextResponse.json<SupabaseHealthResponse>({
      connected: false,
      status: "Supabase connection unavailable",
      isConfigured: true,
      latencyMs,
      reason: err instanceof Error ? err.message : "Network error connecting to Supabase host.",
      timestamp,
    });
  }
}
