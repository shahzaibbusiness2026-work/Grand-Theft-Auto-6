"use client";

import React, { useState, useMemo } from "react";
import {
  Car,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Archive,
  MoreHorizontal,
  Edit,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  SlidersHorizontal,
  Eye,
  Trash2,
  Sparkles,
  Link as LinkIcon
} from "lucide-react";
import { DataTable, Column } from "@/components/admin/data-table";
import { Drawer } from "@/components/admin/drawer";
import { Modal } from "@/components/admin/modal";
import { LoadingSkeleton } from "@/components/admin/loading-skeleton";
import { useToast } from "@/components/admin/toast";
import {
  INITIAL_ADMIN_VEHICLES,
  AdminVehicle,
} from "@/lib/admin-store";
import { cn } from "@/lib/utils";

export default function AdminVehiclesPage() {
  const { showToast } = useToast();
  const [vehicles, setVehicles] = useState<AdminVehicle[]>(INITIAL_ADMIN_VEHICLES);
  const [activeTab, setActiveTab] = useState<"all" | "verification" | "drafts" | "archived">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedVerification, setSelectedVerification] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Edit Drawer State
  const [editingVehicle, setEditingVehicle] = useState<AdminVehicle | null>(null);
  const [drawerTab, setDrawerTab] = useState<"specs" | "sources" | "revisions">("specs");

  // New Vehicle Modal State
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newVehicleData, setNewVehicleData] = useState({
    name: "",
    manufacturer: "",
    class: "Sports" as AdminVehicle["class"],
  });

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      // Tab filter
      if (activeTab === "verification" && v.verification === "verified") return false;
      if (activeTab === "drafts" && v.status !== "draft") return false;
      if (activeTab === "archived" && v.status !== "archived") return false;

      // Search query
      if (
        searchQuery &&
        !v.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !v.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !v.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Class filter
      if (selectedClass !== "all" && v.class !== selectedClass) return false;

      // Verification filter
      if (selectedVerification !== "all" && v.verification !== selectedVerification) return false;

      return true;
    });
  }, [vehicles, activeTab, searchQuery, selectedClass, selectedVerification]);

  // Tab counts
  const tabCounts = {
    all: vehicles.length,
    verification: vehicles.filter((v) => v.verification !== "verified").length,
    drafts: vehicles.filter((v) => v.status === "draft").length,
    archived: vehicles.filter((v) => v.status === "archived").length,
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (allSelected: boolean) => {
    setSelectedIds(allSelected ? filteredVehicles.map((v) => v.id) : []);
  };

  const handleBulkStatusChange = (status: AdminVehicle["status"]) => {
    setVehicles((prev) =>
      prev.map((v) => (selectedIds.includes(v.id) ? { ...v, status } : v))
    );
    showToast({
      title: "Status Updated",
      description: `Updated status for ${selectedIds.length} vehicle(s) to ${status}.`,
      type: "success",
    });
    setSelectedIds([]);
  };

  const handleSaveDrawer = () => {
    if (!editingVehicle) return;
    setVehicles((prev) =>
      prev.map((v) => (v.id === editingVehicle.id ? editingVehicle : v))
    );
    showToast({
      title: "Vehicle Saved",
      description: `Changes to ${editingVehicle.displayName} have been preserved.`,
      type: "success",
    });
    setEditingVehicle(null);
  };

  const handleCreateVehicle = () => {
    if (!newVehicleData.name.trim()) return;
    const newRecord: AdminVehicle = {
      id: `veh-${Date.now()}`,
      code: newVehicleData.name.toLowerCase().replace(/\s+/g, "-"),
      name: newVehicleData.name,
      displayName: `${newVehicleData.manufacturer} ${newVehicleData.name}`.trim(),
      class: newVehicleData.class,
      manufacturer: newVehicleData.manufacturer || "Unknown",
      verification: "unverified",
      status: "draft",
      summary: "Newly added vehicle record awaiting trailer analysis.",
      sources: [],
      lastEditor: "Admin",
      updatedAt: "Just now",
    };
    setVehicles([newRecord, ...vehicles]);
    setIsNewModalOpen(false);
    setNewVehicleData({ name: "", manufacturer: "", class: "Sports" });
    showToast({
      title: "Vehicle Created",
      description: `${newRecord.displayName} added to database draft queue.`,
      type: "success",
    });
    setEditingVehicle(newRecord);
  };

  // Table Columns
  const columns: Column<AdminVehicle>[] = [
    {
      key: "name",
      header: "Vehicle & Model",
      sortable: true,
      render: (v) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--admin-elevated)] border border-[var(--admin-border)] flex items-center justify-center text-[var(--admin-primary)] font-bold text-xs shrink-0">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-[var(--admin-text)] hover:text-[var(--admin-primary)] transition-colors">
              {v.displayName}
            </p>
            <p className="text-[11px] text-[var(--admin-text-muted)] font-mono">
              {v.code}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "class",
      header: "Class",
      sortable: true,
      render: (v) => (
        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[var(--admin-elevated)] border border-[var(--admin-border-subtle)] text-[var(--admin-text)]">
          {v.class}
        </span>
      ),
    },
    {
      key: "manufacturer",
      header: "Manufacturer",
      sortable: true,
      render: (v) => (
        <span className="text-xs text-[var(--admin-text)] font-medium">
          {v.manufacturer}
        </span>
      ),
    },
    {
      key: "verification",
      header: "Verification",
      sortable: true,
      render: (v) => (
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase border",
            v.verification === "verified"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              : v.verification === "pending_source"
              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
              : "bg-rose-500/10 text-rose-400 border-rose-500/30"
          )}
        >
          {v.verification === "verified" && <CheckCircle2 className="w-3 h-3" />}
          {v.verification === "pending_source" && <Clock className="w-3 h-3" />}
          {v.verification === "unverified" && <AlertTriangle className="w-3 h-3" />}
          <span>{v.verification.replace("_", " ")}</span>
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (v) => (
        <span
          className={cn(
            "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border",
            v.status === "published" &&
              "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
            v.status === "draft" &&
              "bg-[var(--admin-elevated)] text-[var(--admin-text-muted)] border-[var(--admin-border)]",
            v.status === "review" &&
              "bg-amber-500/10 text-amber-400 border-amber-500/30",
            v.status === "archived" &&
              "bg-rose-500/10 text-rose-400 border-rose-500/30"
          )}
        >
          {v.status}
        </span>
      ),
    },
    {
      key: "updatedAt",
      header: "Last Editor",
      render: (v) => (
        <div className="text-[11px]">
          <p className="text-[var(--admin-text)] font-medium">{v.lastEditor}</p>
          <p className="text-[var(--admin-text-muted)] font-mono">{v.updatedAt}</p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--admin-border-subtle)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--admin-text)] tracking-tight flex items-center gap-2.5">
            <Car className="w-6 h-6 text-[var(--admin-primary)]" />
            <span>Vehicles Management</span>
          </h1>
          <p className="text-xs text-[var(--admin-text-muted)] mt-1">
            Maintain the vehicle database, corroborate trailer sightings, and configure technical specifications.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 700);
            }}
            className="p-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] hover:bg-[var(--admin-elevated)] text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] transition-colors shadow-sm"
            title="Refresh records / test skeleton"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </button>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--admin-primary)] hover:opacity-90 text-white text-xs font-black uppercase tracking-wider transition-colors shadow-md shadow-[var(--admin-primary)]/25"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* Warning Callout Banner (Image 2) */}
      <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3 text-xs text-amber-200">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-amber-300">Placeholder records disclaimer:</span>
          <p className="text-amber-300/80">
            GTA 6 specifications are unverified and subject to change based on official Rockstar Games releases. All performance metrics must cite a timestamped video source.
          </p>
        </div>
      </div>

      {/* Filter Tabs (Image 2) */}
      <div className="flex items-center gap-2 border-b border-[var(--admin-border)] pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("all")}
          className={cn(
            "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
            activeTab === "all"
              ? "bg-[var(--admin-primary)] text-white shadow-sm"
              : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]"
          )}
        >
          <span>All vehicles</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
            {tabCounts.all}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("verification")}
          className={cn(
            "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
            activeTab === "verification"
              ? "bg-[var(--admin-primary)] text-white shadow-sm"
              : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]"
          )}
        >
          <span>Needs verification</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/30 text-amber-300">
            {tabCounts.verification}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("drafts")}
          className={cn(
            "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
            activeTab === "drafts"
              ? "bg-[var(--admin-primary)] text-white shadow-sm"
              : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]"
          )}
        >
          <span>Drafts</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
            {tabCounts.drafts}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("archived")}
          className={cn(
            "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
            activeTab === "archived"
              ? "bg-[var(--admin-primary)] text-white shadow-sm"
              : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]"
          )}
        >
          <span>Archived</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
            {tabCounts.archived}
          </span>
        </button>
      </div>

      {/* Search & Select Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--admin-text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter vehicles by name, code, manufacturer..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)] transition-colors"
          />
        </div>

        <div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)] transition-colors"
          >
            <option value="all">All Vehicle Classes</option>
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

      {/* Main Table or Loading Skeleton */}
      {isLoading ? (
        <LoadingSkeleton rows={6} />
      ) : (
        <DataTable
          data={filteredVehicles}
          columns={columns}
          selectable
          selectedIds={selectedIds}
          onSelectRow={handleSelectRow}
          onSelectAll={handleSelectAll}
          bulkActions={
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkStatusChange("published")}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-colors"
              >
                Publish Selected
              </button>
              <button
                onClick={() => handleBulkStatusChange("archived")}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-colors"
              >
                Archive Selected
              </button>
            </div>
          }
          expandableRowRender={(v) => (
            <div className="space-y-4 py-1">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] hover:border-[var(--admin-primary)]/40 transition-colors shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--admin-text-muted)]">
                      Top Speed
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[var(--admin-primary)]">MPH</span>
                  </div>
                  <p className="text-base font-mono font-black text-[var(--admin-text)] mt-1 tracking-tight">
                    {v.topSpeed || "—"}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] hover:border-[var(--admin-primary)]/40 transition-colors shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--admin-text-muted)]">
                      Acceleration
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-400">0-60</span>
                  </div>
                  <p className="text-base font-mono font-black text-[var(--admin-text)] mt-1 tracking-tight">
                    {v.acceleration || "—"}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] hover:border-[var(--admin-primary)]/40 transition-colors shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--admin-text-muted)]">
                      Handling
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-400">INDEX</span>
                  </div>
                  <p className="text-base font-mono font-black text-[var(--admin-text)] mt-1 tracking-tight">
                    {v.handling || "—"}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] hover:border-[var(--admin-primary)]/40 transition-colors shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--admin-text-muted)]">
                      Curb Weight
                    </span>
                    <span className="text-[10px] font-mono font-bold text-purple-400">MASS</span>
                  </div>
                  <p className="text-base font-mono font-black text-[var(--admin-text)] mt-1 tracking-tight">
                    {v.weight || "—"}
                  </p>
                </div>
              </div>

              {/* Sources Section (Image 18) */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[var(--admin-text)]">
                  Corroborating Evidence ({v.sources.length} sources)
                </span>
                {v.sources.length === 0 ? (
                  <p className="text-xs text-[var(--admin-text-muted)]">
                    No sources attached yet. Click &quot;Edit Full Record&quot; to link trailer timestamps.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {v.sources.map((s) => (
                      <div
                        key={s.id}
                        className="p-2.5 rounded-lg bg-[var(--admin-card)] border border-[var(--admin-border)] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <LinkIcon className="w-3.5 h-3.5 text-[var(--admin-primary)]" />
                          <span className="font-bold text-[var(--admin-text)]">{s.title}</span>
                          <span className="text-[11px] text-[var(--admin-text-muted)]">
                            ({s.type} • {s.date})
                          </span>
                        </div>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                            s.status === "verified"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-amber-500/10 text-amber-400"
                          )}
                        >
                          {s.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setEditingVehicle(v)}
                  className="px-3 py-1.5 rounded-lg bg-[var(--admin-primary)] text-white text-xs font-bold hover:opacity-90 transition-opacity"
                >
                  Edit Full Record
                </button>
                <button
                  onClick={() => {
                    setVehicles((prev) =>
                      prev.map((item) =>
                        item.id === v.id ? { ...item, verification: "verified" } : item
                      )
                    );
                    showToast({
                      title: "Marked Verified",
                      description: `${v.displayName} is now marked as verified.`,
                      type: "success",
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[var(--admin-elevated)] border border-[var(--admin-border)] text-[var(--admin-text)] text-xs font-bold hover:bg-[var(--admin-card)] transition-colors"
                >
                  Verify Sources
                </button>
              </div>
            </div>
          )}
          actions={(v) => (
            <div className="flex items-center justify-end gap-1.5">
              <button
                onClick={() => setEditingVehicle(v)}
                className="p-1.5 rounded-lg text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)] transition-colors"
                title="Edit vehicle"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          )}
        />
      )}

      {/* Edit Vehicle Drawer (Image 3) */}
      <Drawer
        isOpen={!!editingVehicle}
        onClose={() => setEditingVehicle(null)}
        title={editingVehicle ? `Edit Vehicle: ${editingVehicle.displayName}` : "Edit Vehicle"}
        subtitle={
          editingVehicle
            ? `Internal Code: ${editingVehicle.code} • Last edited by ${editingVehicle.lastEditor}`
            : undefined
        }
        size="2xl"
        footer={
          <>
            <button
              onClick={() => setEditingVehicle(null)}
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
        {editingVehicle && (
          <div className="space-y-6">
            {/* Drawer Tabs */}
            <div className="flex items-center gap-2 border-b border-[var(--admin-border)] pb-2">
              <button
                onClick={() => setDrawerTab("specs")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-colors",
                  drawerTab === "specs"
                    ? "bg-[var(--admin-primary)] text-white"
                    : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-elevated)]"
                )}
              >
                Specifications & Identity
              </button>
              <button
                onClick={() => setDrawerTab("sources")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-colors",
                  drawerTab === "sources"
                    ? "bg-[var(--admin-primary)] text-white"
                    : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-elevated)]"
                )}
              >
                Sources & Verification ({editingVehicle.sources.length})
              </button>
              <button
                onClick={() => setDrawerTab("revisions")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-colors",
                  drawerTab === "revisions"
                    ? "bg-[var(--admin-primary)] text-white"
                    : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-elevated)]"
                )}
              >
                Revision History
              </button>
            </div>

            {/* Tab 1: Specs & Identity */}
            {drawerTab === "specs" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[var(--admin-text)] mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={editingVehicle.displayName}
                      onChange={(e) =>
                        setEditingVehicle({ ...editingVehicle, displayName: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--admin-text)] mb-1">
                      Manufacturer
                    </label>
                    <input
                      type="text"
                      value={editingVehicle.manufacturer}
                      onChange={(e) =>
                        setEditingVehicle({ ...editingVehicle, manufacturer: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[var(--admin-text)] mb-1">
                      Class
                    </label>
                    <select
                      value={editingVehicle.class}
                      onChange={(e) =>
                        setEditingVehicle({
                          ...editingVehicle,
                          class: e.target.value as AdminVehicle["class"],
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
                    >
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
                    <label className="block text-xs font-bold text-[var(--admin-text)] mb-1">
                      Publication Status
                    </label>
                    <select
                      value={editingVehicle.status}
                      onChange={(e) =>
                        setEditingVehicle({
                          ...editingVehicle,
                          status: e.target.value as AdminVehicle["status"],
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
                    >
                      <option value="draft">Draft</option>
                      <option value="review">Under Review</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--admin-text)] mb-1">
                    Summary & Field Notes
                  </label>
                  <textarea
                    rows={3}
                    value={editingVehicle.summary}
                    onChange={(e) =>
                      setEditingVehicle({ ...editingVehicle, summary: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
                  />
                </div>

                <div className="pt-2 border-t border-[var(--admin-border)]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)] mb-3">
                    Performance Specs
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--admin-text-muted)] mb-1">
                        Top Speed
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={editingVehicle.topSpeed || ""}
                          onChange={(e) =>
                            setEditingVehicle({ ...editingVehicle, topSpeed: e.target.value })
                          }
                          placeholder="e.g. 155"
                          className="w-full pl-3 pr-10 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)] font-mono font-bold"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-[var(--admin-text-muted)] pointer-events-none">
                          mph
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--admin-text-muted)] mb-1">
                        Acceleration
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={editingVehicle.acceleration || ""}
                          onChange={(e) =>
                            setEditingVehicle({ ...editingVehicle, acceleration: e.target.value })
                          }
                          placeholder="e.g. 3.4"
                          className="w-full pl-3 pr-8 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)] font-mono font-bold"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-[var(--admin-text-muted)] pointer-events-none">
                          sec
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--admin-text-muted)] mb-1">
                        Handling
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={editingVehicle.handling || ""}
                          onChange={(e) =>
                            setEditingVehicle({ ...editingVehicle, handling: e.target.value })
                          }
                          placeholder="e.g. 84"
                          className="w-full pl-3 pr-12 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)] font-mono font-bold"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-[var(--admin-text-muted)] pointer-events-none">
                          / 100
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--admin-text-muted)] mb-1">
                        Weight
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={editingVehicle.weight || ""}
                          onChange={(e) =>
                            setEditingVehicle({ ...editingVehicle, weight: e.target.value })
                          }
                          placeholder="e.g. 1,420"
                          className="w-full pl-3 pr-8 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)] font-mono font-bold"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-[var(--admin-text-muted)] pointer-events-none">
                          kg
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Sources */}
            {drawerTab === "sources" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[var(--admin-text-muted)]">
                    Evidence corroborating the presence and appearance of this vehicle in GTA 6.
                  </p>
                  <button
                    onClick={() => {
                      const newSource = {
                        id: `src-${Date.now()}`,
                        title: "Trailer 1 Timestamp (0:45)",
                        type: "Official Video",
                        date: "Dec 2023",
                        status: "verified" as const,
                      };
                      setEditingVehicle({
                        ...editingVehicle,
                        sources: [...editingVehicle.sources, newSource],
                      });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[var(--admin-elevated)] border border-[var(--admin-border)] text-xs font-bold text-[var(--admin-text)] hover:bg-[var(--admin-card)] transition-colors"
                  >
                    + Add Source
                  </button>
                </div>

                <div className="space-y-2">
                  {editingVehicle.sources.map((s, idx) => (
                    <div
                      key={s.id}
                      className="p-3 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-[var(--admin-text)]">{s.title}</p>
                        <p className="text-[11px] text-[var(--admin-text-muted)]">
                          {s.type} • {s.date}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setEditingVehicle({
                            ...editingVehicle,
                            sources: editingVehicle.sources.filter((_, i) => i !== idx),
                          });
                        }}
                        className="p-1 rounded text-rose-400 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Revisions */}
            {drawerTab === "revisions" && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--admin-text)]">
                      Version 1.2 (Current)
                    </span>
                    <span className="text-[10px] text-[var(--admin-text-muted)] font-mono">
                      Sep 20, 2026, 12:45
                    </span>
                  </div>
                  <p className="text-xs text-[var(--admin-text-muted)]">
                    Updated top speed specification after frame-by-frame speedometer analysis.
                  </p>
                  <p className="text-[11px] text-[var(--admin-primary)] font-medium">
                    By Morgan Kim
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] space-y-1 opacity-70">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--admin-text)]">
                      Version 1.1
                    </span>
                    <span className="text-[10px] text-[var(--admin-text-muted)] font-mono">
                      Sep 18, 2026, 09:20
                    </span>
                  </div>
                  <p className="text-xs text-[var(--admin-text-muted)]">
                    Initial vehicle record creation from leaked database asset sheet.
                  </p>
                  <p className="text-[11px] text-[var(--admin-text-muted)]">
                    By Alex Rivera
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Add New Vehicle Modal */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Add New Vehicle Record"
        description="Create a new vehicle placeholder in the Atlas database."
        footer={
          <>
            <button
              onClick={() => setIsNewModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-elevated)] text-xs font-bold text-[var(--admin-text)]"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateVehicle}
              className="px-5 py-2 rounded-xl bg-[var(--admin-primary)] text-xs font-bold text-white shadow-md shadow-[var(--admin-primary)]/20"
            >
              Create Record
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--admin-text)] mb-1">
              Vehicle Model Name
            </label>
            <input
              type="text"
              value={newVehicleData.name}
              onChange={(e) =>
                setNewVehicleData({ ...newVehicleData, name: e.target.value })
              }
              placeholder="e.g. Banshee GTS"
              className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--admin-text)] mb-1">
              Manufacturer
            </label>
            <input
              type="text"
              value={newVehicleData.manufacturer}
              onChange={(e) =>
                setNewVehicleData({ ...newVehicleData, manufacturer: e.target.value })
              }
              placeholder="e.g. Bravado, Pegassi, Grotti"
              className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--admin-text)] mb-1">
              Class
            </label>
            <select
              value={newVehicleData.class}
              onChange={(e) =>
                setNewVehicleData({
                  ...newVehicleData,
                  class: e.target.value as AdminVehicle["class"],
                })
              }
              className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
            >
              <option value="Sports">Sports</option>
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Motorcycle">Motorcycle</option>
              <option value="Truck">Truck</option>
              <option value="Off-Road">Off-Road</option>
              <option value="Boat">Boat</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
