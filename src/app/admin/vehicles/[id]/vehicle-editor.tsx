"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Send,
  Trash2,
  Car,
} from "lucide-react";
import { useToast } from "@/components/admin/toast";
import type { AdminVehicle } from "@/lib/admin-store";
import { deleteVehicle, saveVehicle } from "@/lib/services/vehicles";

const EMPTY_DRAFT: AdminVehicle = {
  id: "",
  code: "",
  name: "",
  displayName: "",
  class: "Unknown",
  manufacturer: "",
  verification: "unverified",
  status: "draft",
  summary: "",
  topSpeed: "",
  acceleration: "",
  handling: "",
  weight: "",
  sources: [],
  images: [],
  lastEditor: "Atlas Staff",
  updatedAt: new Date().toISOString(),
};

const VEHICLE_CLASSES: AdminVehicle["class"][] = [
  "Sports", "SUV", "Sedan", "Motorcycle", "Truck", "Off-Road", "Boat", "Unknown",
];

export function VehicleEditor({
  initialVehicle,
  vehicleId,
}: {
  initialVehicle: AdminVehicle | null;
  vehicleId: string;
}) {
  const router = useRouter();
  const { showToast } = useToast();

  const isNew = vehicleId === "new";
  const [vehicle, setVehicle] = useState<AdminVehicle>(initialVehicle || EMPTY_DRAFT);
  const [imageUrl, setImageUrl] = useState(initialVehicle?.images?.[0] || "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const setField = <K extends keyof AdminVehicle>(key: K, value: AdminVehicle[K]) =>
    setVehicle((v) => ({ ...v, [key]: value }));

  const buildPayload = (status: AdminVehicle["status"]): Partial<AdminVehicle> & { name: string } => ({
    ...vehicle,
    id: vehicle.id || undefined,
    displayName: vehicle.displayName || vehicle.name,
    code: vehicle.code || "",
    status,
    images: imageUrl ? [imageUrl] : [],
    manufacturer: vehicle.manufacturer || "Unknown",
    summary: vehicle.summary || "Cataloged vehicle in the State of Leonida",
  });

  const handleSave = async (status: AdminVehicle["status"]) => {
    if (!vehicle.name.trim()) {
      showToast({ title: "Name required", description: "Add a vehicle name before saving.", type: "danger" });
      return;
    }
    setSaving(true);
    const res = await saveVehicle(buildPayload(status));
    setSaving(false);
    if (res.success) {
      showToast({
        title: status === "published" ? "Vehicle published" : "Vehicle saved",
        description: `${vehicle.name} was saved as ${status}.`,
        type: "success",
      });
      if (!vehicle.id && res.id) router.replace(`/admin/vehicles/${res.id}`);
      else router.refresh();
    } else {
      showToast({ title: "Save failed", description: res.error, type: "danger" });
    }
  };

  const handleDelete = async () => {
    if (!vehicle.id) return;
    setDeleting(true);
    const res = await deleteVehicle(vehicle.id);
    setDeleting(false);
    if (res.success) {
      showToast({ title: "Vehicle deleted", description: `${vehicle.name} was removed.`, type: "success" });
      router.replace("/admin/vehicles");
    } else {
      showToast({ title: "Delete failed", description: res.error, type: "danger" });
    }
  };

  const inputCls =
    "w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1]";
  const labelCls = "block text-[11px] font-medium text-[#94A3B8] mb-1";

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="space-y-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#94A3B8]">
          <Link href="/admin/vehicles" className="hover:text-white transition-colors">Vehicles</Link>
          <span className="text-[#64748B]">&gt;</span>
          <span className="text-white font-medium">{isNew ? "New vehicle" : "Edit vehicle"}</span>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/admin/vehicles"
                className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Vehicles</span>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {isNew ? "New vehicle" : "Edit vehicle"}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#141B2A] border border-[#243048] text-[#94A3B8]">
                {vehicle.status || "draft"}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-[#94A3B8]">
              <span>Saves to Supabase and appears on the public vehicles database.</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {vehicle.id && (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#1B1114] hover:bg-[#241418] border border-[#3B1D24] text-[#F87171] text-xs font-semibold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave("draft")}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#111622] hover:bg-[#161F30] border border-[#1C2436] text-[#94A3B8] hover:text-white text-xs font-semibold transition-colors disabled:opacity-60"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? "Saving…" : "Save draft"}</span>
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave("published")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold transition-all shadow-md shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-60"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish</span>
            </button>
          </div>
        </div>
      </div>

      {confirmDelete && (
        <div className="rounded-xl border border-[#3B1D24] bg-[#1B1114] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-[#F87171]">
            Delete “{vehicle.name}”? This permanently removes it from the database and the public site.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="px-3 py-1.5 rounded-lg bg-[#111622] border border-[#1C2436] text-xs font-semibold text-[#94A3B8] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="px-3 py-1.5 rounded-lg bg-[#7F1D1D] text-xs font-semibold text-white hover:bg-[#991B1B] disabled:opacity-60"
            >
              {deleting ? "Deleting…" : "Delete permanently"}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="veh-name" className={labelCls}>
              Name <span className="text-red-400">*</span>
            </label>
            <input
              id="veh-name"
              type="text"
              value={vehicle.name}
              onChange={(e) => setField("name", e.target.value)}
              className={inputCls}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="veh-summary" className={labelCls}>
              Summary
            </label>
            <textarea
              id="veh-summary"
              rows={3}
              value={vehicle.summary}
              onChange={(e) => setField("summary", e.target.value)}
              className="w-full p-3 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white placeholder-[#64748B] resize-none focus:outline-none focus:border-[#6366F1]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="veh-image" className={labelCls}>
              Image URL
            </label>
            <input
              id="veh-image"
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="/img/car-orange.jpg or https://…"
              className={`${inputCls} font-mono`}
            />
            {imageUrl && (
              <div className="relative h-36 rounded-2xl border border-[#1C2436] overflow-hidden mt-2 bg-[#0B0E14]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Vehicle preview" className="absolute inset-0 w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-5">
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-3.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Car className="w-4 h-4 text-[#818CF8]" />
              Vehicle details
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label htmlFor="veh-class" className={labelCls}>Class</label>
                <select
                  id="veh-class"
                  value={vehicle.class}
                  onChange={(e) => setField("class", e.target.value as AdminVehicle["class"])}
                  className={inputCls}
                >
                  {VEHICLE_CLASSES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="veh-manufacturer" className={labelCls}>Manufacturer</label>
                <input
                  id="veh-manufacturer"
                  type="text"
                  value={vehicle.manufacturer}
                  onChange={(e) => setField("manufacturer", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="veh-status" className={labelCls}>Status</label>
                <select
                  id="veh-status"
                  value={vehicle.status}
                  onChange={(e) => setField("status", e.target.value as AdminVehicle["status"])}
                  className={inputCls}
                >
                  <option value="draft">draft</option>
                  <option value="review">review</option>
                  <option value="published">published</option>
                  <option value="archived">archived</option>
                </select>
              </div>
              <div>
                <label htmlFor="veh-verification" className={labelCls}>Verification</label>
                <select
                  id="veh-verification"
                  value={vehicle.verification}
                  onChange={(e) => setField("verification", e.target.value as AdminVehicle["verification"])}
                  className={inputCls}
                >
                  <option value="verified">verified</option>
                  <option value="pending_source">pending_source</option>
                  <option value="unverified">unverified</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-3.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Performance specs</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label htmlFor="veh-top-speed" className={labelCls}>Top speed</label>
                <input
                  id="veh-top-speed"
                  type="text"
                  value={vehicle.topSpeed || ""}
                  onChange={(e) => setField("topSpeed", e.target.value)}
                  placeholder="160 mph"
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="veh-acceleration" className={labelCls}>Acceleration</label>
                <input
                  id="veh-acceleration"
                  type="text"
                  value={vehicle.acceleration || ""}
                  onChange={(e) => setField("acceleration", e.target.value)}
                  placeholder="3.8s"
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="veh-handling" className={labelCls}>Handling</label>
                <input
                  id="veh-handling"
                  type="text"
                  value={vehicle.handling || ""}
                  onChange={(e) => setField("handling", e.target.value)}
                  placeholder="82/100"
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="veh-weight" className={labelCls}>Weight</label>
                <input
                  id="veh-weight"
                  type="text"
                  value={vehicle.weight || ""}
                  onChange={(e) => setField("weight", e.target.value)}
                  placeholder="1,450 kg"
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
