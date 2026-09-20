import { SiteShell } from "@/components/shells";
import { ThemeImage } from "@/components/theme-image";
import { MissionsClient } from "./missions-client";
import { Sparkles, Flag, Target, Trophy } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GTA 6 Missions & Contracts Database — Story, Heists & Walkthroughs",
  description: "Comprehensive verified database of GTA 6 story missions, contracts, and heists. Filter by operative (Lucia, Jason), rewards, difficulty, and chapter.",
};

export default function MissionsPage() {
  return (
    <SiteShell>
      {/* HERO */}
      <section className="container-site pt-8">
        <div className="card-surface relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
          <ThemeImage
            dark="/img/hero-dark.jpg"
            light="/img/boat.jpg"
            alt="Leonida Missions"
            className="absolute right-0 top-0 h-full w-full object-cover lg:w-2/3 opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="relative px-6 py-12 sm:px-10 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-accent mb-3">
              <Flag className="h-3 w-3" /> Campaign & Heists Archive
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-white">
              LEONIDA <span className="bg-gradient-to-r from-primary via-accent to-amber-400 bg-clip-text text-transparent">MISSIONS & HEISTS</span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              Browse confirmed story chapters, multi-approach bank heists, cartel side contracts, and dynamic stranger encounters across Vice City and beyond.
            </p>
          </div>
        </div>

        {/* Global Live Stats Counter */}
        <div className="card-surface -mt-6 relative mx-4 sm:mx-6 grid grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/10 sm:grid-cols-4 rounded-2xl shadow-xl border border-white/10">
          {[
            ["8+", "Story Arcs & Heists"],
            ["100%", "Verified Grounding"],
            ["Lucia & Jason", "Dual Protagonists"],
            ["$480K+", "Top Vault Score"],
          ].map(([v, l]) => (
            <div key={l} className="flex flex-col items-center gap-1 px-4 py-5 text-center">
              <span className="font-display text-xl sm:text-2xl font-black text-accent">{v}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE MISSIONS FINDER */}
      <section className="container-site py-10">
        <MissionsClient />
      </section>
    </SiteShell>
  );
}
