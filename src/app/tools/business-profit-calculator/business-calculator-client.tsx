"use client";

import { useState, useMemo } from "react";
import {
  Building2,
  TrendingUp,
  Copy,
  Check,
  Sparkles,
  Clock,
  Layers,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { businessScenario } from "@/lib/calculators";

interface BusinessConfig {
  name: string;
  purchasePrice: number;
  upgradeCost: number;
  grossRevenuePerHour: number;
  operatingCostPerHour: number;
  hoursPerDay: number;
}

const BUSINESS_PRESETS: BusinessConfig[] = [
  {
    name: "Illustrative business scenario 1",
    purchasePrice: 2200000,
    upgradeCost: 650000,
    grossRevenuePerHour: 24000,
    operatingCostPerHour: 5500,
    hoursPerDay: 3,
  },
  {
    name: "Illustrative business scenario 2",
    purchasePrice: 850000,
    upgradeCost: 320000,
    grossRevenuePerHour: 18000,
    operatingCostPerHour: 6000,
    hoursPerDay: 3,
  },
  {
    name: "Illustrative business scenario 3",
    purchasePrice: 1450000,
    upgradeCost: 450000,
    grossRevenuePerHour: 22000,
    operatingCostPerHour: 7000,
    hoursPerDay: 3,
  },
  {
    name: "Illustrative business scenario 4",
    purchasePrice: 980000,
    upgradeCost: 280000,
    grossRevenuePerHour: 12500,
    operatingCostPerHour: 4000,
    hoursPerDay: 3,
  },
];

export function BusinessCalculatorClient() {
  const [bizA, setBizA] = useState<BusinessConfig>(BUSINESS_PRESETS[0]);
  const [bizB, setBizB] = useState<BusinessConfig>(BUSINESS_PRESETS[1]);
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  // Compute metrics for a business
  const computeMetrics = businessScenario;

  const metricsA = useMemo(() => computeMetrics(bizA), [bizA]);
  const metricsB = useMemo(() => computeMetrics(bizB), [bizB]);

  const handleApplyPresetA = (p: BusinessConfig) => {
    setBizA({ ...p });
  };

  const handleCopy = () => {
    const text = `Illustrative business scenario - not verified GTA VI economy data: ${bizA.name}
Total Investment: $${metricsA.totalInvestment.toLocaleString()}
Net Profit / Hr: $${metricsA.netProfitPerHour.toLocaleString()}
Net Profit / Day: $${metricsA.netProfitPerDay.toLocaleString()} (playing ${bizA.hoursPerDay}h/day)
Break-Even Horizon: ~${metricsA.breakEvenHours} playing hours (~${metricsA.breakEvenDays} calendar days)
Estimated Annualized ROI: ${metricsA.annualRoiPct === null ? "Not defined" : metricsA.annualRoiPct + "%"}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Mode Switcher */}
      <div className="card-surface p-4 rounded-2xl border border-border flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-2 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-800 dark:text-gold-light" />{" "}
            Presets:
          </span>
          {BUSINESS_PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => handleApplyPresetA(p)}
              className={cn(
                "rounded-xl px-3 py-1.5 min-h-[44px] text-xs font-semibold transition-all border",
                bizA.name === p.name
                  ? "border-accent bg-accent/20 text-foreground font-bold shadow-sm"
                  : "border-border bg-muted/60 text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              {p.name.split(" ")[0]} {p.name.split(" ")[1]}
            </button>
          ))}
        </div>

        <button
          onClick={() => setCompareMode((prev) => !prev)}
          className={cn(
            "rounded-xl px-3.5 py-1.5 min-h-[44px] text-xs font-bold transition-all border",
            compareMode
              ? "border-cyan-500 dark:border-[#00F0FF] bg-cyan-500 dark:bg-[#00F0FF]/20 text-cyan-700 dark:text-[#00F0FF]"
              : "border-border bg-muted/40 text-muted-foreground hover:text-foreground",
          )}
        >
          <Layers className="h-3.5 w-3.5 inline mr-1.5" />
          <span>
            {compareMode ? "Duel Comparison Active" : "Compare 2 Businesses"}
          </span>
        </button>
      </div>

      {/* Main Grid: Single or Side-by-Side */}
      <div
        className={cn(
          "grid gap-8 items-start",
          compareMode
            ? "grid-cols-1 lg:grid-cols-2"
            : "grid-cols-1 lg:grid-cols-12",
        )}
      >
        {/* BUSINESS A */}
        <div
          className={cn(
            "space-y-6",
            !compareMode &&
              "lg:col-span-12 grid lg:grid-cols-12 gap-8 items-start space-y-0",
          )}
        >
          {/* Inputs */}
          <div
            className={cn(
              "card-surface p-6 rounded-3xl border border-border shadow-xl space-y-4",
              !compareMode && "lg:col-span-5",
            )}
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-display text-base font-black uppercase text-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4 text-accent" /> {bizA.name}
              </h3>
            </div>

            {/* Purchase Price */}
            <div>
              <label
                htmlFor="business-input-1"
                className="block text-xs font-bold text-muted-foreground mb-1 flex justify-between"
              >
                <span>Property Purchase Price ($)</span>
                <span className="font-mono text-cyan-700 dark:text-[#00F0FF] font-bold">
                  ${bizA.purchasePrice.toLocaleString()}
                </span>
              </label>
              <input
                id="business-input-1"
                type="number"
                step={50000}
                value={bizA.purchasePrice}
                onChange={(e) =>
                  setBizA({ ...bizA, purchasePrice: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-border bg-muted/70 p-2.5 text-xs font-mono text-foreground focus:border-accent focus:outline-none"
              />
            </div>

            {/* Upgrade Cost */}
            <div>
              <label
                htmlFor="business-input-2"
                className="block text-xs font-bold text-muted-foreground mb-1 flex justify-between"
              >
                <span>Renovation & Security Upgrades ($)</span>
                <span className="font-mono text-amber-800 dark:text-gold-light font-bold">
                  ${bizA.upgradeCost.toLocaleString()}
                </span>
              </label>
              <input
                id="business-input-2"
                type="number"
                step={25000}
                value={bizA.upgradeCost}
                onChange={(e) =>
                  setBizA({ ...bizA, upgradeCost: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-border bg-muted/70 p-2.5 text-xs font-mono text-foreground focus:border-accent focus:outline-none"
              />
            </div>

            {/* Gross Revenue */}
            <div>
              <label
                htmlFor="business-input-3"
                className="block text-xs font-bold text-muted-foreground mb-1 flex justify-between"
              >
                <span>Gross Revenue / Hour ($)</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                  ${bizA.grossRevenuePerHour.toLocaleString()}
                </span>
              </label>
              <input
                id="business-input-3"
                type="number"
                step={1000}
                value={bizA.grossRevenuePerHour}
                onChange={(e) =>
                  setBizA({
                    ...bizA,
                    grossRevenuePerHour: Number(e.target.value),
                  })
                }
                className="w-full rounded-xl border border-border bg-muted/70 p-2.5 text-xs font-mono text-foreground focus:border-accent focus:outline-none"
              />
            </div>

            {/* Operating Cost */}
            <div>
              <label
                htmlFor="business-input-4"
                className="block text-xs font-bold text-muted-foreground mb-1 flex justify-between"
              >
                <span>Staff Wages & Supplies / Hour ($)</span>
                <span className="font-mono text-rose-700 dark:text-rose-400 font-bold">
                  ${bizA.operatingCostPerHour.toLocaleString()}
                </span>
              </label>
              <input
                id="business-input-4"
                type="number"
                step={500}
                value={bizA.operatingCostPerHour}
                onChange={(e) =>
                  setBizA({
                    ...bizA,
                    operatingCostPerHour: Number(e.target.value),
                  })
                }
                className="w-full rounded-xl border border-border bg-muted/70 p-2.5 text-xs font-mono text-foreground focus:border-accent focus:outline-none"
              />
            </div>

            {/* Hours per day */}
            <div>
              <label
                htmlFor="business-input-5"
                className="block text-xs font-bold text-muted-foreground mb-1 flex justify-between"
              >
                <span>Session Playtime: {bizA.hoursPerDay} hrs/day</span>
              </label>
              <input
                id="business-input-5"
                type="range"
                min={0}
                max={10}
                step={0.5}
                value={bizA.hoursPerDay}
                onChange={(e) =>
                  setBizA({ ...bizA, hoursPerDay: Number(e.target.value) })
                }
                className="w-full accent-gold py-3"
              />
            </div>
          </div>

          {/* Results Display */}
          <div
            className={cn(
              "card-surface p-6 rounded-3xl border border-border shadow-2xl space-y-6 bg-gradient-to-br from-card to-primary/5 dark:from-[#070b15] dark:to-[#040810]",
              !compareMode && "lg:col-span-7",
            )}
          >
            <div>
              <span className="text-xs uppercase font-bold text-muted-foreground">
                Total Upfront Capital Required
              </span>
              <div className="font-display text-3xl font-black text-foreground mt-1">
                ${metricsA.totalInvestment.toLocaleString()}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-border bg-muted/60 p-3.5 text-center">
                <span className="block text-xs uppercase font-bold text-muted-foreground">
                  Net Profit / Hr
                </span>
                <span className="font-mono text-lg font-black text-emerald-700 dark:text-emerald-400">
                  {metricsA.netProfitPerHour < 0 ? "−" : "+"}$
                  {Math.abs(metricsA.netProfitPerHour).toLocaleString()}
                </span>
              </div>
              <div className="rounded-2xl border border-border bg-muted/60 p-3.5 text-center">
                <span className="block text-xs uppercase font-bold text-muted-foreground">
                  Daily Cash Take
                </span>
                <span className="font-mono text-lg font-black text-foreground">
                  {metricsA.netProfitPerDay < 0 ? "−" : "+"}$
                  {Math.abs(metricsA.netProfitPerDay).toLocaleString()}
                </span>
              </div>
              <div className="rounded-2xl border border-border bg-muted/60 p-3.5 text-center">
                <span className="block text-xs uppercase font-bold text-muted-foreground">
                  Weekly Payout
                </span>
                <span className="font-mono text-lg font-black text-purple-700 dark:text-purple-300">
                  {metricsA.netProfitPerWeek < 0 ? "−" : "+"}$
                  {Math.abs(metricsA.netProfitPerWeek).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-2xl border border-gold/30 bg-gold/10 p-3.5 text-center">
                <Clock className="h-4 w-4 text-amber-800 dark:text-gold-light mx-auto mb-1" />
                <span className="font-mono text-lg font-black text-amber-800 dark:text-amber-300">
                  {metricsA.breakEvenHours}
                </span>
                <span className="block text-xs uppercase font-bold text-muted-foreground">
                  Break-Even ({metricsA.breakEvenDays} days)
                </span>
              </div>
              <div className="rounded-2xl border border-cyan-500 dark:border-[#00F0FF]/30 bg-cyan-500 dark:bg-[#00F0FF]/10 p-3.5 text-center">
                <TrendingUp className="h-4 w-4 text-cyan-700 dark:text-[#00F0FF] mx-auto mb-1" />
                <span className="font-mono text-lg font-black text-cyan-700 dark:text-[#00F0FF]">
                  {metricsA.annualRoiPct === null
                    ? "Not defined"
                    : metricsA.annualRoiPct + "%"}
                </span>
                <span className="block text-xs uppercase font-bold text-muted-foreground">
                  Annual Return Rate
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <Button
                onClick={handleCopy}
                className="bg-muted/50 hover:bg-muted/60 text-foreground text-xs font-bold"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 mr-1 text-emerald-700 dark:text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5 mr-1" />
                )}
                <span>{copied ? "Copied!" : "Copy Cashflow Breakdown"}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* BUSINESS B (When compareMode is ON) */}
        {compareMode && (
          <div className="space-y-6">
            {/* Inputs B */}
            <div className="card-surface p-6 rounded-3xl border border-border shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-display text-base font-black uppercase text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-cyan-700 dark:text-[#00F0FF]" />{" "}
                  {bizB.name}
                </h3>
              </div>

              <div>
                <label
                  htmlFor="business-input-6"
                  className="block text-xs font-bold text-muted-foreground mb-1 flex justify-between"
                >
                  <span>Purchase Price ($)</span>
                  <span className="font-mono text-cyan-700 dark:text-[#00F0FF] font-bold">
                    ${bizB.purchasePrice.toLocaleString()}
                  </span>
                </label>
                <input
                  id="business-input-6"
                  type="number"
                  step={50000}
                  value={bizB.purchasePrice}
                  onChange={(e) =>
                    setBizB({ ...bizB, purchasePrice: Number(e.target.value) })
                  }
                  className="w-full rounded-xl border border-border bg-muted/70 p-2.5 text-xs font-mono text-foreground focus:border-cyan-500 dark:border-[#00F0FF] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="business-input-7"
                  className="block text-xs font-bold text-muted-foreground mb-1 flex justify-between"
                >
                  <span>Upgrades ($)</span>
                  <span className="font-mono text-amber-800 dark:text-gold-light font-bold">
                    ${bizB.upgradeCost.toLocaleString()}
                  </span>
                </label>
                <input
                  id="business-input-7"
                  type="number"
                  step={25000}
                  value={bizB.upgradeCost}
                  onChange={(e) =>
                    setBizB({ ...bizB, upgradeCost: Number(e.target.value) })
                  }
                  className="w-full rounded-xl border border-border bg-muted/70 p-2.5 text-xs font-mono text-foreground focus:border-cyan-500 dark:border-[#00F0FF] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="business-input-8"
                  className="block text-xs font-bold text-muted-foreground mb-1 flex justify-between"
                >
                  <span>Gross Revenue / Hr ($)</span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                    ${bizB.grossRevenuePerHour.toLocaleString()}
                  </span>
                </label>
                <input
                  id="business-input-8"
                  type="number"
                  step={1000}
                  value={bizB.grossRevenuePerHour}
                  onChange={(e) =>
                    setBizB({
                      ...bizB,
                      grossRevenuePerHour: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-xl border border-border bg-muted/70 p-2.5 text-xs font-mono text-foreground focus:border-cyan-500 dark:border-[#00F0FF] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="business-input-9"
                  className="block text-xs font-bold text-muted-foreground mb-1 flex justify-between"
                >
                  <span>Operating Cost / Hr ($)</span>
                  <span className="font-mono text-rose-700 dark:text-rose-400 font-bold">
                    ${bizB.operatingCostPerHour.toLocaleString()}
                  </span>
                </label>
                <input
                  id="business-input-9"
                  type="number"
                  step={500}
                  value={bizB.operatingCostPerHour}
                  onChange={(e) =>
                    setBizB({
                      ...bizB,
                      operatingCostPerHour: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-xl border border-border bg-muted/70 p-2.5 text-xs font-mono text-foreground focus:border-cyan-500 dark:border-[#00F0FF] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="business-input-10"
                  className="block text-xs font-bold text-muted-foreground mb-1 flex justify-between"
                >
                  <span>Playtime: {bizB.hoursPerDay} hrs/day</span>
                </label>
                <input
                  id="business-input-10"
                  type="range"
                  min={0}
                  max={10}
                  step={0.5}
                  value={bizB.hoursPerDay}
                  onChange={(e) =>
                    setBizB({ ...bizB, hoursPerDay: Number(e.target.value) })
                  }
                  className="w-full accent-[#00F0FF] py-3"
                />
              </div>
            </div>

            {/* Results Display B */}
            <div className="card-surface p-6 rounded-3xl border border-border shadow-2xl space-y-6 bg-gradient-to-br from-card to-primary/5 dark:from-[#070b15] dark:to-[#040810]">
              <div>
                <span className="text-xs uppercase font-bold text-muted-foreground">
                  Total Upfront Capital Required
                </span>
                <div className="font-display text-3xl font-black text-foreground mt-1">
                  ${metricsB.totalInvestment.toLocaleString()}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-border bg-muted/60 p-3.5 text-center">
                  <span className="block text-xs uppercase font-bold text-muted-foreground">
                    Net Profit / Hr
                  </span>
                  <span className="font-mono text-lg font-black text-emerald-700 dark:text-emerald-400">
                    {metricsB.netProfitPerHour < 0 ? "−" : "+"}$
                    {Math.abs(metricsB.netProfitPerHour).toLocaleString()}
                  </span>
                </div>
                <div className="rounded-2xl border border-border bg-muted/60 p-3.5 text-center">
                  <span className="block text-xs uppercase font-bold text-muted-foreground">
                    Daily Cash Take
                  </span>
                  <span className="font-mono text-lg font-black text-foreground">
                    {metricsB.netProfitPerDay < 0 ? "−" : "+"}$
                    {Math.abs(metricsB.netProfitPerDay).toLocaleString()}
                  </span>
                </div>
                <div className="rounded-2xl border border-border bg-muted/60 p-3.5 text-center">
                  <span className="block text-xs uppercase font-bold text-muted-foreground">
                    Weekly Payout
                  </span>
                  <span className="font-mono text-lg font-black text-purple-700 dark:text-purple-300">
                    {metricsB.netProfitPerWeek < 0 ? "−" : "+"}$
                    {Math.abs(metricsB.netProfitPerWeek).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-2xl border border-gold/30 bg-gold/10 p-3.5 text-center">
                  <Clock className="h-4 w-4 text-amber-800 dark:text-gold-light mx-auto mb-1" />
                  <span className="font-mono text-lg font-black text-amber-800 dark:text-amber-300">
                    {metricsB.breakEvenHours}
                  </span>
                  <span className="block text-xs uppercase font-bold text-muted-foreground">
                    Break-Even ({metricsB.breakEvenDays} days)
                  </span>
                </div>
                <div className="rounded-2xl border border-cyan-500 dark:border-[#00F0FF]/30 bg-cyan-500 dark:bg-[#00F0FF]/10 p-3.5 text-center">
                  <TrendingUp className="h-4 w-4 text-cyan-700 dark:text-[#00F0FF] mx-auto mb-1" />
                  <span className="font-mono text-lg font-black text-cyan-700 dark:text-[#00F0FF]">
                    {metricsB.annualRoiPct === null
                      ? "Not defined"
                      : metricsB.annualRoiPct + "%"}
                  </span>
                  <span className="block text-xs uppercase font-bold text-muted-foreground">
                    Annual Return Rate
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* VERIFIED ASSET NOTE */}
      <div className="card-surface p-6 rounded-3xl border border-border text-xs text-muted-foreground space-y-2">
        <h4 className="font-display text-sm font-bold text-foreground flex items-center gap-1.5">
          <Info className="h-4 w-4 text-cyan-700 dark:text-[#00F0FF]" />{" "}
          Scenario assumptions
        </h4>
        <p className="leading-relaxed text-muted-foreground">
          These are editable example inputs, not verified GTA VI businesses,
          prices or earnings. Operating time and costs affect the result. A
          loss-making scenario cannot recover a positive investment; it is shown
          as not reachable.
        </p>
      </div>
    </div>
  );
}
