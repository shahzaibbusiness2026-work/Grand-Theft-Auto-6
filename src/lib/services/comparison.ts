"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/auth/assert-admin";
import {
  DEFAULT_VEHICLE_WEIGHTS,
  DEFAULT_WEAPON_WEIGHTS,
  type VehicleScoreWeights,
  type WeaponScoreWeights,
} from "@/lib/scoring";

/**
 * comparison.ts — CMS-configurable scoring weights for the comparison
 * tools and rankings. Stored in site_settings as JSON:
 *   vehicle_score_weights  → {"topSpeed":25,"acceleration":20,...}
 *   weapon_score_weights   → {"damage":25,...}
 */

export interface ComparisonWeights {
  vehicle: VehicleScoreWeights;
  weapon: WeaponScoreWeights;
}

async function readWeightSetting(key: string, fallback: Record<string, number>): Promise<Record<string, number>> {
  try {
    const supabase = await createServerSupabase();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (data?.value) {
      const parsed = typeof data.value === "string" ? JSON.parse(data.value) : data.value;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        const merged = { ...fallback };
        for (const k of Object.keys(merged)) {
          const n = Number((parsed as Record<string, unknown>)[k]);
          if (Number.isFinite(n) && n >= 0) merged[k] = n;
        }
        return merged;
      }
    }
  } catch {
    // Fall back to defaults
  }
  return { ...fallback };
}

/** Weights for the public comparison tools and rankings pages. */
export async function getComparisonWeights(): Promise<ComparisonWeights> {
  const [vehicle, weapon] = await Promise.all([
    readWeightSetting("vehicle_score_weights", { ...DEFAULT_VEHICLE_WEIGHTS }),
    readWeightSetting("weapon_score_weights", { ...DEFAULT_WEAPON_WEIGHTS }),
  ]);
  return {
    vehicle: {
      topSpeed: vehicle.topSpeed,
      acceleration: vehicle.acceleration,
      handling: vehicle.handling,
      braking: vehicle.braking,
      traction: vehicle.traction,
      features: vehicle.features,
    },
    weapon: {
      damage: weapon.damage,
      fireRate: weapon.fireRate,
      accuracy: weapon.accuracy,
      range: weapon.range,
      reload: weapon.reload,
      magazine: weapon.magazine,
      handling: weapon.handling,
    },
  };
}

export async function saveComparisonWeights(
  vehicle: VehicleScoreWeights,
  weapon: WeaponScoreWeights
): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const rows = [
      { key: "vehicle_score_weights", value: JSON.stringify(vehicle), updated_at: new Date().toISOString() },
      { key: "weapon_score_weights", value: JSON.stringify(weapon), updated_at: new Date().toISOString() },
    ];
    const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
    if (error) throw error;

    revalidatePath("/admin/comparison");
    revalidatePath("/compare/vehicles");
    revalidatePath("/compare/weapons");
    revalidatePath("/vehicles/compare");
    revalidatePath("/weapons/compare");
    revalidatePath("/rankings");
    return { success: true };
  } catch (err) {
    console.error("Failed to save comparison weights:", err);
    return { success: false, error: String(err) };
  }
}
