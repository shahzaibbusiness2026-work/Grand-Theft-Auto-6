"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { SITE_CONFIG } from "@/lib/constants";
import { INITIAL_ADMIN_SETTINGS, AdminSiteSettings } from "@/lib/admin-store";


export interface ComprehensiveSiteSettings extends AdminSiteSettings {
  siteTitle: string;
  siteTagline: string;
  siteDescription: string;
  targetReleaseDate: string;
  isReleaseDateConfirmed: boolean;
  countdownCaption: string;
  heroHeading: string;
  heroSubtitle: string;
  announcementBanner: string;
  contactEmail: string;
  twitterHandle: string;
  discordUrl: string;
  redditUrl: string;
}

const DEFAULT_SETTINGS: ComprehensiveSiteSettings = {
  ...INITIAL_ADMIN_SETTINGS,
  siteTitle: SITE_CONFIG.name,
  siteTagline: "The Ultimate GTA 6 Companion Platform & Database",
  siteDescription: SITE_CONFIG.description,
  targetReleaseDate: SITE_CONFIG.targetReleaseDate,
  isReleaseDateConfirmed: SITE_CONFIG.isReleaseDateConfirmed,
  countdownCaption: "Target countdown • Official date to be confirmed by Rockstar Games",
  heroHeading: "Grand Theft Auto VI — Official Database & Interactive Atlas",
  heroSubtitle: "Explore Vice City & The State of Leonida with confirmed intelligence, vehicles, lore, and map coordinates.",
  announcementBanner: "GTA 6 Atlas — The Ultimate Interactive Companion for Grand Theft Auto VI",
  contactEmail: "contact@gta6atlas.com",
  twitterHandle: "@GTA6Atlas",
  discordUrl: "https://discord.gg/gta6atlas",
  redditUrl: "https://reddit.com/r/GTA6Atlas",
};

/**
 * Fetch all site text & settings from Supabase (with fallback)
 */
export async function getSiteSettings(): Promise<ComprehensiveSiteSettings> {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.from("site_settings").select("*");

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
 * Save entire site settings or specific keys in Supabase
 */
export async function saveSiteSettings(settings: Partial<ComprehensiveSiteSettings>) {
  try {
    const supabase = createAdminClient();

    const upsertPromises = Object.entries(settings).map(([key, value]) =>
      supabase.from("site_settings").upsert(
        {
          key,
          value,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      )
    );

    await Promise.all(upsertPromises);

    revalidatePath("/");
    revalidatePath("/admin/settings");
    revalidatePath("/about");
    revalidatePath("/news");
    revalidatePath("/map");

    return { success: true };
  } catch (err) {
    console.error("Failed to save site settings:", err);
    return { success: false, error: String(err) };
  }
}
