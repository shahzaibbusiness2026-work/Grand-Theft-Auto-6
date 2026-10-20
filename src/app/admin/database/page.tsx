"use client";

import React, { useState, useEffect } from "react";
import { 
  Database, 
  CheckCircle2, 
  HelpCircle, 
  AlertOctagon, 
  Plus, 
  Search, 
  Filter, 
  Car, 
  Crosshair, 
  MapPin, 
  ShieldCheck,
  Trash2,
  X
} from "lucide-react";
import { DatabaseAsset } from "@/lib/admin-data";
import { getAdminVehicles, saveVehicle, deleteVehicle } from "@/lib/services/vehicles";
import { getAdminWeapons, saveWeapon, deleteWeapon } from "@/lib/services/weapons";
import { getLocations, saveLocation, deleteLocation } from "@/lib/services/locations";
import { useToast } from "@/components/admin/toast";
import { Modal } from "@/components/admin/modal";
import { cn } from "@/lib/utils";

export default function AdminDatabasePage() {
  const { showToast } = useToast();
  const [assets, setAssets] = useState<DatabaseAsset[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "vehicle" | "weapon" | "location">("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "verified" | "unconfirmed" | "deprecated">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DatabaseAsset | null>(null);

  const handleDeleteAsset = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    try {
      const result =
        target.category === "vehicle"
          ? await deleteVehicle(target.id)
          : target.category === "weapon"
            ? await deleteWeapon(target.id)
            : await deleteLocation(target.id);
      if (result.success) {
        setAssets((prev) => prev.filter((a) => a.id !== target.id));
        showToast({ title: "Record deleted", description: `"${target.name}" was permanently removed.`, type: "success" });
      } else {
        showToast({ title: "Delete failed", description: result.error || "Could not delete the record.", type: "danger" });
      }
    } catch (err) {
      showToast({ title: "Delete failed", description: String(err), type: "danger" });
    }
  };

  useEffect(() => {
    Promise.all([
      getAdminVehicles(),
      getAdminWeapons(),
      getLocations(),
    ]).then(([vehicles, weapons, locations]) => {
      const vAssets: DatabaseAsset[] = vehicles.map(v => ({
        id: v.id,
        name: v.name,
        category: "vehicle",
        status: v.verification === "verified" ? "verified" : v.verification === "deprecated" ? "deprecated" : "unconfirmed",
        source: v.manufacturer ? `Manufacturer: ${v.manufacturer}` : "Trailer 1 Footages",
        lastVerified: v.updatedAt ? v.updatedAt.substring(0, 10) : "—",
        verifier: v.lastEditor || "TZG Editor",
        details: v.summary || `${v.name} (${v.class})`
      }));
      const wAssets: DatabaseAsset[] = weapons.map(w => ({
        id: w.id,
        name: w.name,
        category: "weapon",
        status: w.verification === "verified" ? "verified" : w.verification === "deprecated" ? "deprecated" : "unconfirmed",
        source: w.acquisitionMethod || "Ammu-Nation",
        lastVerified: w.updatedAt ? w.updatedAt.substring(0, 10) : "—",
        verifier: "TZG Staff",
        details: w.notes || `${w.name} (${w.category})`
      }));
      const lAssets: DatabaseAsset[] = locations.map(l => ({
        id: l.id,
        name: l.name,
        category: "location",
        status: l.verification === "verified" ? "verified" : l.verification === "deprecated" ? "deprecated" : "unconfirmed",
        source: l.district || "State of Leonida",
        lastVerified: "—",
        verifier: "TZG Staff",
        details: l.description || `${l.name} (${l.type})`
      }));
      const combined = [...vAssets, ...wAssets, ...lAssets];
      if (combined.length > 0) {
        setAssets(combined);
        setLoadError(null);
      } else {
        // No live data and no fallback — surface it instead of silently showing stale mocks
        setLoadError("No assets returned from the database. Check your Supabase connection.");
      }
    })
    .catch((err) => {
      console.error("Database portal load failed:", err);
      setLoadError("Could not load assets from Supabase. Showing cached seed data — changes will not persist until the connection is restored.");
    })
    .finally(() => setIsLoading(false));
  }, []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [newName, setNewName] = useState("");
  const [newCat, setNewCat] = useState<"vehicle" | "weapon" | "location">("vehicle");
  const [newStatus, setNewStatus] = useState<"verified" | "unconfirmed" | "deprecated">("unconfirmed");
  const [newSource, setNewSource] = useState("");
  const [newDetails, setNewDetails] = useState("");

  const filteredAssets = assets.filter((ast) => {
    const matchesCat = selectedCategory === "all" || ast.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || ast.status === selectedStatus;
    const matchesSearch = 
      ast.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ast.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ast.verifier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesStatus && matchesSearch;
  });

  const persistVerification = async (
    asset: DatabaseAsset,
    nextStatus: "verified" | "unconfirmed" | "deprecated"
  ): Promise<{ success: boolean; error?: string }> => {
    // Deprecate is a real persisted state; vehicles/weapons are also
    // unpublished so deprecated items leave the public catalog (and are
    // republished when un-deprecated). Partial saves merge server-side,
    // so no other field of the record is touched.
    const verification =
      nextStatus === "verified" ? "verified" : nextStatus === "deprecated" ? "deprecated" : "unverified";
    const publishStatus =
      nextStatus === "deprecated"
        ? "draft"
        : asset.status === "deprecated"
          ? "published"
          : undefined;
    try {
      if (asset.category === "vehicle") {
        return await saveVehicle({ id: asset.id, name: asset.name, verification, status: publishStatus });
      }
      if (asset.category === "weapon") {
        return await saveWeapon({ id: asset.id, name: asset.name, verification, status: publishStatus });
      }
      return await saveLocation({ id: asset.id, name: asset.name, verification } as Parameters<typeof saveLocation>[0]);
    } catch (err) {
      return { success: false, error: String(err) };
    }
  };

  const handleUpdateStatus = async (id: string, nextStatus: "verified" | "unconfirmed" | "deprecated") => {
    const asset = assets.find((a) => a.id === id);
    if (!asset) return;
    const prev = assets;
    // Optimistic update
    setAssets((prevAssets) =>
      prevAssets.map((a) =>
        a.id !== id
          ? a
          : {
              ...a,
              status: nextStatus,
              lastVerified: new Date().toISOString().substring(0, 10),
              verifier: "Current Editor",
            }
      )
    );
    setUpdatingId(id);
    const result = await persistVerification(asset, nextStatus);
    setUpdatingId(null);
    if (result.success) {
      showToast({
        title: "Status updated",
        description: `"${asset.name}" is now ${nextStatus}.`,
        type: "success",
      });
    } else {
      // Roll back on failure
      setAssets(prev);
      showToast({
        title: "Update failed",
        description: result.error || "Could not save the verification status.",
        type: "danger",
      });
    }
  };

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const verification = newStatus === "verified" ? "verified" : "unverified";
    const id = `ast-${Date.now()}`;

    let result: { success: boolean; error?: string; id?: string };
    try {
      if (newCat === "vehicle") {
        result = await saveVehicle({
          id,
          name: newName.trim(),
          verification,
          summary: newDetails || undefined,
          manufacturer: newSource || undefined,
        });
      } else if (newCat === "weapon") {
        result = await saveWeapon({
          id,
          name: newName.trim(),
          verification,
          notes: newDetails || undefined,
          acquisitionMethod: newSource || undefined,
        });
      } else {
        result = await saveLocation({
          id,
          name: newName.trim(),
          verification,
          description: newDetails || undefined,
          district: newSource || undefined,
        } as Parameters<typeof saveLocation>[0]);
      }
    } catch (err) {
      result = { success: false, error: String(err) };
    }

    if (!result.success) {
      showToast({
        title: "Save failed",
        description: result.error || "Could not save the asset to the database.",
        type: "danger",
      });
      return;
    }

    const created: DatabaseAsset = {
      id: result.id || id,
      name: newName.trim(),
      category: newCat,
      status: newStatus,
      source: newSource || "Awaiting source citation",
      lastVerified: new Date().toISOString().substring(0, 10),
      verifier: "Current Editor",
      details: newDetails || "No detailed notes provided.",
    };

    setAssets([created, ...assets]);
    setIsAddModalOpen(false);
    setNewName("");
    setNewSource("");
    setNewDetails("");
    showToast({
      title: "Asset saved",
      description: `"${created.name}" saved to the database.`,
      type: "success",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl sm:text-3xl font-black text-white tracking-tight">
            Database Verification Portal
          </h1>
          <p className="text-sm text-[#94A3BD] mt-1">
            Authoritative registry for vehicles, weapons, and locations. Verify entries against official trailers and press releases.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#B8AAFF] hover:bg-[#A898F0] text-[#171127] text-xs font-black uppercase tracking-wider transition-colors shadow-lg shadow-[#B8AAFF]/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Asset</span>
        </button>
      </div>

      {/* Load error banner */}
      {loadError && (
        <div role="alert" className="rounded-2xl border border-red-800/50 bg-red-950/40 p-4 flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-300">Database connection issue</p>
            <p className="text-xs text-red-200/80 mt-0.5">{loadError}</p>
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="rounded-2xl border border-[#33415C] bg-[#141C2E] p-4 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(["all", "vehicle", "weapon", "location"] as const).map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 whitespace-nowrap",
                  isActive
                    ? "bg-[#B8AAFF] text-[#171127]"
                    : "bg-[#1C2740] text-[#94A3BD] hover:text-white hover:bg-[#253352]"
                )}
              >
                {cat === "vehicle" && <Car className="w-3.5 h-3.5" />}
                {cat === "weapon" && <Crosshair className="w-3.5 h-3.5" />}
                {cat === "location" && <MapPin className="w-3.5 h-3.5" />}
                <span>{cat === "all" ? "All Categories" : cat + "s"}</span>
              </button>
            );
          })}
        </div>

        {/* Verification Status Filter + Search */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl border border-[#33415C] bg-[#1C2740] text-xs text-white focus:outline-none focus:border-[#B8AAFF]"
          >
            <option value="all">All Verification Statuses</option>
            <option value="verified">Verified (Official)</option>
            <option value="unconfirmed">Rumored / Unconfirmed</option>
            <option value="deprecated">Deprecated / Disproven</option>
          </select>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3BD]" />
            <input
              type="text"
              placeholder="Search assets or sources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#33415C] bg-[#1C2740] text-xs text-white placeholder-[#94A3BD] focus:outline-none focus:border-[#B8AAFF] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Asset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-full rounded-2xl border border-[#33415C] bg-[#141C2E] p-12 text-center">
            <div className="w-8 h-8 border-2 border-[#B8AAFF]/30 border-t-[#B8AAFF] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-[#94A3BD]">Loading assets from Supabase…</p>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-[#33415C] bg-[#141C2E] p-12 text-center">
            <HelpCircle className="w-10 h-10 text-[#94A3BD] mx-auto mb-3" />
            <h3 className="font-sans text-base font-bold text-white">No assets found</h3>
            <p className="text-xs text-[#94A3BD] mt-1">Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
          filteredAssets.map((ast) => (
            <div
              key={ast.id}
              className="rounded-2xl border border-[#33415C] bg-[#141C2E] p-5 space-y-4 hover:border-[#66748F] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-[#1C2740] text-[#B8AAFF]">
                        {ast.category === "vehicle" && <Car className="w-4 h-4" />}
                        {ast.category === "weapon" && <Crosshair className="w-4 h-4" />}
                        {ast.category === "location" && <MapPin className="w-4 h-4" />}
                      </span>
                      <h3 className="font-sans text-base font-bold text-white">
                        {ast.name}
                      </h3>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#94A3BD] ml-8 block mt-0.5">
                      {ast.category}
                    </span>
                  </div>

                  {/* Verification Badge */}
                  {ast.status === "verified" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  )}
                  {ast.status === "unconfirmed" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950/60 border border-amber-800/40 text-gold-light">
                      <HelpCircle className="w-3 h-3" /> Unconfirmed
                    </span>
                  )}
                  {ast.status === "deprecated" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-950/60 border border-red-800/40 text-red-400">
                      <AlertOctagon className="w-3 h-3" /> Deprecated
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-[#1C2740]/50 border border-[#33415C]/40 space-y-1.5">
                  <div className="text-xs text-[#94A3BD]">
                    <strong className="text-[#B5C0D4]">Source Corroboration:</strong> {ast.source}
                  </div>
                  <p className="text-xs text-[#F5F7FC] leading-relaxed">
                    {ast.details}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#33415C]/50 flex items-center justify-between gap-3 text-xs">
                <span className="text-[#94A3BD]">
                  Verified by <strong className="text-[#B5C0D4]">{ast.verifier}</strong> on {ast.lastVerified}
                </span>

                <div className="flex items-center gap-1.5">
                  {ast.status !== "verified" && (
                    <button
                      onClick={() => handleUpdateStatus(ast.id, "verified")}
                      disabled={updatingId === ast.id}
                      className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/50 hover:bg-emerald-900/60 text-emerald-300 font-bold text-xs transition-colors disabled:opacity-50"
                    >
                      {updatingId === ast.id ? "Saving…" : "Confirm"}
                    </button>
                  )}
                  {ast.status !== "unconfirmed" && (
                    <button
                      onClick={() => handleUpdateStatus(ast.id, "unconfirmed")}
                      disabled={updatingId === ast.id}
                      className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-800/50 hover:bg-amber-900/60 text-amber-300 font-bold text-xs transition-colors disabled:opacity-50"
                    >
                      Flag Unconfirmed
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteTarget(ast)}
                    disabled={updatingId === ast.id}
                    title={`Delete ${ast.name} permanently`}
                    className="px-2.5 py-1 rounded-lg bg-red-950/50 border border-red-800/50 hover:bg-red-900/60 text-red-300 font-bold text-xs transition-colors disabled:opacity-50 inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                  {ast.status !== "deprecated" && (
                    <button
                      onClick={() => handleUpdateStatus(ast.id, "deprecated")}
                      disabled={updatingId === ast.id}
                      className="px-2.5 py-1 rounded-lg bg-[#1C2740] border border-[#33415C] hover:bg-red-950/40 hover:border-red-800/40 text-[#94A3BD] hover:text-red-300 font-bold text-xs transition-colors disabled:opacity-50"
                    >
                      Deprecate
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete this record?"
        variant="danger"
        size="sm"
        footer={
          <>
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="px-4 py-2 rounded-xl text-sm text-[#94A3B8] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteAsset}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors"
            >
              Delete permanently
            </button>
          </>
        }
      >
        <p className="text-sm text-[#94A3B8]">
          Permanently delete <span className="font-bold text-white">{deleteTarget?.name}</span> (
          {deleteTarget?.category}) from the database? This cannot be undone.
        </p>
      </Modal>

      {/* Add Asset Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form 
            onSubmit={handleAddAsset}
            className="w-full max-w-lg rounded-2xl border border-[#33415C] bg-[#141C2E] p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#33415C] pb-3">
              <h3 className="font-sans text-base font-bold text-white">
                Add Game Asset for Verification
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-[#94A3BD] hover:text-white hover:bg-[#1C2740] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3BD] mb-1">
                  Asset Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pegassi Infernus Classic"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#33415C] bg-[#1C2740] text-xs text-white focus:outline-none focus:border-[#B8AAFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3BD] mb-1">
                    Category
                  </label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#33415C] bg-[#1C2740] text-xs text-white focus:outline-none focus:border-[#B8AAFF]"
                  >
                    <option value="vehicle">Vehicle</option>
                    <option value="weapon">Weapon</option>
                    <option value="location">Location</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3BD] mb-1">
                    Verification Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#33415C] bg-[#1C2740] text-xs text-white focus:outline-none focus:border-[#B8AAFF]"
                  >
                    <option value="unconfirmed">Rumored / Unconfirmed</option>
                    <option value="verified">Verified (Official)</option>
                    <option value="deprecated">Deprecated</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3BD] mb-1">
                  Source Citation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Trailer 1 (1:12) / Rockstar Newswire Article"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#33415C] bg-[#1C2740] text-xs text-white focus:outline-none focus:border-[#B8AAFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3BD] mb-1">
                  Verification Notes / Details
                </label>
                <textarea
                  rows={3}
                  placeholder="Observation notes, visual cues, timestamps..."
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#33415C] bg-[#1C2740] text-xs text-white focus:outline-none focus:border-[#B8AAFF]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#33415C] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#33415C] bg-[#1C2740] hover:bg-[#253352] text-xs font-bold text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#B8AAFF] hover:bg-[#A898F0] text-[#171127] text-xs font-black uppercase tracking-wider transition-colors"
              >
                Save to Database
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
