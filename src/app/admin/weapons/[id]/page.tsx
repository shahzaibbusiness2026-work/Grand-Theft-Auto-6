"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Send,
  Save,
  Eye,
  History,
  Info,
  AlertCircle,
  Circle,
  Scale,
  Clock,
  Link as LinkIcon,
  Upload,
  AlertTriangle,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { useToast } from "@/components/admin/toast";
import { INITIAL_ADMIN_WEAPONS, AdminWeapon } from "@/lib/admin-store";
import { cn } from "@/lib/utils";

export default function WeaponEditPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  const weaponId = (params?.id as string) || "wep-001";
  const existingWeapon =
    INITIAL_ADMIN_WEAPONS.find((w) => w.id === weaponId) || {
      id: weaponId,
      code: "W-001",
      name: weaponId === "new" ? "New Weapon" : "Weapon W-001",
      category: "Unknown" as AdminWeapon["category"],
      ammunition: "Unknown",
      verification: "unverified" as AdminWeapon["verification"],
      status: "draft" as AdminWeapon["status"],
      damage: "Unknown",
      range: "Unknown",
      rateOfFire: "Unknown",
      magazineSize: "Unknown",
      acquisitionMethod: "Unknown",
      notes: "",
      sourceUrl: "",
      updatedAt: "Apr 25, 2025 at 14:32",
    };

  const [weapon, setWeapon] = useState<AdminWeapon>(existingWeapon);
  const [activeSubTab, setActiveSubTab] = useState<
    "specifications" | "images" | "acquisition" | "sources" | "comparisons"
  >("specifications");

  const [sourceUrl, setSourceUrl] = useState(weapon.sourceUrl || "https://example.com");
  const [hasSourceError, setHasSourceError] = useState(true);

  const handleSaveDraft = () => {
    showToast({
      title: "Draft Saved",
      description: `Draft for ${weapon.name} preserved in local memory.`,
      type: "success",
    });
  };

  const handleSubmitForReview = () => {
    setWeapon({ ...weapon, status: "review" });
    showToast({
      title: "Submitted for Review",
      description: `${weapon.name} sent to senior editorial queue.`,
      type: "success",
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Actions Bar matching Image 6 */}
      <div className="space-y-3">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-[#94A3B8]"
        >
          <Link href="/admin" className="hover:text-white transition-colors">
            Game Database
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
          <Link href="/admin/weapons" className="hover:text-white transition-colors">
            Weapons
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
          <span className="text-white font-medium">{weapon.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {weapon.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#3D2D16] border border-[#594220] text-[#EAB308]">
                Draft
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#3C2415] border border-[#5A361F] text-[#F97316]">
                Unverified
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#141B2A] border border-[#243048] text-[#94A3B8] inline-flex items-center gap-1">
                <span>Demo data</span>
                <Info className="w-3 h-3 text-[#64748B]" />
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] mt-1">
              Create and edit weapon details. All information is unverified and subject to change.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handleSubmitForReview}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold transition-all shadow-md shadow-indigo-500/20 active:scale-[0.98]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit for review</span>
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#111622] hover:bg-[#161F30] border border-[#1C2436] text-[#94A3B8] hover:text-white text-xs font-semibold transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save draft</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#111622] hover:bg-[#161F30] border border-[#1C2436] text-[#94A3B8] hover:text-white text-xs font-semibold transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#111622] hover:bg-[#161F30] border border-[#1C2436] text-[#94A3B8] hover:text-white text-xs font-semibold transition-colors"
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs matching Image 6 */}
      <div
        role="tablist"
        aria-label="Weapon edit tabs"
        className="flex items-center gap-6 border-b border-[#1C2436] pb-1 overflow-x-auto scrollbar-none text-xs font-medium"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeSubTab === "specifications"}
          onClick={() => setActiveSubTab("specifications")}
          className={cn(
            "pb-2 transition-all whitespace-nowrap relative",
            activeSubTab === "specifications"
              ? "text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#6366F1]"
              : "text-[#94A3B8] hover:text-white"
          )}
        >
          Specifications
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeSubTab === "images"}
          onClick={() => setActiveSubTab("images")}
          className={cn(
            "pb-2 transition-all whitespace-nowrap relative",
            activeSubTab === "images"
              ? "text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#6366F1]"
              : "text-[#94A3B8] hover:text-white"
          )}
        >
          Images
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeSubTab === "acquisition"}
          onClick={() => setActiveSubTab("acquisition")}
          className={cn(
            "pb-2 transition-all whitespace-nowrap relative",
            activeSubTab === "acquisition"
              ? "text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#6366F1]"
              : "text-[#94A3B8] hover:text-white"
          )}
        >
          Acquisition
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeSubTab === "sources"}
          onClick={() => setActiveSubTab("sources")}
          className={cn(
            "pb-2 transition-all whitespace-nowrap relative",
            activeSubTab === "sources"
              ? "text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#6366F1]"
              : "text-[#94A3B8] hover:text-white"
          )}
        >
          Sources
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeSubTab === "comparisons"}
          onClick={() => setActiveSubTab("comparisons")}
          className={cn(
            "pb-2 transition-all whitespace-nowrap relative",
            activeSubTab === "comparisons"
              ? "text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#6366F1]"
              : "text-[#94A3B8] hover:text-white"
          )}
        >
          Comparisons
        </button>
      </div>

      {/* Main 2-Column Grid matching Image 6 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Cards (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Basic Information */}
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-4">
            <h2 className="text-sm font-bold text-white">Basic Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="weapon-name-input"
                  className="block text-xs font-medium text-[#94A3B8] mb-1.5"
                >
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="weapon-name-input"
                  type="text"
                  value={weapon.name}
                  onChange={(e) => setWeapon({ ...weapon, name: e.target.value })}
                  placeholder="Weapon W-001"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
                />
                <p className="text-[11px] text-[#64748B] mt-1">
                  Use a clear, descriptive name.
                </p>
              </div>

              <div>
                <label
                  htmlFor="weapon-category-select"
                  className="block text-xs font-medium text-[#94A3B8] mb-1.5"
                >
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  id="weapon-category-select"
                  value={weapon.category}
                  onChange={(e) =>
                    setWeapon({
                      ...weapon,
                      category: e.target.value as AdminWeapon["category"],
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
                >
                  <option value="Unknown">Unknown</option>
                  <option value="Pistol">Pistol</option>
                  <option value="Rifle">Rifle</option>
                  <option value="SMG">SMG</option>
                  <option value="Shotgun">Shotgun</option>
                  <option value="Heavy">Heavy</option>
                </select>
                <p className="text-[11px] text-[#64748B] mt-1">
                  Select the most appropriate category.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Specifications */}
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-4">
            <h2 className="text-sm font-bold text-white">Specifications</h2>

            <div className="p-3 rounded-xl bg-[#0E131D] border border-[#1C2436] flex items-center gap-2.5 text-xs text-[#94A3B8]">
              <Info className="w-4 h-4 text-[#6366F1] shrink-0" />
              <span>Unknown is not zero. No statistics published without a source.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="spec-damage"
                  className="block text-xs font-medium text-[#94A3B8] mb-1.5"
                >
                  Damage
                </label>
                <select
                  id="spec-damage"
                  value={weapon.damage || "Unknown"}
                  onChange={(e) => setWeapon({ ...weapon, damage: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
                >
                  <option value="Unknown">Unknown</option>
                  <option value="30">30</option>
                  <option value="45">45</option>
                  <option value="60">60</option>
                  <option value="80">80</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="spec-range"
                  className="block text-xs font-medium text-[#94A3B8] mb-1.5"
                >
                  Range
                </label>
                <select
                  id="spec-range"
                  value={weapon.range || "Unknown"}
                  onChange={(e) => setWeapon({ ...weapon, range: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
                >
                  <option value="Unknown">Unknown</option>
                  <option value="25m">25m</option>
                  <option value="50m">50m</option>
                  <option value="100m">100m</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="spec-rof"
                  className="block text-xs font-medium text-[#94A3B8] mb-1.5"
                >
                  Rate of fire
                </label>
                <select
                  id="spec-rof"
                  value={weapon.rateOfFire || "Unknown"}
                  onChange={(e) => setWeapon({ ...weapon, rateOfFire: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
                >
                  <option value="Unknown">Unknown</option>
                  <option value="400 RPM">400 RPM</option>
                  <option value="600 RPM">600 RPM</option>
                  <option value="800 RPM">800 RPM</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="spec-mag"
                  className="block text-xs font-medium text-[#94A3B8] mb-1.5"
                >
                  Magazine size
                </label>
                <select
                  id="spec-mag"
                  value={weapon.magazineSize || "Unknown"}
                  onChange={(e) => setWeapon({ ...weapon, magazineSize: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
                >
                  <option value="Unknown">Unknown</option>
                  <option value="12">12</option>
                  <option value="15">15</option>
                  <option value="30">30</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="spec-ammo"
                  className="block text-xs font-medium text-[#94A3B8] mb-1.5"
                >
                  Ammunition
                </label>
                <select
                  id="spec-ammo"
                  value={weapon.ammunition || "Unknown"}
                  onChange={(e) => setWeapon({ ...weapon, ammunition: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
                >
                  <option value="Unknown">Unknown</option>
                  <option value="9mm Parabellum">9mm Parabellum</option>
                  <option value="5.56 NATO">5.56 NATO</option>
                  <option value="12 Gauge">12 Gauge</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 3: Acquisition */}
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-4">
            <h2 className="text-sm font-bold text-white">Acquisition</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="acquisition-method"
                  className="block text-xs font-medium text-[#94A3B8] mb-1.5"
                >
                  Method
                </label>
                <select
                  id="acquisition-method"
                  value={weapon.acquisitionMethod || "Unknown"}
                  onChange={(e) => setWeapon({ ...weapon, acquisitionMethod: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
                >
                  <option value="Unknown">Unknown</option>
                  <option value="Ammu-Nation">Ammu-Nation purchase</option>
                  <option value="Mission Reward">Mission reward</option>
                  <option value="Loot Drop">Loot drop / World pickup</option>
                </select>
                <p className="text-[11px] text-[#64748B] mt-1">
                  How the weapon can be obtained in-game.
                </p>
              </div>

              <div>
                <label
                  htmlFor="linked-location"
                  className="block text-xs font-medium text-[#94A3B8] mb-1.5"
                >
                  Linked location
                </label>
                <select
                  id="linked-location"
                  defaultValue=""
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
                >
                  <option value="">Select a location (optional)</option>
                  <option value="loc-1">Vice City Downtown</option>
                  <option value="loc-2">Little Haiti Pawnshop</option>
                  <option value="loc-3">Port Gellhorn Marina</option>
                </select>
                <p className="text-[11px] text-[#64748B] mt-1">
                  Link to a specific location where this weapon is found.
                </p>
              </div>
            </div>
          </div>

          {/* Card 4: Images */}
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-4">
            <h2 className="text-sm font-bold text-white">Images</h2>

            <div className="border-2 border-dashed border-[#1C2436] hover:border-[#6366F1]/50 rounded-2xl p-6 text-center flex flex-col items-center justify-center transition-colors">
              <Upload className="w-6 h-6 text-[#64748B] mb-2" />
              <p className="text-xs font-semibold text-white">
                Drop images here or click to upload
              </p>
              <p className="text-[11px] text-[#64748B] mt-0.5 mb-3">
                PNG, JPG or WebP. Max 10 MB per file.
              </p>
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-lg bg-[#182030] hover:bg-[#202B40] border border-[#243048] text-xs font-semibold text-white transition-colors"
              >
                Select files
              </button>
            </div>
          </div>

          {/* Card 5: Sources matching Image 6 */}
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-3">
            <h2 className="text-sm font-bold text-white">Sources</h2>

            <div>
              <label
                htmlFor="source-url-input"
                className="block text-xs font-medium text-[#94A3B8] mb-1.5"
              >
                Source URL <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="source-url-input"
                  type="text"
                  value={sourceUrl}
                  onChange={(e) => {
                    setSourceUrl(e.target.value);
                    setHasSourceError(e.target.value === "https://example.com");
                  }}
                  className={cn(
                    "w-full px-3.5 py-2 rounded-xl bg-[#0E131D] text-xs text-white focus:outline-none transition-colors",
                    hasSourceError
                      ? "border border-red-500/80 pr-10 focus:border-red-500"
                      : "border border-[#1C2436] focus:border-[#6366F1]"
                  )}
                />
                {hasSourceError && (
                  <AlertCircle className="w-4 h-4 text-red-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                )}
              </div>
              {hasSourceError && (
                <p className="text-[11px] text-red-400 mt-1 font-medium">
                  Enter a valid source URL.
                </p>
              )}
              <p className="text-[11px] text-[#64748B] mt-0.5">
                Link to the original source for this information.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar Cards (4 cols) matching Image 6 */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: Publication */}
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-3.5">
            <div className="flex items-center gap-2 pb-2 border-b border-[#1C2436]">
              <Info className="w-4 h-4 text-[#94A3B8]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Publication
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Status</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#3D2D16] border border-[#594220] text-[#EAB308]">
                  Draft
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Last edited</span>
                <span className="text-[#94A3B8] font-mono text-[11px]">
                  Apr 25, 2025 at 14:32
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Editor</span>
                <span className="text-white font-medium">Alex</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Created</span>
                <span className="text-[#94A3B8] font-mono text-[11px]">
                  Apr 25, 2025 at 14:32
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Validation Checklist matching Image 6 */}
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-3.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-[#1C2436]">
              Validation Checklist
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="font-bold text-[10px]">!</span>
                </div>
                <div>
                  <p className="font-bold text-red-400">Source missing</p>
                  <p className="text-[11px] text-[#64748B]">
                    Add at least one valid source URL.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full border border-[#64748B] flex items-center justify-center shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#94A3B8]">Images optional</p>
                  <p className="text-[11px] text-[#64748B]">
                    Add images to improve this entry (optional).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Related Comparisons matching Image 6 */}
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-3.5">
            <div className="flex items-center gap-2 pb-2 border-b border-[#1C2436]">
              <Scale className="w-4 h-4 text-[#94A3B8]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Related Comparisons
              </h3>
            </div>

            <div className="text-center py-3 space-y-2">
              <p className="text-xs font-semibold text-white">No comparisons linked</p>
              <p className="text-[11px] text-[#64748B]">
                Link this weapon to a comparison to help users evaluate it against others.
              </p>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#182030] hover:bg-[#202B40] border border-[#243048] text-xs font-semibold text-white transition-colors"
              >
                <LinkIcon className="w-3.5 h-3.5 text-[#818CF8]" />
                <span>Link comparison</span>
              </button>
            </div>
          </div>

          {/* Card 4: Revision History matching Image 6 */}
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-3.5">
            <div className="flex items-center gap-2 pb-2 border-b border-[#1C2436]">
              <Clock className="w-4 h-4 text-[#94A3B8]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Revision History
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#818CF8] shrink-0 mt-1.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[#94A3B8] font-mono text-[11px]">
                      Apr 25, 2025 at 14:32
                    </span>
                    <span className="text-[#64748B] text-[11px]">Alex</span>
                  </div>
                  <p className="text-white font-medium text-[11px]">Created weapon draft</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#818CF8] shrink-0 mt-1.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[#94A3B8] font-mono text-[11px]">
                      Apr 25, 2025 at 14:32
                    </span>
                    <span className="text-[#64748B] text-[11px]">Alex</span>
                  </div>
                  <p className="text-white font-medium text-[11px]">Updated basic information</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
