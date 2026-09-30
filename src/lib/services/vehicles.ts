"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/auth/assert-admin";

import { vehicles as fallbackVehicles, Vehicle } from "@/lib/data";
import { INITIAL_ADMIN_VEHICLES, AdminVehicle } from "@/lib/admin-store";
import { logActivity } from "./activity";

export interface DatabaseVehicleRow {
  id: string;
  code?: string | null;
  name: string;
  display_name?: string | null;
  class: string;
  manufacturer: string;
  top_speed?: string | null;
  acceleration?: string | null;
  handling?: string | null;
  weight?: string | null;
  summary?: string | null;
  images?: string[] | null;
  status: string;
  verification: string;
  last_editor?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

/** Full public vehicle row including the catalog columns added in schema v2. */
export interface VehicleCatalogRow extends DatabaseVehicleRow {
  slug?: string | null;
  confidence?: string | null;
  source?: string | null;
  price?: number | null;
  price_display?: string | null;
  seating?: number | null;
  drivetrain?: string | null;
  power_hp?: number | null;
}

/**
 * Fetch published vehicles with ALL catalog columns, unmapped.
 * Lets public pages prefer live admin edits over canonical static stats.
 */
export async function getPublicVehicleCatalog(): Promise<VehicleCatalogRow[]> {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: true });

    if (!error && data && data.length > 0) {
      return data as VehicleCatalogRow[];
    }
  } catch {
    // Graceful fallback
  }
  return [];
}

function rowToVehicle(row: DatabaseVehicleRow): Vehicle {
  const speedNum = parseInt(row.top_speed || "180", 10) || 180;
  const powerNum = parseInt(row.acceleration || "600", 10) || 600;

  return {
    id: row.id,
    name: row.name,
    klass: row.class,
    img: row.images?.[0] || "/img/car-orange.jpg",
    topSpeed: speedNum,
    power: powerNum,
    featured: true,
  };
}

function rowToAdminVehicle(row: DatabaseVehicleRow): AdminVehicle {
  return {
    id: row.id,
    code: row.code || `VEH-${row.id.toUpperCase()}`,
    name: row.name,
    displayName: row.display_name || row.name,
    class: (row.class as AdminVehicle["class"]) || "Sports",
    manufacturer: row.manufacturer,
    verification: (row.verification as AdminVehicle["verification"]) || "verified",
    status: (row.status as AdminVehicle["status"]) || "published",
    summary: row.summary || "Cataloged vehicle in the State of Leonida",
    topSpeed: row.top_speed || "180 mph",
    acceleration: row.acceleration || "3.4s",
    handling: row.handling || "8.5/10",
    weight: row.weight || "3,200 lbs",
    sources: [],
    images: row.images || ["/img/car-orange.jpg"],
    lastEditor: row.last_editor || "Atlas Staff",
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

/**
 * Fetch vehicles for public frontend.
 * Static fallback only on connection failure — an empty table means the CMS
 * has no published vehicles and must be shown as such.
 */
export async function getPublicVehicles(): Promise<Vehicle[]> {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: true });

    if (!error && data) {
      return (data as DatabaseVehicleRow[]).map(rowToVehicle);
    }
    console.error("getPublicVehicles: database error", error?.message);
  } catch {
    // Connection failure — fall back to bundled content
  }

  return fallbackVehicles;
}

/**
 * Fetch vehicles for Admin Dashboard. DB-authoritative: an empty table
 * returns an empty list rather than ghost demo rows.
 */
export async function getAdminVehicles(): Promise<AdminVehicle[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .order("updated_at", { ascending: false });

    if (!error && data) {
      return (data as DatabaseVehicleRow[]).map(rowToAdminVehicle);
    }
    console.error("getAdminVehicles: database error", error?.message);
  } catch {
    // Connection failure — fall back to bundled content
  }

  return INITIAL_ADMIN_VEHICLES;
}

/**
 * Fetch a single vehicle (any status) for the admin editor.
 */
export async function getAdminVehicleById(id: string): Promise<AdminVehicle | null> {
  if (!id || id === "new") return null;
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) return rowToAdminVehicle(data as DatabaseVehicleRow);
    if (error) console.error("getAdminVehicleById: database error", error.message);
  } catch (err) {
    console.error("getAdminVehicleById:", err);
  }
  return null;
}

/**
 * Save or update a vehicle in Supabase
 */
export async function saveVehicle(v: Partial<AdminVehicle> & { name: string; id?: string }) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const id = v.id || v.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const payload: Partial<DatabaseVehicleRow> = {
      id,
      code: v.code || `VEH-${id.toUpperCase()}`,
      name: v.name,
      display_name: v.displayName || v.name,
      class: v.class || "Sports",
      manufacturer: v.manufacturer || "Unknown",
      top_speed: v.topSpeed || "180 mph",
      acceleration: v.acceleration || "3.5s",
      handling: v.handling || "8.0/10",
      weight: v.weight || "3,200 lbs",
      summary: v.summary || "Cataloged vehicle in the State of Leonida",
      images: v.images || ["/img/car-orange.jpg"],
      status: v.status || "published",
      verification: v.verification || "verified",
      last_editor: v.lastEditor || "Atlas Staff",
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("vehicles").upsert(payload, { onConflict: "id" });
    if (error) throw error;

    await logActivity({
      action: v.id ? "update" : "create",
      targetType: "vehicle",
      targetId: id,
      targetLabel: v.name,
    });

    revalidatePath("/vehicles");
    revalidatePath("/");
    revalidatePath("/admin/vehicles");

    return { success: true, id };
  } catch (err) {
    console.error("Failed to save vehicle:", err);
    return { success: false, error: String(err) };
  }
}

/**
 * Delete a vehicle from Supabase
 */
export async function deleteVehicle(id: string) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const { error } = await supabase.from("vehicles").delete().eq("id", id);
    if (error) throw error;

    await logActivity({ action: "delete", targetType: "vehicle", targetId: id });

    revalidatePath("/vehicles");
    revalidatePath("/");
    revalidatePath("/admin/vehicles");

    return { success: true };
  } catch (err) {
    console.error("Failed to delete vehicle:", err);
    return { success: false, error: String(err) };
  }
}
