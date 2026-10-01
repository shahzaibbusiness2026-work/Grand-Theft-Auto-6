"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Plus, Trash2, Pencil, RefreshCw, Star } from "lucide-react";
import { DataTable, Column } from "@/components/admin/data-table";
import { Badge } from "@/components/admin/ui/badge";
import { getAdminGuides, saveGuide, deleteGuide } from "@/lib/services/guides";
import type { GuideRecord } from "@/lib/services/guides";
import { useToast } from "@/components/admin/toast";
import { Modal } from "@/components/admin/modal";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "Getting Started",
  "Money & Economy",
  "Locations",
  "Weapons",
  "Characters",
  "Activities",
  "Story & Missions",
  "Vehicles",
];

const EMPTY_FORM: GuideRecord = {
  id: "",
  title: "",
  description: "",
  category: "Getting Started",
  read_time: "10 min read",
  image: "/img/hero-dark.jpg",
  tag: "",
  status: "published",
  featured: false,
  popular: false,
};

export default function AdminGuidesPage() {
  const { showToast } = useToast();
  const [guides, setGuides] = useState<GuideRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState<GuideRecord>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const loadGuides = () => {
    setIsLoading(true);
    getAdminGuides()
      .then(setGuides)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadGuides();
  }, []);

  const openCreate = () => {
    setForm({ ...EMPTY_FORM });
    setEditorOpen(true);
  };

  const openEdit = (g: GuideRecord) => {
    setForm({ ...g });
    setEditorOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      showToast({ title: "Title required", description: "Enter a guide title.", type: "danger" });
      return;
    }
    setSaving(true);
    const res = await saveGuide({
      title: form.title,
      slug: form.slug,
      description: form.description,
      category: form.category,
      read_time: form.read_time,
      image: form.image,
      tag: form.tag,
      status: form.status,
      featured: Boolean(form.featured),
      popular: Boolean(form.popular),
      id: form.id || undefined,
    });
    setSaving(false);
    if (res.success) {
      showToast({
        title: form.id ? "Guide Updated" : "Guide Created",
        description: `${form.title} saved to Supabase.`,
        type: "success",
      });
      setEditorOpen(false);
      loadGuides();
    } else {
      showToast({ title: "Save failed", description: res.error, type: "danger" });
    }
  };

  const handleDelete = async (id: string) => {
    setGuides((prev) => prev.filter((g) => g.id !== id));
    const res = await deleteGuide(id);
    if (res.success) {
      showToast({ title: "Guide Deleted", description: "Removed from Supabase.", type: "success" });
    } else {
      showToast({ title: "Delete failed", description: res.error, type: "danger" });
      loadGuides();
    }
  };

  const columns: Column<GuideRecord>[] = [
    {
      key: "title",
      header: "Guide",
      sortable: true,
      render: (g) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
          <div className="min-w-0">
            <span className="font-bold text-[var(--admin-text)] block truncate">{g.title}</span>
            <span className="text-[11px] text-[var(--admin-text-muted)]">{g.read_time || "—"}</span>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (g) => <Badge variant="neutral" size="sm">{g.category}</Badge>,
    },
    {
      key: "status",
      header: "Status",
      render: (g) => (
        <Badge variant={g.status === "published" ? "success" : "warning"} size="sm" dot>
          {g.status || "published"}
        </Badge>
      ),
    },
    {
      key: "views",
      header: "Views",
      sortable: true,
      render: (g) => <span className="font-mono text-[11px] text-[var(--admin-text-muted)]">{(g.views ?? 0).toLocaleString()}</span>,
    },
    {
      key: "featured",
      header: "Flags",
      render: (g) => (
        <div className="flex items-center gap-1.5 text-[11px]">
          {g.featured && (
            <span className="px-1.5 py-0.5 rounded bg-[#2A2015] text-[#E5A83B] border border-[#4A3818]">Featured</span>
          )}
          {g.popular && (
            <span className="px-1.5 py-0.5 rounded bg-[#12291B] text-[#4ADE80] border border-[#1F4D2E] inline-flex items-center gap-1">
              <Star className="w-3 h-3" /> Popular
            </span>
          )}
          {!g.featured && !g.popular && <span className="text-[var(--admin-text-muted)]">—</span>}
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (g) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openEdit(g);
            }}
            className="p-1.5 rounded-lg text-[var(--admin-text-muted)] hover:text-white hover:bg-[#1C2436] transition-colors"
            title="Edit"
            aria-label={`Edit ${g.title}`}
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(g.id);
            }}
            className="p-1.5 rounded-lg text-[var(--admin-text-muted)] hover:text-[#F87171] hover:bg-[#1C2436] transition-colors"
            title="Delete"
            aria-label={`Delete ${g.title}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const inputCls =
    "w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1]";
  const labelCls = "block text-[11px] font-medium text-[#94A3B8] mb-1";

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--admin-border-subtle)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--admin-text)] tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-[var(--admin-primary)]" />
            <span>Guides</span>
          </h1>
          <p className="text-xs text-[var(--admin-text-muted)] mt-1">
            Manage the guides shown on the public Guides page.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadGuides}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#111622] border border-[#1C2436] text-[#94A3B8] hover:text-white text-xs font-semibold transition-colors"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin")} />
            Refresh
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold transition-all w-fit"
          >
            <Plus className="w-4 h-4" />
            Add guide
          </button>
        </div>
      </div>

      <DataTable
        data={guides}
        columns={columns}
        selectable
        emptyState={
          <div className="p-8 text-center">
            <BookOpen className="w-8 h-8 text-[#243048] mx-auto mb-3" />
            <p className="text-xs font-semibold text-[var(--admin-text)]">
              {isLoading ? "Loading guides…" : "No guides found."}
            </p>
            {!isLoading && (
              <p className="text-[11px] text-[var(--admin-text-muted)] mt-1">
                Add your first guide to publish it on the public site.
              </p>
            )}
          </div>
        }
      />

      <Modal isOpen={editorOpen} onClose={() => setEditorOpen(false)} title={form.id ? "Edit guide" : "Add guide"} size="lg">
        <div className="space-y-3.5 text-xs">
          <div>
            <label htmlFor="guide-title" className={labelCls}>
              Title <span className="text-red-400">*</span>
            </label>
            <input
              id="guide-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="guide-desc" className={labelCls}>Description</label>
            <textarea
              id="guide-desc"
              rows={3}
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-3 rounded-xl bg-[#0E131D] border border-[#1C2436] text-white resize-none focus:outline-none focus:border-[#6366F1]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="guide-category" className={labelCls}>Category</label>
              <select
                id="guide-category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputCls}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="guide-status" className={labelCls}>Status</label>
              <select
                id="guide-status"
                value={form.status || "published"}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={inputCls}
              >
                <option value="published">published</option>
                <option value="draft">draft</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="guide-read" className={labelCls}>Read time</label>
              <input
                id="guide-read"
                type="text"
                value={form.read_time || ""}
                onChange={(e) => setForm({ ...form, read_time: e.target.value })}
                placeholder="10 min read"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="guide-tag" className={labelCls}>Tag</label>
              <input
                id="guide-tag"
                type="text"
                value={form.tag || ""}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="guide-image" className={labelCls}>Image URL</label>
              <input
                id="guide-image"
                type="text"
                value={form.image || ""}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="/img/hero-dark.jpg"
                className={cn(inputCls, "font-mono")}
              />
            </div>
          </div>
          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-white">
              <input
                type="checkbox"
                checked={Boolean(form.featured)}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="rounded border-[#2A344A] bg-[#0E131D] text-[#6366F1] focus:ring-0"
              />
              <span className="text-[#94A3B8]">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-white">
              <input
                type="checkbox"
                checked={Boolean(form.popular)}
                onChange={(e) => setForm({ ...form, popular: e.target.checked })}
                className="rounded border-[#2A344A] bg-[#0E131D] text-[#6366F1] focus:ring-0"
              />
              <span className="text-[#94A3B8]">Popular</span>
            </label>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditorOpen(false)}
              className="px-3 py-2 rounded-lg text-[#94A3B8] hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save guide"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
