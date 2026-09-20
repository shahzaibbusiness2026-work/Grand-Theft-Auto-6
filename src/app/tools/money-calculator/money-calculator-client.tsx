"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  Calculator,
  RotateCcw,
  Share2,
  Copy,
  Check,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Calendar,
  Clock,
  Briefcase,
  ArrowRight,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { canonicalMoneyMethods } from "@/lib/canonical-data";

export function MoneyCalculatorClient() {
  const [currentMoney, setCurrentMoney] = useState<number>(50000);
  const [targetMoney, setTargetMoney] = useState<number>(2850000); // e.g. Grotti Visione price
  const [incomePerMission, setIncomePerMission] = useState<number>(35000);
  const [incomePerHour, setIncomePerHour] = useState<number>(120000);
  const [hoursPerDay, setHoursPerDay] = useState<number>(2.5);
  const [copied, setCopied] = useState(false);

  // Target presets
  const PRESETS = [
    { label: "Bravado Banshee ($1.25M)", target: 1250000 },
    { label: "Grotti Visione ($2.85M)", target: 2850000 },
    { label: "Biscayne Sky Penthouse ($3.5M)", target: 3500000 },
    { label: "The Malibú Nightclub ($2.2M)", target: 2200000 },
    { label: "Starter Weapons & Tuning ($150K)", target: 150000 },
  ];

  // Mathematical Calculations
  const calculations = useMemo(() => {
    const remaining = Math.max(0, targetMoney - currentMoney);
    const missionsNeeded = incomePerMission > 0 ? Math.ceil(remaining / incomePerMission) : 0;
    const hoursNeeded = incomePerHour > 0 ? +(remaining / incomePerHour).toFixed(1) : 0;
    const daysNeeded = hoursPerDay > 0 && hoursNeeded > 0 ? +(hoursNeeded / hoursPerDay).toFixed(1) : 0;

    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + Math.ceil(daysNeeded));

    return {
      remaining,
      missionsNeeded,
      hoursNeeded,
      daysNeeded,
      completionDateStr: completionDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      progressPct: Math.min(100, Math.round((currentMoney / Math.max(1, targetMoney)) * 100)),
    };
  }, [currentMoney, targetMoney, incomePerMission, incomePerHour, hoursPerDay]);

  const handleReset = () => {
    setCurrentMoney(0);
    setTargetMoney(1000000);
    setIncomePerMission(25000);
    setIncomePerHour(90000);
    setHoursPerDay(2);
  };

  const handleCopySummary = () => {
    const summary = `GTA 6 Money Target: $${targetMoney.toLocaleString()}
Current Cash: $${currentMoney.toLocaleString()}
Gap Remaining: $${calculations.remaining.toLocaleString()} (${calculations.progressPct}% achieved)
Missions Required: ~${calculations.missionsNeeded}
Hours Required: ~${calculations.hoursNeeded}h
Estimated Goal Date: ${calculations.completionDateStr} (playing ${hoursPerDay}h/day)`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10">
      {/* Top Presets Bar */}
      <div className="card-surface p-4 rounded-2xl border border-white/10 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Quick Goal Presets:
        </span>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => setTargetMoney(p.target)}
            className={cn(
              "rounded-xl px-3 py-1.5 text-xs font-semibold transition-all border",
              targetMoney === p.target
                ? "border-accent bg-accent/20 text-white font-bold shadow-sm"
                : "border-white/10 bg-black/40 text-slate-300 hover:border-white/20 hover:text-white"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main Calculator Grid */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* INPUTS COLUMN (5 cols) */}
        <div className="lg:col-span-5 card-surface p-6 rounded-3xl border border-white/10 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="font-display text-base font-black uppercase text-white flex items-center gap-2">
              <Calculator className="h-4 w-4 text-accent" /> Financial Parameters
            </h2>
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>

          {/* Current Money */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex justify-between">
              <span>Current Bankroll / Cash ($)</span>
              <span className="font-mono text-emerald-400 font-bold">${currentMoney.toLocaleString()}</span>
            </label>
            <input
              type="number"
              min={0}
              step={5000}
              value={currentMoney}
              onChange={(e) => setCurrentMoney(Math.max(0, Number(e.target.value)))}
              className="w-full rounded-xl border border-white/10 bg-black/50 p-3 text-sm font-mono text-white focus:border-accent focus:outline-none"
            />
          </div>

          {/* Target Money */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex justify-between">
              <span>Target Asset Goal ($)</span>
              <span className="font-mono text-[#00F0FF] font-bold">${targetMoney.toLocaleString()}</span>
            </label>
            <input
              type="number"
              min={1000}
              step={10000}
              value={targetMoney}
              onChange={(e) => setTargetMoney(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-xl border border-white/10 bg-black/50 p-3 text-sm font-mono text-white focus:border-accent focus:outline-none"
            />
          </div>

          {/* Income Per Mission */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex justify-between">
              <span>Average Income Per Mission / Heist Cut ($)</span>
              <span className="font-mono text-amber-400 font-bold">${incomePerMission.toLocaleString()}</span>
            </label>
            <input
              type="number"
              min={1000}
              step={5000}
              value={incomePerMission}
              onChange={(e) => setIncomePerMission(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-xl border border-white/10 bg-black/50 p-3 text-sm font-mono text-white focus:border-accent focus:outline-none"
            />
          </div>

          {/* Income Per Hour */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex justify-between">
              <span>Estimated Hourly Grind Rate ($/hr)</span>
              <span className="font-mono text-purple-400 font-bold">${incomePerHour.toLocaleString()} / hr</span>
            </label>
            <input
              type="number"
              min={1000}
              step={10000}
              value={incomePerHour}
              onChange={(e) => setIncomePerHour(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-xl border border-white/10 bg-black/50 p-3 text-sm font-mono text-white focus:border-accent focus:outline-none"
            />
          </div>

          {/* Hours per day */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex justify-between">
              <span>Daily Playing Commitment (Hours/Day)</span>
              <span className="font-mono text-amber-400 font-bold">{hoursPerDay} hrs/day</span>
            </label>
            <input
              type="range"
              min={0.5}
              max={12}
              step={0.5}
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>30m Casual</span>
              <span>2.5h Regular</span>
              <span>6h Dedicated</span>
              <span>12h Hardcore</span>
            </div>
          </div>
        </div>

        {/* OUTPUTS / STATS (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Progress Card */}
          <div className="card-surface p-6 rounded-3xl border border-white/10 shadow-2xl bg-gradient-to-br from-[#0e0717] via-[#070b15] to-[#040810]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Money Remaining</span>
                <div className="font-display text-3xl sm:text-4xl font-black text-white mt-0.5">
                  ${calculations.remaining.toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-2xl font-black text-[#00F0FF]">{calculations.progressPct}%</span>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Achieved</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-black/60 border border-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent via-purple-500 to-[#00F0FF] transition-all duration-500"
                style={{ width: `${calculations.progressPct}%` }}
              />
            </div>

            {/* 4 Output Metrics */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5 text-center">
                <Briefcase className="h-4 w-4 text-accent mx-auto mb-1" />
                <span className="font-mono text-lg font-black text-white">{calculations.missionsNeeded}</span>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Missions Needed</span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5 text-center">
                <Clock className="h-4 w-4 text-[#00F0FF] mx-auto mb-1" />
                <span className="font-mono text-lg font-black text-white">{calculations.hoursNeeded}h</span>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Hours Needed</span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5 text-center">
                <Calendar className="h-4 w-4 text-amber-400 mx-auto mb-1" />
                <span className="font-mono text-lg font-black text-white">{calculations.daysNeeded}</span>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Playing Days</span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5 text-center">
                <TrendingUp className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
                <span className="font-mono text-xs font-black text-emerald-300 block truncate">
                  {calculations.completionDateStr}
                </span>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Target Date</span>
              </div>
            </div>

            {/* Copy & Share actions */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <Button
                onClick={handleCopySummary}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
              >
                {copied ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                <span>{copied ? "Calculations Copied!" : "Copy Result Summary"}</span>
              </Button>

              <Link
                href="/tools/business-profit-calculator"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-white transition-colors"
              >
                <span>Calculate Business Passive ROI</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* RECOMMENDED METHODS FOR THIS GAP */}
          <div className="card-surface p-6 rounded-3xl border border-white/10">
            <h3 className="font-display text-base font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" /> Recommended Grind Paths
            </h3>
            <div className="space-y-2.5">
              {canonicalMoneyMethods.slice(0, 3).map((m) => (
                <div key={m.id} className="rounded-2xl border border-white/5 bg-black/40 p-3.5 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="font-display text-sm font-bold text-white">{m.title}</h4>
                    <p className="text-[11px] text-slate-400">{m.timeToPayout} &bull; Difficulty: {m.difficulty}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-400 text-xs">{m.moneyPerHourDisplay}</span>
                    <span className="block text-[9px] uppercase font-black text-slate-500">{m.confidence}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FORMULA EXPLANATION & FAQ */}
      <div className="grid gap-6 md:grid-cols-2 pt-6 border-t border-white/10">
        <div className="card-surface p-6 rounded-3xl border border-white/10 space-y-3">
          <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
            <Info className="h-4 w-4 text-[#00F0FF]" /> How the Formula Works
          </h3>
          <p className="text-xs leading-relaxed text-slate-300">
            The remaining cash needed is calculated via <code className="bg-black/60 px-1.5 py-0.5 rounded text-amber-400">Target - Current Cash</code>.
            Total grinding hours equal <code className="bg-black/60 px-1.5 py-0.5 rounded text-[#00F0FF]">Remaining / Hourly Earnings</code>.
            Real-world days needed equal <code className="bg-black/60 px-1.5 py-0.5 rounded text-amber-400">Hours Needed / Daily Playtime</code>.
          </p>
        </div>

        <div className="card-surface p-6 rounded-3xl border border-white/10 space-y-3">
          <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-accent" /> Money Calculator FAQ
          </h3>
          <p className="text-xs leading-relaxed text-slate-300">
            <strong>Are these payout values guaranteed?</strong> All payout figures are grounded in verified leak metadata and Rockstar gameplay trailers. Real release game economy may receive day-one balancing passes.
          </p>
        </div>
      </div>
    </div>
  );
}
