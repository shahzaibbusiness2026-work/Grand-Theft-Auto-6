"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Crosshair,
  Shield,
  Zap,
  Weight,
  Sparkles,
  Save,
  Share2,
  Trash2,
  Plus,
  CheckCircle2,
  Copy,
  Layers,
  ArrowRightLeft,
  Flame,
  Gauge,
  Sliders,
} from "lucide-react";
import { canonicalWeapons, type CanonicalWeapon } from "@/lib/canonical-data";
import {
  getStoredUserState,
  saveStoredUserState,
  type SavedLoadout,
  type UserState,
} from "@/lib/user-store";
import { cn } from "@/lib/utils";

const TACTICAL_GEAR_OPTIONS = [
  "Heavy Ceramic Body Armor",
  "Thermite Breach Gel",
  "EMP Frequency Scrambler",
  "Rebreather Scuba Apparatus",
  "Thermal / NVG Optics",
  "High-Explosive C4 Satchel",
  "Tear Gas Canisters",
  "Tactical First Aid Trauma Kit",
  "Lockpick & Biometric Bypass Kit",
];

const PRESET_LOADOUTS = [
  {
    name: "Keys Vault Stealth Infiltration",
    role: "Heist Specialist",
    primary: "m4-carbine",
    secondary: "glock-21",
    melee: "hunting-combat-knife",
    heavy: "tactical-smg-vom-feuer",
    equipment: ["Rebreather Scuba Apparatus", "Thermite Breach Gel", "EMP Frequency Scrambler"],
    notes: "Quiet waterborne insertion with maximum concealment and electronic bypass.",
  },
  {
    name: "South Beach Street Warfare",
    role: "Enforcer / Assault",
    primary: "ak-74-kalashnikov",
    secondary: "glock-21",
    melee: "hunting-combat-knife",
    heavy: "remington-pump-shotgun",
    equipment: ["Heavy Ceramic Body Armor", "High-Explosive C4 Satchel", "Tactical First Aid Trauma Kit"],
    notes: "Heavy kinetic stopping power and maximum survivability during 5-star police response.",
  },
  {
    name: "Everglades Swampland Hunter",
    role: "Recon Marksman",
    primary: "remington-pump-shotgun",
    secondary: "glock-21",
    melee: "hunting-combat-knife",
    heavy: "m4-carbine",
    equipment: ["Thermal / NVG Optics", "Tactical First Aid Trauma Kit", "Lockpick & Biometric Bypass Kit"],
    notes: "Engineered for long-range target acquisition across murky wetlands and night ops.",
  },
];

export function LoadoutClient() {
  const [userState, setUserState] = useState<UserState | null>(null);

  // Active builder slots
  const [loadoutName, setLoadoutName] = useState<string>("Custom Leonida Loadout");
  const [role, setRole] = useState<string>("Tactical Operative");
  const [primaryId, setPrimaryId] = useState<string>("m4-carbine");
  const [secondaryId, setSecondaryId] = useState<string>("glock-21");
  const [meleeId, setMeleeId] = useState<string>("hunting-combat-knife");
  const [heavyId, setHeavyId] = useState<string>("remington-pump-shotgun");
  const [selectedGear, setSelectedGear] = useState<string[]>([
    "Heavy Ceramic Body Armor",
    "Thermite Breach Gel",
  ]);
  const [notes, setNotes] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Load user store
  useEffect(() => {
    const s = getStoredUserState();
    setUserState(s);

    const handleSync = () => setUserState(getStoredUserState());
    window.addEventListener("gta6_user_state_change", handleSync);
    return () => window.removeEventListener("gta6_user_state_change", handleSync);
  }, []);

  // Weapon Pools
  const primaryPool = useMemo(
    () => canonicalWeapons.filter((w) => ["Assault Rifle", "SMG", "Shotgun", "Sniper Rifle"].includes(w.klass)),
    []
  );

  const secondaryPool = useMemo(
    () => canonicalWeapons.filter((w) => w.klass === "Pistol"),
    []
  );

  const meleePool = useMemo(
    () => canonicalWeapons.filter((w) => w.klass === "Melee"),
    []
  );

  const heavyPool = useMemo(
    () => canonicalWeapons.filter((w) => ["Heavy", "Shotgun", "SMG", "Assault Rifle"].includes(w.klass)),
    []
  );

  // Selected Weapon Objects
  const primaryWeapon = canonicalWeapons.find((w) => w.id === primaryId) || primaryPool[0];
  const secondaryWeapon = canonicalWeapons.find((w) => w.id === secondaryId) || secondaryPool[0];
  const meleeWeapon = canonicalWeapons.find((w) => w.id === meleeId) || meleePool[0];
  const heavyWeapon = canonicalWeapons.find((w) => w.id === heavyId) || heavyPool[0];

  // Calculated Ratings
  const ratings = useMemo(() => {
    const pDmg = primaryWeapon?.damage || 50;
    const sDmg = secondaryWeapon?.damage || 40;
    const hDmg = heavyWeapon?.damage || 60;
    const firepower = Math.round((pDmg * 0.45 + sDmg * 0.2 + hDmg * 0.35));

    const pAcc = primaryWeapon?.accuracy || 50;
    const pRng = primaryWeapon?.range || 50;
    const precision = Math.round((pAcc * 0.6 + pRng * 0.4));

    // Mobility penalty increases with heavier gear
    const gearCount = selectedGear.length;
    const mobilityBase = Math.round((primaryWeapon?.handling || 60) * 0.6 + (secondaryWeapon?.handling || 70) * 0.4);
    const mobility = Math.max(30, mobilityBase - gearCount * 5);

    // Stealth Rating
    const hasSilencer = primaryWeapon?.attachments.some((a) => a.toLowerCase().includes("suppressor"));
    const hasScrambler = selectedGear.includes("EMP Frequency Scrambler");
    const stealth = (hasSilencer ? 40 : 15) + (hasScrambler ? 35 : 10) + (selectedGear.includes("Rebreather Scuba Apparatus") ? 20 : 0);

    return { firepower, precision, mobility, stealth: Math.min(99, stealth) };
  }, [primaryWeapon, secondaryWeapon, heavyWeapon, selectedGear]);

  // Gear toggle
  const toggleGear = (gearName: string) => {
    setSelectedGear((prev) => {
      if (prev.includes(gearName)) {
        return prev.filter((g) => g !== gearName);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), gearName];
      }
      return [...prev, gearName];
    });
  };

  // Preset Applier
  const applyPreset = (preset: (typeof PRESET_LOADOUTS)[0]) => {
    setLoadoutName(preset.name);
    setRole(preset.role);
    setPrimaryId(preset.primary);
    setSecondaryId(preset.secondary);
    setMeleeId(preset.melee);
    setHeavyId(preset.heavy);
    setSelectedGear(preset.equipment);
    setNotes(preset.notes);
  };

  // Save Loadout to User Store
  const handleSave = () => {
    if (!userState) return;
    const newLoadout: SavedLoadout = {
      id: `loadout-${Date.now()}`,
      name: loadoutName || "Custom Build",
      role: role || "Operative",
      primaryWeaponId: primaryWeapon.id,
      secondaryWeaponId: secondaryWeapon.id,
      meleeWeaponId: meleeWeapon.id,
      heavyWeaponId: heavyWeapon.id,
      equipment: selectedGear,
      notes: notes,
      updatedAt: new Date().toISOString(),
    };

    const nextState = {
      ...userState,
      savedLoadouts: [newLoadout, ...userState.savedLoadouts.filter((l) => l.name !== newLoadout.name)],
    };
    saveStoredUserState(nextState);
    alert(`Loadout "${loadoutName}" saved successfully to your offline armory!`);
  };

  const handleDeleteSaved = (id: string) => {
    if (!userState) return;
    const nextState = {
      ...userState,
      savedLoadouts: userState.savedLoadouts.filter((l) => l.id !== id),
    };
    saveStoredUserState(nextState);
  };

  const handleCopyShare = () => {
    const shareText = `GTA 6 Atlas Loadout: ${loadoutName} [${role}]\n• Primary: ${primaryWeapon.name}\n• Sidearm: ${secondaryWeapon.name}\n• Melee: ${meleeWeapon.name}\n• Heavy: ${heavyWeapon.name}\n• Gear: ${selectedGear.join(", ")}\nFirepower: ${ratings.firepower}/100 | Mobility: ${ratings.mobility}%`;
    navigator.clipboard.writeText(shareText);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Top Presets Selector */}
      <div className="card-carbon p-5 border-primary/20 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-primary" /> Tactical Archetype Presets
          </span>
          <span className="text-[10px] text-slate-500 font-mono">1-Click Setup</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRESET_LOADOUTS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="text-left p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-primary/50 transition-all group"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent block">
                {preset.role}
              </span>
              <span className="font-display text-xs font-bold text-white group-hover:text-primary transition-colors block mt-0.5">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Slot Pickers */}
        <div className="lg:col-span-2 space-y-6">
          {/* Loadout Meta Header */}
          <div className="card-carbon p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Loadout Designation
                </label>
                <input
                  type="text"
                  value={loadoutName}
                  onChange={(e) => setLoadoutName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-primary font-display font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Tactical Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Weapon Slots Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Slot 1: Primary */}
            <div className="card-carbon p-4 space-y-3 border-primary/20">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Slot 1: Primary Weapon
                </span>
                <span className="text-[10px] font-mono text-slate-400">{primaryWeapon.klass}</span>
              </div>

              <select
                value={primaryId}
                onChange={(e) => setPrimaryId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-primary font-semibold"
              >
                {primaryPool.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} — {w.klass}
                  </option>
                ))}
              </select>

              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] font-mono space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Damage:</span>
                  <span className="text-white font-bold">{primaryWeapon.damage} pts</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Fire Rate:</span>
                  <span className="text-white font-bold">{primaryWeapon.fireRate} rpm</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Magazine:</span>
                  <span className="text-accent">{primaryWeapon.magazineSize} rds</span>
                </div>
              </div>
            </div>

            {/* Slot 2: Secondary Sidearm */}
            <div className="card-carbon p-4 space-y-3 border-accent/20">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                  Slot 2: Secondary Sidearm
                </span>
                <span className="text-[10px] font-mono text-slate-400">{secondaryWeapon.klass}</span>
              </div>

              <select
                value={secondaryId}
                onChange={(e) => setSecondaryId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-primary font-semibold"
              >
                {secondaryPool.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} — {w.klass}
                  </option>
                ))}
              </select>

              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] font-mono space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Damage:</span>
                  <span className="text-white font-bold">{secondaryWeapon.damage} pts</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Handling:</span>
                  <span className="text-white font-bold">{secondaryWeapon.handling}%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Reload:</span>
                  <span className="text-accent">{secondaryWeapon.reloadTime}</span>
                </div>
              </div>
            </div>

            {/* Slot 3: Melee */}
            <div className="card-carbon p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Slot 3: Melee / Silent
                </span>
                <span className="text-[10px] font-mono text-slate-400">{meleeWeapon.klass}</span>
              </div>

              <select
                value={meleeId}
                onChange={(e) => setMeleeId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-primary font-semibold"
              >
                {meleePool.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>

              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] font-mono space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Impact:</span>
                  <span className="text-white font-bold">{meleeWeapon.damage} pts</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Silent CQC:</span>
                  <span className="text-emerald-400 font-bold">100% Undetected</span>
                </div>
              </div>
            </div>

            {/* Slot 4: Heavy / Support */}
            <div className="card-carbon p-4 space-y-3 border-amber-500/20">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Slot 4: Heavy / Tactical Support
                </span>
                <span className="text-[10px] font-mono text-slate-400">{heavyWeapon.klass}</span>
              </div>

              <select
                value={heavyId}
                onChange={(e) => setHeavyId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-primary font-semibold"
              >
                {heavyPool.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} — {w.klass}
                  </option>
                ))}
              </select>

              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] font-mono space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Stopping Power:</span>
                  <span className="text-amber-400 font-bold">{heavyWeapon.damage} pts</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Range:</span>
                  <span className="text-white font-bold">{heavyWeapon.range} m</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tactical Gear Multi-Picker (Up to 3) */}
          <div className="card-carbon p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-emerald-400" /> Tactical Equipment ({selectedGear.length}/3 Slots)
              </span>
              <span className="text-[10px] font-mono text-slate-400">Max 3 Items</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {TACTICAL_GEAR_OPTIONS.map((gear) => {
                const isEquipped = selectedGear.includes(gear);
                return (
                  <button
                    key={gear}
                    onClick={() => toggleGear(gear)}
                    className={cn(
                      "text-left p-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between",
                      isEquipped
                        ? "border-emerald-500 bg-emerald-950/20 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                        : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white"
                    )}
                  >
                    <span className="truncate pr-1">{gear}</span>
                    {isEquipped && <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Loadout Specs & Actions */}
        <div className="space-y-6">
          {/* Performance Radar Card */}
          <div className="card-carbon p-6 space-y-5 border-primary/30">
            <h3 className="font-display text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Gauge className="h-4 w-4 text-primary" /> Loadout Combat Metrics
            </h3>

            <div className="space-y-3 font-mono text-xs">
              {/* Firepower */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Crosshair className="h-3.5 w-3.5 text-rose-400" /> Firepower
                  </span>
                  <span className="text-rose-400 font-bold">{ratings.firepower} / 100</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full transition-all" style={{ width: `${ratings.firepower}%` }} />
                </div>
              </div>

              {/* Accuracy & Precision */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5 text-amber-400" /> Precision
                  </span>
                  <span className="text-amber-400 font-bold">{ratings.precision} / 100</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${ratings.precision}%` }} />
                </div>
              </div>

              {/* Mobility */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Weight className="h-3.5 w-3.5 text-accent" /> Mobility & Sprint
                  </span>
                  <span className="text-accent font-bold">{ratings.mobility}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${ratings.mobility}%` }} />
                </div>
              </div>

              {/* Stealth Rating */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Shield className="h-3.5 w-3.5 text-emerald-400" /> Concealment / Stealth
                  </span>
                  <span className="text-emerald-400 font-bold">{ratings.stealth} / 100</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${ratings.stealth}%` }} />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleSave}
                className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2 font-bold uppercase tracking-wider"
              >
                <Save className="h-4 w-4" /> Save Build To Armory
              </button>

              <button
                onClick={handleCopyShare}
                className="btn-secondary w-full py-2.5 text-xs flex items-center justify-center gap-2 font-bold uppercase tracking-wider"
              >
                {copiedLink ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                {copiedLink ? "Loadout Copied!" : "Share / Copy Loadout"}
              </button>
            </div>
          </div>

          {/* Saved Builds Shelf */}
          <div className="card-carbon p-6 space-y-4">
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
              Saved Armory Builds ({userState?.savedLoadouts.length || 0})
            </h4>

            {(userState?.savedLoadouts.length || 0) === 0 ? (
              <p className="text-xs text-slate-400">No saved loadouts yet. Configure and save above.</p>
            ) : (
              <div className="space-y-3">
                {userState?.savedLoadouts.map((saved) => (
                  <div
                    key={saved.id}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
                        {saved.role}
                      </span>
                      <h5 className="text-xs font-bold text-white truncate">{saved.name}</h5>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {saved.equipment.length} items equipped
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setLoadoutName(saved.name);
                          setRole(saved.role);
                          setPrimaryId(saved.primaryWeaponId);
                          setSecondaryId(saved.secondaryWeaponId);
                          setMeleeId(saved.meleeWeaponId);
                          setHeavyId(saved.heavyWeaponId);
                          setSelectedGear(saved.equipment);
                          if (saved.notes) setNotes(saved.notes);
                        }}
                        className="btn-ghost text-xs p-1.5 text-accent hover:text-white"
                        title="Load this build into builder"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDeleteSaved(saved.id)}
                        className="btn-ghost text-xs p-1.5 text-rose-400 hover:text-rose-300"
                        title="Delete saved build"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
