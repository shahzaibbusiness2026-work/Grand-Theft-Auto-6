"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { SITE_CONFIG } from "@/lib/constants";

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  targetReleaseDate: string;
  isReleaseDateConfirmed: boolean;
  announcementBanner?: string | null;
  heroTagline?: string | null;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: SITE_CONFIG.name,
  siteDescription: SITE_CONFIG.description,
  targetReleaseDate: SITE_CONFIG.targetReleaseDate,
  isReleaseDateConfirmed: SITE_CONFIG.isReleaseDateConfirmed,
  announcementBanner: "GTA 6 Atlas — The Ultimate Interactive Companion for Grand Theft Auto VI",
  heroTagline: "Explore Vice City & The State of Leonida",
};

/**
 * Fetch site settings from Supabase (with fallback)
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*");

    if (!error && data && data.length > 0) {
      const settingsMap = data.reduce((acc, row) => {
        acc[row.key] = row.value;
        return acc;
      }, {} as Record<string, any>);

      return {
        ...DEFAULT_SETTINGS,
        ...settingsMap,
      };
    }
  } catch {
    // Graceful fallback
  }

  return DEFAULT_SETTINGS;
}

/**
 * Update a specific site setting in Supabase
 */
export async function updateSiteSetting(key: keyof SiteSettings, value: any) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("site_settings").upsert({
      key,
      value,
      updated_at: new Date().toISOString(),
    }, { onConflict: "key" });

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/settings");

    return { success: true };
  } catch (err) {
    console.error("Failed to update site setting:", err);
    return { success: false, error: String(err) };
  }
}
