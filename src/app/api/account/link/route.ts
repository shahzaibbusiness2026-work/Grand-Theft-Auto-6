import { createAdminClient } from "@/lib/supabase/admin";
import {
  getAccount,
  saveAccount,
  hashPassword,
  generateRecoveryCode,
  hashRecoveryCode,
} from "@/lib/auth/accounts";
import { accountTokenKey } from "@/lib/auth/account-links";
import {
  requireSameOrigin,
  playerJsonBody,
  privateJson,
  playerError,
  PlayerError,
} from "@/lib/auth/player-account";
import {
  USER_SESSION_COOKIE,
  createUserSessionToken,
  userSessionCookieOptions,
} from "@/lib/auth/session";
import { peekRateLimit, recordRateLimitHit } from "@/lib/rate-limit";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    if (await peekRateLimit("player-link", ip, 10))
      throw new PlayerError(429, "Too many attempts. Try again later.");
    await recordRateLimitHit("player-link", ip, 600000);
    const body = await playerJsonBody(request, 2000);
    if (typeof body.token !== "string" || !/^[a-f0-9]{64}$/.test(body.token))
      throw new PlayerError(400, "This link is invalid or expired.");
    const supabase = createAdminClient();
    const key = accountTokenKey(body.token);
    const { data, error } = await supabase
      .from("private_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (error) throw error;
    const token = data?.value;
    if (
      !token ||
      typeof token.email !== "string" ||
      !["verify", "reset"].includes(token.purpose) ||
      typeof token.expiresAt !== "number" ||
      !Number.isFinite(token.expiresAt) ||
      token.expiresAt <= Date.now()
    )
      throw new PlayerError(
        400,
        "This link is invalid or expired. Request a new one.",
      );
    const account = await getAccount(supabase, token.email);
    if (!account || (account.session_version ?? 0) !== token.version)
      throw new PlayerError(
        400,
        "This link is no longer valid. Request a new one.",
      );
    if (
      token.purpose === "reset" &&
      (typeof body.newPassword !== "string" ||
        body.newPassword.length < 8 ||
        body.newPassword.length > 200)
    )
      throw new PlayerError(
        400,
        "Use a password between 8 and 200 characters.",
      );
    const code = token.purpose === "reset" ? generateRecoveryCode() : null;
    const next = {
      ...account,
      email_verified_at: new Date().toISOString(),
      ...(code
        ? {
            password_hash: hashPassword(body.newPassword as string),
            recovery_code_hash: hashRecoveryCode(code),
            session_version: (account.session_version ?? 0) + 1,
          }
        : {}),
    };
    // Consume atomically; a scanner GET never changes credentials or uses up the link.
    const { data: consumed, error: consumeError } = await supabase
      .from("private_settings")
      .delete()
      .eq("key", key)
      .select("key")
      .maybeSingle();
    if (consumeError) throw consumeError;
    if (!consumed) throw new PlayerError(400, "This link was already used.");
    if (!(await saveAccount(supabase, next)))
      throw new PlayerError(
        409,
        "Your account changed. Request a new link and retry.",
      );
    const response = privateJson({
      ok: true,
      purpose: token.purpose,
      recoveryCode: code,
    });
    // Verification must not silently sign a different browser into the account.
    if (code)
      response.cookies.set(
        USER_SESSION_COOKIE,
        await createUserSessionToken(account.email, next.session_version ?? 0),
        userSessionCookieOptions(),
      );
    return response;
  } catch (error) {
    return playerError(error);
  }
}
