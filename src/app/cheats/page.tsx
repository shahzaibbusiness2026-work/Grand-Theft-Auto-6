import { SiteShell } from "@/components/shells";
import { ShieldAlert, Smartphone, Gamepad2, Terminal, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GTA 6 Cheats — What We Know Before Launch | Taish Gaming",
  description:
    "No official GTA 6 cheat codes have been announced yet. How cheats worked in GTA 5, what to expect in GTA 6, and what this page will list at launch.",
  alternates: { canonical: "/cheats" },
};

export default function CheatsPage() {
  return (
    <SiteShell>
      <div className="container-site py-12 sm:py-16 space-y-10">
        <div className="max-w-3xl space-y-3">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Codes &amp; Modifiers
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-foreground tracking-tight">
            GTA 6 Cheats — What We Know Before Launch
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Rockstar has not announced any official GTA 6 cheat codes yet. This page
            explains how cheats worked in GTA 5, what to expect in GTA 6, and will
            be updated with verified codes the moment they are confirmed at launch.
            Nothing on this page is a working GTA 6 code today.
          </p>
        </div>

        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5 sm:p-6 flex items-start gap-4">
          <Clock className="w-6 h-6 shrink-0 text-amber-500 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed space-y-1">
            <p className="font-bold uppercase tracking-wider text-amber-600 dark:text-amber-300">
              No Codes Yet — Beware of Fake Lists
            </p>
            <p className="text-foreground/80">
              Any site claiming a working list of GTA 6 cheat codes before launch is
              guessing. GTA 6 releases November 19, 2026. Until Rockstar or the game
              itself reveals codes, treat every supposed GTA 6 code online as
              unverified.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center text-primary">
              <Smartphone className="w-5 h-5" />
            </div>
            <h2 className="font-display text-lg font-bold text-foreground">How It Worked in GTA 5</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In GTA 5, players dialed codes on the in-game phone using the
              1-999-XXX-XXXX format to trigger effects like vehicle spawns and
              weather changes. GTA 6 may keep a similar system — that is
              expectation, not confirmation.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center text-primary">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <h2 className="font-display text-lg font-bold text-foreground">Controller Sequences</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Classic GTA cheats were also entered as button combinations during
              gameplay on PlayStation and Xbox. Whether GTA 6 keeps button-sequence
              cheats alongside phone codes is unconfirmed.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center text-primary">
              <Terminal className="w-5 h-5" />
            </div>
            <h2 className="font-display text-lg font-bold text-foreground">PC Console</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              GTA 6 has no announced PC version or PC release date as of
              October 22, 2026. Any PC cheat method for GTA 6 is speculation
              until Rockstar announces PC timing.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gold/40 bg-gold/10 p-5 sm:p-6 flex items-start gap-4 text-amber-800 dark:text-amber-200">
          <ShieldAlert className="w-6 h-6 shrink-0 text-gold-light mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed space-y-1">
            <p className="font-bold uppercase tracking-wider">
              Warning: Cheats Historically Disable Trophies
            </p>
            <p className="text-amber-800/80 dark:text-amber-200/80">
              In past GTA games, activating cheat codes disabled Trophies and
              Achievements for the current save session. Expect the same tradition
              in GTA 6 — always keep a manual backup save before trying any code
              once codes exist.
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          This page will be updated from real gameplay at launch with verified
          codes only. Until then, see the{" "}
          <a href="/achievements" className="text-primary font-bold underline">achievements tracker</a>{" "}
          and the{" "}
          <a href="/tracker" className="text-primary font-bold underline">100% completion tracker</a>{" "}
          for what you can actually do on day one.
        </p>
      </div>
    </SiteShell>
  );
}
