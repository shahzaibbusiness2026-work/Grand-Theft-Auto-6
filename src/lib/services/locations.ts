"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/auth/assert-admin";
import { logActivity } from "./activity";

export interface LocationRecord {
  id: string;
  name: string;
  district: string;
  type: "City District" | "Island / Keys" | "Government Facility" | "Landmark";
  verification: "verified" | "pending";
  coordinates: string;
  description?: string;
}

const FALLBACK_LOCATIONS: LocationRecord[] = [
  { id: "loc-1", name: "Vice City Beach", district: "Vice City Metro", type: "City District", verification: "verified", coordinates: "25.7617, -80.1918" },
  { id: "loc-2", name: "Leonida Penitentiary", district: "Leonard County", type: "Government Facility", verification: "verified", coordinates: "25.9011, -80.3542" },
  { id: "loc-3", name: "Grassrivers Wetlands", district: "Everglades Equivalent", type: "Landmark", verification: "pending", coordinates: "25.6120, -80.6010" },
  { id: "loc-4", name: "Kelly County Archipelago", district: "The Keys", type: "Island / Keys", verification: "verified", coordinates: "24.5551, -81.7800" },
];

export async function getLocations(): Promise<LocationRecord[]> {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.from("locations").select("*").order("created_at", { ascending: true });
    if (!error && data && data.length > 0) return data as LocationRecord[];

    // Fallback to site_settings persistence
    const { data: setting } = await supabase.from("site_settings").select("value").eq("key", "locations_data").single();
    if (setting?.value) {
      const parsed = typeof setting.value === "string" ? JSON.parse(setting.value) : setting.value;
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as LocationRecord[];
    }
  } catch { /* fallback */ }
  return FALLBACK_LOCATIONS;
}

export async function saveLocation(location: Partial<LocationRecord> & { name: string }) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const id = location.id || `loc-${Date.now()}`;
    const itemToSave = { ...location, id, updated_at: new Date().toISOString() };

    const { error } = await supabase.from("locations").upsert(itemToSave, { onConflict: "id" });
    if (error) {
      // Table doesn't exist, persist in site_settings
      const current = await getLocations();
      const idx = current.findIndex((l) => l.id === id);
      const updated = idx >= 0
        ? current.map((l, i) => (i === idx ? { ...l, ...location, id } : l))
        : [...current, itemToSave as LocationRecord];
      await supabase.from("site_settings").upsert(
        { key: "locations_data", value: JSON.stringify(updated), updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
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
    const { error } = await supabase.from("locations").delete().eq("id", id);
    if (error) {
      // Table doesn't exist, update in site_settings
      const current = await getLocations();
      const updated = current.filter((l) => l.id !== id);
      await supabase.from("site_settings").upsert(
        { key: "locations_data", value: JSON.stringify(updated), updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
    }

    await logActivity({ action: "delete", targetType: "location", targetId: id });

    revalidatePath("/admin/locations");
    revalidatePath("/locations");
    revalidatePath("/map");
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

