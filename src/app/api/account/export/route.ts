import {
  requirePlayer,
  privateJson,
  playerError,
  publicPlayerProfile,
} from "@/lib/auth/player-account";
import { readPlayerWorkspace } from "@/lib/player-workspace-server";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const { account, supabase } = await requirePlayer();
    const saved = await readPlayerWorkspace(supabase, account.email);
    const response = privateJson({
      app: "Taish Gaming",
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      profile: publicPlayerProfile(account),
      ...saved,
    });
    response.headers.set(
      "Content-Disposition",
      'attachment; filename="taishgaming-player-data.json"',
    );
    return response;
  } catch (error) {
    return playerError(error);
  }
}
