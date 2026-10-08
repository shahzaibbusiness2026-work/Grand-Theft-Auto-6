"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient as createServerSupabase } from "@/lib/supabase/server";

import { INITIAL_ADMIN_MAP_MARKERS, AdminMapMarker } from "@/lib/admin-store";
import { assertAdmin } from "@/lib/auth/assert-admin";
import { logActivity } from "./activity";

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
 * Fetch map markers for the public interactive map and admin dashboard.
 * Static fallback only on connection failure — an empty table is an empty map.
 */
export async function getMapMarkers(): Promise<AdminMapMarker[]> {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("map_markers")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && data) {
      return (data as DatabaseMapMarkerRow[]).map(rowToMarker);
    }
    console.error("getMapMarkers: database error", error?.message);
  } catch {
    // Connection failure — fall back to bundled markers
  }

  return INITIAL_ADMIN_MAP_MARKERS;
}

/**
 * Save or update a map marker in Supabase
 */
export async function saveMapMarker(marker: Partial<AdminMapMarker> & { name: string; id?: string }) {
  try {
    await assertAdmin();
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

    await logActivity({
      action: marker.id ? "update" : "create",
      targetType: "map_marker",
      targetId: id,
      targetLabel: marker.name,
    });

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
    await assertAdmin();
    const supabase = createAdminClient();
    const { error } = await supabase.from("map_markers").delete().eq("id", id);
    if (error) throw error;

    await logActivity({ action: "delete", targetType: "map_marker", targetId: id });

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
