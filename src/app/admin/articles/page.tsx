"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  Info,
} from "lucide-react";
import { useToast } from "@/components/admin/toast";
import {
  AdminArticle,
} from "@/lib/admin-store";
import { getAdminArticles, saveArticle, deleteArticle } from "@/lib/services/articles";
import { cn } from "@/lib/utils";

export default function AdminArticlesPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "draft" | "review" | "scheduled" | "published">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const loadArticles = () => {
    setIsLoading(true);
    getAdminArticles()
      .then((data) => setArticles(data || []))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadArticles();
  }, []);

  // Quick edit slide-over drawer state
  const [quickEditArticle, setQuickEditArticle] = useState<AdminArticle | null>(null);
  const [quickTags, setQuickTags] = useState<string[]>([]);
  const [quickTagInput, setQuickTagInput] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Tab counts dynamically calculated from articles
  const tabCounts = {
    all: articles.length,
    draft: articles.filter((a) => a.status === "draft").length,
    review: articles.filter((a) => a.status === "review").length,
    scheduled: articles.filter((a) => a.status === "scheduled").length,
    published: articles.filter((a) => a.status === "published").length,
  };


  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      if (activeTab === "draft" && a.status !== "draft") return false;
      if (activeTab === "review" && a.status !== "review") return false;
      if (activeTab === "scheduled" && a.status !== "scheduled") return false;
      if (activeTab === "published" && a.status !== "published") return false;

      if (selectedAuthor !== "all" && a.author.name.toLowerCase() !== selectedAuthor.toLowerCase()) return false;
      if (selectedCategory !== "all" && a.category !== selectedCategory) return false;

      if (
        searchQuery &&
        !a.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !a.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [articles, activeTab, selectedAuthor, selectedCategory, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / itemsPerPage));
  const pageArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when filters change the result set
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedAuthor, selectedCategory, searchQuery]);

  const authors = useMemo(
    () => Array.from(new Set(articles.map((a) => a.author.name))).sort(),
    [articles]
  );
  const categories = useMemo(
    () => Array.from(new Set(articles.map((a) => a.category))).sort(),
    [articles]
  );

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === pageArticles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pageArticles.map((a) => a.id));
    }
  };

  const openQuickEdit = (article: AdminArticle) => {
    setQuickEditArticle(article);
    setQuickTags(article.tags || []);
    setQuickTagInput("");
  };

  const addQuickTag = () => {
    const t = quickTagInput.trim();
    if (t && !quickTags.includes(t)) setQuickTags([...quickTags, t]);
    setQuickTagInput("");
  };

  const handleSaveQuickEdit = async () => {
    if (!quickEditArticle) return;
    const updated: AdminArticle = {
      ...quickEditArticle,
      tags: quickTags,
    };
    setArticles((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
    showToast({
      title: "Saving to Supabase...",
      description: `Saving "${updated.title}"...`,
      type: "info",
    });

    const res = await saveArticle(updated);
    if (res.success) {
      showToast({
        title: "Article Saved",
        description: `Persisted to Supabase and updated on live site!`,
        type: "success",
      });
      setQuickEditArticle(null);
      loadArticles();
    } else {
      showToast({
        title: "Save failed",
        description: res.error || "Could not save the article.",
        type: "danger",
      });
    }
  };

  const handleDeleteArticle = async (id: string) => {
    const target = articles.find((a) => a.id === id);
    setArticles((prev) => prev.filter((a) => a.id !== id));
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    showToast({
      title: "Deleting...",
      description: "Removing article...",
      type: "info",
    });
    const res = await deleteArticle(id);
    if (res.success) {
      showToast({
        title: "Article Deleted",
        description: "Removed from Supabase and live site.",
        type: "success",
      });
    } else {
      showToast({
        title: "Delete failed",
        description: res.error || "Could not delete the article.",
        type: "danger",
      });
      loadArticles();
    }
  };

  const handleArchiveSelected = async () => {
    const targets = articles.filter((a) => selectedIds.includes(a.id) && a.status !== "archived");
    if (targets.length === 0) return;
    showToast({ title: "Archiving…", description: `${targets.length} article(s)…`, type: "info" });
    for (const t of targets) {
      await saveArticle({ ...t, status: "archived" });
    }
    setSelectedIds([]);
    showToast({ title: "Archived", description: `${targets.length} article(s) moved to archive.`, type: "success" });
    loadArticles();
  };

  const removeTag = (tagToRemove: string) => {
    setQuickTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header matching Image 8 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Articles
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected to Supabase
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Manage, edit and publish content for GTA 6 Atlas. All information is unverified and subject to change.
          </p>
        </div>

        <Link
          href="/admin/articles/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold transition-all shadow-md shadow-indigo-500/20 active:scale-[0.98] w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Create article</span>
        </Link>
      </div>

      {/* Filter Tabs matching Image 8: All 128, Drafts 18, Review 9, Scheduled 4, Published 97 */}
      <div
        role="tablist"
        aria-label="Filter articles by status"
        className="flex items-center gap-2 overflow-x-auto scrollbar-none text-xs font-medium"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "all"}
          onClick={() => setActiveTab("all")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap",
            activeTab === "all"
              ? "bg-[#6366F1] text-white font-bold shadow-sm"
              : "text-[#94A3B8] hover:text-white hover:bg-[#141B2A]"
          )}
        >
          <span>All</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
            {tabCounts.all}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "draft"}
          onClick={() => setActiveTab("draft")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap",
            activeTab === "draft"
              ? "bg-[#6366F1] text-white font-bold shadow-sm"
              : "text-[#94A3B8] hover:text-white hover:bg-[#141B2A]"
          )}
        >
          <span>Drafts</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#1C2436] text-[#94A3B8]">
            {tabCounts.draft}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "review"}
          onClick={() => setActiveTab("review")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap",
            activeTab === "review"
              ? "bg-[#6366F1] text-white font-bold shadow-sm"
              : "text-[#94A3B8] hover:text-white hover:bg-[#141B2A]"
          )}
        >
          <span>Review</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#1C2436] text-[#94A3B8]">
            {tabCounts.review}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "scheduled"}
          onClick={() => setActiveTab("scheduled")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap",
            activeTab === "scheduled"
              ? "bg-[#6366F1] text-white font-bold shadow-sm"
              : "text-[#94A3B8] hover:text-white hover:bg-[#141B2A]"
          )}
        >
          <span>Scheduled</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#1C2436] text-[#94A3B8]">
            {tabCounts.scheduled}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "published"}
          onClick={() => setActiveTab("published")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap",
            activeTab === "published"
              ? "bg-[#6366F1] text-white font-bold shadow-sm"
              : "text-[#94A3B8] hover:text-white hover:bg-[#141B2A]"
          )}
        >
          <span>Published</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#1C2436] text-[#94A3B8]">
            {tabCounts.published}
          </span>
        </button>
      </div>

      {/* Filter Row: Search articles... ⌘K, All authors, All categories, Any date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input
            type="text"
            id="article-search"
            aria-label="Search articles"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-9 pr-12 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1] transition-colors"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-[#64748B] bg-[#182030] border border-[#243048] rounded">
            ⌘ K
          </kbd>
        </div>

        <div>
          <select
            id="article-author-filter"
            aria-label="Filter by author"
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
          >
            <option value="all">All authors</option>
            {authors.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            id="article-category-filter"
            aria-label="Filter by category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
          >
            <option value="all">All categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            id="article-date-filter"
            aria-label="Filter by date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
          >
            <option value="all">Any date</option>
            <option value="today">Today</option>
            <option value="week">Past 7 days</option>
            <option value="month">Past 30 days</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Data Table (Left) + Quick Edit Drawer (Right) matching Image 8 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table Container */}
        <div className={cn("transition-all duration-200", quickEditArticle ? "lg:col-span-8" : "lg:col-span-12")}>
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] overflow-hidden">
            {/* Bulk Actions Header */}
            {selectedIds.length > 0 && (
              <div className="p-3 bg-[#0E131D] border-b border-[#1C2436] flex items-center justify-between flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-white">
                    {selectedIds.length} selected
                  </span>
                  <button
                    type="button"
                    onClick={handleArchiveSelected}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#182030] hover:bg-[#202B40] text-white border border-[#243048] font-medium transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-[#EF4444]" />
                    <span>Archive</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="text-xs text-[#818CF8] hover:underline"
                >
                  Clear selection
                </button>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs" aria-label="Articles table">
                <thead>
                  <tr className="border-b border-[#1C2436] text-[#64748B] text-[11px]">
                    <th scope="col" className="p-3 w-10 text-center">
                      <input
                        type="checkbox"
                        aria-label="Select all articles"
                        checked={selectedIds.length === pageArticles.length && pageArticles.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-[#2A344A] bg-[#0E131D] text-[#6366F1] focus:ring-0 focus:ring-offset-0"
                      />
                    </th>
                    <th scope="col" className="py-3 px-3 font-medium text-white">
                      Title
                    </th>
                    <th scope="col" className="py-3 px-3 font-medium">
                      Status
                    </th>
                    <th scope="col" className="py-3 px-3 font-medium">
                      Category
                    </th>
                    <th scope="col" className="py-3 px-3 font-medium">
                      Author
                    </th>
                    <th scope="col" className="py-3 px-3 font-medium">
                      Updated ↓
                    </th>
                    <th scope="col" className="py-3 px-3 font-medium">
                      Publication date
                    </th>
                    <th scope="col" className="py-3 px-3 text-right">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182030]">
                  {isLoading && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-[#64748B]">
                        Loading articles…
                      </td>
                    </tr>
                  )}
                  {!isLoading && pageArticles.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-[#94A3B8]">
                        <p className="font-semibold text-white text-xs">No articles found.</p>
                        <p className="text-[11px] text-[#64748B] mt-1">
                          {articles.length === 0
                            ? "Create your first article to get started."
                            : "Try adjusting the filters or search."}
                        </p>
                      </td>
                    </tr>
                  )}
                  {pageArticles.map((art) => {
                    const isSelected = selectedIds.includes(art.id);

                    return (
                      <tr
                        key={art.id}
                        className={cn(
                          "transition-colors",
                          isSelected
                            ? "bg-[#1B2138] border-l-2 border-l-[#6366F1]"
                            : "hover:bg-[#141B2A]"
                        )}
                      >
                        <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            aria-label={`Select ${art.title}`}
                            checked={isSelected}
                            onChange={() => handleSelectRow(art.id)}
                            className="rounded border-[#2A344A] bg-[#0E131D] text-[#6366F1] focus:ring-0 focus:ring-offset-0"
                          />
                        </td>
                        <td className="py-3 px-3 max-w-xs">
                          <p className="font-bold text-white text-xs hover:text-[#818CF8] transition-colors line-clamp-1">
                            {art.title}
                          </p>
                          <p className="text-[11px] text-[#64748B] line-clamp-1 mt-0.5">
                            {art.subtitle || art.excerpt}
                          </p>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          {art.status === "published" && (
                            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#0F2A1D] border border-[#1C5338] text-[#34D399]">
                              Published
                            </span>
                          )}
                          {art.status === "review" && (
                            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#3D2D16] border border-[#594220] text-[#EAB308]">
                              Review
                            </span>
                          )}
                          {art.status === "scheduled" && (
                            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#162744] border border-[#234375] text-[#38BDF8]">
                              Scheduled
                            </span>
                          )}
                          {art.status === "draft" && (
                            <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#182030] border border-[#243048] text-[#94A3B8]">
                              Draft
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-[#94A3B8] font-medium">
                          {art.category}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#182030] border border-[#243048] flex items-center justify-center text-[10px] font-bold text-[#94A3B8]">
                              {art.author.avatar}
                            </div>
                            <span className="text-white text-xs">{art.author.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-[#64748B] whitespace-nowrap font-mono text-[11px]">
                          {art.updatedAt}
                        </td>
                        <td className="py-3 px-3 text-[#64748B] whitespace-nowrap font-mono text-[11px]">
                          {art.publishedAt || art.scheduledFor || "—"}
                        </td>
                        <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/admin/articles/${art.id}`}
                              className="p-1.5 rounded-lg text-[#64748B] hover:text-white hover:bg-[#1C2436] transition-colors"
                              title="Full Editor"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => openQuickEdit(art)}
                              className="p-1.5 rounded-lg text-[#64748B] hover:text-white hover:bg-[#1C2436] transition-colors"
                              aria-label="Quick edit"
                              title="Quick edit"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteArticle(art.id)}
                              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#F87171] hover:bg-[#1C2436] transition-colors"
                              aria-label="Delete article"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-[#1C2436] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-[#94A3B8]">
              <p>
                Showing {pageArticles.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–
                {(currentPage - 1) * itemsPerPage + pageArticles.length} of{" "}
                {filteredArticles.length} articles
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg bg-[#0E131D] border border-[#1C2436] text-[#64748B] hover:text-white disabled:opacity-40 transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(Math.max(0, Math.min(currentPage - 3, totalPages - 5)), Math.max(5, Math.min(currentPage + 2, totalPages)))
                  .map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setCurrentPage(p)}
                      className={cn(
                        "w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors",
                        p === currentPage
                          ? "bg-[#6366F1] text-white"
                          : "bg-[#0E131D] border border-[#1C2436] text-[#94A3B8] hover:text-white"
                      )}
                    >
                      {p}
                    </button>
                  ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-lg bg-[#0E131D] border border-[#1C2436] text-[#64748B] hover:text-white disabled:opacity-40 transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Edit Slide-over Panel matching Image 8 */}
        {quickEditArticle && (
          <div className="lg:col-span-4 rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#1C2436]">
              <div>
                <h2 className="text-sm font-bold text-white">Quick edit</h2>
                <p className="text-xs text-[#64748B]">Edit key details for this article.</p>
              </div>
              <button
                type="button"
                onClick={() => setQuickEditArticle(null)}
                className="p-1 rounded text-[#94A3B8] hover:text-white"
                aria-label="Close quick edit"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label
                  htmlFor="quick-title"
                  className="block text-[11px] font-medium text-[#94A3B8] mb-1.5"
                >
                  Title
                </label>
                <input
                  id="quick-title"
                  type="text"
                  value={quickEditArticle.title}
                  onChange={(e) =>
                    setQuickEditArticle({ ...quickEditArticle, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label
                  htmlFor="quick-category"
                  className="block text-[11px] font-medium text-[#94A3B8] mb-1.5"
                >
                  Category
                </label>
                <select
                  id="quick-category"
                  value={quickEditArticle.category}
                  onChange={(e) =>
                    setQuickEditArticle({ ...quickEditArticle, category: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                >
                  <option value="News">News</option>
                  <option value="General">General</option>
                  <option value="Vehicles">Vehicles</option>
                  <option value="Guides">Guides</option>
                  <option value="Analysis">Analysis</option>
                  <option value="Editorial">Editorial</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#94A3B8] mb-1.5">
                  Tags
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-[#0E131D] border border-[#1C2436] min-h-[40px] items-center">
                  {quickTags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#182030] text-[#94A3B8] text-[11px]"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(t)}
                        className="hover:text-white"
                        aria-label={`Remove tag ${t}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={quickTagInput}
                    onChange={(e) => setQuickTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        addQuickTag();
                      }
                    }}
                    placeholder="Add tag…"
                    aria-label="Add tag"
                    className="flex-1 min-w-[80px] bg-transparent text-[11px] text-white placeholder-[#64748B] focus:outline-none"
                  />
                </div>
              </div>

              {/* Info Notice Box */}
              <div className="p-3 rounded-xl bg-[#0E131D] border border-[#1C2436] flex items-start gap-2.5 text-xs text-[#94A3B8]">
                <Info className="w-4 h-4 text-[#6366F1] shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  This is a quick edit. For full editing options including content, SEO and featured image, open the article in the editor.
                </p>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleSaveQuickEdit}
                  className="w-full py-2.5 rounded-lg bg-[#6366F1] hover:bg-[#5254D8] text-xs font-semibold text-white transition-colors shadow-md shadow-indigo-500/20"
                >
                  Save changes
                </button>
                <button
                  type="button"
                  onClick={() => setQuickEditArticle(null)}
                  className="w-full py-2 rounded-lg text-xs font-medium text-[#94A3B8] hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>

              <div className="pt-2 border-t border-[#1C2436] text-center">
                <Link
                  href={`/admin/articles/${quickEditArticle.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#818CF8] hover:text-white transition-colors"
                >
                  <span>Open in Full Article Editor</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

