"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Eye,
  History,
  ImageIcon,
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  RotateCcw,
  RotateCw,
  Search,
  Plus,
  X,
  Globe,
  CheckSquare,
  Square,
  ChevronDown,
} from "lucide-react";
import { useToast } from "@/components/admin/toast";
import { INITIAL_ADMIN_ARTICLES, AdminArticle } from "@/lib/admin-store";
import { cn } from "@/lib/utils";

export default function ArticleEditPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  const articleId = (params?.id as string) || "art-3";
  const existingArticle =
    INITIAL_ADMIN_ARTICLES.find((a) => a.id === articleId) || {
      id: articleId,
      slug: "guides/using-the-atlas-map",
      title: articleId === "new" ? "New Article Draft" : "How to use the Atlas map",
      subtitle: "A guide to getting the most out of the interactive map.",
      excerpt:
        "Learn how to use the Atlas map, filter markers, inspect linked records and review source notes before planning a route.",
      status: "draft" as AdminArticle["status"],
      category: "Guides",
      author: { name: "Alex", avatar: "AL", role: "Administrator" },
      updatedAt: "Sep 20, 2026",
      views: 3420,
      readTime: "5 min read",
      tags: ["Map", "Research"],
      revisions: [],
    };

  const [article, setArticle] = useState<AdminArticle>(existingArticle);
  const [slug, setSlug] = useState("guides/using-the-atlas-map");
  const [sources, setSources] = useState<string[]>([
    "https://example.com/source/atlas-map-guide",
  ]);
  const [relatedRecords, setRelatedRecords] = useState<string[]>([
    "Vehicle V-001",
    "Location L-001",
  ]);
  const [tags, setTags] = useState<string[]>(["Map", "Research"]);

  // Checklist items matching Image 9
  const [checklist, setChecklist] = useState({
    contentReviewed: true,
    sourceReferencesAdded: true,
    relatedRecordsLinked: false,
    seoCompleted: false,
    readyToSchedule: false,
  });

  // SEO fields matching Image 9
  const [metaTitle, setMetaTitle] = useState("How to use the Atlas map | GTA 6 Atlas");
  const [metaDescription, setMetaDescription] = useState(
    "Learn how to use the Atlas map, filter markers, inspect linked records and review source notes before planning a route."
  );
  const [canonicalUrl, setCanonicalUrl] = useState(
    "https://example.com/guides/using-the-atlas-map"
  );

  const handleSchedule = () => {
    showToast({
      title: "Article Scheduled",
      description: `"${article.title}" has been scheduled for publication.`,
      type: "success",
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Actions Bar matching Image 9 */}
      <div className="space-y-3">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-[#94A3B8]"
        >
          <Link href="/admin/articles" className="hover:text-white transition-colors">
            Articles
          </Link>
          <span className="text-[#64748B]">&gt;</span>
          <span className="text-white font-medium">Edit article</span>
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
                Edit article
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2A2015] border border-[#4A3818] text-[#E5A83B]">
                Demo data
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-[#94A3B8]">
              <span>This is a demo article. No claims of an accurate game map or final content are made.</span>
              <span className="text-[#64748B]">•</span>
              <span className="text-[#64748B]">Autosaved 20 seconds ago</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#111622] hover:bg-[#161F30] border border-[#1C2436] text-[#94A3B8] hover:text-white text-xs font-semibold transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#111622] hover:bg-[#161F30] border border-[#1C2436] text-[#94A3B8] hover:text-white text-xs font-semibold transition-colors"
            >
              <History className="w-3.5 h-3.5" />
              <span>Revision history</span>
            </button>
            <button
              type="button"
              onClick={handleSchedule}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold transition-all shadow-md shadow-indigo-500/20 active:scale-[0.98]"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule article</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Form Grid matching Image 9 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Editor Content (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Title Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="article-title"
              className="block text-xs font-medium text-[#94A3B8]"
            >
              Title <span className="text-red-400">*</span>
            </label>
            <input
              id="article-title"
              type="text"
              value={article.title}
              onChange={(e) => setArticle({ ...article, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#111622] border border-[#1C2436] text-sm font-semibold text-white focus:outline-none focus:border-[#6366F1] transition-colors"
            />
          </div>

          {/* Slug Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="article-slug"
              className="block text-xs font-medium text-[#94A3B8]"
            >
              Slug <span className="text-red-400">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-xs text-[#64748B] font-mono">/</span>
              <input
                id="article-slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full pl-7 pr-4 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs font-mono text-white focus:outline-none focus:border-[#6366F1] transition-colors"
              />
            </div>
            <p className="text-[11px] text-[#64748B]">
              This will be used in the article URL.
            </p>
          </div>

          {/* Cover Image Container matching Image 9 */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#94A3B8]">
              Cover image
            </label>
            <div className="relative h-44 rounded-2xl border border-[#1C2436] overflow-hidden group bg-gradient-to-r from-blue-950/40 via-purple-950/40 to-indigo-950/40">
              {/* Cityscape placeholder background */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
                style={{
                  backgroundImage: "url('/img/hero-vice-skyline-hd.jpg')",
                }}
              />
              <div className="absolute inset-0 bg-[#0B0E14]/60 backdrop-blur-[1px] flex flex-col items-center justify-center text-center p-4">
                <div className="w-10 h-10 rounded-xl bg-[#182030]/80 border border-[#243048] flex items-center justify-center text-white mb-2">
                  <ImageIcon className="w-5 h-5 text-[#818CF8]" />
                </div>
                <p className="text-xs font-bold text-white">
                  Click to replace cover image
                </p>
                <p className="text-[11px] text-[#64748B] mt-0.5">
                  JPG, PNG or WebP. Recommended 1200 × 630.
                </p>
              </div>

              <button
                type="button"
                className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-[#111622]/90 hover:bg-[#182030] border border-[#1C2436] text-xs font-semibold text-white transition-colors"
              >
                Replace cover
              </button>
            </div>
          </div>

          {/* Rich Text Editor matching Image 9 */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#94A3B8]">
              Content <span className="text-red-400">*</span>
            </label>

            <div className="rounded-xl border border-[#1C2436] bg-[#111622] overflow-hidden">
              {/* Toolbar matching Image 9: Paragraph ∨, H2, B, I, 🔗, •–, 1.–, ❝, ↶, ↷ */}
              <div className="flex items-center gap-1 p-2 border-b border-[#1C2436] bg-[#0E131D] text-[#94A3B8] text-xs flex-wrap">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-[#182030] text-white font-medium transition-colors"
                >
                  <span>Paragraph</span>
                  <ChevronDown className="w-3 h-3 text-[#64748B]" />
                </button>
                <div className="h-4 w-px bg-[#1C2436] mx-1" />
                <button
                  type="button"
                  className="px-2 py-1 rounded hover:bg-[#182030] hover:text-white font-bold transition-colors"
                  title="Heading 2"
                >
                  H2
                </button>
                <button
                  type="button"
                  className="p-1 rounded hover:bg-[#182030] hover:text-white transition-colors"
                  title="Bold"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  className="p-1 rounded hover:bg-[#182030] hover:text-white transition-colors"
                  title="Italic"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  className="p-1 rounded hover:bg-[#182030] hover:text-white transition-colors"
                  title="Link"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                </button>
                <div className="h-4 w-px bg-[#1C2436] mx-1" />
                <button
                  type="button"
                  className="p-1 rounded hover:bg-[#182030] hover:text-white transition-colors"
                  title="Bullet list"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  className="p-1 rounded hover:bg-[#182030] hover:text-white transition-colors"
                  title="Numbered list"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  className="p-1 rounded hover:bg-[#182030] hover:text-white transition-colors"
                  title="Quote"
                >
                  <Quote className="w-3.5 h-3.5" />
                </button>
                <div className="h-4 w-px bg-[#1C2436] mx-1" />
                <button
                  type="button"
                  className="p-1 rounded hover:bg-[#182030] hover:text-white transition-colors"
                  title="Undo"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  className="p-1 rounded hover:bg-[#182030] hover:text-white transition-colors"
                  title="Redo"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Formatted Content Area matching Image 9 */}
              <div className="p-4 space-y-3.5 text-xs text-[#E2E8F0] min-h-[220px]">
                <p className="leading-relaxed">
                  Filter markers by category, inspect linked records and review source notes before planning a route.
                </p>

                <h3 className="text-base font-bold text-white pt-2">
                  Check verification labels
                </h3>

                <p className="leading-relaxed">
                  Look for verification labels on markers and records to understand what is confirmed, unconfirmed or speculative. This helps set the right expectations while exploring the map and related content.
                </p>
              </div>
            </div>
          </div>

          {/* Source References matching Image 9 */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-[#94A3B8]">
              Source references
            </label>
            {sources.map((src, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    defaultValue={src}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setSources(sources.filter((_, idx) => idx !== i))}
                  className="p-2 rounded-lg text-[#64748B] hover:text-white hover:bg-[#182030] transition-colors"
                  aria-label="Remove source"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setSources([...sources, "https://example.com"])}
              className="text-xs font-semibold text-[#818CF8] hover:underline inline-flex items-center gap-1 mt-1"
            >
              <span>+ Add another source</span>
            </button>
          </div>

          {/* Related Records matching Image 9 */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-[#94A3B8]">
              Related records
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search vehicles, locations, characters, missions..."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1]"
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {relatedRecords.map((rec) => (
                <span
                  key={rec}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141B2A] border border-[#243048] text-xs text-white"
                >
                  <span>{rec}</span>
                  <button
                    type="button"
                    onClick={() => setRelatedRecords(relatedRecords.filter((r) => r !== rec))}
                    className="text-[#64748B] hover:text-white"
                    aria-label={`Remove ${rec}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar Cards matching Image 9 (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 1: Publication */}
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-3.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Publication
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label
                  htmlFor="article-pub-status"
                  className="block text-[11px] font-medium text-[#94A3B8] mb-1"
                >
                  Status
                </label>
                <select
                  id="article-pub-status"
                  defaultValue="draft"
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                >
                  <option value="draft">● Draft</option>
                  <option value="review">● Review</option>
                  <option value="published">● Published</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="article-author"
                  className="block text-[11px] font-medium text-[#94A3B8] mb-1"
                >
                  Author
                </label>
                <select
                  id="article-author"
                  defaultValue="alex"
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                >
                  <option value="alex">AL Alex</option>
                  <option value="jamie">JL Jamie Lee</option>
                  <option value="morgan">MK Morgan Kim</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="article-category-input"
                  className="block text-[11px] font-medium text-[#94A3B8] mb-1"
                >
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  id="article-category-input"
                  defaultValue="Guides"
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                >
                  <option value="Guides">Guides</option>
                  <option value="News">News</option>
                  <option value="Vehicles">Vehicles</option>
                  <option value="Analysis">Analysis</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#94A3B8] mb-1">
                  Tags
                </label>
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
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-[#64748B] mt-1">
                  Add tags to help classify this article.
                </p>
              </div>

              <div>
                <label
                  htmlFor="article-publish-date"
                  className="block text-[11px] font-medium text-[#94A3B8] mb-1"
                >
                  Publish date
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="article-publish-date"
                    type="text"
                    defaultValue="Sep 24 2026 09:00 UTC"
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white font-mono focus:outline-none focus:border-[#6366F1]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="article-visibility"
                  className="block text-[11px] font-medium text-[#94A3B8] mb-1"
                >
                  Visibility
                </label>
                <select
                  id="article-visibility"
                  defaultValue="public"
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                >
                  <option value="public">🌐 Public</option>
                  <option value="internal">🔒 Internal</option>
                </select>
                <p className="text-[10px] text-[#64748B] mt-1">
                  Controls who can view this article.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Pre-publish checklist matching Image 9 */}
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-3.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Pre-publish checklist
            </h3>

            <div className="space-y-2.5 text-xs">
              <label className="flex items-center gap-2.5 cursor-pointer text-white">
                <input
                  type="checkbox"
                  checked={checklist.contentReviewed}
                  onChange={(e) =>
                    setChecklist({ ...checklist, contentReviewed: e.target.checked })
                  }
                  className="rounded border-[#2A344A] bg-[#0E131D] text-[#6366F1] focus:ring-0"
                />
                <span className={cn(checklist.contentReviewed ? "text-white" : "text-[#94A3B8]")}>
                  Content reviewed
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-white">
                <input
                  type="checkbox"
                  checked={checklist.sourceReferencesAdded}
                  onChange={(e) =>
                    setChecklist({
                      ...checklist,
                      sourceReferencesAdded: e.target.checked,
                    })
                  }
                  className="rounded border-[#2A344A] bg-[#0E131D] text-[#6366F1] focus:ring-0"
                />
                <span className={cn(checklist.sourceReferencesAdded ? "text-white" : "text-[#94A3B8]")}>
                  Source references added
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-white">
                <input
                  type="checkbox"
                  checked={checklist.relatedRecordsLinked}
                  onChange={(e) =>
                    setChecklist({
                      ...checklist,
                      relatedRecordsLinked: e.target.checked,
                    })
                  }
                  className="rounded border-[#2A344A] bg-[#0E131D] text-[#6366F1] focus:ring-0"
                />
                <span className={cn(checklist.relatedRecordsLinked ? "text-white" : "text-[#94A3B8]")}>
                  Related records linked
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-white">
                <input
                  type="checkbox"
                  checked={checklist.seoCompleted}
                  onChange={(e) =>
                    setChecklist({ ...checklist, seoCompleted: e.target.checked })
                  }
                  className="rounded border-[#2A344A] bg-[#0E131D] text-[#6366F1] focus:ring-0"
                />
                <span className={cn(checklist.seoCompleted ? "text-white" : "text-[#94A3B8]")}>
                  SEO details completed
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-white">
                <input
                  type="checkbox"
                  checked={checklist.readyToSchedule}
                  onChange={(e) =>
                    setChecklist({ ...checklist, readyToSchedule: e.target.checked })
                  }
                  className="rounded border-[#2A344A] bg-[#0E131D] text-[#6366F1] focus:ring-0"
                />
                <span className={cn(checklist.readyToSchedule ? "text-white" : "text-[#94A3B8]")}>
                  Ready to schedule
                </span>
              </label>
            </div>
          </div>

          {/* Card 3: SEO matching Image 9 (with Google Search Preview Snippet!) */}
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              SEO
            </h3>

            {/* Google Search Result Preview Box */}
            <div className="space-y-1">
              <p className="text-[11px] font-medium text-[#64748B]">Search result preview</p>
              <div className="p-3 rounded-xl bg-[#0E131D] border border-[#1C2436] space-y-1">
                <p className="text-[10px] text-[#94A3B8]">GTA 6 Atlas</p>
                <p className="text-xs font-semibold text-[#818CF8] hover:underline cursor-pointer">
                  {article.title || "How to use the Atlas map"}
                </p>
                <p className="text-[10px] text-emerald-400 font-mono truncate">
                  {canonicalUrl}
                </p>
                <p className="text-[11px] text-[#94A3B8] line-clamp-2 leading-tight">
                  {metaDescription}
                </p>
              </div>
            </div>

            {/* Meta Title */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="meta-title-input"
                  className="block text-[11px] font-medium text-[#94A3B8]"
                >
                  Meta title
                </label>
                <span className="text-[10px] font-mono text-[#64748B]">
                  {metaTitle.length} / 60
                </span>
              </div>
              <input
                id="meta-title-input"
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
              />
            </div>

            {/* Meta Description */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="meta-desc-input"
                  className="block text-[11px] font-medium text-[#94A3B8]"
                >
                  Meta description
                </label>
                <span className="text-[10px] font-mono text-[#64748B]">
                  {metaDescription.length} / 160
                </span>
              </div>
              <textarea
                id="meta-desc-input"
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1] resize-none"
              />
            </div>

            {/* Canonical URL */}
            <div className="space-y-1">
              <label
                htmlFor="canonical-url-input"
                className="block text-[11px] font-medium text-[#94A3B8]"
              >
                Canonical URL
              </label>
              <div className="relative">
                <LinkIcon className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="canonical-url-input"
                  type="text"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white font-mono focus:outline-none focus:border-[#6366F1]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
