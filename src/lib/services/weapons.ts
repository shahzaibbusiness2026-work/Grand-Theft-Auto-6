"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/auth/assert-admin";

import { INITIAL_ADMIN_WEAPONS, AdminWeapon } from "@/lib/admin-store";
import { logActivity } from "./activity";

export interface DatabaseWeaponRow {
  id: string;
  code?: string | null;
  name: string;
  category: string;
  ammunition?: string | null;
  damage?: string | null;
  range?: string | null;
  rate_of_fire?: string | null;
  magazine_size?: string | null;
  acquisition_method?: string | null;
  notes?: string | null;
  status: string;
  verification: string;
  created_at?: string | null;
  updated_at?: string | null;
}

/** Full public weapon row including the catalog columns added in schema v2. */
export interface WeaponCatalogRow extends DatabaseWeaponRow {
  slug?: string | null;
  confidence?: string | null;
  price_display?: string | null;
  rarity?: string | null;
  attachments?: string[] | null;
}

/**
 * Fetch published weapons with ALL catalog columns, unmapped.
 * Lets public pages prefer live admin edits over canonical static stats.
 */
export async function getPublicWeaponCatalog(): Promise<WeaponCatalogRow[]> {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("weapons")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: true });

    if (!error && data && data.length > 0) {
      return data as WeaponCatalogRow[];
    }
  } catch {
    // Graceful fallback
  }
  return [];
}

function rowToAdminWeapon(row: DatabaseWeaponRow): AdminWeapon {
  return {
    id: row.id,
    code: row.code || `W-${row.id.toUpperCase()}`,
    name: row.name,
    category: (row.category as AdminWeapon["category"]) || "Pistol",
    ammunition: row.ammunition || "Unknown",
    verification: (row.verification as AdminWeapon["verification"]) || "unverified",
    status: (row.status as AdminWeapon["status"]) || "draft",
    damage: row.damage || "Unknown",
    range: row.range || "Unknown",
    rateOfFire: row.rate_of_fire || "Unknown",
    magazineSize: row.magazine_size || "Unknown",
    acquisitionMethod: row.acquisition_method || "Ammu-Nation",
    notes: row.notes || "",
    updatedAt: row.updated_at
      ? new Date(row.updated_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Recent",
  };
}

/**
 * Fetch all weapons for the Admin Dashboard. DB-authoritative: an empty
 * table returns an empty list rather than ghost demo rows.
 */
export async function getAdminWeapons(): Promise<AdminWeapon[]> {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("weapons")
      .select("*")
      .order("updated_at", { ascending: false });

    if (!error && data) {
      return (data as DatabaseWeaponRow[]).map(rowToAdminWeapon);
    }
    console.error("getAdminWeapons: database error", error?.message);
  } catch {
    // Connection failure — fall back to bundled content
  }

  return INITIAL_ADMIN_WEAPONS;
}

/**
 * Fetch weapons for public frontend.
 * Returns an empty list when the table is empty or unreachable — public
 * pages render their own empty/fallback state.
 */
export async function getPublicWeapons(): Promise<AdminWeapon[]> {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("weapons")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: true });

    if (!error && data) {
      return (data as DatabaseWeaponRow[]).map(rowToAdminWeapon);
    }
    console.error("getPublicWeapons: database error", error?.message);
  } catch {
    // Connection failure
  }

  return [];
}

/**
 * Fetch a single weapon (any status) for the admin editor.
 */
export async function getAdminWeaponById(id: string): Promise<AdminWeapon | null> {
  if (!id || id === "new") return null;
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("weapons")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) return rowToAdminWeapon(data as DatabaseWeaponRow);
    if (error) console.error("getAdminWeaponById: database error", error.message);
  } catch (err) {
    console.error("getAdminWeaponById:", err);
  }
  return null;
}

/**
 * Save or update a weapon in Supabase
 */
export async function saveWeapon(weapon: Partial<AdminWeapon> & { name: string; id?: string }) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const id = weapon.id || `wep-${Date.now()}`;

    const payload: Partial<DatabaseWeaponRow> = {
      id,
      code: weapon.code || `W-${id.toUpperCase()}`,
      name: weapon.name,
      category: weapon.category || "Pistol",
      ammunition: weapon.ammunition || "Unknown",
      damage: weapon.damage || "Unknown",
      range: weapon.range || "Unknown",
      rate_of_fire: weapon.rateOfFire || "Unknown",
      magazine_size: weapon.magazineSize || "Unknown",
      acquisition_method: weapon.acquisitionMethod || "Ammu-Nation",
      notes: weapon.notes || "",
      status: weapon.status || "draft",
      verification: weapon.verification || "unverified",
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("weapons").upsert(payload, { onConflict: "id" });
    if (error) throw error;

    await logActivity({
      action: weapon.id ? "update" : "create",
      targetType: "weapon",
      targetId: id,
      targetLabel: weapon.name,
    });

    revalidatePath("/weapons");
    revalidatePath("/admin/weapons");

    return { success: true, id };
  } catch (err) {
    console.error("Failed to save weapon:", err);
    return { success: false, error: String(err) };
  }
}

/**
 * Delete a weapon from Supabase
 */
export async function deleteWeapon(id: string) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const { error } = await supabase.from("weapons").delete().eq("id", id);
    if (error) throw error;

    await logActivity({ action: "delete", targetType: "weapon", targetId: id });

    revalidatePath("/weapons");
    revalidatePath("/admin/weapons");

    return { success: true };
  } catch (err) {
    console.error("Failed to delete weapon:", err);
    return { success: false, error: String(err) };
  }
}
