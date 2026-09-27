"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/auth/assert-admin";
import { logActivity } from "./activity";

export interface CollectibleRecord {
  id: string;
  slug?: string;
  title: string;
  category: string;
  district?: string;
  reward?: string;
  requirements?: string;
  description?: string;
  guide_tip?: string;
  coord_top?: string;
  coord_left?: string;
  confidence?: string;
  source?: string;
  img?: string;
  status?: string;
}

export async function getPublicCollectibles(): Promise<CollectibleRecord[]> {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("collectibles")
      .select("*")
      .eq("status", "published")
      .order("category", { ascending: true });
    if (!error && data && data.length > 0) return data as CollectibleRecord[];
  } catch {
    // Graceful fallback to canonical data
  }
  return [];
}

export async function getAdminCollectibles(): Promise<CollectibleRecord[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("collectibles")
      .select("*")
      .order("updated_at", { ascending: false });
    if (!error && data && data.length > 0) return data as CollectibleRecord[];
  } catch {
    // Graceful fallback
  }
  return [];
}

export async function saveCollectible(item: Partial<CollectibleRecord> & { title: string }) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const id = item.id || `col-${Date.now()}`;
    const slug =
      item.slug ||
      item.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const { error } = await supabase.from("collectibles").upsert(
      {
        ...item,
        id,
        slug,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
    if (error) throw error;

    await logActivity({
      action: item.id ? "update" : "create",
      targetType: "collectible",
      targetId: id,
      targetLabel: item.title,
    });

    revalidatePath("/collectibles");
    revalidatePath("/admin/collectibles");
    return { success: true, id };
  } catch (err) {
    console.error("Failed to save collectible:", err);
    return { success: false, error: String(err) };
  }
}

export async function deleteCollectible(id: string) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const { error } = await supabase.from("collectibles").delete().eq("id", id);
    if (error) throw error;

    await logActivity({ action: "delete", targetType: "collectible", targetId: id });

    revalidatePath("/collectibles");
    revalidatePath("/admin/collectibles");
    return { success: true };
  } catch (err) {
    console.error("Failed to delete collectible:", err);
    return { success: false, error: String(err) };
  }
}
