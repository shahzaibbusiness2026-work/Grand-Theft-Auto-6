"use server";
import {
  readingTime,
  publicationImage,
  editorialProblems,
} from "@/lib/editorial-quality";

import { cache } from "react";
import { revalidatePath, revalidateTag } from "next/cache";
import { PUBLISHED_ARTICLES_TAG } from "@/lib/article-cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";
import { assertAdmin } from "@/lib/auth/assert-admin";

import type { Article } from "@/lib/data";
import { AdminArticle } from "@/lib/admin-store";
import { logActivity } from "./activity";
import { randomUUID } from "crypto";

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
const SEO_FIELDS = [
  "seo_title",
  "seo_description",
  "canonical_url",
  "og_image",
] as const;

function isSafeHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && !!url.hostname && !url.username && !url.password;
  } catch {
    return false;
  }
}

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
    read: readingTime(row.content || row.excerpt || ""),
    img: publicationImage(row.cover_image, row.slug),
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
    readTime: row.read_time || readingTime(row.content || row.excerpt || ""),
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
    const supabase = createPublicClient(PUBLISHED_ARTICLES_TAG);
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .order("id", { ascending: true });

    if (!error && data) {
      return (data as DatabaseArticleRow[]).map(rowToArticle);
    }
    console.error("getPublicArticles: database error", error?.message);
  } catch {
    // Connection failure — fall back to bundled content
  }

  return [];
});

/**
 * Fetch one published article (full row) by slug for the public detail page.
 * Returns null when not found or not published (callers should 404).
 */
export const getPublicArticleBySlug = cache(
  async (slug: string): Promise<DatabaseArticleRow | null> => {
    if (!slug) return null;
    try {
      const supabase = createPublicClient(PUBLISHED_ARTICLES_TAG);
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .order("id", { ascending: true })
        .maybeSingle();

      if (error) throw new Error("Article data unavailable");
      if (data) return data as DatabaseArticleRow;
    } catch {
      // A transient backend failure is not evidence that a published URL is gone.
      // ISR keeps the prior successful render when regeneration throws.
      throw new Error("Article data unavailable");
    }
    return null;
  },
);

/**
 * Fetch a single article (any status) for the admin editor. Service-role
 * client: drafts are visible to authenticated admins only.
 */
export async function getAdminArticleById(
  id: string,
): Promise<AdminArticle | null> {
  if (!id || id === "new") return null;
  await assertAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("getAdminArticleById: database error", error.message);
    throw new Error("Unable to load this article from the database.");
  }
  return data ? rowToAdminArticle(data as DatabaseArticleRow) : null;
}

/**
 * Fetch all articles for the Admin Dashboard.
 * DB-authoritative: an empty table returns an empty list so the admin sees
 * the true state instead of ghost demo rows.
 */
export async function getAdminArticles(): Promise<AdminArticle[]> {
  await assertAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) {
    console.error("getAdminArticles: database error", error.message);
    throw new Error("Unable to load articles from the database.");
  }
  return (data as DatabaseArticleRow[]).map(rowToAdminArticle);
}

/**
 * Save or update an article in Supabase.
 */
export async function saveArticle(
  article: Partial<AdminArticle> & { title: string; excerpt: string },
) {
  try {
    await assertAdmin();
    if ((article.status || "published") === "published") {
      if (!article.content?.trim())
        return {
          success: false,
          error: "Add an article body before publishing.",
        };
      const issues = editorialProblems(article.content);
      if (issues.length) return { success: false, error: issues.join(" ") };
    }
    if (article.status === "scheduled") {
      const scheduledFor = article.scheduledFor ? new Date(article.scheduledFor) : null;
      if (!scheduledFor || Number.isNaN(scheduledFor.getTime())) {
        return { success: false, error: "Choose a valid date and time before scheduling this article." };
      }
      if (scheduledFor.getTime() <= Date.now()) {
        return { success: false, error: "Choose a future date and time for the scheduled article." };
      }
    }
    const supabase = createAdminClient();

    const id = article.id || `art-${randomUUID()}`;
    const slug =
      article.slug ||
      article.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    if (!slug) return { success: false, error: "Add a title or URL slug containing letters or numbers." };

    const canonicalUrl = article.canonicalUrl?.trim();
    if (canonicalUrl && !isSafeHttpUrl(canonicalUrl)) {
      return { success: false, error: "Canonical URL must be a valid absolute HTTP or HTTPS URL." };
    }
    const ogImage = article.ogImage?.trim();
    if (ogImage && ((ogImage.startsWith("/") && ogImage.startsWith("//")) || (!ogImage.startsWith("/") && !isSafeHttpUrl(ogImage)))) {
      return { success: false, error: "Open Graph image must be a site path or an absolute HTTP/HTTPS URL." };
    }

    const payload: Record<string, unknown> = {
      id,
      slug,
      title: article.title,
      subtitle: article.subtitle || null,
      excerpt: article.excerpt,
      content: article.content || "",
      category: article.category || "News",
      tag: article.tags?.[0] || "News",
      status: article.status || "published",
      author_name: article.author?.name || "Taish Team",
      author_avatar: article.author?.avatar || "/img/avatar-admin.svg",
      author_role: article.author?.role || "Staff Writer",
      cover_image: article.coverImage || "/img/hero-dark.jpg",
      read_time: readingTime(article.content || ""),
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
      const res = await supabase
        .from("articles")
        .upsert(payload, { onConflict: "id" });
      error = res.error;
      // Migration 03 not applied yet → retry once without the SEO columns.
      if (error && (error as { code?: string }).code === "PGRST204") {
        seoColumnsMissing = true;
        if (article.seoTitle?.trim() || article.seoDescription?.trim() || canonicalUrl || ogImage) {
          return {
            success: false,
            error: "Article SEO fields are not installed in the database yet. Apply supabase/03_content_seo_upgrade.sql, then save again.",
          };
        }
        for (const f of SEO_FIELDS) delete payload[f];
        const retry = await supabase
          .from("articles")
          .upsert(payload, { onConflict: "id" });
        error = retry.error;
      }
    }

    if (error) {
      // Duplicate slug (unique constraint) → make the slug unique and retry.
      if (
        error.code === "23505" ||
        /duplicate key/i.test(error.message || "")
      ) {
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
        revalidateTag(PUBLISHED_ARTICLES_TAG);
        revalidatePath("/news");
        revalidatePath("/news/[slug]", "page");
        revalidatePath("/sitemap.xml");
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

    revalidateTag(PUBLISHED_ARTICLES_TAG);
    revalidatePath("/news");
    revalidatePath("/news/[slug]", "page");
    revalidatePath("/sitemap.xml");
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
    if (!id?.trim()) return { success: false, error: "Article id is required." };
    await assertAdmin();
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("articles").delete().eq("id", id).select("id").maybeSingle();

    if (error) throw error;
    if (!data) return { success: false, error: "Article was not found or was already deleted." };

    await logActivity({
      action: "delete",
      targetType: "article",
      targetId: id,
    });

    revalidateTag(PUBLISHED_ARTICLES_TAG);
    revalidatePath("/news");
    revalidatePath("/news/[slug]", "page");
    revalidatePath("/sitemap.xml");
    revalidatePath("/");
    revalidatePath("/admin/articles");

    return { success: true };
  } catch (err) {
    console.error("Failed to delete article:", err);
    return { success: false, error: String(err) };
  }
}
