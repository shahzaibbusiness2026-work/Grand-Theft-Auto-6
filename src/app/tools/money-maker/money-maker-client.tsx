"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  Clock,
  ShieldAlert,
  Users,
  User,
  Sparkles,
  Award,
  ChevronRight,
  Calculator,
  CheckCircle2,
  SlidersHorizontal,
  Flame,
  HelpCircle,
  Share2,
} from "lucide-react";
import { canonicalMoneyMethods, type CanonicalMoneyMethod } from "@/lib/canonical-data";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { cn } from "@/lib/utils";

export function MoneyMakerClient() {
  // Recommendation questionnaire state
  const [playstyle, setPlaystyle] = useState<"any" | "solo" | "coop">("any");
  const [capital, setCapital] = useState<"any" | "broke" | "mid" | "rich">("any");
  const [risk, setRisk] = useState<"any" | "Low" | "Medium" | "High">("any");
  const [selectedMethodId, setSelectedMethodId] = useState<string>(canonicalMoneyMethods[0].id);

  const filteredMethods = useMemo(() => {
    return canonicalMoneyMethods.filter((m) => {
      // Playstyle filter
      if (playstyle === "solo" && !m.soloFriendly) return false;
      if (playstyle === "coop" && !m.coopRecommended) return false;

      // Capital filter
      if (capital === "broke" && m.minInvestment > 50000) return false;
      if (capital === "mid" && m.minInvestment > 1000000) return false;

      // Risk filter
      if (risk !== "any" && m.riskTolerance !== risk) return false;

      return true;
    });
  }, [playstyle, capital, risk]);

  const activeMethod = useMemo(() => {
    return (
      canonicalMoneyMethods.find((m) => m.id === selectedMethodId) ||
      canonicalMoneyMethods[0]
    );
  }, [selectedMethodId]);

  const riskBadge = (level: string) => {
    switch (level) {
      case "Low":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
      case "Medium":
        return "text-amber-400 bg-amber-500/10 border-amber-500/30";
      case "High":
        return "text-rose-400 bg-rose-500/10 border-rose-500/30";
      default:
        return "text-slate-400 bg-slate-800 border-slate-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* Questionnaire Interactive Finder */}
      <div className="card-carbon p-6 md:p-8 border-primary/30 bg-gradient-to-br from-slate-900/95 via-slate-950 to-primary/5 space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-display text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
            Intelligent Method Recommender
          </h2>
        </div>
        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
          Select your current bankroll, preferred squad size, and risk appetite. The algorithm will filter and recommend the optimal grind route for maximum hourly return.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Question 1: Playstyle */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-accent" /> Squad Preference
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setPlaystyle("any")}
                className={cn(
                  "py-1.5 rounded-lg font-semibold transition-all",
                  playstyle === "any" ? "bg-primary text-white" : "text-slate-400 hover:text-white"
                )}
              >
                Any
              </button>
              <button
                onClick={() => setPlaystyle("solo")}
                className={cn(
                  "py-1.5 rounded-lg font-semibold transition-all",
                  playstyle === "solo" ? "bg-primary text-white" : "text-slate-400 hover:text-white"
                )}
              >
                Solo
              </button>
              <button
                onClick={() => setPlaystyle("coop")}
                className={cn(
                  "py-1.5 rounded-lg font-semibold transition-all",
                  playstyle === "coop" ? "bg-primary text-white" : "text-slate-400 hover:text-white"
                )}
              >
                Co-Op
              </button>
            </div>
          </div>

          {/* Question 2: Starting Capital */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-amber-400" /> Starting Bankroll
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setCapital("any")}
                className={cn(
                  "py-1.5 rounded-lg font-semibold transition-all",
                  capital === "any" ? "bg-primary text-white" : "text-slate-400 hover:text-white"
                )}
              >
                Any
              </button>
              <button
                onClick={() => setCapital("broke")}
                className={cn(
                  "py-1.5 rounded-lg font-semibold transition-all",
                  capital === "broke" ? "bg-primary text-white" : "text-slate-400 hover:text-white"
                )}
              >
                &lt;$50k
              </button>
              <button
                onClick={() => setCapital("mid")}
                className={cn(
                  "py-1.5 rounded-lg font-semibold transition-all",
                  capital === "mid" ? "bg-primary text-white" : "text-slate-400 hover:text-white"
                )}
              >
                &lt;$1M
              </button>
            </div>
          </div>

          {/* Question 3: Risk Tolerance */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-rose-400" /> Risk & Police Heat
            </label>
            <div className="grid grid-cols-4 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setRisk("any")}
                className={cn(
                  "py-1.5 rounded-lg font-semibold transition-all",
                  risk === "any" ? "bg-primary text-white" : "text-slate-400 hover:text-white"
                )}
              >
                Any
              </button>
              <button
                onClick={() => setRisk("Low")}
                className={cn(
                  "py-1.5 rounded-lg font-semibold transition-all",
                  risk === "Low" ? "bg-emerald-500/20 text-emerald-300" : "text-slate-400 hover:text-white"
                )}
              >
                Low
              </button>
              <button
                onClick={() => setRisk("Medium")}
                className={cn(
                  "py-1.5 rounded-lg font-semibold transition-all",
                  risk === "Medium" ? "bg-amber-500/20 text-amber-300" : "text-slate-400 hover:text-white"
                )}
              >
                Med
              </button>
              <button
                onClick={() => setRisk("High")}
                className={cn(
                  "py-1.5 rounded-lg font-semibold transition-all",
                  risk === "High" ? "bg-rose-500/20 text-rose-300" : "text-slate-400 hover:text-white"
                )}
              >
                High
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: List of Methods */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Methods Matrix ({filteredMethods.length})</span>
            <span className="text-primary font-mono">Ranked by Hourly Yield</span>
          </div>

          {filteredMethods.length === 0 ? (
            <div className="card-carbon p-8 text-center space-y-2">
              <HelpCircle className="h-8 w-8 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-400">No methods match these strict criteria.</p>
              <button
                onClick={() => {
                  setPlaystyle("any");
                  setCapital("any");
                  setRisk("any");
                }}
                className="btn-secondary text-xs px-3 py-1.5 mt-2"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            filteredMethods.map((m) => {
              const isSelected = m.id === activeMethod.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMethodId(m.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all duration-200 block",
                    isSelected
                      ? "border-primary bg-primary/15 shadow-[0_0_15px_rgba(244,63,94,0.25)]"
                      : "border-slate-800 bg-slate-900/70 hover:border-slate-700 hover:bg-slate-900"
                  )}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {m.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${riskBadge(
                        m.riskTolerance
                      )}`}
                    >
                      {m.riskTolerance} Risk
                    </span>
                  </div>

                  <h3 className="font-display text-sm font-bold text-white mb-1 line-clamp-1">
                    {m.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs font-mono pt-1">
                    <span className="text-emerald-400 font-bold">{m.moneyPerHourDisplay}</span>
                    <span className="text-slate-400">{m.timeToPayout}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Right Column: Detailed Strategy Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-carbon p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-primary/20 text-primary border border-primary/30">
                  {activeMethod.category}
                </span>
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${riskBadge(
                    activeMethod.riskTolerance
                  )}`}
                >
                  {activeMethod.riskTolerance} Risk
                </span>
                <ConfidenceBadge confidence={activeMethod.confidence} source={activeMethod.source} />
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-black text-white leading-tight">
                {activeMethod.title}
              </h1>

              <div className="text-xl sm:text-2xl font-display font-black text-emerald-400">
                {activeMethod.moneyPerHourDisplay}
              </div>
            </div>

            {/* Why Recommended Pill */}
            <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 text-xs text-accent-light leading-relaxed">
              <strong className="font-bold text-accent uppercase tracking-wider block mb-1">
                Strategic Advantage:
              </strong>
              {activeMethod.whyRecommended}
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Min Capital
                </span>
                <span className="text-xs font-bold text-amber-400 truncate block">
                  {activeMethod.minInvestmentDisplay}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Time Payout
                </span>
                <span className="text-xs font-bold text-slate-200 truncate block">
                  {activeMethod.timeToPayout}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Difficulty
                </span>
                <span className="text-xs font-bold text-white truncate block">
                  {activeMethod.difficulty}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Player Mode
                </span>
                <span className="text-xs font-bold text-accent truncate block">
                  {activeMethod.soloFriendly ? "Solo / Co-Op" : "Squad Only"}
                </span>
              </div>
            </div>

            {/* Strategy Steps */}
            <div className="space-y-3">
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> Step-by-Step Execution Plan
              </h3>
              <div className="space-y-2.5">
                {activeMethod.strategySteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-3"
                  >
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-mono font-bold text-xs">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements Checklist */}
            <div className="space-y-3">
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent" /> Prerequisites & Unlocks
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                {activeMethod.requirements.map((req) => (
                  <li key={req} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Link to Money Calculator */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wide block">
                  Calculate Custom Target Timeline
                </span>
                <p className="text-xs text-slate-400">
                  Input your vehicle or property goal and see exact days needed using this method.
                </p>
              </div>
              <Link
                href="/tools/money-calculator"
                className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5 font-bold uppercase tracking-wider whitespace-nowrap"
              >
                <Calculator className="h-4 w-4" /> Calculate Goal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
