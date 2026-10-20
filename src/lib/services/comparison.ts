"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
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

export interface SavedComparison {
  id: string;
  name: string;
  type: "vehicle" | "weapon";
  itemIds: string[];
  itemCount: number;
  attributes: { label: string; unit: string; rule: "higher" | "lower" | "none" }[];
  missingValueDisplay: string;
  hideEmptyAttributes: boolean;
  updatedAt: string;
}

/**
 * Load saved comparison drafts from site_settings (JSON array).
 */
export async function getSavedComparisons(): Promise<
  { id: string; name: string; type: string; itemCount: number; updatedAt: string }[]
> {
  try {
    const supabase = await createServerSupabase();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "admin_saved_comparisons")
      .maybeSingle();
    if (data?.value && Array.isArray(data.value)) {
      return data.value as { id: string; name: string; type: string; itemCount: number; updatedAt: string }[];
    }
    return [];
  } catch (err) {
    console.error("Failed to load saved comparisons:", err);
    return [];
  }
}

/**
 * Save a comparison draft to site_settings. Returns success flag.
 */
export async function saveComparisonDraft(
  draft: Omit<SavedComparison, "id" | "updatedAt"> & { id?: string }
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const { data: existing } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "admin_saved_comparisons")
      .maybeSingle();
    const list: SavedComparison[] = Array.isArray(existing?.value) ? existing.value : [];
    const id = draft.id || `cmp-${Date.now()}`;
    const updatedAt = new Date().toISOString();
    const record: SavedComparison = { ...draft, id, updatedAt };
    const idx = list.findIndex((c) => c.id === id);
    const next = idx >= 0 ? list.map((c, i) => (i === idx ? record : c)) : [record, ...list];
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: "admin_saved_comparisons", value: next, updated_at: updatedAt }, { onConflict: "key" });
    if (error) throw error;
    revalidatePath("/admin/comparisons");
    return { success: true, id };
  } catch (err) {
    console.error("Failed to save comparison:", err);
    return { success: false, error: String(err) };
  }
}

/**
 * Delete a saved comparison draft from site_settings.
 */
export async function deleteComparisonDraft(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const { data: existing } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "admin_saved_comparisons")
      .maybeSingle();
    const list: SavedComparison[] = Array.isArray(existing?.value) ? existing.value : [];
    const next = list.filter((c) => c.id !== id);
    if (next.length === list.length) {
      return { success: false, error: "Saved comparison not found" };
    }
    const { error } = await supabase
      .from("site_settings")
      .upsert(
        { key: "admin_saved_comparisons", value: next, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
    if (error) throw error;
    revalidatePath("/admin/comparisons");
    return { success: true };
  } catch (err) {
    console.error("Failed to delete comparison:", err);
    return { success: false, error: String(err) };
  }
}
