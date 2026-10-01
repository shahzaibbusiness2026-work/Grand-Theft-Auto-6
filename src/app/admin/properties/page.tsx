"use client";

import React, { useState, useEffect } from "react";
import { Building2, Plus, Trash2, Pencil, RefreshCw } from "lucide-react";
import { DataTable, Column } from "@/components/admin/data-table";
import { Badge } from "@/components/admin/ui/badge";
import { getAdminProperties, saveProperty, deleteProperty } from "@/lib/services/properties";
import type { PropertyRecord } from "@/lib/services/properties";
import { useToast } from "@/components/admin/toast";
import { Modal } from "@/components/admin/modal";
import { cn } from "@/lib/utils";

const PROPERTY_TYPES = [
  "Safehouse",
  "Garage",
  "Business",
  "Nightclub",
  "Warehouse",
  "Mansion",
  "Apartment",
  "Office",
];

const EMPTY_FORM: PropertyRecord = {
  id: "",
  name: "",
  district: "Vice City Metro",
  type: "Safehouse",
  price_display: "",
  garage_capacity: 0,
  passive_income_display: "",
  img: "",
  description: "",
  status: "published",
};

export default function AdminPropertiesPage() {
  const { showToast } = useToast();
  const [properties, setProperties] = useState<PropertyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState<PropertyRecord>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const loadProperties = () => {
    setIsLoading(true);
    getAdminProperties()
      .then(setProperties)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const openCreate = () => {
    setForm({ ...EMPTY_FORM });
    setEditorOpen(true);
  };

  const openEdit = (p: PropertyRecord) => {
    setForm({ ...p });
    setEditorOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      showToast({ title: "Name required", description: "Enter a property name.", type: "danger" });
      return;
    }
    setSaving(true);
    // Only known DB columns — the record keeps any preserved JSON-array
    // fields (features/upgrades/requirements) when editing an existing row.
    const res = await saveProperty({
      ...form,
      id: form.id || undefined,
      price_display: form.price_display || undefined,
      garage_capacity: form.garage_capacity ?? 0,
      passive_income_display: form.passive_income_display || undefined,
      img: form.img || undefined,
      description: form.description || undefined,
    });
    setSaving(false);
    if (res.success) {
      showToast({
        title: form.id ? "Property Updated" : "Property Created",
        description: `${form.name} saved to Supabase.`,
        type: "success",
      });
      setEditorOpen(false);
      loadProperties();
    } else {
      showToast({ title: "Save failed", description: res.error, type: "danger" });
    }
  };

  const handleDelete = async (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    const res = await deleteProperty(id);
    if (res.success) {
      showToast({ title: "Property Deleted", description: "Removed from Supabase.", type: "success" });
    } else {
      showToast({ title: "Delete failed", description: res.error, type: "danger" });
      loadProperties();
    }
  };

  const columns: Column<PropertyRecord>[] = [
    {
      key: "name",
      header: "Property",
      sortable: true,
      render: (p) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="min-w-0">
            <span className="font-bold text-[var(--admin-text)] block truncate">{p.name}</span>
            <span className="text-[11px] text-[var(--admin-text-muted)]">{p.district || "—"}</span>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      render: (p) => <Badge variant="neutral" size="sm">{p.type}</Badge>,
    },
    {
      key: "price_display",
      header: "Price",
      sortable: true,
      render: (p) => <span className="font-mono text-[11px] text-[var(--admin-text)]">{p.price_display || "TBD"}</span>,
    },
    {
      key: "passive_income_display",
      header: "Passive Income",
      render: (p) => <span className="text-[11px] text-[var(--admin-text-muted)]">{p.passive_income_display || "—"}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (p) => (
        <Badge variant={p.status === "published" ? "success" : "warning"} size="sm" dot>
          {p.status || "published"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (p) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openEdit(p);
            }}
            className="p-1.5 rounded-lg text-[var(--admin-text-muted)] hover:text-white hover:bg-[#1C2436] transition-colors"
            title="Edit"
            aria-label={`Edit ${p.name}`}
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(p.id);
            }}
            className="p-1.5 rounded-lg text-[var(--admin-text-muted)] hover:text-[#F87171] hover:bg-[#1C2436] transition-colors"
            title="Delete"
            aria-label={`Delete ${p.name}`}
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
            <Building2 className="w-6 h-6 text-[var(--admin-primary)]" />
            <span>Properties</span>
          </h1>
          <p className="text-xs text-[var(--admin-text-muted)] mt-1">
            Manage purchasable properties shown on the public Properties page and calculators.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadProperties}
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
            Add property
          </button>
        </div>
      </div>

      <DataTable
        data={properties}
        columns={columns}
        selectable
        emptyState={
          <div className="p-8 text-center">
            <Building2 className="w-8 h-8 text-[#243048] mx-auto mb-3" />
            <p className="text-xs font-semibold text-[var(--admin-text)]">
              {isLoading ? "Loading properties…" : "No properties found."}
            </p>
            {!isLoading && (
              <p className="text-[11px] text-[var(--admin-text-muted)] mt-1">
                Add your first property to publish it on the public site.
              </p>
            )}
          </div>
        }
      />

      <Modal isOpen={editorOpen} onClose={() => setEditorOpen(false)} title={form.id ? "Edit property" : "Add property"} size="lg">
        <div className="space-y-3.5 text-xs">
          <div>
            <label htmlFor="prop-name" className={labelCls}>
              Name <span className="text-red-400">*</span>
            </label>
            <input
              id="prop-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputCls}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="prop-district" className={labelCls}>District</label>
              <input
                id="prop-district"
                type="text"
                value={form.district || ""}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="prop-type" className={labelCls}>Type</label>
              <select
                id="prop-type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className={inputCls}
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="prop-price" className={labelCls}>Price display</label>
              <input
                id="prop-price"
                type="text"
                value={form.price_display || ""}
                onChange={(e) => setForm({ ...form, price_display: e.target.value })}
                placeholder="$1,250,000"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="prop-garage" className={labelCls}>Garage capacity</label>
              <input
                id="prop-garage"
                type="number"
                min={0}
                value={form.garage_capacity ?? 0}
                onChange={(e) => setForm({ ...form, garage_capacity: Number(e.target.value) || 0 })}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="prop-income" className={labelCls}>Passive income</label>
              <input
                id="prop-income"
                type="text"
                value={form.passive_income_display || ""}
                onChange={(e) => setForm({ ...form, passive_income_display: e.target.value })}
                placeholder="$9,500 / hour"
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label htmlFor="prop-img" className={labelCls}>Image URL</label>
            <input
              id="prop-img"
              type="text"
              value={form.img || ""}
              onChange={(e) => setForm({ ...form, img: e.target.value })}
              placeholder="/img/hero-dark.jpg"
              className={cn(inputCls, "font-mono")}
            />
          </div>
          <div>
            <label htmlFor="prop-desc" className={labelCls}>Description</label>
            <textarea
              id="prop-desc"
              rows={3}
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-3 rounded-xl bg-[#0E131D] border border-[#1C2436] text-white resize-none focus:outline-none focus:border-[#6366F1]"
            />
          </div>
          <div>
            <label htmlFor="prop-status" className={labelCls}>Status</label>
            <select
              id="prop-status"
              value={form.status || "published"}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className={inputCls}
            >
              <option value="published">published</option>
              <option value="draft">draft</option>
            </select>
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
              {saving ? "Saving…" : "Save property"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
