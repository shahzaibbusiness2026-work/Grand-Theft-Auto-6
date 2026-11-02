import {
  requirePlayer,
  requireSameOrigin,
  privateJson,
  playerError,
  PlayerError,
} from "@/lib/auth/player-account";
import { sendAccountLink } from "@/lib/auth/account-links";
import { peekRateLimit, recordRateLimitHit } from "@/lib/rate-limit";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    const { account, supabase } = await requirePlayer();
    if (account.email_verified_at)
      return privateJson({
        ok: true,
        message: "Your email is already verified.",
      });
    if (await peekRateLimit("player-verification", account.email, 3))
      throw new PlayerError(429, "Please wait before requesting another link.");
    await recordRateLimitHit("player-verification", account.email, 600000);
    if (!(await sendAccountLink(supabase, account, "verify")))
      throw new PlayerError(
        503,
        "Verification email could not be sent. Please try again later.",
      );
    return privateJson({
      ok: true,
      message: "A verification link was sent. It expires in 30 minutes.",
    });
  } catch (error) {
    return playerError(error);
  }
}
