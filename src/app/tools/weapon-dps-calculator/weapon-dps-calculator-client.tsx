"use client";

import { useState, useMemo } from "react";
import {
  Crosshair,
  Copy,
  Check,
  RotateCcw,
  Info,
  Zap,
  Target,
  Timer,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Weapon {
  name: string;
  damage: number; // damage per pellet
  pellets: number;
  rpm: number;
  mag: number;
  class: string;
}

const WEAPONS: Weapon[] = [
  {
    name: "M4 Tactical Carbine",
    damage: 32,
    pellets: 1,
    rpm: 750,
    mag: 30,
    class: "Assault Rifle",
  },
  {
    name: "Custom Glock 21",
    damage: 28,
    pellets: 1,
    rpm: 350,
    mag: 12,
    class: "Pistol",
  },
  {
    name: "Combat Shotgun",
    damage: 18,
    pellets: 8,
    rpm: 70,
    mag: 8,
    class: "Shotgun",
  },
  {
    name: "Micro SMG",
    damage: 22,
    pellets: 1,
    rpm: 900,
    mag: 32,
    class: "SMG",
  },
  {
    name: "Heavy Sniper",
    damage: 150,
    pellets: 1,
    rpm: 30,
    mag: 6,
    class: "Sniper",
  },
  {
    name: "Vom Feuer Heavy Pistol",
    damage: 40,
    pellets: 1,
    rpm: 280,
    mag: 10,
    class: "Pistol",
  },
  {
    name: "Sawed-off Shotgun",
    damage: 22,
    pellets: 8,
    rpm: 60,
    mag: 2,
    class: "Shotgun",
  },
  {
    name: "Military Rifle",
    damage: 36,
    pellets: 1,
    rpm: 650,
    mag: 30,
    class: "Assault Rifle",
  },
];

interface Attachment {
  id: string;
  name: string;
  effect: string;
  tags: string[];
}

const ATTACHMENTS: Attachment[] = [
  {
    id: "suppressor",
    name: "Suppressor",
    effect: "−10% damage",
    tags: ["stealth"],
  },
  {
    id: "extended-mag",
    name: "Extended Mag",
    effect: "+50% mag size",
    tags: ["capacity"],
  },
  {
    id: "compensator",
    name: "Compensator",
    effect: "+15% effective DPS",
    tags: ["recoil control"],
  },
  {
    id: "grip",
    name: "Grip",
    effect: "+10% effective DPS",
    tags: ["stability"],
  },
  {
    id: "scope",
    name: "Scope",
    effect: "no DPS change",
    tags: ["+range"],
  },
];

function dpsFor(weapon: Weapon, active: Set<string>): number {
  const dmgMult = active.has("suppressor") ? 0.9 : 1;
  const dpsMult =
    1 * (active.has("compensator") ? 1.15 : 1) * (active.has("grip") ? 1.1 : 1);
  return weapon.damage * weapon.pellets * (weapon.rpm / 60) * dmgMult * dpsMult;
}

function magFor(weapon: Weapon, active: Set<string>): number {
  return active.has("extended-mag") ? Math.round(weapon.mag * 1.5) : weapon.mag;
}

export function WeaponDpsCalculatorClient() {
  const [weaponName, setWeaponName] = useState(WEAPONS[0].name);
  const [activeAttachments, setActiveAttachments] = useState<Set<string>>(
    new Set(),
  );
  const [copied, setCopied] = useState(false);
  const [overrides, setOverrides] = useState<Partial<Weapon>>({});

  const weapon = useMemo(
    () => ({
      ...(WEAPONS.find((w) => w.name === weaponName) ?? WEAPONS[0]),
      ...overrides,
    }),
    [weaponName, overrides],
  );

  const stats = useMemo(() => {
    const dmgMult = activeAttachments.has("suppressor") ? 0.9 : 1;
    const dpsMult =
      (activeAttachments.has("compensator") ? 1.15 : 1) *
      (activeAttachments.has("grip") ? 1.1 : 1);
    const effectivePerPellet = weapon.damage * dmgMult;
    const perShot = effectivePerPellet * weapon.pellets;
    const dps = perShot * (weapon.rpm / 60) * dpsMult;
    const mag = magFor(weapon, activeAttachments);
    const damagePerMag = perShot * mag;
    const timeToEmpty = mag / (weapon.rpm / 60);
    return { dps, mag, damagePerMag, timeToEmpty, perShot };
  }, [weapon, activeAttachments]);

  const comparison = useMemo(
    () =>
      WEAPONS.map((w) => ({
        name: w.name,
        dps: dpsFor(w, activeAttachments),
        selected: w.name === weaponName,
      })).sort((a, b) => b.dps - a.dps),
    [activeAttachments, weaponName],
  );

  const maxDps = Math.max(...comparison.map((c) => c.dps), 1);

  const toggleAttachment = (id: string) => {
    setActiveAttachments((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleReset = () => {
    setWeaponName(WEAPONS[0].name);
    setOverrides({});
    setActiveAttachments(new Set());
  };

  const handleCopyLoadout = () => {
    const attList =
      activeAttachments.size > 0
        ? ATTACHMENTS.filter((a) => activeAttachments.has(a.id))
            .map((a) => a.name)
            .join(", ")
        : "None";
    const summary = `HYPOTHETICAL DPS SIMULATION - not verified GTA VI statistics.
Example attachment assumptions: suppressor x0.9 damage, extended mag x1.5 capacity, compensator x1.15 DPS, grip x1.1 DPS.
Inputs: ${weapon.damage} damage/pellet, ${weapon.pellets} pellets, ${weapon.rpm} rpm, ${weapon.mag} rounds.
Example preset: ${weapon.name} (${weapon.class})
Attachments: ${attList}
DPS: ${stats.dps.toFixed(1)} | Damage per shot: ${stats.perShot.toFixed(1)} | Damage per mag: ${stats.damagePerMag.toFixed(0)} | Time to empty: ${stats.timeToEmpty.toFixed(1)}s (mag ${stats.mag})`;
    navigator.clipboard
      .writeText(summary)
      .then(() => setCopied(true))
      .catch(() => setCopied(false));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <p className="rounded-xl border border-amber-600/40 bg-amber-500/10 p-4 text-sm">
        <strong>Hypothetical simulation.</strong> Presets and attachment effects
        are examples, not verified GTA VI data. Edit the input assumptions
        below; all outputs depend on them.
      </p>
      <fieldset className="grid grid-cols-2 gap-4 rounded-xl border border-border p-4">
        <legend className="px-2 font-bold">Editable example inputs</legend>
        {(
          [
            ["damage", "Damage per pellet"],
            ["pellets", "Pellets per shot"],
            ["rpm", "Rounds per minute"],
            ["mag", "Magazine rounds"],
          ] as const
        ).map(([field, label]) => (
          <label key={field} className="text-sm">
            {label}
            <input
              className="mt-1 block w-full rounded-lg border border-border bg-card p-3"
              type="number"
              min={1}
              max={10000}
              value={weapon[field]}
              onChange={(e) => {
                const n = Number(e.target.value);
                if (Number.isFinite(n))
                  setOverrides((old) => ({
                    ...old,
                    [field]: Math.max(1, Math.min(10000, n)),
                  }));
              }}
            />
          </label>
        ))}
      </fieldset>
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* INPUTS COLUMN (5 cols) */}
        <div className="lg:col-span-5 card-surface p-6 rounded-3xl border border-border shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h2 className="font-display text-base font-black uppercase text-foreground flex items-center gap-2">
              <Crosshair className="h-4 w-4 text-accent" /> Loadout Builder
            </h2>
            <button
              onClick={handleReset}
              className="min-h-[44px] inline-flex items-center px-3 text-xs text-muted-foreground hover:text-foreground gap-1 transition-colors"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>

          {/* Weapon dropdown */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">
              Weapon
            </label>
            <select
              value={weaponName}
              onChange={(e) => {
                setWeaponName(e.target.value);
                setOverrides({});
              }}
              className="w-full min-h-[44px] rounded-xl border border-border bg-muted/70 p-3 text-sm text-foreground focus:border-accent focus:outline-none"
            >
              {WEAPONS.map((w) => (
                <option key={w.name} value={w.name}>
                  {w.name} — {w.class}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-muted-foreground font-mono">
              {weapon.damage}
              {weapon.pellets > 1 ? ` × ${weapon.pellets} pellets` : ""} dmg ·{" "}
              {weapon.rpm} rpm · {weapon.mag} rd mag
            </p>
          </div>

          {/* Attachments */}
          <div>
            <span className="block text-xs font-bold text-muted-foreground mb-2">
              Attachments
            </span>
            <div className="space-y-2">
              {ATTACHMENTS.map((a) => {
                const checked = activeAttachments.has(a.id);
                return (
                  <label
                    key={a.id}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-3 min-h-[44px] cursor-pointer transition-all",
                      checked
                        ? "border-accent bg-accent/10"
                        : "border-border bg-muted/60 hover:border-border",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAttachment(a.id)}
                      className="h-4 w-4 accent-gold shrink-0"
                    />
                    <span className="flex-1">
                      <span className="block text-sm font-bold text-foreground">
                        {a.name}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {a.effect}
                      </span>
                    </span>
                    <span className="flex flex-wrap justify-end gap-1 max-w-[45%]">
                      {a.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-light"
                        >
                          {t}
                        </span>
                      ))}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* OUTPUTS (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live stat cards */}
          <div className="card-surface p-6 rounded-3xl border border-border shadow-2xl">
            <h2 className="font-display text-base font-black uppercase text-foreground mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-gold-light" /> {weapon.name} —
              Simulated Outputs
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl border border-gold/40 bg-gold/10 p-3.5 text-center">
                <Zap className="h-4 w-4 text-gold-light mx-auto mb-1" />
                <span className="font-mono text-lg font-black text-foreground">
                  {stats.dps.toFixed(0)}
                </span>
                <span className="block text-xs uppercase font-bold text-muted-foreground">
                  Damage / Sec
                </span>
              </div>
              <div className="rounded-2xl border border-border bg-muted/60 p-3.5 text-center">
                <Target className="h-4 w-4 text-orange-400 mx-auto mb-1" />
                <span className="font-mono text-lg font-black text-foreground">
                  {stats.damagePerMag.toFixed(0)}
                </span>
                <span className="block text-xs uppercase font-bold text-muted-foreground">
                  Damage / Mag
                </span>
              </div>
              <div className="rounded-2xl border border-border bg-muted/60 p-3.5 text-center">
                <Timer className="h-4 w-4 text-cyan-600 dark:text-[#00F0FF] mx-auto mb-1" />
                <span className="font-mono text-lg font-black text-foreground">
                  {stats.timeToEmpty.toFixed(1)}s
                </span>
                <span className="block text-xs uppercase font-bold text-muted-foreground">
                  Time to Empty
                </span>
              </div>
              <div className="rounded-2xl border border-border bg-muted/60 p-3.5 text-center">
                <Layers className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
                <span className="font-mono text-lg font-black text-foreground">
                  {stats.mag}
                </span>
                <span className="block text-xs uppercase font-bold text-muted-foreground">
                  Mag Size
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
              <Button
                onClick={handleCopyLoadout}
                className="min-h-[44px] bg-muted/50 hover:bg-muted/60 text-foreground text-xs font-bold"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5 mr-1" />
                )}
                <span>
                  {copied ? "Loadout Copied!" : "Copy loadout summary"}
                </span>
              </Button>
              <span className="text-xs text-muted-foreground font-mono">
                {activeAttachments.size} attachment
                {activeAttachments.size === 1 ? "" : "s"} equipped
              </span>
            </div>
          </div>

          {/* DPS comparison chart */}
          <div className="card-surface p-6 rounded-3xl border border-border">
            <h3 className="font-display text-base font-bold uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
              <Crosshair className="h-4 w-4 text-orange-400" /> Example Presets
              — Simulated DPS
            </h3>
            <div className="space-y-2.5">
              {comparison.map((c) => (
                <div key={c.name} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "w-36 sm:w-44 shrink-0 text-xs font-bold truncate",
                      c.selected ? "text-gold-light" : "text-muted-foreground",
                    )}
                  >
                    {c.name}
                  </span>
                  <div className="flex-1 h-6 rounded-lg bg-muted/60 border border-border overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-lg transition-all duration-300",
                        c.selected
                          ? "bg-gradient-to-r from-gold via-gold-light to-gold"
                          : "bg-gradient-to-r from-orange-500/70 to-orange-400/50",
                      )}
                      style={{
                        width: `${Math.max(2, (c.dps / maxDps) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="w-14 shrink-0 text-right font-mono text-xs font-bold text-foreground">
                    {c.dps.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Example attachment multipliers apply to each preset. Preset
              numbers are fictional inputs; this is not a ranking of GTA VI
              weapons.
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="card-surface p-5 rounded-3xl border border-border flex items-start gap-3">
        <Info className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          All inputs and attachment effects are hypothetical examples, not
          measured or predicted GTA VI values. The formula models damage ×
          pellets × rounds per second, with the displayed example multipliers;
          it does not establish actual weapon balance or attachment mechanics.
        </p>
      </div>
    </div>
  );
}
