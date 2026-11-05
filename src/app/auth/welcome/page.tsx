import { redirect } from "next/navigation";
import { requirePlayer } from "@/lib/auth/player-account";

export const dynamic = "force-dynamic";

/** The callback's verified site session owns identity. PlayerSyncProvider
 * restores the account cache in the dashboard without a second OAuth request. */
export default async function AuthWelcomePage() {
  let signedIn = false;
  try {
    await requirePlayer();
    signedIn = true;
  } catch {
    // Missing or expired sessions return to the form without a redirect loop.
  }
  redirect(signedIn ? "/dashboard" : "/login?oauth=error");
}
