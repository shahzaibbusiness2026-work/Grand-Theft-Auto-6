import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cookie-free Supabase client for public data fetching.
 *
 * The cookie-based client in ./server.ts calls `cookies()` from next/headers,
 * which forces the entire route to be dynamic (opts out of static generation
 * and ISR). Public content (SEO settings, articles, catalogs) doesn't need
 * user cookies — use this client so pages can be statically cached.
 */
// Public client is intentionally untyped (any) — it's only used for
// simple public reads where the exact row shapes are handled by callers.
// eslint-disable-next-line
const publicClients = new Map<string, any>();

export function createPublicClient(cacheTag?: string) {
  const key = cacheTag || "default";
  if (publicClients.has(key)) return publicClients.get(key);
  const publicClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        fetch: (url, init) =>
          fetch(url, {
            ...init,
            ...(cacheTag
              ? {
                  cache: "force-cache" as const,
                  next: { revalidate: 300, tags: [cacheTag] },
                }
              : {}),
            signal: init?.signal || AbortSignal.timeout(6000),
          }),
      },
    },
  );
  publicClients.set(key, publicClient);
  return publicClient;
}
