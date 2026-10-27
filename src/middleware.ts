import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  verifyAdminSessionToken,
  getCurrentSessionVersion,
  verifyUserSessionToken,
  USER_SESSION_COOKIE,
} from "@/lib/auth/session";
import { getMasterAdminEmails } from "@/lib/auth/assert-admin";
import { reportOnlyCsp } from "@/lib/content-security-policy";

/** Cached CMS-managed 301/302 redirects (seo_settings.redirects). */
type RedirectRule = {
  id: string;
  fromUrl: string;
  toUrl: string;
  type: string;
  enabled: boolean;
};
let redirectCache: { rules: RedirectRule[]; fetchedAt: number } | null = null;
const REDIRECT_CACHE_TTL_MS = 60 * 60 * 1000;

async function getCmsRedirects(): Promise<RedirectRule[]> {
  if (
    redirectCache &&
    Date.now() - redirectCache.fetchedAt < REDIRECT_CACHE_TTL_MS
  ) {
    return redirectCache.rules;
  }
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/seo_settings?select=value&key=eq.redirects`,
      {
        headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "" },
        // Never let a slow CMS outage hang page loads; fail fast to "no redirects".
        signal: AbortSignal.timeout(1000),
      },
    );
    if (!res.ok) throw new Error(`seo_settings fetch failed: ${res.status}`);
    const rows = (await res.json()) as { value: string }[];
    const parsed = rows[0]?.value
      ? (JSON.parse(rows[0].value) as RedirectRule[])
      : [];
    redirectCache = {
      rules: Array.isArray(parsed) ? parsed : [],
      fetchedAt: Date.now(),
    };
  } catch {
    // Serve without redirects if the CMS is unreachable; retry after TTL.
    redirectCache = {
      rules: redirectCache?.rules ?? [],
      fetchedAt: Date.now(),
    };
  }
  return redirectCache.rules;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ------------------------------------------------------------------
  // Dashboard lock: /dashboard is members-only. The ONLY credential is
  // a signed user session cookie issued by login, signup, password
  // reset, or the OAuth callback. Local device state is never trusted
  // here — anyone can write localStorage, so it cannot open the gate.
  // Logged-out visitors go to /login; after login the cookie exists
  // and the gate passes.
  // ------------------------------------------------------------------
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    let allowed = false;
    try {
      const check = await verifyUserSessionToken(
        request.cookies.get(USER_SESSION_COOKIE)?.value,
      );
      allowed = check.valid;
    } catch {
      // Missing session secret or broken token: fail closed.
      allowed = false;
    }
    if (!allowed) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  const response = NextResponse.next({
    request: { headers: request.headers },
  });
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Content-Security-Policy-Report-Only", reportOnlyCsp);
  }

  // Frame protection for every page EXCEPT the public /embed/* routes: the
  // countdown widget hands out iframe code for /embed/countdown, and a DENY
  // would render it blank everywhere it is embedded.
  if (!pathname.startsWith("/embed/")) {
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Content-Security-Policy", "frame-ancestors 'none';");
  }

  // CMS-managed redirects (admin SEO page). Skipped for admin/API paths.
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api")) {
    const rules = await getCmsRedirects();
    const match = rules.find((r) => r.enabled && r.fromUrl === pathname);
    // Only honor relative redirect targets. An absolute toUrl (from a CMS
    // typo or a compromised admin) would turn this trusted domain into an
    // open redirect for phishing — never follow it.
    const toUrl = match?.toUrl;
    const isSafeTarget =
      typeof toUrl === "string" &&
      toUrl.startsWith("/") &&
      !toUrl.startsWith("//") &&
      toUrl !== pathname;
    if (match && isSafeTarget) {
      const status = match.type === "302" ? 302 : 301;
      return NextResponse.redirect(new URL(toUrl, request.url), status);
    }
    return response;
  }

  // ------------------------------------------------------------------
  // Admin surfaces: a signed admin cookie is the ONLY credential.
  // A plain Supabase session must never grant admin access — any visitor
  // can create a Supabase account, which would be privilege escalation.
  // ------------------------------------------------------------------
  // Public APIs enforce their own requirements. They must not read private
  // admin-session settings or refresh authentication cookies on every call.
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin"))
    return response;
  const adminCookieValue = request.cookies.get("gta6_admin_session")?.value;
  // Enforce session revocation here too (same fail-open policy as
  // assertAdmin): without this, a revoked cookie could still pass the
  // middleware gate on admin page loads.
  const { version: sessionVersion, confirmed } =
    await getCurrentSessionVersion();
  const sessionCheck = await verifyAdminSessionToken(
    adminCookieValue,
    confirmed ? sessionVersion : undefined,
  );

  let isMasterSupabaseAdmin = false;
  if (!sessionCheck.valid) {
    // Supabase session is honored only when the user is an explicitly
    // listed master admin (same policy as assertAdmin in server actions).
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const email = user?.email?.toLowerCase();
      isMasterSupabaseAdmin = !!email && getMasterAdminEmails().includes(email);
    } catch {
      // Supabase unreachable or paused
    }
  }

  const isAuthenticated = sessionCheck.valid || isMasterSupabaseAdmin;
  const isLoginPage = pathname === "/admin/login";
  const isAdminApiRoute = pathname.startsWith("/api/admin");
  const isLoginApi = pathname === "/api/admin/login";

  // Protect admin API routes
  if (isAdminApiRoute && !isLoginApi && !isAuthenticated) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin session required." },
      { status: 401 },
    );
  }

  // Redirect to login if accessing admin without authentication
  if (pathname.startsWith("/admin") && !isLoginPage && !isAuthenticated) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to admin if already logged in and visiting login page
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/((?!_next/static|_next/image|favicon.ico|img|uploads).*)",
  ],
};
