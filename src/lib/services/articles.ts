"use server";

import { cache } from "react";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/auth/assert-admin";

import { articles as fallbackArticles, Article } from "@/lib/data";
import { INITIAL_ADMIN_ARTICLES, AdminArticle } from "@/lib/admin-store";
import { logActivity } from "./activity";

export interface DatabaseArticleRow {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  excerpt: string;
  content?: string | null;
  category: string;
  tag: string;
  status: string;
  author_name: string;
  author_avatar?: string | null;
  author_role?: string | null;
  cover_image: string;
  read_time?: string | null;
  views?: number | null;
  tags?: string[] | null;
  published_at?: string | null;
  scheduled_for?: string | null;
  // SEO columns added by supabase/03_content_seo_upgrade.sql — the service
  // degrades gracefully when the migration has not been applied yet.
  seo_title?: string | null;
  seo_description?: string | null;
  canonical_url?: string | null;
  og_image?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

/**
 * The articles table only gains the SEO columns after migration 03 runs.
 * Detect once per server process and skip those fields until then, so
 * saving never hard-fails on a not-yet-migrated database.
 */
let seoColumnsMissing = false;
const SEO_FIELDS = ["seo_title", "seo_description", "canonical_url", "og_image"] as const;

function rowToArticle(row: DatabaseArticleRow): Article {
  return {
    title: row.title,
    excerpt: row.excerpt,
    date: row.published_at
      ? new Date(row.published_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Recent",
    read: row.read_time || "4 min read",
    img: row.cover_image || "/img/hero-dark.jpg",
    tag: row.tag || row.category || "News",
    slug: row.slug,
    category: row.category,
  };
}

function rowToAdminArticle(row: DatabaseArticleRow): AdminArticle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle || undefined,
    excerpt: row.excerpt,
    content: row.content || "",
    status: (row.status as AdminArticle["status"]) || "published",
    category: row.category,
    author: {
      name: row.author_name,
      avatar: row.author_avatar || "/img/avatar-admin.svg",
      role: row.author_role || "Staff Writer",
    },
    publishedAt: row.published_at || undefined,
    scheduledFor: row.scheduled_for || undefined,
    updatedAt: row.updated_at || new Date().toISOString(),
    views: row.views || 0,
    readTime: row.read_time || "4 min read",
    tags: row.tags || ["GTA 6"],
    coverImage: row.cover_image,
    seoTitle: row.seo_title || undefined,
    seoDescription: row.seo_description || undefined,
    canonicalUrl: row.canonical_url || undefined,
    ogImage: row.og_image || undefined,
    revisions: [],
  };
}

/**
 * Fetch published articles for the public frontend.
 *
 * Fallback semantics: static content is used ONLY when the database is
 * unreachable. An empty result is returned as an empty list — the CMS owns
 * what is published, so "admin unpublished everything" must not resurrect
 * hardcoded articles.
 */
export const getPublicArticles = cache(async (): Promise<Article[]> => {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (!error && data) {
      return (data as DatabaseArticleRow[]).map(rowToArticle);
    }
    console.error("getPublicArticles: database error", error?.message);
  } catch {
    // Connection failure — fall back to bundled content
  }

  return fallbackArticles;
});

/**
 * Fetch one published article (full row) by slug for the public detail page.
 * Returns null when not found or not published (callers should 404).
 */
export async function getPublicArticleBySlug(slug: string): Promise<DatabaseArticleRow | null> {
  if (!slug) return null;
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (!error && data) return data as DatabaseArticleRow;
    if (error) console.error("getPublicArticleBySlug: database error", error.message);
  } catch {
    // database unreachable
  }
  return null;
}

/**
 * Fetch a single article (any status) for the admin editor. Service-role
 * client: drafts are visible to authenticated admins only.
 */
export async function getAdminArticleById(id: string): Promise<AdminArticle | null> {
  if (!id || id === "new") return null;
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) return rowToAdminArticle(data as DatabaseArticleRow);
    if (error) console.error("getAdminArticleById: database error", error.message);
  } catch (err) {
    console.error("getAdminArticleById:", err);
  }
  return null;
}

/**
 * Fetch all articles for the Admin Dashboard.
 * DB-authoritative: an empty table returns an empty list so the admin sees
 * the true state instead of ghost demo rows.
 */
export async function getAdminArticles(): Promise<AdminArticle[]> {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("updated_at", { ascending: false });

    if (!error && data) {
      return (data as DatabaseArticleRow[]).map(rowToAdminArticle);
    }
    console.error("getAdminArticles: database error", error?.message);
  } catch {
    // Connection failure — fall back to bundled content
  }

  return INITIAL_ADMIN_ARTICLES;
}

/**
 * Save or update an article in Supabase.
 */
export async function saveArticle(article: Partial<AdminArticle> & { title: string; excerpt: string }) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();

    const id = article.id || `art-${Date.now()}`;
    const slug =
      article.slug ||
      article.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const payload: Record<string, unknown> = {
      id,
      slug,
      title: article.title,
      subtitle: article.subtitle || null,
      excerpt: article.excerpt,
      content: article.content || "",
      category: article.category || "News",
      tag: article.tags?.[0] || "Official",
      status: article.status || "published",
      author_name: article.author?.name || "Atlas Editorial",
      author_avatar: article.author?.avatar || "/img/avatar-admin.svg",
      author_role: article.author?.role || "Staff Writer",
      cover_image: article.coverImage || "/img/hero-dark.jpg",
      read_time: article.readTime || "4 min",
      views: article.views || 0,
      tags: article.tags || ["GTA 6"],
      updated_at: new Date().toISOString(),
    };

    if (article.status === "published" && !article.publishedAt) {
      payload.published_at = new Date().toISOString();
    }
    if (article.scheduledFor) {
      payload.scheduled_for = article.scheduledFor;
    }

    if (!seoColumnsMissing) {
      payload.seo_title = article.seoTitle || null;
      payload.seo_description = article.seoDescription || null;
      payload.canonical_url = article.canonicalUrl || null;
      payload.og_image = article.ogImage || null;
    }

    let error: { message: string; code?: string } | null = null;
    {
      const res = await supabase.from("articles").upsert(payload, { onConflict: "id" });
      error = res.error;
      // Migration 03 not applied yet → retry once without the SEO columns.
      if (error && (error as { code?: string }).code === "PGRST204") {
        seoColumnsMissing = true;
        for (const f of SEO_FIELDS) delete payload[f];
        const retry = await supabase.from("articles").upsert(payload, { onConflict: "id" });
        error = retry.error;
      }
    }

    if (error) {
      // Duplicate slug (unique constraint) → make the slug unique and retry.
      if (error.code === "23505" || /duplicate key/i.test(error.message || "")) {
        const uniqueSlug = `${slug}-${Date.now().toString(36)}`;
        const retry = await supabase
          .from("articles")
          .upsert({ ...payload, slug: uniqueSlug }, { onConflict: "id" });
        if (retry.error) throw retry.error;
        await logActivity({
          action: article.id ? "update" : "create",
          targetType: "article",
          targetId: id,
          targetLabel: article.title,
          detail: { status: payload.status },
        });
        revalidatePath("/news");
        revalidatePath("/");
        revalidatePath("/admin/articles");
        return { success: true, id, slug: uniqueSlug };
      }
      throw error;
    }

    await logActivity({
      action: article.id ? "update" : "create",
      targetType: "article",
      targetId: id,
      targetLabel: article.title,
      detail: { status: payload.status },
    });

    revalidatePath("/news");
    revalidatePath("/");
    revalidatePath("/admin/articles");

    return { success: true, id, slug };
  } catch (err) {
    console.error("Failed to save article:", err);
    return { success: false, error: String(err) };
  }
}

/**
 * Delete an article from Supabase
 */
export async function deleteArticle(id: string) {
  try {
    await assertAdmin();
    const supabase = createAdminClient();
    const { error } = await supabase.from("articles").delete().eq("id", id);

    if (error) throw error;

    await logActivity({ action: "delete", targetType: "article", targetId: id });

    revalidatePath("/news");
    revalidatePath("/");
    revalidatePath("/admin/articles");

    return { success: true };
  } catch (err) {
    console.error("Failed to delete article:", err);
    return { success: false, error: String(err) };
  }
}
