"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Check,
  Zap,
  Crown,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
  Bot,
  Trophy,
  HelpCircle,
} from "lucide-react";
import {
  getStoredUserState,
  saveStoredUserState,
  type UserState,
} from "@/lib/user-store";
import { cn } from "@/lib/utils";

const FREE_FEATURES = [
  "Access to high-res Leonida Satellite Map",
  "Full Vehicle, Weapon & Mission Databases",
  "Side-by-side 2-ride vehicle & weapon comparisons",
  "100% Completion Tracker (Local device save)",
  "5 Grounded Ask GTA 6 AI queries per day",
  "Standard dark/light neon theme switcher",
];

const PRO_FEATURES = [
  "Everything in Free Tier",
  "Unlimited Grounded Ask GTA 6 AI queries",
  "4-way Simultaneous Comparison Duels",
  "Cloud & Multi-device JSON Tracker Sync",
  "Tactical Loadout Builder unlimited custom slots",
  "High-resolution printable map overlays",
  "Early access to newly verified leak decodes",
  "Exclusive Vice City Pro Gold Badge on profile",
  "Zero advertising or partner sponsored banners",
];

export function PricingClient() {
  const [userState, setUserState] = useState<UserState | null>(null);
  const [annualBilling, setAnnualBilling] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  useEffect(() => {
    setUserState(getStoredUserState());

    const handleSync = () => setUserState(getStoredUserState());
    window.addEventListener("gta6_user_state_change", handleSync);
    return () => window.removeEventListener("gta6_user_state_change", handleSync);
  }, []);

  const isPro = userState?.isPro || false;

  const handleTogglePro = () => {
    if (!userState) return;
    setIsProcessing(true);

    setTimeout(() => {
      const nextPro = !isPro;
      const nextState = {
        ...userState,
        isPro: nextPro,
      };
      saveStoredUserState(nextState);
      setIsProcessing(false);
      if (nextPro) {
        setShowSuccessModal(true);
      }
    }, 600);
  };

  return (
    <div className="space-y-12">
      {/* Billing Cycle Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <span className={cn("text-xs font-semibold", !annualBilling ? "text-white" : "text-slate-400")}>
          Monthly Billing
        </span>
        <button
          onClick={() => setAnnualBilling(!annualBilling)}
          className="relative h-7 w-14 rounded-full bg-slate-800 p-1 border border-slate-700 transition-colors focus:outline-none"
        >
          <div
            className={cn(
              "h-5 w-5 rounded-full bg-primary transition-transform duration-200 shadow-md",
              annualBilling ? "translate-x-7" : "translate-x-0"
            )}
          />
        </button>
        <span className={cn("text-xs font-semibold flex items-center gap-1.5", annualBilling ? "text-white" : "text-slate-400")}>
          Annual Billing
          <span className="rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold px-2 py-0.5 border border-emerald-500/30">
            Save 33%
          </span>
        </span>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Tier 1: Free Explorer */}
        <div className="card-carbon p-8 flex flex-col justify-between border-slate-800 bg-slate-900/60">
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Standard Access
              </span>
              <h3 className="font-display text-2xl font-black text-white">Free Explorer</h3>
              <p className="text-xs text-slate-300 mt-1">
                Essential utilities for casual explorers tracking their story journey.
              </p>
            </div>

            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-4xl font-black text-white">$0</span>
              <span className="text-xs text-slate-400 font-sans">/ forever free</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300 pt-4 border-t border-slate-800">
              {FREE_FEATURES.map((feat) => (
                <li key={feat} className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8">
            <button
              disabled={!isPro}
              onClick={handleTogglePro}
              className="btn-ghost w-full py-3 text-xs font-bold uppercase tracking-wider border border-slate-800 text-slate-400 hover:text-white disabled:opacity-60"
            >
              {!isPro ? "Current Active Plan" : "Downgrade to Free"}
            </button>
          </div>
        </div>

        {/* Tier 2: Vice City Pro */}
        <div className="card-carbon p-8 flex flex-col justify-between border-primary/50 relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-primary/10 shadow-[0_0_30px_rgba(244,63,94,0.15)]">
          <div className="absolute top-0 right-0 bg-gradient-to-l from-primary to-accent text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-bl-xl shadow-md">
            Launching Soon
          </div>

          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
                <Crown className="h-4 w-4 text-amber-400" /> Premium VIP Membership
              </div>
              <h3 className="font-display text-2xl font-black text-white">Vice City Pro</h3>
              <p className="text-xs text-slate-300 mt-1">
                Advanced calculators, unlimited AI intelligence, and 4-way duels.
              </p>
            </div>

            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-4xl font-black text-white">
                {annualBilling ? "$39.99" : "$4.99"}
              </span>
              <span className="text-xs text-slate-400 font-sans">
                {annualBilling ? "/ year ($3.33/mo)" : "/ month"}
              </span>
            </div>

            <ul className="space-y-3 text-xs text-slate-200 pt-4 border-t border-slate-800">
              {PRO_FEATURES.map((feat) => (
                <li key={feat} className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8">
            <button
              onClick={handleTogglePro}
              disabled={isProcessing}
              className={cn(
                "w-full py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2",
                isPro
                  ? "bg-emerald-500 text-white shadow-emerald-500/30 hover:bg-emerald-600"
                  : "btn-primary shadow-primary/30 hover:shadow-primary/50"
              )}
            >
              {isProcessing ? (
                <span>Updating Membership...</span>
              ) : isPro ? (
                <>
                  <ShieldCheck className="h-4 w-4" /> Vice City Pro Active
                </>
              ) : (
                <>
                  <Crown className="h-4 w-4 text-amber-300" /> Join Waitlist / Preview Pro
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="card-carbon p-8 max-w-md w-full border-primary/40 space-y-6 text-center animate-fade-in shadow-2xl">
            <div className="h-16 w-16 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto shadow-lg shadow-primary/30">
              <Crown className="h-8 w-8 text-amber-400" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-2xl font-black text-white uppercase tracking-tight">
                Welcome to Vice City Pro!
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your account now has full unrestricted access to 4-way duels, unlimited Ask GTA 6 AI queries, and cloud JSON tracker backups.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-emerald-400">
              ✓ Pro Membership Active & Persisted Locally
            </div>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="btn-primary w-full py-2.5 text-xs font-bold uppercase tracking-wider"
            >
              Continue to Atlas
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
