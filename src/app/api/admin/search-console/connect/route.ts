import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { assertAdmin } from "@/lib/auth/assert-admin";
import { googleOAuthConfig } from "@/lib/search-console/credentials";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await assertAdmin();
  } catch {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const config = googleOAuthConfig();
  if (config.missing.length) {
    return NextResponse.redirect(new URL(`/admin/analytics?gsc=setup-required`, request.url));
  }

  const state = randomBytes(32).toString("base64url");
  const authorizationUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authorizationUrl.search = new URLSearchParams({
    client_id: config.clientId!,
    redirect_uri: config.redirectUri!,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    access_type: "offline",
    include_granted_scopes: "true",
    prompt: "consent",
    state,
  }).toString();

  const response = NextResponse.redirect(authorizationUrl);
  response.cookies.set("tg_gsc_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/admin/search-console/callback",
    maxAge: 300,
  });
  return response;
}
