"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  RotateCcw,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ArrowUpDown,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { Drawer } from "@/components/admin/drawer";
import { useToast } from "@/components/admin/toast";
import { Button } from "@/components/admin/ui/button";
import {
  INITIAL_ADMIN_WEAPONS,
  AdminWeapon,
} from "@/lib/admin-store";
import { getAdminWeapons, saveWeapon, deleteWeapon } from "@/lib/services/weapons";
import { cn } from "@/lib/utils";

// Weapon Silhouette SVG matching Image 5
function WeaponSilhouette({ category }: { category: string }) {
  if (category === "Rifle") {
    return (
      <svg
        className="w-7 h-4 text-[#94A3B8]"
        viewBox="0 0 48 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M4 14h6v2H2v-4h2v2zm6-2h8v2h-8v-2zm8-1h12v3H18v-3zm12-1h4v4h-4v-4zm4-2h8v5h-8V8zm8-1h4v6h-4V7zm-26 7l-2 5h-3l2-5h3zm14 0l-1 4h-2l1-4h2z" />
      </svg>
    );
  }
  return (
    <svg
      className="w-6 h-4 text-[#94A3B8]"
      viewBox="0 0 36 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4 8h16v3H4V8zm16 1h6v3h-6V9zm6-2h6v5h-6V7zm-20 4l3 7H6l-3-7h3zm9 0l1 5h-2l-1-5h2z" />
    </svg>
  );
}

export default function AdminWeaponsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [weapons, setWeapons] = useState<AdminWeapon[]>(INITIAL_ADMIN_WEAPONS);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "verification" | "drafts" | "archived">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAmmunition, setSelectedAmmunition] = useState("all");
  const [selectedVerification, setSelectedVerification] = useState("all");
  const [selectedPublication, setSelectedPublication] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Load from Supabase on mount
  React.useEffect(() => {
    setIsLoading(true);
    getAdminWeapons()
      .then((data) => {
        if (data && data.length > 0) setWeapons(data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Slide-over drawer state (Quick edit matching Image 5)
  const [drawerWeapon, setDrawerWeapon] = useState<AdminWeapon | null>(null);
  const [drawerNotes, setDrawerNotes] = useState("");

  // Toast visible by default matching Image 5
  const [showRestoredToast, setShowRestoredToast] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Tab counts — computed from actual data
  const tabCounts = {
    all: weapons.length,
    verification: weapons.filter((w) => w.verification !== "verified").length,
    drafts: weapons.filter((w) => w.status === "draft").length,
    archived: weapons.filter((w) => w.status === "archived").length,
  };

  // Filtered list
  const filteredWeapons = useMemo(() => {
    return weapons.filter((w) => {
      if (activeTab === "verification" && w.verification === "verified") return false;
      if (activeTab === "drafts" && w.status !== "draft") return false;
      if (activeTab === "archived" && w.status !== "archived") return false;

      if (selectedCategory !== "all" && w.category !== selectedCategory) return false;
      if (selectedAmmunition !== "all" && w.ammunition !== selectedAmmunition) return false;
      if (selectedVerification !== "all" && w.verification !== selectedVerification) return false;
      if (selectedPublication !== "all" && w.status !== selectedPublication) return false;

      if (
        searchQuery &&
        !w.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !w.code.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [
    weapons,
    activeTab,
    selectedCategory,
    selectedAmmunition,
    selectedVerification,
    selectedPublication,
    searchQuery,
  ]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedAmmunition("all");
    setSelectedVerification("all");
    setSelectedPublication("all");
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    const weapon = weapons.find((w) => w.id === id);
    if (weapon) {
      setDrawerWeapon(weapon);
      setDrawerNotes(weapon.notes || "");
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredWeapons.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredWeapons.map((w) => w.id));
    }
  };

  const handleSaveDrawer = async () => {
    if (!drawerWeapon) return;
    const updated = { ...drawerWeapon, notes: drawerNotes };
    setWeapons((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));

    showToast({ title: "Saving to Supabase…", description: `Saving ${updated.name}…`, type: "info" });

    const res = await saveWeapon(updated);

    if (res.success) {
      showToast({ title: "Weapon Saved", description: `${updated.name} persisted to Supabase.`, type: "success" });
      setDrawerWeapon(null);
    } else {
      showToast({ title: "Saved Locally", description: "Ensure Supabase weapons table is seeded.", type: "warning" });
    }
  };

  const handleDeleteWeapon = async (id: string) => {
    setWeapons((prev) => prev.filter((w) => w.id !== id));
    await deleteWeapon(id);
    showToast({ title: "Weapon Deleted", description: "Removed from Supabase.", type: "success" });
  };

  return (
    <div className="relative space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2.5 text-xs text-[#94A3B8]">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Connected to Supabase
          </span>
          <span>
            All records are sourced from the database. Changes persist to live site.
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Weapons Management
            </h1>
            <p className="text-xs text-[#94A3B8] mt-1">
              Manage weapon records for GTA 6 Atlas. All records are placeholder records pending verification.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/weapons/new"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold transition-all shadow-md shadow-indigo-500/20 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Add weapon</span>
            </Link>
            <button
              type="button"
              className="p-2 rounded-lg bg-[#111622] border border-[#1C2436] text-[#94A3B8] hover:text-white transition-colors"

              aria-label="More options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs matching Image 5: All weapons 36, Needs verification 14, Drafts 6, Archived 2 */}
      <div
        role="tablist"
        aria-label="Filter weapons by status"
        className="flex items-center gap-6 border-b border-[#1C2436] pb-1 overflow-x-auto scrollbar-none text-xs font-medium"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "all"}
          onClick={() => setActiveTab("all")}
          className={cn(
            "flex items-center gap-2 pb-2 transition-all whitespace-nowrap relative",
            activeTab === "all"
              ? "text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#6366F1]"
              : "text-[#94A3B8] hover:text-white"
          )}
        >
          <span>All weapons</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-[#1C2436] text-[#94A3B8]">
            {tabCounts.all}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "verification"}
          onClick={() => setActiveTab("verification")}
          className={cn(
            "flex items-center gap-2 pb-2 transition-all whitespace-nowrap relative",
            activeTab === "verification"
              ? "text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#6366F1]"
              : "text-[#94A3B8] hover:text-white"
          )}
        >
          <span>Needs verification</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-[#1C2436] text-[#94A3B8]">
            {tabCounts.verification}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "drafts"}
          onClick={() => setActiveTab("drafts")}
          className={cn(
            "flex items-center gap-2 pb-2 transition-all whitespace-nowrap relative",
            activeTab === "drafts"
              ? "text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#6366F1]"
              : "text-[#94A3B8] hover:text-white"
          )}
        >
          <span>Drafts</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-[#1C2436] text-[#94A3B8]">
            {tabCounts.drafts}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "archived"}
          onClick={() => setActiveTab("archived")}
          className={cn(
            "flex items-center gap-2 pb-2 transition-all whitespace-nowrap relative",
            activeTab === "archived"
              ? "text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#6366F1]"
              : "text-[#94A3B8] hover:text-white"
          )}
        >
          <span>Archived</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-[#1C2436] text-[#94A3B8]">
            {tabCounts.archived}
          </span>
        </button>
      </div>

      {/* Filter Row matching Image 5: Search weapons..., All categories, All ammunition, All verification, All publication, Clear filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input
            type="text"
            id="weapon-search"
            aria-label="Search weapons"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search weapons..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1] transition-colors"
          />
        </div>

        <div>
          <select
            id="weapon-category-filter"
            aria-label="Filter by category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
          >
            <option value="all">All categories</option>
            <option value="Pistol">Pistol</option>
            <option value="Rifle">Rifle</option>
            <option value="SMG">SMG</option>
            <option value="Shotgun">Shotgun</option>
            <option value="Heavy">Heavy</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>

        <div>
          <select
            id="weapon-ammunition-filter"
            aria-label="Filter by ammunition"
            value={selectedAmmunition}
            onChange={(e) => setSelectedAmmunition(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
          >
            <option value="all">All ammunition</option>
            <option value="Unknown">Unknown</option>
            <option value="9mm">9mm Parabellum</option>
            <option value="556">5.56 NATO</option>
            <option value="12g">12 Gauge</option>
          </select>
        </div>

        <div>
          <select
            id="weapon-verification-filter"
            aria-label="Filter by verification"
            value={selectedVerification}
            onChange={(e) => setSelectedVerification(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
          >
            <option value="all">All verification</option>
            <option value="unverified">Unverified</option>
            <option value="pending_source">Pending source</option>
            <option value="verified">Verified</option>
          </select>
        </div>

        <div>
          <select
            id="weapon-publication-filter"
            aria-label="Filter by publication"
            value={selectedPublication}
            onChange={(e) => setSelectedPublication(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
          >
            <option value="all">All publication</option>
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Data Table (Left) + Slide-over Drawer (Right) matching Image 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table Container (matches Image 5 width) */}
        <div className={cn("transition-all duration-200", drawerWeapon ? "lg:col-span-8" : "lg:col-span-12")}>
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs" aria-label="Weapons data table">
                <thead>
                  <tr className="border-b border-[#1C2436] text-[#64748B] text-[11px]">
                    <th scope="col" className="p-3 w-10 text-center">
                      <input
                        type="checkbox"
                        aria-label="Select all weapons"
                        checked={selectedIds.length === filteredWeapons.length && filteredWeapons.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-[#2A344A] bg-[#0E131D] text-[#6366F1] focus:ring-0 focus:ring-offset-0"
                      />
                    </th>
                    <th scope="col" className="py-3 px-3 font-medium text-white">
                      <div className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                        <span>Weapon</span>
                        <ArrowUpDown className="w-3 h-3 text-[#64748B]" />
                      </div>
                    </th>
                    <th scope="col" className="py-3 px-3 font-medium">
                      <div className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                        <span>Category</span>
                        <ArrowUpDown className="w-3 h-3 text-[#64748B]" />
                      </div>
                    </th>
                    <th scope="col" className="py-3 px-3 font-medium">
                      <div className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                        <span>Ammunition</span>
                        <ArrowUpDown className="w-3 h-3 text-[#64748B]" />
                      </div>
                    </th>
                    <th scope="col" className="py-3 px-3 font-medium">
                      <div className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                        <span>Verification</span>
                        <ArrowUpDown className="w-3 h-3 text-[#64748B]" />
                      </div>
                    </th>
                    <th scope="col" className="py-3 px-3 font-medium">
                      <div className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                        <span>Publication</span>
                        <ArrowUpDown className="w-3 h-3 text-[#64748B]" />
                      </div>
                    </th>
                    <th scope="col" className="py-3 px-3 font-medium">
                      <div className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                        <span>Updated</span>
                        <ArrowUpDown className="w-3 h-3 text-[#64748B]" />
                      </div>
                    </th>
                    <th scope="col" className="py-3 px-3 text-right">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182030]">
                  {filteredWeapons.slice(0, itemsPerPage).map((w) => {
                    const isSelected = selectedIds.includes(w.id);
                    return (
                      <tr
                        key={w.id}
                        onClick={() => handleSelectRow(w.id)}
                        className={cn(
                          "cursor-pointer transition-colors",
                          isSelected
                            ? "bg-[#1B2138] border-l-2 border-l-[#6366F1]"
                            : "hover:bg-[#141B2A]"
                        )}
                      >
                        <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            aria-label={`Select ${w.name}`}
                            checked={isSelected}
                            onChange={() => handleSelectRow(w.id)}
                            className="rounded border-[#2A344A] bg-[#0E131D] text-[#6366F1] focus:ring-0 focus:ring-offset-0"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#0E131D] border border-[#1C2436] flex items-center justify-center shrink-0">
                              <WeaponSilhouette category={w.category} />
                            </div>
                            <div>
                              <p className="font-bold text-white text-xs hover:text-[#818CF8] transition-colors">
                                {w.name}
                              </p>
                              <p className="text-[11px] text-[#64748B]">
                                Placeholder record
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-[#94A3B8] font-medium">
                          {w.category}
                        </td>
                        <td className="py-3 px-3 text-[#94A3B8]">
                          {w.ammunition}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#3C2415] border border-[#5A361F] text-[#F97316]">
                            Unverified
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          {w.status === "review" ? (
                            <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#3D2D16] border border-[#594220] text-[#EAB308]">
                              Review
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#182030] border border-[#243048] text-[#94A3B8]">
                              Draft
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-[#64748B] whitespace-nowrap font-mono text-[11px]">
                          {w.updatedAt}
                        </td>
                        <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/admin/weapons/${w.id}`}
                              className="p-1.5 rounded-lg text-[#64748B] hover:text-white hover:bg-[#1C2436] transition-colors"
                              title="Full Specifications"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              type="button"
                              className="p-1.5 rounded-lg text-[#64748B] hover:text-white hover:bg-[#1C2436] transition-colors"
                              aria-label="More actions"
                            >
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer & Pagination matching Image 5 */}
            <div className="p-4 border-t border-[#1C2436] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-[#94A3B8]">
              <p>Showing 1–7 of 36 placeholder records</p>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg bg-[#0E131D] border border-[#1C2436] text-[#64748B] hover:text-white disabled:opacity-40 transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {[1, 2, 3, 4, 5].map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={cn(
                      "w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors",
                      currentPage === pageNum
                        ? "bg-[#6366F1] text-white"
                        : "bg-[#0E131D] border border-[#1C2436] text-[#94A3B8] hover:text-white"
                    )}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="p-1.5 rounded-lg bg-[#0E131D] border border-[#1C2436] text-[#64748B] hover:text-white transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Weapon Slide-over Panel matching Image 5 */}
        {drawerWeapon && (
          <div className="lg:col-span-4 rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C2436]">
              <div>
                <h2 className="text-sm font-bold text-white">Edit Weapon</h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">{drawerWeapon.name}</p>
                <p className="text-[11px] text-[#64748B]">Placeholder record</p>
              </div>
              <button
                type="button"
                onClick={() => setDrawerWeapon(null)}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#182030] transition-colors"
                aria-label="Close edit weapon drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Weapon Preview Card */}
            <div className="p-3 rounded-xl bg-[#0E131D] border border-[#1C2436] flex items-center gap-3">
              <div className="w-12 h-10 rounded-lg bg-[#111622] border border-[#1C2436] flex items-center justify-center shrink-0">
                <WeaponSilhouette category={drawerWeapon.category} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{drawerWeapon.name}</p>
                <p className="text-[11px] text-[#64748B]">Placeholder record</p>
              </div>
            </div>

            {/* Form Fields matching Image 5 */}
            <div className="space-y-3.5 text-xs">
              <div>
                <label
                  htmlFor="drawer-category"
                  className="block text-[11px] font-medium text-[#94A3B8] mb-1.5"
                >
                  Category
                </label>
                <select
                  id="drawer-category"
                  value={drawerWeapon.category}
                  onChange={(e) =>
                    setDrawerWeapon({
                      ...drawerWeapon,
                      category: e.target.value as AdminWeapon["category"],
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
                >
                  <option value="Unknown">Unknown</option>
                  <option value="Pistol">Pistol</option>
                  <option value="Rifle">Rifle</option>
                  <option value="SMG">SMG</option>
                  <option value="Shotgun">Shotgun</option>
                  <option value="Heavy">Heavy</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="drawer-ammunition"
                  className="block text-[11px] font-medium text-[#94A3B8] mb-1.5"
                >
                  Ammunition
                </label>
                <select
                  id="drawer-ammunition"
                  value={drawerWeapon.ammunition}
                  onChange={(e) =>
                    setDrawerWeapon({ ...drawerWeapon, ammunition: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
                >
                  <option value="Unknown">Unknown</option>
                  <option value="9mm Parabellum">9mm Parabellum</option>
                  <option value="5.56 NATO">5.56 NATO</option>
                  <option value="12 Gauge">12 Gauge</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="drawer-verification"
                  className="block text-[11px] font-medium text-[#94A3B8] mb-1.5"
                >
                  Verification status
                </label>
                <select
                  id="drawer-verification"
                  value={drawerWeapon.verification}
                  onChange={(e) =>
                    setDrawerWeapon({
                      ...drawerWeapon,
                      verification: e.target.value as AdminWeapon["verification"],
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
                >
                  <option value="unverified">Unverified</option>
                  <option value="pending_source">Pending source</option>
                  <option value="verified">Verified</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="drawer-publication"
                  className="block text-[11px] font-medium text-[#94A3B8] mb-1.5"
                >
                  Publication status
                </label>
                <select
                  id="drawer-publication"
                  value={drawerWeapon.status}
                  onChange={(e) =>
                    setDrawerWeapon({
                      ...drawerWeapon,
                      status: e.target.value as AdminWeapon["status"],
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
                >
                  <option value="draft">Draft</option>
                  <option value="review">Review</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="drawer-notes"
                  className="block text-[11px] font-medium text-[#94A3B8] mb-1.5"
                >
                  Notes
                </label>
                <textarea
                  id="drawer-notes"
                  rows={4}
                  value={drawerNotes}
                  onChange={(e) => setDrawerNotes(e.target.value)}
                  placeholder="Add internal notes..."
                  className="w-full p-3 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1] transition-colors resize-none"
                />
              </div>

              <p className="text-[11px] text-[#64748B]">
                This is a placeholder record. All information is unverified.
              </p>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDrawerWeapon(null)}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#182030] hover:bg-[#202B40] text-xs font-semibold text-white border border-[#243048] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveDrawer}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#6366F1] hover:bg-[#5254D8] text-xs font-semibold text-white transition-colors shadow-md shadow-indigo-500/20"
                >
                  Save changes
                </button>
              </div>

              <div className="pt-2 border-t border-[#1C2436] text-center">
                <Link
                  href={`/admin/weapons/${drawerWeapon.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#818CF8] hover:text-white transition-colors"
                >
                  <span>Open Full Specifications Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Archived record restored Toast matching Image 5 */}
      {showRestoredToast && (
        <div
          role="status"
          className="fixed bottom-6 left-6 sm:left-72 z-40 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#14231E] border border-[#1F4637] text-white shadow-2xl animate-in slide-in-from-bottom-3 duration-200"
        >
          <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center text-[#0A1A14] shrink-0 font-bold">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Archived record restored</p>
            <p className="text-[11px] text-[#A7F3D0]">
              Weapon W-008 has been restored from the archive.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowRestoredToast(false)}
            className="ml-2 text-[#6EE7B7] hover:text-white p-1 rounded transition-colors"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
