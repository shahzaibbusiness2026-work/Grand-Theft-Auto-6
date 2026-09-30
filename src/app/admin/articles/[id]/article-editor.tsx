"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Eye,
  Save,
  Trash2,
  ImageIcon,
} from "lucide-react";
import { useToast } from "@/components/admin/toast";
import type { AdminArticle } from "@/lib/admin-store";
import { deleteArticle, saveArticle } from "@/lib/services/articles";
import { cn } from "@/lib/utils";

const EMPTY_DRAFT: AdminArticle = {
  id: "",
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  status: "draft",
  category: "News",
  author: { name: "Atlas Editorial", avatar: "/img/avatar-admin.svg", role: "Staff Writer" },
  updatedAt: new Date().toISOString(),
  views: 0,
  readTime: "5 min",
  tags: ["GTA 6"],
  revisions: [],
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ArticleEditor({
  initialArticle,
  articleId,
}: {
  initialArticle: AdminArticle | null;
  articleId: string;
}) {
  const router = useRouter();
  const { showToast } = useToast();

  const isNew = articleId === "new";
  const [article, setArticle] = useState<AdminArticle>(initialArticle || EMPTY_DRAFT);
  const [slugTouched, setSlugTouched] = useState(!!initialArticle?.slug);
  const [tags, setTags] = useState<string[]>(initialArticle?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [publishDate, setPublishDate] = useState(
    initialArticle?.scheduledFor ? initialArticle.scheduledFor.slice(0, 16) : ""
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const slug = article.slug || slugify(article.title);

  const setField = <K extends keyof AdminArticle>(key: K, value: AdminArticle[K]) =>
    setArticle((a) => ({ ...a, [key]: value }));

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  const buildPayload = (
    status: AdminArticle["status"]
  ): Partial<AdminArticle> & { title: string; excerpt: string } => {
    const finalSlug = slugify(slug || article.title);
    const scheduledFor =
      status === "scheduled" && publishDate ? new Date(publishDate).toISOString() : undefined;
    return {
      ...article,
      id: article.id || undefined,
      slug: finalSlug,
      status,
      tags,
      scheduledFor,
      excerpt: article.excerpt || article.title,
      readTime: article.readTime || "5 min",
      author: {
        ...article.author,
        name: article.author?.name || "Atlas Editorial",
        avatar: article.author?.avatar || "/img/avatar-admin.svg",
        role: article.author?.role || "Staff Writer",
      },
    };
  };

  const handleSave = async (status: AdminArticle["status"]) => {
    if (!article.title.trim()) {
      showToast({ title: "Title required", description: "Add a title before saving.", type: "danger" });
      return;
    }
    setSaving(true);
    const result = await saveArticle(buildPayload(status));
    setSaving(false);
    if (result.success) {
      showToast({
        title: status === "published" ? "Article published" : "Article saved",
        description: `"${article.title}" was saved as ${status}.`,
        type: "success",
      });
      if (!article.id && result.id) {
        router.replace(`/admin/articles/${result.id}`);
      } else {
        router.refresh();
      }
    } else {
      showToast({ title: "Save failed", description: result.error, type: "danger" });
    }
  };

  const handleDelete = async () => {
    if (!article.id) return;
    setDeleting(true);
    const result = await deleteArticle(article.id);
    setDeleting(false);
    if (result.success) {
      showToast({ title: "Article deleted", description: `"${article.title}" was removed.`, type: "success" });
      router.replace("/admin/articles");
    } else {
      showToast({ title: "Delete failed", description: result.error, type: "danger" });
    }
  };

  const metaTitle = article.seoTitle || article.title;
  const metaDescription = article.seoDescription || article.excerpt;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="space-y-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#94A3B8]">
          <Link href="/admin/articles" className="hover:text-white transition-colors">
            Articles
          </Link>
          <span className="text-[#64748B]">&gt;</span>
          <span className="text-white font-medium">{isNew ? "New article" : "Edit article"}</span>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/admin/articles"
                className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Articles</span>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {isNew ? "New article" : "Edit article"}
              </h1>
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                  article.status === "published"
                    ? "bg-[#12291B] border-[#1F4D2E] text-[#4ADE80]"
                    : article.status === "scheduled"
                      ? "bg-[#2A2015] border-[#4A3818] text-[#E5A83B]"
                      : "bg-[#141B2A] border-[#243048] text-[#94A3B8]"
                )}
              >
                {article.status || "draft"}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-[#94A3B8]">
              <span>Changes are saved to Supabase and go live on the public site.</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {article.slug && article.status === "published" && (
              <Link
                href={`/news/${slug}`}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#111622] hover:bg-[#161F30] border border-[#1C2436] text-[#94A3B8] hover:text-white text-xs font-semibold transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </Link>
            )}
            {article.id && (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#1B1114] hover:bg-[#241418] border border-[#3B1D24] text-[#F87171] text-xs font-semibold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave(article.status === "published" ? "published" : "draft")}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#111622] hover:bg-[#161F30] border border-[#1C2436] text-[#94A3B8] hover:text-white text-xs font-semibold transition-colors disabled:opacity-60"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? "Saving…" : "Save draft"}</span>
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave("published")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold transition-all shadow-md shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-60"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{saving ? "Working…" : "Publish"}</span>
            </button>
          </div>
        </div>
      </div>

      {confirmDelete && (
        <div className="rounded-xl border border-[#3B1D24] bg-[#1B1114] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-[#F87171]">
            Delete “{article.title}”? This permanently removes it from the database and the public site.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="px-3 py-1.5 rounded-lg bg-[#111622] border border-[#1C2436] text-xs font-semibold text-[#94A3B8] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="px-3 py-1.5 rounded-lg bg-[#7F1D1D] text-xs font-semibold text-white hover:bg-[#991B1B] disabled:opacity-60"
            >
              {deleting ? "Deleting…" : "Delete permanently"}
            </button>
          </div>
        </div>
      )}

      {/* Main 2-Column Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="article-title" className="block text-xs font-medium text-[#94A3B8]">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              id="article-title"
              type="text"
              value={article.title}
              onChange={(e) => {
                const title = e.target.value;
                setArticle((a) => ({
                  ...a,
                  title,
                  slug: slugTouched ? a.slug : slugify(title),
                }));
              }}
              className="w-full px-4 py-2.5 rounded-xl bg-[#111622] border border-[#1C2436] text-sm font-semibold text-white focus:outline-none focus:border-[#6366F1] transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="article-slug" className="block text-xs font-medium text-[#94A3B8]">
              Slug <span className="text-red-400">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-xs text-[#64748B] font-mono">/news/</span>
              <input
                id="article-slug"
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setField("slug", slugify(e.target.value));
                }}
                className="w-full pl-14 pr-4 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs font-mono text-white focus:outline-none focus:border-[#6366F1] transition-colors"
              />
            </div>
            <p className="text-[11px] text-[#64748B]">
              This will be used in the article URL: /news/{slug || "your-slug"}
            </p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="article-excerpt" className="block text-xs font-medium text-[#94A3B8]">
              Excerpt <span className="text-red-400">*</span>
            </label>
            <textarea
              id="article-excerpt"
              rows={2}
              value={article.excerpt}
              onChange={(e) => setField("excerpt", e.target.value)}
              placeholder="A short summary shown in listings and search results."
              className="w-full p-3 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1] resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#94A3B8]">Cover image URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={article.coverImage || ""}
                onChange={(e) => setField("coverImage", e.target.value)}
                placeholder="/img/hero-dark.jpg or https://…"
                className="flex-1 px-3 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs font-mono text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1]"
              />
            </div>
            <div className="relative h-40 rounded-2xl border border-[#1C2436] overflow-hidden mt-2 bg-[#0B0E14]">
              {article.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.coverImage}
                  alt="Cover preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-10 h-10 rounded-xl bg-[#182030]/80 border border-[#243048] flex items-center justify-center text-white mb-2">
                    <ImageIcon className="w-5 h-5 text-[#818CF8]" />
                  </div>
                  <p className="text-[11px] text-[#64748B]">
                    Paste an image URL above, or upload one in the Media library.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="article-content" className="block text-xs font-medium text-[#94A3B8]">
              Content <span className="text-red-400">*</span>
            </label>
            <textarea
              id="article-content"
              rows={14}
              value={article.content || ""}
              onChange={(e) => setField("content", e.target.value)}
              placeholder="Write the article body. Blank lines start new paragraphs."
              className="w-full p-4 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1] resize-y font-mono leading-relaxed"
            />
            <p className="text-[11px] text-[#64748B]">
              Plain text and paragraphs — rendered on the public article page.
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-5">
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-3.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Publication</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label htmlFor="article-pub-status" className="block text-[11px] font-medium text-[#94A3B8] mb-1">
                  Status
                </label>
                <select
                  id="article-pub-status"
                  value={article.status}
                  onChange={(e) => setField("status", e.target.value as AdminArticle["status"])}
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                >
                  <option value="draft">● Draft</option>
                  <option value="review">● Review</option>
                  <option value="scheduled">● Scheduled</option>
                  <option value="published">● Published</option>
                  <option value="archived">● Archived</option>
                </select>
              </div>

              <div>
                <label htmlFor="article-author-name" className="block text-[11px] font-medium text-[#94A3B8] mb-1">
                  Author name
                </label>
                <input
                  id="article-author-name"
                  type="text"
                  value={article.author?.name || ""}
                  onChange={(e) =>
                    setField("author", { ...article.author, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label htmlFor="article-author-role" className="block text-[11px] font-medium text-[#94A3B8] mb-1">
                  Author role
                </label>
                <input
                  id="article-author-role"
                  type="text"
                  value={article.author?.role || ""}
                  onChange={(e) =>
                    setField("author", { ...article.author, role: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label htmlFor="article-category-input" className="block text-[11px] font-medium text-[#94A3B8] mb-1">
                  Category <span className="text-red-400">*</span>
                </label>
                <input
                  id="article-category-input"
                  type="text"
                  list="article-category-options"
                  value={article.category}
                  onChange={(e) => setField("category", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                />
                <datalist id="article-category-options">
                  <option value="News" />
                  <option value="Analysis" />
                  <option value="Vehicles" />
                  <option value="Gameplay" />
                  <option value="Map" />
                </datalist>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#94A3B8] mb-1">Tags</label>
                <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-[#0E131D] border border-[#1C2436] items-center">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#182030] text-[#94A3B8] text-[11px]"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => setTags(tags.filter((tag) => tag !== t))}
                        className="hover:text-white"
                        aria-label={`Remove tag ${t}`}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add tag…"
                    className="flex-1 min-w-[80px] bg-transparent text-[11px] text-white placeholder-[#64748B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="article-publish-date" className="block text-[11px] font-medium text-[#94A3B8] mb-1">
                  Schedule for (optional)
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="article-publish-date"
                    type="datetime-local"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                  />
                </div>
                <p className="text-[10px] text-[#64748B] mt-1">
                  Set with status “Scheduled” to time a release.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">SEO</h3>

            <div className="space-y-1">
              <p className="text-[11px] font-medium text-[#64748B]">Search result preview</p>
              <div className="p-3 rounded-xl bg-[#0E131D] border border-[#1C2436] space-y-1">
                <p className="text-[10px] text-[#94A3B8]">GTA 6 Atlas</p>
                <p className="text-xs font-semibold text-[#818CF8]">{metaTitle}</p>
                <p className="text-[10px] text-emerald-400 font-mono truncate">
                  gta6atlas.com/news/{slug || "your-slug"}
                </p>
                <p className="text-[11px] text-[#94A3B8] line-clamp-2 leading-tight">{metaDescription}</p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="meta-title-input" className="block text-[11px] font-medium text-[#94A3B8]">
                  SEO title
                </label>
                <span className="text-[10px] font-mono text-[#64748B]">{metaTitle.length} / 60</span>
              </div>
              <input
                id="meta-title-input"
                type="text"
                value={article.seoTitle || ""}
                onChange={(e) => setField("seoTitle", e.target.value)}
                placeholder={article.title || "Defaults to the article title"}
                className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="meta-desc-input" className="block text-[11px] font-medium text-[#94A3B8]">
                  Meta description
                </label>
                <span className="text-[10px] font-mono text-[#64748B]">
                  {(article.seoDescription || "").length} / 160
                </span>
              </div>
              <textarea
                id="meta-desc-input"
                rows={3}
                value={article.seoDescription || ""}
                onChange={(e) => setField("seoDescription", e.target.value)}
                placeholder={article.excerpt || "Defaults to the article excerpt"}
                className="w-full p-3 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1] resize-none"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="canonical-url-input" className="block text-[11px] font-medium text-[#94A3B8]">
                Canonical URL (optional)
              </label>
              <input
                id="canonical-url-input"
                type="text"
                value={article.canonicalUrl || ""}
                onChange={(e) => setField("canonicalUrl", e.target.value)}
                placeholder="https://gta6atlas.com/news/…"
                className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs font-mono text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1]"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="og-image-input" className="block text-[11px] font-medium text-[#94A3B8]">
                Open Graph image (optional)
              </label>
              <input
                id="og-image-input"
                type="text"
                value={article.ogImage || ""}
                onChange={(e) => setField("ogImage", e.target.value)}
                placeholder="Defaults to the cover image"
                className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs font-mono text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
