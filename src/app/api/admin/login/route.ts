import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHash } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createAdminSessionToken } from "@/lib/auth/session";

/**
 * Admin login endpoint.
 *
 * Two credential paths, both restricted to explicitly authorized admins:
 *  1. Supabase Auth — the signed-in user's email must be listed in
 *     ADMIN_MASTER_EMAILS; everyone else is rejected with 401.
 *  2. Master credentials (ADMIN_MASTER_EMAILS / ADMIN_MASTER_PASSWORD).
 *     The master account is auto-provisioned in Supabase Auth on first login.
 *
 * On success a cryptographically signed httpOnly cookie is set, which
 * middleware and assertAdmin() treat as the admin credential.
 *
 * There is NO default password: if ADMIN_MASTER_PASSWORD is unset the master
 * path is disabled entirely (fail closed).
 */

/* Fail closed: no hardcoded fallback emails. If ADMIN_MASTER_EMAILS is unset,
 * the master-email path is disabled entirely (same philosophy as the password).
 * Set ADMIN_MASTER_EMAILS="you@yourdomain.com" in production env. */
const MASTER_EMAILS = (process.env.ADMIN_MASTER_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const MASTER_PASSWORD = process.env.ADMIN_MASTER_PASSWORD;

/* ------------------------------------------------------------------ */
/* Simple in-memory rate limiting: 5 failed attempts / 10 min / IP     */
/* (per server instance; sufficient to slow credential stuffing)       */
/* ------------------------------------------------------------------ */
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const failedAttempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const entry = failedAttempts.get(ip);
  if (!entry) return false;
  if (Date.now() > entry.resetAt) {
    failedAttempts.delete(ip);
    return false;
  }
  return entry.count >= RATE_LIMIT_MAX;
}

function recordFailure(ip: string) {
  const entry = failedAttempts.get(ip);
  if (!entry || Date.now() > entry.resetAt) {
    failedAttempts.set(ip, { count: 1, resetAt: Date.now() + RATE_LIMIT_WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

function timingSafeEqualStr(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return createHash("sha256").update(ha).digest().equals(createHash("sha256").update(hb).digest());
}

async function setAdminCookie(cookieStore: Awaited<ReturnType<typeof cookies>>, email: string) {
  const token = await createAdminSessionToken(email);
  cookieStore.set("gta6_admin_session", token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function POST(request: Request) {
  try {
    // x-real-ip is set by the edge platform and cannot be spoofed by the
    // client; x-forwarded-for is only a fallback (first hop may vary).
    const ip =
      request.headers.get("x-real-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many failed attempts. Try again in 10 minutes." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const rawUsername = (body.username || body.email || "").trim().toLowerCase();
    const password = (body.password || "").trim();

    if (!rawUsername || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const email = rawUsername.includes("@") && rawUsername.includes(".")
      ? rawUsername
      : `${rawUsername.replace(/@.*$/, "")}@gta6.com`;

    const isMasterAdmin =
      !!MASTER_PASSWORD &&
      MASTER_EMAILS.includes(rawUsername) &&
      timingSafeEqualStr(password, MASTER_PASSWORD);

    // 1. Try signing in via Supabase Auth — but only master-admin emails may
    //    obtain an admin session. Any other Supabase account is rejected here,
    //    otherwise every registered user would become an admin.
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data.session) {
        const userEmail = (data.user?.email || email).toLowerCase();
        if (MASTER_EMAILS.includes(userEmail)) {
          const cookieStore = await cookies();
          await setAdminCookie(cookieStore, userEmail);
          return NextResponse.json({
            success: true,
            user: { email: userEmail, role: "admin" },
          });
        }
        recordFailure(ip);
        // Identical generic message as invalid credentials: do not reveal
        // whether the email has an account (prevents user enumeration).
        return NextResponse.json(
          { success: false, error: "Invalid email or password." },
          { status: 401 }
        );
      }
    } catch {
      // Continue to master admin check if Supabase Auth client had an error
    }

    // 2. If credentials match the configured master admin, ensure the
    //    Supabase auth user exists AND its password matches the env value —
    //    otherwise a stale, previously-defaulted password would keep working.
    if (isMasterAdmin) {
      try {
        const adminClient = createAdminClient();
        const { error: createError } = await adminClient.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { role: "admin", name: "Administrator" },
        });
        if (createError) {
          // User likely already exists — rotate its password to the env value.
          const { data: list } = await adminClient.auth.admin.listUsers();
          const existing = list?.users?.find(
            (u) => (u.email || "").toLowerCase() === email
          );
          if (existing?.id) {
            await adminClient.auth.admin.updateUserById(existing.id, { password });
          }
        }
      } catch {
        // Provisioning is best-effort; the signed cookie is what grants access.
      }

      const cookieStore = await cookies();
      await setAdminCookie(cookieStore, email);

      return NextResponse.json({
        success: true,
        user: { email, role: "admin" },
      });
    }

    recordFailure(ip);

    return NextResponse.json(
      { success: false, error: "Invalid email or password." },
      { status: 401 }
    );
  } catch (err: unknown) {
    // Log internally, return generic message: never expose Supabase errors,
    // missing-env diagnostics, or stack details to the client.
    console.error("[admin/login] authentication error:", err);
    return NextResponse.json(
      { success: false, error: "Authentication failed. Please try again." },
      { status: 500 }
    );
  }
}
