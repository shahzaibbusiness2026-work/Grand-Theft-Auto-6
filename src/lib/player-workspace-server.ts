import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { emptyWorkspace, parseWorkspace } from "./player-state";
import { getAccount } from "./auth/accounts";

export const playerWorkspaceKey = (email: string) =>
  `player_workspace:${email.trim().toLowerCase()}`;
export async function readPlayerWorkspace(
  supabase: SupabaseClient,
  email: string,
) {
  const account = await getAccount(supabase, email);
  if (!account) throw new Error("Account no longer exists.");
  return {
    workspace: account.workspace
      ? parseWorkspace(account.workspace)
      : emptyWorkspace(),
    version: account.workspace_version ?? null,
  };
}
