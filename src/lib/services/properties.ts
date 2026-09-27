"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/auth/assert-admin";
import { logActivity } from "./activity";

export interface PropertyRecord {
  id: string;
  slug?: string;
  name: string;
  district?: string;
  type: string;
  price?: number | null;
  price_display?: string;
  garage_capacity?: number;
  passive_income_per_hour?: number | null;
  passive_income_display?: string;
  features?: string[];
  upgrades?: string[];
  requirements?: string[];
  confidence?: string;
  source?: string;
  img?: string;
  description?: string;
  status?: string;
}

export async function getPublicProperties(): Promise<PropertyRecord[]> {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("status", "published")
      .order("price", { ascending: false, nullsFirst: false });
    if (!error && data && data.length > 0) return data as PropertyRecord[];
  } catch {
    // Graceful fallback to canonical data
  }
  return [];
}

export async function getAdminProperties(): Promise<PropertyRecord[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("updated_at", { ascending: false });
    if (!error && data && data.length > 0) return data as PropertyRecord[];
  } catch {
    // Graceful fallback
  }
  return [];
}

export async function saveProperty(property: Partial<PropertyRecord> & { name: string }) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const id = property.id || `prop-${Date.now()}`;
    const slug =
      property.slug ||
      property.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const { error } = await supabase.from("properties").upsert(
      {
        ...property,
        id,
        slug,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
    if (error) throw error;

    await logActivity({
      action: property.id ? "update" : "create",
      targetType: "property",
      targetId: id,
      targetLabel: property.name,
    });

    revalidatePath("/properties");
    revalidatePath("/admin/properties");
    return { success: true, id };
  } catch (err) {
    console.error("Failed to save property:", err);
    return { success: false, error: String(err) };
  }
}

export async function deleteProperty(id: string) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) throw error;

    await logActivity({ action: "delete", targetType: "property", targetId: id });

    revalidatePath("/properties");
    revalidatePath("/admin/properties");
    return { success: true };
  } catch (err) {
    console.error("Failed to delete property:", err);
    return { success: false, error: String(err) };
  }
}
