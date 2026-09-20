"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  Archive, 
  RotateCcw, 
  History, 
  Calendar,
  Eye,
  Tag,
  X,
  Send,
  AlertCircle
} from "lucide-react";
import { 
  INITIAL_ADMIN_ARTICLES, 
  AdminArticle, 
  ArticleStatus, 
  ArticleRevision 
} from "@/lib/admin-data";
import { cn } from "@/lib/utils";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<AdminArticle[]>(INITIAL_ADMIN_ARTICLES);
  const [selectedStatus, setSelectedStatus] = useState<"all" | ArticleStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRevisionArticle, setActiveRevisionArticle] = useState<AdminArticle | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form state for creating a new article
  const [newTitle, setNewTitle] = useState("");
  const [newExcerpt, setNewExcerpt] = useState("");
  const [newCategory, setNewCategory] = useState("Map Analysis");
  const [newAuthor, setNewAuthor] = useState("Elena Rostova");
  const [newStatus, setNewStatus] = useState<ArticleStatus>("draft");
  const [newTags, setNewTags] = useState("GTA 6, Analysis");

  // Filtering
  const filteredArticles = articles.filter((art) => {
    const matchesStatus = selectedStatus === "all" || art.status === selectedStatus;
    const matchesSearch = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      art.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Action handlers
  const handleStatusChange = (id: string, nextStatus: ArticleStatus, note: string) => {
    setArticles(prev => prev.map(art => {
      if (art.id !== id) return art;
      const newRev: ArticleRevision = {
        id: `rev-${Date.now()}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
        author: "Current Editor",
        summary: note
      };
      return {
        ...art,
        status: nextStatus,
        updatedAt: new Date().toISOString(),
        publishedAt: nextStatus === "published" ? new Date().toISOString() : art.publishedAt,
        revisions: [newRev, ...art.revisions]
      };
    }));
  };

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newSlug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const created: AdminArticle = {
      id: `art-${Date.now()}`,
      slug: newSlug,
      title: newTitle,
      excerpt: newExcerpt || "No excerpt provided.",
      category: newCategory,
      author: newAuthor,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      publishedAt: newStatus === "published" ? new Date().toISOString() : undefined,
      views: 0,
      readTime: "5 min read",
      tags: newTags.split(",").map(t => t.trim()).filter(Boolean),
      revisions: [
        {
          id: `rev-${Date.now()}`,
          timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
          author: newAuthor,
          summary: `Article created with status "${newStatus}".`
        }
      ]
    };

    setArticles([created, ...articles]);
    setIsCreateModalOpen(false);
    setNewTitle("");
    setNewExcerpt("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
            Editorial & Publication Workflow
          </h1>
          <p className="text-sm text-[#94A3BD] mt-1">
            Manage drafts, schedule upcoming analysis pieces, review revisions, and control live status.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#B8AAFF] hover:bg-[#A898F0] text-[#171127] text-xs font-black uppercase tracking-wider transition-colors shadow-lg shadow-[#B8AAFF]/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Article</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-[#33415C] bg-[#141C2E] p-4 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(["all", "published", "scheduled", "draft", "archived"] as const).map((status) => {
            const isActive = selectedStatus === status;
            const count = status === "all" ? articles.length : articles.filter(a => a.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 whitespace-nowrap",
                  isActive
                    ? "bg-[#B8AAFF] text-[#171127]"
                    : "bg-[#1C2740] text-[#94A3BD] hover:text-white hover:bg-[#253352]"
                )}
              >
                <span>{status}</span>
                <span className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px]",
                  isActive ? "bg-[#171127]/20 text-[#171127]" : "bg-[#33415C] text-[#B5C0D4]"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Box */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3BD]" />
          <input
            type="text"
            placeholder="Search by title, author, tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#33415C] bg-[#1C2740] text-xs text-white placeholder-[#94A3BD] focus:outline-none focus:border-[#B8AAFF] transition-colors"
          />
        </div>
      </div>

      {/* Article List */}
      <div className="space-y-3">
        {filteredArticles.length === 0 ? (
          <div className="rounded-2xl border border-[#33415C] bg-[#141C2E] p-12 text-center">
            <AlertCircle className="w-10 h-10 text-[#94A3BD] mx-auto mb-3" />
            <h3 className="font-display text-base font-bold text-white">No articles found</h3>
            <p className="text-xs text-[#94A3BD] mt-1">No articles match the current filter or search criteria.</p>
          </div>
        ) : (
          filteredArticles.map((art) => (
            <div 
              key={art.id}
              className="rounded-2xl border border-[#33415C] bg-[#141C2E] p-5 hover:border-[#66748F] transition-all flex flex-col lg:flex-row gap-5 lg:items-center justify-between"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Status Badge */}
                  {art.status === "published" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" /> Published
                    </span>
                  )}
                  {art.status === "scheduled" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/60 border border-amber-800/40 text-amber-400">
                      <Clock className="w-3 h-3" /> Scheduled ({art.scheduledFor?.substring(0, 10)})
                    </span>
                  )}
                  {art.status === "draft" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1C2740] border border-[#33415C] text-[#B8AAFF]">
                      <FileText className="w-3 h-3" /> Draft
                    </span>
                  )}
                  {art.status === "archived" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1C2740] border border-[#33415C] text-[#94A3BD]">
                      <Archive className="w-3 h-3" /> Archived
                    </span>
                  )}

                  <span className="text-[11px] font-semibold text-[#94A3BD]">{art.category}</span>
                  <span className="text-[#33415C]">•</span>
                  <span className="text-[11px] text-[#B5C0D4]">By {art.author}</span>
                  <span className="text-[#33415C]">•</span>
                  <span className="text-[11px] text-[#94A3BD]">{art.readTime}</span>
                </div>

                <h3 className="font-display text-base font-bold text-white">
                  {art.title}
                </h3>

                <p className="text-xs text-[#B5C0D4] line-clamp-2 max-w-3xl">
                  {art.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {art.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#1C2740] border border-[#33415C]/50 text-[10px] text-[#94A3BD]"
                    >
                      <Tag className="w-2.5 h-2.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions & Revision Button */}
              <div className="flex flex-wrap items-center gap-2 border-t lg:border-t-0 pt-3 lg:pt-0 border-[#33415C]/60 shrink-0">
                {/* Revision History Trigger */}
                <button
                  onClick={() => setActiveRevisionArticle(art)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#33415C] bg-[#1C2740] hover:bg-[#253352] text-xs font-semibold text-[#B5C0D4] hover:text-white transition-colors"
                  title="View revision log"
                >
                  <History className="w-3.5 h-3.5 text-[#B8AAFF]" />
                  <span>Revisions ({art.revisions.length})</span>
                </button>

                {/* Workflow Transitions */}
                {art.status === "draft" && (
                  <>
                    <button
                      onClick={() => handleStatusChange(art.id, "scheduled", "Article reviewed and scheduled for release.")}
                      className="px-3 py-1.5 rounded-lg border border-amber-800/40 bg-amber-950/40 hover:bg-amber-900/50 text-xs font-bold text-amber-300 transition-colors"
                    >
                      Schedule
                    </button>
                    <button
                      onClick={() => handleStatusChange(art.id, "published", "Instant editorial publication.")}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors"
                    >
                      Publish
                    </button>
                  </>
                )}

                {art.status === "scheduled" && (
                  <button
                    onClick={() => handleStatusChange(art.id, "published", "Manual early publication triggered.")}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors"
                  >
                    Publish Now
                  </button>
                )}

                {art.status === "published" && (
                  <button
                    onClick={() => handleStatusChange(art.id, "archived", "Archived from public index.")}
                    className="px-3 py-1.5 rounded-lg border border-[#33415C] bg-[#1C2740] hover:bg-[#253352] text-xs font-semibold text-[#94A3BD] hover:text-white transition-colors"
                  >
                    Archive
                  </button>
                )}

                {art.status === "archived" && (
                  <button
                    onClick={() => handleStatusChange(art.id, "draft", "Restored to draft for re-editing.")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#33415C] bg-[#1C2740] hover:bg-[#253352] text-xs font-semibold text-[#B8AAFF] transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore Draft</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Revision History Modal / Drawer */}
      {activeRevisionArticle && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl border border-[#33415C] bg-[#141C2E] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#33415C] pb-4">
              <div>
                <h3 className="font-display text-base font-bold text-white">
                  Revision History & Audit Log
                </h3>
                <p className="text-xs text-[#94A3BD] mt-0.5 line-clamp-1">
                  {activeRevisionArticle.title}
                </p>
              </div>
              <button
                onClick={() => setActiveRevisionArticle(null)}
                className="p-1 rounded-lg text-[#94A3BD] hover:text-white hover:bg-[#1C2740] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {activeRevisionArticle.revisions.map((rev, index) => (
                <div 
                  key={rev.id}
                  className="p-3.5 rounded-xl border border-[#33415C] bg-[#1C2740]/60 space-y-1 relative"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#B8AAFF]">{rev.author}</span>
                    <span className="font-mono text-[#94A3BD]">{rev.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#F5F7FC]">{rev.summary}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#33415C] flex justify-end">
              <button
                onClick={() => setActiveRevisionArticle(null)}
                className="px-4 py-2 rounded-xl bg-[#1C2740] hover:bg-[#253352] text-xs font-bold text-white transition-colors"
              >
                Close Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Article Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form 
            onSubmit={handleCreateArticle}
            className="w-full max-w-xl rounded-2xl border border-[#33415C] bg-[#141C2E] p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#33415C] pb-3">
              <h3 className="font-display text-base font-bold text-white">
                Create New Editorial Article
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-[#94A3BD] hover:text-white hover:bg-[#1C2740] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3BD] mb-1">
                  Article Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next-Gen Vice City Weather System Deep Dive"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#33415C] bg-[#1C2740] text-xs text-white focus:outline-none focus:border-[#B8AAFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3BD] mb-1">
                  Summary / Excerpt
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief synopsis for card previews and meta descriptions..."
                  value={newExcerpt}
                  onChange={(e) => setNewExcerpt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#33415C] bg-[#1C2740] text-xs text-white focus:outline-none focus:border-[#B8AAFF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3BD] mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#33415C] bg-[#1C2740] text-xs text-white focus:outline-none focus:border-[#B8AAFF]"
                  >
                    <option value="Map Analysis">Map Analysis</option>
                    <option value="Combat">Combat</option>
                    <option value="Vehicles">Vehicles</option>
                    <option value="Story & Lore">Story & Lore</option>
                    <option value="Fact Check">Fact Check</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3BD] mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#33415C] bg-[#1C2740] text-xs text-white focus:outline-none focus:border-[#B8AAFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3BD] mb-1">
                    Initial Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ArticleStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-[#33415C] bg-[#1C2740] text-xs text-white focus:outline-none focus:border-[#B8AAFF]"
                  >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3BD] mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Weather, Vice City, Graphics"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#33415C] bg-[#1C2740] text-xs text-white focus:outline-none focus:border-[#B8AAFF]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#33415C] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#33415C] bg-[#1C2740] hover:bg-[#253352] text-xs font-bold text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#B8AAFF] hover:bg-[#A898F0] text-[#171127] text-xs font-black uppercase tracking-wider transition-colors"
              >
                Save Article
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
