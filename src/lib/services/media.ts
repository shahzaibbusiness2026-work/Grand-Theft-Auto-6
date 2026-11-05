"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminMediaAsset } from "@/lib/admin-store";

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
    dimensions: row.dimensions || "",
    fileSize: row.file_size || "",
    type: (row.type as AdminMediaAsset["type"]) || "Image",
    url: row.public_url,
    altText: row.alt_text || "",
    credit: row.credit || "",
    license: (row.license as AdminMediaAsset["license"]) || "Internal illustration",
    usedBy: Array.isArray(row.used_by) ? row.used_by : [],

    uploadedAt: row.uploaded_at
      ? new Date(row.uploaded_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "",
  };
}

import { assertAdmin } from "@/lib/auth/assert-admin";
import { logActivity } from "./activity";
import { mediaUploadType } from "@/lib/media-validation";

/* ------------------------------------------------------------------ */
/* Real Supabase Storage upload                                        */
/* ------------------------------------------------------------------ */

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

function sanitizeFileName(name: string): string {
  const base = name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return base || `file-${Date.now()}`;
}

/**
 * Uploads a file to the public `media` bucket via the service-role client
 * and persists the asset metadata. The bucket is created by
 * supabase/01_schema_v2_upgrade.sql; its objects are publicly readable and
 * writable only through the server (no anon write policies).
 */
export async function uploadMediaFile(formData: FormData) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();

    const file = formData.get("file");
    if (!(file instanceof File)) {
      return { success: false as const, error: "No file was provided." };
    }
    if (file.size === 0) {
      return { success: false as const, error: "The selected file is empty." };
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return { success: false as const, error: "File is too large (max 10 MB)." };
    }
    const clean = sanitizeFileName(file.name || "upload");
    const ext = clean.includes(".") ? clean.slice(clean.lastIndexOf(".")) : "";
    const mime = mediaUploadType(clean, file.type, new Uint8Array(await file.slice(0, 64).arrayBuffer()));
    if (!mime) {
      return {
        success: false as const,
        error: "Use a valid JPG, PNG, WebP, GIF, AVIF, MP4, WebM or MOV file. Its extension, content type and file signature must match.",
      };
    }
    const path = `uploads/${Date.now()}-${sanitizeFileName(clean.slice(0, clean.length - ext.length))}${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(path, file, { contentType: mime || "application/octet-stream", upsert: false });
    if (uploadError) throw uploadError;

    const { data: publicData } = supabase.storage.from("media").getPublicUrl(path);
    const publicUrl = publicData?.publicUrl || "";

    const id = `med-${Date.now()}`;
    const altText = String(formData.get("altText") || "");
    const credit = String(formData.get("credit") || "");
    const asset: AdminMediaAsset = {
      id,
      filename: clean,
      dimensions: "—",
      fileSize: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      type: mime.startsWith("video/") ? "Video" : "Image",
      url: publicUrl,
      altText,
      credit,
      license: (String(formData.get("license") || "Internal illustration") as AdminMediaAsset["license"]),
      usedBy: [],
      uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    const saved = await saveMediaAsset({ ...asset, id, filename: clean, storagePath: path });
    if (!saved.success) {
      await supabase.storage.from("media").remove([path]);
      throw new Error(saved.error || "Failed to save media metadata.");
    }

    await logActivity({
      action: "create",
      targetType: "media",
      targetId: id,
      targetLabel: clean,
      detail: { storage_path: path },
    });

    revalidatePath("/admin/media");
    return { success: true as const, id, url: publicUrl, asset };
  } catch (err) {
    console.error("Media upload failed:", err);
    return { success: false as const, error: String(err instanceof Error ? err.message : err) };
  }
}

/**
 * Fetch all media assets from Supabase
 */
export async function getMediaAssets(): Promise<AdminMediaAsset[]> {
  await assertAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("media_assets").select("*").order("uploaded_at", { ascending: false });
  if (!error) return (data as DatabaseMediaRow[]).map(rowToMediaAsset);
  if ((error as { code?: string }).code !== "42P01") {
    throw new Error(`Could not load media: ${error.message}`);
  }
  const { data: setting, error: settingError } = await supabase
    .from("site_settings").select("value").eq("key", "media_assets_data").maybeSingle();
  if (settingError) throw new Error(`Could not load legacy media: ${settingError.message}`);
  if (!setting?.value) return [];
  const parsed = typeof setting.value === "string" ? JSON.parse(setting.value) : setting.value;
  return Array.isArray(parsed) ? parsed as AdminMediaAsset[] : [];
}

/**
 * Save or update media asset metadata
 */
export async function saveMediaAsset(asset: Partial<AdminMediaAsset> & { id: string; filename: string; storagePath?: string }) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();

    let storagePath = asset.storagePath;
    if (storagePath === undefined) {
      const { data: existing, error: lookupError } = await supabase.from("media_assets").select("storage_path").eq("id", asset.id).maybeSingle();
      if (lookupError) throw lookupError;
      storagePath = existing?.storage_path || "";
    }

    const payload: Partial<DatabaseMediaRow> = {
      id: asset.id,
      filename: asset.filename,
      dimensions: asset.dimensions || "",
      file_size: asset.fileSize || "",
      type: asset.type || "Image",
      public_url: asset.url || "",
      storage_path: storagePath,
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
 * Delete a media asset (and its underlying storage object when it lives in
 * the `media` bucket).
 */
export async function deleteMediaAsset(id: string) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();

    // Resolve the storage path first so the file can be removed too.
    const { data: row, error: lookupError } = await supabase
      .from("media_assets")
      .select("storage_path, public_url, filename")
      .eq("id", id)
      .maybeSingle();
    if (lookupError) throw lookupError;

    if (!row) throw new Error("Media asset was not found.");
    const storagePath = (row as { storage_path?: string } | null)?.storage_path || "";
    const { data: deleted, error } = await supabase.from("media_assets").delete().eq("id", id).select("id");
    if (error) throw error;
    if (!deleted?.length) throw new Error("Media asset was not deleted.");

    if (storagePath && !storagePath.startsWith("/") && !storagePath.startsWith("http")) {
      const { error: rmError } = await supabase.storage.from("media").remove([storagePath]);
      if (rmError) {
        revalidatePath("/admin/media");
        return { success: true, warning: `Asset record deleted, but its storage object remains: ${rmError.message}` };
      }
    }

    await logActivity({ action: "delete", targetType: "media", targetId: id, targetLabel: (row as { filename?: string } | null)?.filename });

    revalidatePath("/admin/media");
    return { success: true };
  } catch (err) {
    console.error("Failed to delete media asset:", err);
    return { success: false, error: String(err) };
  }
}
