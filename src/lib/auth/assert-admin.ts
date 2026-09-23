import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

/**
 * Asserts that the current server request has an active, authorized admin session.
 * Verifies either the secure httpOnly `gta6_admin_session` cookie or an active Supabase user session.
 * Throws an Error if unauthorized.
 */
export async function assertAdmin(): Promise<{ authorized: true; userId?: string }> {
  try {
    const cookieStore = await cookies();
    const hasAdminCookie = cookieStore.get("gta6_admin_session")?.value === "true";

    if (hasAdminCookie) {
      return { authorized: true };
    }

    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session && session.user) {
      return { authorized: true, userId: session.user.id };
    }
  } catch (err) {
    console.error("Auth check exception:", err);
  }

  throw new Error("Unauthorized: Active admin authentication session required.");
}
