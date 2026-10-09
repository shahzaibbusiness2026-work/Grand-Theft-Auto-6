"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Send,
  Trash2,
  Crosshair,
} from "lucide-react";
import { useToast } from "@/components/admin/toast";
import type { AdminWeapon } from "@/lib/admin-store";
import { deleteWeapon, saveWeapon } from "@/lib/services/weapons";
import {
  Section,
  FieldRow,
  TextField,
  NumberField,
  ToggleField,
  ListField,
} from "@/components/admin/form-fields";

const WEAPON_FEATURES = [
  "Suppressor", "Scope", "Flashlight", "Extended Magazine", "Grip", "Laser",
  "Muzzle Brake", "Custom Stock", "Armor Penetration", "Lock-On", "Homing",
  "Area Damage", "Explosive Ammo", "Incendiary Ammo", "Hollow Point", "Tracer Rounds",
];

const EMPTY_DRAFT: AdminWeapon = {
  id: "",
  code: "",
  name: "",
  category: "Unknown",
  ammunition: "",
  verification: "unverified",
  status: "draft",
  damage: "",
  range: "",
  rateOfFire: "",
  magazineSize: "",
  acquisitionMethod: "Ammu-Nation",
  notes: "",
  updatedAt: new Date().toISOString(),
};

const WEAPON_CATEGORIES: AdminWeapon["category"][] = [
  "Pistol", "Rifle", "SMG", "Shotgun", "Heavy", "Melee", "Unknown",
];

export function WeaponEditor({
  initialWeapon,
  weaponId,
}: {
  initialWeapon: AdminWeapon | null;
  weaponId: string;
}) {
  const router = useRouter();
  const { showToast } = useToast();

  const isNew = weaponId === "new";
  const [weapon, setWeapon] = useState<AdminWeapon>(initialWeapon || EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const setField = <K extends keyof AdminWeapon>(key: K, value: AdminWeapon[K]) =>
    setWeapon((w) => ({ ...w, [key]: value }));

  const buildPayload = (status: AdminWeapon["status"]): Partial<AdminWeapon> & { name: string } => ({
    ...weapon,
    id: weapon.id || undefined,
    status,
    category: weapon.category || "Unknown",
    ammunition: weapon.ammunition || "Unknown",
  });

  const handleSave = async (status: AdminWeapon["status"]) => {
    if (!weapon.name.trim()) {
      showToast({ title: "Name required", description: "Add a weapon name before saving.", type: "danger" });
      return;
    }
    setSaving(true);
    const res = await saveWeapon(buildPayload(status));
    setSaving(false);
    if (res.success) {
      showToast({
        title: status === "published" ? "Weapon published" : "Weapon saved",
        description: "warning" in res && res.warning ? res.warning : `${weapon.name} was saved as ${status}.`,
        type: "success",
      });
      if (!weapon.id && res.id) router.replace(`/admin/weapons/${res.id}`);
      else router.refresh();
    } else {
      showToast({ title: "Save failed", description: res.error, type: "danger" });
    }
  };

  const handleDelete = async () => {
    if (!weapon.id) return;
    setDeleting(true);
    const res = await deleteWeapon(weapon.id);
    setDeleting(false);
    if (res.success) {
      showToast({ title: "Weapon deleted", description: `${weapon.name} was removed.`, type: "success" });
      router.replace("/admin/weapons");
    } else {
      showToast({ title: "Delete failed", description: res.error, type: "danger" });
    }
  };

  const inputCls =
    "w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1]";
  const labelCls = "block text-xs font-medium text-[#94A3B8] mb-1";

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="space-y-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#94A3B8]">
          <Link href="/admin/weapons" className="hover:text-white transition-colors">Weapons</Link>
          <span className="text-[#64748B]">&gt;</span>
          <span className="text-white font-medium">{isNew ? "New weapon" : "Edit weapon"}</span>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/admin/weapons"
                className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Weapons</span>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {isNew ? "New weapon" : "Edit weapon"}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#141B2A] border border-[#243048] text-[#94A3B8]">
                {weapon.status || "draft"}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-[#94A3B8]">
              <span>Saves to Supabase and appears on the public weapons database.</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {weapon.id && (
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
            Delete “{weapon.name}”? This permanently removes it from the database and the public site.
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
            <label htmlFor="wep-name" className={labelCls}>
              Name <span className="text-red-400">*</span>
            </label>
            <input
              id="wep-name"
              type="text"
              value={weapon.name}
              onChange={(e) => setField("name", e.target.value)}
              className={inputCls}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="wep-notes" className={labelCls}>
              Notes
            </label>
            <textarea
              id="wep-notes"
              rows={6}
              value={weapon.notes || ""}
              onChange={(e) => setField("notes", e.target.value)}
              placeholder="Where it appeared, source notes, handling impressions…"
              className="w-full p-3 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white placeholder-[#64748B] resize-none focus:outline-none focus:border-[#6366F1]"
            />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-5">
          <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-5 space-y-3.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-[#818CF8]" />
              Weapon details
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label htmlFor="wep-category" className={labelCls}>Category</label>
                <select
                  id="wep-category"
                  value={weapon.category}
                  onChange={(e) => setField("category", e.target.value as AdminWeapon["category"])}
                  className={inputCls}
                >
                  {WEAPON_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="wep-ammunition" className={labelCls}>Ammunition</label>
                <input
                  id="wep-ammunition"
                  type="text"
                  value={weapon.ammunition}
                  onChange={(e) => setField("ammunition", e.target.value)}
                  placeholder="9mm Standard"
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="wep-acquisition" className={labelCls}>Acquisition method</label>
                <input
                  id="wep-acquisition"
                  type="text"
                  value={weapon.acquisitionMethod || ""}
                  onChange={(e) => setField("acquisitionMethod", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="wep-status" className={labelCls}>Status</label>
                <select
                  id="wep-status"
                  value={weapon.status}
                  onChange={(e) => setField("status", e.target.value as AdminWeapon["status"])}
                  className={inputCls}
                >
                  <option value="draft">draft</option>
                  <option value="review">review</option>
                  <option value="published">published</option>
                  <option value="archived">archived</option>
                </select>
              </div>
              <div>
                <label htmlFor="wep-verification" className={labelCls}>Verification</label>
                <select
                  id="wep-verification"
                  value={weapon.verification}
                  onChange={(e) => setField("verification", e.target.value as AdminWeapon["verification"])}
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
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Ballistics</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label htmlFor="wep-damage" className={labelCls}>Damage</label>
                <input
                  id="wep-damage"
                  type="text"
                  value={weapon.damage || ""}
                  onChange={(e) => setField("damage", e.target.value)}
                  placeholder="45/100"
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="wep-range" className={labelCls}>Range</label>
                <input
                  id="wep-range"
                  type="text"
                  value={weapon.range || ""}
                  onChange={(e) => setField("range", e.target.value)}
                  placeholder="30m"
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="wep-rof" className={labelCls}>Rate of fire</label>
                <input
                  id="wep-rof"
                  type="text"
                  value={weapon.rateOfFire || ""}
                  onChange={(e) => setField("rateOfFire", e.target.value)}
                  placeholder="400 RPM"
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="wep-mag" className={labelCls}>Magazine size</label>
                <input
                  id="wep-mag"
                  type="text"
                  value={weapon.magazineSize || ""}
                  onChange={(e) => setField("magazineSize", e.target.value)}
                  placeholder="15 rounds"
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DEEP-DIVE SECTIONS (migration 05 fields) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        <Section title="Extended statistics (0–100 ratings)">
          <FieldRow>
            <NumberField label="Reload speed" value={weapon.reload} onChange={(v) => setField("reload", v)} placeholder="80 = fast reload" />
            <NumberField label="Recoil control" value={weapon.recoil} onChange={(v) => setField("recoil", v)} placeholder="60" />
            <NumberField label="Mobility" value={weapon.mobility} onChange={(v) => setField("mobility", v)} placeholder="85" />
            <NumberField label="Projectile speed" value={weapon.projectileSpeed} onChange={(v) => setField("projectileSpeed", v)} placeholder="70" />
            <NumberField label="Headshot multiplier" value={weapon.headshotMultiplier} onChange={(v) => setField("headshotMultiplier", v)} placeholder="2" hint="e.g. 1.5 or 2" />
            <NumberField label="Damage falloff resistance" value={weapon.damageFalloff} onChange={(v) => setField("damageFalloff", v)} placeholder="55" hint="Higher = damage holds at range" />
            <NumberField label="Ammo capacity (reserve)" value={weapon.ammoCapacity} onChange={(v) => setField("ammoCapacity", v)} placeholder="120" />
          </FieldRow>
        </Section>

        <Section title="Characteristics">
          <FieldRow>
            <TextField label="Fire mode" value={weapon.fireMode || ""} onChange={(v) => setField("fireMode", v)} placeholder="Single / Burst / Automatic" />
            <TextField label="Manufacturer" value={weapon.manufacturer || ""} onChange={(v) => setField("manufacturer", v)} placeholder="Hawk & Little" />
            <TextField label="Availability / release status" value={weapon.availability || ""} onChange={(v) => setField("availability", v)} placeholder="Confirmed — launch roster" />
            <NumberField label="Purchase price ($)" value={weapon.price} onChange={(v) => setField("price", v)} placeholder="12500" />
            <TextField label="Price display" value={weapon.priceDisplay || ""} onChange={(v) => setField("priceDisplay", v)} placeholder="$12,500" />
            <NumberField label="Ammunition cost ($)" value={weapon.ammoCost} onChange={(v) => setField("ammoCost", v)} placeholder="120" />
            <NumberField label="Upgrade cost ($)" value={weapon.upgradeCost} onChange={(v) => setField("upgradeCost", v)} placeholder="45000" />
          </FieldRow>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {WEAPON_FEATURES.map((f) => (
              <ToggleField
                key={f}
                label={f}
                checked={(weapon.features || []).includes(f)}
                onChange={(on) =>
                  setField("features", on
                    ? [...(weapon.features || []), f]
                    : (weapon.features || []).filter((x) => x !== f))
                }
              />
            ))}
          </div>
        </Section>

        <Section title="Customization">
          <ListField
            label="Supported modifications"
            items={weapon.customization || []}
            onChange={(v) => setField("customization", v)}
            hint={"One per line: Magazine, Scope, Suppressor, Muzzle, Skin, Camo…"}
          />
        </Section>

        <Section title="Media & meta">
          <FieldRow>
            <TextField label="Image URL" value={weapon.image || ""} onChange={(v) => setField("image", v)} placeholder="/img/hero-dark.jpg or https://…" />
            <TextField label="Rarity" value={weapon.rarity || ""} onChange={(v) => setField("rarity", v)} placeholder="Common / Rare / Epic" />
            <TextField label="Confidence" value={weapon.confidence || ""} onChange={(v) => setField("confidence", v)} placeholder="CONFIRMED" />
            <TextField label="Slug" value={weapon.slug || ""} onChange={(v) => setField("slug", v)} placeholder="m4-carbine" hint="Public URL: /weapons/<slug>" />
          </FieldRow>
          <ToggleField label="Featured weapon" checked={!!weapon.featured} onChange={(v) => setField("featured", v)} />
          <ListField label="Gallery image URLs" items={weapon.gallery || []} onChange={(v) => setField("gallery", v)} hint="One URL per line" />
          <ListField label="Tags" items={weapon.tags || []} onChange={(v) => setField("tags", v)} hint="One per line: Military, Sidearm…" />
        </Section>
      </div>
    </div>
  );
}
