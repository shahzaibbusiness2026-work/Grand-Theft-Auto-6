"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Car,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  Edit,
  SlidersHorizontal,
  Trash2,
  Archive,
  RotateCcw,
  Filter,
  Bookmark,
  Check,
} from "lucide-react";
import { useToast } from "@/components/admin/toast";
import {
  INITIAL_ADMIN_VEHICLES,
  AdminVehicle,
} from "@/lib/admin-store";
import { getAdminVehicles, saveVehicle, deleteVehicle } from "@/lib/services/vehicles";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/admin/modal";

// Car silhouette SVG matching Image 2 & Image 18
function VehicleSilhouette() {
  return (
    <svg
      className="w-6 h-3.5 text-[#94A3B8]"
      viewBox="0 0 40 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6 13h28v2H6v-2zm29-3l-3-5H8L5 10H1v4h3a3 3 0 0 0 6 0h20a3 3 0 0 0 6 0h3v-4h-4zm-26 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm22 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
    </svg>
  );
}

export default function AdminVehiclesPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [vehicles, setVehicles] = useState<AdminVehicle[]>(INITIAL_ADMIN_VEHICLES);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "verification" | "drafts" | "archived">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedManufacturer, setSelectedManufacturer] = useState("all");
  const [selectedVerification, setSelectedVerification] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Collapsible filter panel (wired to the "Filters" button)
  const [showFilters, setShowFilters] = useState(true);
  const activeFilterCount =
    (searchQuery ? 1 : 0) +
    (selectedClass !== "all" ? 1 : 0) +
    (selectedManufacturer !== "all" ? 1 : 0) +
    (selectedVerification !== "all" ? 1 : 0) +
    (selectedStatus !== "all" ? 1 : 0);
  const resetVehicleFilters = () => {
    setSearchQuery("");
    setSelectedClass("all");
    setSelectedManufacturer("all");
    setSelectedVerification("all");
    setSelectedStatus("all");
    setCurrentPage(1);
  };

  // Saved filter views (persisted to localStorage)
  interface SavedView {
    name: string;
    searchQuery: string;
    selectedClass: string;
    selectedManufacturer: string;
    selectedVerification: string;
    selectedStatus: string;
  }
  const [showSavedViews, setShowSavedViews] = useState(false);
  const [newViewName, setNewViewName] = useState("");
  const [savedViews, setSavedViews] = useState<SavedView[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("gta6-admin-vehicle-views") || "[]");
    } catch {
      return [];
    }
  });
  const persistViews = (views: SavedView[]) => {
    setSavedViews(views);
    try {
      localStorage.setItem("gta6-admin-vehicle-views", JSON.stringify(views));
    } catch { /* storage unavailable — views just won't persist */ }
  };
  const handleSaveView = () => {
    const name = newViewName.trim();
    if (!name) return;
    persistViews([
      ...savedViews.filter((v) => v.name !== name),
      { name, searchQuery, selectedClass, selectedManufacturer, selectedVerification, selectedStatus },
    ]);
    setNewViewName("");
    showToast({ title: "View saved", description: `"${name}" saved to this browser.`, type: "success" });
  };
  const applySavedView = (view: SavedView) => {
    setSearchQuery(view.searchQuery);
    setSelectedClass(view.selectedClass);
    setSelectedManufacturer(view.selectedManufacturer);
    setSelectedVerification(view.selectedVerification);
    setSelectedStatus(view.selectedStatus);
    setCurrentPage(1);
    setShowSavedViews(false);
  };
  const handleDeleteView = (name: string) => {
    persistViews(savedViews.filter((v) => v.name !== name));
  };

  useEffect(() => {
    setIsLoading(true);
    getAdminVehicles()
      .then((data) => setVehicles(data || []))
      .finally(() => setIsLoading(false));
  }, []);

  // Expandable row state (matching Image 18)
  const [expandedId, setExpandedId] = useState<string | null>("veh-003");

  // Toast state — shown only after a real save action
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      if (activeTab === "verification" && v.verification === "verified") return false;
      if (activeTab === "drafts" && v.status !== "draft") return false;
      if (activeTab === "archived" && v.status !== "archived") return false;

      if (selectedClass !== "all" && v.class !== selectedClass) return false;
      if (selectedManufacturer !== "all" && v.manufacturer !== selectedManufacturer) return false;
      if (selectedVerification !== "all" && v.verification !== selectedVerification) return false;
      if (selectedStatus !== "all" && v.status !== selectedStatus) return false;

      if (
        searchQuery &&
        !v.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !v.code.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !v.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [
    vehicles,
    activeTab,
    selectedClass,
    selectedManufacturer,
    selectedVerification,
    selectedStatus,
    searchQuery,
  ]);

  const tabCounts = {
    all: vehicles.length,
    verification: vehicles.filter((v) => v.verification !== "verified").length,
    drafts: vehicles.filter((v) => v.status === "draft").length,
    archived: vehicles.filter((v) => v.status === "archived").length,
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredVehicles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredVehicles.map((v) => v.id));
    }
  };

  // Bulk edit publication status for selected vehicles
  const [showBulkStatus, setShowBulkStatus] = useState(false);
  const [bulkStatusSaving, setBulkStatusSaving] = useState(false);
  const handleBulkStatusChange = async (status: AdminVehicle["status"]) => {
    setBulkStatusSaving(true);
    const ids = [...selectedIds];
    const failures: string[] = [];
    for (const id of ids) {
      const vehicle = vehicles.find((v) => v.id === id);
      if (!vehicle) continue;
      const res = await saveVehicle({ ...vehicle, status });
      if (!res.success) failures.push(vehicle.displayName || vehicle.name);
    }
    if (failures.length === 0) {
      setVehicles((prev) =>
        prev.map((v) => (ids.includes(v.id) ? { ...v, status } : v))
      );
      setSelectedIds([]);
      setShowBulkStatus(false);
      showToast({ title: "Status updated", description: `${ids.length} vehicle(s) set to ${status}.`, type: "success" });
    } else {
      // Refresh from Supabase so the UI matches what actually persisted
      const data = await getAdminVehicles();
      setVehicles(data || []);
      setSelectedIds([]);
      setShowBulkStatus(false);
      showToast({
        title: "Partial update",
        description: `${failures.length} of ${ids.length} failed: ${failures.slice(0, 3).join(", ")}${failures.length > 3 ? "…" : ""}`,
        type: "danger",
      });
    }
    setBulkStatusSaving(false);
  };

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);


  const handleDeleteVehicle = async (id: string) => {
    const target = vehicles.find((v) => v.id === id);
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    const res = await deleteVehicle(id);
    if (res.success) {
      showToast({ title: "Vehicle Deleted", description: `${target?.name || "Vehicle"} removed from Supabase.`, type: "success" });
    } else {
      showToast({ title: "Delete failed", description: res.error || "Could not delete the vehicle.", type: "danger" });
      const data = await getAdminVehicles();
      setVehicles(data || []);
    }
  };

  const handleArchiveSelected = async () => {
    const ids = [...selectedIds];
    const failures: string[] = [];
    for (const id of ids) {
      const vehicle = vehicles.find((v) => v.id === id);
      if (!vehicle) continue;
      const res = await saveVehicle({ ...vehicle, status: "archived" });
      if (!res.success) failures.push(vehicle.displayName || vehicle.name);
    }
    // Sync UI with what actually persisted
    const data = await getAdminVehicles();
    setVehicles(data || []);
    setSelectedIds([]);
    if (failures.length === 0) {
      showToast({ title: "Archived", description: `${ids.length} vehicle(s) archived.`, type: "success" });
    } else {
      showToast({
        title: "Partial archive",
        description: `${failures.length} of ${ids.length} failed: ${failures.slice(0, 3).join(", ")}${failures.length > 3 ? "…" : ""}`,
        type: "danger",
      });
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };


  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header (Image 2) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Vehicles
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected to Supabase
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Manage vehicle records and source verification
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/vehicles/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold transition-all shadow-md shadow-indigo-500/20 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add vehicle</span>
          </Link>
        </div>
      </div>

      {/* Warning Callout Banner (Image 2: "Placcholder records. GTA 6 specifications are unverified.") */}
      <div
        role="alert"
        className="p-3 rounded-xl border border-[#523018] bg-[#2A1C14] flex items-center gap-2.5 text-xs text-[#F59E0B]"
      >
        <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0" />
        <p className="font-medium">
          Placcholder records. GTA 6 specifications are unverified.
        </p>
      </div>

      {/* Filter Tabs (Image 2: All vehicles 84, Needs verification 12, Drafts 8, Archived 3) */}
      <div
        role="tablist"
        aria-label="Filter vehicles by status"
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
          <span>All vehicles</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-[#1C2436] text-[#94A3B8]">
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
          <span className="px-2 py-0.5 rounded-full text-xs bg-[#1C2436] text-[#94A3B8]">
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
          <span className="px-2 py-0.5 rounded-full text-xs bg-[#1C2436] text-[#94A3B8]">
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
          <span className="px-2 py-0.5 rounded-full text-xs bg-[#1C2436] text-[#94A3B8]">
            {tabCounts.archived}
          </span>
        </button>
      </div>

      {/* Filter Row — collapsible via the Filters button */}
      {showFilters && (
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 flex-1">
          <div className="relative md:col-span-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input
              type="text"
              id="vehicle-search"
              aria-label="Search vehicles"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vehicles..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1] transition-colors"
            />
          </div>

          <div>
            <select
              id="vehicle-class-filter"
              aria-label="Filter by vehicle class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
            >
              <option value="all">All classes</option>
              <option value="Sports">Sports</option>
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Motorcycle">Motorcycle</option>
              <option value="Truck">Truck</option>
              <option value="Off-Road">Off-Road</option>
              <option value="Boat">Boat</option>
            </select>
          </div>

          <div>
            <select
              id="vehicle-manufacturer-filter"
              aria-label="Filter by manufacturer"
              value={selectedManufacturer}
              onChange={(e) => setSelectedManufacturer(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
            >
              <option value="all">All manufacturers</option>
              <option value="Unknown">Unknown</option>
              <option value="Bravado">Bravado</option>
              <option value="Pegassi">Pegassi</option>
              <option value="Declasse">Declasse</option>
            </select>
          </div>

          <div>
            <select
              id="vehicle-verification-filter"
              aria-label="Filter by verification state"
              value={selectedVerification}
              onChange={(e) => setSelectedVerification(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
            >
              <option value="all">All verification states</option>
              <option value="pending_source">Pending source</option>
              <option value="unverified">Unverified</option>
              <option value="verified">Verified</option>
            </select>
          </div>

          <div>
            <select
              id="vehicle-status-filter"
              aria-label="Filter by status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
            >
              <option value="all">All statuses</option>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Filters toggle & Saved views buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            aria-expanded={showFilters}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs font-semibold text-[#94A3B8] hover:text-white transition-colors"
          >
            <Filter className="w-3.5 h-3.5 text-[#6366F1]" />
            <span>Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}</span>
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSavedViews((v) => !v)}
              aria-expanded={showSavedViews}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs font-semibold text-[#94A3B8] hover:text-white transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Saved views</span>
              <ChevronDown className={cn("w-3 h-3 text-[#64748B] transition-transform", showSavedViews && "rotate-180")} />
            </button>
            {showSavedViews && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-[#1C2436] bg-[#111622] shadow-2xl z-30 p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newViewName}
                    onChange={(e) => setNewViewName(e.target.value)}
                    placeholder="Name this view..."
                    className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-[#0E131D] border border-[#1C2436] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1]"
                  />
                  <button
                    type="button"
                    onClick={handleSaveView}
                    disabled={!newViewName.trim()}
                    className="px-2.5 py-1.5 rounded-lg bg-[#6366F1] hover:bg-[#5254D8] disabled:opacity-40 text-white text-xs font-semibold transition-colors"
                  >
                    Save
                  </button>
                </div>
                {savedViews.length === 0 ? (
                  <p className="text-xs text-[#64748B] px-1 py-1">No saved views yet. Set filters above, name the view, and save it.</p>
                ) : (
                  <ul className="space-y-1 max-h-48 overflow-y-auto">
                    {savedViews.map((view) => (
                      <li key={view.name} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-[#182030] group">
                        <button
                          type="button"
                          onClick={() => applySavedView(view)}
                          className="flex-1 min-w-0 text-left text-xs text-white truncate"
                          title={`Apply "${view.name}"`}
                        >
                          {view.name}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteView(view.name)}
                          className="p-1 rounded text-[#64748B] hover:text-[#F87171] opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label={`Delete view ${view.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Main Table / Skeleton Loader matching Image 2, 18, 20 */}
      {isLoading ? (
        /* Image 20: Loading vehicle records skeleton */
        <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-4">
          <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
            <div className="w-4 h-4 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin" />
            <span>Loading vehicle records...</span>
          </div>

          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-10 rounded-lg bg-[#0E131D] animate-pulse flex items-center justify-between px-4"
              >
                <div className="w-10 h-6 bg-[#182030] rounded" />
                <div className="w-36 h-4 bg-[#182030] rounded" />
                <div className="w-20 h-4 bg-[#182030] rounded" />
                <div className="w-24 h-4 bg-[#182030] rounded" />
                <div className="w-20 h-4 bg-[#182030] rounded" />
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#1C2436] flex items-center justify-between text-xs text-[#64748B]">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-[#64748B] border-t-transparent rounded-full animate-spin" />
              <span>Fetching records</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Connected</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-[#1C2436] bg-[#111622] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs" aria-label="Vehicles data table">
              <thead>
                <tr className="border-b border-[#1C2436] text-[#64748B] text-xs">
                  <th scope="col" className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      aria-label="Select all vehicles"
                      checked={selectedIds.length === filteredVehicles.length && filteredVehicles.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-[#2A344A] bg-[#0E131D] text-[#6366F1] focus:ring-0 focus:ring-offset-0"
                    />
                  </th>
                  <th scope="col" className="py-3 px-3 font-medium text-white">
                    <div className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                      <span>Name</span>
                      <ChevronDown className="w-3 h-3 text-[#64748B]" />
                    </div>
                  </th>
                  <th scope="col" className="py-3 px-3 font-medium">
                    Class
                  </th>
                  <th scope="col" className="py-3 px-3 font-medium">
                    Manufacturer
                  </th>
                  <th scope="col" className="py-3 px-3 font-medium">
                    Verification
                  </th>
                  <th scope="col" className="py-3 px-3 font-medium">
                    Publication
                  </th>
                  <th scope="col" className="py-3 px-3 font-medium">
                    <div className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                      <span>Updated</span>
                      <ChevronDown className="w-3 h-3 text-[#64748B]" />
                    </div>
                  </th>
                  <th scope="col" className="py-3 px-3 text-right">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182030]">
                {filteredVehicles.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-14 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#0E131D] border border-[#1C2436] flex items-center justify-center">
                          <Search className="w-5 h-5 text-[#64748B]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">No vehicles match your filters</p>
                          <p className="text-xs text-[#64748B] mt-1">Try adjusting your search or clearing the filters.</p>
                        </div>
                        <button
                          type="button"
                          onClick={resetVehicleFilters}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#182030] hover:bg-[#202B40] border border-[#243048] text-xs font-semibold text-[#94A3B8] hover:text-white transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Clear all filters</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                filteredVehicles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((v) => {
                  const isSelected = selectedIds.includes(v.id);
                  const isExpanded = expandedId === v.id;

                  return (
                    <React.Fragment key={v.id}>
                      <tr
                        onClick={() => handleSelectRow(v.id)}
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
                            aria-label={`Select ${v.displayName}`}
                            checked={isSelected}
                            onChange={() => handleSelectRow(v.id)}
                            className="rounded border-[#2A344A] bg-[#0E131D] text-[#6366F1] focus:ring-0 focus:ring-offset-0"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            {/* Expandable toggle chevron (Image 18) */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpand(v.id);
                              }}
                              className="text-[#64748B] hover:text-white p-0.5 rounded transition-colors"
                              aria-label={isExpanded ? "Collapse row" : "Expand row"}
                            >
                              <ChevronDown
                                className={cn(
                                  "w-3.5 h-3.5 transition-transform duration-150",
                                  !isExpanded && "-rotate-90"
                                )}
                              />
                            </button>

                            <div className="w-9 h-9 rounded-lg bg-[#0E131D] border border-[#1C2436] flex items-center justify-center shrink-0">
                              <VehicleSilhouette />
                            </div>

                            <div>
                              <p className="font-bold text-white text-xs hover:text-[#818CF8] transition-colors">
                                {v.displayName}
                              </p>
                              <p className="text-xs text-[#64748B] font-mono">
                                {v.code}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-[#94A3B8] font-medium">
                          {v.class}
                        </td>
                        <td className="py-3 px-3 text-[#94A3B8]">
                          {v.manufacturer}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          {v.verification === "verified" ? (
                            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                              <span>Verified</span>
                            </div>
                          ) : v.verification === "pending_source" ? (
                            <div className="flex items-center gap-1.5 text-xs font-medium text-[#EAB308]">
                              <span className="w-2 h-2 rounded-full bg-[#EAB308]" />
                              <span>Pending source</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-xs font-medium text-[#F97316]">
                              <span className="w-2 h-2 rounded-full bg-[#F97316]" />
                              <span>Unverified</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          {v.status === "published" ? (
                            <span className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
                              Published
                            </span>
                          ) : v.status === "review" ? (
                            <span className="px-2.5 py-1 rounded text-xs font-semibold bg-[#162744] border border-[#234375] text-[#38BDF8]">
                              Review
                            </span>
                          ) : v.status === "archived" ? (
                            <span className="px-2.5 py-1 rounded text-xs font-medium bg-[#0E131D] border border-[#2A344A] text-[#64748B]">
                              Archived
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded text-xs font-medium bg-[#182030] border border-[#243048] text-[#94A3B8]">
                              Draft
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-[#64748B] whitespace-nowrap font-mono text-xs">
                          {v.updatedAt}
                        </td>
                        <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/admin/vehicles/${v.id}`}
                              className="p-1.5 rounded-lg text-[#64748B] hover:text-white hover:bg-[#1C2436] transition-colors"
                              title="Edit vehicle"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget({ id: v.id, name: v.name })}
                              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#F87171] hover:bg-[#1C2436] transition-colors"
                              aria-label="Delete vehicle"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Row Content matching Image 18 */}
                      {isExpanded && (
                        <tr className="bg-[#0E131D]/80 border-b border-[#1C2436]">
                          <td colSpan={8} className="px-12 py-3.5 text-xs text-[#94A3B8]">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-2">
                              <div>
                                <span className="text-[#64748B] text-xs block">Manufacturer</span>
                                <span className="text-white font-medium">{v.manufacturer}</span>
                              </div>
                              <div>
                                <span className="text-[#64748B] text-xs block">Sources</span>
                                <span className="text-white font-medium">{v.sources.length}</span>
                              </div>
                              <div>
                                <span className="text-[#64748B] text-xs block">Last editor</span>
                                <span className="text-white font-medium">{v.lastEditor}</span>
                              </div>
                            </div>
                            <p className="text-xs text-[#64748B] italic">
                              No additional information available.
                            </p>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                }))}
              </tbody>
            </table>
          </div>

          {/* Bulk Selection Bar matching Image 2 & 18 */}
          {selectedIds.length > 0 && (
            <div className="p-3 bg-[#0B0E14] border-t border-[#1C2436] flex items-center justify-between flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-[#6366F1] text-white font-bold text-xs">
                  {selectedIds.length} selected
                </span>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowBulkStatus((v) => !v)}
                    aria-expanded={showBulkStatus}
                    disabled={bulkStatusSaving}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#182030] hover:bg-[#202B40] text-white border border-[#243048] font-semibold transition-colors disabled:opacity-50"
                  >
                    <Edit className="w-3 h-3 text-[#818CF8]" />
                    <span>{bulkStatusSaving ? "Saving…" : "Edit status"}</span>
                    <ChevronDown className={cn("w-3 h-3 text-[#64748B] transition-transform", showBulkStatus && "rotate-180")} />
                  </button>
                  {showBulkStatus && (
                    <div className="absolute left-0 bottom-full mb-2 w-44 rounded-xl border border-[#1C2436] bg-[#111622] shadow-2xl z-30 p-1.5">
                      {(["draft", "review", "published", "archived"] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleBulkStatusChange(s)}
                          disabled={bulkStatusSaving}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-white hover:bg-[#1C2436] transition-colors capitalize disabled:opacity-50"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleArchiveSelected}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#182030] hover:bg-[#202B40] text-white border border-[#243048] font-semibold transition-colors"
                >
                  <Archive className="w-3 h-3 text-[#EAB308]" />
                  <span>Archive</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="inline-flex items-center gap-1 text-[#64748B] hover:text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>
            </div>
          )}


          {/* Table Footer & Pagination */}
          {(() => {
            const totalPages = Math.max(1, Math.ceil(filteredVehicles.length / itemsPerPage));
            const safePage = Math.min(currentPage, totalPages);
            const startItem = filteredVehicles.length === 0 ? 0 : (safePage - 1) * itemsPerPage + 1;
            const endItem = Math.min(safePage * itemsPerPage, filteredVehicles.length);
            const pageNums: (number | "…")[] = [];
            if (totalPages <= 7) {
              for (let i = 1; i <= totalPages; i++) pageNums.push(i);
            } else {
              pageNums.push(1);
              if (safePage > 3) pageNums.push("…");
              for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pageNums.push(i);
              if (safePage < totalPages - 2) pageNums.push("…");
              pageNums.push(totalPages);
            }
            return (
          <div className="p-4 border-t border-[#1C2436] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-[#94A3B8]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span>Rows per page</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  aria-label="Rows per page"
                  className="px-2 py-1 rounded-lg bg-[#0E131D] border border-[#1C2436] text-white focus:outline-none focus:border-[#6366F1]"
                >
                  <option value="8">8</option>
                  <option value="16">16</option>
                  <option value="24">24</option>
                </select>
              </div>
              <span className="text-[#64748B]">{startItem}–{endItem} of {filteredVehicles.length}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg bg-[#0E131D] border border-[#1C2436] text-[#64748B] hover:text-white disabled:opacity-40 transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {pageNums.map((pn, idx) =>
                pn === "…" ? (
                  <span key={`e${idx}`} className="px-1 text-[#64748B]">…</span>
                ) : (
                  <button
                    key={pn}
                    type="button"
                    onClick={() => setCurrentPage(pn)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors ${
                      safePage === pn
                        ? "bg-[#6366F1] text-white"
                        : "bg-[#0E131D] border border-[#1C2436] text-[#94A3B8] hover:text-white"
                    }`}
                  >
                    {pn}
                  </button>
                )
              )}

              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg bg-[#0E131D] border border-[#1C2436] text-[#64748B] hover:text-white disabled:opacity-40 transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
            );
          })()}
        </div>
      )}

      {/* Changes saved Toast matching Image 2 */}
      {showSavedToast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#14231E] border border-[#1F4637] text-white shadow-2xl animate-in slide-in-from-bottom-3 duration-200"
        >
          <div className="w-4 h-4 rounded-full bg-[#10B981] flex items-center justify-center text-[#0A1A14] shrink-0 font-bold">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <p className="text-xs font-bold text-white">Changes saved</p>
          <button
            type="button"
            onClick={() => setShowSavedToast(false)}
            className="ml-2 text-[#6EE7B7] hover:text-white p-0.5 rounded transition-colors"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      {/* Delete confirmation */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete permanently?"
        description={`This will permanently delete "${deleteTarget?.name}". This action cannot be undone.`}
        variant="danger"
        footer={<>
          <button
            type="button"
            onClick={() => setDeleteTarget(null)}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#0E131D] border border-[#1C2436] text-[#94A3B8] hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => { if (deleteTarget) { handleDeleteVehicle(deleteTarget.id); setDeleteTarget(null); } }}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-500 text-white transition-colors"
          >
            Delete
          </button>
        </>}
      />
    </div>
  );
}
