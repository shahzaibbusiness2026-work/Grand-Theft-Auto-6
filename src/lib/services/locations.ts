"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";
import { assertAdmin } from "@/lib/auth/assert-admin";
import { logActivity } from "./activity";

export interface LocationRecord {
  id: string;
  name: string;
  district: string;
  type: "City District" | "Island / Keys" | "Government Facility" | "Landmark";
  verification: "verified" | "pending" | "deprecated";
  coordinates: string;
  description?: string;
}

export async function getLocations(): Promise<LocationRecord[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .order("created_at", { ascending: true });
    if (!error && data && data.length > 0) return data as LocationRecord[];

    // Fallback to site_settings persistence
    const { data: setting } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "locations_data")
      .single();
    if (setting?.value) {
      const parsed =
        typeof setting.value === "string"
          ? JSON.parse(setting.value)
          : setting.value;
      if (Array.isArray(parsed) && parsed.length > 0)
        return parsed as LocationRecord[];
    }
  } catch {
    /* no fallback — never invent locations */
  }
  return [];
}

export async function getAdminLocations(): Promise<LocationRecord[]> {
  await assertAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("locations").select("*").order("created_at", { ascending: true });
  if (!error) return data as LocationRecord[];
  if (!isMissingTableError(error)) throw new Error(`Could not load locations: ${error.message}`);
  const { data: setting, error: settingError } = await supabase.from("site_settings").select("value").eq("key", "locations_data").maybeSingle();
  if (settingError) throw new Error(`Could not load legacy locations: ${settingError.message}`);
  if (!setting?.value) return [];
  const parsed = typeof setting.value === "string" ? JSON.parse(setting.value) : setting.value;
  return Array.isArray(parsed) ? parsed as LocationRecord[] : [];
}

/**
 * True only when the error means the table itself is absent (pre-migration
 * DB) — the case the site_settings fallback exists for. Every other failure
 * (validation, connectivity, constraint) must surface instead of silently
 * rewriting the fallback blob.
 */
function isMissingTableError(
  err: { code?: string; message?: string } | null,
): boolean {
  if (!err) return false;
  return (
    err.code === "42P01" ||
    err.code === "PGRST205" ||
    /does not exist|could not find the table/i.test(err.message || "")
  );
}

export async function saveLocation(
  location: Partial<LocationRecord> & { name: string },
) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const id = location.id || `loc-${Date.now()}`;
    const itemToSave = {
      ...location,
      id,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("locations")
      .upsert(itemToSave, { onConflict: "id" });
    if (error && !isMissingTableError(error)) {
      return { success: false, error: error.message };
    }
    if (error) {
      // Table doesn't exist, persist in site_settings
      const current = await getAdminLocations();
      const idx = current.findIndex((l) => l.id === id);
      const updated =
        idx >= 0
          ? current.map((l, i) => (i === idx ? { ...l, ...location, id } : l))
          : [...current, itemToSave as LocationRecord];
      const { error: fallbackWriteError } = await supabase
        .from("site_settings")
        .upsert(
          {
            key: "locations_data",
            value: JSON.stringify(updated),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "key" },
        );
      if (fallbackWriteError) throw fallbackWriteError;
    }

    await logActivity({
      action: location.id ? "update" : "create",
      targetType: "location",
      targetId: id,
      targetLabel: location.name,
    });

    revalidatePath("/admin/locations");
    revalidatePath("/locations");
    revalidatePath("/map");
    return { success: true, id };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function deleteLocation(id: string) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("locations").delete().eq("id", id).select("id");
    if (error && !isMissingTableError(error)) {
      return { success: false, error: error.message };
    }
    if (error) {
      // Table doesn't exist, update in site_settings
      const current = await getAdminLocations();
      if (!current.some((location) => location.id === id)) throw new Error("Location was not found; no record was deleted.");
      const updated = current.filter((l) => l.id !== id);
      const { error: fallbackWriteError } = await supabase
        .from("site_settings")
        .upsert(
          {
            key: "locations_data",
            value: JSON.stringify(updated),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "key" },
        );
      if (fallbackWriteError) throw fallbackWriteError;
    } else if (!data?.length) {
      throw new Error("Location was not found; no record was deleted.");
    }

    await logActivity({
      action: "delete",
      targetType: "location",
      targetId: id,
    });

    revalidatePath("/admin/locations");
    revalidatePath("/locations");
    revalidatePath("/map");
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
