import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { peekRateLimit, recordRateLimitHit } from "@/lib/rate-limit";
import {
  validEmail,
  hashPassword,
  generateRecoveryCode,
  hashRecoveryCode,
  verifyRecoveryCode,
  getAccount,
  saveAccount,
} from "@/lib/auth/accounts";
import {
  USER_SESSION_COOKIE,
  createUserSessionToken,
  userSessionCookieOptions,
} from "@/lib/auth/session";

/**
 * POST /api/account/set-password
 *
 * Sets (or resets) an account password. Two authorized paths:
 *  1. Forgot-password reset: the caller proves ownership with the recovery
 *     code issued at signup. A successful reset ROTATES the code — the old
 *     code stops working and a fresh code is returned to be saved.
 *  2. First-time setup for a legacy passwordless row (no hash, no code):
 *     no code is required, because there is nothing to verify against yet.
 *     A fresh recovery code is issued with the new password.
 *
 * Any other state (unknown email, wrong code, hashed account without a
 * matching code) is refused with a generic error.
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
    if (await peekRateLimit("account-set-password", ip, RATE_LIMIT_MAX)) {
      return NextResponse.json(
        { ok: false, error: "Too many attempts. Please try again in a few minutes." },
        { status: 429 }
      );
    }
    await recordRateLimitHit("account-set-password", ip, RATE_LIMIT_WINDOW_MS);

    const body = await req.json().catch(() => null);
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const newPassword =
      typeof body?.newPassword === "string" ? body.newPassword : "";
    const recoveryCode =
      typeof body?.recoveryCode === "string" ? body.recoveryCode.trim() : "";

    if (!validEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }
    if (newPassword.length < 8 || newPassword.length > 200) {
      return NextResponse.json(
        { ok: false, error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    let supabase;
    try {
      supabase = createAdminClient();
    } catch {
      return NextResponse.json(
        { ok: false, error: "Password reset is not configured on the server." },
        { status: 503 }
      );
    }

    const account = await getAccount(supabase, email);
    if (!account) {
      return NextResponse.json(
        { ok: false, error: "Could not reset the password. Check your email and recovery code." },
        { status: 400 }
      );
    }

    const isLegacySetup =
      !account.password_hash &&
      !account.recovery_code_hash &&
      (account.auth_providers?.length || 0) === 0;
    if (!isLegacySetup) {
      if (
        !account.recovery_code_hash ||
        !recoveryCode ||
        !verifyRecoveryCode(recoveryCode, account.recovery_code_hash)
      ) {
        return NextResponse.json(
          { ok: false, error: "Invalid recovery code. Check the code and try again." },
          { status: 403 }
        );
      }
    }

    const freshCode = generateRecoveryCode();
    const ok = await saveAccount(supabase, {
      ...account,
      password_hash: hashPassword(newPassword),
      recovery_code_hash: hashRecoveryCode(freshCode),
    });
    if (!ok) {
      return NextResponse.json(
        { ok: false, error: "Could not reset the password. Please try again." },
        { status: 500 }
      );
    }

    // A successful reset proves ownership — issue a fresh session cookie
    // so the reset user can reach the dashboard without logging in again.
    const res = NextResponse.json({
      ok: true,
      recoveryCode: freshCode,
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
      { ok: false, error: "Could not reset the password. Please try again." },
      { status: 500 }
    );
  }
}
