"use client";

import React, { useState, useMemo } from "react";
import {
  Crosshair,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Edit,
  Trash2,
  SlidersHorizontal,
  ExternalLink,
  ShieldCheck,
  Flame,
  Target,
  Zap,
  RotateCcw
} from "lucide-react";
import { DataTable, Column } from "@/components/admin/data-table";
import { Drawer } from "@/components/admin/drawer";
import { Modal } from "@/components/admin/modal";
import { useToast } from "@/components/admin/toast";
import {
  INITIAL_ADMIN_WEAPONS,
  AdminWeapon,
} from "@/lib/admin-store";
import { cn } from "@/lib/utils";

export default function AdminWeaponsPage() {
  const { showToast } = useToast();
  const [weapons, setWeapons] = useState<AdminWeapon[]>(INITIAL_ADMIN_WEAPONS);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVerification, setSelectedVerification] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Drawer / Full Edit state
  const [editingWeapon, setEditingWeapon] = useState<AdminWeapon | null>(null);
  const [drawerMode, setDrawerMode] = useState<"quick" | "full">("quick");

  // New Weapon Modal
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newWeaponData, setNewWeaponData] = useState({
    name: "",
    category: "Pistol" as AdminWeapon["category"],
    ammunition: "9mm Parabellum",
  });

  // Filtered list
  const filteredWeapons = useMemo(() => {
    return weapons.filter((w) => {
      if (activeCategory !== "all" && w.category !== activeCategory) return false;
      if (
        selectedVerification !== "all" &&
        w.verification !== selectedVerification
      ) {
        return false;
      }
      if (
        searchQuery &&
        !w.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !w.code.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !w.ammunition.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [weapons, activeCategory, selectedVerification, searchQuery]);

  const categoryCounts = {
    all: weapons.length,
    Pistol: weapons.filter((w) => w.category === "Pistol").length,
    Rifle: weapons.filter((w) => w.category === "Rifle").length,
    SMG: weapons.filter((w) => w.category === "SMG").length,
    Shotgun: weapons.filter((w) => w.category === "Shotgun").length,
    Heavy: weapons.filter((w) => w.category === "Heavy").length,
  };

  const handleSaveDrawer = () => {
    if (!editingWeapon) return;
    setWeapons((prev) =>
      prev.map((w) => (w.id === editingWeapon.id ? editingWeapon : w))
    );
    showToast({
      title: "Weapon Updated",
      description: `Specifications for ${editingWeapon.name} have been saved.`,
      type: "success",
    });
    setEditingWeapon(null);
  };

  const handleCreateWeapon = () => {
    if (!newWeaponData.name.trim()) return;
    const newRecord: AdminWeapon = {
      id: `wep-${Date.now()}`,
      code: newWeaponData.name.toLowerCase().replace(/\s+/g, "-"),
      name: newWeaponData.name,
      category: newWeaponData.category,
      ammunition: newWeaponData.ammunition,
      verification: "unverified",
      status: "draft",
      damage: "40",
      range: "50",
      rateOfFire: "600 RPM",
      magazineSize: "15",
      notes: "Newly identified weapon from trailer asset review.",
      updatedAt: "Just now",
    };
    setWeapons([newRecord, ...weapons]);
    setIsNewModalOpen(false);
    setNewWeaponData({ name: "", category: "Pistol", ammunition: "9mm Parabellum" });
    showToast({
      title: "Weapon Added",
      description: `${newRecord.name} added to arsenal database.`,
      type: "success",
    });
    setEditingWeapon(newRecord);
    setDrawerMode("full");
  };

  const columns: Column<AdminWeapon>[] = [
    {
      key: "name",
      header: "Weapon Name & Code",
      sortable: true,
      render: (w) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--admin-elevated)] border border-[var(--admin-border)] flex items-center justify-center text-[var(--admin-primary)] font-bold text-xs shrink-0">
            <Crosshair className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-[var(--admin-text)] hover:text-[var(--admin-primary)] transition-colors">
              {w.name}
            </p>
            <p className="text-[11px] text-[var(--admin-text-muted)] font-mono">
              {w.code}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (w) => (
        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[var(--admin-elevated)] border border-[var(--admin-border-subtle)] text-[var(--admin-text)]">
          {w.category}
        </span>
      ),
    },
    {
      key: "ammunition",
      header: "Ammunition",
      sortable: true,
      render: (w) => (
        <span className="text-xs font-mono text-[var(--admin-text)]">
          {w.ammunition}
        </span>
      ),
    },
    {
      key: "verification",
      header: "Verification",
      sortable: true,
      render: (w) => (
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase border",
            w.verification === "verified"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              : w.verification === "pending_source"
              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
              : "bg-rose-500/10 text-rose-400 border-rose-500/30"
          )}
        >
          {w.verification === "verified" && <CheckCircle2 className="w-3 h-3" />}
          {w.verification === "pending_source" && <Clock className="w-3 h-3" />}
          {w.verification === "unverified" && <AlertTriangle className="w-3 h-3" />}
          <span>{w.verification.replace("_", " ")}</span>
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (w) => (
        <span
          className={cn(
            "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border",
            w.status === "published" &&
              "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
            w.status === "draft" &&
              "bg-[var(--admin-elevated)] text-[var(--admin-text-muted)] border-[var(--admin-border)]",
            w.status === "review" &&
              "bg-amber-500/10 text-amber-400 border-amber-500/30"
          )}
        >
          {w.status}
        </span>
      ),
    },
    {
      key: "updatedAt",
      header: "Last Modified",
      render: (w) => (
        <span className="text-[11px] text-[var(--admin-text-muted)] font-mono">
          {w.updatedAt}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--admin-border-subtle)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--admin-text)] tracking-tight flex items-center gap-2.5">
            <Crosshair className="w-6 h-6 text-[var(--admin-primary)]" />
            <span>Weapons Management</span>
          </h1>
          <p className="text-xs text-[var(--admin-text-muted)] mt-1">
            Catalogue firearm models, ballistics, ammunition types, and acquisition locations in Leonida.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--admin-primary)] hover:opacity-90 text-white text-xs font-black uppercase tracking-wider transition-colors shadow-md shadow-[var(--admin-primary)]/25"
        >
          <Plus className="w-4 h-4" />
          <span>Add Weapon</span>
        </button>
      </div>

      {/* Category Tabs (Image 5) */}
      <div className="flex items-center gap-2 border-b border-[var(--admin-border)] pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveCategory("all")}
          className={cn(
            "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
            activeCategory === "all"
              ? "bg-[var(--admin-primary)] text-white shadow-sm"
              : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]"
          )}
        >
          <span>All Weapons</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
            {categoryCounts.all}
          </span>
        </button>

        {(["Pistol", "Rifle", "SMG", "Shotgun", "Heavy"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
              activeCategory === cat
                ? "bg-[var(--admin-primary)] text-white shadow-sm"
                : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]"
            )}
          >
            <span>{cat}s</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
              {categoryCounts[cat]}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Verification Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--admin-text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search weapons by name, caliber, or code..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)] transition-colors"
          />
        </div>

        <div>
          <select
            value={selectedVerification}
            onChange={(e) => setSelectedVerification(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)] transition-colors"
          >
            <option value="all">All Verification Statuses</option>
            <option value="verified">Verified</option>
            <option value="pending_source">Pending Source</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
      </div>

      {/* Weapons Data Table */}
      <DataTable
        data={filteredWeapons}
        columns={columns}
        selectable
        selectedIds={selectedIds}
        onSelectRow={(id) =>
          setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
          )
        }
        onSelectAll={(all) =>
          setSelectedIds(all ? filteredWeapons.map((w) => w.id) : [])
        }
        bulkActions={
          <button
            onClick={() => {
              setWeapons((prev) =>
                prev.map((w) =>
                  selectedIds.includes(w.id) ? { ...w, verification: "verified" } : w
                )
              );
              showToast({
                title: "Marked Verified",
                description: `${selectedIds.length} weapon(s) marked as verified.`,
                type: "success",
              });
              setSelectedIds([]);
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
          >
            Verify Selected
          </button>
        }
        actions={(w) => (
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={() => {
                setEditingWeapon(w);
                setDrawerMode("quick");
              }}
              className="p-1.5 rounded-lg text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)] transition-colors"
              title="Quick edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setEditingWeapon(w);
                setDrawerMode("full");
              }}
              className="p-1.5 rounded-lg text-[var(--admin-primary)] hover:bg-[var(--admin-primary)]/10 transition-colors"
              title="Full specifications"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      {/* Edit Weapon Drawer (Image 5 & Image 6) */}
      <Drawer
        isOpen={!!editingWeapon}
        onClose={() => setEditingWeapon(null)}
        title={
          editingWeapon
            ? `${drawerMode === "full" ? "Weapon Specifications: " : "Quick Edit: "}${editingWeapon.name}`
            : "Edit Weapon"
        }
        subtitle={
          editingWeapon ? `Category: ${editingWeapon.category} • Ammunition: ${editingWeapon.ammunition}` : undefined
        }
        size={drawerMode === "full" ? "2xl" : "lg"}
        footer={
          <>
            <button
              onClick={() => setEditingWeapon(null)}
              className="px-4 py-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-elevated)] text-xs font-bold text-[var(--admin-text)] hover:bg-[var(--admin-surface)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveDrawer}
              className="px-5 py-2 rounded-xl bg-[var(--admin-primary)] text-xs font-bold text-white hover:opacity-90 transition-opacity shadow-md shadow-[var(--admin-primary)]/20"
            >
              Save Changes
            </button>
          </>
        }
      >
        {editingWeapon && (
          <div className="space-y-6">
            {/* Quick Edit Mode (Image 5) */}
            {drawerMode === "quick" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--admin-text)] mb-1">
                    Weapon Name
                  </label>
                  <input
                    type="text"
                    value={editingWeapon.name}
                    onChange={(e) =>
                      setEditingWeapon({ ...editingWeapon, name: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[var(--admin-text)] mb-1">
                      Category
                    </label>
                    <select
                      value={editingWeapon.category}
                      onChange={(e) =>
                        setEditingWeapon({
                          ...editingWeapon,
                          category: e.target.value as AdminWeapon["category"],
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
                    >
                      <option value="Pistol">Pistol</option>
                      <option value="Rifle">Rifle</option>
                      <option value="SMG">SMG</option>
                      <option value="Shotgun">Shotgun</option>
                      <option value="Heavy">Heavy</option>
                      <option value="Melee">Melee</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--admin-text)] mb-1">
                      Ammunition
                    </label>
                    <input
                      type="text"
                      value={editingWeapon.ammunition}
                      onChange={(e) =>
                        setEditingWeapon({ ...editingWeapon, ammunition: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[var(--admin-text)] mb-1">
                      Verification Status
                    </label>
                    <select
                      value={editingWeapon.verification}
                      onChange={(e) =>
                        setEditingWeapon({
                          ...editingWeapon,
                          verification: e.target.value as AdminWeapon["verification"],
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
                    >
                      <option value="verified">Verified</option>
                      <option value="pending_source">Pending Source</option>
                      <option value="unverified">Unverified</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--admin-text)] mb-1">
                      Status
                    </label>
                    <select
                      value={editingWeapon.status}
                      onChange={(e) =>
                        setEditingWeapon({
                          ...editingWeapon,
                          status: e.target.value as AdminWeapon["status"],
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
                    >
                      <option value="draft">Draft</option>
                      <option value="review">Under Review</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--admin-text)] mb-1">
                    Editorial Notes
                  </label>
                  <textarea
                    rows={3}
                    value={editingWeapon.notes || ""}
                    onChange={(e) =>
                      setEditingWeapon({ ...editingWeapon, notes: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setDrawerMode("full")}
                    className="w-full py-2.5 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-elevated)] hover:bg-[var(--admin-card)] text-xs font-bold text-[var(--admin-primary)] flex items-center justify-center gap-2 transition-colors"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Open Full Specifications Form</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Full Specs Form (Image 6) */
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)] mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-pink-400" />
                    <span>Ballistics & Performance Metrics</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[var(--admin-text-muted)] mb-1">
                        Damage Rating
                      </label>
                      <input
                        type="text"
                        value={editingWeapon.damage || ""}
                        onChange={(e) =>
                          setEditingWeapon({ ...editingWeapon, damage: e.target.value })
                        }
                        placeholder="e.g. 38"
                        className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[var(--admin-text-muted)] mb-1">
                        Effective Range
                      </label>
                      <input
                        type="text"
                        value={editingWeapon.range || ""}
                        onChange={(e) =>
                          setEditingWeapon({ ...editingWeapon, range: e.target.value })
                        }
                        placeholder="e.g. 45m"
                        className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[var(--admin-text-muted)] mb-1">
                        Rate of Fire
                      </label>
                      <input
                        type="text"
                        value={editingWeapon.rateOfFire || ""}
                        onChange={(e) =>
                          setEditingWeapon({ ...editingWeapon, rateOfFire: e.target.value })
                        }
                        placeholder="e.g. 650 RPM"
                        className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[var(--admin-text-muted)] mb-1">
                        Magazine Size
                      </label>
                      <input
                        type="text"
                        value={editingWeapon.magazineSize || ""}
                        onChange={(e) =>
                          setEditingWeapon({ ...editingWeapon, magazineSize: e.target.value })
                        }
                        placeholder="e.g. 16 rounds"
                        className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)] font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--admin-border)]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)] mb-3">
                    Acquisition & World Spawns
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[var(--admin-text-muted)] mb-1">
                        Acquisition Method
                      </label>
                      <input
                        type="text"
                        value={editingWeapon.acquisitionMethod || ""}
                        onChange={(e) =>
                          setEditingWeapon({
                            ...editingWeapon,
                            acquisitionMethod: e.target.value,
                          })
                        }
                        placeholder="e.g. Ammu-Nation / Police Station Drop"
                        className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[var(--admin-text-muted)] mb-1">
                        Linked Map Location
                      </label>
                      <input
                        type="text"
                        value={editingWeapon.linkedLocation || ""}
                        onChange={(e) =>
                          setEditingWeapon({
                            ...editingWeapon,
                            linkedLocation: e.target.value,
                          })
                        }
                        placeholder="e.g. Vice City Metro Police HQ"
                        className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
                      />
                    </div>
                  </div>
                </div>

                {/* Verification Checklist (Image 6) */}
                <div className="pt-2 border-t border-[var(--admin-border)] space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)]">
                    Source Corroboration Checklist
                  </h4>
                  <div className="p-3 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] space-y-2 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-[var(--admin-border)] text-[var(--admin-primary)]"
                      />
                      <span className="text-[var(--admin-text)]">
                        Corroborated in Official Trailer 1 (Timestamp verified)
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-[var(--admin-border)] text-[var(--admin-primary)]"
                      />
                      <span className="text-[var(--admin-text)]">
                        Weapon model matches real-world firearm blueprint
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-[var(--admin-border)] text-[var(--admin-primary)]"
                      />
                      <span className="text-[var(--admin-text)]">
                        In-game audio sample corroborated by sound designer review
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => setDrawerMode("quick")}
                    className="text-xs text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:underline"
                  >
                    ← Switch back to Quick Edit
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Add New Weapon Modal */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Add New Weapon to Arsenal"
        description="Create a weapon record to track in the Leonida database."
        footer={
          <>
            <button
              onClick={() => setIsNewModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-elevated)] text-xs font-bold text-[var(--admin-text)]"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateWeapon}
              className="px-5 py-2 rounded-xl bg-[var(--admin-primary)] text-xs font-bold text-white shadow-md shadow-[var(--admin-primary)]/20"
            >
              Create Weapon Record
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--admin-text)] mb-1">
              Weapon Name
            </label>
            <input
              type="text"
              value={newWeaponData.name}
              onChange={(e) =>
                setNewWeaponData({ ...newWeaponData, name: e.target.value })
              }
              placeholder="e.g. Service Carbine"
              className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--admin-text)] mb-1">
              Category
            </label>
            <select
              value={newWeaponData.category}
              onChange={(e) =>
                setNewWeaponData({
                  ...newWeaponData,
                  category: e.target.value as AdminWeapon["category"],
                })
              }
              className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
            >
              <option value="Pistol">Pistol</option>
              <option value="Rifle">Rifle</option>
              <option value="SMG">SMG</option>
              <option value="Shotgun">Shotgun</option>
              <option value="Heavy">Heavy</option>
              <option value="Melee">Melee</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--admin-text)] mb-1">
              Ammunition Type
            </label>
            <input
              type="text"
              value={newWeaponData.ammunition}
              onChange={(e) =>
                setNewWeaponData({ ...newWeaponData, ammunition: e.target.value })
              }
              placeholder="e.g. 5.56 NATO, 9mm, 12 Gauge"
              className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
