import { parseWorkspace } from "@/lib/player-state";
import { readPlayerWorkspace } from "@/lib/player-workspace-server";
import { saveAccount, getAccount } from "@/lib/auth/accounts";
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
export async function GET() {
  try {
    const { supabase, account } = await requirePlayer();
    return privateJson({
      ok: true,
      ...(await readPlayerWorkspace(supabase, account.email)),
      profile: publicPlayerProfile(account),
    });
  } catch (error) {
    return playerError(error);
  }
}
export async function PUT(request: Request) {
  try {
    requireSameOrigin(request);
    const { supabase, account } = await requirePlayer();
    const body = await playerJsonBody(request);
    if (
      account.workspace?.portfolio &&
      (account.workspace.portfolio.assets.length ||
        account.workspace.portfolio.garages.length ||
        account.workspace.portfolio.profile.name ||
        account.workspace.portfolio.profile.bio ||
        account.workspace.portfolio.profile.image) &&
      (!body.workspace ||
        typeof body.workspace !== "object" ||
        !Object.hasOwn(body.workspace, "portfolio"))
    )
      throw new PlayerError(
        400,
        "Reload Taish Gaming before saving. This older client cannot preserve your collection.",
      );
    if (
      body.version !== null &&
      (typeof body.version !== "string" ||
        !Number.isFinite(Date.parse(body.version)))
    )
      throw new PlayerError(400, "A valid workspace version is required.");
    let workspace;
    try {
      workspace = parseWorkspace(body.workspace);
    } catch (error) {
      throw new PlayerError(
        400,
        error instanceof Error ? error.message : "Invalid workspace.",
      );
    }
    const updated_at = new Date(
      Math.max(Date.now(), Date.parse(String(body.version)) + 1 || 0),
    ).toISOString();
    // Keep the snapshot inside its private owner row. Compare-and-set on that
    // row prevents stale edits, credential overwrites, and saves after deletion.
    let current = account;
    let saved = false;
    for (let attempt = 0; attempt < 2; attempt++) {
      if ((current.workspace_version ?? null) !== body.version) break;
      if (
        await saveAccount(supabase, {
          ...current,
          workspace,
          workspace_version: updated_at,
        })
      ) {
        saved = true;
        break;
      }
      const next = await getAccount(supabase, account.email);
      if (!next || next.session_version !== account.session_version)
        throw new PlayerError(
          401,
          "Your account session changed. Please sign in again.",
        );
      current = next;
    }
    if (!saved)
      return privateJson(
        {
          ok: false,
          conflict: true,
          ...(await readPlayerWorkspace(supabase, account.email)),
        },
        409,
      );
    return privateJson({ ok: true, version: updated_at });
  } catch (error) {
    return playerError(error);
  }
}
