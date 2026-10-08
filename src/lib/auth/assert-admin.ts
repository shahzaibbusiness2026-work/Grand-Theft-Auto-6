import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { verifyAdminSessionToken } from "@/lib/auth/session";

/**
 * Emails allowed to administer the site (ADMIN_MASTER_EMAILS, comma-separated).
 * Kept in sync with the login route.
 * Fail closed: no hardcoded fallback — unset means no master emails.
 */
export function getMasterAdminEmails(): string[] {
  return (process.env.ADMIN_MASTER_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Asserts that the current server request is made by an authorized admin.
 *
 * Authorization requires ONE of:
 *  1. A valid, cryptographically signed `gta6_admin_session` cookie
 *     (set only by /api/admin/login after credential verification), or
 *  2. A Supabase Auth session whose user email is explicitly listed in
 *     ADMIN_MASTER_EMAILS.
 *
 * A regular authenticated Supabase user is NOT an admin — granting admin
 * powers to any signed-in user would be a privilege-escalation hole.
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
    const email = user?.email?.toLowerCase();
    if (user && email && getMasterAdminEmails().includes(email)) {
      return { authorized: true, userId: user.id };
    }
  } catch (err) {
    console.error("Auth check exception:", err);
  }

  throw new Error("Unauthorized: Active admin authentication session required.");
}
