import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAccount } from "@/lib/auth/accounts";
export const showcaseKey = (id: string) => `player_showcase:${id}`;
/** The link index is private. Every public read rechecks the current owner row. */
export async function readPublicShowcase(id: string) {
  if (!/^[a-f0-9]{32}$/.test(id)) return null;
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("private_settings")
    .select("value")
    .eq("key", showcaseKey(id))
    .maybeSingle();
  if (error) throw new Error("Public profile storage is unavailable.");
  if (!data) return null;
  let owner;
  try {
    owner =
      typeof data.value === "string" ? JSON.parse(data.value) : data.value;
  } catch {
    return null;
  }
  if (typeof owner?.email !== "string") return null;
  const account = await getAccount(supabase, owner.email);
  return account?.showcase?.id === id ? account.showcase : null;
}
