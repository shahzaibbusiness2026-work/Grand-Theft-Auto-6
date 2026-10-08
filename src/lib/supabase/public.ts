import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cookie-free Supabase client for public data fetching.
 *
 * The cookie-based client in ./server.ts calls `cookies()` from next/headers,
 * which forces the entire route to be dynamic (opts out of static generation
 * and ISR). Public content (SEO settings, articles, catalogs) doesn't need
 * user cookies — use this client so pages can be statically cached.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let publicClient: any = null;

export function createPublicClient() {
  if (publicClient) return publicClient;
  publicClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return publicClient;
}
