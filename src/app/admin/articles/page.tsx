"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  Search,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertTriangle,
  SlidersHorizontal,
  Eye,
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Check,
  Calendar,
  Sparkles
} from "lucide-react";
import { DataTable, Column } from "@/components/admin/data-table";
import { Drawer } from "@/components/admin/drawer";
import { Modal } from "@/components/admin/modal";
import { useToast } from "@/components/admin/toast";
import {
  INITIAL_ADMIN_ARTICLES,
  AdminArticle,
} from "@/lib/admin-store";
import { cn } from "@/lib/utils";

export default function AdminArticlesPage() {
  const { showToast } = useToast();
  const [articles, setArticles] = useState<AdminArticle[]>(INITIAL_ADMIN_ARTICLES);
  const [activeTab, setActiveTab] = useState<"all" | "draft" | "review" | "scheduled" | "published">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Drawer & Editor states
  const [editingArticle, setEditingArticle] = useState<AdminArticle | null>(null);
  const [isFullEditorOpen, setIsFullEditorOpen] = useState(false);

  // New Article Modal
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("General");

  // Filtering
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      if (activeTab !== "all" && art.status !== activeTab) return false;
      if (selectedCategory !== "all" && art.category !== selectedCategory) return false;
      if (
        searchQuery &&
        !art.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !art.author.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [articles, activeTab, selectedCategory, searchQuery]);

  const tabCounts = {
    all: articles.length,
    draft: articles.filter((a) => a.status === "draft").length,
    review: articles.filter((a) => a.status === "review").length,
    scheduled: articles.filter((a) => a.status === "scheduled").length,
    published: articles.filter((a) => a.status === "published").length,
  };

  const handleSaveArticle = () => {
    if (!editingArticle) return;
    setArticles((prev) =>
      prev.map((a) => (a.id === editingArticle.id ? editingArticle : a))
    );
    showToast({
      title: "Article Saved",
      description: `"${editingArticle.title}" updated successfully.`,
      type: "success",
    });
    setEditingArticle(null);
    setIsFullEditorOpen(false);
  };

  const handleCreateArticle = () => {
    if (!newTitle.trim()) return;
    const newRecord: AdminArticle = {
      id: `art-${Date.now()}`,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      title: newTitle,
      subtitle: "New editorial draft in progress.",
      excerpt: "Comprehensive investigation and breakdown for Atlas readers.",
      status: "draft",
      category: newCategory,
      author: { name: "Jamie Lee", avatar: "JL", role: "Editor" },
      updatedAt: "Just now",
      views: 0,
      readTime: "4 min read",
      tags: ["Analysis", "GTA 6"],
      revisions: [
        {
          id: `rev-${Date.now()}`,
          version: 1,
          author: "Jamie Lee",
          date: "Just now",
          summary: "Initial article draft",
        },
      ],
    };
    setArticles([newRecord, ...articles]);
    setIsNewModalOpen(false);
    setNewTitle("");
    showToast({
      title: "Article Created",
      description: `Draft "${newRecord.title}" created.`,
      type: "success",
    });
    setEditingArticle(newRecord);
    setIsFullEditorOpen(true);
  };

  const columns: Column<AdminArticle>[] = [
    {
      key: "title",
      header: "Title & Excerpt",
      sortable: true,
      render: (art) => (
        <div className="space-y-0.5 max-w-md">
          <p className="font-bold text-[var(--admin-text)] hover:text-[var(--admin-primary)] transition-colors line-clamp-1">
            {art.title}
          </p>
          <p className="text-[11px] text-[var(--admin-text-muted)] line-clamp-1">
            {art.excerpt}
          </p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (art) => (
        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[var(--admin-elevated)] border border-[var(--admin-border-subtle)] text-[var(--admin-text)]">
          {art.category}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (art) => (
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase border",
            art.status === "published" &&
              "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
            art.status === "scheduled" &&
              "bg-amber-500/10 text-amber-400 border-amber-500/30",
            art.status === "review" &&
              "bg-purple-500/10 text-purple-400 border-purple-500/30",
            art.status === "draft" &&
              "bg-[var(--admin-elevated)] text-[var(--admin-text-muted)] border-[var(--admin-border)]"
          )}
        >
          {art.status === "published" && <CheckCircle2 className="w-3 h-3" />}
          {art.status === "scheduled" && <Clock className="w-3 h-3" />}
          {art.status === "review" && <AlertTriangle className="w-3 h-3" />}
          <span>{art.status}</span>
        </span>
      ),
    },
    {
      key: "author",
      header: "Author",
      sortable: true,
      render: (art) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold text-[10px]">
            {art.author.avatar}
          </div>
          <span className="text-xs font-medium text-[var(--admin-text)]">
            {art.author.name}
          </span>
        </div>
      ),
    },
    {
      key: "views",
      header: "Views",
      sortable: true,
      render: (art) => (
        <span className="text-xs font-mono text-[var(--admin-text)]">
          {art.views.toLocaleString()}
        </span>
      ),
    },
    {
      key: "updatedAt",
      header: "Last Updated",
      render: (art) => (
        <span className="text-[11px] text-[var(--admin-text-muted)] font-mono">
          {art.updatedAt}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--admin-border-subtle)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--admin-text)] tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-[var(--admin-primary)]" />
            <span>Articles & Editorial</span>
          </h1>
          <p className="text-xs text-[var(--admin-text-muted)] mt-1">
            Author and publish investigative reports, guides, database analyses, and trailer breakdowns.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--admin-primary)] hover:opacity-90 text-white text-xs font-black uppercase tracking-wider transition-colors shadow-md shadow-[var(--admin-primary)]/25"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </button>
      </div>

      {/* Tabs (Image 8) */}
      <div className="flex items-center gap-2 border-b border-[var(--admin-border)] pb-2 overflow-x-auto scrollbar-none">
        {(["all", "draft", "review", "scheduled", "published"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all capitalize whitespace-nowrap",
              activeTab === tab
                ? "bg-[var(--admin-primary)] text-white shadow-sm"
                : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]"
            )}
          >
            <span>{tab === "all" ? "All Articles" : tab}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
              {tabCounts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Category Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--admin-text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title, author, or excerpt..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)] transition-colors"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)] transition-colors"
          >
            <option value="all">All Editorial Categories</option>
            <option value="General">General</option>
            <option value="Vehicles">Vehicles</option>
            <option value="Guides">Guides</option>
            <option value="Analysis">Analysis</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <DataTable
        data={filteredArticles}
        columns={columns}
        selectable
        selectedIds={selectedIds}
        onSelectRow={(id) =>
          setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
          )
        }
        onSelectAll={(all) =>
          setSelectedIds(all ? filteredArticles.map((a) => a.id) : [])
        }
        bulkActions={
          <button
            onClick={() => {
              setArticles((prev) =>
                prev.map((a) =>
                  selectedIds.includes(a.id) ? { ...a, status: "published" } : a
                )
              );
              showToast({
                title: "Articles Published",
                description: `${selectedIds.length} article(s) published live.`,
                type: "success",
              });
              setSelectedIds([]);
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
          >
            Publish Selected
          </button>
        }
        actions={(art) => (
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={() => {
                setEditingArticle(art);
                setIsFullEditorOpen(false);
              }}
              className="p-1.5 rounded-lg text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)] transition-colors"
              title="Quick edit drawer"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setEditingArticle(art);
                setIsFullEditorOpen(true);
              }}
              className="p-1.5 rounded-lg text-[var(--admin-primary)] hover:bg-[var(--admin-primary)]/10 transition-colors"
              title="Full article editor"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      {/* Quick Edit Drawer (Image 8) */}
      <Drawer
        isOpen={!!editingArticle && !isFullEditorOpen}
        onClose={() => setEditingArticle(null)}
        title={editingArticle ? `Quick Edit: ${editingArticle.title}` : "Quick Edit"}
        subtitle={
          editingArticle
            ? `Category: ${editingArticle.category} • Author: ${editingArticle.author.name}`
            : undefined
        }
        size="lg"
        footer={
          <>
            <button
              onClick={() => setEditingArticle(null)}
              className="px-4 py-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-elevated)] text-xs font-bold text-[var(--admin-text)]"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveArticle}
              className="px-5 py-2 rounded-xl bg-[var(--admin-primary)] text-xs font-bold text-white shadow-md shadow-[var(--admin-primary)]/20 hover:opacity-90"
            >
              Save Changes
            </button>
          </>
        }
      >
        {editingArticle && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[var(--admin-text)] mb-1">
                Article Title
              </label>
              <input
                type="text"
                value={editingArticle.title}
                onChange={(e) =>
                  setEditingArticle({ ...editingArticle, title: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)] font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-[var(--admin-text)] mb-1">
                Excerpt
              </label>
              <textarea
                rows={3}
                value={editingArticle.excerpt}
                onChange={(e) =>
                  setEditingArticle({ ...editingArticle, excerpt: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[var(--admin-text)] mb-1">
                  Status
                </label>
                <select
                  value={editingArticle.status}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      status: e.target.value as AdminArticle["status"],
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="review">Under Review</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[var(--admin-text)] mb-1">
                  Category
                </label>
                <select
                  value={editingArticle.category}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, category: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none"
                >
                  <option value="General">General</option>
                  <option value="Vehicles">Vehicles</option>
                  <option value="Guides">Guides</option>
                  <option value="Analysis">Analysis</option>
                </select>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={() => setIsFullEditorOpen(true)}
                className="w-full py-2.5 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-elevated)] hover:bg-[var(--admin-card)] text-xs font-bold text-[var(--admin-primary)] flex items-center justify-center gap-2 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Open Full Article Editor & SEO Preview</span>
              </button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Full Article Editor Modal (Image 9) */}
      {isFullEditorOpen && editingArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[var(--admin-bg)] flex flex-col animate-in fade-in">
          {/* Top Editor Header */}
          <div className="h-16 px-6 border-b border-[var(--admin-border)] bg-[var(--admin-surface)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFullEditorOpen(false)}
                className="p-2 rounded-xl text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]"
              >
                ✕
              </button>
              <div>
                <h2 className="text-sm font-bold text-[var(--admin-text)]">
                  Article Editor: {editingArticle.title}
                </h2>
                <p className="text-[11px] text-[var(--admin-text-muted)]">
                  Slug: {editingArticle.slug} • Last saved {editingArticle.updatedAt}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setEditingArticle({ ...editingArticle, status: "draft" });
                  handleSaveArticle();
                }}
                className="px-4 py-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] text-xs font-bold text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]"
              >
                Save Draft
              </button>
              <button
                onClick={() => {
                  setEditingArticle({ ...editingArticle, status: "published" });
                  handleSaveArticle();
                }}
                className="px-5 py-2 rounded-xl bg-[var(--admin-primary)] text-xs font-bold text-white shadow-md shadow-[var(--admin-primary)]/20 hover:opacity-90"
              >
                Publish Article
              </button>
            </div>
          </div>

          {/* Editor Body: 2 Columns */}
          <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Content (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Cover Image Placeholder */}
              <div className="h-44 rounded-2xl border-2 border-dashed border-[var(--admin-border)] bg-[var(--admin-card)] flex flex-col items-center justify-center text-center p-4">
                <ImageIcon className="w-8 h-8 text-[var(--admin-text-muted)] mb-2" />
                <p className="text-xs font-bold text-[var(--admin-text)]">
                  Featured Cover Image
                </p>
                <p className="text-[11px] text-[var(--admin-text-muted)] mt-0.5">
                  Drag and drop a 1920x1080 banner or browse media library.
                </p>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-2">
                <input
                  type="text"
                  value={editingArticle.title}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, title: e.target.value })
                  }
                  placeholder="Article Headline..."
                  className="w-full text-2xl font-black bg-transparent text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none"
                />
                <input
                  type="text"
                  value={editingArticle.subtitle || ""}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, subtitle: e.target.value })
                  }
                  placeholder="Subtitle or lead paragraph..."
                  className="w-full text-sm font-medium bg-transparent text-[var(--admin-text-muted)] focus:outline-none"
                />
              </div>

              {/* Rich Text Toolbar */}
              <div className="flex items-center gap-1 p-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-[var(--admin-text-muted)]">
                <button className="p-1.5 rounded hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]">
                  <Bold className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]">
                  <Italic className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-[var(--admin-border)]" />
                <button className="p-1.5 rounded hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]">
                  <Heading1 className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]">
                  <Heading2 className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-[var(--admin-border)]" />
                <button className="p-1.5 rounded hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]">
                  <List className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]">
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]">
                  <Quote className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]">
                  <Code className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-[var(--admin-border)]" />
                <button className="p-1.5 rounded hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]">
                  <LinkIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Body Textarea */}
              <textarea
                rows={14}
                defaultValue={`The reveal trailer for Grand Theft Auto VI provided unprecedented insight into Vice City and the surrounding state of Leonida. In this breakdown, our editorial team cross-references background store signage, street names, vehicle body lines, and character dialogues against verified real-world Miami and Florida counterparts.\n\nKey timestamps examined:\n- 0:18: Ocean Drive neon signage and traffic flow\n- 0:34: Leonida Department of Corrections entrance\n- 0:52: Mud club off-road vehicles in the wetlands`}
                className="w-full p-4 rounded-2xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-sm text-[var(--admin-text)] leading-relaxed focus:outline-none focus:border-[var(--admin-primary)] font-serif"
              />
            </div>

            {/* Right Column: Checklist & SEO Preview (4 cols) */}
            <div className="lg:col-span-4 space-y-5">
              {/* Pre-Publish Checklist (Image 9) */}
              <div className="p-5 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)]">
                  Pre-Publish Checklist
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Featured cover image assigned</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Word count meets editorial guidelines (&gt;500 words)</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Category & tags properly tagged</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-400">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>1 pending source citation needs corroboration</span>
                  </div>
                </div>
              </div>

              {/* Google SEO Live Preview Box (Image 9) */}
              <div className="p-5 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)]">
                  Google Search Result Preview
                </h3>
                <div className="p-4 rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)] space-y-1">
                  <p className="text-[11px] text-emerald-400 font-mono truncate">
                    https://atlas-gta6.com › articles › {editingArticle.slug}
                  </p>
                  <p className="text-sm font-bold text-indigo-400 hover:underline cursor-pointer line-clamp-1">
                    {editingArticle.title} | GTA 6 Atlas
                  </p>
                  <p className="text-xs text-[var(--admin-text-muted)] line-clamp-2 leading-relaxed">
                    {editingArticle.excerpt}
                  </p>
                </div>
              </div>

              {/* Meta Details */}
              <div className="p-5 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] space-y-3 text-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)]">
                  Publication Settings
                </h3>

                <div>
                  <label className="block font-bold text-[var(--admin-text-muted)] mb-1">
                    Assigned Author
                  </label>
                  <p className="text-xs font-bold text-[var(--admin-text)]">
                    {editingArticle.author.name} ({editingArticle.author.role})
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-[var(--admin-text-muted)] mb-1">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {editingArticle.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md bg-[var(--admin-elevated)] border border-[var(--admin-border)] text-[10px] font-bold text-[var(--admin-text)]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Article Modal */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Start New Editorial Article"
        description="Create a new draft in the Atlas content workflow."
        footer={
          <>
            <button
              onClick={() => setIsNewModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-elevated)] text-xs font-bold text-[var(--admin-text)]"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateArticle}
              className="px-5 py-2 rounded-xl bg-[var(--admin-primary)] text-xs font-bold text-white shadow-md shadow-[var(--admin-primary)]/20"
            >
              Create & Launch Editor
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--admin-text)] mb-1">
              Article Headline
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Vice City Beachfront Map Comparison"
              className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--admin-text)] mb-1">
              Category
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
            >
              <option value="General">General</option>
              <option value="Vehicles">Vehicles</option>
              <option value="Guides">Guides</option>
              <option value="Analysis">Analysis</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
