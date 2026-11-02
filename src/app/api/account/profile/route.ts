import { saveAccount } from "@/lib/auth/accounts";
import {
  requirePlayer,
  requireSameOrigin,
  playerJsonBody,
  privateJson,
  playerError,
  publicPlayerProfile,
  PlayerError,
} from "@/lib/auth/player-account";

export const dynamic = "force-dynamic";
export async function PATCH(request: Request) {
  try {
    requireSameOrigin(request);
    const { account, supabase } = await requirePlayer();
    const body = await playerJsonBody(request, 4000);
    const { firstName, lastName, displayName, marketingOptIn } = body;
    if (marketingOptIn === true && !account.email_verified_at)
      throw new PlayerError(
        400,
        "Verify your email before opting in to account update emails.",
      );
    if (
      typeof firstName !== "string" ||
      !firstName.trim() ||
      firstName.length > 80 ||
      typeof lastName !== "string" ||
      lastName.length > 80 ||
      typeof displayName !== "string" ||
      !displayName.trim() ||
      displayName.length > 80 ||
      typeof marketingOptIn !== "boolean"
    )
      throw new PlayerError(
        400,
        "Provide a first name and display name, up to 80 characters each.",
      );
    const updated = {
      ...account,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      display_name: displayName.trim(),
      marketing_opt_in: marketingOptIn,
    };
    if (!(await saveAccount(supabase, updated)))
      throw new PlayerError(
        409,
        "Your account changed elsewhere. Refresh and try again.",
      );
    return privateJson({ ok: true, profile: publicPlayerProfile(updated) });
  } catch (error) {
    return playerError(error);
  }
}
