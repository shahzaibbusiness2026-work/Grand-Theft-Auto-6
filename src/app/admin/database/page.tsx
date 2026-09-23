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
  X
} from "lucide-react";
import { INITIAL_DATABASE_ASSETS, DatabaseAsset } from "@/lib/admin-data";
import { getAdminVehicles } from "@/lib/services/vehicles";
import { getAdminWeapons } from "@/lib/services/weapons";
import { getLocations } from "@/lib/services/locations";
import { cn } from "@/lib/utils";

export default function AdminDatabasePage() {
  const [assets, setAssets] = useState<DatabaseAsset[]>(INITIAL_DATABASE_ASSETS);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "vehicle" | "weapon" | "location">("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "verified" | "unconfirmed" | "deprecated">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    Promise.all([
      getAdminVehicles().catch(() => []),
      getAdminWeapons().catch(() => []),
      getLocations().catch(() => []),
    ]).then(([vehicles, weapons, locations]) => {
      const vAssets: DatabaseAsset[] = vehicles.map(v => ({
        id: v.id,
        name: v.name,
        category: "vehicle",
        status: v.verification === "verified" ? "verified" : "unconfirmed",
        source: v.manufacturer ? `Manufacturer: ${v.manufacturer}` : "Trailer 1 Footages",
        lastVerified: new Date().toISOString().substring(0, 10),
        verifier: v.lastEditor || "Atlas Editor",
        details: v.summary || `${v.name} (${v.class})`
      }));
      const wAssets: DatabaseAsset[] = weapons.map(w => ({
        id: w.id,
        name: w.name,
        category: "weapon",
        status: w.verification === "verified" ? "verified" : "unconfirmed",
        source: w.acquisitionMethod || "Ammu-Nation",
        lastVerified: new Date().toISOString().substring(0, 10),
        verifier: "Atlas Weaponry",
        details: w.notes || `${w.name} (${w.category})`
      }));
      const lAssets: DatabaseAsset[] = locations.map(l => ({
        id: l.id,
        name: l.name,
        category: "location",
        status: l.verification === "verified" ? "verified" : "unconfirmed",
        source: l.district || "State of Leonida",
        lastVerified: new Date().toISOString().substring(0, 10),
        verifier: "Atlas Cartography",
        details: l.description || `${l.name} (${l.type})`
      }));
      const combined = [...vAssets, ...wAssets, ...lAssets];
      if (combined.length > 0) setAssets(combined);
    });
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

  const handleUpdateStatus = (id: string, nextStatus: "verified" | "unconfirmed" | "deprecated") => {
    setAssets(prev => prev.map(a => {
      if (a.id !== id) return a;
      return {
        ...a,
        status: nextStatus,
        lastVerified: new Date().toISOString().substring(0, 10),
        verifier: "Current Editor"
      };
    }));
  };

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const created: DatabaseAsset = {
      id: `ast-${Date.now()}`,
      name: newName,
      category: newCat,
      status: newStatus,
      source: newSource || "Awaiting source citation",
      lastVerified: new Date().toISOString().substring(0, 10),
      verifier: "Current Editor",
      details: newDetails || "No detailed notes provided."
    };

    setAssets([created, ...assets]);
    setIsAddModalOpen(false);
    setNewName("");
    setNewSource("");
    setNewDetails("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
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
        {filteredAssets.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-[#33415C] bg-[#141C2E] p-12 text-center">
            <HelpCircle className="w-10 h-10 text-[#94A3BD] mx-auto mb-3" />
            <h3 className="font-display text-base font-bold text-white">No assets found</h3>
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
                      <h3 className="font-display text-base font-bold text-white">
                        {ast.name}
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3BD] ml-8 block mt-0.5">
                      {ast.category}
                    </span>
                  </div>

                  {/* Verification Badge */}
                  {ast.status === "verified" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  )}
                  {ast.status === "unconfirmed" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/60 border border-amber-800/40 text-amber-400">
                      <HelpCircle className="w-3 h-3" /> Unconfirmed
                    </span>
                  )}
                  {ast.status === "deprecated" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-950/60 border border-red-800/40 text-red-400">
                      <AlertOctagon className="w-3 h-3" /> Deprecated
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-[#1C2740]/50 border border-[#33415C]/40 space-y-1.5">
                  <div className="text-[11px] text-[#94A3BD]">
                    <strong className="text-[#B5C0D4]">Source Corroboration:</strong> {ast.source}
                  </div>
                  <p className="text-xs text-[#F5F7FC] leading-relaxed">
                    {ast.details}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#33415C]/50 flex items-center justify-between gap-3 text-[11px]">
                <span className="text-[#94A3BD]">
                  Verified by <strong className="text-[#B5C0D4]">{ast.verifier}</strong> on {ast.lastVerified}
                </span>

                <div className="flex items-center gap-1.5">
                  {ast.status !== "verified" && (
                    <button
                      onClick={() => handleUpdateStatus(ast.id, "verified")}
                      className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/50 hover:bg-emerald-900/60 text-emerald-300 font-bold text-[10px] transition-colors"
                    >
                      Confirm
                    </button>
                  )}
                  {ast.status !== "unconfirmed" && (
                    <button
                      onClick={() => handleUpdateStatus(ast.id, "unconfirmed")}
                      className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-800/50 hover:bg-amber-900/60 text-amber-300 font-bold text-[10px] transition-colors"
                    >
                      Flag Unconfirmed
                    </button>
                  )}
                  {ast.status !== "deprecated" && (
                    <button
                      onClick={() => handleUpdateStatus(ast.id, "deprecated")}
                      className="px-2.5 py-1 rounded-lg bg-[#1C2740] border border-[#33415C] hover:bg-red-950/40 hover:border-red-800/40 text-[#94A3BD] hover:text-red-300 font-bold text-[10px] transition-colors"
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

      {/* Add Asset Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form 
            onSubmit={handleAddAsset}
            className="w-full max-w-lg rounded-2xl border border-[#33415C] bg-[#141C2E] p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#33415C] pb-3">
              <h3 className="font-display text-base font-bold text-white">
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
