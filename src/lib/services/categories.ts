"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerSupabase } from "@/lib/supabase/server";

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  count: number;
  description: string;
}

const DEFAULT_CATEGORIES: AdminCategory[] = [
  { id: "cat-1", name: "News", slug: "news", count: 18, description: "Official press releases, release date updates, and studio announcements." },
  { id: "cat-2", name: "Analysis", slug: "analysis", count: 42, description: "In-depth research, leaked trailer breakdowns, and lore analysis." },
  { id: "cat-3", name: "Vehicles", slug: "vehicles", count: 32, description: "Vehicle breakdowns, manufacturer specs, and performance comparisons." },
  { id: "cat-4", name: "Gameplay", slug: "gameplay", count: 24, description: "Dual-protagonist mechanics, weapon handling, and combat guides." },
  { id: "cat-5", name: "Map", slug: "map", count: 15, description: "Leonida geography, Vice City districts, and coordinate mapping." },
];

/**
 * Fetch all categories from Supabase with live article counts
 */
export async function getCategories(): Promise<AdminCategory[]> {
  try {
    const supabase = await createServerSupabase();

    // 1. Fetch saved categories from site_settings
    const { data: settingData } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "admin_categories")
      .maybeSingle();

    let categories: AdminCategory[] = DEFAULT_CATEGORIES;
    if (settingData && settingData.value && Array.isArray(settingData.value) && settingData.value.length > 0) {
      categories = settingData.value as AdminCategory[];
    }

    // 2. Fetch live article counts from Supabase articles table
    const { data: articles } = await supabase
      .from("articles")
      .select("category");

    if (articles && articles.length > 0) {
      const counts: Record<string, number> = {};
      articles.forEach((a: { category?: string | null }) => {
        if (a.category) {
          const key = a.category.toLowerCase().trim();
          counts[key] = (counts[key] || 0) + 1;
        }
      });

      categories = categories.map((cat) => ({
        ...cat,
        count: counts[cat.name.toLowerCase().trim()] || counts[cat.slug.toLowerCase().trim()] || 0,
      }));
    }

    return categories;
  } catch (err) {
    console.error("Error fetching categories:", err);
    return DEFAULT_CATEGORIES;
  }
}

/**
 * Save / Update a category in Supabase
 */
export async function saveCategory(category: AdminCategory) {
  try {
    const current = await getCategories();
    const existingIndex = current.findIndex((c) => c.id === category.id);
    let updated: AdminCategory[];

    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = { ...updated[existingIndex], ...category };
    } else {
      updated = [...current, category];
    }

    const adminSupabase = createAdminClient();
    const { error } = await adminSupabase
      .from("site_settings")
      .upsert({ key: "admin_categories", value: updated, updated_at: new Date().toISOString() });

    if (error) throw error;

    revalidatePath("/admin/categories");
    revalidatePath("/admin/articles");
    return { success: true, id: category.id };
  } catch (err) {
    console.error("Error saving category:", err);
    return { success: false, error: String(err) };
  }
}

/**
 * Delete a category from Supabase
 */
export async function deleteCategory(id: string) {
  try {
    const current = await getCategories();
    const updated = current.filter((c) => c.id !== id);

    const adminSupabase = createAdminClient();
    const { error } = await adminSupabase
      .from("site_settings")
      .upsert({ key: "admin_categories", value: updated, updated_at: new Date().toISOString() });

    if (error) throw error;

    revalidatePath("/admin/categories");
    return { success: true };
  } catch (err) {
    console.error("Error deleting category:", err);
    return { success: false, error: String(err) };
  }
}
