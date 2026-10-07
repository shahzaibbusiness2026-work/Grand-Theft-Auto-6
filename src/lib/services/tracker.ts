"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/auth/assert-admin";

export interface TrackerCategory {
  id: string;
  name: string;
  weight: number;
  totalItems: number;
  active: boolean;
}

/**
 * Default tracker configuration. Names MUST match the milestone categories
 * rendered by the public tracker (/tracker) so admin visibility toggles map
 * onto the real checklist. Weights sum to 100.
 */
const DEFAULT_TRACKER_CATEGORIES: TrackerCategory[] = [
  { id: "trk-1", name: "Story Missions", weight: 40, totalItems: 5, active: true },
  { id: "trk-2", name: "Strangers & Freaks", weight: 8, totalItems: 3, active: true },
  { id: "trk-3", name: "Collectibles", weight: 15, totalItems: 4, active: true },
  { id: "trk-4", name: "Hobbies & Pastimes", weight: 7, totalItems: 4, active: true },
  { id: "trk-5", name: "Random Events", weight: 5, totalItems: 3, active: true },
  { id: "trk-6", name: "Miscellaneous", weight: 5, totalItems: 3, active: true },
  { id: "trk-7", name: "Properties & Businesses", weight: 5, totalItems: 3, active: true },
  { id: "trk-8", name: "Weapon Masteries", weight: 5, totalItems: 3, active: true },
  { id: "trk-9", name: "Vehicle Collections", weight: 4, totalItems: 2, active: true },
  { id: "trk-10", name: "Map Exploration", weight: 4, totalItems: 2, active: true },
  { id: "trk-11", name: "Trophies & Achievements", weight: 2, totalItems: 3, active: true },
];

/**
 * Fetch tracker categories from Supabase site_settings
 */
export async function getTrackerCategories(): Promise<TrackerCategory[]> {
  try {
    const supabase = await createServerSupabase();
    const { data: setting } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "completion_tracker_config")
      .maybeSingle();

    if (setting?.value) {
      const parsed = typeof setting.value === "string" ? JSON.parse(setting.value) : setting.value;
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error("Failed to load tracker categories:", err);
  }
  return DEFAULT_TRACKER_CATEGORIES;
}

/**
 * Save tracker categories configuration to Supabase site_settings
 */
export async function saveTrackerCategories(categories: TrackerCategory[]): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const { error } = await supabase.from("site_settings").upsert(
      {
        key: "completion_tracker_config",
        value: JSON.stringify(categories),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );
    if (error) throw error;

    revalidatePath("/admin/tracker");
    revalidatePath("/tracker");
    revalidatePath("/checklist");
    return { success: true };
  } catch (err) {
    console.error("Failed to save tracker categories:", err);
    return { success: false, error: String(err) };
  }
}
