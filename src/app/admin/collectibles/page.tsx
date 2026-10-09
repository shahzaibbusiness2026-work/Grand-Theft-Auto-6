"use client";

import React, { useState, useEffect } from "react";
import { Package, Plus, Trash2, Pencil, RefreshCw } from "lucide-react";
import { DataTable, Column } from "@/components/admin/data-table";
import { Badge } from "@/components/admin/ui/badge";
import { getAdminCollectibles, saveCollectible, deleteCollectible } from "@/lib/services/collectibles";
import type { CollectibleRecord } from "@/lib/services/collectibles";
import { useToast } from "@/components/admin/toast";
import { Modal } from "@/components/admin/modal";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "Hidden Packages",
  "Collectibles",
  "Treasure Hunt",
  "Sabotage",
  "Side Activity",
];

const EMPTY_FORM: CollectibleRecord = {
  id: "",
  title: "",
  category: "Hidden Packages",
  district: "",
  reward: "",
  description: "",
  guide_tip: "",
  img: "",
  status: "published",
};

export default function AdminCollectiblesPage() {
  const { showToast } = useToast();
  const [collectibles, setCollectibles] = useState<CollectibleRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState<CollectibleRecord>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const loadCollectibles = () => {
    setIsLoading(true);
    getAdminCollectibles()
      .then(setCollectibles)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadCollectibles();
  }, []);

  const openCreate = () => {
    setForm({ ...EMPTY_FORM });
    setEditorOpen(true);
  };

  const openEdit = (c: CollectibleRecord) => {
    setForm({ ...c });
    setEditorOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      showToast({ title: "Title required", description: "Enter a collectible title.", type: "danger" });
      return;
    }
    setSaving(true);
    const res = await saveCollectible({
      ...form,
      id: form.id || undefined,
      title: form.title,
      category: form.category || "Hidden Packages",
      district: form.district || undefined,
      reward: form.reward || undefined,
      description: form.description || undefined,
      guide_tip: form.guide_tip || undefined,
      img: form.img || undefined,
      status: form.status || "published",
    });
    setSaving(false);
    if (res.success) {
      showToast({
        title: form.id ? "Collectible Updated" : "Collectible Created",
        description: `${form.title} saved to Supabase.`,
        type: "success",
      });
      setEditorOpen(false);
      loadCollectibles();
    } else {
      showToast({ title: "Save failed", description: res.error, type: "danger" });
    }
  };

  const handleDelete = async (id: string) => {
    setCollectibles((prev) => prev.filter((c) => c.id !== id));
    const res = await deleteCollectible(id);
    if (res.success) {
      showToast({ title: "Collectible Deleted", description: "Removed from Supabase.", type: "success" });
    } else {
      showToast({ title: "Delete failed", description: res.error, type: "danger" });
      loadCollectibles();
    }
  };

  const columns: Column<CollectibleRecord>[] = [
    {
      key: "title",
      header: "Collectible",
      sortable: true,
      render: (c) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <Package className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-bold text-[var(--admin-text)] truncate">{c.title}</span>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (c) => <Badge variant="neutral" size="sm">{c.category}</Badge>,
    },
    {
      key: "district",
      header: "District",
      sortable: true,
      render: (c) => <span className="text-xs text-[var(--admin-text-muted)]">{c.district || "—"}</span>,
    },
    {
      key: "reward",
      header: "Reward",
      render: (c) => <span className="text-xs text-[var(--admin-text)]">{c.reward || "—"}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (c) => (
        <Badge variant={c.status === "published" ? "success" : "warning"} size="sm" dot>
          {c.status || "published"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (c) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openEdit(c);
            }}
            className="p-1.5 rounded-lg text-[var(--admin-text-muted)] hover:text-white hover:bg-[#1C2436] transition-colors"
            title="Edit"
            aria-label={`Edit ${c.title}`}
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(c.id);
            }}
            className="p-1.5 rounded-lg text-[var(--admin-text-muted)] hover:text-[#F87171] hover:bg-[#1C2436] transition-colors"
            title="Delete"
            aria-label={`Delete ${c.title}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const inputCls =
    "w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1]";
  const labelCls = "block text-xs font-medium text-[#94A3B8] mb-1";

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--admin-border-subtle)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--admin-text)] tracking-tight flex items-center gap-2.5">
            <Package className="w-6 h-6 text-[var(--admin-primary)]" />
            <span>Collectibles</span>
          </h1>
          <p className="text-xs text-[var(--admin-text-muted)] mt-1">
            Manage hidden packages and collectibles shown on the public Collectibles page.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadCollectibles}
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
            Add collectible
          </button>
        </div>
      </div>

      <DataTable
        data={collectibles}
        columns={columns}
        selectable
        emptyState={
          <div className="p-8 text-center">
            <Package className="w-8 h-8 text-[#243048] mx-auto mb-3" />
            <p className="text-xs font-semibold text-[var(--admin-text)]">
              {isLoading ? "Loading collectibles…" : "No collectibles found."}
            </p>
            {!isLoading && (
              <p className="text-xs text-[var(--admin-text-muted)] mt-1">
                Add your first collectible to publish it on the public site.
              </p>
            )}
          </div>
        }
      />

      <Modal isOpen={editorOpen} onClose={() => setEditorOpen(false)} title={form.id ? "Edit collectible" : "Add collectible"} size="lg">
        <div className="space-y-3.5 text-xs">
          <div>
            <label htmlFor="col-title" className={labelCls}>
              Title <span className="text-red-400">*</span>
            </label>
            <input
              id="col-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputCls}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="col-category" className={labelCls}>Category</label>
              <select
                id="col-category"
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
              <label htmlFor="col-district" className={labelCls}>District</label>
              <input
                id="col-district"
                type="text"
                value={form.district || ""}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="col-status" className={labelCls}>Status</label>
              <select
                id="col-status"
                value={form.status || "published"}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={inputCls}
              >
                <option value="published">published</option>
                <option value="draft">draft</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="col-reward" className={labelCls}>Reward</label>
            <input
              id="col-reward"
              type="text"
              value={form.reward || ""}
              onChange={(e) => setForm({ ...form, reward: e.target.value })}
              placeholder="$5,000 + achievement"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="col-desc" className={labelCls}>Description</label>
            <textarea
              id="col-desc"
              rows={3}
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-3 rounded-xl bg-[#0E131D] border border-[#1C2436] text-white resize-none focus:outline-none focus:border-[#6366F1]"
            />
          </div>
          <div>
            <label htmlFor="col-tip" className={labelCls}>Guide tip</label>
            <textarea
              id="col-tip"
              rows={2}
              value={form.guide_tip || ""}
              onChange={(e) => setForm({ ...form, guide_tip: e.target.value })}
              className="w-full p-3 rounded-xl bg-[#0E131D] border border-[#1C2436] text-white resize-none focus:outline-none focus:border-[#6366F1]"
            />
          </div>
          <div>
            <label htmlFor="col-img" className={labelCls}>Image URL</label>
            <input
              id="col-img"
              type="text"
              value={form.img || ""}
              onChange={(e) => setForm({ ...form, img: e.target.value })}
              placeholder="/img/hero-dark.jpg"
              className={cn(inputCls, "font-mono")}
            />
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
              {saving ? "Saving…" : "Save collectible"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
