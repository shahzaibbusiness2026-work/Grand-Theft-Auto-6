"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/auth/assert-admin";
import { logActivity } from "./activity";

export interface GuideRecord {
  id: string;
  slug?: string;
  title: string;
  description?: string;
  category: string;
  read_time?: string;
  views?: number;
  image?: string;
  featured?: boolean;
  popular?: boolean;
  tag?: string;
  status?: string;
}

export async function getPublicGuides(): Promise<GuideRecord[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("guides")
      .select("*")
      .eq("status", "published")
      .order("views", { ascending: false });
    if (!error && data && data.length > 0) return data as GuideRecord[];
  } catch {
    // Graceful fallback to static guides
  }
  return [];
}

export async function getAdminGuides(): Promise<GuideRecord[]> {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("guides")
      .select("*")
      .order("views", { ascending: false });
    if (!error && data && data.length > 0) return data as GuideRecord[];
  } catch {
    // Graceful fallback
  }
  return [];
}

export async function saveGuide(guide: Partial<GuideRecord> & { title: string }) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const id = guide.id || `guide-${Date.now()}`;
    const slug =
      guide.slug ||
      guide.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const payload = { ...guide, id, slug, updated_at: new Date().toISOString() };
    let { error } = await supabase.from("guides").upsert(payload, { onConflict: "id" });
    if (error?.code === "23505" && !guide.id) {
      // New item whose generated slug is already taken — retry with a suffix.
      const retry = await supabase.from("guides").upsert(
        { ...payload, slug: `${slug}-${Math.random().toString(36).slice(2, 6)}` },
        { onConflict: "id" }
      );
      error = retry.error;
    }
    if (error) throw error;

    await logActivity({
      action: guide.id ? "update" : "create",
      targetType: "guide",
      targetId: id,
      targetLabel: guide.title,
    });

    revalidatePath("/guides");
    revalidatePath("/admin/guides");
    return { success: true, id };
  } catch (err) {
    console.error("Failed to save guide:", err);
    return { success: false, error: String(err) };
  }
}

export async function deleteGuide(id: string) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const { error } = await supabase.from("guides").delete().eq("id", id);
    if (error) throw error;

    await logActivity({ action: "delete", targetType: "guide", targetId: id });

    revalidatePath("/guides");
    revalidatePath("/admin/guides");
    return { success: true };
  } catch (err) {
    console.error("Failed to delete guide:", err);
    return { success: false, error: String(err) };
  }
}
