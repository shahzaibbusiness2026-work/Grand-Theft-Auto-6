"use client";

import React, { useState, useEffect } from "react";
import { Compass, Plus, Trash2, Pencil, RefreshCw } from "lucide-react";
import { DataTable, Column } from "@/components/admin/data-table";
import { Badge } from "@/components/admin/ui/badge";
import { getMissions, saveMission, deleteMission } from "@/lib/services/missions";
import type { MissionRecord } from "@/lib/services/missions";
import { useToast } from "@/components/admin/toast";
import { Modal } from "@/components/admin/modal";
import { cn } from "@/lib/utils";

const EMPTY_FORM: MissionRecord = {
  id: "",
  name: "",
  protagonist: "Both",
  act: "Main Story",
  status: "Rumoured",
  objectives: "",
  description: "",
};

export default function AdminMissionsPage() {
  const { showToast } = useToast();
  const [missions, setMissions] = useState<MissionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState<MissionRecord>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const loadMissions = () => {
    setIsLoading(true);
    getMissions()
      .then(setMissions)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadMissions();
  }, []);

  const openCreate = () => {
    setForm({ ...EMPTY_FORM });
    setEditorOpen(true);
  };

  const openEdit = (m: MissionRecord) => {
    setForm({ ...m });
    setEditorOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      showToast({ title: "Name required", description: "Enter a mission name.", type: "danger" });
      return;
    }
    setSaving(true);
    const res = await saveMission({ ...form, id: form.id || undefined });
    setSaving(false);
    if (res.success) {
      showToast({
        title: form.id ? "Mission Updated" : "Mission Created",
        description: `${form.name} saved to Supabase.`,
        type: "success",
      });
      setEditorOpen(false);
      loadMissions();
    } else {
      showToast({ title: "Save failed", description: res.error, type: "danger" });
    }
  };

  const handleDelete = async (id: string) => {
    setMissions((prev) => prev.filter((m) => m.id !== id));
    const res = await deleteMission(id);
    if (res.success) {
      showToast({ title: "Mission Deleted", description: "Removed from Supabase.", type: "success" });
    } else {
      showToast({ title: "Delete failed", description: res.error, type: "danger" });
      loadMissions();
    }
  };

  const getProtagonistBadge = (p: MissionRecord["protagonist"]) => {
    switch (p) {
      case "Lucia": return "primary" as const;
      case "Jason": return "info" as const;
      case "Both": return "success" as const;
    }
  };

  const columns: Column<MissionRecord>[] = [
    {
      key: "name",
      header: "Mission Title",
      sortable: true,
      render: (m) => (
        <div className="flex items-center gap-2.5">
          <Compass className="w-4 h-4 text-indigo-400" />
          <span className="font-bold text-[var(--admin-text)]">{m.name}</span>
        </div>
      ),
    },
    {
      key: "protagonist",
      header: "Playable Character",
      sortable: true,
      render: (m) => (
        <Badge variant={getProtagonistBadge(m.protagonist)} size="sm">
          {m.protagonist}
        </Badge>
      ),
    },
    { key: "act", header: "Story Act" },
    {
      key: "status",
      header: "Status",
      render: (m) => (
        <Badge variant={m.status === "Confirmed" ? "success" : "warning"} size="sm" dot>
          {m.status}
        </Badge>
      ),
    },
    { key: "objectives", header: "Core Objectives" },
    {
      key: "actions",
      header: "",
      render: (m) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openEdit(m);
            }}
            className="p-1.5 rounded-lg text-[var(--admin-text-muted)] hover:text-white hover:bg-[#1C2436] transition-colors"
            title="Edit"
            aria-label={`Edit ${m.name}`}
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(m.id);
            }}
            className="p-1.5 rounded-lg text-[var(--admin-text-muted)] hover:text-[#F87171] hover:bg-[#1C2436] transition-colors"
            title="Delete"
            aria-label={`Delete ${m.name}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--admin-border-subtle)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--admin-text)] tracking-tight flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-[var(--admin-primary)]" />
            <span>Missions & Story Database</span>
          </h1>
          <p className="text-xs text-[var(--admin-text-muted)] mt-1">
            Track confirmed story missions, heists, and side activities.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadMissions}
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
            Add mission
          </button>
        </div>
      </div>

      <DataTable
        data={missions}
        columns={columns}
        selectable
        emptyState={
          <div className="p-8 text-center">
            <Compass className="w-8 h-8 text-[#243048] mx-auto mb-3" />
            <p className="text-xs font-semibold text-[var(--admin-text)]">
              {isLoading ? "Loading missions…" : "No missions found."}
            </p>
            {!isLoading && (
              <p className="text-[11px] text-[var(--admin-text-muted)] mt-1">
                Add your first mission to start the story database.
              </p>
            )}
          </div>
        }
      />

      <Modal isOpen={editorOpen} onClose={() => setEditorOpen(false)} title={form.id ? "Edit mission" : "Add mission"}>
        <div className="space-y-3.5 text-xs">
          <div>
            <label htmlFor="mis-name" className="block text-[11px] font-medium text-[#94A3B8] mb-1">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              id="mis-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-white focus:outline-none focus:border-[#6366F1]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="mis-protagonist" className="block text-[11px] font-medium text-[#94A3B8] mb-1">
                Protagonist
              </label>
              <select
                id="mis-protagonist"
                value={form.protagonist}
                onChange={(e) => setForm({ ...form, protagonist: e.target.value as MissionRecord["protagonist"] })}
                className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-white focus:outline-none focus:border-[#6366F1]"
              >
                <option value="Lucia">Lucia</option>
                <option value="Jason">Jason</option>
                <option value="Both">Both</option>
              </select>
            </div>
            <div>
              <label htmlFor="mis-status" className="block text-[11px] font-medium text-[#94A3B8] mb-1">
                Status
              </label>
              <select
                id="mis-status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as MissionRecord["status"] })}
                className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-white focus:outline-none focus:border-[#6366F1]"
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Rumoured">Rumoured</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="mis-act" className="block text-[11px] font-medium text-[#94A3B8] mb-1">
              Story Act
            </label>
            <input
              id="mis-act"
              type="text"
              value={form.act}
              onChange={(e) => setForm({ ...form, act: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-white focus:outline-none focus:border-[#6366F1]"
            />
          </div>
          <div>
            <label htmlFor="mis-objectives" className="block text-[11px] font-medium text-[#94A3B8] mb-1">
              Objectives
            </label>
            <textarea
              id="mis-objectives"
              rows={3}
              value={form.objectives || ""}
              onChange={(e) => setForm({ ...form, objectives: e.target.value })}
              className="w-full p-3 rounded-xl bg-[#0E131D] border border-[#1C2436] text-white resize-none focus:outline-none focus:border-[#6366F1]"
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
              {saving ? "Saving…" : "Save mission"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

