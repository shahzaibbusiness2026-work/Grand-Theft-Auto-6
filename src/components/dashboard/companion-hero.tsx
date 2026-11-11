"use client";
import { Car, Crosshair, Users, Newspaper } from "lucide-react";
import { SafeImage } from "@/components/safe-image";

interface SiteStats {
  dataAvailable?: boolean; totalVehicles: number; totalWeapons: number;
  totalCharacters?: number; totalArticles?: number;
}
export function CompanionHero({ userName = "Player", siteStats }: { userName?: string; siteStats?: SiteStats }) {
  const stats = [
    { label: "Vehicles", value: siteStats?.totalVehicles, icon: Car },
    { label: "Weapons", value: siteStats?.totalWeapons, icon: Crosshair },
    { label: "Characters", value: siteStats?.totalCharacters, icon: Users },
    { label: "Articles", value: siteStats?.totalArticles, icon: Newspaper },
  ];
  return <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm" aria-label="Your player overview">
    <div className="dark-panel relative isolate overflow-hidden bg-[#0c1222] px-5 py-7 sm:px-8 sm:py-9">
      <SafeImage src="/img/hero-vice-skyline-hd.jpg" alt="" fill sizes="(max-width: 768px) 100vw, 1200px" className="z-0 object-cover object-center" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />
      <div className="relative z-20 max-w-2xl rounded-2xl bg-black/60 p-4 sm:p-5">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-pink-300">Taish Gaming · Your player workspace</p>
      <h1 className="mt-3 max-w-3xl break-words font-display text-3xl font-black leading-tight text-white sm:text-4xl">Welcome back, {userName}.</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-200">Pick up your plans, explore the community map and keep your collection in one place.</p>
      </div>
    </div>
    <div className="grid grid-cols-2 divide-x divide-border sm:grid-cols-4" aria-label="Published atlas records">
      {stats.map(({ label, value, icon: Icon }) => <div key={label} className="flex min-w-0 items-center gap-3 border-t border-border px-4 py-4 sm:px-5">
        <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-pink-700 dark:text-pink-300" />
        <div><strong className="block text-lg tabular-nums text-foreground">{siteStats?.dataAvailable === false ? "—" : value ?? "—"}</strong><span className="text-xs text-muted-foreground">{label}</span></div>
      </div>)}
    </div>
  </section>;
}
