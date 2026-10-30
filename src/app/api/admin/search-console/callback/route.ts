import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "@/lib/auth/assert-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  encryptGoogleRefreshToken,
  googleOAuthConfig,
  SEARCH_CONSOLE_CREDENTIAL_KEY,
} from "@/lib/search-console/credentials";

export const dynamic = "force-dynamic";

function resultRedirect(request: NextRequest, status: string) {
  const response = NextResponse.redirect(new URL(`/admin/analytics?gsc=${status}`, request.url));
  response.cookies.delete("tg_gsc_oauth_state");
  return response;
}

export async function GET(request: NextRequest) {
  try {
    await assertAdmin();
  } catch {
    return resultRedirect(request, "login-required");
  }

  const state = request.nextUrl.searchParams.get("state");
  const code = request.nextUrl.searchParams.get("code");
  const cookieState = request.cookies.get("tg_gsc_oauth_state")?.value;
  if (!state || !cookieState || state !== cookieState) return resultRedirect(request, "authorization-failed");
  if (!code || request.nextUrl.searchParams.has("error")) return resultRedirect(request, "authorization-failed");

  const config = googleOAuthConfig();
  if (config.missing.length) return resultRedirect(request, "setup-required");

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: config.clientId!,
        client_secret: config.clientSecret!,
        redirect_uri: config.redirectUri!,
        grant_type: "authorization_code",
      }),
      cache: "no-store",
    });
    if (!tokenResponse.ok) return resultRedirect(request, "authorization-failed");
    const tokens = await tokenResponse.json() as { refresh_token?: string };
    if (!tokens.refresh_token) return resultRedirect(request, "reauthorize-required");

    const supabase = createAdminClient();
    const { error } = await supabase.from("site_settings").upsert({
      key: SEARCH_CONSOLE_CREDENTIAL_KEY,
      value: encryptGoogleRefreshToken(tokens.refresh_token),
      updated_at: new Date().toISOString(),
    }, { onConflict: "key" });
    if (error) return resultRedirect(request, "save-failed");
    return resultRedirect(request, "connected");
  } catch {
    return resultRedirect(request, "authorization-failed");
  }
}
