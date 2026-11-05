import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/auth/assert-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { PlayerError, requireSameOrigin } from "@/lib/auth/player-account";
import {
  ADMIN_SESSION_VERSION_KEY,
  clearSessionVersionCache,
  getCurrentSessionVersion,
} from "@/lib/auth/session";

/**
 * POST /api/admin/revoke-sessions
 *
 * Bumps the global admin session version, invalidating every existing admin
 * session cookie — including the caller's. All admins must log in again.
 *
 * Propagation: this instance's version cache is flushed immediately; other
 * serverless instances pick up the new version within the version-cache TTL
 * (currently 15 seconds).
 */
export async function POST(request: Request) {
  try {
    await assertAdmin();
  } catch {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin session required." },
      { status: 401 }
    );
  }

  try {
    requireSameOrigin(request);
    const supabase = createAdminClient();
    const { version: current } = await getCurrentSessionVersion();
    const next = current + 1;

    const { error } = await supabase.from("site_settings").upsert(
      {
        key: ADMIN_SESSION_VERSION_KEY,
        value: String(next),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );
    if (error) throw new Error(error.message);

    clearSessionVersionCache();

    return NextResponse.json({ success: true, sessionVersion: next });
  } catch (err) {
    if (err instanceof PlayerError) return NextResponse.json({ success: false, error: err.message }, { status: err.status });
    console.error("Revoke sessions failed:", err);
    return NextResponse.json(
      {
        success: false,
        error:
          "Could not revoke sessions. Check the Supabase connection and try again.",
      },
      { status: 500 }
    );
  }
}
