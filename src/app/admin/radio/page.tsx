"use client";

import React, { useState, useEffect } from "react";
import { Radio, Plus, Trash2, Pencil, RefreshCw, Eye, EyeOff } from "lucide-react";
import { DataTable, Column } from "@/components/admin/data-table";
import { Badge } from "@/components/admin/ui/badge";
import { getAdminRadioStations, saveRadioStation, deleteRadioStation } from "@/lib/services/radio";
import type { RadioStationRecord } from "@/lib/services/radio";
import { useToast } from "@/components/admin/toast";
import { Modal } from "@/components/admin/modal";
import { cn } from "@/lib/utils";

const EMPTY_FORM: RadioStationRecord = {
  id: "",
  name: "",
  genre: "",
  host: "",
  frequency: "",
  accent_color: "#B8AAFF",
  description: "",
  sort_order: 0,
  visible: true,
};

export default function AdminRadioPage() {
  const { showToast } = useToast();
  const [stations, setStations] = useState<RadioStationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState<RadioStationRecord>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const loadStations = () => {
    setIsLoading(true);
    getAdminRadioStations()
      .then(setStations)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadStations();
  }, []);

  const openCreate = () => {
    setForm({ ...EMPTY_FORM });
    setEditorOpen(true);
  };

  const openEdit = (s: RadioStationRecord) => {
    setForm({ ...s });
    setEditorOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      showToast({ title: "Name required", description: "Enter a station name.", type: "danger" });
      return;
    }
    setSaving(true);
    const res = await saveRadioStation({
      ...form,
      id: form.id || undefined,
      name: form.name,
      genre: form.genre || undefined,
      host: form.host || undefined,
      frequency: form.frequency || undefined,
      accent_color: form.accent_color || "#B8AAFF",
      description: form.description || undefined,
      sort_order: form.sort_order ?? 0,
      visible: form.visible ?? true,
    });
    setSaving(false);
    if (res.success) {
      showToast({
        title: form.id ? "Station Updated" : "Station Created",
        description: `${form.name} saved to Supabase.`,
        type: "success",
      });
      setEditorOpen(false);
      loadStations();
    } else {
      showToast({ title: "Save failed", description: res.error, type: "danger" });
    }
  };

  const toggleVisible = async (s: RadioStationRecord) => {
    const next = { ...s, visible: !s.visible };
    setStations((prev) => prev.map((x) => (x.id === s.id ? next : x)));
    const res = await saveRadioStation(next);
    if (res.success) {
      showToast({
        title: next.visible ? "Station Visible" : "Station Hidden",
        description: `${s.name} is now ${next.visible ? "shown on" : "hidden from"} the public Radio page.`,
        type: "success",
      });
    } else {
      showToast({ title: "Update failed", description: res.error, type: "danger" });
      loadStations();
    }
  };

  const handleDelete = async (id: string) => {
    setStations((prev) => prev.filter((s) => s.id !== id));
    const res = await deleteRadioStation(id);
    if (res.success) {
      showToast({ title: "Station Deleted", description: "Removed from Supabase.", type: "success" });
    } else {
      showToast({ title: "Delete failed", description: res.error, type: "danger" });
      loadStations();
    }
  };

  const columns: Column<RadioStationRecord>[] = [
    {
      key: "name",
      header: "Station",
      sortable: true,
      render: (s) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="w-3 h-3 rounded-full shrink-0 border border-white/20"
            style={{ backgroundColor: s.accent_color || "#B8AAFF" }}
            aria-hidden="true"
          />
          <div className="min-w-0">
            <span className="font-bold text-[var(--admin-text)] block truncate">{s.name}</span>
            <span className="text-xs text-[var(--admin-text-muted)]">{s.frequency || "—"}</span>
          </div>
        </div>
      ),
    },
    {
      key: "genre",
      header: "Genre",
      sortable: true,
      render: (s) => <Badge variant="neutral" size="sm">{s.genre || "—"}</Badge>,
    },
    {
      key: "host",
      header: "Host",
      render: (s) => <span className="text-xs text-[var(--admin-text-muted)]">{s.host || "—"}</span>,
    },
    {
      key: "sort_order",
      header: "Order",
      sortable: true,
      render: (s) => <span className="font-mono text-xs text-[var(--admin-text-muted)]">{s.sort_order ?? 0}</span>,
    },
    {
      key: "visible",
      header: "Visibility",
      render: (s) => (
        <Badge variant={s.visible ? "success" : "warning"} size="sm" dot>
          {s.visible ? "visible" : "hidden"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (s) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleVisible(s);
            }}
            className="p-1.5 rounded-lg text-[var(--admin-text-muted)] hover:text-white hover:bg-[#1C2436] transition-colors"
            title={s.visible ? "Hide from public site" : "Show on public site"}
            aria-label={`Toggle visibility for ${s.name}`}
          >
            {s.visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openEdit(s);
            }}
            className="p-1.5 rounded-lg text-[var(--admin-text-muted)] hover:text-white hover:bg-[#1C2436] transition-colors"
            title="Edit"
            aria-label={`Edit ${s.name}`}
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(s.id);
            }}
            className="p-1.5 rounded-lg text-[var(--admin-text-muted)] hover:text-[#F87171] hover:bg-[#1C2436] transition-colors"
            title="Delete"
            aria-label={`Delete ${s.name}`}
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
            <Radio className="w-6 h-6 text-[var(--admin-primary)]" />
            <span>Radio Stations</span>
          </h1>
          <p className="text-xs text-[var(--admin-text-muted)] mt-1">
            Manage the stations shown on the public Radio page.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadStations}
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
            Add station
          </button>
        </div>
      </div>

      <DataTable
        data={stations}
        columns={columns}
        selectable
        emptyState={
          <div className="p-8 text-center">
            <Radio className="w-8 h-8 text-[#243048] mx-auto mb-3" />
            <p className="text-xs font-semibold text-[var(--admin-text)]">
              {isLoading ? "Loading stations…" : "No stations found."}
            </p>
            {!isLoading && (
              <p className="text-xs text-[var(--admin-text-muted)] mt-1">
                Add your first radio station to publish it on the public site.
              </p>
            )}
          </div>
        }
      />

      <Modal isOpen={editorOpen} onClose={() => setEditorOpen(false)} title={form.id ? "Edit station" : "Add station"}>
        <div className="space-y-3.5 text-xs">
          <div>
            <label htmlFor="radio-name" className={labelCls}>
              Name <span className="text-red-400">*</span>
            </label>
            <input
              id="radio-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputCls}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="radio-genre" className={labelCls}>Genre</label>
              <input
                id="radio-genre"
                type="text"
                value={form.genre || ""}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="radio-host" className={labelCls}>Host</label>
              <input
                id="radio-host"
                type="text"
                value={form.host || ""}
                onChange={(e) => setForm({ ...form, host: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="radio-frequency" className={labelCls}>Frequency</label>
              <input
                id="radio-frequency"
                type="text"
                value={form.frequency || ""}
                onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                placeholder="103.5 FM"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="radio-color" className={labelCls}>Accent color</label>
              <input
                id="radio-color"
                type="color"
                value={form.accent_color || "#B8AAFF"}
                onChange={(e) => setForm({ ...form, accent_color: e.target.value })}
                className="w-full h-[38px] rounded-xl bg-[#0E131D] border border-[#1C2436] cursor-pointer"
              />
            </div>
            <div>
              <label htmlFor="radio-order" className={labelCls}>Sort order</label>
              <input
                id="radio-order"
                type="number"
                value={form.sort_order ?? 0}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) || 0 })}
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label htmlFor="radio-desc" className={labelCls}>Description</label>
            <textarea
              id="radio-desc"
              rows={3}
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-3 rounded-xl bg-[#0E131D] border border-[#1C2436] text-white resize-none focus:outline-none focus:border-[#6366F1]"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-white pt-1">
            <input
              type="checkbox"
              checked={form.visible ?? true}
              onChange={(e) => setForm({ ...form, visible: e.target.checked })}
              className="rounded border-[#2A344A] bg-[#0E131D] text-[#6366F1] focus:ring-0"
            />
            <span className="text-[#94A3B8]">Visible on the public Radio page</span>
          </label>
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
              {saving ? "Saving…" : "Save station"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
