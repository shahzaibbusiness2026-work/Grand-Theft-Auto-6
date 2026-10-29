"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Wrench,
  RotateCcw,
  Copy,
  Check,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Gauge,
  DollarSign,
  ArrowRight,
  Info,
  Shield,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Vehicle {
  id: string;
  name: string;
  price: number;
}

interface Upgrade {
  id: string;
  name: string;
  cost: number;
  perf: number;
  category: "Performance" | "Protection" | "Cosmetic";
  note?: string;
}

const VEHICLES: Vehicle[] = [
  { id: "visione", name: "Grotti Visione", price: 2850000 },
  { id: "pariah", name: "Ocelot Pariah", price: 1420000 },
  { id: "banshee", name: "Bravado Banshee", price: 1250000 },
  { id: "schafter", name: "Benefactor Schafter", price: 1100000 },
  { id: "patriot", name: "Mammoth Patriot", price: 950000 },
  { id: "elegy", name: "Annis Elegy", price: 900000 },
  { id: "dominator", name: "Vapid Dominator", price: 850000 },
  { id: "hakuchou", name: "Shitzu Hakuchou", price: 720000 },
  { id: "vigero", name: "Declasse Vigero", price: 640000 },
  { id: "comet", name: "Pfister Comet", price: 1875000 },
];

const UPGRADES: Upgrade[] = [
  { id: "engine", name: "Engine L4", cost: 180000, perf: 12, category: "Performance", note: "Top-tier engine tune" },
  { id: "turbo", name: "Turbo Tuning", cost: 50000, perf: 8, category: "Performance", note: "Boost pressure upgrade" },
  { id: "transmission", name: "Race Transmission", cost: 95000, perf: 6, category: "Performance", note: "Faster gear shifts" },
  { id: "brakes", name: "Race Brakes", cost: 40000, perf: 4, category: "Performance", note: "Shorter stopping distance" },
  { id: "suspension", name: "Competition Suspension", cost: 35000, perf: 3, category: "Performance", note: "Improved cornering" },
  { id: "tires", name: "Bulletproof Tires", cost: 25000, perf: 2, category: "Performance", note: "Grip + puncture proof" },
  { id: "spoiler", name: "GT Wing Spoiler", cost: 20000, perf: 2, category: "Performance", note: "Downforce at speed" },
  { id: "armor", name: "Armor 100%", cost: 75000, perf: 0, category: "Protection", note: "Survival, no speed gain" },
  { id: "paint", name: "Paint — Chrome", cost: 30000, perf: 0, category: "Cosmetic", note: "Pure style" },
  { id: "neon", name: "Neon Kit", cost: 22000, perf: 0, category: "Cosmetic", note: "Underglow lighting" },
];

const PRESETS = [
  {
    label: "Budget Street Build",
    upgrades: ["turbo", "brakes", "tires", "spoiler"],
  },
  {
    label: "Track Monster",
    upgrades: ["engine", "turbo", "transmission", "brakes", "suspension", "tires", "spoiler"],
  },
  {
    label: "Full Send",
    upgrades: UPGRADES.map((u) => u.id),
  },
];

const CATEGORY_ICON = {
  Performance: Gauge,
  Protection: Shield,
  Cosmetic: Palette,
} as const;

export function VehicleUpgradeCalculatorClient() {
  const [vehicleId, setVehicleId] = useState<string>(VEHICLES[0].id);
  const [selectedUpgrades, setSelectedUpgrades] = useState<string[]>(["turbo", "brakes"]);
  const [copied, setCopied] = useState(false);

  const vehicle = useMemo(
    () => VEHICLES.find((v) => v.id === vehicleId) ?? VEHICLES[0],
    [vehicleId]
  );

  const calculations = useMemo(() => {
    const selected = UPGRADES.filter((u) => selectedUpgrades.includes(u.id));
    const upgradeCost = selected.reduce((sum, u) => sum + u.cost, 0);
    const perfPoints = selected.reduce((sum, u) => sum + u.perf, 0);
    const totalBuild = vehicle.price + upgradeCost;
    const costPerPoint = perfPoints > 0 ? Math.round(upgradeCost / perfPoints) : 0;
    const maxPerf = UPGRADES.reduce((sum, u) => sum + u.perf, 0);
    return { selected, upgradeCost, perfPoints, totalBuild, costPerPoint, maxPerf };
  }, [selectedUpgrades, vehicle]);

  const toggleUpgrade = (id: string) => {
    setSelectedUpgrades((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  const handleReset = () => {
    setVehicleId(VEHICLES[0].id);
    setSelectedUpgrades([]);
  };

  const handleCopySummary = () => {
    const lines = calculations.selected.map(
      (u) => `• ${u.name} — $${u.cost.toLocaleString()}${u.perf > 0 ? ` (+${u.perf} perf)` : " (cosmetic)"}`
    );
    const summary = `GTA 6 Vehicle Upgrade Build
Vehicle: ${vehicle.name} — $${vehicle.price.toLocaleString()}
Upgrades (${calculations.selected.length}):
${lines.join("\n")}
Upgrade Cost: $${calculations.upgradeCost.toLocaleString()}
Total Build Cost: $${calculations.totalBuild.toLocaleString()}
Estimated Performance Gain: +${calculations.perfPoints} pts
Cost per Performance Point: $${calculations.costPerPoint.toLocaleString()}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const perfPct = calculations.maxPerf > 0
    ? Math.min(100, Math.round((calculations.perfPoints / calculations.maxPerf) * 100))
    : 0;

  return (
    <div className="space-y-10">
      {/* Presets Bar */}
      <div className="card-surface p-4 rounded-2xl border border-border flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-2 flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 text-gold-light" /> Build Presets:
        </span>
        {PRESETS.map((p) => {
          const active =
            p.upgrades.length === selectedUpgrades.length &&
            p.upgrades.every((id) => selectedUpgrades.includes(id));
          return (
            <button
              key={p.label}
              onClick={() => setSelectedUpgrades([...p.upgrades])}
              className={cn(
                "rounded-xl px-3 py-1.5 min-h-[44px] text-xs font-semibold transition-all border",
                active
                  ? "border-accent bg-accent/20 text-foreground font-bold shadow-sm"
                  : "border-border bg-muted/60 text-muted-foreground hover:border-border hover:text-foreground"
              )}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Main Calculator Grid */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* INPUTS COLUMN (5 cols) */}
        <div className="lg:col-span-5 card-surface p-6 rounded-3xl border border-border shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h2 className="font-display text-base font-black uppercase text-foreground flex items-center gap-2">
              <Wrench className="h-4 w-4 text-accent" /> Build Configuration
            </h2>
            <button
              onClick={handleReset}
              className="min-h-[44px] inline-flex items-center px-3 text-xs text-muted-foreground hover:text-foreground gap-1 transition-colors"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>

          {/* Vehicle Select */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5 flex justify-between">
              <span>Base Vehicle</span>
              <span className="font-mono text-gold-light font-bold">
                ${vehicle.price.toLocaleString()}
              </span>
            </label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full rounded-xl border border-border bg-muted/70 p-3 text-sm font-semibold text-foreground focus:border-accent focus:outline-none"
            >
              {VEHICLES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} — ${v.price.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* Upgrades */}
          <div>
            <span className="block text-xs font-bold text-muted-foreground mb-2">
              Upgrades &amp; Mods
            </span>
            <div className="space-y-2">
              {UPGRADES.map((u) => {
                const Icon = CATEGORY_ICON[u.category];
                const checked = selectedUpgrades.includes(u.id);
                return (
                  <label
                    key={u.id}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all",
                      checked
                        ? "border-accent bg-accent/10"
                        : "border-border bg-muted/60 hover:border-border"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleUpgrade(u.id)}
                      className="h-4 w-4 accent-gold shrink-0"
                    />
                    <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-bold text-foreground truncate">
                        {u.name}
                      </span>
                      <span className="block text-xs text-muted-foreground truncate">
                        {u.note} &bull; {u.category}
                      </span>
                    </span>
                    <span className="text-right shrink-0">
                      <span className="block font-mono text-xs font-black text-foreground">
                        ${u.cost.toLocaleString()}
                      </span>
                      {u.perf > 0 ? (
                        <span className="block text-xs font-bold text-emerald-400">+{u.perf} perf</span>
                      ) : (
                        <span className="block text-xs font-bold text-muted-foreground">cosmetic</span>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* OUTPUTS / STATS (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Totals Card */}
          <div className="card-surface p-6 rounded-3xl border border-border shadow-2xl bg-gradient-to-br from-card via-card to-primary/5 dark:from-[#0e0717] dark:via-[#070b15] dark:to-[#040810]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-bold text-muted-foreground">Total Build Cost</span>
                <div className="font-display text-3xl sm:text-4xl font-black text-foreground mt-0.5">
                  ${calculations.totalBuild.toLocaleString()}
                </div>
                <span className="text-xs text-muted-foreground">
                  ${vehicle.price.toLocaleString()} base + ${calculations.upgradeCost.toLocaleString()} mods
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono text-2xl font-black text-cyan-600 dark:text-[#00F0FF]">
                  +{calculations.perfPoints}
                </span>
                <span className="block text-xs uppercase font-bold text-muted-foreground">
                  Estimated Perf. Pts
                </span>
              </div>
            </div>

            {/* Performance Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                <span className="font-bold uppercase tracking-wider">Estimated Performance Gain</span>
                <span className="font-mono">{perfPct}% of max</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/80 border border-border">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent via-purple-500 to-[#00F0FF] transition-all duration-500"
                  style={{ width: `${perfPct}%` }}
                />
              </div>
            </div>

            {/* 3 Output Metrics */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-border bg-muted/60 p-3.5 text-center">
                <DollarSign className="h-4 w-4 text-accent mx-auto mb-1" />
                <span className="font-mono text-lg font-black text-foreground">
                  ${calculations.upgradeCost.toLocaleString()}
                </span>
                <span className="block text-xs uppercase font-bold text-muted-foreground">Mods Cost</span>
              </div>

              <div className="rounded-2xl border border-border bg-muted/60 p-3.5 text-center">
                <Gauge className="h-4 w-4 text-cyan-600 dark:text-[#00F0FF] mx-auto mb-1" />
                <span className="font-mono text-lg font-black text-foreground">
                  {calculations.perfPoints > 0
                    ? `$${calculations.costPerPoint.toLocaleString()}`
                    : "—"}
                </span>
                <span className="block text-xs uppercase font-bold text-muted-foreground">
                  Cost / Perf Point
                </span>
              </div>

              <div className="rounded-2xl border border-border bg-muted/60 p-3.5 text-center col-span-2 sm:col-span-1">
                <TrendingUp className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
                <span className="font-mono text-lg font-black text-foreground">
                  {calculations.selected.length}/{UPGRADES.length}
                </span>
                <span className="block text-xs uppercase font-bold text-muted-foreground">Mods Selected</span>
              </div>
            </div>

            {/* Copy & Share actions */}
            <div className="mt-6 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
              <Button
                onClick={handleCopySummary}
                className="bg-muted/50 hover:bg-muted/60 text-foreground text-xs font-bold"
              >
                {copied ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                <span>{copied ? "Build Copied!" : "Copy Build Summary"}</span>
              </Button>

              <Link
                href="/tools/money-calculator"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-foreground transition-colors"
              >
                <span>Can You Afford This Build?</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* SELECTED MODS BREAKDOWN */}
          <div className="card-surface p-6 rounded-3xl border border-border">
            <h3 className="font-display text-base font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
              <Wrench className="h-4 w-4 text-accent" /> Selected Mods Breakdown
            </h3>
            {calculations.selected.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No mods selected yet — tick upgrades on the left to price out your build.
              </p>
            ) : (
              <div className="space-y-2.5">
                {calculations.selected.map((u) => (
                  <div
                    key={u.id}
                    className="rounded-2xl border border-border bg-muted/60 p-3.5 flex items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="font-display text-sm font-bold text-foreground">{u.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {u.category} &bull; {u.note}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-foreground text-xs">
                        ${u.cost.toLocaleString()}
                      </span>
                      {u.perf > 0 ? (
                        <span className="block text-xs uppercase font-black text-emerald-400">
                          +{u.perf} perf
                        </span>
                      ) : (
                        <span className="block text-xs uppercase font-black text-muted-foreground">
                          cosmetic
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FORMULA EXPLANATION & FAQ */}
      <div className="grid gap-6 md:grid-cols-2 pt-6 border-t border-border">
        <div className="card-surface p-6 rounded-3xl border border-border space-y-3">
          <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
            <Info className="h-4 w-4 text-cyan-600 dark:text-[#00F0FF]" /> How the Formula Works
          </h3>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Total build cost is <code className="bg-muted/80 px-1.5 py-0.5 rounded text-gold-light">Base Price + Sum of Mod Costs</code>.
            Estimated performance gain is the sum of each mod&apos;s performance points. Cost per performance
            point equals <code className="bg-muted/80 px-1.5 py-0.5 rounded text-cyan-600 dark:text-[#00F0FF]">Mods Cost / Total Perf Points</code> —
            cosmetic mods (armor, chrome paint, neon) add cost but no speed.
          </p>
        </div>

        <div className="card-surface p-6 rounded-3xl border border-border space-y-3">
          <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-accent" /> Upgrade Calculator FAQ
          </h3>
          <p className="text-xs leading-relaxed text-muted-foreground">
            <strong>Are these prices and performance gains final?</strong> All prices and performance
            values are estimates based on leak reports and trailer analysis. Rockstar may
            rebalance the tuning economy before or after launch — treat these as planning figures.
          </p>
        </div>
      </div>
    </div>
  );
}
