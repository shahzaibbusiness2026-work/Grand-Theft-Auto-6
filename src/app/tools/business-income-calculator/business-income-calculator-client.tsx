"use client";

import { useState, useMemo } from "react";
import {
  Briefcase,
  TrendingUp,
  Calendar,
  DollarSign,
  RotateCcw,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Business {
  name: string;
  purchase: number;
  daily: number;
}

interface Upgrade {
  name: string;
  multiplier: number;
  cost: number;
  benefit: string;
}

// All figures are estimates based on GTA Online patterns — actual GTA 6 economy unconfirmed
const BUSINESSES: Business[] = [
  { name: "Malibú Nightclub", purchase: 2_200_000, daily: 18_000 },
  { name: "Chop Shop", purchase: 1_400_000, daily: 12_000 },
  { name: "Smuggler Warehouse", purchase: 1_800_000, daily: 15_000 },
  { name: "Taxi Depot", purchase: 950_000, daily: 8_000 },
  { name: "Bait & Tackle Shop", purchase: 600_000, daily: 5_000 },
  { name: "Luxury Car Dealership", purchase: 3_500_000, daily: 28_000 },
];

const UPGRADES: Upgrade[] = [
  { name: "None", multiplier: 1.0, cost: 0, benefit: "No income boost" },
  { name: "Basic", multiplier: 1.25, cost: 200_000, benefit: "+25% income" },
  { name: "Advanced", multiplier: 1.6, cost: 500_000, benefit: "+60% income" },
  { name: "Max", multiplier: 2.0, cost: 950_000, benefit: "+100% income" },
];

function money(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

export function BusinessIncomeCalculatorClient() {
  const [businessIdx, setBusinessIdx] = useState<number>(0);
  const [upgradeIdx, setUpgradeIdx] = useState<number>(0);
  const [hoursPerDay, setHoursPerDay] = useState<number>(3);
  const [copied, setCopied] = useState(false);

  const selected = BUSINESSES[businessIdx];
  const upgrade = UPGRADES[upgradeIdx];

  // Passive income scales with playtime — an 8-hour session earns the full daily estimate
  const calculations = useMemo(() => {
    const timeScale = hoursPerDay / 8;
    const effectiveDaily = selected.daily * upgrade.multiplier * timeScale;
    const weekly = effectiveDaily * 7;
    const totalInvestment = selected.purchase + upgrade.cost;
    const breakEvenDays = effectiveDaily > 0 ? totalInvestment / effectiveDaily : 0;
    const roi30 = ((effectiveDaily * 30 - totalInvestment) / Math.max(1, totalInvestment)) * 100;
    const breakEvenProgress = Math.min(100, (30 / Math.max(0.01, breakEvenDays)) * 100);
    return { effectiveDaily, weekly, totalInvestment, breakEvenDays, roi30, breakEvenProgress };
  }, [selected, upgrade, hoursPerDay]);

  // Compare every business at the current upgrade tier + playtime, ranked by 30-day ROI
  const comparison = useMemo(() => {
    return BUSINESSES.map((b, i) => {
      const daily = b.daily * upgrade.multiplier * (hoursPerDay / 8);
      const total = b.purchase + upgrade.cost;
      const roi30 = ((daily * 30 - total) / Math.max(1, total)) * 100;
      const breakEven = daily > 0 ? total / daily : 0;
      return { idx: i, name: b.name, daily, total, roi30, breakEven };
    }).sort((a, b) => b.roi30 - a.roi30);
  }, [upgrade, hoursPerDay]);

  const best = comparison[0];

  const handleReset = () => {
    setBusinessIdx(0);
    setUpgradeIdx(0);
    setHoursPerDay(3);
  };

  const handleCopyPlan = () => {
    const plan = `GTA 6 Business Investment Plan (estimates)
Business: ${selected.name} — Purchase ${money(selected.purchase)}
Upgrade Tier: ${upgrade.name} (${upgrade.benefit}) — ${money(upgrade.cost)}
Daily Playtime: ${hoursPerDay}h/day
Estimated Daily Income: ${money(calculations.effectiveDaily)}
Estimated Weekly Income: ${money(calculations.weekly)}
Total Investment: ${money(calculations.totalInvestment)}
Break-Even: ~${calculations.breakEvenDays.toFixed(1)} days
30-Day ROI: ${calculations.roi30.toFixed(1)}%
Best ROI at these settings: ${best.name} (${best.roi30.toFixed(1)}% ROI, ~${best.breakEven.toFixed(1)}d break-even)
Note: all figures are estimates based on GTA Online patterns; actual GTA 6 economy unconfirmed.`;

    navigator.clipboard.writeText(plan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10">
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* INPUTS COLUMN (5 cols) */}
        <div className="lg:col-span-5 card-surface p-6 rounded-3xl border border-border shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h2 className="font-display text-base font-black uppercase text-foreground flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" /> Investment Setup
            </h2>
            <button
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>

          {/* Business Type */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">
              Business Type (est. figures)
            </label>
            <select
              value={businessIdx}
              onChange={(e) => setBusinessIdx(Number(e.target.value))}
              className="w-full rounded-xl border border-border bg-muted/70 p-3 text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
            >
              {BUSINESSES.map((b, i) => (
                <option key={b.name} value={i}>
                  {b.name} — {money(b.purchase)} / {money(b.daily)}/day
                </option>
              ))}
            </select>
          </div>

          {/* Upgrade Level */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">
              Upgrade Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {UPGRADES.map((u, i) => (
                <button
                  key={u.name}
                  onClick={() => setUpgradeIdx(i)}
                  className={cn(
                    "rounded-xl border p-2.5 text-center transition-all",
                    upgradeIdx === i
                      ? "border-[#C9A86A] bg-[#C9A86A]/10 shadow-sm"
                      : "border-border bg-muted/60 hover:border-border hover:text-foreground"
                  )}
                >
                  <span className={cn(
                    "block text-xs font-black uppercase",
                    upgradeIdx === i ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {u.name}
                  </span>
                  <span className="block text-[10px] font-semibold text-muted-foreground mt-0.5">
                    {u.benefit}
                  </span>
                  <span className="block text-[10px] font-mono font-bold text-[#C9A86A] mt-0.5">
                    {money(u.cost)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Hours per day */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5 flex justify-between">
              <span>Hours Played Per Day</span>
              <span className="font-mono text-[#C9A86A] font-bold">{hoursPerDay} hrs/day</span>
            </label>
            <input
              type="range"
              min={0.5}
              max={8}
              step={0.5}
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number(e.target.value))}
              className="w-full accent-[#C9A86A]"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1 font-mono">
              <span>0.5h</span>
              <span>2h</span>
              <span>4h</span>
              <span>8h (full day)</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
              Passive income scales with playtime — an 8-hour session earns the full daily estimate.
            </p>
          </div>

          {/* Selected summary */}
          <div className="rounded-2xl border border-border bg-muted/60 p-3.5 text-xs leading-relaxed text-muted-foreground">
            <span className="font-bold text-foreground">{selected.name}</span> — purchase{" "}
            <span className="font-mono font-bold text-[#C9A86A]">{money(selected.purchase)}</span>, base{" "}
            <span className="font-mono font-bold text-foreground">{money(selected.daily)}/day</span>{" "}
            (est.) + <span className="font-bold text-foreground">{upgrade.name}</span> upgrades{" "}
            <span className="font-mono font-bold text-foreground">{money(upgrade.cost)}</span>.
          </div>
        </div>

        {/* OUTPUTS / STATS (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Hero: total investment + break-even progress */}
          <div className="card-surface p-6 rounded-3xl border border-border shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-bold text-muted-foreground">Total Investment (est.)</span>
                <div className="font-display text-3xl sm:text-4xl font-black text-foreground mt-0.5">
                  {money(calculations.totalInvestment)}
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-2xl font-black text-[#C9A86A]">
                  ~{calculations.breakEvenDays.toFixed(1)}
                </span>
                <span className="block text-xs uppercase font-bold text-muted-foreground">Days to Break-Even</span>
              </div>
            </div>

            {/* Break-even progress (30 days) */}
            <div className="mt-4">
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                <span>30-Day Break-Even Progress</span>
                <span className="font-mono text-foreground">{calculations.breakEvenProgress.toFixed(0)}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted border border-border">
                <div
                  className="h-full rounded-full bg-[#C9A86A] transition-all duration-500"
                  style={{ width: `${calculations.breakEvenProgress}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5">
                {calculations.breakEvenProgress >= 100
                  ? "Break-even reached within 30 days at your playtime."
                  : `At ${hoursPerDay}h/day you recover ${calculations.breakEvenProgress.toFixed(0)}% of your investment in 30 days.`}
              </p>
            </div>

            {/* 5 Output Metrics */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-border bg-muted/60 p-3.5 text-center">
                <DollarSign className="h-4 w-4 text-[#C9A86A] mx-auto mb-1" />
                <span className="font-mono text-lg font-black text-foreground">{money(calculations.effectiveDaily)}</span>
                <span className="block text-xs uppercase font-bold text-muted-foreground">Daily Income (est.)</span>
              </div>

              <div className="rounded-2xl border border-border bg-muted/60 p-3.5 text-center">
                <Calendar className="h-4 w-4 text-primary mx-auto mb-1" />
                <span className="font-mono text-lg font-black text-foreground">{money(calculations.weekly)}</span>
                <span className="block text-xs uppercase font-bold text-muted-foreground">Weekly Income (est.)</span>
              </div>

              <div className="rounded-2xl border border-border bg-muted/60 p-3.5 text-center">
                <Briefcase className="h-4 w-4 text-[#C9A86A] mx-auto mb-1" />
                <span className="font-mono text-lg font-black text-foreground">{money(calculations.totalInvestment)}</span>
                <span className="block text-xs uppercase font-bold text-muted-foreground">Total Investment</span>
              </div>

              <div className="rounded-2xl border border-border bg-muted/60 p-3.5 text-center">
                <TrendingUp className="h-4 w-4 text-primary mx-auto mb-1" />
                <span className="font-mono text-lg font-black text-foreground">~{calculations.breakEvenDays.toFixed(1)}d</span>
                <span className="block text-xs uppercase font-bold text-muted-foreground">Break-Even</span>
              </div>

              <div className="rounded-2xl border border-border bg-muted/60 p-3.5 text-center">
                <TrendingUp className="h-4 w-4 text-[#C9A86A] mx-auto mb-1" />
                <span className="font-mono text-lg font-black text-foreground">{calculations.roi30.toFixed(1)}%</span>
                <span className="block text-xs uppercase font-bold text-muted-foreground">ROI After 30 Days</span>
              </div>

              <div className="rounded-2xl border border-border bg-muted/60 p-3.5 text-center flex flex-col items-center justify-center">
                <Calendar className="h-4 w-4 text-primary mx-auto mb-1" />
                <span className="font-mono text-lg font-black text-foreground">{hoursPerDay}h</span>
                <span className="block text-xs uppercase font-bold text-muted-foreground">Daily Playtime</span>
              </div>
            </div>

            {/* Copy & Reset actions */}
            <div className="mt-6 pt-4 border-t border-border flex flex-wrap items-center gap-3">
              <Button
                onClick={handleCopyPlan}
                className="bg-muted/50 hover:bg-muted/60 text-foreground text-xs font-bold"
              >
                {copied ? <Check className="h-3.5 w-3.5 mr-1 text-primary" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                <span>{copied ? "Investment Plan Copied!" : "Copy Investment Plan"}</span>
              </Button>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset Inputs
              </button>
            </div>
          </div>

          {/* Best ROI comparison */}
          <div className="card-surface p-6 rounded-3xl border border-border">
            <h3 className="font-display text-base font-bold uppercase tracking-wider text-foreground mb-1 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#C9A86A]" /> Best ROI at Your Settings
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              All businesses ranked by 30-day ROI with {upgrade.name} upgrades at {hoursPerDay}h/day.
            </p>
            <div className="space-y-2.5">
              {comparison.map((c, rank) => {
                const isBest = rank === 0;
                const isSelected = c.idx === businessIdx;
                return (
                  <div
                    key={c.name}
                    className={cn(
                      "rounded-2xl border p-3.5 flex items-center justify-between gap-3",
                      isBest
                        ? "border-[#C9A86A] bg-[#C9A86A]/10"
                        : "border-border bg-muted/60"
                    )}
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-display text-sm font-bold text-foreground">{c.name}</h4>
                        {isBest && (
                          <span className="rounded-full bg-[#C9A86A]/20 border border-[#C9A86A]/50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#C9A86A]">
                            Best ROI
                          </span>
                        )}
                        {isSelected && !isBest && (
                          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        ~{c.breakEven.toFixed(1)} days to break-even &bull; {money(c.daily)}/day est.
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-sm text-foreground">{c.roi30.toFixed(1)}%</span>
                      <span className="block text-[10px] uppercase font-black text-muted-foreground">30-Day ROI</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="card-surface p-6 rounded-3xl border border-border">
            <h3 className="font-display text-base font-bold uppercase tracking-wider text-foreground mb-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-[#C9A86A]" /> Estimate Disclaimer
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              All purchase prices, daily incomes, and upgrade effects are <strong>estimates</strong> based on
              GTA Online business patterns. The actual GTA 6 economy is <strong>unconfirmed</strong> and may
              differ significantly at launch — treat these numbers as a planning aid, not a guarantee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
