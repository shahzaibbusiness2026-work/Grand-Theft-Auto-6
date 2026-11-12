"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";
import { assertAdmin } from "@/lib/auth/assert-admin";
import { logActivity } from "./activity";

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  count: number;
  description: string;
}

/**
 * Fetch all categories from Supabase with live article counts.
 * Supabase reads are flaky at build time, so each query retries; and if
 * no categories were ever saved in site_settings, the list is derived
 * from the published articles instead of rendering an empty sidebar.
 */
export async function getCategories(): Promise<AdminCategory[]> {
  const supabase = createPublicClient();

  // 1. Fetch saved categories from site_settings (retry on transport errors).
  let saved: AdminCategory[] = [];
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "admin_categories")
        .maybeSingle();
      if (!error) {
        if (
          data?.value &&
          Array.isArray(data.value) &&
          data.value.length > 0
        ) {
          saved = data.value as AdminCategory[];
        }
        break; // no error: the row is genuinely present or genuinely missing
      }
    } catch {
      // transport failure — retry below
    }
    await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
  }

  // 2. Fetch live published-article counts from the articles table.
  //    Only published posts count toward the public-facing numbers.
  let articles: { category?: string | null }[] = [];
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("category")
        .eq("status", "published");
      if (!error && data) {
        articles = data;
        break;
      }
    } catch {
      // transport failure — retry below
    }
    await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
  }

  const counts: Record<string, number> = {};
  articles.forEach((a: { category?: string | null }) => {
    if (a.category) {
      const key = a.category.toLowerCase().trim();
      counts[key] = (counts[key] || 0) + 1;
    }
  });

  // 3. Fallback: no saved list — derive the categories from the published
  //    articles so the sidebar never renders empty while articles exist.
  let categories = saved;
  if (categories.length === 0 && Object.keys(counts).length > 0) {
    const names = Object.keys(counts).sort(
      (a, b) => counts[b] - counts[a] || a.localeCompare(b),
    );
    categories = names.map((name) => ({
      id: `derived-${name}`,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      slug: name,
      count: counts[name],
      description: "",
    }));
  }

  return categories.map((cat) => ({
    ...cat,
    count:
      counts[cat.name.toLowerCase().trim()] ||
      counts[cat.slug.toLowerCase().trim()] ||
      0,
  }));
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
  await assertAdmin();
  const supabase = createAdminClient();
  const { data: setting, error: settingsError } = await supabase.from("site_settings").select("value").eq("key", "admin_categories").maybeSingle();
  if (settingsError) throw new Error(`Could not load categories: ${settingsError.message}`);
  const raw = typeof setting?.value === "string" ? JSON.parse(setting.value) : setting?.value;
  const categories = Array.isArray(raw) ? raw as AdminCategory[] : [];
  const { data: articles, error: articlesError } = await supabase.from("articles").select("category").eq("status", "published");
  if (articlesError) throw new Error(`Could not load category counts: ${articlesError.message}`);
  const counts: Record<string, number> = {};
  (articles || []).forEach((article) => {
    const key = article.category?.toLowerCase().trim();
    if (key) counts[key] = (counts[key] || 0) + 1;
  });
  return categories.map((category) => ({
    ...category,
    count: counts[category.name.toLowerCase().trim()] || counts[category.slug.toLowerCase().trim()] || 0,
  }));
}

/**
 * Save / Update a category in Supabase
 */
export async function saveCategory(category: AdminCategory) {
  try {
    await assertAdmin();
    const current = await getAdminCategories();
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
      .upsert({
        key: "admin_categories",
        value: updated,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;

    await logActivity({
      action: existingIndex >= 0 ? "update" : "create",
      targetType: "category",
      targetId: category.id,
      targetLabel: category.name,
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin/articles");
    revalidatePath("/news");
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
    await assertAdmin();
    const current = await getAdminCategories();
    const deleted = current.find((c) => c.id === id);
    if (!deleted) throw new Error("Category was not found; no change was saved.");
    const updated = current.filter((c) => c.id !== id);

    const adminSupabase = createAdminClient();
    const { error } = await adminSupabase
      .from("site_settings")
      .upsert({
        key: "admin_categories",
        value: updated,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;

    if (deleted) {
      await logActivity({
        action: "delete",
        targetType: "category",
        targetId: id,
        targetLabel: deleted.name,
      });
    }

    revalidatePath("/admin/categories");
    revalidatePath("/news");
    return { success: true };
  } catch (err) {
    console.error("Error deleting category:", err);
    return { success: false, error: String(err) };
  }
}
