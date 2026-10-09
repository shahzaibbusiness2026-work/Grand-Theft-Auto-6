"use client";

import React, { useEffect, useState } from "react";
import { Sliders, Save, RotateCcw, Trophy } from "lucide-react";
import { useToast } from "@/components/admin/toast";
import {
  getComparisonWeights,
  saveComparisonWeights,
} from "@/lib/services/comparison";
import {
  DEFAULT_VEHICLE_WEIGHTS,
  DEFAULT_WEAPON_WEIGHTS,
  type VehicleScoreWeights,
  type WeaponScoreWeights,
} from "@/lib/scoring";

const VEHICLE_FIELDS: { key: keyof VehicleScoreWeights; label: string }[] = [
  { key: "topSpeed", label: "Top Speed" },
  { key: "acceleration", label: "Acceleration" },
  { key: "handling", label: "Handling" },
  { key: "braking", label: "Braking" },
  { key: "traction", label: "Traction" },
  { key: "features", label: "Special Features" },
];

const WEAPON_FIELDS: { key: keyof WeaponScoreWeights; label: string }[] = [
  { key: "damage", label: "Damage" },
  { key: "fireRate", label: "Fire Rate" },
  { key: "accuracy", label: "Accuracy" },
  { key: "range", label: "Range" },
  { key: "reload", label: "Reload Speed" },
  { key: "magazine", label: "Magazine" },
  { key: "handling", label: "Handling" },
];

const inputCls =
  "w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1]";
const labelCls = "block text-xs font-medium text-[#94A3B8] mb-1";

export default function AdminComparisonPage() {
  const { showToast } = useToast();
  const [vehicle, setVehicle] = useState<VehicleScoreWeights>({ ...DEFAULT_VEHICLE_WEIGHTS });
  const [weapon, setWeapon] = useState<WeaponScoreWeights>({ ...DEFAULT_WEAPON_WEIGHTS });
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getComparisonWeights()
      .then((w) => {
        setVehicle(w.vehicle);
        setWeapon(w.weapon);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const vehicleTotal = VEHICLE_FIELDS.reduce((sum, f) => sum + (Number(vehicle[f.key]) || 0), 0);
  const weaponTotal = WEAPON_FIELDS.reduce((sum, f) => sum + (Number(weapon[f.key]) || 0), 0);

  const handleSave = async () => {
    setSaving(true);
    const res = await saveComparisonWeights(vehicle, weapon);
    setSaving(false);
    if (res.success) {
      showToast({
        title: "Weights saved",
        description: "Comparison scores and rankings now use the new formula.",
        type: "success",
      });
    } else {
      showToast({ title: "Save failed", description: res.error, type: "danger" });
    }
  };

  const resetDefaults = () => {
    setVehicle({ ...DEFAULT_VEHICLE_WEIGHTS });
    setWeapon({ ...DEFAULT_WEAPON_WEIGHTS });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Comparison Settings
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              CMS-driven
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Control the Overall Score formula used by the comparison duels and rankings. Weights are auto-normalized to 100.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={resetDefaults}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#111622] hover:bg-[#161F30] border border-[#1C2436] text-[#94A3B8] hover:text-white text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore defaults</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold transition-all shadow-md shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving…" : "Save weights"}</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-[#1C2436] bg-[#111622] p-8 text-xs text-[#94A3B8]">
          Loading current weights…
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          {/* VEHICLE WEIGHTS */}
          <div className="rounded-2xl border border-[#1C2436] bg-[#0B0E14]/60 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#818CF8]" /> Vehicle Overall Score
              </h2>
              <span
                className={
                  "px-2 py-0.5 rounded text-xs font-bold " +
                  (Math.round(vehicleTotal) === 100
                    ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-400"
                    : "bg-amber-950/60 border border-gold/40 text-gold-light")
                }
              >
                {vehicleTotal} total
              </span>
            </div>
            {VEHICLE_FIELDS.map((f) => (
              <div key={f.key} className="flex items-center gap-3">
                <label className={labelCls + " w-32 shrink-0 mb-0"}>{f.label}</label>
                <input
                  type="range"
                  min={0}
                  max={60}
                  step={1}
                  value={vehicle[f.key]}
                  onChange={(e) => setVehicle((w) => ({ ...w, [f.key]: Number(e.target.value) }))}
                  className="flex-1 accent-[#6366F1]"
                />
                <input
                  type="number"
                  min={0}
                  value={vehicle[f.key]}
                  onChange={(e) => setVehicle((w) => ({ ...w, [f.key]: Number(e.target.value) || 0 }))}
                  className={inputCls + " w-20 text-center"}
                />
                <span className="text-xs text-[#64748B] w-8 text-right">%</span>
              </div>
            ))}
          </div>

          {/* WEAPON WEIGHTS */}
          <div className="rounded-2xl border border-[#1C2436] bg-[#0B0E14]/60 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#F59E0B]" /> Weapon Overall Score
              </h2>
              <span
                className={
                  "px-2 py-0.5 rounded text-xs font-bold " +
                  (Math.round(weaponTotal) === 100
                    ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-400"
                    : "bg-amber-950/60 border border-gold/40 text-gold-light")
                }
              >
                {weaponTotal} total
              </span>
            </div>
            {WEAPON_FIELDS.map((f) => (
              <div key={f.key} className="flex items-center gap-3">
                <label className={labelCls + " w-32 shrink-0 mb-0"}>{f.label}</label>
                <input
                  type="range"
                  min={0}
                  max={60}
                  step={1}
                  value={weapon[f.key]}
                  onChange={(e) => setWeapon((w) => ({ ...w, [f.key]: Number(e.target.value) }))}
                  className="flex-1 accent-[#6366F1]"
                />
                <input
                  type="number"
                  min={0}
                  value={weapon[f.key]}
                  onChange={(e) => setWeapon((w) => ({ ...w, [f.key]: Number(e.target.value) || 0 }))}
                  className={inputCls + " w-20 text-center"}
                />
                <span className="text-xs text-[#64748B] w-8 text-right">%</span>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 rounded-xl border border-[#234375] bg-[#162744]/50 p-4 text-xs text-[#94A3B8]">
            <p className="font-semibold text-white mb-1">How scoring works</p>
            <p>
              Each candidate&apos;s stats are normalized to 0–100, multiplied by these weights and combined into the
              Overall Score shown on the comparison duels and every rankings page. Totals don&apos;t need to equal
              100 — weights are auto-scaled — but keeping them at 100 makes the percentages literal.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
