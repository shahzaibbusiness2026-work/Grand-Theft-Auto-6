"use server";

import { cache } from "react";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";
import { assertAdmin } from "@/lib/auth/assert-admin";
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
  /** Homepage section ids (hero, trailers, map, characters, news, community) with public visibility enabled. Read by the homepage. */
  homepageSectionToggles: string[];
  /** Tool ids with public access enabled (map_tool, comp_tool, track_tool). Read by the /map, compare and /tracker pages. */
  publicToolToggles: string[];
  /** Analytics / webhook integrations (empty = not configured). */
  ga4MeasurementId: string;
  cloudflareToken: string;
  discordWebhookUrl: string;
}

const DEFAULT_SETTINGS: ComprehensiveSiteSettings = {
  ...INITIAL_ADMIN_SETTINGS,
  siteTitle: SITE_CONFIG.name,
  siteTagline: "The Ultimate GTA 6 Companion Platform & Database",
  siteDescription: SITE_CONFIG.description,
  targetReleaseDate: SITE_CONFIG.targetReleaseDate,
  isReleaseDateConfirmed: SITE_CONFIG.isReleaseDateConfirmed,
  countdownCaption: "GTA VI releases November 19, 2026 · Pre-load begins November 12, 2026",
  heroHeading: "Grand Theft Auto VI — Fan-Made Database & Interactive Atlas",
  heroSubtitle: "Explore Vice City & The State of Leonida with confirmed intelligence, vehicles, lore, and map coordinates.",
  announcementBanner: "Taish Gaming — The Ultimate Interactive Companion for Grand Theft Auto VI",
  // Social/contact placeholders are intentionally empty: no mailbox or
  // handle exists for the brand yet, and the UI must not link to lookalikes.
  contactEmail: "",
  twitterHandle: "",
  discordUrl: "",
  redditUrl: "",
  homepageSectionToggles: ["hero", "trailers", "map", "characters", "news", "community"],
  publicToolToggles: ["map_tool", "comp_tool", "track_tool"],
  ga4MeasurementId: "",
  cloudflareToken: "",
  discordWebhookUrl: "",
};

/**
 * Fetch all site text & settings from Supabase (with fallback).
 * cache() dedupes repeat calls within one request (layout + page + footer).
 */
export const getSiteSettings = cache(async (): Promise<ComprehensiveSiteSettings> => {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("site_settings").select("*");

    if (!error && data && data.length > 0) {
      const settingsMap = data.reduce((acc: Record<string, any>, row: any) => {
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
});

/**
 * Keys owned by specific services (or stored privately elsewhere). A settings
 * save must never write them: it would corrupt the owning feature or publish
 * private data through the anon-readable site_settings table.
 */
const RESERVED_SETTING_KEYS = new Set([
  "newsletter_subscribers",
  "admin_team_members",
  "media_assets_data",
  "admin_tasks",
  "admin_categories",
  "completion_tracker_config",
  "locations_data",
  "missions_data",
  "seo_settings_data",
]);

const MAX_SETTING_VALUE_CHARS = 100_000;

/**
 * Save entire site settings or specific keys in Supabase
 */
export async function saveSiteSettings(settings: Partial<ComprehensiveSiteSettings>) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();

    const entries = Object.entries(settings);
    const reserved = entries.filter(([key]) => RESERVED_SETTING_KEYS.has(key)).map(([key]) => key);
    if (reserved.length > 0) {
      return {
        success: false as const,
        error: `These keys are managed by other features and cannot be saved here: ${reserved.join(", ")}.`,
      };
    }
    for (const [, value] of entries) {
      if (JSON.stringify(value ?? "")?.length > MAX_SETTING_VALUE_CHARS) {
        return { success: false as const, error: "One of the values is too large to save." };
      }
    }

    const upsertPromises = entries.map(([key, value]) =>
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
