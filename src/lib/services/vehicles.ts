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

  /* Catalog + deep-dive columns (migration 05) */
  slug?: string | null;
  confidence?: string | null;
  source?: string | null;
  price?: number | null;
  price_display?: string | null;
  seating?: number | null;
  drivetrain?: string | null;
  power_hp?: number | null;
  traction?: number | null;
  cornering?: number | null;
  launch?: number | null;
  reverse_speed?: number | null;
  torque?: number | null;
  resale_price?: number | null;
  insurance_cost?: number | null;
  upgrade_cost?: number | null;
  repair_cost?: number | null;
  storage_cost?: number | null;
  engine_type?: string | null;
  engine_size?: string | null;
  transmission?: string | null;
  gears?: number | null;
  fuel_type?: string | null;
  turbo?: boolean | null;
  electric?: boolean | null;
  doors?: number | null;
  convertible?: boolean | null;
  roof_type?: string | null;
  trunk_capacity?: string | null;
  offroad_rating?: number | null;
  water_rating?: number | null;
  amphibious?: boolean | null;
  bullet_resistance?: number | null;
  explosion_resistance?: number | null;
  armor_rating?: number | null;
  weaponized?: boolean | null;
  drift_rating?: number | null;
  special_ability?: string | null;
  features?: string[] | null;
  customization?: string[] | null;
  sound_rating?: number | null;
  engine_sound?: string | null;
  exhaust_sound?: string | null;
  horn?: string | null;
  turbo_sound?: string | null;
  gear_shift_sound?: string | null;
  availability?: string | null;
  featured?: boolean | null;
  gallery?: string[] | null;
  tags?: string[] | null;
}

/** Public catalog row — the DB row now carries all catalog + deep-dive columns. */
export type VehicleCatalogRow = DatabaseVehicleRow;

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
    // Deep-dive fields
    slug: row.slug,
    price: row.price,
    priceDisplay: row.price_display || undefined,
    powerHp: row.power_hp,
    confidence: row.confidence || undefined,
    traction: row.traction,
    cornering: row.cornering,
    launch: row.launch,
    reverseSpeed: row.reverse_speed,
    torque: row.torque,
    resalePrice: row.resale_price,
    insuranceCost: row.insurance_cost,
    upgradeCost: row.upgrade_cost,
    repairCost: row.repair_cost,
    storageCost: row.storage_cost,
    engineType: row.engine_type || undefined,
    engineSize: row.engine_size || undefined,
    transmission: row.transmission || undefined,
    gears: row.gears,
    fuelType: row.fuel_type || undefined,
    turbo: row.turbo || false,
    electric: row.electric || false,
    doors: row.doors,
    convertible: row.convertible || false,
    roofType: row.roof_type || undefined,
    trunkCapacity: row.trunk_capacity || undefined,
    offroadRating: row.offroad_rating,
    waterRating: row.water_rating,
    amphibious: row.amphibious || false,
    bulletResistance: row.bullet_resistance,
    explosionResistance: row.explosion_resistance,
    armorRating: row.armor_rating,
    weaponized: row.weaponized || false,
    driftRating: row.drift_rating,
    specialAbility: row.special_ability || undefined,
    features: row.features || [],
    customization: row.customization || [],
    soundRating: row.sound_rating,
    engineSound: row.engine_sound || undefined,
    exhaustSound: row.exhaust_sound || undefined,
    horn: row.horn || undefined,
    turboSound: row.turbo_sound || undefined,
    gearShiftSound: row.gear_shift_sound || undefined,
    availability: row.availability || undefined,
    featured: row.featured || false,
    gallery: row.gallery || [],
    tags: row.tags || [],
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
    await assertAdmin();
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
 * Save or update a vehicle in Supabase.
 * Deep-dive fields are optional — if migration 05 has not been applied yet
 * the save retries with the legacy column set instead of failing.
 */
export async function saveVehicle(v: Partial<AdminVehicle> & { name: string; id?: string }) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const id = v.id || v.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const payload: Record<string, unknown> = {
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

    // Deep-dive fields — only written when provided so partial saves don't clear data.
    const optional: Record<string, unknown> = {
      slug: v.slug,
      price: v.price,
      price_display: v.priceDisplay,
      power_hp: v.powerHp,
      confidence: v.confidence,
      traction: v.traction,
      cornering: v.cornering,
      launch: v.launch,
      reverse_speed: v.reverseSpeed,
      torque: v.torque,
      resale_price: v.resalePrice,
      insurance_cost: v.insuranceCost,
      upgrade_cost: v.upgradeCost,
      repair_cost: v.repairCost,
      storage_cost: v.storageCost,
      engine_type: v.engineType,
      engine_size: v.engineSize,
      transmission: v.transmission,
      gears: v.gears,
      fuel_type: v.fuelType,
      turbo: v.turbo,
      electric: v.electric,
      doors: v.doors,
      convertible: v.convertible,
      roof_type: v.roofType,
      trunk_capacity: v.trunkCapacity,
      offroad_rating: v.offroadRating,
      water_rating: v.waterRating,
      amphibious: v.amphibious,
      bullet_resistance: v.bulletResistance,
      explosion_resistance: v.explosionResistance,
      armor_rating: v.armorRating,
      weaponized: v.weaponized,
      drift_rating: v.driftRating,
      special_ability: v.specialAbility,
      features: v.features,
      customization: v.customization,
      sound_rating: v.soundRating,
      engine_sound: v.engineSound,
      exhaust_sound: v.exhaustSound,
      horn: v.horn,
      turbo_sound: v.turboSound,
      gear_shift_sound: v.gearShiftSound,
      availability: v.availability,
      featured: v.featured,
      gallery: v.gallery,
      tags: v.tags,
    };
    for (const [k, val] of Object.entries(optional)) {
      if (val !== undefined) payload[k] = val;
    }

    let result = await supabase.from("vehicles").upsert(payload, { onConflict: "id" });
    if (result.error && (result.error as { code?: string }).code === "42703") {
      // A column from migration 05 is missing — retry with legacy columns only.
      const legacyKeys = new Set([
        "id", "code", "name", "display_name", "class", "manufacturer", "top_speed",
        "acceleration", "handling", "weight", "summary", "images", "status",
        "verification", "last_editor", "updated_at",
      ]);
      const legacy: Record<string, unknown> = {};
      for (const [k, val] of Object.entries(payload)) {
        if (legacyKeys.has(k)) legacy[k] = val;
      }
      result = await supabase.from("vehicles").upsert(legacy, { onConflict: "id" });
      if (!result.error) {
        return { success: true, id, warning: "Deep-dive fields skipped — run supabase/05_vehicle_weapon_upgrade.sql to enable them." };
      }
    }
    if (result.error) throw result.error;

    await logActivity({
      action: v.id ? "update" : "create",
      targetType: "vehicle",
      targetId: id,
      targetLabel: v.name,
    });

    revalidatePath("/vehicles");
    revalidatePath("/");
    revalidatePath("/admin/vehicles");
    revalidatePath("/compare/vehicles");
    revalidatePath("/vehicles/compare");
    revalidatePath("/rankings");

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
