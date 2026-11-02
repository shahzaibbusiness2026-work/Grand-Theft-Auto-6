import { createAdminClient } from "@/lib/supabase/admin";
import { getAccount, validEmail } from "@/lib/auth/accounts";
import { sendAccountLink } from "@/lib/auth/account-links";
import {
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
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    if (await peekRateLimit("player-recovery", ip, 5))
      throw new PlayerError(429, "Too many requests. Try again later.");
    await recordRateLimitHit("player-recovery", ip, 600000);
    const body = await playerJsonBody(request, 1000);
    if (typeof body.email !== "string" || !validEmail(body.email))
      throw new PlayerError(400, "Enter a valid email address.");
    if (!process.env.RESEND_API_KEY)
      throw new PlayerError(
        503,
        "Email recovery is unavailable. Use your recovery code below.",
      );
    const supabase = createAdminClient();
    const account = await getAccount(supabase, body.email.toLowerCase().trim());
    if (account) await sendAccountLink(supabase, account, "reset");
    // Same message for unknown addresses, provider-only accounts and delivery failures.
    return privateJson({
      ok: true,
      message:
        "If this email has a Taish Gaming account, a reset link has been requested. Check your inbox and spam folder. You can also use your recovery code.",
    });
  } catch (error) {
    return playerError(error);
  }
}
