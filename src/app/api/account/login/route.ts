import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { peekRateLimit, recordRateLimitHit } from "@/lib/rate-limit";
import {
  validEmail,
  verifyPassword,
  getAccount,
  saveAccount,
} from "@/lib/auth/accounts";
import { requireSameOrigin, playerJsonBody, PlayerError, playerError } from "@/lib/auth/player-account";
import {
  USER_SESSION_COOKIE,
  createUserSessionToken,
  userSessionCookieOptions,
} from "@/lib/auth/session";

/**
 * POST /api/account/login
 *
 * Verifies email + password against the stored scrypt hash. Errors are
 * deliberately generic ("Invalid email or password") so the endpoint never
 * reveals whether an email is registered. A row without a password hash
 * (created before passwords existed) returns PASSWORD_NOT_SET so the
 * login screen can offer a first-time password setup instead.
 */
export const dynamic = "force-dynamic";

const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

export async function POST(req: Request) {
  try {
    requireSameOrigin(req);
    const ip = clientIp(req);
    if (await peekRateLimit("account-login", ip, RATE_LIMIT_MAX)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Too many attempts. Please try again in a few minutes.",
        },
        { status: 429 },
      );
    }
    await recordRateLimitHit("account-login", ip, RATE_LIMIT_WINDOW_MS);

    const body = await playerJsonBody(req, 4000);
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!validEmail(email) || !password || password.length > 200) {
      return NextResponse.json(
        { ok: false, error: "Invalid email or password." },
        { status: 401 },
      );
    }

    let supabase;
    try {
      supabase = createAdminClient();
    } catch {
      return NextResponse.json(
        { ok: false, error: "Login is not configured on the server." },
        { status: 503 },
      );
    }

    const account = await getAccount(supabase, email);
    if (!account) {
      return NextResponse.json(
        { ok: false, error: "Invalid email or password." },
        { status: 401 },
      );
    }
    if (!account.password_hash) {
      // Never offer password setup based solely on knowing an account email.
      return NextResponse.json(
        { ok: false, error: "Invalid email or password." },
        { status: 401 },
      );
    }
    if (!verifyPassword(password, account.password_hash)) {
      return NextResponse.json(
        { ok: false, error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const now = new Date().toISOString();
    const saved = await saveAccount(supabase, {
      ...account,
      last_sign_in_at: now,
      sign_in_count: account.sign_in_count + 1,
    });
    if (!saved)
      return NextResponse.json(
        {
          ok: false,
          error: "Your account changed during sign-in. Please retry.",
        },
        { status: 409 },
      );

    // Issue the signed session cookie the dashboard gate checks. A login
    // that cannot sign a session is a server misconfiguration — fail
    // closed instead of returning a "success" the dashboard would reject.
    const res = NextResponse.json({
      ok: true,
      firstName: account.first_name || "",
      lastName: account.last_name || "",
      displayName: account.display_name || "",
    });
    res.cookies.set(
      USER_SESSION_COOKIE,
      await createUserSessionToken(email, account.session_version ?? 0),
      userSessionCookieOptions(),
    );
    return res;
  } catch (error) {
    if (error instanceof PlayerError) return playerError(error);
    console.error("Account login request failed:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { ok: false, error: "Could not log you in. Please try again." },
      { status: 500 },
    );
  }
}
