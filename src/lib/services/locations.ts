"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerSupabase } from "@/lib/supabase/server";


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
  } catch { /* fallback */ }
  return FALLBACK_LOCATIONS;
}

export async function saveLocation(location: Partial<LocationRecord> & { name: string }) {
  try {
    const supabase = createAdminClient();
    const id = location.id || `loc-${Date.now()}`;
    const { error } = await supabase.from("locations").upsert({ ...location, id, updated_at: new Date().toISOString() }, { onConflict: "id" });
    if (error) throw error;
    revalidatePath("/admin/locations");
    return { success: true, id };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function deleteLocation(id: string) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("locations").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/locations");
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
