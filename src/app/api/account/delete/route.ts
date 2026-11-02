import { accountKey, verifyPassword } from "@/lib/auth/accounts";
import {
  USER_SESSION_COOKIE,
  userSessionCookieOptions,
} from "@/lib/auth/session";
import {
  requirePlayer,
  requireSameOrigin,
  playerJsonBody,
  privateJson,
  playerError,
  PlayerError,
} from "@/lib/auth/player-account";
import { playerWorkspaceKey } from "@/lib/player-workspace-server";
import { createClient } from "@/lib/supabase/server";
import { peekRateLimit, recordRateLimitHit } from "@/lib/rate-limit";
import { getMasterAdminEmails } from "@/lib/auth/assert-admin";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    const { account, supabase, session } = await requirePlayer();
    if (getMasterAdminEmails().includes(account.email))
      throw new PlayerError(
        403,
        "This account has administrator access. Remove that access before deleting its linked account.",
      );
    if (await peekRateLimit("player-delete", account.email, 5))
      throw new PlayerError(429, "Too many attempts. Please try again later.");
    await recordRateLimitHit("player-delete", account.email, 600000);
    const body = await playerJsonBody(request, 2000);
    if (account.auth_providers.length && !account.auth_user_id)
      throw new PlayerError(
        403,
        "Sign in with your connected provider once, then return here so its identity can be included in deletion.",
      );
    if (body.confirmation !== "DELETE")
      throw new PlayerError(400, "Type DELETE to confirm account deletion.");
    if (account.password_hash) {
      if (
        typeof body.password !== "string" ||
        !verifyPassword(body.password, account.password_hash)
      )
        throw new PlayerError(403, "Your password was not accepted.");
    } else {
      const {
        data: { user },
      } = await (await createClient()).auth.getUser();
      if (
        !session.issuedAt ||
        Date.now() - session.issuedAt > 15 * 60 * 1000 ||
        !user ||
        user.email?.toLowerCase() !== account.email ||
        user.id !== account.auth_user_id
      )
        throw new PlayerError(
          403,
          "Sign out and sign in with your connected provider, then retry within 15 minutes.",
        );
    }
    if (account.auth_user_id) {
      const { data: target, error: lookupError } =
        await supabase.auth.admin.getUserById(account.auth_user_id);
      if (lookupError && lookupError.status !== 404) throw lookupError;
      if (target.user && target.user.email?.toLowerCase() !== account.email)
        throw new PlayerError(403, "Connected account identity did not match.");
      if (target.user) {
        const { error } = await supabase.auth.admin.deleteUser(target.user.id);
        if (error) throw error;
      }
    }
    // Both keys are removed by one database statement. No owner comes from the request body.
    const { error } = await supabase
      .from("private_settings")
      .delete()
      .in("key", [
        accountKey(account.email),
        playerWorkspaceKey(account.email),
      ]);
    if (error) throw error;
    const { error: tokenError } = await supabase
      .from("private_settings")
      .delete()
      .like("key", "player_token:%")
      .eq("value->>email", account.email);
    if (tokenError)
      console.error(
        "Expired account links could not be cleaned up after deletion.",
      );
    const response = privateJson({ ok: true });
    response.cookies.set(USER_SESSION_COOKIE, "", {
      ...userSessionCookieOptions(),
      maxAge: 0,
    });
    try {
      await (await createClient()).auth.signOut();
    } catch {
      /* User has already been removed. */
    }
    return response;
  } catch (error) {
    return playerError(error);
  }
}
