"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Car,
  Crosshair,
  Plus,
  Trash2,
  ExternalLink,
  GripVertical,
  Scale,
  Check,
  Info,
  ChevronDown,
  Search,
  Filter,
  Sparkles,
  Layers,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/components/admin/toast";
import { Button } from "@/components/admin/ui/button";
import { cn } from "@/lib/utils";
import { getAdminVehicles } from "@/lib/services/vehicles";
import { getAdminWeapons } from "@/lib/services/weapons";
import { getSavedComparisons, saveComparisonDraft, deleteComparisonDraft } from "@/lib/services/comparison";

interface AttributeConfig {
  id: string;
  checked: boolean;
  label: string;
  unit: string;
  rule: "higher" | "lower" | "none";
}

export default function AdminComparisonsPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"vehicle" | "weapon">("vehicle");
  const [viewMode, setViewMode] = useState<"editor" | "list">("editor");
  const [comparisonName, setComparisonName] = useState("Vehicle comparison draft");
  const [missingValueDisplay, setMissingValueDisplay] = useState("Unknown");
  const [hideEmptyAttributes, setHideEmptyAttributes] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Live vehicles & weapons from Supabase
  const [availableVehicles, setAvailableVehicles] = useState<{ id: string; name: string; type: string; status: string }[]>([]);
  const [availableWeapons, setAvailableWeapons] = useState<{ id: string; name: string; type: string; status: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [vehicleSearch, setVehicleSearch] = useState("");

  // Selected vehicles (up to 3) — populated from live Supabase data
  const [selectedVehicles, setSelectedVehicles] = useState<
    { id: string; name: string; type: string; status: string }[]
  >([]);

  // Saved comparisons list
  const [savedComparisons, setSavedComparisons] = useState<
    { id: string; name: string; type: string; itemCount: number; updatedAt: string }[]
  >([]);
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    Promise.all([getAdminVehicles(), getAdminWeapons()])
      .then(([vehicles, weapons]) => {
        if (vehicles && vehicles.length > 0) {
          const mapped = vehicles.map((v) => ({
            id: v.id,
            name: v.name,
            type: v.class,
            status: v.verification === "verified" ? "Verified" : "Unverified",
          }));
          setAvailableVehicles(mapped);
          setSelectedVehicles(mapped.slice(0, 3));
        }
        if (weapons && weapons.length > 0) {
          setAvailableWeapons(
            weapons.map((w) => ({
              id: w.id,
              name: w.name,
              type: w.category,
              status: w.verification === "verified" ? "Verified" : "Unverified",
            }))
          );
        }
        setLoadError(null);
      })
      .catch((err) => {
        console.error("Failed to load comparison data:", err);
        setLoadError("Could not load vehicles and weapons from the database.");
      })
      .finally(() => setIsLoading(false));

    // Load saved comparisons from site_settings
    getSavedComparisons().then(setSavedComparisons).catch(() => {});
  }, []);

  // Filter available vehicles by the record search box
  const filteredSearchVehicles = availableVehicles.filter(
    (v) =>
      !selectedVehicles.some((s) => s.id === v.id) &&
      (v.name.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
        v.id.toLowerCase().includes(vehicleSearch.toLowerCase()))
  );

  const handleAddVehicle = (v: { id: string; name: string; type: string; status: string }) => {
    setSelectedVehicles((prev) => (prev.length >= 3 ? prev : [...prev, v]));
  };

  // Attributes
  const [attributes, setAttributes] = useState<AttributeConfig[]>([
    { id: "attr-1", checked: true, label: "Top speed", unit: "km/h", rule: "higher" },
    { id: "attr-2", checked: true, label: "Weight", unit: "kg", rule: "lower" },
    { id: "attr-3", checked: true, label: "Class", unit: "None", rule: "none" },
  ]);

  const handleRemoveVehicle = (id: string) => {
    setSelectedVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  const handleAddAttribute = () => {
    const newAttr: AttributeConfig = {
      id: `attr-${Date.now()}`,
      checked: true,
      label: "New Attribute",
      unit: "None",
      rule: "higher",
    };
    setAttributes((prev) => [...prev, newAttr]);
  };

  const handleRemoveAttribute = (id: string) => {
    setAttributes((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSave = async () => {
    if (selectedVehicles.length === 0) {
      showToast({
        title: "Nothing to save",
        description: "Select at least one vehicle before saving.",
        type: "danger",
      });
      return;
    }
    setIsSaving(true);
    const result = await saveComparisonDraft({
      name: comparisonName.trim() || "Untitled comparison",
      type: activeTab,
      itemIds: selectedVehicles.map((v) => v.id),
      itemCount: selectedVehicles.length,
      attributes: attributes.map((a) => ({ label: a.label, unit: a.unit, rule: a.rule })),
      missingValueDisplay,
      hideEmptyAttributes,
    });
    setIsSaving(false);
    if (result.success) {
      const list = await getSavedComparisons().catch(() => []);
      setSavedComparisons(list);
      showToast({
        title: "Comparison Saved",
        description: `"${comparisonName}" has been successfully saved.`,
        type: "success",
      });
    } else {
      showToast({
        title: "Save failed",
        description: result.error || "Could not save the comparison. Please try again.",
        type: "danger",
      });
    }
  };

  const handleShowGuidelines = () => {
    showToast({
      title: "Comparison guidelines",
      description: "Pick up to 3 verified records, choose the attributes to compare, then save. Saved comparisons appear in the list view.",
      type: "info",
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header (Image 7 & 19) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Comparison manager
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0F2A1F] border border-[#1F4637] text-[#4ADE80]">
              Live data
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Create and configure side-by-side comparisons of vehicles, weapons and more.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {viewMode === "editor" ? (
            <>
              <span className="text-xs text-[#94A3B8]">
                Draft • Saved just now
              </span>
              <Button
                variant="primary"
                size="md"
                onClick={handleSave}
                disabled={isSaving}
                leftIcon={<Plus className="w-4 h-4" />}
                className="bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md shadow-indigo-500/20 disabled:opacity-50"
              >
                {isSaving ? "Saving…" : "Save comparison"}
              </Button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className="text-xs text-[#94A3B8] hover:text-white px-3 py-2 rounded-lg border border-[#1C2436] bg-[#111622]"
              >
                View all
              </button>
            </>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={() => setViewMode("editor")}
              leftIcon={<Plus className="w-4 h-4" />}
              className="bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md shadow-indigo-500/20"
            >
              + Create comparison
            </Button>
          )}
        </div>
      </div>

      {/* Tabs (Image 7 & 19: Vehicle comparisons, Weapon comparisons) */}
      <div className="flex items-center justify-between gap-4 border-b border-[#1C2436] pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab("vehicle");
              setViewMode("editor");
            }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all",
              activeTab === "vehicle" && viewMode === "editor"
                ? "bg-[#3730A3]/50 text-white border border-[#4F46E5]/40 shadow-sm"
                : "bg-[#111622] text-[#94A3B8] hover:text-white border border-[#1C2436]"
            )}
          >
            <Car className="w-4 h-4" />
            <span>Vehicle comparisons</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("weapon");
              setViewMode("list");
            }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all",
              activeTab === "weapon" || viewMode === "list"
                ? "bg-[#3730A3]/50 text-white border border-[#4F46E5]/40 shadow-sm"
                : "bg-[#111622] text-[#94A3B8] hover:text-white border border-[#1C2436]"
            )}
          >
            <Crosshair className="w-4 h-4" />
            <span>Weapon comparisons</span>
          </button>
        </div>

        {/* Search Bar for comparison list view */}
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B]" />
          <input
            type="text"
            placeholder="Search comparisons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1]"
          />
        </div>
      </div>

      {activeTab === "vehicle" && viewMode === "editor" ? (
        /* Vehicle Comparisons View (Image 7) */
        <div className="space-y-6">
          {/* Card 1: Basic Information */}
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-3">
            <h2 className="text-sm font-bold text-white">Basic information</h2>
            <div>
              <label htmlFor="comp-name" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                id="comp-name"
                type="text"
                value={comparisonName}
                onChange={(e) => setComparisonName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
              />
            </div>
          </div>

          {/* Card 2: Select Records */}
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white">Select records</h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Choose up to 3 vehicles to include in this comparison.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: Selected Records */}
              <div className="space-y-2">
                {selectedVehicles.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#0E131D] border border-[#1C2436]"
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-4 h-4 text-[#64748B] cursor-grab" />
                      <div className="w-8 h-8 rounded-lg bg-[#182030] flex items-center justify-center text-[#94A3B8]">
                        <Car className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{v.name}</p>
                        <p className="text-xs text-[#64748B]">{v.type}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveVehicle(v.id)}
                      className="text-[#64748B] hover:text-white p-1 rounded transition-colors"
                      aria-label={`Remove ${v.name}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Right: Search Records */}
              <div className="rounded-xl bg-[#0E131D] border border-[#1C2436] p-3 space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search vehicles by name or ID..."
                    value={vehicleSearch}
                    onChange={(e) => setVehicleSearch(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#111622] border border-[#1C2436] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1]"
                  />
                </div>
                <div className="space-y-1 pt-1 max-h-48 overflow-y-auto">
                  {isLoading ? (
                    <p className="text-xs text-[#64748B] p-2">Loading vehicles…</p>
                  ) : filteredSearchVehicles.length === 0 ? (
                    <p className="text-xs text-[#64748B] p-2">
                      {availableVehicles.length === 0 ? "No vehicles found in database." : "No matching vehicles."}
                    </p>
                  ) : (
                    filteredSearchVehicles.slice(0, 8).map((v) => (
                      <div
                        key={v.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-[#141B2A] transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Car className="w-4 h-4 text-[#94A3B8] shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-white truncate">{v.name}</p>
                            <p className="text-xs text-[#64748B]">{v.type} · {v.status}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleAddVehicle(v)}
                            disabled={selectedVehicles.length >= 3}
                            className="text-xs text-[#6366F1] hover:underline disabled:opacity-40 disabled:no-underline"
                          >
                            Add
                          </button>
                          <Link
                            href={`/admin/vehicles/${v.id}`}
                            className="text-xs text-[#6366F1] hover:underline flex items-center gap-1"
                          >
                            Edit <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Attributes Configuration */}
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-white">Attributes configuration</h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Choose which attributes to display and set how they are compared.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[#94A3B8]">Missing-value display</span>
                  <select
                    value={missingValueDisplay}
                    onChange={(e) => setMissingValueDisplay(e.target.value)}
                    className="px-2.5 py-1 rounded-lg bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                  >
                    <option value="Unknown">Unknown</option>
                    <option value="N/A">N/A</option>
                    <option value="-">-</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hideEmptyAttributes}
                    onChange={(e) => setHideEmptyAttributes(e.target.checked)}
                    className="rounded border-[#1C2436] text-[#6366F1] focus:ring-0 bg-[#0E131D]"
                  />
                  <span className="text-[#94A3B8]">Hide empty attributes</span>
                </label>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddAttribute}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  className="bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs px-3 py-1.5 rounded-lg"
                >
                  Add attribute
                </Button>
              </div>
            </div>

            {/* Attributes Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs" aria-label="Attributes configuration table">
                <thead>
                  <tr className="border-b border-[#1C2436] text-[#64748B] text-xs">
                    <th scope="col" className="w-8 pb-2.5"></th>
                    <th scope="col" className="w-8 pb-2.5"></th>
                    <th scope="col" className="pb-2.5 font-medium">Attribute label</th>
                    <th scope="col" className="pb-2.5 font-medium">Unit</th>
                    <th scope="col" className="pb-2.5 font-medium">Comparison rule</th>
                    <th scope="col" className="pb-2.5 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182030]">
                  {attributes.map((attr, idx) => (
                    <tr key={attr.id} className="hover:bg-[#141B2A] transition-colors">
                      <td className="py-2.5 pr-2">
                        <GripVertical className="w-4 h-4 text-[#64748B] cursor-grab" />
                      </td>
                      <td className="py-2.5 pr-3">
                        <input
                          type="checkbox"
                          checked={attr.checked}
                          onChange={(e) => {
                            const next = [...attributes];
                            next[idx].checked = e.target.checked;
                            setAttributes(next);
                          }}
                          className="rounded border-[#1C2436] text-[#6366F1] focus:ring-0 bg-[#0E131D]"
                          aria-label={`Enable attribute ${attr.label}`}
                        />
                      </td>
                      <td className="py-2.5 pr-4">
                        <input
                          type="text"
                          value={attr.label}
                          onChange={(e) => {
                            const next = [...attributes];
                            next[idx].label = e.target.value;
                            setAttributes(next);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                        />
                      </td>
                      <td className="py-2.5 pr-4">
                        <input
                          type="text"
                          value={attr.unit}
                          onChange={(e) => {
                            const next = [...attributes];
                            next[idx].unit = e.target.value;
                            setAttributes(next);
                          }}
                          className="w-24 px-3 py-1.5 rounded-lg bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                        />
                      </td>
                      <td className="py-2.5 pr-4">
                        <select
                          value={attr.rule}
                          onChange={(e) => {
                            const next = [...attributes];
                            next[idx].rule = e.target.value as "higher" | "lower" | "none";
                            setAttributes(next);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                        >
                          <option value="higher">Higher is preferable</option>
                          <option value="lower">Lower is preferable</option>
                          <option value="none">No preference</option>
                        </select>
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveAttribute(attr.id)}
                          className="p-1 text-[#64748B] hover:text-red-400 transition-colors"
                          aria-label={`Delete ${attr.label}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card 4: Preview */}
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white">Preview</h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                This is how the comparison will look on the site.
              </p>
            </div>

            {/* Info Banner */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#0E131D] border border-[#1C2436] text-xs text-[#94A3B8]">
              <Info className="w-4 h-4 text-[#38BDF8] shrink-0" />
              <span>Specifications are synced from the game database. Edit the source record to change a value.</span>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs" aria-label="Comparison preview matrix">
                <thead>
                  <tr className="border-b border-[#1C2436] text-[#64748B] text-xs">
                    <th scope="col" className="pb-3 font-medium">Attribute</th>
                    {selectedVehicles.map((v) => (
                      <th key={v.id} scope="col" className="pb-3 font-medium">
                        <div>
                          <p className="text-white font-semibold">{v.name}</p>
                          <p className={cn("text-xs", v.status === "Verified" ? "text-[#4ADE80]" : "text-[#E5A83B]")}>
                            {v.status}
                          </p>
                        </div>
                      </th>
                    ))}
                    {selectedVehicles.length === 0 && (
                      <th scope="col" className="pb-3 font-medium text-[#64748B]">
                        No vehicles selected
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182030]">
                  {attributes.map((attr) => (
                    <tr key={attr.id} className="hover:bg-[#141B2A] transition-colors">
                      <td className="py-3 pr-4 font-semibold text-white">
                        {attr.label} {attr.unit !== "None" ? `(${attr.unit})` : ""}
                      </td>
                      {selectedVehicles.map((v) => (
                        <td key={v.id} className="py-3 text-[#94A3B8]">{missingValueDisplay}</td>
                      ))}
                      {selectedVehicles.length === 0 && (
                        <td className="py-3 text-[#64748B]">—</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Comparison List */
        <div className="space-y-6">
          {(() => {
            const q = searchQuery.trim().toLowerCase();
            const list = savedComparisons.filter(
              (c) => c.type === activeTab && (q === "" || c.name.toLowerCase().includes(q))
            );
            if (list.length > 0) {
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {list.map((c) => (
                    <div key={c.id} className="p-4 rounded-xl bg-[#111622] border border-[#1C2436] space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-white truncate">{c.name}</p>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#1C2436] text-[#94A3B8] shrink-0">
                          {c.type}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B]">
                        {c.itemCount} item{c.itemCount === 1 ? "" : "s"} · updated{" "}
                        {new Date(c.updatedAt).toLocaleDateString()}
                      </p>
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            setComparisonName(c.name);
                            setActiveTab(c.type as "vehicle" | "weapon");
                            setViewMode("editor");
                          }}
                          className="text-xs font-semibold text-[#6366F1] hover:underline"
                        >
                          Open in editor →
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!window.confirm(`Delete saved comparison "${c.name}"?`)) return;
                            const res = await deleteComparisonDraft(c.id);
                            if (res.success) {
                              setSavedComparisons((prev) => prev.filter((x) => x.id !== c.id));
                              showToast({ title: "Saved comparison deleted", type: "success" });
                            } else {
                              showToast({ title: res.error || "Delete failed", type: "danger" });
                            }
                          }}
                          className="text-xs font-semibold text-red-400 hover:text-red-300 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }
            return (
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 rounded-2xl border border-[#1C2436] bg-[#111622]/50">
            <div className="w-16 h-16 rounded-full bg-[#111622] border border-[#1C2436] flex items-center justify-center text-[#94A3B8] shadow-inner">
              <Scale className="w-8 h-8 text-[#6366F1]" />
            </div>

            <div className="space-y-1 max-w-md">
              <h2 className="text-lg font-bold text-white">
                {activeTab === "weapon" ? "No weapon comparisons yet" : "No vehicle comparisons yet"}
              </h2>
              <p className="text-xs text-[#64748B] leading-relaxed">
                {q
                  ? `No saved comparisons match "${searchQuery}".`
                  : "Choose database records and attributes to create your first comparison. Unknown specifications remain visible as Unknown."}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setViewMode("editor");
                }}
                leftIcon={<Plus className="w-4 h-4" />}
                className="bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md shadow-indigo-500/20"
              >
                Create comparison
              </Button>
              <button
                type="button"
                onClick={handleShowGuidelines}
                className="text-xs font-semibold text-[#6366F1] hover:underline px-3 py-2"
              >
                Read comparison guidelines →
              </button>
            </div>
          </div>
            );
          })()}

          {/* 3 Value Proposition Cards (Image 19 bottom) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#111622] border border-[#1C2436] flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#182030] border border-[#243048] flex items-center justify-center text-[#94A3B8] shrink-0">
                <Scale className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-white">Database linked</p>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Specifications update from source records. No duplicate entry required.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#111622] border border-[#1C2436] flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#182030] border border-[#243048] flex items-center justify-center text-[#94A3B8] shrink-0">
                <Layers className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-white">Side-by-side view</p>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Up to 3 records per comparison on desktop and mobile viewports.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#111622] border border-[#1C2436] flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#182030] border border-[#243048] flex items-center justify-center text-[#94A3B8] shrink-0">
                <Sparkles className="w-4 h-4 text-gold-light" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-white">Highlight rules</p>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Highlight the highest, lowest, or custom preferred value per attribute.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
