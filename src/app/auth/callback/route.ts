import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAccount, saveAccount } from "@/lib/auth/accounts";
import { randomInt } from "crypto";
import {
  USER_SESSION_COOKIE,
  createUserSessionToken,
  userSessionCookieOptions,
} from "@/lib/auth/session";

/**
 * GET /auth/callback
 *
 * Supabase OAuth redirect target (Google / Discord). Exchanges the code
 * for a session, then links the provider to the site's own account row
 * (private_settings, key user_account:<email>) so the dashboard shows the
 * same name as email accounts do. Existing password/recovery data is
 * always preserved — OAuth never overwrites email-login credentials.
 * Finally redirects to /auth/welcome, which finishes the sign-in on the
 * client (local account state) and sends the user to the dashboard.
 */
export const dynamic = "force-dynamic";

function splitName(fullName: string): { first: string; last: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: "", last: "" };
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL("/login?oauth=cancelled", req.url));
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return NextResponse.redirect(new URL("/login?oauth=error", req.url));
  }

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    return NextResponse.redirect(new URL("/login?oauth=error", req.url));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email || !user.email_confirmed_at) {
    return NextResponse.redirect(new URL("/login?oauth=error", req.url));
  }

  const email = user.email.toLowerCase();
  const provider =
    typeof user.app_metadata?.provider === "string"
      ? user.app_metadata.provider
      : "oauth";
  const metaName =
    (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
    (typeof user.user_metadata?.name === "string" && user.user_metadata.name) ||
    "";
  const { first, last } = splitName(metaName);
  const now = new Date().toISOString();
  let sessionVersion = 0;

  try {
    const admin = createAdminClient();
    let saved = false;
    // Retry against the latest row so concurrent provider logins cannot
    // overwrite credentials or falsely reject a valid sign-in.
    for (let attempt = 0; attempt < 3 && !saved; attempt++) {
      const existing = await getAccount(admin, email);
      sessionVersion = existing?.session_version ?? randomInt(1, 2_000_000_000);
      const providers = [...(existing?.auth_providers || [])];
      if (!providers.includes(provider)) providers.push(provider);
      saved = await saveAccount(admin, {
        ...existing,
        email,
        first_name: existing?.first_name || first || null,
        last_name: existing?.last_name || last || null,
        display_name:
          existing?.display_name || [existing?.first_name || first || "", existing?.last_name || last || ""]
            .filter(Boolean)
            .join(" ") || existing?.display_name || null,
        password_hash: existing?.password_hash || null,
        recovery_code_hash: existing?.recovery_code_hash || null,
        auth_providers: providers,
        created_at: existing?.created_at || now,
        last_sign_in_at: now,
        sign_in_count: (existing?.sign_in_count || 0) + 1,
        session_version: sessionVersion,
        auth_user_id: user.id,
        email_verified_at: user.email_confirmed_at || existing?.email_verified_at || null,
      }, !existing);
    }
    if (!saved) throw new Error("Could not save linked account.");
  } catch {
    // The Supabase session itself is established; a failed account-row
    // save cannot open a private workspace without its canonical owner row.
    return NextResponse.redirect(new URL("/login?oauth=error", req.url));
  }

  // OAuth users need the same signed cookie as email users, or the
  // dashboard gate would bounce them straight back to /login.
  const res = NextResponse.redirect(new URL("/auth/welcome", req.url));
  try {
    res.cookies.set(
      USER_SESSION_COOKIE,
      await createUserSessionToken(email, sessionVersion),
      userSessionCookieOptions()
    );
  } catch {
    console.error("Could not issue user session cookie after OAuth.");
    return NextResponse.redirect(new URL("/login?oauth=error", req.url));
  }
  return res;
}
