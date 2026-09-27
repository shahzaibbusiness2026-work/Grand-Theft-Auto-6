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

const DEFAULT_TRACKER_CATEGORIES: TrackerCategory[] = [
  { id: "trk-1", name: "Story Missions", weight: 50, totalItems: 68, active: true },
  { id: "trk-2", name: "Strangers & Freaks", weight: 20, totalItems: 32, active: true },
  { id: "trk-3", name: "Collectibles & Hidden Packages", weight: 15, totalItems: 100, active: true },
  { id: "trk-4", name: "Random World Encounters", weight: 10, totalItems: 40, active: true },
  { id: "trk-5", name: "Hobbies & Pastimes", weight: 5, totalItems: 25, active: true },
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
