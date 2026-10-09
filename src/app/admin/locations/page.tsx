"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Plus, Trash2, Pencil, RefreshCw } from "lucide-react";
import { DataTable, Column } from "@/components/admin/data-table";
import { Badge } from "@/components/admin/ui/badge";
import { getLocations, saveLocation, deleteLocation } from "@/lib/services/locations";
import type { LocationRecord } from "@/lib/services/locations";
import { useToast } from "@/components/admin/toast";
import { Modal } from "@/components/admin/modal";
import { cn } from "@/lib/utils";

const EMPTY_FORM: LocationRecord = {
  id: "",
  name: "",
  district: "Vice City Metro",
  type: "Landmark",
  verification: "pending",
  coordinates: "",
  description: "",
};

export default function AdminLocationsPage() {
  const { showToast } = useToast();
  const [locations, setLocations] = useState<LocationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState<LocationRecord>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const loadLocations = () => {
    setIsLoading(true);
    getLocations()
      .then(setLocations)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const openCreate = () => {
    setForm({ ...EMPTY_FORM });
    setEditorOpen(true);
  };

  const openEdit = (l: LocationRecord) => {
    setForm({ ...l });
    setEditorOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      showToast({ title: "Name required", description: "Enter a location name.", type: "danger" });
      return;
    }
    setSaving(true);
    const res = await saveLocation({ ...form, id: form.id || undefined });
    setSaving(false);
    if (res.success) {
      showToast({
        title: form.id ? "Location Updated" : "Location Created",
        description: `${form.name} saved to Supabase.`,
        type: "success",
      });
      setEditorOpen(false);
      loadLocations();
    } else {
      showToast({ title: "Save failed", description: res.error, type: "danger" });
    }
  };

  const handleDelete = async (id: string) => {
    setLocations((prev) => prev.filter((l) => l.id !== id));
    const res = await deleteLocation(id);
    if (res.success) {
      showToast({ title: "Location Deleted", description: "Removed from Supabase.", type: "success" });
    } else {
      showToast({ title: "Delete failed", description: res.error, type: "danger" });
      loadLocations();
    }
  };

  const columns: Column<LocationRecord>[] = [
    {
      key: "name",
      header: "Location Name",
      sortable: true,
      render: (l) => (
        <div className="flex items-center gap-2.5">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-[var(--admin-text)]">{l.name}</span>
        </div>
      ),
    },
    { key: "district", header: "District / County", sortable: true },
    {
      key: "type",
      header: "Type",
      render: (l) => (
        <Badge variant="neutral" size="sm">
          {l.type}
        </Badge>
      ),
    },
    {
      key: "verification",
      header: "Status",
      render: (l) => (
        <Badge variant={l.verification === "verified" ? "success" : "warning"} size="sm" dot>
          {l.verification}
        </Badge>
      ),
    },
    {
      key: "coordinates",
      header: "Coordinates",
      render: (l) => <span className="font-mono text-xs text-[var(--admin-text-muted)]">{l.coordinates}</span>,
    },
    {
      key: "actions",
      header: "",
      render: (l) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openEdit(l);
            }}
            className="p-1.5 rounded-lg text-[var(--admin-text-muted)] hover:text-white hover:bg-[#1C2436] transition-colors"
            title="Edit"
            aria-label={`Edit ${l.name}`}
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(l.id);
            }}
            className="p-1.5 rounded-lg text-[var(--admin-text-muted)] hover:text-[#F87171] hover:bg-[#1C2436] transition-colors"
            title="Delete"
            aria-label={`Delete ${l.name}`}
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
            <MapPin className="w-6 h-6 text-[var(--admin-primary)]" />
            <span>Locations & Districts</span>
          </h1>
          <p className="text-xs text-[var(--admin-text-muted)] mt-1">
            Database of confirmed municipalities, landmarks, and territory coordinates in Leonida.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadLocations}
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
            Add location
          </button>
        </div>
      </div>

      <DataTable
        data={locations}
        columns={columns}
        selectable
        emptyState={
          <div className="p-8 text-center">
            <MapPin className="w-8 h-8 text-[#243048] mx-auto mb-3" />
            <p className="text-xs font-semibold text-[var(--admin-text)]">
              {isLoading ? "Loading locations…" : "No locations found."}
            </p>
            {!isLoading && (
              <p className="text-xs text-[var(--admin-text-muted)] mt-1">
                Add your first location to start building the map database.
              </p>
            )}
          </div>
        }
      />

      <Modal isOpen={editorOpen} onClose={() => setEditorOpen(false)} title={form.id ? "Edit location" : "Add location"}>
        <div className="space-y-3.5 text-xs">
          <div>
            <label htmlFor="loc-name" className="block text-xs font-medium text-[#94A3B8] mb-1">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              id="loc-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-white focus:outline-none focus:border-[#6366F1]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="loc-district" className="block text-xs font-medium text-[#94A3B8] mb-1">
                District
              </label>
              <input
                id="loc-district"
                type="text"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-white focus:outline-none focus:border-[#6366F1]"
              />
            </div>
            <div>
              <label htmlFor="loc-type" className="block text-xs font-medium text-[#94A3B8] mb-1">
                Type
              </label>
              <select
                id="loc-type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as LocationRecord["type"] })}
                className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-white focus:outline-none focus:border-[#6366F1]"
              >
                <option value="City District">City District</option>
                <option value="Island / Keys">Island / Keys</option>
                <option value="Government Facility">Government Facility</option>
                <option value="Landmark">Landmark</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="loc-verification" className="block text-xs font-medium text-[#94A3B8] mb-1">
                Verification
              </label>
              <select
                id="loc-verification"
                value={form.verification}
                onChange={(e) => setForm({ ...form, verification: e.target.value as LocationRecord["verification"] })}
                className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-white focus:outline-none focus:border-[#6366F1]"
              >
                <option value="verified">verified</option>
                <option value="pending">pending</option>
              </select>
            </div>
            <div>
              <label htmlFor="loc-coords" className="block text-xs font-medium text-[#94A3B8] mb-1">
                Coordinates
              </label>
              <input
                id="loc-coords"
                type="text"
                value={form.coordinates}
                onChange={(e) => setForm({ ...form, coordinates: e.target.value })}
                placeholder="25.7617, -80.1918"
                className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-white font-mono focus:outline-none focus:border-[#6366F1]"
              />
            </div>
          </div>
          <div>
            <label htmlFor="loc-desc" className="block text-xs font-medium text-[#94A3B8] mb-1">
              Description
            </label>
            <textarea
              id="loc-desc"
              rows={3}
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
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
              {saving ? "Saving…" : "Save location"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


