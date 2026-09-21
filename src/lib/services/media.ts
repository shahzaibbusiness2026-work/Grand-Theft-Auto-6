"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerSupabase } from "@/lib/supabase/client";

import { INITIAL_ADMIN_MEDIA, AdminMediaAsset } from "@/lib/admin-store";

export interface DatabaseMediaRow {
  id: string;
  filename: string;
  storage_path: string;
  public_url: string;
  dimensions?: string | null;
  file_size?: string | null;
  type: string;
  alt_text?: string | null;
  credit?: string | null;
  license?: string | null;
  used_by?: any;
  uploaded_at?: string | null;
}

function rowToMediaAsset(row: DatabaseMediaRow): AdminMediaAsset {
  return {
    id: row.id,
    filename: row.filename,
    dimensions: row.dimensions || "1920 × 1080",
    fileSize: row.file_size || "500 KB",
    type: (row.type as AdminMediaAsset["type"]) || "Image",
    url: row.public_url,
    altText: row.alt_text || "",
    credit: row.credit || "Atlas Staff",
    license: (row.license as AdminMediaAsset["license"]) || "Internal illustration",
    usedBy: Array.isArray(row.used_by) ? row.used_by : [],

    uploadedAt: row.uploaded_at
      ? new Date(row.uploaded_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Recent",
  };
}

/**
 * Fetch all media assets from Supabase
 */
export async function getMediaAssets(): Promise<AdminMediaAsset[]> {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("media_assets")
      .select("*")
      .order("uploaded_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return (data as DatabaseMediaRow[]).map(rowToMediaAsset);
    }
  } catch {
    // fallback
  }

  return INITIAL_ADMIN_MEDIA;
}

/**
 * Save or update media asset metadata
 */
export async function saveMediaAsset(asset: Partial<AdminMediaAsset> & { id: string; filename: string }) {
  try {
    const supabase = createAdminClient();

    const payload: Partial<DatabaseMediaRow> = {
      id: asset.id,
      filename: asset.filename,
      dimensions: asset.dimensions || "1920 × 1080",
      file_size: asset.fileSize || "500 KB",
      type: asset.type || "Image",
      public_url: asset.url || "/img/hero-dark.jpg",
      storage_path: asset.url || "",
      alt_text: asset.altText || "",
      credit: asset.credit || "",
      license: asset.license || "Internal illustration",
      used_by: asset.usedBy || [],
      uploaded_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("media_assets").upsert(payload, { onConflict: "id" });
    if (error) throw error;

    revalidatePath("/admin/media");
    return { success: true, id: asset.id };
  } catch (err) {
    console.error("Failed to save media asset:", err);
    return { success: false, error: String(err) };
  }
}

/**
 * Delete a media asset
 */
export async function deleteMediaAsset(id: string) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("media_assets").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/media");
    return { success: true };
  } catch (err) {
    console.error("Failed to delete media asset:", err);
    return { success: false, error: String(err) };
  }
}
