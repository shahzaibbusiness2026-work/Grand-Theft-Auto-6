import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Service-role-only key/value store for data that must never be publicly
 * readable — PII such as newsletter subscribers and admin team members.
 *
 * `site_settings` is anon-readable BY DESIGN (the public site reads its keys
 * with the anon key), so private data must live in `private_settings`, which
 * has RLS enabled with NO policies: only the service-role key can touch it.
 *
 * Until supabase/04_private_settings.sql has been applied, these helpers
 * fall back to the legacy site_settings keys and self-migrate rows out of
 * the public table on first touch (copy into private_settings, then delete
 * the public row — only when the private write actually succeeded).
 */
export async function getPrivateSetting<T = unknown>(key: string): Promise<T | null> {
  const supabase = createAdminClient();

  try {
    const { data, error } = await supabase
      .from("private_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (!error && data?.value !== undefined && data?.value !== null) {
      return (typeof data.value === "string" ? JSON.parse(data.value) : data.value) as T;
    }
  } catch {
    // Table missing (migration not applied yet) — try the legacy location.
  }

  try {
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (data?.value) {
      const parsed = typeof data.value === "string" ? JSON.parse(data.value) : data.value;
      const { error: upsertError } = await supabase
        .from("private_settings")
        .upsert(
          { key, value: data.value, updated_at: new Date().toISOString() },
          { onConflict: "key" }
        );
      if (!upsertError) {
        await supabase.from("site_settings").delete().eq("key", key);
      }
      return parsed as T;
    }
  } catch {
    // Legacy table unreachable too — nothing to return.
  }

  return null;
}

export async function setPrivateSetting(key: string, value: unknown): Promise<boolean> {
  try {
    const supabase = createAdminClient();
    const serialized = typeof value === "string" ? value : JSON.stringify(value);
    const { error } = await supabase
      .from("private_settings")
      .upsert(
        { key, value: serialized, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
    if (error) {
      // Table missing (migration not applied yet) — keep legacy behavior.
      await supabase
        .from("site_settings")
        .upsert(
          { key, value: serialized, updated_at: new Date().toISOString() },
          { onConflict: "key" }
        );
      return false;
    }
    // Remove any legacy public copy so the data stops being anon-readable.
    await supabase.from("site_settings").delete().eq("key", key);
    return true;
  } catch {
    return false;
  }
}
