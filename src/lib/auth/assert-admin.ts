import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { verifyAdminSessionToken } from "@/lib/auth/session";

/**
 * Asserts that the current server request has an active, authorized admin session.
 * Verifies either the secure httpOnly `gta6_admin_session` cryptographic cookie or an active Supabase user session.
 * Throws an Error if unauthorized.
 */
export async function assertAdmin(): Promise<{ authorized: true; userId?: string }> {
  try {
    const cookieStore = await cookies();
    const adminCookieValue = cookieStore.get("gta6_admin_session")?.value;
    const sessionCheck = await verifyAdminSessionToken(adminCookieValue);

    if (sessionCheck.valid) {
      return { authorized: true, userId: sessionCheck.email };
    }

    const supabase = await createClient();
    // getUser() validates the JWT server-side; getSession() does not.
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      return { authorized: true, userId: user.id };
    }
  } catch (err) {
    console.error("Auth check exception:", err);
  }

  throw new Error("Unauthorized: Active admin authentication session required.");
}
