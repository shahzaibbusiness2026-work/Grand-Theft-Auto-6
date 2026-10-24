import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAccount, saveAccount } from "@/lib/auth/accounts";

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
  if (!user?.email) {
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

  try {
    const admin = createAdminClient();
    const existing = await getAccount(admin, email);
    const providers = [...(existing?.auth_providers || [])];
    if (!providers.includes(provider)) providers.push(provider);
    await saveAccount(admin, {
      email,
      first_name: first || existing?.first_name || null,
      last_name: last || existing?.last_name || null,
      display_name:
        [first || existing?.first_name || "", last || existing?.last_name || ""]
          .filter(Boolean)
          .join(" ") || existing?.display_name || null,
      password_hash: existing?.password_hash || null,
      recovery_code_hash: existing?.recovery_code_hash || null,
      auth_providers: providers,
      created_at: existing?.created_at || now,
      last_sign_in_at: now,
      sign_in_count: (existing?.sign_in_count || 0) + 1,
    });
  } catch {
    // The Supabase session itself is established; a failed account-row
    // save only means the dashboard falls back to "Player" for this visit.
  }

  return NextResponse.redirect(new URL("/auth/welcome", req.url));
}
