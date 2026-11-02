"use server";

import { cache } from "react";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";

import { INITIAL_ADMIN_SEO, AdminSeoSettings } from "@/lib/admin-store";

import { assertAdmin } from "@/lib/auth/assert-admin";

export interface DatabaseSeoRow {
  key: string;
  value: string;
  updated_at?: string | null;
}

const DEFAULT_SEO = INITIAL_ADMIN_SEO;

/**
 * Fetch SEO settings from Supabase (with fallback).
 * cache() dedupes repeat calls within one request (layout, sitemap, robots).
 */
export const getSeoSettings = cache(async (): Promise<AdminSeoSettings> => {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("seo_settings").select("*");

    if (!error && data && data.length > 0) {
      const map = data.reduce((acc: Record<string, string>, row: DatabaseSeoRow) => {
        acc[row.key] = row.value;
        return acc;
      }, {} as Record<string, string>);

      return {
        titleTemplate: map["titleTemplate"] ?? DEFAULT_SEO.titleTemplate,
        metaDescription: map["metaDescription"] ?? DEFAULT_SEO.metaDescription,
        canonicalBaseUrl: map["canonicalBaseUrl"] ?? DEFAULT_SEO.canonicalBaseUrl,
        socialPreviewImage: map["socialPreviewImage"] ?? DEFAULT_SEO.socialPreviewImage,
        // Default true (documented default): only an explicit "false" opts out,
        // so a fresh DB does not silently drop articles from the sitemap.
        excludeDraftsAndArchived: map["excludeDraftsAndArchived"] !== "false",
        robotsTxt: map["robotsTxt"] ?? "",
        redirects: map["redirects"] ? JSON.parse(map["redirects"]) : DEFAULT_SEO.redirects,
      };
    }

    // Fallback to site_settings
    const { data: setting } = await supabase.from("site_settings").select("value").eq("key", "seo_settings_data").single();
    if (setting?.value) {
      const parsed = typeof setting.value === "string" ? JSON.parse(setting.value) : setting.value;
      return { ...DEFAULT_SEO, ...parsed };
    }
  } catch {
    // Graceful fallback
  }

  return DEFAULT_SEO;
});

/** Admin reads distinguish a database error from an actually empty setting. */
export async function getAdminSeoSettings(): Promise<AdminSeoSettings> {
  await assertAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("seo_settings").select("*");
  if (!error) {
    if (!data?.length) return DEFAULT_SEO;
    const map = data.reduce((acc: Record<string, string>, row: DatabaseSeoRow) => { acc[row.key] = row.value; return acc; }, {});
    return {
      titleTemplate: map.titleTemplate ?? DEFAULT_SEO.titleTemplate,
      metaDescription: map.metaDescription ?? DEFAULT_SEO.metaDescription,
      canonicalBaseUrl: map.canonicalBaseUrl ?? DEFAULT_SEO.canonicalBaseUrl,
      socialPreviewImage: map.socialPreviewImage ?? DEFAULT_SEO.socialPreviewImage,
      excludeDraftsAndArchived: map.excludeDraftsAndArchived !== "false",
      robotsTxt: map.robotsTxt ?? "",
      redirects: map.redirects ? JSON.parse(map.redirects) : [],
    };
  }
  if ((error as { code?: string }).code !== "42P01") throw new Error(`Could not load SEO settings: ${error.message}`);
  const { data: setting, error: fallbackError } = await supabase.from("site_settings").select("value").eq("key", "seo_settings_data").maybeSingle();
  if (fallbackError) throw new Error(`Could not load legacy SEO settings: ${fallbackError.message}`);
  if (!setting?.value) return DEFAULT_SEO;
  const parsed = typeof setting.value === "string" ? JSON.parse(setting.value) : setting.value;
  return { ...DEFAULT_SEO, ...parsed } as AdminSeoSettings;
}

/**
 * Save SEO settings to Supabase
 */
export async function saveSeoSettings(seo: Partial<AdminSeoSettings>) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();

    const pairs: { key: string; value: string }[] = [];

    if (seo.titleTemplate !== undefined) pairs.push({ key: "titleTemplate", value: seo.titleTemplate });
    if (seo.metaDescription !== undefined) pairs.push({ key: "metaDescription", value: seo.metaDescription });
    if (seo.canonicalBaseUrl !== undefined) pairs.push({ key: "canonicalBaseUrl", value: seo.canonicalBaseUrl });
    if (seo.socialPreviewImage !== undefined) pairs.push({ key: "socialPreviewImage", value: seo.socialPreviewImage });
    if (seo.excludeDraftsAndArchived !== undefined)
      pairs.push({ key: "excludeDraftsAndArchived", value: String(seo.excludeDraftsAndArchived) });
    if (seo.robotsTxt !== undefined) pairs.push({ key: "robotsTxt", value: seo.robotsTxt });
    if (seo.redirects !== undefined)
      pairs.push({ key: "redirects", value: JSON.stringify(seo.redirects) });

    const results = await Promise.all(
      pairs.map((pair) =>
        supabase.from("seo_settings").upsert(
          { key: pair.key, value: pair.value, updated_at: new Date().toISOString() },
          { onConflict: "key" }
        )
      )
    );

    const failed = results.find((r) => r.error);
    if (failed?.error && (failed.error as { code?: string }).code !== "42P01") throw failed.error;
    if (failed?.error) {
      // Legacy table is used only when the dedicated SEO table is absent.
      const current = await getAdminSeoSettings();
      const updated = { ...current, ...seo };
      const { error: fallbackWriteError } = await supabase.from("site_settings").upsert(
        { key: "seo_settings_data", value: JSON.stringify(updated), updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
      if (fallbackWriteError) throw fallbackWriteError;
    }

    revalidatePath("/admin/seo");
    revalidatePath("/");

    return { success: true };
  } catch (err) {
    console.error("Failed to save SEO settings:", err);
    return { success: false, error: String(err) };
  }
}
