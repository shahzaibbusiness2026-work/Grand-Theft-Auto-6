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

  // Selected vehicles (up to 3)
  const [selectedVehicles, setSelectedVehicles] = useState([
    { id: "veh-001", name: "Vehicle V-001", type: "Vehicle", status: "Unverified" },
    { id: "veh-002", name: "Vehicle V-002", type: "Vehicle", status: "Unverified" },
    { id: "veh-003", name: "Vehicle V-003", type: "Vehicle", status: "Unverified" },
  ]);

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

  const handleSave = () => {
    showToast({
      title: "Comparison Saved",
      description: `"${comparisonName}" has been successfully saved.`,
      type: "success",
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
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2A2015] border border-[#4A3818] text-[#E5A83B]">
              Demo data
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
                leftIcon={<Plus className="w-4 h-4" />}
                className="bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md shadow-indigo-500/20"
              >
                Save comparison
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
                        <p className="text-[11px] text-[#64748B]">{v.type}</p>
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
                    className="w-full px-3 py-2 rounded-lg bg-[#111622] border border-[#1C2436] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1]"
                  />
                </div>
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[#141B2A] transition-colors">
                    <div className="flex items-center gap-2.5">
                      <Car className="w-4 h-4 text-[#94A3B8]" />
                      <div>
                        <p className="text-xs font-medium text-white">Vehicle V-001</p>
                        <p className="text-[10px] text-[#64748B]">Vehicle</p>
                      </div>
                    </div>
                    <Link
                      href="/admin/vehicles?edit=veh-1"
                      className="text-xs text-[#6366F1] hover:underline flex items-center gap-1"
                    >
                      Edit record <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[#141B2A] transition-colors">
                    <div className="flex items-center gap-2.5">
                      <Car className="w-4 h-4 text-[#94A3B8]" />
                      <div>
                        <p className="text-xs font-medium text-white">Vehicle V-002</p>
                        <p className="text-[10px] text-[#64748B]">Vehicle</p>
                      </div>
                    </div>
                    <Link
                      href="/admin/vehicles?edit=veh-2"
                      className="text-xs text-[#6366F1] hover:underline flex items-center gap-1"
                    >
                      Edit record <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
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
                  <tr className="border-b border-[#1C2436] text-[#64748B] text-[11px]">
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
                  <tr className="border-b border-[#1C2436] text-[#64748B] text-[11px]">
                    <th scope="col" className="pb-3 font-medium">Attribute</th>
                    <th scope="col" className="pb-3 font-medium">
                      <div>
                        <p className="text-white font-semibold">Vehicle V-001</p>
                        <p className="text-[10px] text-[#E5A83B]">Unverified</p>
                      </div>
                    </th>
                    <th scope="col" className="pb-3 font-medium">
                      <div>
                        <p className="text-white font-semibold">Vehicle V-002</p>
                        <p className="text-[10px] text-[#E5A83B]">Unverified</p>
                      </div>
                    </th>
                    <th scope="col" className="pb-3 font-medium">
                      <div>
                        <p className="text-white font-semibold">Vehicle V-003</p>
                        <p className="text-[10px] text-[#E5A83B]">Unverified</p>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182030]">
                  {attributes.map((attr) => (
                    <tr key={attr.id} className="hover:bg-[#141B2A] transition-colors">
                      <td className="py-3 pr-4 font-semibold text-white">
                        {attr.label} {attr.unit !== "None" ? `(${attr.unit})` : ""}
                      </td>
                      <td className="py-3 text-[#94A3B8]">{missingValueDisplay}</td>
                      <td className="py-3 text-[#94A3B8]">{missingValueDisplay}</td>
                      <td className="py-3 text-[#94A3B8]">{missingValueDisplay}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State / Comparison List (Image 19) */
        <div className="space-y-6">
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 rounded-2xl border border-[#1C2436] bg-[#111622]/50">
            <div className="w-16 h-16 rounded-full bg-[#111622] border border-[#1C2436] flex items-center justify-center text-[#94A3B8] shadow-inner">
              <Scale className="w-8 h-8 text-[#6366F1]" />
            </div>

            <div className="space-y-1 max-w-md">
              <h2 className="text-lg font-bold text-white">
                {activeTab === "weapon" ? "No weapon comparisons yet" : "No vehicle comparisons yet"}
              </h2>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Choose database records and attributes to create your first comparison. Unknown specifications remain visible as Unknown.
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
                className="text-xs font-semibold text-[#6366F1] hover:underline px-3 py-2"
              >
                Read comparison guidelines →
              </button>
            </div>
          </div>

          {/* 3 Value Proposition Cards (Image 19 bottom) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#111622] border border-[#1C2436] flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#182030] border border-[#243048] flex items-center justify-center text-[#94A3B8] shrink-0">
                <Scale className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-white">Database linked</p>
                <p className="text-[11px] text-[#64748B] leading-relaxed">
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
                <p className="text-[11px] text-[#64748B] leading-relaxed">
                  Up to 3 records per comparison on desktop and mobile viewports.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#111622] border border-[#1C2436] flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#182030] border border-[#243048] flex items-center justify-center text-[#94A3B8] shrink-0">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-white">Highlight rules</p>
                <p className="text-[11px] text-[#64748B] leading-relaxed">
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
