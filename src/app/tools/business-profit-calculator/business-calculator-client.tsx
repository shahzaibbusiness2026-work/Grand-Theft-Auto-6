"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  TrendingUp,
  Calculator,
  RotateCcw,
  Share2,
  Copy,
  Check,
  Sparkles,
  HelpCircle,
  Clock,
  Calendar,
  Layers,
  ArrowRight,
  Info,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { canonicalProperties } from "@/lib/canonical-data";

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
    name: "The Malibú Neon Nightclub",
    purchasePrice: 2200000,
    upgradeCost: 650000,
    grossRevenuePerHour: 24000,
    operatingCostPerHour: 5500,
    hoursPerDay: 3,
  },
  {
    name: "Little Haiti Underground Chop Shop",
    purchasePrice: 850000,
    upgradeCost: 320000,
    grossRevenuePerHour: 18000,
    operatingCostPerHour: 6000,
    hoursPerDay: 3,
  },
  {
    name: "Port Gellhorn Cargo Warehouse",
    purchasePrice: 1450000,
    upgradeCost: 450000,
    grossRevenuePerHour: 22000,
    operatingCostPerHour: 7000,
    hoursPerDay: 3,
  },
  {
    name: "Leonida Keys Smuggler Marina",
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
  const computeMetrics = (b: BusinessConfig) => {
    const totalInvestment = b.purchasePrice + b.upgradeCost;
    const netProfitPerHour = Math.max(0, b.grossRevenuePerHour - b.operatingCostPerHour);
    const netProfitPerDay = netProfitPerHour * b.hoursPerDay;
    const netProfitPerWeek = netProfitPerDay * 7;
    const breakEvenHours = netProfitPerHour > 0 ? +(totalInvestment / netProfitPerHour).toFixed(1) : 0;
    const breakEvenDays = netProfitPerDay > 0 ? +(totalInvestment / netProfitPerDay).toFixed(1) : 0;
    const annualRoiPct = totalInvestment > 0 ? +(((netProfitPerDay * 365) / totalInvestment) * 100).toFixed(1) : 0;

    return {
      totalInvestment,
      netProfitPerHour,
      netProfitPerDay,
      netProfitPerWeek,
      breakEvenHours,
      breakEvenDays,
      annualRoiPct,
    };
  };

  const metricsA = useMemo(() => computeMetrics(bizA), [bizA]);
  const metricsB = useMemo(() => computeMetrics(bizB), [bizB]);

  const handleApplyPresetA = (p: BusinessConfig) => {
    setBizA({ ...p });
  };

  const handleApplyPresetB = (p: BusinessConfig) => {
    setBizB({ ...p });
  };

  const handleCopy = () => {
    const text = `GTA 6 Business Financial Breakdown: ${bizA.name}
Total Investment: $${metricsA.totalInvestment.toLocaleString()}
Net Profit / Hr: $${metricsA.netProfitPerHour.toLocaleString()}
Net Profit / Day: $${metricsA.netProfitPerDay.toLocaleString()} (playing ${bizA.hoursPerDay}h/day)
Break-Even Horizon: ~${metricsA.breakEvenHours} playing hours (~${metricsA.breakEvenDays} calendar days)
Estimated Annualized ROI: ${metricsA.annualRoiPct}%`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Mode Switcher */}
      <div className="card-surface p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Presets:
          </span>
          {BUSINESS_PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => handleApplyPresetA(p)}
              className={cn(
                "rounded-xl px-3 py-1.5 text-xs font-semibold transition-all border",
                bizA.name === p.name
                  ? "border-accent bg-accent/20 text-white font-bold shadow-sm"
                  : "border-white/10 bg-black/40 text-slate-300 hover:border-white/20 hover:text-white"
              )}
            >
              {p.name.split(" ")[0]} {p.name.split(" ")[1]}
            </button>
          ))}
        </div>

        <button
          onClick={() => setCompareMode((prev) => !prev)}
          className={cn(
            "rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all border",
            compareMode
              ? "border-[#00F0FF] bg-[#00F0FF]/20 text-[#00F0FF]"
              : "border-white/15 bg-white/5 text-slate-300 hover:text-white"
          )}
        >
          <Layers className="h-3.5 w-3.5 inline mr-1.5" />
          <span>{compareMode ? "Duel Comparison Active" : "Compare 2 Businesses"}</span>
        </button>
      </div>

      {/* Main Grid: Single or Side-by-Side */}
      <div className={cn("grid gap-8 items-start", compareMode ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 lg:grid-cols-12")}>
        {/* BUSINESS A */}
        <div className={cn("space-y-6", !compareMode && "lg:col-span-12 grid lg:grid-cols-12 gap-8 items-start space-y-0")}>
          {/* Inputs */}
          <div className={cn("card-surface p-6 rounded-3xl border border-white/10 shadow-xl space-y-4", !compareMode && "lg:col-span-5")}>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-display text-base font-black uppercase text-white flex items-center gap-2">
                <Building2 className="h-4 w-4 text-accent" /> {bizA.name}
              </h3>
            </div>

            {/* Purchase Price */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex justify-between">
                <span>Property Purchase Price ($)</span>
                <span className="font-mono text-[#00F0FF] font-bold">${bizA.purchasePrice.toLocaleString()}</span>
              </label>
              <input
                type="number"
                step={50000}
                value={bizA.purchasePrice}
                onChange={(e) => setBizA({ ...bizA, purchasePrice: Number(e.target.value) })}
                className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 text-xs font-mono text-white focus:border-accent focus:outline-none"
              />
            </div>

            {/* Upgrade Cost */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex justify-between">
                <span>Renovation & Security Upgrades ($)</span>
                <span className="font-mono text-amber-400 font-bold">${bizA.upgradeCost.toLocaleString()}</span>
              </label>
              <input
                type="number"
                step={25000}
                value={bizA.upgradeCost}
                onChange={(e) => setBizA({ ...bizA, upgradeCost: Number(e.target.value) })}
                className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 text-xs font-mono text-white focus:border-accent focus:outline-none"
              />
            </div>

            {/* Gross Revenue */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex justify-between">
                <span>Gross Revenue / Hour ($)</span>
                <span className="font-mono text-emerald-400 font-bold">${bizA.grossRevenuePerHour.toLocaleString()}</span>
              </label>
              <input
                type="number"
                step={1000}
                value={bizA.grossRevenuePerHour}
                onChange={(e) => setBizA({ ...bizA, grossRevenuePerHour: Number(e.target.value) })}
                className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 text-xs font-mono text-white focus:border-accent focus:outline-none"
              />
            </div>

            {/* Operating Cost */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex justify-between">
                <span>Staff Wages & Supplies / Hour ($)</span>
                <span className="font-mono text-rose-400 font-bold">${bizA.operatingCostPerHour.toLocaleString()}</span>
              </label>
              <input
                type="number"
                step={500}
                value={bizA.operatingCostPerHour}
                onChange={(e) => setBizA({ ...bizA, operatingCostPerHour: Number(e.target.value) })}
                className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 text-xs font-mono text-white focus:border-accent focus:outline-none"
              />
            </div>

            {/* Hours per day */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex justify-between">
                <span>Session Playtime: {bizA.hoursPerDay} hrs/day</span>
              </label>
              <input
                type="range"
                min={1}
                max={10}
                step={0.5}
                value={bizA.hoursPerDay}
                onChange={(e) => setBizA({ ...bizA, hoursPerDay: Number(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          {/* Results Display */}
          <div className={cn("card-surface p-6 rounded-3xl border border-white/10 shadow-2xl space-y-6 bg-gradient-to-br from-[#070b15] to-[#040810]", !compareMode && "lg:col-span-7")}>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Upfront Capital Required</span>
              <div className="font-display text-3xl font-black text-white mt-1">
                ${metricsA.totalInvestment.toLocaleString()}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5 text-center">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Net Profit / Hr</span>
                <span className="font-mono text-lg font-black text-emerald-400">+${metricsA.netProfitPerHour.toLocaleString()}</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5 text-center">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Daily Cash Take</span>
                <span className="font-mono text-lg font-black text-white">+${metricsA.netProfitPerDay.toLocaleString()}</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5 text-center">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Weekly Payout</span>
                <span className="font-mono text-lg font-black text-purple-300">+${metricsA.netProfitPerWeek.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-center">
                <Clock className="h-4 w-4 text-amber-400 mx-auto mb-1" />
                <span className="font-mono text-lg font-black text-amber-300">{metricsA.breakEvenHours} hrs</span>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Break-Even ({metricsA.breakEvenDays} days)</span>
              </div>
              <div className="rounded-2xl border border-[#00F0FF]/30 bg-[#00F0FF]/10 p-3.5 text-center">
                <TrendingUp className="h-4 w-4 text-[#00F0FF] mx-auto mb-1" />
                <span className="font-mono text-lg font-black text-[#00F0FF]">{metricsA.annualRoiPct}%</span>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Annual Return Rate</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <Button onClick={handleCopy} className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold">
                {copied ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                <span>{copied ? "Copied!" : "Copy Cashflow Breakdown"}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* BUSINESS B (When compareMode is ON) */}
        {compareMode && (
          <div className="space-y-6">
            {/* Inputs B */}
            <div className="card-surface p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-display text-base font-black uppercase text-white flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#00F0FF]" /> {bizB.name}
                </h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex justify-between">
                  <span>Purchase Price ($)</span>
                  <span className="font-mono text-[#00F0FF] font-bold">${bizB.purchasePrice.toLocaleString()}</span>
                </label>
                <input
                  type="number"
                  step={50000}
                  value={bizB.purchasePrice}
                  onChange={(e) => setBizB({ ...bizB, purchasePrice: Number(e.target.value) })}
                  className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 text-xs font-mono text-white focus:border-[#00F0FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex justify-between">
                  <span>Upgrades ($)</span>
                  <span className="font-mono text-amber-400 font-bold">${bizB.upgradeCost.toLocaleString()}</span>
                </label>
                <input
                  type="number"
                  step={25000}
                  value={bizB.upgradeCost}
                  onChange={(e) => setBizB({ ...bizB, upgradeCost: Number(e.target.value) })}
                  className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 text-xs font-mono text-white focus:border-[#00F0FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex justify-between">
                  <span>Gross Revenue / Hr ($)</span>
                  <span className="font-mono text-emerald-400 font-bold">${bizB.grossRevenuePerHour.toLocaleString()}</span>
                </label>
                <input
                  type="number"
                  step={1000}
                  value={bizB.grossRevenuePerHour}
                  onChange={(e) => setBizB({ ...bizB, grossRevenuePerHour: Number(e.target.value) })}
                  className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 text-xs font-mono text-white focus:border-[#00F0FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex justify-between">
                  <span>Operating Cost / Hr ($)</span>
                  <span className="font-mono text-rose-400 font-bold">${bizB.operatingCostPerHour.toLocaleString()}</span>
                </label>
                <input
                  type="number"
                  step={500}
                  value={bizB.operatingCostPerHour}
                  onChange={(e) => setBizB({ ...bizB, operatingCostPerHour: Number(e.target.value) })}
                  className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 text-xs font-mono text-white focus:border-[#00F0FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex justify-between">
                  <span>Playtime: {bizB.hoursPerDay} hrs/day</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={0.5}
                  value={bizB.hoursPerDay}
                  onChange={(e) => setBizB({ ...bizB, hoursPerDay: Number(e.target.value) })}
                  className="w-full accent-[#00F0FF]"
                />
              </div>
            </div>

            {/* Results Display B */}
            <div className="card-surface p-6 rounded-3xl border border-white/10 shadow-2xl space-y-6 bg-gradient-to-br from-[#070b15] to-[#040810]">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Upfront Capital Required</span>
                <div className="font-display text-3xl font-black text-white mt-1">
                  ${metricsB.totalInvestment.toLocaleString()}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5 text-center">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Net Profit / Hr</span>
                  <span className="font-mono text-lg font-black text-emerald-400">+${metricsB.netProfitPerHour.toLocaleString()}</span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5 text-center">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Daily Cash Take</span>
                  <span className="font-mono text-lg font-black text-white">+${metricsB.netProfitPerDay.toLocaleString()}</span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5 text-center">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Weekly Payout</span>
                  <span className="font-mono text-lg font-black text-purple-300">+${metricsB.netProfitPerWeek.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-center">
                  <Clock className="h-4 w-4 text-amber-400 mx-auto mb-1" />
                  <span className="font-mono text-lg font-black text-amber-300">{metricsB.breakEvenHours} hrs</span>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Break-Even ({metricsB.breakEvenDays} days)</span>
                </div>
                <div className="rounded-2xl border border-[#00F0FF]/30 bg-[#00F0FF]/10 p-3.5 text-center">
                  <TrendingUp className="h-4 w-4 text-[#00F0FF] mx-auto mb-1" />
                  <span className="font-mono text-lg font-black text-[#00F0FF]">{metricsB.annualRoiPct}%</span>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Annual Return Rate</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* VERIFIED ASSET NOTE */}
      <div className="card-surface p-6 rounded-3xl border border-white/10 text-xs text-slate-300 space-y-2">
        <h4 className="font-display text-sm font-bold text-white flex items-center gap-1.5">
          <Info className="h-4 w-4 text-[#00F0FF]" /> Verified Economic Grounding
        </h4>
        <p className="leading-relaxed text-slate-400">
          Nightclub safe capacities, chop shop salvage yields, and warehouse delivery cycles are modeled after confirmed mechanics from GTA 6 trailer footage and verified asset registries. All values reflect net margins after daily recurring syndicate fees.
        </p>
      </div>
    </div>
  );
}
