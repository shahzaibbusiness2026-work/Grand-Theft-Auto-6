import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { peekRateLimit, recordRateLimitHit } from "@/lib/rate-limit";
import {
  validEmail,
  hashPassword,
  generateRecoveryCode,
  hashRecoveryCode,
  getAccount,
  saveAccount,
} from "@/lib/auth/accounts";

/**
 * POST /api/account/signup
 *
 * Creates a site account. The password is stored ONLY as a scrypt hash;
 * the recovery code is stored ONLY as a SHA-256 hash. The plaintext
 * recovery code is returned once, so the signup screen can show it to the
 * user to save — it is never stored or shown again.
 *
 * If an account with this email already has a password, signup is refused
 * (prevents account takeover by re-registration). A legacy passwordless
 * row (created before passwords existed) may set its first password here.
 */
export const dynamic = "force-dynamic";

const RATE_LIMIT_MAX = 30;
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
    if (await peekRateLimit("account-signup", ip, RATE_LIMIT_MAX)) {
      return NextResponse.json(
        { ok: false, error: "Too many attempts. Please try again in a few minutes." },
        { status: 429 }
      );
    }
    await recordRateLimitHit("account-signup", ip, RATE_LIMIT_WINDOW_MS);

    const body = await req.json().catch(() => null);
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const firstName =
      typeof body?.firstName === "string" ? body.firstName.trim() : "";
    const lastName =
      typeof body?.lastName === "string" ? body.lastName.trim() : "";
    const password =
      typeof body?.password === "string" ? body.password : "";

    if (!validEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }
    if (!firstName || firstName.length > 80 || lastName.length > 80) {
      return NextResponse.json(
        { ok: false, error: "Please provide your first name (max 80 characters)." },
        { status: 400 }
      );
    }
    if (password.length < 8 || password.length > 200) {
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
        { ok: false, error: "Account creation is not configured on the server." },
        { status: 503 }
      );
    }

    const existing = await getAccount(supabase, email);
    if (existing?.password_hash) {
      return NextResponse.json(
        {
          ok: false,
          code: "ACCOUNT_EXISTS",
          error: "An account with this email already exists. Please log in instead.",
        },
        { status: 409 }
      );
    }
    // An OAuth-only account (Google/Discord, no password) cannot be
    // converted by email signup — that would let anyone set a password on
    // someone else's OAuth account. Those users sign in with their provider.
    if (existing && (existing.auth_providers?.length || 0) > 0) {
      const provider =
        existing.auth_providers[0] === "discord" ? "Discord" : "Google";
      return NextResponse.json(
        {
          ok: false,
          code: "OAUTH_ACCOUNT",
          error: `This account was created with ${provider}. Please sign in with ${provider} instead.`,
        },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    const displayName = [firstName, lastName].filter(Boolean).join(" ");
    const recoveryCode = generateRecoveryCode();
    const ok = await saveAccount(supabase, {
      email,
      first_name: firstName,
      last_name: lastName || null,
      display_name: displayName,
      password_hash: hashPassword(password),
      recovery_code_hash: hashRecoveryCode(recoveryCode),
      auth_providers: existing?.auth_providers || [],
      created_at: existing?.created_at || now,
      last_sign_in_at: now,
      sign_in_count: (existing?.sign_in_count || 0) + 1,
    });
    if (!ok) {
      return NextResponse.json(
        { ok: false, error: "Could not create your account. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      firstName,
      lastName,
      displayName,
      recoveryCode,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not create your account. Please try again." },
      { status: 500 }
    );
  }
}
