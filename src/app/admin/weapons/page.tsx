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
  SlidersHorizontal,
  Target,
  RotateCcw,
} from "lucide-react";
import { DataTable, Column } from "@/components/admin/data-table";
import { Drawer } from "@/components/admin/drawer";
import { Modal } from "@/components/admin/modal";
import { useToast } from "@/components/admin/toast";
import { Button } from "@/components/admin/ui/button";
import { Badge } from "@/components/admin/ui/badge";
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

  // Dynamic Source Corroboration Checklist
  const [corroborationChecklist, setCorroborationChecklist] = useState({
    trailer: true,
    blueprint: true,
    audio: false,
  });

  const verifiedChecklistCount = Object.values(corroborationChecklist).filter(Boolean).length;

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

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    activeCategory !== "all" ||
    selectedVerification !== "all";

  const resetFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setSelectedVerification("all");
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
        <Badge variant="neutral" size="sm">
          {w.category}
        </Badge>
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
      render: (w) => {
        const variantMap: Record<AdminWeapon["verification"], "success" | "warning" | "danger"> = {
          verified: "success",
          pending_source: "warning",
          unverified: "danger",
        };
        const iconMap: Record<AdminWeapon["verification"], React.ReactNode> = {
          verified: <CheckCircle2 className="w-3 h-3" />,
          pending_source: <Clock className="w-3 h-3" />,
          unverified: <AlertTriangle className="w-3 h-3" />,
        };
        return (
          <Badge
            variant={variantMap[w.verification]}
            size="sm"
            dot
            icon={iconMap[w.verification]}
          >
            {w.verification.replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (w) => {
        const variantMap: Record<AdminWeapon["status"], "primary" | "neutral" | "warning" | "danger"> = {
          published: "primary",
          draft: "neutral",
          review: "warning",
          archived: "danger",
        };
        return (
          <Badge variant={variantMap[w.status]} size="sm">
            {w.status}
          </Badge>
        );
      },
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

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsNewModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Weapon
        </Button>
      </div>

      {/* Category Tabs */}
      <div
        role="tablist"
        aria-label="Filter weapons by category"
        className="flex items-center gap-2 border-b border-[var(--admin-border)] pb-2 overflow-x-auto scrollbar-none"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeCategory === "all"}
          onClick={() => setActiveCategory("all")}
          className={cn(
            "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]",
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
            type="button"
            role="tab"
            aria-selected={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]",
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
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--admin-text-muted)]" />
            <input
              type="text"
              id="weapon-search"
              aria-label="Search weapons by name, caliber, or code"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search weapons by name, caliber, or code..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)] transition-colors"
            />
          </div>

          <div>
            <select
              id="weapon-verification-filter"
              aria-label="Filter by verification status"
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

        {/* Active Filters Reset Bar */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[var(--admin-text-muted)] font-medium">
              Filtered results:
            </span>
            <span className="font-bold text-[var(--admin-text)]">
              {filteredWeapons.length} of {weapons.length} weapons
            </span>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-[var(--admin-primary)] hover:underline font-bold ml-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--admin-primary)] rounded"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset filters</span>
            </button>
          </div>
        )}
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
        emptyState={
          <div className="py-8 text-center space-y-3">
            <Crosshair className="w-8 h-8 text-[var(--admin-text-muted)] mx-auto opacity-50" />
            <p className="text-xs font-semibold text-[var(--admin-text)]">
              No weapons matched your criteria
            </p>
            {hasActiveFilters && (
              <Button variant="secondary" size="sm" onClick={resetFilters}>
                Clear all filters
              </Button>
            )}
          </div>
        }
        bulkActions={
          <Button
            variant="secondary"
            size="sm"
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
          >
            Verify Selected
          </Button>
        }
        actions={(w) => (
          <div className="flex items-center justify-end gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setEditingWeapon(w);
                setDrawerMode("quick");
              }}
              aria-label={`Quick edit ${w.name}`}
              title="Quick edit"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setEditingWeapon(w);
                setDrawerMode("full");
              }}
              aria-label={`Full specifications for ${w.name}`}
              title="Full specifications"
              className="text-[var(--admin-primary)]"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>
        )}
      />

      {/* Edit Weapon Drawer */}
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
            <Button
              variant="secondary"
              size="md"
              onClick={() => setEditingWeapon(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleSaveDrawer}
            >
              Save Changes
            </Button>
          </>
        }
      >
        {editingWeapon && (
          <div className="space-y-6">
            {/* Quick Edit Mode */}
            {drawerMode === "quick" ? (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="quick-weapon-name"
                    className="block text-xs font-bold text-[var(--admin-text)] mb-1"
                  >
                    Weapon Name
                  </label>
                  <input
                    id="quick-weapon-name"
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
                    <label
                      htmlFor="quick-weapon-category"
                      className="block text-xs font-bold text-[var(--admin-text)] mb-1"
                    >
                      Category
                    </label>
                    <select
                      id="quick-weapon-category"
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
                    <label
                      htmlFor="quick-weapon-ammo"
                      className="block text-xs font-bold text-[var(--admin-text)] mb-1"
                    >
                      Ammunition
                    </label>
                    <input
                      id="quick-weapon-ammo"
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
                    <label
                      htmlFor="quick-weapon-verification"
                      className="block text-xs font-bold text-[var(--admin-text)] mb-1"
                    >
                      Verification Status
                    </label>
                    <select
                      id="quick-weapon-verification"
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
                    <label
                      htmlFor="quick-weapon-status"
                      className="block text-xs font-bold text-[var(--admin-text)] mb-1"
                    >
                      Status
                    </label>
                    <select
                      id="quick-weapon-status"
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
                  <label
                    htmlFor="quick-weapon-notes"
                    className="block text-xs font-bold text-[var(--admin-text)] mb-1"
                  >
                    Editorial Notes
                  </label>
                  <textarea
                    id="quick-weapon-notes"
                    rows={3}
                    value={editingWeapon.notes || ""}
                    onChange={(e) =>
                      setEditingWeapon({ ...editingWeapon, notes: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setDrawerMode("full")}
                    className="w-full text-[var(--admin-primary)]"
                    leftIcon={<SlidersHorizontal className="w-4 h-4" />}
                  >
                    Open Full Specifications Form
                  </Button>
                </div>
              </div>
            ) : (
              /* Full Specs Form */
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)] mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-pink-400" />
                    <span>Ballistics & Performance Metrics</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label
                        htmlFor="full-spec-damage"
                        className="block text-[11px] font-bold text-[var(--admin-text-muted)] mb-1"
                      >
                        Damage Rating
                      </label>
                      <div className="relative">
                        <input
                          id="full-spec-damage"
                          type="text"
                          value={editingWeapon.damage || ""}
                          onChange={(e) =>
                            setEditingWeapon({ ...editingWeapon, damage: e.target.value })
                          }
                          placeholder="e.g. 38"
                          className="w-full pl-3 pr-10 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)] font-mono font-bold"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-rose-400 pointer-events-none">
                          DMG
                        </span>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="full-spec-range"
                        className="block text-[11px] font-bold text-[var(--admin-text-muted)] mb-1"
                      >
                        Effective Range
                      </label>
                      <div className="relative">
                        <input
                          id="full-spec-range"
                          type="text"
                          value={editingWeapon.range || ""}
                          onChange={(e) =>
                            setEditingWeapon({ ...editingWeapon, range: e.target.value })
                          }
                          placeholder="e.g. 45"
                          className="w-full pl-3 pr-8 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)] font-mono font-bold"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-emerald-400 pointer-events-none">
                          m
                        </span>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="full-spec-rof"
                        className="block text-[11px] font-bold text-[var(--admin-text-muted)] mb-1"
                      >
                        Rate of Fire
                      </label>
                      <div className="relative">
                        <input
                          id="full-spec-rof"
                          type="text"
                          value={editingWeapon.rateOfFire || ""}
                          onChange={(e) =>
                            setEditingWeapon({ ...editingWeapon, rateOfFire: e.target.value })
                          }
                          placeholder="e.g. 650"
                          className="w-full pl-3 pr-10 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)] font-mono font-bold"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-amber-400 pointer-events-none">
                          RPM
                        </span>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="full-spec-mag"
                        className="block text-[11px] font-bold text-[var(--admin-text-muted)] mb-1"
                      >
                        Magazine Size
                      </label>
                      <div className="relative">
                        <input
                          id="full-spec-mag"
                          type="text"
                          value={editingWeapon.magazineSize || ""}
                          onChange={(e) =>
                            setEditingWeapon({ ...editingWeapon, magazineSize: e.target.value })
                          }
                          placeholder="e.g. 16"
                          className="w-full pl-3 pr-10 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)] font-mono font-bold"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-indigo-400 pointer-events-none">
                          RDS
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--admin-border)]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)] mb-3">
                    Acquisition & World Spawns
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="full-spec-acquisition"
                        className="block text-[11px] font-medium text-[var(--admin-text-muted)] mb-1"
                      >
                        Acquisition Method
                      </label>
                      <input
                        id="full-spec-acquisition"
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
                      <label
                        htmlFor="full-spec-location"
                        className="block text-[11px] font-medium text-[var(--admin-text-muted)] mb-1"
                      >
                        Linked Map Location
                      </label>
                      <input
                        id="full-spec-location"
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

                {/* Interactive Verification Checklist */}
                <div className="pt-2 border-t border-[var(--admin-border)] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)]">
                      Source Corroboration Checklist
                    </h4>
                    <Badge
                      variant={verifiedChecklistCount === 3 ? "success" : "warning"}
                      size="sm"
                    >
                      {verifiedChecklistCount} of 3 Verified
                    </Badge>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] space-y-2.5 text-xs">
                    <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                      <input
                        type="checkbox"
                        checked={corroborationChecklist.trailer}
                        onChange={(e) =>
                          setCorroborationChecklist((prev) => ({
                            ...prev,
                            trailer: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 rounded border-[var(--admin-border)] text-[var(--admin-primary)] focus:ring-[var(--admin-primary)]"
                      />
                      <span
                        className={cn(
                          "font-medium transition-colors",
                          corroborationChecklist.trailer
                            ? "text-[var(--admin-text)]"
                            : "text-[var(--admin-text-muted)] group-hover:text-[var(--admin-text)]"
                        )}
                      >
                        Corroborated in Official Trailer 1 (Timestamp verified)
                      </span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                      <input
                        type="checkbox"
                        checked={corroborationChecklist.blueprint}
                        onChange={(e) =>
                          setCorroborationChecklist((prev) => ({
                            ...prev,
                            blueprint: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 rounded border-[var(--admin-border)] text-[var(--admin-primary)] focus:ring-[var(--admin-primary)]"
                      />
                      <span
                        className={cn(
                          "font-medium transition-colors",
                          corroborationChecklist.blueprint
                            ? "text-[var(--admin-text)]"
                            : "text-[var(--admin-text-muted)] group-hover:text-[var(--admin-text)]"
                        )}
                      >
                        Weapon model matches real-world firearm blueprint
                      </span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                      <input
                        type="checkbox"
                        checked={corroborationChecklist.audio}
                        onChange={(e) =>
                          setCorroborationChecklist((prev) => ({
                            ...prev,
                            audio: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 rounded border-[var(--admin-border)] text-[var(--admin-primary)] focus:ring-[var(--admin-primary)]"
                      />
                      <span
                        className={cn(
                          "font-medium transition-colors",
                          corroborationChecklist.audio
                            ? "text-[var(--admin-text)]"
                            : "text-[var(--admin-text-muted)] group-hover:text-[var(--admin-text)]"
                        )}
                      >
                        In-game audio sample corroborated by sound designer review
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setDrawerMode("quick")}
                  >
                    ← Switch back to Quick Edit
                  </Button>
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
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsNewModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleCreateWeapon}
            >
              Create Weapon Record
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="new-weapon-name"
              className="block text-xs font-bold text-[var(--admin-text)] mb-1"
            >
              Weapon Name
            </label>
            <input
              id="new-weapon-name"
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
            <label
              htmlFor="new-weapon-category"
              className="block text-xs font-bold text-[var(--admin-text)] mb-1"
            >
              Category
            </label>
            <select
              id="new-weapon-category"
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
            <label
              htmlFor="new-weapon-ammo"
              className="block text-xs font-bold text-[var(--admin-text)] mb-1"
            >
              Ammunition Type
            </label>
            <input
              id="new-weapon-ammo"
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
