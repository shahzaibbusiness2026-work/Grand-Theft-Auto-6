"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
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
    const supabase = await createServerSupabase();
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

    const { error } = await supabase.from("guides").upsert(
      {
        ...guide,
        id,
        slug,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
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
