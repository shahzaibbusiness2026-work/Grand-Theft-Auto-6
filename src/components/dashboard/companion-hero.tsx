"use client";

import { Shield, Car, Crosshair, Users, Newspaper } from "lucide-react";

interface SiteStats {
  totalVehicles: number;
  totalWeapons: number;
  totalCharacters?: number;
  totalArticles?: number;
}

interface CompanionHeroProps {
  userName?: string;
  /** Live DB counts from Supabase, passed in from the server page */
  siteStats?: SiteStats;
}

export function CompanionHero({
  userName = "Player",
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
      color: "text-gold-light",
    },
    {
      label: "Characters",
      value: siteStats?.totalCharacters ?? "—",
      icon: Users,
      color: "text-pink-400",
    },
    {
      label: "Articles",
      value: siteStats?.totalArticles ?? "—",
      icon: Newspaper,
      color: "text-emerald-400",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gold/60 via-white/10 to-[#00F0FF]/40 p-px shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
    <div className="dark-panel relative overflow-hidden rounded-[calc(1.5rem-1px)] border border-white/10 bg-[#0c1222]">
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
        <div className="absolute -top-10 left-1/3 h-64 w-64 rounded-full bg-gold/15 blur-[120px]" />
        <div className="absolute -bottom-10 right-1/4 h-64 w-64 rounded-full bg-[#00F0FF]/15 blur-[120px]" />
        {/* Top shine line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col justify-between p-6 sm:p-8 lg:p-10 min-h-[300px] lg:flex-row lg:items-center gap-6">
        {/* Left column: Welcome Greeting, progress text, and CTA */}
        <div className="max-w-xl space-y-3">
          <span className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.25em] text-gold-light">
            <span className="h-px w-8 bg-gradient-to-r from-gold to-transparent" />
            GOOD TO SEE YOU AGAIN,
          </span>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)]">
            {userName}
          </h1>

          <p className="font-serif italic text-xs sm:text-sm text-slate-400">
            &ldquo;Same chaos. A bigger tomorrow.&rdquo;
          </p>

        </div>

        {/* Right column: Live Atlas DB Stats + Shield Badge */}
        <div className="flex flex-col items-start lg:items-end gap-4 self-end lg:self-auto">
          {/* Live Stats Card */}
          <div className="light-panel rounded-2xl border border-gold/25 bg-white/[0.06] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-2xl min-w-[260px] sm:min-w-[300px] ring-1 ring-white/10">
            {/* Top row: Shield + Title */}
            <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-gold/30 to-gold/5 border border-gold/40 text-foreground shadow-[0_0_16px_rgba(201,168,106,0.35)]">
                <Shield className="h-5 w-5 text-gold-light" />
              </div>
              <div className="flex-1">
                <div className="font-display text-sm font-extrabold uppercase tracking-wider text-foreground">
                  ATLAS DATABASE
                </div>
                <div className="text-xs font-semibold text-muted-foreground">
                  Live Leonida Intel
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Live
              </span>
            </div>

            {/* Live counts grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="flex items-center gap-2 rounded-xl bg-white/[0.05] border border-white/[0.08] p-2.5 transition-colors hover:border-gold/30"
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${stat.color}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-black text-foreground leading-none">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
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
              className="text-2xl sm:text-3xl font-serif italic text-gold-light drop-shadow-[0_0_12px_rgba(201,168,106,0.7)]"
              style={{ fontFamily: "'Brush Script MT', 'Pacifico', cursive, sans-serif" }}
            >
              Bigger Brighter Wilder
            </span>
            <span className="font-mono text-xs tracking-[0.35em] text-muted-foreground uppercase mt-1">
              VICE CITY AWAITS
            </span>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
