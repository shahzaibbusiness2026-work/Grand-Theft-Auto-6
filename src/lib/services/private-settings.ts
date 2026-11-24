import { createAdminClient } from "@/lib/supabase/admin";
/** PII and credentials are service-role-only. Never fall back to public storage. */
export async function getPrivateSetting<T = unknown>(
  key: string,
): Promise<T | null> {
  const client = createAdminClient();
  const { data, error } = await client
    .from("private_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error) throw new Error("Private settings unavailable");
  if (data?.value === undefined || data.value === null) return null;
  return (
    typeof data.value === "string" ? JSON.parse(data.value) : data.value
  ) as T;
}
export async function setPrivateSetting(
  key: string,
  value: unknown,
): Promise<boolean> {
  try {
    const { error } = await createAdminClient()
      .from("private_settings")
      .upsert(
        {
          key,
          value: typeof value === "string" ? value : JSON.stringify(value),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" },
      );
    return !error;
  } catch {
    return false;
  }
}

/**
 * Optimistic compare-and-swap for shared JSON settings. The callback must return
 * a new value (without mutating its input), or the same value for a no-op.
 * Retrying from the latest row prevents one request from losing another's write.
 */
export async function updatePrivateSetting<T>(
  key: string,
  initialValue: T,
  update: (current: T) => T,
): Promise<{ value: T; changed: boolean }> {
  const client = createAdminClient();
  for (let attempt = 0; attempt < 8; attempt++) {
    const { data, error } = await client
      .from("private_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (error) throw new Error("Private settings unavailable");
    const current: T = data
      ? typeof data.value === "string" ? JSON.parse(data.value) : data.value
      : initialValue;
    const next = update(current);
    if (next === current) return { value: current, changed: false };
    const row = {
      key,
      value: JSON.stringify(next),
      updated_at: new Date().toISOString(),
    };
    if (!data) {
      const { error: insertError } = await client.from("private_settings").insert(row);
      if (!insertError) return { value: next, changed: true };
      // Another request created the row first; read it instead of overwriting it.
      if (insertError.code === "23505") continue;
      throw new Error("Private settings unavailable");
    }
    const { data: written, error: writeError } = await client
      .from("private_settings")
      .update(row)
      .eq("key", key)
      // value is jsonb, including legacy JSON-string values. Match its exact
      // JSON representation, not the decoded array, just like unsubscribe.
      .eq("value", JSON.stringify(data.value))
      .select("key");
    if (writeError) throw new Error("Private settings unavailable");
    if (written?.length) return { value: next, changed: true };
  }
  throw new Error("Private settings changed too often. Please retry.");
}
