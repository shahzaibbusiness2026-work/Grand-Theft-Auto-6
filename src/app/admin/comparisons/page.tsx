"use client";

import React, { useState } from "react";
import {
  GitCompare,
  Plus,
  Scale,
  Car,
  Crosshair,
  CheckCircle2,
  Trash2,
  ArrowRight,
  Eye,
  SlidersHorizontal,
  Sparkles,
  Trophy
} from "lucide-react";
import { EmptyState } from "@/components/admin/empty-state";
import { useToast } from "@/components/admin/toast";
import {
  INITIAL_ADMIN_VEHICLES,
  INITIAL_ADMIN_WEAPONS,
} from "@/lib/admin-store";
import { cn } from "@/lib/utils";

interface ComparisonConfig {
  id: string;
  name: string;
  type: "vehicle" | "weapon";
  items: string[]; // item ids
  attributes: {
    key: string;
    label: string;
    rule: "higher" | "lower" | "neutral";
    unit: string;
  }[];
  published: boolean;
}

export default function AdminComparisonsPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"vehicle" | "weapon">("vehicle");
  const [comparisons, setComparisons] = useState<ComparisonConfig[]>([
    {
      id: "comp-1",
      name: "High-End Sports: Banshee vs Cheetah",
      type: "vehicle",
      items: ["veh-1", "veh-2"],
      attributes: [
        { key: "topSpeed", label: "Top Speed", rule: "higher", unit: "mph" },
        { key: "acceleration", label: "Acceleration", rule: "lower", unit: "s" },
        { key: "handling", label: "Handling Score", rule: "higher", unit: "/100" },
        { key: "weight", label: "Curb Weight", rule: "lower", unit: "kg" },
      ],
      published: true,
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ComparisonConfig>({
    id: `comp-${Date.now()}`,
    name: "Vice City Street Racers",
    type: "vehicle",
    items: ["veh-1", "veh-2"],
    attributes: [
      { key: "topSpeed", label: "Top Speed", rule: "higher", unit: "mph" },
      { key: "acceleration", label: "0-60 mph", rule: "lower", unit: "s" },
      { key: "handling", label: "Handling", rule: "higher", unit: "/100" },
    ],
    published: false,
  });

  const currentTabComparisons = comparisons.filter((c) => c.type === activeTab);

  const handleSaveComparison = () => {
    setComparisons((prev) => {
      const exists = prev.some((c) => c.id === editingConfig.id);
      if (exists) {
        return prev.map((c) => (c.id === editingConfig.id ? editingConfig : c));
      }
      return [editingConfig, ...prev];
    });
    setIsEditing(false);
    showToast({
      title: "Comparison Saved",
      description: `Comparison "${editingConfig.name}" configured and saved.`,
      type: "success",
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--admin-border-subtle)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--admin-text)] tracking-tight flex items-center gap-2.5">
            <GitCompare className="w-6 h-6 text-[var(--admin-primary)]" />
            <span>Comparisons Manager</span>
          </h1>
          <p className="text-xs text-[var(--admin-text-muted)] mt-1">
            Build and publish comparative side-by-side matrices for public readers to contrast stats.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => {
              setEditingConfig({
                id: `comp-${Date.now()}`,
                name: activeTab === "vehicle" ? "New Vehicle Showdown" : "New Firearm Comparison",
                type: activeTab,
                items:
                  activeTab === "vehicle"
                    ? [INITIAL_ADMIN_VEHICLES[0]?.id || "", INITIAL_ADMIN_VEHICLES[1]?.id || ""]
                    : [INITIAL_ADMIN_WEAPONS[0]?.id || "", INITIAL_ADMIN_WEAPONS[1]?.id || ""],
                attributes:
                  activeTab === "vehicle"
                    ? [
                        { key: "topSpeed", label: "Top Speed", rule: "higher", unit: "mph" },
                        { key: "acceleration", label: "0-60 mph", rule: "lower", unit: "s" },
                        { key: "handling", label: "Handling Score", rule: "higher", unit: "/100" },
                      ]
                    : [
                        { key: "damage", label: "Damage", rule: "higher", unit: "/100" },
                        { key: "range", label: "Effective Range", rule: "higher", unit: "m" },
                        { key: "rateOfFire", label: "Fire Rate", rule: "higher", unit: "RPM" },
                      ],
                published: true,
              });
              setIsEditing(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--admin-primary)] hover:opacity-90 text-white text-xs font-black uppercase tracking-wider transition-colors shadow-md shadow-[var(--admin-primary)]/25"
          >
            <Plus className="w-4 h-4" />
            <span>New Comparison</span>
          </button>
        )}
      </div>

      {/* Mode Tabs (Image 7 & 19) */}
      <div className="flex items-center gap-2 border-b border-[var(--admin-border)] pb-2">
        <button
          onClick={() => {
            setActiveTab("vehicle");
            setIsEditing(false);
          }}
          className={cn(
            "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all",
            activeTab === "vehicle"
              ? "bg-[var(--admin-primary)] text-white shadow-sm"
              : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-elevated)]"
          )}
        >
          <Car className="w-4 h-4" />
          <span>Vehicle Comparisons</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("weapon");
            setIsEditing(false);
          }}
          className={cn(
            "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all",
            activeTab === "weapon"
              ? "bg-[var(--admin-primary)] text-white shadow-sm"
              : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-elevated)]"
          )}
        >
          <Crosshair className="w-4 h-4" />
          <span>Weapon Comparisons</span>
        </button>
      </div>

      {/* If In Editing Mode (Image 7) */}
      {isEditing ? (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--admin-text)] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[var(--admin-primary)]" />
                <span>Configure Comparison Matrix</span>
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs text-[var(--admin-text-muted)] hover:underline"
              >
                Cancel & Close
              </button>
            </div>

            {/* Comparison Title & Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--admin-text)] mb-1">
                  Comparison Display Name
                </label>
                <input
                  type="text"
                  value={editingConfig.name}
                  onChange={(e) =>
                    setEditingConfig({ ...editingConfig, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)] font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--admin-text)] mb-1">
                  Comparing Items
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--admin-text)] font-semibold p-2 rounded-xl bg-[var(--admin-elevated)] border border-[var(--admin-border)] flex-1 truncate">
                    {activeTab === "vehicle"
                      ? "Bravado Banshee GTS vs Pegassi Zorrusso"
                      : "Combat Pistol vs Service Carbine"}
                  </span>
                </div>
              </div>
            </div>

            {/* Attributes Table Configuration */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)]">
                  Attributes & Comparison Rules
                </h3>
                <button
                  onClick={() => {
                    setEditingConfig({
                      ...editingConfig,
                      attributes: [
                        ...editingConfig.attributes,
                        { key: "custom", label: "Custom Spec", rule: "higher", unit: "pts" },
                      ],
                    });
                  }}
                  className="text-xs font-bold text-[var(--admin-primary)] hover:underline"
                >
                  + Add Attribute
                </button>
              </div>

              <div className="rounded-xl border border-[var(--admin-border)] overflow-hidden bg-[var(--admin-surface)]">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[var(--admin-border)] text-[var(--admin-text-muted)] bg-[var(--admin-elevated)]">
                      <th className="p-3 font-bold uppercase tracking-wider">Attribute Label</th>
                      <th className="p-3 font-bold uppercase tracking-wider">Rule (Win Criteria)</th>
                      <th className="p-3 font-bold uppercase tracking-wider">Unit</th>
                      <th className="p-3 font-bold uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--admin-border-subtle)]">
                    {editingConfig.attributes.map((attr, idx) => (
                      <tr key={idx} className="hover:bg-[var(--admin-elevated)]/40 transition-colors">
                        <td className="p-3">
                          <input
                            type="text"
                            value={attr.label}
                            onChange={(e) => {
                              const updated = [...editingConfig.attributes];
                              updated[idx].label = e.target.value;
                              setEditingConfig({ ...editingConfig, attributes: updated });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] font-semibold focus:outline-none"
                          />
                        </td>
                        <td className="p-3">
                          <select
                            value={attr.rule}
                            onChange={(e) => {
                              const updated = [...editingConfig.attributes];
                              updated[idx].rule = e.target.value as "higher" | "lower" | "neutral";
                              setEditingConfig({ ...editingConfig, attributes: updated });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none"
                          >
                            <option value="higher">Higher value wins</option>
                            <option value="lower">Lower value wins (e.g. 0-60 time)</option>
                            <option value="neutral">Neutral / Informational</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <input
                            type="text"
                            value={attr.unit}
                            onChange={(e) => {
                              const updated = [...editingConfig.attributes];
                              updated[idx].unit = e.target.value;
                              setEditingConfig({ ...editingConfig, attributes: updated });
                            }}
                            className="w-20 px-2.5 py-1 rounded-lg bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] font-mono focus:outline-none"
                          />
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setEditingConfig({
                                ...editingConfig,
                                attributes: editingConfig.attributes.filter((_, i) => i !== idx),
                              });
                            }}
                            className="p-1 rounded text-rose-400 hover:bg-rose-500/10"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Live Comparison Matrix Preview (Image 7) */}
            <div className="space-y-3 pt-4 border-t border-[var(--admin-border)]">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[var(--admin-primary)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)]">
                  Live Preview Matrix
                </h3>
              </div>

              <div className="rounded-xl border border-[var(--admin-border)] overflow-hidden bg-[var(--admin-surface)] shadow-sm">
                <table className="w-full text-center text-xs">
                  <thead>
                    <tr className="border-b border-[var(--admin-border)] bg-[var(--admin-elevated)]">
                      <th className="p-3.5 text-left font-bold uppercase tracking-wider text-[var(--admin-text-muted)]">
                        Technical Specification
                      </th>
                      <th className="p-3.5 font-black text-[var(--admin-text)]">
                        <div className="flex items-center justify-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-indigo-500" />
                          <span>Bravado Banshee GTS</span>
                        </div>
                      </th>
                      <th className="p-3.5 font-black text-[var(--admin-text)]">
                        <div className="flex items-center justify-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-purple-500" />
                          <span>Pegassi Zorrusso</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--admin-border-subtle)] font-mono">
                    <tr className="hover:bg-[var(--admin-elevated)]/30 transition-colors">
                      <td className="p-3.5 text-left font-sans font-bold text-[var(--admin-text)]">
                        Top Speed
                      </td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                          155 mph <Trophy className="w-3.5 h-3.5 text-amber-400 inline" />
                        </span>
                      </td>
                      <td className="p-3.5 text-[var(--admin-text-muted)] font-medium">148 mph</td>
                    </tr>
                    <tr className="hover:bg-[var(--admin-elevated)]/30 transition-colors">
                      <td className="p-3.5 text-left font-sans font-bold text-[var(--admin-text)]">
                        Acceleration (0-60 mph)
                      </td>
                      <td className="p-3.5 text-[var(--admin-text-muted)] font-medium">3.4s</td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                          3.1s <Trophy className="w-3.5 h-3.5 text-amber-400 inline" />
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-[var(--admin-elevated)]/30 transition-colors">
                      <td className="p-3.5 text-left font-sans font-bold text-[var(--admin-text)]">
                        Handling Score
                      </td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                          84 / 100 <Trophy className="w-3.5 h-3.5 text-amber-400 inline" />
                        </span>
                      </td>
                      <td className="p-3.5 text-[var(--admin-text-muted)] font-medium">80 / 100</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--admin-border)]">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-elevated)] text-xs font-bold text-[var(--admin-text)] hover:bg-[var(--admin-surface)]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveComparison}
                className="px-5 py-2 rounded-xl bg-[var(--admin-primary)] text-xs font-bold text-white hover:opacity-90 shadow-md shadow-[var(--admin-primary)]/20"
              >
                Save & Publish Comparison
              </button>
            </div>
          </div>
        </div>
      ) : currentTabComparisons.length === 0 ? (
        /* Empty State (Image 19) */
        <EmptyState
          icon={Scale}
          title="No comparisons configured yet"
          description="Set up side-by-side comparison matrices for public site visitors to evaluate vehicles or weapons across key attributes."
          guidelines={[
            "Choose at least 2 database records to compare.",
            "Define attribute comparison rules (Higher is better, Lower is better, Neutral).",
            "Verify data points before publishing live to ensure reader accuracy.",
          ]}
          action={{
            label: "Create First Comparison",
            icon: Plus,
            onClick: () => setIsEditing(true),
          }}
        />
      ) : (
        /* Configured Comparisons List (Image 7) */
        <div className="space-y-4">
          {currentTabComparisons.map((comp) => (
            <div
              key={comp.id}
              className="p-5 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[var(--admin-primary)]/40 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[var(--admin-text)]">{comp.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Live Public Matrix
                  </span>
                </div>
                <p className="text-xs text-[var(--admin-text-muted)]">
                  {comp.attributes.length} attributes configured • Comparing {comp.items.length} records
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingConfig(comp);
                    setIsEditing(true);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-[var(--admin-elevated)] border border-[var(--admin-border)] text-xs font-bold text-[var(--admin-text)] hover:bg-[var(--admin-surface)] transition-colors"
                >
                  Edit Configuration
                </button>
                <button
                  onClick={() => {
                    setComparisons((prev) => prev.filter((c) => c.id !== comp.id));
                    showToast({
                      title: "Comparison Removed",
                      description: `${comp.name} deleted.`,
                      type: "danger",
                    });
                  }}
                  className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
