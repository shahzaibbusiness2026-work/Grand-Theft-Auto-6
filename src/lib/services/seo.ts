"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerSupabase } from "@/lib/supabase/client";

import { INITIAL_ADMIN_SEO, AdminSeoSettings } from "@/lib/admin-store";

export interface DatabaseSeoRow {
  key: string;
  value: string;
  updated_at?: string | null;
}

const DEFAULT_SEO = INITIAL_ADMIN_SEO;

/**
 * Fetch SEO settings from Supabase (with fallback)
 */
export async function getSeoSettings(): Promise<AdminSeoSettings> {
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
        excludeDraftsAndArchived: map["excludeDraftsAndArchived"] === "true",
        redirects: map["redirects"] ? JSON.parse(map["redirects"]) : DEFAULT_SEO.redirects,
      };
    }
  } catch {
    // Graceful fallback
  }

  return DEFAULT_SEO;
}

/**
 * Save SEO settings to Supabase
 */
export async function saveSeoSettings(seo: Partial<AdminSeoSettings>) {
  try {
    const supabase = createAdminClient();

    const pairs: { key: string; value: string }[] = [];

    if (seo.titleTemplate !== undefined) pairs.push({ key: "titleTemplate", value: seo.titleTemplate });
    if (seo.metaDescription !== undefined) pairs.push({ key: "metaDescription", value: seo.metaDescription });
    if (seo.canonicalBaseUrl !== undefined) pairs.push({ key: "canonicalBaseUrl", value: seo.canonicalBaseUrl });
    if (seo.socialPreviewImage !== undefined) pairs.push({ key: "socialPreviewImage", value: seo.socialPreviewImage });
    if (seo.excludeDraftsAndArchived !== undefined)
      pairs.push({ key: "excludeDraftsAndArchived", value: String(seo.excludeDraftsAndArchived) });
    if (seo.redirects !== undefined)
      pairs.push({ key: "redirects", value: JSON.stringify(seo.redirects) });

    await Promise.all(
      pairs.map((pair) =>
        supabase.from("seo_settings").upsert(
          { key: pair.key, value: pair.value, updated_at: new Date().toISOString() },
          { onConflict: "key" }
        )
      )
    );

    revalidatePath("/admin/seo");
    revalidatePath("/");

    return { success: true };
  } catch (err) {
    console.error("Failed to save SEO settings:", err);
    return { success: false, error: String(err) };
  }
}
