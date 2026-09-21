"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerSupabase } from "@/lib/supabase/client";

import { articles as fallbackArticles, Article } from "@/lib/data";
import { INITIAL_ADMIN_ARTICLES, AdminArticle } from "@/lib/admin-store";

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
  created_at?: string | null;
  updated_at?: string | null;
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
    read: row.read_time || "4 min read",
    img: row.cover_image || "/img/hero-dark.jpg",
    tag: row.tag || row.category || "News",
  };
}

function rowToAdminArticle(row: DatabaseArticleRow): AdminArticle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle || undefined,
    excerpt: row.excerpt,
    status: (row.status as AdminArticle["status"]) || "published",
    category: row.category,
    author: {
      name: row.author_name,
      avatar: row.author_avatar || "/img/avatar-admin.jpg",
      role: row.author_role || "Staff Writer",
    },
    publishedAt: row.published_at || undefined,
    scheduledFor: row.scheduled_for || undefined,
    updatedAt: row.updated_at || new Date().toISOString(),
    views: row.views || 0,
    readTime: row.read_time || "4 min read",
    tags: row.tags || ["GTA 6"],
    coverImage: row.cover_image,
    revisions: [],
  };
}

/**
 * Fetch published articles for public frontend (with fallback)
 */
export async function getPublicArticles(): Promise<Article[]> {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return (data as DatabaseArticleRow[]).map(rowToArticle);
    }
  } catch {
    // Graceful fallback to static data
  }

  return fallbackArticles;
}

/**
 * Fetch all articles for the Admin Dashboard (with fallback)
 */
export async function getAdminArticles(): Promise<AdminArticle[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("updated_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return (data as DatabaseArticleRow[]).map(rowToAdminArticle);
    }
  } catch {
    // Graceful fallback
  }

  return INITIAL_ADMIN_ARTICLES;
}

/**
 * Save or update an article in Supabase
 */
export async function saveArticle(article: Partial<AdminArticle> & { title: string; excerpt: string }) {
  try {
    const supabase = createAdminClient();

    const id = article.id || `art-${Date.now()}`;
    const slug =
      article.slug ||
      article.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const payload: Partial<DatabaseArticleRow> = {
      id,
      slug,
      title: article.title,
      subtitle: article.subtitle || null,
      excerpt: article.excerpt,
      category: article.category || "News",
      tag: article.tags?.[0] || "Official",
      status: article.status || "published",
      author_name: article.author?.name || "Atlas Editorial",
      author_avatar: article.author?.avatar || "/img/avatar-admin.jpg",
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

    const { error } = await supabase.from("articles").upsert(payload, { onConflict: "id" });

    if (error) throw error;

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
    const supabase = createAdminClient();
    const { error } = await supabase.from("articles").delete().eq("id", id);

    if (error) throw error;

    revalidatePath("/news");
    revalidatePath("/");
    revalidatePath("/admin/articles");

    return { success: true };
  } catch (err) {
    console.error("Failed to delete article:", err);
    return { success: false, error: String(err) };
  }
}
