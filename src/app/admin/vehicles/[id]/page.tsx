"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Eye,
  History,
  Send,
  AlertTriangle,
  Info,
  Calendar,
  Trash2,
  Plus,
  ChevronDown,
  X,
  Search,
  Check,
  RotateCcw,
  MoreHorizontal,
} from "lucide-react";
import { useToast } from "@/components/admin/toast";
import { INITIAL_ADMIN_VEHICLES, AdminVehicle } from "@/lib/admin-store";
import { cn } from "@/lib/utils";

// Car silhouette SVG matching Image 3
function VehicleSilhouetteLarge() {
  return (
    <svg
      className="w-16 h-8 text-[#64748B]"
      viewBox="0 0 48 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M7 15h34v2H7v-2zm35-3l-4-6H10L6 12H1v5h4a4 4 0 0 0 8 0h24a4 4 0 0 0 8 0h3v-5h-4zM10 18a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm28 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
    </svg>
  );
}

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  const vehicleId = (params?.id as string) || "veh-001";
  const existingVehicle =
    INITIAL_ADMIN_VEHICLES.find((v) => v.id === vehicleId) || {
      id: vehicleId,
      code: "VEH-001",
      name: vehicleId === "new" ? "New Vehicle" : "Vehicle V-001",
      displayName: vehicleId === "new" ? "New Vehicle" : "Vehicle V-001",
      class: "Unknown" as AdminVehicle["class"],
      manufacturer: "Unknown",
      verification: "unverified" as AdminVehicle["verification"],
      status: "draft" as AdminVehicle["status"],
      summary: "Vehicle record for Grand Theft Auto VI. All information is unverified and subject to change.",
      topSpeed: "Unknown",
      acceleration: "Unknown",
      handling: "Unknown",
      weight: "Unknown",
      sources: [
        {
          id: "src-1",
          title: "Trailer reference",
          type: "Trailer",
          date: "2023-12-05 14:32",
          status: "pending" as const,
        },
      ],
      lastEditor: "Alex Carter",
      updatedAt: "Apr 24, 2025, 14:32",
    };

  const [vehicle, setWeapon] = useState<AdminVehicle>(existingVehicle);
  const [activeSubTab, setActiveSubTab] = useState<
    "basic" | "specs" | "images" | "locations" | "sources" | "seo" | "related"
  >("basic");

  // History slide-over drawer state matching Image 3
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);

  // Accordion states
  const [isLocationsOpen, setIsLocationsOpen] = useState(false);
  const [isSeoOpen, setIsSeoOpen] = useState(false);

  const handleSaveDraft = () => {
    showToast({
      title: "Draft Saved",
      description: `Specifications for ${vehicle.displayName} have been saved.`,
      type: "success",
    });
  };

  const handleSubmitForReview = () => {
    showToast({
      title: "Submitted for Review",
      description: `${vehicle.displayName} submitted to editorial verification queue.`,
      type: "success",
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Back Link & Breadcrumbs matching Image 3 */}
      <div className="space-y-2">
        <Link
          href="/admin/vehicles"
          className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Vehicles</span>
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {vehicle.displayName}
              </h1>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#182030] border border-[#243048] text-[#94A3B8]">
                Draft
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#3C2415] border border-[#5A361F] text-[#F97316]">
                Unverified
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#141B2A] border border-[#243048] text-[#94A3B8]">
                Demo data
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] mt-1">
              Vehicle record for Grand Theft Auto VI. All information is unverified and subject to change.
            </p>
          </div>

          {/* Action Buttons & Unsaved Changes Indicator (Image 3) */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-[#F59E0B] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
              <span>Unsaved changes</span>
            </div>

            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-3.5 py-2 rounded-lg bg-[#111622] hover:bg-[#161F30] border border-[#1C2436] text-[#94A3B8] hover:text-white text-xs font-semibold transition-colors"
            >
              Save draft
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#111622] hover:bg-[#161F30] border border-[#1C2436] text-[#94A3B8] hover:text-white text-xs font-semibold transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#111622] hover:bg-[#161F30] border border-[#1C2436] text-[#94A3B8] hover:text-white text-xs font-semibold transition-colors"
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
            </button>
            <button
              type="button"
              onClick={handleSubmitForReview}
              className="px-4 py-2 rounded-lg bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold transition-all shadow-md shadow-indigo-500/20 active:scale-[0.98]"
            >
              Submit for review
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs matching Image 3: Basic info, Specs, Images, Locations, Sources, SEO, Related */}
      <div
        role="tablist"
        aria-label="Vehicle tabs"
        className="flex items-center gap-6 border-b border-[#1C2436] pb-1 overflow-x-auto scrollbar-none text-xs font-medium"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeSubTab === "basic"}
          onClick={() => setActiveSubTab("basic")}
          className={cn(
            "pb-2 transition-all whitespace-nowrap relative",
            activeSubTab === "basic"
              ? "text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#6366F1]"
              : "text-[#94A3B8] hover:text-white"
          )}
        >
          Basic information
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeSubTab === "specs"}
          onClick={() => setActiveSubTab("specs")}
          className={cn(
            "pb-2 transition-all whitespace-nowrap relative",
            activeSubTab === "specs"
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
          aria-selected={activeSubTab === "locations"}
          onClick={() => setActiveSubTab("locations")}
          className={cn(
            "pb-2 transition-all whitespace-nowrap relative",
            activeSubTab === "locations"
              ? "text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#6366F1]"
              : "text-[#94A3B8] hover:text-white"
          )}
        >
          Locations
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
          aria-selected={activeSubTab === "seo"}
          onClick={() => setActiveSubTab("seo")}
          className={cn(
            "pb-2 transition-all whitespace-nowrap relative",
            activeSubTab === "seo"
              ? "text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#6366F1]"
              : "text-[#94A3B8] hover:text-white"
          )}
        >
          SEO
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeSubTab === "related"}
          onClick={() => setActiveSubTab("related")}
          className={cn(
            "pb-2 transition-all whitespace-nowrap relative",
            activeSubTab === "related"
              ? "text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#6366F1]"
              : "text-[#94A3B8] hover:text-white"
          )}
        >
          Related
        </button>
      </div>

      {/* Main Grid: Form Sections (Left 8 cols) + Publication/Related (Middle/Right) + Revision Drawer (Far Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Cards matching Image 3 */}
        <div className={cn("space-y-6 transition-all", isHistoryOpen ? "lg:col-span-8" : "lg:col-span-9")}>
          {/* Card 1: Basic Information */}
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white">Basic information</h2>
              <p className="text-xs text-[#64748B]">Core details about this vehicle.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="display-name"
                  className="block text-xs font-medium text-[#94A3B8] mb-1.5"
                >
                  Display name <span className="text-red-400">*</span>
                </label>
                <input
                  id="display-name"
                  type="text"
                  defaultValue="Vehicle V-001"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
                />
                <p className="text-[11px] text-[#64748B] mt-1">
                  The name used to display this vehicle on the site.
                </p>
              </div>

              <div>
                <label
                  htmlFor="vehicle-class-input"
                  className="block text-xs font-medium text-[#94A3B8] mb-1.5"
                >
                  Class <span className="text-red-400">*</span>
                </label>
                <select
                  id="vehicle-class-input"
                  defaultValue="Unknown"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
                >
                  <option value="Unknown">Unknown</option>
                  <option value="Sports">Sports</option>
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Truck">Truck</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="vehicle-manufacturer-input"
                className="block text-xs font-medium text-[#94A3B8] mb-1.5"
              >
                Manufacturer
              </label>
              <select
                id="vehicle-manufacturer-input"
                defaultValue="Unknown"
                className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
              >
                <option value="Unknown">Unknown</option>
                <option value="Bravado">Bravado</option>
                <option value="Pegassi">Pegassi</option>
                <option value="Declasse">Declasse</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="vehicle-summary-input"
                className="block text-xs font-medium text-[#94A3B8] mb-1.5"
              >
                Summary
              </label>
              <textarea
                id="vehicle-summary-input"
                rows={3}
                placeholder="Write a short summary about this vehicle..."
                className="w-full p-3.5 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1] transition-colors resize-none"
              />
              <p className="text-[11px] text-[#64748B] mt-1">
                A brief overview. You can add more details in other sections.
              </p>
            </div>
          </div>

          {/* Card 2: Specifications */}
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white">Specifications</h2>
              <p className="text-xs text-[#64748B]">
                Performance and handling details. Leave unknown values blank until supported by a source.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="spec-top-speed"
                  className="block text-xs font-medium text-[#94A3B8] mb-1.5"
                >
                  Top speed
                </label>
                <div className="relative">
                  <input
                    id="spec-top-speed"
                    type="text"
                    defaultValue="Unknown"
                    className="w-full pl-3.5 pr-12 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#64748B]">
                    km/h
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="spec-accel"
                  className="block text-xs font-medium text-[#94A3B8] mb-1.5"
                >
                  Acceleration
                </label>
                <input
                  id="spec-accel"
                  type="text"
                  defaultValue="Unknown"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="spec-handling"
                  className="block text-xs font-medium text-[#94A3B8] mb-1.5"
                >
                  Handling
                </label>
                <input
                  id="spec-handling"
                  type="text"
                  defaultValue="Unknown"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
              <Info className="w-3.5 h-3.5 text-[#6366F1] shrink-0" />
              <span>Unknown values stay blank until supported by a source.</span>
            </div>
          </div>

          {/* Card 3: Images */}
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white">Images</h2>
              <p className="text-xs text-[#64748B]">
                Upload images of the vehicle. Use clear, high-quality images when available.
              </p>
            </div>

            <div className="border-2 border-dashed border-[#1C2436] hover:border-[#6366F1]/50 rounded-2xl p-6 text-center flex flex-col items-center justify-center transition-colors">
              <VehicleSilhouetteLarge />
              <p className="text-xs font-semibold text-white mt-3">
                Drag and drop images here
              </p>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                or <span className="text-[#818CF8] hover:underline cursor-pointer">click to browse</span>
              </p>
              <p className="text-[10px] text-[#64748B] mt-1">
                PNG, JPG, WEBP up to 10MB
              </p>
            </div>

            <div>
              <label
                htmlFor="image-alt-text"
                className="block text-xs font-medium text-[#94A3B8] mb-1.5"
              >
                Image alt text
              </label>
              <input
                id="image-alt-text"
                type="text"
                placeholder="Describe the image for accessibility..."
                className="w-full px-3.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1] transition-colors"
              />
              <p className="text-[11px] text-[#64748B] mt-1">
                A short description of what is shown in the image.
              </p>
            </div>
          </div>

          {/* Card 4: Sources */}
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white">Sources</h2>
              <p className="text-xs text-[#64748B]">
                Add references that support this information.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-4">
                <input
                  type="text"
                  aria-label="Source title"
                  defaultValue="Trailer reference"
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                />
              </div>
              <div className="sm:col-span-3">
                <select
                  aria-label="Source type"
                  defaultValue="Trailer"
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                >
                  <option value="Trailer">Trailer</option>
                  <option value="Official Article">Official Article</option>
                  <option value="Leak">Leak</option>
                </select>
              </div>
              <div className="sm:col-span-3">
                <div className="relative">
                  <input
                    type="text"
                    aria-label="Source timestamp"
                    defaultValue="2023-12-05 14:32"
                    className="w-full pl-3 pr-8 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white font-mono focus:outline-none focus:border-[#6366F1]"
                  />
                  <Calendar className="w-3.5 h-3.5 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="sm:col-span-2 flex items-center justify-between gap-2">
                <span className="px-2 py-1 rounded text-[10px] font-semibold bg-[#3C2415] border border-[#5A361F] text-[#F97316] whitespace-nowrap">
                  Verification pending
                </span>
                <button
                  type="button"
                  className="p-1.5 text-[#64748B] hover:text-red-400 transition-colors"
                  aria-label="Delete source"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#182030] hover:bg-[#202B40] border border-[#243048] text-xs font-semibold text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#818CF8]" />
              <span>Add source</span>
            </button>
          </div>

          {/* Accordion 1: Locations */}
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] overflow-hidden">
            <button
              type="button"
              onClick={() => setIsLocationsOpen(!isLocationsOpen)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-[#141B2A] transition-colors"
            >
              <div>
                <p className="text-xs font-bold text-white">Locations</p>
                <p className="text-[11px] text-[#64748B]">
                  Known or rumored spawn locations for this vehicle.
                </p>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-[#64748B] transition-transform duration-150",
                  !isLocationsOpen && "-rotate-90"
                )}
              />
            </button>
            {isLocationsOpen && (
              <div className="p-4 border-t border-[#1C2436] text-xs text-[#94A3B8]">
                <p>Vice City Marina, Starfish Island luxury docks.</p>
              </div>
            )}
          </div>

          {/* Accordion 2: SEO */}
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] overflow-hidden">
            <button
              type="button"
              onClick={() => setIsSeoOpen(!isSeoOpen)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-[#141B2A] transition-colors"
            >
              <div>
                <p className="text-xs font-bold text-white">SEO</p>
                <p className="text-[11px] text-[#64748B]">
                  Search engine optimization settings.
                </p>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-[#64748B] transition-transform duration-150",
                  !isSeoOpen && "-rotate-90"
                )}
              />
            </button>
            {isSeoOpen && (
              <div className="p-4 border-t border-[#1C2436] text-xs text-[#94A3B8]">
                <p>Meta title: Vehicle V-001 | GTA 6 Atlas</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side Column: Publication & Related Records (4 cols) matching Image 3 */}
        <div className={cn("space-y-6 transition-all", isHistoryOpen ? "lg:col-span-4" : "lg:col-span-3")}>
          {/* Publication Card */}
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Publication
              </h3>
              <p className="text-[11px] text-[#64748B]">
                Control the visibility and review status.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label
                  htmlFor="pub-status"
                  className="block text-[11px] font-medium text-[#94A3B8] mb-1"
                >
                  Status
                </label>
                <select
                  id="pub-status"
                  defaultValue="draft"
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                >
                  <option value="draft">● Draft</option>
                  <option value="review">● Review</option>
                  <option value="published">● Published</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="pub-visibility"
                  className="block text-[11px] font-medium text-[#94A3B8] mb-1"
                >
                  Visibility
                </label>
                <select
                  id="pub-visibility"
                  defaultValue="internal"
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                >
                  <option value="internal">Internal</option>
                  <option value="public">Public</option>
                </select>
                <p className="text-[10px] text-[#64748B] mt-1">
                  Only visible to administrators and editors.
                </p>
              </div>

              <div>
                <label
                  htmlFor="pub-reviewer"
                  className="block text-[11px] font-medium text-[#94A3B8] mb-1"
                >
                  Reviewer
                </label>
                <select
                  id="pub-reviewer"
                  defaultValue="unassigned"
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                >
                  <option value="unassigned">Unassigned</option>
                  <option value="alex">Alex Carter</option>
                  <option value="jamie">Jamie Lee</option>
                </select>
              </div>

              {/* Source verification required Warning Alert (Image 3) */}
              <div className="p-3 rounded-xl bg-[#2A1C14] border border-[#523018] flex items-start gap-2.5 text-xs text-[#F59E0B]">
                <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Source verification required</p>
                  <p className="text-[11px] text-[#D97706] mt-0.5">
                    At least one verified source is required before publishing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Records Card */}
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Related records
              </h3>
              <p className="text-[11px] text-[#64748B]">Link to related content.</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label
                  htmlFor="related-vehicles"
                  className="block text-[11px] font-medium text-[#94A3B8] mb-1"
                >
                  Related vehicles
                </label>
                <select
                  id="related-vehicles"
                  defaultValue=""
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-[#94A3B8] focus:outline-none focus:border-[#6366F1]"
                >
                  <option value="">Search vehicles...</option>
                  <option value="v-002">Vehicle V-002</option>
                  <option value="v-003">Vehicle V-003</option>
                </select>
                <p className="text-[10px] text-[#64748B] mt-1">
                  Link to similar or related vehicles.
                </p>
              </div>

              <div>
                <label
                  htmlFor="related-content"
                  className="block text-[11px] font-medium text-[#94A3B8] mb-1"
                >
                  Related content
                </label>
                <select
                  id="related-content"
                  defaultValue=""
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-[#94A3B8] focus:outline-none focus:border-[#6366F1]"
                >
                  <option value="">Search articles, characters, locations...</option>
                  <option value="art-1">Trailer details to verify</option>
                  <option value="art-2">Vehicle database research notes</option>
                </select>
                <p className="text-[10px] text-[#64748B] mt-1">
                  Link to related articles or records.
                </p>
              </div>
            </div>
          </div>

          {/* Revision History Panel matching Image 3 */}
          {isHistoryOpen && (
            <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-[#1C2436]">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Revision history
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    View and restore previous versions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsHistoryOpen(false)}
                  className="p-1 rounded text-[#94A3B8] hover:text-white"
                  aria-label="Close revision history"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* Version 3 */}
                <div className="p-3 rounded-xl bg-[#141B2A] border border-[#243048] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">Version 3</span>
                    <span className="flex items-center gap-1 text-[10px] text-[#EAB308] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EAB308]" />
                      <span>Current (unsaved changes)</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-[9px]">
                      A
                    </span>
                    <span>Administrator</span>
                    <span className="text-[#64748B]">• Just now</span>
                  </div>
                  <p className="text-[11px] text-[#64748B]">No changes saved yet.</p>
                </div>

                {/* Version 2 */}
                <div className="p-3 rounded-xl bg-[#0E131D] border border-[#1C2436] space-y-2">
                  <span className="font-bold text-white text-xs block">Version 2</span>
                  <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-[9px]">
                      A
                    </span>
                    <span>Administrator</span>
                    <span className="text-[#64748B]">• 2 hours ago</span>
                  </div>
                  <p className="text-[11px] text-[#64748B]">Updated basic information.</p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded bg-[#182030] hover:bg-[#202B40] text-[11px] font-semibold text-white border border-[#243048]"
                    >
                      Compare
                    </button>
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded bg-[#182030] hover:bg-[#202B40] text-[11px] font-semibold text-white border border-[#243048]"
                    >
                      Restore
                    </button>
                    <button
                      type="button"
                      className="p-1 text-[#64748B] hover:text-white"
                      aria-label="Version options"
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Version 1 */}
                <div className="p-3 rounded-xl bg-[#0E131D] border border-[#1C2436] space-y-2">
                  <span className="font-bold text-white text-xs block">Version 1</span>
                  <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-[9px]">
                      A
                    </span>
                    <span>Administrator</span>
                    <span className="text-[#64748B]">• 1 day ago</span>
                  </div>
                  <p className="text-[11px] text-[#64748B]">Initial creation.</p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded bg-[#182030] hover:bg-[#202B40] text-[11px] font-semibold text-white border border-[#243048]"
                    >
                      Compare
                    </button>
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded bg-[#182030] hover:bg-[#202B40] text-[11px] font-semibold text-white border border-[#243048]"
                    >
                      Restore
                    </button>
                    <button
                      type="button"
                      className="p-1 text-[#64748B] hover:text-white"
                      aria-label="Version options"
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
