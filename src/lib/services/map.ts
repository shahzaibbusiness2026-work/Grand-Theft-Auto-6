"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerSupabase } from "@/lib/supabase/client";

import { INITIAL_ADMIN_MAP_MARKERS, AdminMapMarker } from "@/lib/admin-store";

export interface DatabaseMapMarkerRow {
  id: string;
  name: string;
  category: string;
  layer: string;
  visible: boolean;
  icon: string;
  coord_x: number;
  coord_y: number;
  description: string;
  verification: string;
  source?: string | null;
  linked_record?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

function rowToMarker(row: DatabaseMapMarkerRow): AdminMapMarker {
  return {
    id: row.id,
    name: row.name,
    category: (row.category as AdminMapMarker["category"]) || "Location",
    layer: (row.layer as AdminMapMarker["layer"]) || "Official",
    visible: row.visible ?? true,
    icon: (row.icon as AdminMapMarker["icon"]) || "pin",
    coordinates: {
      x: Number(row.coord_x) || 50,
      y: Number(row.coord_y) || 50,
    },
    description: row.description || "",
    verification: (row.verification as AdminMapMarker["verification"]) || "verified",
    source: row.source || undefined,
    linkedRecord: row.linked_record || undefined,
  };
}

/**
 * Fetch map markers for public interactive map and admin dashboard (with fallback)
 */
export async function getMapMarkers(): Promise<AdminMapMarker[]> {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("map_markers")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && data && data.length > 0) {
      return (data as DatabaseMapMarkerRow[]).map(rowToMarker);
    }
  } catch {
    // Graceful fallback
  }

  return INITIAL_ADMIN_MAP_MARKERS;
}

/**
 * Save or update a map marker in Supabase
 */
export async function saveMapMarker(marker: Partial<AdminMapMarker> & { name: string; id?: string }) {
  try {
    const supabase = createAdminClient();
    const id = marker.id || `mark-${Date.now()}`;

    const payload: Partial<DatabaseMapMarkerRow> = {
      id,
      name: marker.name,
      category: marker.category || "Location",
      layer: marker.layer || "Official",
      visible: marker.visible ?? true,
      icon: marker.icon || "pin",
      coord_x: marker.coordinates?.x ?? 50,
      coord_y: marker.coordinates?.y ?? 50,
      description: marker.description || "",
      verification: marker.verification || "verified",
      source: marker.source || null,
      linked_record: marker.linkedRecord || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("map_markers").upsert(payload, { onConflict: "id" });
    if (error) throw error;

    revalidatePath("/map");
    revalidatePath("/map-explorer");
    revalidatePath("/admin/map");
    revalidatePath("/");

    return { success: true, id };
  } catch (err) {
    console.error("Failed to save map marker:", err);
    return { success: false, error: String(err) };
  }
}

/**
 * Delete a map marker from Supabase
 */
export async function deleteMapMarker(id: string) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("map_markers").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/map");
    revalidatePath("/map-explorer");
    revalidatePath("/admin/map");
    revalidatePath("/");

    return { success: true };
  } catch (err) {
    console.error("Failed to delete map marker:", err);
    return { success: false, error: String(err) };
  }
}
