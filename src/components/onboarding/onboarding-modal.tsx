"use client";

import { useEffect, useState } from "react";
import {
  Compass,
  Database,
  Flag,
  X,
  ArrowRight,
  ArrowLeft,
  Car,
  Map as MapIcon,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "gta6_atlas_onboarded";

const STEPS = [
  {
    icon: Compass,
    title: "Welcome to GTA 6 Atlas",
    body: "Your fan-made companion for Grand Theft Auto VI — databases, maps, and tools for the State of Leonida, built for launch-day and beyond.",
  },
  {
    icon: Database,
    title: "Everything in one place",
    body: "Browse 100+ vehicles and 32 weapons, explore the interactive Leonida map, and chase 100% completion with the built-in tracker.",
    features: [
      { icon: Car, label: "Vehicle & weapon databases" },
      { icon: MapIcon, label: "Interactive Leonida map" },
      { icon: Trophy, label: "100% completion tracker" },
    ],
  },
  {
    icon: Flag,
    title: "Ready when you are",
    body: "Your profile, favorites, and tracker progress are saved on this device only — no account needed. Dive in and start exploring Vice City.",
  },
];

export function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let cancelled = false;
    try {
      if (typeof window === "undefined") return;
      if (window.localStorage.getItem(STORAGE_KEY)) return;
      const t = window.setTimeout(() => {
        if (!cancelled) setOpen(true);
      }, 700);
      return () => {
        cancelled = true;
        window.clearTimeout(t);
      };
    } catch {
      // storage unavailable — skip onboarding silently
    }
    return undefined;
  }, []);

  const dismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setOpen(false);
  };

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open ]);

  if (!open) return null;

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to GTA 6 Atlas"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Card */}
      <div className="card-carbon relative w-full max-w-md overflow-hidden p-6 sm:p-8">
        {/* Gold top accent */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

        <button
          type="button"
          onClick={dismiss}
          aria-label="Skip onboarding"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-white hover:border-gold/50"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon */}
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-gold shadow-[0_0_20px_rgba(201,168,106,0.25)]">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </div>

        <h2 className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground">
          {current.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {current.body}
        </p>

        {/* Feature list on step 2 */}
        {current.features && (
          <ul className="mt-4 space-y-2.5">
            {current.features.map((f) => (
              <li
                key={f.label}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/50 px-3.5 py-2.5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold">
                  <f.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-foreground">{f.label}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Progress dots */}
        <div className="mt-6 flex items-center justify-center gap-2" aria-hidden="true">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === step ? "w-8 bg-gold" : "w-1.5 bg-border"
              )}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={dismiss}
            className="text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-white"
          >
            Skip
          </button>

          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="flex h-11 items-center gap-1.5 rounded-xl border border-border px-4 text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:border-gold/50"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
              </button>
            )}
            <button
              type="button"
              onClick={() => (isLast ? dismiss() : setStep((s) => s + 1))}
              className="btn-primary flex h-11 items-center gap-1.5 rounded-xl px-5 text-xs font-bold uppercase tracking-wider"
            >
              {isLast ? "Start exploring" : "Next"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
