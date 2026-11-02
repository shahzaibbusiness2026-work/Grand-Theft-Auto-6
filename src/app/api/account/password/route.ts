import {
  verifyPassword,
  hashPassword,
  generateRecoveryCode,
  hashRecoveryCode,
  saveAccount,
} from "@/lib/auth/accounts";
import {
  USER_SESSION_COOKIE,
  createUserSessionToken,
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
import { peekRateLimit, recordRateLimitHit } from "@/lib/rate-limit";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    const { account, supabase } = await requirePlayer();
    if (await peekRateLimit("player-password", account.email, 5))
      throw new PlayerError(
        429,
        "Too many password attempts. Try again later.",
      );
    await recordRateLimitHit("player-password", account.email, 600000);
    const body = await playerJsonBody(request, 2000);
    if (
      !account.password_hash ||
      typeof body.currentPassword !== "string" ||
      !verifyPassword(body.currentPassword, account.password_hash)
    )
      throw new PlayerError(403, "Your current password was not accepted.");
    if (
      typeof body.newPassword !== "string" ||
      body.newPassword.length < 8 ||
      body.newPassword.length > 200
    )
      throw new PlayerError(
        400,
        "Use a new password between 8 and 200 characters.",
      );
    const code = generateRecoveryCode();
    const sessionVersion = (account.session_version ?? 0) + 1;
    const token = await createUserSessionToken(account.email, sessionVersion);
    if (
      !(await saveAccount(supabase, {
        ...account,
        password_hash: hashPassword(body.newPassword),
        recovery_code_hash: hashRecoveryCode(code),
        session_version: sessionVersion,
      }))
    )
      throw new PlayerError(409, "Your account changed. Please retry.");
    const response = privateJson({ ok: true, recoveryCode: code });
    response.cookies.set(
      USER_SESSION_COOKIE,
      token,
      userSessionCookieOptions(),
    );
    return response;
  } catch (error) {
    return playerError(error);
  }
}
