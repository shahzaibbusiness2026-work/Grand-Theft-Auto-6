"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Crosshair,
  Shield,
  Zap,
  Weight,
  Sparkles,
  Save,
  Trash2,
  CheckCircle2,
  Copy,
  Gauge,
} from "lucide-react";
import { canonicalWeapons } from "@/lib/canonical-data";
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
    melee: "combat-knife",
    heavy: "tactical-smg",
    equipment: ["Rebreather Scuba Apparatus", "Thermite Breach Gel", "EMP Frequency Scrambler"],
    notes: "Quiet waterborne insertion with maximum concealment and electronic bypass.",
  },
  {
    name: "South Beach Street Warfare",
    role: "Enforcer / Assault",
    primary: "ak-74",
    secondary: "glock-21",
    melee: "combat-knife",
    heavy: "pump-shotgun",
    equipment: ["Heavy Ceramic Body Armor", "High-Explosive C4 Satchel", "Tactical First Aid Trauma Kit"],
    notes: "Heavy kinetic stopping power and maximum survivability during 5-star police response.",
  },
  {
    name: "Everglades Swampland Hunter",
    role: "Recon Marksman",
    primary: "pump-shotgun",
    secondary: "glock-21",
    melee: "combat-knife",
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
  const [meleeId, setMeleeId] = useState<string>("combat-knife");
  const [heavyId, setHeavyId] = useState<string>("pump-shotgun");
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
          <span className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" /> Tactical Archetype Presets
          </span>
          <span className="text-xs text-muted-foreground">1-click setup</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRESET_LOADOUTS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="text-left p-4 rounded-xl bg-card/90 border border-border hover:border-gold/50 hover:shadow-[0_2px_12px_rgba(201,168,106,0.15)] transition-all group"
            >
              <span className="text-xs font-medium text-accent block">
                {preset.role}
              </span>
              <span className="font-display text-sm font-bold text-foreground group-hover:text-gold-dark dark:group-hover:text-gold-light transition-colors block mt-1 leading-snug">
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
                <label className="text-sm font-medium text-muted-foreground">
                  Loadout name
                </label>
                <input
                  type="text"
                  value={loadoutName}
                  onChange={(e) => setLoadoutName(e.target.value)}
                  className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-base text-foreground focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20 font-display font-bold transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Tactical role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-base text-foreground focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Weapon Slots Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Slot 1: Primary */}
            <div className="card-carbon p-4 space-y-3 border-primary/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  Primary Weapon
                </span>
                <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">{primaryWeapon.klass}</span>
              </div>

              <select
                value={primaryId}
                onChange={(e) => setPrimaryId(e.target.value)}
                className="w-full bg-card border border-border rounded-xl px-3 py-3 text-sm text-foreground focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20 font-medium transition-all cursor-pointer"
              >
                {primaryPool.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} — {w.klass}
                  </option>
                ))}
              </select>

              <div className="p-3 rounded-lg bg-background/60 border border-border/60 text-sm space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-muted-foreground">Damage</span>
                  <span className="font-display font-black tabular-nums text-foreground">{primaryWeapon.damage}<span className="text-[10px] font-semibold text-muted-foreground ml-0.5">pts</span></span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-muted-foreground">Fire rate</span>
                  <span className="font-display font-bold tabular-nums text-foreground">{primaryWeapon.fireRate} <span className="text-xs font-medium text-muted-foreground">rpm</span></span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-muted-foreground">Magazine</span>
                  <span className="font-display font-bold tabular-nums text-foreground">{primaryWeapon.magazineSize} <span className="text-xs font-medium text-muted-foreground">rds</span></span>
                </div>
              </div>
            </div>

            {/* Slot 2: Secondary Sidearm */}
            <div className="card-carbon p-4 space-y-3 border-accent/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  Sidearm
                </span>
                <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">{secondaryWeapon.klass}</span>
              </div>

              <select
                value={secondaryId}
                onChange={(e) => setSecondaryId(e.target.value)}
                className="w-full bg-card border border-border rounded-xl px-3 py-3 text-sm text-foreground focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20 font-medium transition-all cursor-pointer"
              >
                {secondaryPool.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} — {w.klass}
                  </option>
                ))}
              </select>

              <div className="p-3 rounded-lg bg-background/60 border border-border/60 text-sm space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-muted-foreground">Damage</span>
                  <span className="font-display font-black tabular-nums text-foreground">{secondaryWeapon.damage}<span className="text-[10px] font-semibold text-muted-foreground ml-0.5">pts</span></span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-muted-foreground">Handling</span>
                  <span className="font-display font-bold tabular-nums text-foreground">{secondaryWeapon.handling}<span className="text-xs font-medium text-muted-foreground">%</span></span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-muted-foreground">Reload</span>
                  <span className="font-display font-bold tabular-nums text-foreground">{secondaryWeapon.reloadTime}</span>
                </div>
              </div>
            </div>

            {/* Slot 3: Melee */}
            <div className="card-carbon p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  Melee
                </span>
                <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">{meleeWeapon.klass}</span>
              </div>

              <select
                value={meleeId}
                onChange={(e) => setMeleeId(e.target.value)}
                className="w-full bg-card border border-border rounded-xl px-3 py-3 text-sm text-foreground focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20 font-medium transition-all cursor-pointer"
              >
                {meleePool.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>

              <div className="p-3 rounded-lg bg-background/60 border border-border/60 text-sm space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-muted-foreground">Impact</span>
                  <span className="font-display font-bold tabular-nums text-foreground">{meleeWeapon.damage} <span className="text-xs font-medium text-muted-foreground">pts</span></span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-muted-foreground">Silent takedowns</span>
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Undetected</span>
                </div>
              </div>
            </div>

            {/* Slot 4: Heavy / Support */}
            <div className="card-carbon p-4 space-y-3 border-gold/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  Heavy Support
                </span>
                <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">{heavyWeapon.klass}</span>
              </div>

              <select
                value={heavyId}
                onChange={(e) => setHeavyId(e.target.value)}
                className="w-full bg-card border border-border rounded-xl px-3 py-3 text-sm text-foreground focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20 font-medium transition-all cursor-pointer"
              >
                {heavyPool.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} — {w.klass}
                  </option>
                ))}
              </select>

              <div className="p-3 rounded-lg bg-background/60 border border-border/60 text-sm space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-muted-foreground">Stopping power</span>
                  <span className="font-display font-bold tabular-nums text-foreground">{heavyWeapon.damage} <span className="text-xs font-medium text-muted-foreground">pts</span></span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-muted-foreground">Range</span>
                  <span className="font-display font-bold tabular-nums text-foreground">{heavyWeapon.range} <span className="text-xs font-medium text-muted-foreground">m</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Tactical Gear Multi-Picker (Up to 3) */}
          <div className="card-carbon p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" /> Tactical Equipment
                <span className="text-xs font-normal text-muted-foreground">({selectedGear.length}/3)</span>
              </span>
              <span className="text-xs text-muted-foreground">Pick up to 3</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {TACTICAL_GEAR_OPTIONS.map((gear) => {
                const isEquipped = selectedGear.includes(gear);
                return (
                  <button
                    key={gear}
                    onClick={() => toggleGear(gear)}
                    className={cn(
                      "text-left p-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-between",
                      isEquipped
                        ? "border-emerald-500 bg-emerald-950/20 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                        : "border-border bg-card/60 text-muted-foreground hover:border-border hover:text-foreground"
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
            <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Gauge className="h-5 w-5 text-gold" /> Combat Metrics
            </h3>

            <div className="space-y-4">
              {/* Firepower */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Crosshair className="h-4 w-4 text-rose-400" /> Firepower
                  </span>
                  <span className="font-display text-base font-black tabular-nums text-rose-400">{ratings.firepower}<span className="text-xs font-semibold text-muted-foreground">/100</span></span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full transition-all" style={{ width: `${ratings.firepower}%` }} />
                </div>
              </div>

              {/* Accuracy & Precision */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Zap className="h-4 w-4 text-gold" /> Precision
                  </span>
                  <span className="font-display text-base font-black tabular-nums text-gold-light">{ratings.precision}<span className="text-xs font-semibold text-muted-foreground">/100</span></span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gold-light rounded-full transition-all" style={{ width: `${ratings.precision}%` }} />
                </div>
              </div>

              {/* Mobility */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Weight className="h-4 w-4 text-accent" /> Mobility
                  </span>
                  <span className="font-display text-base font-black tabular-nums text-accent">{ratings.mobility}<span className="text-xs font-semibold text-muted-foreground">%</span></span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${ratings.mobility}%` }} />
                </div>
              </div>

              {/* Stealth Rating */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4 text-emerald-500" /> Stealth
                  </span>
                  <span className="font-display text-base font-black tabular-nums text-emerald-400">{ratings.stealth}<span className="text-xs font-semibold text-muted-foreground">/100</span></span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${ratings.stealth}%` }} />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleSave}
                className="w-full py-3 text-sm flex items-center justify-center gap-2 font-bold rounded-xl bg-gold text-slate-950 hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_2px_12px_rgba(201,168,106,0.3)]"
              >
                <Save className="h-4 w-4" /> Save to Armory
              </button>

              <button
                onClick={handleCopyShare}
                className="w-full py-3 text-sm flex items-center justify-center gap-2 font-semibold rounded-xl border border-gold/40 text-gold-dark dark:text-gold-light hover:bg-gold/10 active:scale-[0.98] transition-all"
              >
                {copiedLink ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                {copiedLink ? "Copied to clipboard!" : "Copy Loadout"}
              </button>
            </div>
          </div>

          {/* Saved Builds Shelf */}
          <div className="card-carbon p-6 space-y-4">
            <h4 className="font-display text-base font-bold text-foreground">
              Saved Builds <span className="text-sm font-medium text-muted-foreground">({userState?.savedLoadouts.length || 0})</span>
            </h4>

            {(userState?.savedLoadouts.length || 0) === 0 ? (
              <p className="text-sm text-muted-foreground">No saved builds yet. Configure your loadout and save it above.</p>
            ) : (
              <div className="space-y-3">
                {userState?.savedLoadouts.map((saved) => (
                  <div
                    key={saved.id}
                    className="p-3 rounded-xl bg-background/80 border border-border flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-accent block">
                        {saved.role}
                      </span>
                      <h5 className="text-sm font-semibold text-foreground truncate mt-0.5">{saved.name}</h5>
                      <span className="text-xs text-muted-foreground">
                        {saved.equipment.length} gear items
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
                        className="text-xs font-bold px-3 py-1.5 min-h-[44px] rounded-lg border border-border text-foreground hover:border-gold/50 hover:text-gold-dark dark:hover:text-gold-light transition-colors"
                        title="Load this build into builder"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDeleteSaved(saved.id)}
                        className="min-h-[44px] min-w-[44px] p-3 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
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
