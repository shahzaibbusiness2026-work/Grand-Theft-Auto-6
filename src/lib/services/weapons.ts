"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";
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

  /* Catalog + deep-dive columns (migration 05) */
  slug?: string | null;
  confidence?: string | null;
  price?: number | null;
  price_display?: string | null;
  rarity?: string | null;
  attachments?: string[] | null;
  reload?: number | null;
  ammo_capacity?: number | null;
  recoil?: number | null;
  mobility?: number | null;
  projectile_speed?: number | null;
  headshot_multiplier?: number | null;
  damage_falloff?: number | null;
  fire_mode?: string | null;
  features?: string[] | null;
  ammo_cost?: number | null;
  upgrade_cost?: number | null;
  manufacturer?: string | null;
  availability?: string | null;
  featured?: boolean | null;
  image?: string | null;
  gallery?: string[] | null;
  tags?: string[] | null;
  customization?: string[] | null;
}

/** Public catalog row — the DB row now carries all catalog + deep-dive columns. */
export type WeaponCatalogRow = DatabaseWeaponRow;

/**
 * Fetch published weapons with ALL catalog columns, unmapped.
 * Lets public pages prefer live admin edits over canonical static stats.
 */
export async function getPublicWeaponCatalog(): Promise<WeaponCatalogRow[]> {
  try {
    const supabase = createPublicClient();
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
    // Deep-dive fields
    slug: row.slug,
    confidence: row.confidence || undefined,
    rarity: row.rarity || undefined,
    price: row.price,
    priceDisplay: row.price_display || undefined,
    ammoCost: row.ammo_cost,
    upgradeCost: row.upgrade_cost,
    reload: row.reload,
    ammoCapacity: row.ammo_capacity,
    recoil: row.recoil,
    mobility: row.mobility,
    projectileSpeed: row.projectile_speed,
    headshotMultiplier: row.headshot_multiplier,
    damageFalloff: row.damage_falloff,
    fireMode: row.fire_mode || undefined,
    features: row.features || [],
    attachments: row.attachments || [],
    manufacturer: row.manufacturer || undefined,
    availability: row.availability || undefined,
    featured: row.featured || false,
    image: row.image || undefined,
    gallery: row.gallery || [],
    tags: row.tags || [],
    customization: row.customization || [],
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
    const supabase = createPublicClient();
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
 * Save or update a weapon in Supabase.
 * Deep-dive fields are optional — if migration 05 has not been applied yet
 * the save retries with the legacy column set instead of failing.
 */
export async function saveWeapon(weapon: Partial<AdminWeapon> & { name: string; id?: string }) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const id = weapon.id || `wep-${Date.now()}`;

    const payload: Record<string, unknown> = {
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

    // Deep-dive fields — only written when provided so partial saves don't clear data.
    const optional: Record<string, unknown> = {
      slug: weapon.slug,
      confidence: weapon.confidence,
      rarity: weapon.rarity,
      price: weapon.price,
      price_display: weapon.priceDisplay,
      ammo_cost: weapon.ammoCost,
      upgrade_cost: weapon.upgradeCost,
      reload: weapon.reload,
      ammo_capacity: weapon.ammoCapacity,
      recoil: weapon.recoil,
      mobility: weapon.mobility,
      projectile_speed: weapon.projectileSpeed,
      headshot_multiplier: weapon.headshotMultiplier,
      damage_falloff: weapon.damageFalloff,
      fire_mode: weapon.fireMode,
      features: weapon.features,
      manufacturer: weapon.manufacturer,
      availability: weapon.availability,
      featured: weapon.featured,
      image: weapon.image,
      gallery: weapon.gallery,
      tags: weapon.tags,
      customization: weapon.customization,
    };
    for (const [k, val] of Object.entries(optional)) {
      if (val !== undefined) payload[k] = val;
    }

    let result = await supabase.from("weapons").upsert(payload, { onConflict: "id" });
    if (result.error && (result.error as { code?: string }).code === "42703") {
      // A column from migration 05 is missing — retry with legacy columns only.
      const legacyKeys = new Set([
        "id", "code", "name", "category", "ammunition", "damage", "range",
        "rate_of_fire", "magazine_size", "acquisition_method", "notes",
        "status", "verification", "updated_at",
      ]);
      const legacy: Record<string, unknown> = {};
      for (const [k, val] of Object.entries(payload)) {
        if (legacyKeys.has(k)) legacy[k] = val;
      }
      result = await supabase.from("weapons").upsert(legacy, { onConflict: "id" });
      if (!result.error) {
        return { success: true, id, warning: "Deep-dive fields skipped — run supabase/05_vehicle_weapon_upgrade.sql to enable them." };
      }
    }
    if (result.error) throw result.error;

    await logActivity({
      action: weapon.id ? "update" : "create",
      targetType: "weapon",
      targetId: id,
      targetLabel: weapon.name,
    });

    revalidatePath("/weapons");
    revalidatePath("/admin/weapons");
    revalidatePath("/compare/weapons");
    revalidatePath("/weapons/compare");
    revalidatePath("/rankings");

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
