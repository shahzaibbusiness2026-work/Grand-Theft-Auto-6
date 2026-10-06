"use server";

import { cache } from "react";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerSupabase } from "@/lib/supabase/server";

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
    const supabase = await createServerSupabase();
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

    const hasError = results.some((r) => r.error);
    if (hasError) {
      // Table missing, persist to site_settings
      const current = await getSeoSettings();
      const updated = { ...current, ...seo };
      await supabase.from("site_settings").upsert(
        { key: "seo_settings_data", value: JSON.stringify(updated), updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
    }

    revalidatePath("/admin/seo");
    revalidatePath("/");

    return { success: true };
  } catch (err) {
    console.error("Failed to save SEO settings:", err);
    return { success: false, error: String(err) };
  }
}
