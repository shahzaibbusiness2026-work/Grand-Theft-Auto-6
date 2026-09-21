"use client";

import Link from "next/link";
import { Shield, ArrowRight, Car, Crosshair, Newspaper, Users } from "lucide-react";

interface SiteStats {
  totalVehicles: number;
  totalWeapons: number;
  totalArticles: number;
  totalCharacters: number;
}

interface CompanionHeroProps {
  userName?: string;
  completionRate?: number;
  /** Live DB counts from Supabase, passed in from the server page */
  siteStats?: SiteStats;
}

export function CompanionHero({
  userName = "ZUHAIB",
  completionRate = 72,
  siteStats,
}: CompanionHeroProps) {
  const stats = [
    {
      label: "Vehicles",
      value: siteStats?.totalVehicles ?? "—",
      icon: Car,
      color: "text-[#00F0FF]",
    },
    {
      label: "Weapons",
      value: siteStats?.totalWeapons ?? "—",
      icon: Crosshair,
      color: "text-amber-400",
    },
    {
      label: "Articles",
      value: siteStats?.totalArticles ?? "—",
      icon: Newspaper,
      color: "text-purple-400",
    },
    {
      label: "Characters",
      value: siteStats?.totalCharacters ?? "—",
      icon: Users,
      color: "text-emerald-400",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0c1222] shadow-2xl">
      {/* Background artwork: cinematic dusk/sunset city skyline with car and palms */}
      <div className="absolute inset-0 z-0">
        <img
          src="/img/hero-dark.jpg"
          alt="Vice City Skyline"
          className="h-full w-full object-cover object-center opacity-45 brightness-90 contrast-125"
        />
        {/* Layered Vignettes and neon gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070b14] via-[#070b14]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-transparent to-[#070b14]/40" />
        {/* Ambient neon flares */}
        <div className="absolute -top-10 left-1/3 h-64 w-64 rounded-full bg-amber-500/15 blur-[120px]" />
        <div className="absolute -bottom-10 right-1/4 h-64 w-64 rounded-full bg-[#00F0FF]/15 blur-[120px]" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col justify-between p-6 sm:p-8 lg:p-10 min-h-[300px] lg:flex-row lg:items-center gap-6">
        {/* Left column: Welcome Greeting, progress text, and CTA */}
        <div className="max-w-xl space-y-3">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400">
            GOOD TO SEE YOU AGAIN,
          </span>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)]">
            {userName}
          </h1>

          <p className="text-sm sm:text-base font-semibold text-slate-200">
            <span className="text-[#00F0FF]">{completionRate}%</span> closer to conquering Vice City.
          </p>

          <p className="font-serif italic text-xs sm:text-sm text-slate-400">
            &ldquo;Same chaos. A bigger tomorrow.&rdquo;
          </p>

          <div className="pt-2">
            <Link
              href="/missions"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 px-6 py-3 font-display text-xs font-black uppercase tracking-wider text-slate-950 shadow-[0_0_24px_rgba(245,158,11,0.35)] transition-all duration-300 hover:brightness-105 hover:shadow-[0_0_32px_rgba(245,158,11,0.55)] hover:scale-[1.02] active:scale-95"
            >
              <span>Continue Your Journey</span>
              <ArrowRight className="h-4 w-4 text-slate-950" />
            </Link>
          </div>
        </div>

        {/* Right column: Live Atlas DB Stats + Shield Badge */}
        <div className="flex flex-col items-start lg:items-end gap-4 self-end lg:self-auto">
          {/* Live Stats Card */}
          <div className="rounded-2xl border border-border bg-card/90 p-4 shadow-2xl backdrop-blur-xl min-w-[260px] sm:min-w-[280px]">
            {/* Top row: Shield + Title */}
            <div className="flex items-center gap-3 border-b border-border pb-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted border border-border text-foreground shadow-inner">
                <Shield className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <div className="font-display text-sm font-extrabold uppercase tracking-wider text-foreground">
                  ATLAS DATABASE
                </div>
                <div className="text-[11px] font-semibold text-muted-foreground">
                  Live Leonida Intel
                </div>
              </div>
            </div>

            {/* Live counts grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="flex items-center gap-2 rounded-xl bg-white/[0.04] border border-white/[0.06] p-2"
                  >
                    <Icon className={`h-3.5 w-3.5 shrink-0 ${stat.color}`} />
                    <div className="min-w-0">
                      <p className="text-[11px] font-black text-foreground leading-none">
                        {stat.value}
                      </p>
                      <p className="text-[9px] text-muted-foreground mt-0.5 truncate">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Neon cursive script & watermark */}
          <div className="flex flex-col items-start lg:items-end select-none">
            <span
              className="text-2xl sm:text-3xl font-serif italic text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.7)]"
              style={{ fontFamily: "'Brush Script MT', 'Pacifico', cursive, sans-serif" }}
            >
              Bigger Brighter Wilder
            </span>
            <span className="font-mono text-[9px] tracking-[0.35em] text-muted-foreground uppercase mt-1">
              VICE CITY AWAITS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
