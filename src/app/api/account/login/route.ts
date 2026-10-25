import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { peekRateLimit, recordRateLimitHit } from "@/lib/rate-limit";
import { validEmail, verifyPassword, getAccount, saveAccount } from "@/lib/auth/accounts";
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
    const ip = clientIp(req);
    if (await peekRateLimit("account-login", ip, RATE_LIMIT_MAX)) {
      return NextResponse.json(
        { ok: false, error: "Too many attempts. Please try again in a few minutes." },
        { status: 429 }
      );
    }
    await recordRateLimitHit("account-login", ip, RATE_LIMIT_WINDOW_MS);

    const body = await req.json().catch(() => null);
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password =
      typeof body?.password === "string" ? body.password : "";

    if (!validEmail(email) || !password) {
      return NextResponse.json(
        { ok: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    let supabase;
    try {
      supabase = createAdminClient();
    } catch {
      return NextResponse.json(
        { ok: false, error: "Login is not configured on the server." },
        { status: 503 }
      );
    }

    const account = await getAccount(supabase, email);
    if (!account) {
      return NextResponse.json(
        { ok: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }
    if (!account.password_hash) {
      // Pure legacy row (no password, no OAuth link): offer first-time setup.
      // OAuth-only rows must use their provider — never offer a password
      // setup here, or anyone could set a password on someone's OAuth account.
      if ((account.auth_providers?.length || 0) === 0) {
        return NextResponse.json(
          {
            ok: false,
            code: "PASSWORD_NOT_SET",
            error: "This account was created before passwords. Please set a password to continue.",
          },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { ok: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }
    if (!verifyPassword(password, account.password_hash)) {
      return NextResponse.json(
        { ok: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const now = new Date().toISOString();
    await saveAccount(supabase, {
      ...account,
      last_sign_in_at: now,
      sign_in_count: account.sign_in_count + 1,
    });

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
      await createUserSessionToken(email),
      userSessionCookieOptions()
    );
    return res;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not log you in. Please try again." },
      { status: 500 }
    );
  }
}
