import { randomBytes } from "crypto";
import { buildPublicShowcase } from "@/lib/player-portfolio";
import { emptyWorkspace } from "@/lib/player-state";
import { saveAccount } from "@/lib/auth/accounts";
import { showcaseKey } from "@/lib/player-showcase-server";
import {
  requirePlayer,
  requireSameOrigin,
  playerJsonBody,
  privateJson,
  playerError,
  PlayerError,
} from "@/lib/auth/player-account";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const { account } = await requirePlayer();
    return privateJson({ ok: true, showcase: account.showcase ?? null });
  } catch (error) {
    return playerError(error);
  }
}
export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    const { account, supabase } = await requirePlayer();
    const body = await playerJsonBody(request, 2000);
    if (body.version !== (account.workspace_version ?? null))
      throw new PlayerError(
        409,
        "Your collection changed. Wait for account sync, then review and publish again.",
      );
    if (
      typeof body.showValues !== "boolean" ||
      typeof body.showImages !== "boolean" ||
      body.confirmation !== "PUBLISH SELECTED"
    )
      throw new PlayerError(
        400,
        "Review and confirm the selected public fields.",
      );
    const id = account.showcase?.id || randomBytes(16).toString("hex");
    let showcase;
    try {
      showcase = buildPublicShowcase(
        (account.workspace || emptyWorkspace()).portfolio,
        id,
        body.showValues,
        body.showImages,
      );
    } catch (error) {
      throw new PlayerError(
        400,
        error instanceof Error ? error.message : "Invalid profile.",
      );
    }
    if (!account.showcase) {
      const { error } = await supabase
        .from("private_settings")
        .insert({
          key: showcaseKey(id),
          value: JSON.stringify({ email: account.email }),
          updated_at: new Date().toISOString(),
        });
      if (error) throw error;
    }
    if (!(await saveAccount(supabase, { ...account, showcase }))) {
      if (!account.showcase)
        await supabase
          .from("private_settings")
          .delete()
          .eq("key", showcaseKey(id));
      throw new PlayerError(
        409,
        "Your account changed. Reload before publishing.",
      );
    }
    return privateJson({ ok: true, showcase });
  } catch (error) {
    return playerError(error);
  }
}
export async function DELETE(request: Request) {
  try {
    requireSameOrigin(request);
    const { account, supabase } = await requirePlayer();
    if (!(await saveAccount(supabase, { ...account, showcase: null })))
      throw new PlayerError(409, "Your account changed. Reload and retry.");
    if (account.showcase)
      await supabase
        .from("private_settings")
        .delete()
        .eq("key", showcaseKey(account.showcase.id));
    return privateJson({ ok: true });
  } catch (error) {
    return playerError(error);
  }
}
