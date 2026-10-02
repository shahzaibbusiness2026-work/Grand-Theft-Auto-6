import React from "react";
import { Metadata } from "next";
import { Gamepad2, AlertTriangle, ShieldAlert, Sparkles, Smartphone, Terminal } from "lucide-react";
import { SiteShell } from "@/components/shells";

export const metadata: Metadata = {
  title: "GTA 6 Cheats & Codes Guide | PC, PS5, Xbox Series X/S",
  description: "Comprehensive guide to Grand Theft Auto VI cheats, cell phone dial numbers, controller combinations, and achievement warnings.",
  alternates: { canonical: "/cheats" },
  };

export default function CheatsPage() {
  return (
    <SiteShell>
      <div className="container-site py-12 sm:py-16 space-y-10">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Codes & Modifiers
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
            GTA 6 Cheats & Secret Modifiers
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            The definitive resource for Grand Theft Auto VI cheat codes across PlayStation 5, Xbox Series X/S, and PC.
          </p>
        </div>

        {/* Warning Notice */}
        <div className="rounded-2xl border border-amber-500/40 dark:border-amber-800/40 bg-amber-500/10 dark:bg-amber-950/20 p-5 sm:p-6 flex items-start gap-4 text-amber-800 dark:text-amber-200">
          <ShieldAlert className="w-6 h-6 shrink-0 text-amber-400 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed space-y-1">
            <p className="font-bold text-white uppercase tracking-wider">
              Warning: Trophies & Achievements Will Be Disabled
            </p>
            <p className="text-amber-800/80 dark:text-amber-200/80">
              In accordance with Rockstar Games design tradition, activating any cheat code during gameplay will immediately disable Trophies (PS5) and Achievements (Xbox / PC) for your current save session. Always create a manual backup save before inputting codes.
            </p>
          </div>
        </div>

        {/* Activation Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center text-primary">
              <Smartphone className="w-5 h-5" />
            </div>
            <h2 className="font-display text-lg font-bold text-white">In-Game Smartphone Dialing</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Open your character&apos;s phone, navigate to the dial pad, and enter numbers formatted as 1-999-XXX-XXXX to trigger world effects and vehicle drops.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center text-accent">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <h2 className="font-display text-lg font-bold text-white">Controller Button Sequences</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Rapidly input directional pad and face button combinations (e.g., D-Pad, Triggers, Bumpers) directly during free-roam gameplay.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center text-primary">
              <Terminal className="w-5 h-5" />
            </div>
            <h2 className="font-display text-lg font-bold text-white">PC Developer Console</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Press the tilde (~) key to summon the command console and type direct modifier words like PAINKILLER, TURTLE, or CATCHME.
            </p>
          </div>
        </div>

        {/* Status / Day One Coverage */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4 text-center max-w-2xl mx-auto">
          <Sparkles className="w-8 h-8 text-primary mx-auto" />
          <h2 className="font-display text-xl font-bold text-white">
            Day-One Code Verification Registry
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Our editorial and data verification team will test and publish every working code the minute Grand Theft Auto VI launches worldwide. Check back here upon release for fully tested and verified inputs.
          </p>
        </div>
      </div>
    </SiteShell>
  );
}
