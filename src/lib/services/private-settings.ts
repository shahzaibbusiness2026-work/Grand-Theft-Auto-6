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
