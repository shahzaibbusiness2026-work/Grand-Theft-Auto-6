"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerSupabase } from "@/lib/supabase/server";

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

import { assertAdmin } from "@/lib/auth/assert-admin";
import { logActivity } from "./activity";

/* ------------------------------------------------------------------ */
/* Real Supabase Storage upload                                        */
/* ------------------------------------------------------------------ */

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME_PREFIXES = ["image/", "video/"];

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
    const mime = file.type || "";
    if (!ALLOWED_MIME_PREFIXES.some((p) => mime.startsWith(p))) {
      return { success: false as const, error: "Only image and video files are allowed." };
    }

    const clean = sanitizeFileName(file.name || "upload");
    const ext = clean.includes(".") ? clean.slice(clean.lastIndexOf(".")) : "";
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

    const saved = await saveMediaAsset({ ...asset, id, filename: clean });
    if (!saved.success) throw new Error(saved.error || "Failed to save media metadata.");

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
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("media_assets")
      .select("*")
      .order("uploaded_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return (data as DatabaseMediaRow[]).map(rowToMediaAsset);
    }

    // Fallback to site_settings persistence
    const { data: setting } = await supabase.from("site_settings").select("value").eq("key", "media_assets_data").single();
    if (setting?.value) {
      const parsed = typeof setting.value === "string" ? JSON.parse(setting.value) : setting.value;
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as AdminMediaAsset[];
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
    await assertAdmin();
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
    if (error) {
      // Table doesn't exist, persist in site_settings
      const current = await getMediaAssets();
      const idx = current.findIndex((m) => m.id === asset.id);
      const fullAsset: AdminMediaAsset = {
        id: asset.id,
        filename: asset.filename,
        dimensions: asset.dimensions || "1920 × 1080",
        fileSize: asset.fileSize || "500 KB",
        type: asset.type || "Image",
        url: asset.url || "/img/hero-dark.jpg",
        altText: asset.altText || "",
        credit: asset.credit || "Atlas Staff",
        license: asset.license || "Internal illustration",
        usedBy: asset.usedBy || [],
        uploadedAt: "Just now",
      };
      const updated = idx >= 0
        ? current.map((m, i) => (i === idx ? { ...m, ...fullAsset } : m))
        : [fullAsset, ...current];
      await supabase.from("site_settings").upsert(
        { key: "media_assets_data", value: JSON.stringify(updated), updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
    }

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
    const { data: row } = await supabase
      .from("media_assets")
      .select("storage_path, public_url, filename")
      .eq("id", id)
      .maybeSingle();

    const storagePath = (row as { storage_path?: string } | null)?.storage_path || "";
    if (storagePath && !storagePath.startsWith("/") && !storagePath.startsWith("http")) {
      // Relative path → object inside the media bucket.
      const { error: rmError } = await supabase.storage.from("media").remove([storagePath]);
      if (rmError) console.warn("Storage object removal failed:", rmError.message);
    }

    const { error } = await supabase.from("media_assets").delete().eq("id", id);
    if (error) {
      // Table doesn't exist, update in site_settings
      const current = await getMediaAssets();
      const updated = current.filter((m) => m.id !== id);
      await supabase.from("site_settings").upsert(
        { key: "media_assets_data", value: JSON.stringify(updated), updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
    }

    await logActivity({ action: "delete", targetType: "media", targetId: id, targetLabel: (row as { filename?: string } | null)?.filename });

    revalidatePath("/admin/media");
    return { success: true };
  } catch (err) {
    console.error("Failed to delete media asset:", err);
    return { success: false, error: String(err) };
  }
}
