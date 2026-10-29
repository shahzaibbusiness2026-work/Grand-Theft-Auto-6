import React from "react";
import { Metadata } from "next";
import { ShieldCheck, Compass, Users, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { SiteShell } from "@/components/shells";

export const metadata: Metadata = {
  title: { absolute: "About Taish Gaming | Independent GTA 6 Database" },
  description: "Learn how Taish Gaming researches GTA 6 information, labels official evidence, community findings and speculation, and maintains its independent fan-made database.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about",
    title: "About Taish Gaming | Independent GTA 6 Database",
    description: "Learn how Taish Gaming researches GTA 6 information, labels official evidence, community findings and speculation, and maintains its independent fan-made database.",
    images: ["/img/hero-dark.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Taish Gaming | Independent GTA 6 Database",
    description: "Learn how Taish Gaming researches GTA 6 information, labels official evidence, community findings and speculation, and maintains its independent fan-made database.",
    images: ["/img/hero-dark.jpg"],
  },
};

export default function AboutPage() {
  return (
    <SiteShell>
      <div className="container-site py-12 sm:py-16 space-y-12">
        {/* Hero */}
        <div className="max-w-3xl space-y-4">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-primary">
            About Taish Gaming
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-foreground">
            Independent GTA 6 Database
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Taish Gaming is an independent fan project that catalogs the vehicles, weapons, districts, missions, and easter eggs spotted so far in Grand Theft Auto VI — built from trailers, official news, and community research, with every claim labelled by how solid its evidence is.
          </p>
        </div>

        {/* Disclaimer Notice */}
        <div className="rounded-2xl border border-gold/40 dark:border-amber-800/40 bg-gold/10 dark:bg-amber-950/20 p-5 sm:p-6 flex items-start gap-4 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5 shrink-0 text-gold dark:text-gold-light mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed space-y-1">
            <p className="font-bold text-gold-dark dark:text-amber-200">Notice of Non-Affiliation and Disclaimer</p>
            <p className="text-amber-800/80 dark:text-amber-200/80">
              Taish Gaming is an independent, unofficial fan site and community encyclopedia. We are not affiliated, associated, authorized, endorsed by, or in any way officially connected with Rockstar Games, Take-Two Interactive Software, Inc., or any of their subsidiaries or affiliates. The official Rockstar Games website can be found at <a href="https://www.rockstargames.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-foreground">rockstargames.com</a>.
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center text-primary">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="font-display text-lg font-bold text-foreground">Rigorous Fact-Checking</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Taish Gaming separates official Rockstar information from trailer observations, community identifications, credible reporting and speculation. Every database item displays its evidence level so readers can see what is confirmed and what is still uncertain.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center text-accent">
              <Compass className="w-5 h-5" />
            </div>
            <h2 className="font-display text-lg font-bold text-foreground">Interactive Spatial Tools</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our satellite-style map lets explorers browse Leonida regions, districts and points of interest spotted in official footage, each labelled with its evidence level.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center text-primary">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="font-display text-lg font-bold text-foreground">Community Driven</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Built for the community, with community feedback. We continuously update our guides, comparison tools, and calculators as new intelligence surfaces.
            </p>
          </div>
        </div>

        {/* What you will find here */}
        <div className="max-w-4xl space-y-4">
          <h2 className="font-display text-2xl font-bold text-foreground">What you will find here</h2>
          <ul className="grid gap-3 sm:grid-cols-2 text-sm text-muted-foreground leading-relaxed">
            <li className="rounded-xl border border-border bg-card p-4">
              <Link href="/vehicles" className="font-bold text-foreground underline">Vehicle &amp; weapon databases</Link> — catalog entries with evidence labels, comparison tools, and stats marked as estimates wherever they are not officially published.
            </li>
            <li className="rounded-xl border border-border bg-card p-4">
              <Link href="/gta-6-world" className="font-bold text-foreground underline">GTA VI World</Link> — regions, wildlife, brands, restaurants, hotels, gangs, and clothing, each entry sourced and tiered, with an exact image only where one exists.
            </li>
            <li className="rounded-xl border border-border bg-card p-4">
              <Link href="/map" className="font-bold text-foreground underline">Interactive map</Link> — Leonida points of interest spotted in official footage, each labelled with its evidence level.
            </li>
            <li className="rounded-xl border border-border bg-card p-4">
              <Link href="/news" className="font-bold text-foreground underline">News &amp; guides</Link> — researched articles and pre-release guides that say plainly what is known, what is reported, and what is still speculation.
            </li>
          </ul>
        </div>

        {/* How we label information */}
        <div className="max-w-4xl space-y-4">
          <h2 className="font-display text-2xl font-bold text-foreground">How we label information</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Nothing on this site is labelled confirmed unless Rockstar officially confirmed it. Everywhere else, we use these tiers so you can judge each claim for yourself:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
            <li><span className="font-bold text-foreground">Officially Confirmed</span> — stated by Rockstar in a trailer, on its site, or in a press release.</li>
            <li><span className="font-bold text-foreground">Observed in Official Media</span> — visible in a trailer, screenshot, or official artwork, but not stated in words.</li>
            <li><span className="font-bold text-foreground">Credible Report</span> — reported by established press or preview coverage, not by Rockstar directly.</li>
            <li><span className="font-bold text-foreground">Community Identified</span> — identified by fans or the community from footage and screenshots.</li>
            <li><span className="font-bold text-foreground">Speculation</span> — a guess, clearly marked as one, never presented as fact.</li>
          </ul>
        </div>

        {/* Corrections + after launch */}
        <div className="max-w-4xl space-y-4">
          <h2 className="font-display text-2xl font-bold text-foreground">Corrections, and what happens after launch</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Pre-launch information changes fast, and we get things wrong sometimes. If you spot an error, tell us through the <Link href="/contact" className="font-bold text-foreground underline">contact page</Link> and we will fix it. From the November 19, 2026 launch onward, pre-launch reporting on this site is replaced with first-hand gameplay information as it is checked in game.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            For the fine print, see our <Link href="/terms" className="font-bold text-foreground underline">Terms of Service</Link>, <Link href="/disclaimer" className="font-bold text-foreground underline">Disclaimer</Link>, and <Link href="/privacy" className="font-bold text-foreground underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </SiteShell>
  );
}
