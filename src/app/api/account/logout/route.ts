import { NextResponse } from "next/server";
import { USER_SESSION_COOKIE } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { requireSameOrigin, playerError } from "@/lib/auth/player-account";

/**
 * POST /api/account/logout
 *
 * Clears the signed user session cookie issued by login, signup,
 * password reset, and the OAuth callback. Device-local data (favorites,
 * tracker, notes) is untouched — the client clears the displayed login
 * state separately. No authentication is required: logging out must
 * always succeed, even with an expired or forged cookie.
 */
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
  } catch (error) {
    return playerError(error);
  }
  try {
    await (await createClient()).auth.signOut();
  } catch {
    /* Always clear the private dashboard cookie. */
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(USER_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
