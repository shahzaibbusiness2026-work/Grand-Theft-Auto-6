"use client";

import React, { useState, useEffect } from "react";
import { Tag, Plus, Trash2, Edit, FileText, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/admin/toast";
import { Button } from "@/components/admin/ui/button";
import { Badge } from "@/components/admin/ui/badge";
import { Tooltip } from "@/components/admin/ui/tooltip";
import { getCategories, saveCategory, deleteCategory, AdminCategory } from "@/lib/services/categories";
import { Modal } from "@/components/admin/modal";

export default function AdminCategoriesPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const created: AdminCategory = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      slug: newCatName.trim().toLowerCase().replace(/\s+/g, "-"),
      count: 0,
      description: newCatDesc.trim() || "No description provided.",
    };
    setCategories((prev) => [...prev, created]);
    setNewCatName("");
    setNewCatDesc("");
    await saveCategory(created);
    showToast({
      title: "Category Created",
      description: `"${created.name}" saved to Supabase taxonomy.`,
      type: "success",
    });
  };

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const handleDeleteCategory = async (id: string) => {
    const cat = categories.find((c) => c.id === id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    await deleteCategory(id);
    showToast({
      title: "Category Deleted",
      description: `"${cat?.name || "Category"}" removed from Supabase taxonomy.`,
      type: "success",
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--admin-border-subtle)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--admin-text)] tracking-tight flex items-center gap-2.5">
            <Tag className="w-6 h-6 text-[var(--admin-primary)]" />
            <span>Categories & Taxonomy</span>
          </h1>
          <p className="text-xs text-[var(--admin-text-muted)] mt-1">
            Organize editorial publications and database entries into logical public hierarchies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Categories List (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs" aria-label="Content categories">
            <thead>
              <tr className="border-b border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text-muted)]">
                <th scope="col" className="p-3.5 font-bold uppercase">Category</th>
                <th scope="col" className="p-3.5 font-bold uppercase">Slug</th>
                <th scope="col" className="p-3.5 font-bold uppercase">Articles</th>
                <th scope="col" className="p-3.5 font-bold uppercase">Description</th>
                <th scope="col" className="p-3.5 font-bold uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border-subtle)]">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-[var(--admin-elevated)]/40 transition-colors">
                  <td className="p-3.5 font-bold text-[var(--admin-text)]">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-[var(--admin-primary)]" />
                      {c.name}
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-[var(--admin-text-muted)]">{c.slug}</td>
                  <td className="p-3.5">
                    <Badge variant="primary" size="sm">{c.count} items</Badge>
                  </td>
                  <td className="p-3.5 text-[var(--admin-text-muted)] max-w-[240px] truncate">{c.description}</td>
                  <td className="p-3.5 text-right">
                    <Tooltip content="Delete category">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget({ id: c.id, name: c.name })}
                        className="text-[var(--admin-text-muted)] hover:text-rose-400 hover:bg-rose-500/10 h-7 w-7"
                        aria-label={`Delete category: ${c.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Category Form (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 space-y-4 text-xs shadow-sm">
          <h3 className="font-bold uppercase tracking-wider text-[var(--admin-text)]">
            Create New Category
          </h3>
          <form onSubmit={handleAddCategory} className="space-y-3">
            <div>
              <label htmlFor="new-cat-name" className="block font-bold text-[var(--admin-text)] mb-1">
                Category Name
              </label>
              <input
                id="new-cat-name"
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Weapons Lore"
                className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)] focus:ring-1 focus:ring-[var(--admin-primary)] transition-all"
              />
            </div>
            <div>
              <label htmlFor="new-cat-desc" className="block font-bold text-[var(--admin-text)] mb-1">
                Description
              </label>
              <textarea
                id="new-cat-desc"
                rows={3}
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                placeholder="Brief summary of what articles belong here..."
                className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)] focus:ring-1 focus:ring-[var(--admin-primary)] transition-all resize-none"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={!newCatName.trim()}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Category
            </Button>
          </form>
        </div>
      </div>
      {/* Delete confirmation */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete permanently?"
        description={`This will permanently delete "${deleteTarget?.name}". This action cannot be undone.`}
        variant="danger"
        footer={<>
          <button
            type="button"
            onClick={() => setDeleteTarget(null)}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#0E131D] border border-[#1C2436] text-[#94A3B8] hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => { if (deleteTarget) { handleDeleteCategory(deleteTarget.id); setDeleteTarget(null); } }}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-500 text-white transition-colors"
          >
            Delete
          </button>
        </>}
      />
    </div>
  );
}
