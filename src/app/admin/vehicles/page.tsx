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
  RotateCcw,
  ExternalLink,
  MoreHorizontal,
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

  useEffect(() => {
    setIsLoading(true);
    getAdminVehicles()
      .then((data) => {
        if (data && data.length > 0) setVehicles(data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Expandable row state (matching Image 18)
  const [expandedId, setExpandedId] = useState<string | null>("veh-003");

  // Toast state matching Image 2
  const [showSavedToast, setShowSavedToast] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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
    all: 84,
    verification: 12,
    drafts: 8,
    archived: 3,
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

      {/* Filter Row matching Image 2 & Image 18 */}
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

        {/* Filters (3) & Saved views buttons (Image 18) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs font-semibold text-[#94A3B8] hover:text-white transition-colors"
          >
            <Filter className="w-3.5 h-3.5 text-[#6366F1]" />
            <span>Filters (3)</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#111622] border border-[#1C2436] text-xs font-semibold text-[#94A3B8] hover:text-white transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Saved views</span>
            <ChevronDown className="w-3 h-3 text-[#64748B]" />
          </button>
        </div>
      </div>

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
                <tr className="border-b border-[#1C2436] text-[#64748B] text-[11px]">
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
                {filteredVehicles.slice(0, itemsPerPage).map((v) => {
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
                              <p className="text-[11px] text-[#64748B] font-mono">
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
                          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#EAB308]">
                            <span className="w-2 h-2 rounded-full bg-[#EAB308]" />
                            <span>Pending source</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          {v.status === "review" ? (
                            <span className="px-2.5 py-1 rounded text-[11px] font-semibold bg-[#162744] border border-[#234375] text-[#38BDF8]">
                              Review
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded text-[11px] font-medium bg-[#182030] border border-[#243048] text-[#94A3B8]">
                              Draft
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-[#64748B] whitespace-nowrap font-mono text-[11px]">
                          {v.updatedAt}
                        </td>
                        <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/admin/vehicles/${v.id}`}
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

                      {/* Expandable Row Content matching Image 18 */}
                      {isExpanded && (
                        <tr className="bg-[#0E131D]/80 border-b border-[#1C2436]">
                          <td colSpan={8} className="px-12 py-3.5 text-xs text-[#94A3B8]">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-2">
                              <div>
                                <span className="text-[#64748B] text-[11px] block">Manufacturer</span>
                                <span className="text-white font-medium">{v.manufacturer}</span>
                              </div>
                              <div>
                                <span className="text-[#64748B] text-[11px] block">Sources</span>
                                <span className="text-white font-medium">{v.sources.length}</span>
                              </div>
                              <div>
                                <span className="text-[#64748B] text-[11px] block">Last editor</span>
                                <span className="text-white font-medium">{v.lastEditor}</span>
                              </div>
                            </div>
                            <p className="text-[11px] text-[#64748B] italic">
                              No additional information available.
                            </p>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bulk Selection Bar matching Image 2 & 18 */}
          {selectedIds.length > 0 && (
            <div className="p-3 bg-[#0B0E14] border-t border-[#1C2436] flex items-center justify-between flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-[#6366F1] text-white font-bold text-[11px]">
                  {selectedIds.length} selected
                </span>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#182030] hover:bg-[#202B40] text-white border border-[#243048] font-semibold transition-colors"
                >
                  <Edit className="w-3 h-3 text-[#818CF8]" />
                  <span>Edit status</span>
                  <ChevronDown className="w-3 h-3 text-[#64748B]" />
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#182030] hover:bg-[#202B40] text-white border border-[#243048] font-semibold transition-colors"
                >
                  <Trash2 className="w-3 h-3 text-[#EF4444]" />
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

          {/* Table Footer & Pagination matching Image 2 */}
          <div className="p-4 border-t border-[#1C2436] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-[#94A3B8]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span>Rows per page</span>
                <select
                  defaultValue="8"
                  aria-label="Rows per page"
                  className="px-2 py-1 rounded-lg bg-[#0E131D] border border-[#1C2436] text-white focus:outline-none focus:border-[#6366F1]"
                >
                  <option value="8">8</option>
                  <option value="16">16</option>
                  <option value="24">24</option>
                </select>
              </div>
              <span className="text-[#64748B]">1–8 of 84</span>
            </div>

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

              <button
                type="button"
                className="w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center bg-[#6366F1] text-white"
              >
                1
              </button>
              <button
                type="button"
                className="w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center bg-[#0E131D] border border-[#1C2436] text-[#94A3B8] hover:text-white"
              >
                2
              </button>
              <button
                type="button"
                className="w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center bg-[#0E131D] border border-[#1C2436] text-[#94A3B8] hover:text-white"
              >
                3
              </button>
              <button
                type="button"
                className="w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center bg-[#0E131D] border border-[#1C2436] text-[#94A3B8] hover:text-white"
              >
                4
              </button>
              <button
                type="button"
                className="w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center bg-[#0E131D] border border-[#1C2436] text-[#94A3B8] hover:text-white"
              >
                5
              </button>
              <span className="px-1 text-[#64748B]">...</span>
              <button
                type="button"
                className="w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center bg-[#0E131D] border border-[#1C2436] text-[#94A3B8] hover:text-white"
              >
                11
              </button>

              <button
                type="button"
                className="p-1.5 rounded-lg bg-[#0E131D] border border-[#1C2436] text-[#64748B] hover:text-white transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
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
    </div>
  );
}
