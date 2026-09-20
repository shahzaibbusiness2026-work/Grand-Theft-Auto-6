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
  RotateCcw,
} from "lucide-react";
import { DataTable, Column } from "@/components/admin/data-table";
import { Drawer } from "@/components/admin/drawer";
import { Modal } from "@/components/admin/modal";
import { useToast } from "@/components/admin/toast";
import { Button } from "@/components/admin/ui/button";
import { Badge } from "@/components/admin/ui/badge";
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
  const [hasCoverImage, setHasCoverImage] = useState(true);
  const [articleContent, setArticleContent] = useState(
    `The reveal trailer for Grand Theft Auto VI provided unprecedented insight into Vice City and the surrounding state of Leonida. In this breakdown, our editorial team cross-references background store signage, street names, vehicle body lines, and character dialogues against verified real-world Miami and Florida counterparts.\n\nKey timestamps examined:\n- 0:18: Ocean Drive neon signage and traffic flow\n- 0:34: Leonida Department of Corrections entrance\n- 0:52: Mud club off-road vehicles in the wetlands`
  );

  // Active toolbar formats
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({
    bold: false,
    italic: false,
    h1: false,
    h2: false,
    list: false,
    quote: false,
  });

  const toggleFormat = (key: string) => {
    setActiveFormats((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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

  const hasActiveFilters = searchQuery.trim().length > 0 || selectedCategory !== "all";

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  // Dynamic Checklist Calculation
  const wordCount = articleContent.trim().split(/\s+/).filter(Boolean).length;
  const checklistItems = useMemo(() => {
    if (!editingArticle) return [];
    return [
      {
        id: "cover",
        label: "Featured cover image assigned",
        met: hasCoverImage,
      },
      {
        id: "title",
        label: "Headline exceeds 10 characters",
        met: editingArticle.title.length > 10,
      },
      {
        id: "words",
        label: `Word count meets guideline (${wordCount}/50 words)`,
        met: wordCount >= 50,
      },
      {
        id: "category",
        label: "Category & taxonomy tags assigned",
        met: editingArticle.tags.length > 0 && editingArticle.category !== "",
      },
    ];
  }, [editingArticle, hasCoverImage, wordCount]);

  const completedChecklistCount = checklistItems.filter((i) => i.met).length;

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
        <Badge variant="neutral" size="sm">
          {art.category}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (art) => {
        const variantMap: Record<AdminArticle["status"], "success" | "warning" | "primary" | "neutral"> = {
          published: "success",
          scheduled: "warning",
          review: "primary",
          draft: "neutral",
          archived: "neutral",
        };
        const iconMap: Record<AdminArticle["status"], React.ReactNode> = {
          published: <CheckCircle2 className="w-3 h-3" />,
          scheduled: <Clock className="w-3 h-3" />,
          review: <AlertTriangle className="w-3 h-3" />,
          draft: null,
          archived: null,
        };
        return (
          <Badge
            variant={variantMap[art.status]}
            size="sm"
            dot
            icon={iconMap[art.status]}
          >
            {art.status}
          </Badge>
        );
      },
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

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsNewModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Article
        </Button>
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Filter articles by status"
        className="flex items-center gap-2 border-b border-[var(--admin-border)] pb-2 overflow-x-auto scrollbar-none"
      >
        {(["all", "draft", "review", "scheduled", "published"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all capitalize whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]",
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
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--admin-text-muted)]" />
            <input
              type="text"
              id="article-search"
              aria-label="Search articles by title, author, or excerpt"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles by title, author, or excerpt..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)] transition-colors"
            />
          </div>

          <div>
            <select
              id="article-category-filter"
              aria-label="Filter by article category"
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

        {/* Active Filters Reset Bar */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[var(--admin-text-muted)] font-medium">
              Filtered results:
            </span>
            <span className="font-bold text-[var(--admin-text)]">
              {filteredArticles.length} of {articles.length} articles
            </span>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-[var(--admin-primary)] hover:underline font-bold ml-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--admin-primary)] rounded"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset filters</span>
            </button>
          </div>
        )}
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
        emptyState={
          <div className="py-8 text-center space-y-3">
            <FileText className="w-8 h-8 text-[var(--admin-text-muted)] mx-auto opacity-50" />
            <p className="text-xs font-semibold text-[var(--admin-text)]">
              No articles matched your criteria
            </p>
            {hasActiveFilters && (
              <Button variant="secondary" size="sm" onClick={resetFilters}>
                Clear all filters
              </Button>
            )}
          </div>
        }
        bulkActions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setArticles((prev) =>
                  prev.map((a) =>
                    selectedIds.includes(a.id) ? { ...a, status: "published" } : a
                  )
                );
                showToast({
                  title: "Published Selected",
                  description: `${selectedIds.length} article(s) published live.`,
                  type: "success",
                });
                setSelectedIds([]);
              }}
            >
              Publish Selected
            </Button>
          </div>
        }
        actions={(art) => (
          <div className="flex items-center justify-end gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setEditingArticle(art);
                setIsFullEditorOpen(true);
              }}
              aria-label={`Edit ${art.title}`}
              title="Launch full editor"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        )}
      />

      {/* Full Screen Article Editor Overlay */}
      {isFullEditorOpen && editingArticle && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full-screen article editor"
          className="fixed inset-0 z-50 bg-[var(--admin-surface)] flex flex-col overflow-y-auto animate-in fade-in duration-200"
        >
          {/* Top Bar */}
          <div className="h-16 px-6 border-b border-[var(--admin-border)] bg-[var(--admin-card)] flex items-center justify-between gap-4 sticky top-0 z-30">
            <div className="flex items-center gap-3 min-w-0">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsFullEditorOpen(false)}
              >
                ← Back
              </Button>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[var(--admin-text)] truncate">
                  {editingArticle.title || "Untitled Article Draft"}
                </p>
                <p className="text-[10px] text-[var(--admin-text-muted)] truncate">
                  Author: {editingArticle.author.name} • Status: {editingArticle.status}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSaveArticle}
              >
                Save Draft
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setEditingArticle({ ...editingArticle, status: "published" });
                  setArticles((prev) =>
                    prev.map((a) =>
                      a.id === editingArticle.id ? { ...editingArticle, status: "published" } : a
                    )
                  );
                  showToast({
                    title: "Article Published",
                    description: `"${editingArticle.title}" is now live on the public atlas.`,
                    type: "success",
                  });
                  setIsFullEditorOpen(false);
                }}
              >
                Publish Article
              </Button>
            </div>
          </div>

          {/* Editor Body: 2 Columns */}
          <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Content (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Cover Image Placeholder */}
              <div
                onClick={() => {
                  setHasCoverImage(!hasCoverImage);
                  showToast({
                    title: hasCoverImage ? "Cover Image Removed" : "Cover Image Attached",
                    description: hasCoverImage
                      ? "Removed featured banner."
                      : "Default 1920x1080 banner applied.",
                    type: "info",
                  });
                }}
                className={cn(
                  "h-44 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center p-4 cursor-pointer transition-colors group",
                  hasCoverImage
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : "border-[var(--admin-border)] bg-[var(--admin-card)] hover:border-[var(--admin-primary)]"
                )}
              >
                <ImageIcon
                  className={cn(
                    "w-8 h-8 mb-2 transition-colors",
                    hasCoverImage ? "text-emerald-400" : "text-[var(--admin-text-muted)] group-hover:text-[var(--admin-primary)]"
                  )}
                />
                <p className="text-xs font-bold text-[var(--admin-text)]">
                  {hasCoverImage ? "Featured Cover Image Attached (Click to toggle)" : "Attach Featured Cover Image"}
                </p>
                <p className="text-[11px] text-[var(--admin-text-muted)] mt-0.5">
                  1920x1080 banner or browse media library.
                </p>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-2">
                <input
                  type="text"
                  aria-label="Article headline"
                  value={editingArticle.title}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, title: e.target.value })
                  }
                  placeholder="Article Headline..."
                  className="w-full text-2xl font-black bg-transparent text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none"
                />
                <input
                  type="text"
                  aria-label="Article subtitle"
                  value={editingArticle.subtitle || ""}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, subtitle: e.target.value })
                  }
                  placeholder="Subtitle or lead paragraph..."
                  className="w-full text-sm font-medium bg-transparent text-[var(--admin-text-muted)] focus:outline-none"
                />
              </div>

              {/* Rich Text Toolbar */}
              <div
                role="toolbar"
                aria-label="Text formatting options"
                className="flex items-center gap-1 p-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-[var(--admin-text-muted)]"
              >
                <button
                  type="button"
                  aria-pressed={activeFormats.bold}
                  aria-label="Bold text"
                  onClick={() => toggleFormat("bold")}
                  className={cn(
                    "p-1.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--admin-primary)]",
                    activeFormats.bold
                      ? "bg-[var(--admin-primary)]/20 text-[var(--admin-primary)]"
                      : "hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]"
                  )}
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-pressed={activeFormats.italic}
                  aria-label="Italic text"
                  onClick={() => toggleFormat("italic")}
                  className={cn(
                    "p-1.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--admin-primary)]",
                    activeFormats.italic
                      ? "bg-[var(--admin-primary)]/20 text-[var(--admin-primary)]"
                      : "hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]"
                  )}
                >
                  <Italic className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-[var(--admin-border)]" aria-hidden="true" />
                <button
                  type="button"
                  aria-pressed={activeFormats.h1}
                  aria-label="Heading 1"
                  onClick={() => toggleFormat("h1")}
                  className={cn(
                    "p-1.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--admin-primary)]",
                    activeFormats.h1
                      ? "bg-[var(--admin-primary)]/20 text-[var(--admin-primary)]"
                      : "hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]"
                  )}
                >
                  <Heading1 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-pressed={activeFormats.h2}
                  aria-label="Heading 2"
                  onClick={() => toggleFormat("h2")}
                  className={cn(
                    "p-1.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--admin-primary)]",
                    activeFormats.h2
                      ? "bg-[var(--admin-primary)]/20 text-[var(--admin-primary)]"
                      : "hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]"
                  )}
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-[var(--admin-border)]" aria-hidden="true" />
                <button
                  type="button"
                  aria-pressed={activeFormats.list}
                  aria-label="Unordered list"
                  onClick={() => toggleFormat("list")}
                  className={cn(
                    "p-1.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--admin-primary)]",
                    activeFormats.list
                      ? "bg-[var(--admin-primary)]/20 text-[var(--admin-primary)]"
                      : "hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]"
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Numbered list"
                  className="p-1.5 rounded hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--admin-primary)]"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-pressed={activeFormats.quote}
                  aria-label="Quote block"
                  onClick={() => toggleFormat("quote")}
                  className={cn(
                    "p-1.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--admin-primary)]",
                    activeFormats.quote
                      ? "bg-[var(--admin-primary)]/20 text-[var(--admin-primary)]"
                      : "hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]"
                  )}
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Code block"
                  className="p-1.5 rounded hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--admin-primary)]"
                >
                  <Code className="w-4 h-4" />
                </button>
              </div>

              {/* Body Textarea */}
              <textarea
                rows={14}
                aria-label="Article content body"
                value={articleContent}
                onChange={(e) => setArticleContent(e.target.value)}
                className="w-full p-4 rounded-2xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-sm text-[var(--admin-text)] leading-relaxed focus:outline-none focus:border-[var(--admin-primary)] font-serif"
              />
            </div>

            {/* Right Column: Checklist & SEO Preview (4 cols) */}
            <div className="lg:col-span-4 space-y-5">
              {/* Dynamic Pre-Publish Checklist */}
              <div className="p-5 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)]">
                    Pre-Publish Checklist
                  </h3>
                  <Badge
                    variant={completedChecklistCount === checklistItems.length ? "success" : "warning"}
                    size="sm"
                  >
                    {completedChecklistCount} of {checklistItems.length} Met
                  </Badge>
                </div>
                <div className="space-y-2 text-xs">
                  {checklistItems.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-center gap-2",
                        item.met ? "text-emerald-400" : "text-amber-400"
                      )}
                    >
                      {item.met ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 shrink-0" />
                      )}
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Google SEO Live Preview Box */}
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
                  <span className="block font-bold text-[var(--admin-text-muted)] mb-1">
                    Assigned Author
                  </span>
                  <p className="text-xs font-bold text-[var(--admin-text)]">
                    {editingArticle.author.name} ({editingArticle.author.role})
                  </p>
                </div>

                <div>
                  <span className="block font-bold text-[var(--admin-text-muted)] mb-1">
                    Tags
                  </span>
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
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsNewModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleCreateArticle}
            >
              Create & Launch Editor
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="new-article-title"
              className="block text-xs font-bold text-[var(--admin-text)] mb-1"
            >
              Article Headline
            </label>
            <input
              id="new-article-title"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Vice City Beachfront Map Comparison"
              className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
            />
          </div>

          <div>
            <label
              htmlFor="new-article-category"
              className="block text-xs font-bold text-[var(--admin-text)] mb-1"
            >
              Category
            </label>
            <select
              id="new-article-category"
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
