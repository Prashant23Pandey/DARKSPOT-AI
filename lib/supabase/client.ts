import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Returns a typed browser-side Supabase client.
 * Returns null if Supabase environment variables are not yet configured.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
}
