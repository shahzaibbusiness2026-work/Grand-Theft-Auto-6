"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calculator,
  RotateCcw,
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
import { savingsScenario } from "@/lib/calculators";

export function MoneyCalculatorClient() {
  const [currentMoney, setCurrentMoney] = useState<number>(50000);
  const [targetMoney, setTargetMoney] = useState<number>(2850000); // illustrative goal, not a GTA VI price
  const [incomePerMission, setIncomePerMission] = useState<number>(35000);
  const [incomePerHour, setIncomePerHour] = useState<number>(120000);
  const [hoursPerDay, setHoursPerDay] = useState<number>(2.5);
  const [copied, setCopied] = useState(false);

  // Target presets
  const PRESETS = [
    { label: "Example goal ($1.25M)", target: 1250000 },
    { label: "Example goal ($2.85M)", target: 2850000 },
    { label: "Example goal ($3.5M)", target: 3500000 },
    { label: "Example goal ($2.2M)", target: 2200000 },
    { label: "Example goal ($150K)", target: 150000 },
  ];

  // Mathematical Calculations
  const calculations = useMemo(
    () =>
      savingsScenario(
        currentMoney,
        targetMoney,
        incomePerMission,
        incomePerHour,
        hoursPerDay,
      ),
    [currentMoney, targetMoney, incomePerMission, incomePerHour, hoursPerDay],
  );

  const handleReset = () => {
    setCurrentMoney(0);
    setTargetMoney(1000000);
    setIncomePerMission(25000);
    setIncomePerHour(90000);
    setHoursPerDay(2);
  };

  const handleCopySummary = () => {
    const summary = `Illustrative savings scenario (not verified GTA VI economy data).
Goal: $${targetMoney.toLocaleString()}
Current Cash: $${currentMoney.toLocaleString()}
Gap Remaining: $${calculations.remaining.toLocaleString()} (${calculations.progressPct}% achieved)
Missions Required: ~${calculations.missionsNeeded}
Hours Required: ~${typeof calculations.hoursNeeded === "number" ? calculations.hoursNeeded + "h" : calculations.hoursNeeded}
Estimated Goal Date: ${calculations.completionDateStr} (playing ${hoursPerDay}h/day)`;

    navigator.clipboard.writeText(summary).catch(() => setCopied(false));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10">
      {/* Top Presets Bar */}
      <div className="card-surface p-4 rounded-2xl border border-border flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-2 flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 text-amber-800 dark:text-gold-light" />{" "}
          Quick Goal Presets:
        </span>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => setTargetMoney(p.target)}
            className={cn(
              "rounded-xl px-3 py-1.5 text-xs font-semibold transition-all border",
              targetMoney === p.target
                ? "border-accent bg-accent/20 text-foreground font-bold shadow-sm"
                : "border-border bg-muted/60 text-muted-foreground hover:border-border hover:text-foreground",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main Calculator Grid */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* INPUTS COLUMN (5 cols) */}
        <div className="lg:col-span-5 card-surface p-6 rounded-3xl border border-border shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h2 className="font-display text-base font-black uppercase text-foreground flex items-center gap-2">
              <Calculator className="h-4 w-4 text-accent" /> Financial
              Parameters
            </h2>
            <button
              onClick={handleReset}
              className="min-h-[44px] inline-flex items-center px-3 text-xs text-muted-foreground hover:text-foreground gap-1 transition-colors"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>

          {/* Current Money */}
          <div>
            <label
              htmlFor="savings-input-1"
              className="block text-xs font-bold text-muted-foreground mb-1.5 flex justify-between"
            >
              <span>Current Bankroll / Cash ($)</span>
              <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                ${currentMoney.toLocaleString()}
              </span>
            </label>
            <input
              id="savings-input-1"
              type="number"
              min={0}
              step={5000}
              value={currentMoney}
              onChange={(e) =>
                setCurrentMoney(Math.max(0, Number(e.target.value)))
              }
              className="w-full rounded-xl border border-border bg-muted/70 p-3 text-sm font-mono text-foreground focus:border-accent focus:outline-none"
            />
          </div>

          {/* Target Money */}
          <div>
            <label
              htmlFor="savings-input-2"
              className="block text-xs font-bold text-muted-foreground mb-1.5 flex justify-between"
            >
              <span>Target Asset Goal ($)</span>
              <span className="font-mono text-cyan-700 dark:text-[#00F0FF] font-bold">
                ${targetMoney.toLocaleString()}
              </span>
            </label>
            <input
              id="savings-input-2"
              type="number"
              min={0}
              step={10000}
              value={targetMoney}
              onChange={(e) =>
                setTargetMoney(Math.max(0, Number(e.target.value)))
              }
              className="w-full rounded-xl border border-border bg-muted/70 p-3 text-sm font-mono text-foreground focus:border-accent focus:outline-none"
            />
          </div>

          {/* Income Per Mission */}
          <div>
            <label
              htmlFor="savings-input-3"
              className="block text-xs font-bold text-muted-foreground mb-1.5 flex justify-between"
            >
              <span>Average Income Per Mission / Heist Cut ($)</span>
              <span className="font-mono text-amber-800 dark:text-gold-light font-bold">
                ${incomePerMission.toLocaleString()}
              </span>
            </label>
            <input
              id="savings-input-3"
              type="number"
              min={0}
              step={5000}
              value={incomePerMission}
              onChange={(e) =>
                setIncomePerMission(Math.max(0, Number(e.target.value)))
              }
              className="w-full rounded-xl border border-border bg-muted/70 p-3 text-sm font-mono text-foreground focus:border-accent focus:outline-none"
            />
          </div>

          {/* Income Per Hour */}
          <div>
            <label
              htmlFor="savings-input-4"
              className="block text-xs font-bold text-muted-foreground mb-1.5 flex justify-between"
            >
              <span>Estimated Hourly Grind Rate ($/hr)</span>
              <span className="font-mono text-purple-700 dark:text-purple-400 font-bold">
                ${incomePerHour.toLocaleString()} / hr
              </span>
            </label>
            <input
              id="savings-input-4"
              type="number"
              min={0}
              step={10000}
              value={incomePerHour}
              onChange={(e) =>
                setIncomePerHour(Math.max(0, Number(e.target.value)))
              }
              className="w-full rounded-xl border border-border bg-muted/70 p-3 text-sm font-mono text-foreground focus:border-accent focus:outline-none"
            />
          </div>

          {/* Hours per day */}
          <div>
            <label
              htmlFor="savings-input-5"
              className="block text-xs font-bold text-muted-foreground mb-1.5 flex justify-between"
            >
              <span>Daily Playing Commitment (Hours/Day)</span>
              <span className="font-mono text-amber-800 dark:text-gold-light font-bold">
                {hoursPerDay} hrs/day
              </span>
            </label>
            <input
              id="savings-input-5"
              type="range"
              min={0}
              max={12}
              step={0.5}
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number(e.target.value))}
              className="w-full accent-gold py-3"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1 font-mono">
              <span>0h Paused</span>
              <span>2.5h Regular</span>
              <span>6h Dedicated</span>
              <span>12h Hardcore</span>
            </div>
          </div>
        </div>

        {/* OUTPUTS / STATS (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Progress Card */}
          <div className="card-surface p-6 rounded-3xl border border-border shadow-2xl bg-gradient-to-br from-card via-card to-primary/5 dark:from-[#0e0717] dark:via-[#070b15] dark:to-[#040810]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-bold text-muted-foreground">
                  Total Money Remaining
                </span>
                <div className="font-display text-3xl sm:text-4xl font-black text-foreground mt-0.5">
                  ${calculations.remaining.toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-2xl font-black text-cyan-700 dark:text-[#00F0FF]">
                  {calculations.progressPct}%
                </span>
                <span className="block text-xs uppercase font-bold text-muted-foreground">
                  Achieved
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-muted/80 border border-border">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent via-purple-500 to-[#00F0FF] transition-all duration-500"
                style={{ width: `${calculations.progressPct}%` }}
              />
            </div>

            {/* 4 Output Metrics */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl border border-border bg-muted/60 p-3.5 text-center">
                <Briefcase className="h-4 w-4 text-accent mx-auto mb-1" />
                <span className="font-mono text-lg font-black text-foreground">
                  {calculations.missionsNeeded}
                </span>
                <span className="block text-xs uppercase font-bold text-muted-foreground">
                  Missions Needed
                </span>
              </div>

              <div className="rounded-2xl border border-border bg-muted/60 p-3.5 text-center">
                <Clock className="h-4 w-4 text-cyan-700 dark:text-[#00F0FF] mx-auto mb-1" />
                <span className="font-mono text-lg font-black text-foreground">
                  {typeof calculations.hoursNeeded === "number"
                    ? calculations.hoursNeeded + "h"
                    : calculations.hoursNeeded}
                </span>
                <span className="block text-xs uppercase font-bold text-muted-foreground">
                  Hours Needed
                </span>
              </div>

              <div className="rounded-2xl border border-border bg-muted/60 p-3.5 text-center">
                <Calendar className="h-4 w-4 text-amber-800 dark:text-gold-light mx-auto mb-1" />
                <span className="font-mono text-lg font-black text-foreground">
                  {calculations.daysNeeded}
                </span>
                <span className="block text-xs uppercase font-bold text-muted-foreground">
                  Playing Days
                </span>
              </div>

              <div className="rounded-2xl border border-border bg-muted/60 p-3.5 text-center">
                <TrendingUp className="h-4 w-4 text-emerald-700 dark:text-emerald-400 mx-auto mb-1" />
                <span className="font-mono text-xs font-black text-emerald-300 block truncate">
                  {calculations.completionDateStr}
                </span>
                <span className="block text-xs uppercase font-bold text-muted-foreground">
                  Target Date
                </span>
              </div>
            </div>

            {/* Copy & Share actions */}
            <div className="mt-6 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
              <Button
                onClick={handleCopySummary}
                className="bg-muted/50 hover:bg-muted/60 text-foreground text-xs font-bold"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 mr-1 text-emerald-700 dark:text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5 mr-1" />
                )}
                <span>
                  {copied ? "Calculations Copied!" : "Copy Result Summary"}
                </span>
              </Button>

              <Link
                href="/tools/business-profit-calculator"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-foreground transition-colors"
              >
                <span>Calculate Business Passive ROI</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FORMULA EXPLANATION & FAQ */}
      <div className="grid gap-6 md:grid-cols-2 pt-6 border-t border-border">
        <div className="card-surface p-6 rounded-3xl border border-border space-y-3">
          <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
            <Info className="h-4 w-4 text-cyan-700 dark:text-[#00F0FF]" /> How
            the Formula Works
          </h3>
          <p className="text-xs leading-relaxed text-muted-foreground">
            The remaining cash needed is calculated via{" "}
            <code className="bg-muted/80 px-1.5 py-0.5 rounded text-amber-800 dark:text-gold-light">
              Target - Current Cash
            </code>
            . Total grinding hours equal{" "}
            <code className="bg-muted/80 px-1.5 py-0.5 rounded text-cyan-700 dark:text-[#00F0FF]">
              Remaining / Hourly Earnings
            </code>
            . Real-world days needed equal{" "}
            <code className="bg-muted/80 px-1.5 py-0.5 rounded text-amber-800 dark:text-gold-light">
              Hours Needed / Daily Playtime
            </code>
            .
          </p>
        </div>

        <div className="card-surface p-6 rounded-3xl border border-border space-y-3">
          <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-accent" /> Money Calculator FAQ
          </h3>
          <p className="text-xs leading-relaxed text-muted-foreground">
            <strong>Are these payout values guaranteed?</strong> No. Every
            preset is an illustrative savings target. Income, prices and playing
            time are your assumptions, not verified GTA VI payouts or purchase
            prices. A zero earning rate cannot reach a higher goal.
          </p>
        </div>
      </div>
    </div>
  );
}
