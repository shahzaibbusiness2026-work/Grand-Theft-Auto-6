"use client";

import Link from "next/link";
import { Compass, ArrowRight, ShoppingBag, ExternalLink, ShieldCheck } from "lucide-react";
import { HeroBackground } from "./HeroBackground";
import { Countdown } from "./Countdown";

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative w-full overflow-hidden flex items-center justify-center pt-4 pb-4 sm:pt-6 sm:pb-6 lg:pt-8 lg:pb-8 px-4 sm:px-8 lg:px-12"
    >
      {/* 1. CINEMATIC BACKGROUND CANVAS */}
      <HeroBackground />

      {/* Accessible heading for SEO */}
      <h1 id="hero-heading" className="sr-only">
        Grand Theft Auto VI — Vice City Lives Again Official Countdown
      </h1>

      {/* 2. SIDE-BY-SIDE HERO LAYOUT */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">
        {/* Left Column: Official GTA 6 Brand Identity & Action Portal */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left select-none space-y-5 w-full lg:max-w-xl lg:flex-1 shrink-0">
          {/* Eyebrow Status Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.12)] shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
            </span>
            <span className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-amber-500 dark:text-amber-400">
              ROCKSTAR GAMES PRESENTS
            </span>
          </div>

          {/* Official GTA 6 Logo Lockup */}
          <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-5 select-none pt-1 shrink-0">
            <div className="flex flex-col items-end leading-[0.88] shrink-0">
              <span className="font-display text-4xl sm:text-6xl lg:text-7xl font-black lowercase tracking-tight text-foreground drop-shadow-[0_2px_12px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                grand
              </span>
              <span className="font-display text-4xl sm:text-6xl lg:text-7xl font-black lowercase tracking-tight text-foreground drop-shadow-[0_2px_12px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                theft
              </span>
              <span className="font-display text-4xl sm:text-6xl lg:text-7xl font-black lowercase tracking-tight text-foreground drop-shadow-[0_2px_12px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                auto
              </span>
            </div>
            <span className="font-display text-8xl sm:text-9xl lg:text-[11rem] font-black tracking-tighter bg-gradient-to-br from-[#E11D48] via-[#FF5E00] to-[#F59E0B] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(245,158,11,0.35)] shrink-0">
              VI
            </span>
          </div>

          {/* Vice City Tagline */}
          <p className="font-mono text-xs sm:text-sm font-black uppercase tracking-[0.42em] text-amber-500 dark:text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
            VICE CITY LIVES AGAIN
          </p>

          {/* Narrative Pitch */}
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-normal max-w-lg">
            A new era begins. Step into the sun-soaked, crime-fueled sprawl of Vice City and beyond. Track confirmed coordinates, vehicles, and intel before launch.
          </p>

          {/* High-Converting CTA Button Row */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
            <Link
              href="/map"
              className="group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 px-6 py-3.5 font-display text-xs sm:text-sm font-black uppercase tracking-wider text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all duration-300 hover:brightness-105 hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] hover:scale-[1.02] active:scale-95"
            >
              <Compass className="h-4 w-4 transition-transform group-hover:rotate-45 text-slate-950" />
              <span>EXPLORE ATLAS MAP</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-slate-950" />
            </Link>

            <a
              href="https://store.rockstargames.com/game/buy-gta-vi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 hover:bg-muted px-5 py-3.5 font-display text-xs sm:text-sm font-black uppercase tracking-wider text-foreground backdrop-blur-md shadow-sm transition-all duration-300 hover:border-amber-400/50 hover:text-amber-500 dark:hover:text-amber-400 hover:scale-[1.02] active:scale-95"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>PRE-ORDER</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-60" />
            </a>
          </div>

          {/* Platform Support Chips */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-3 text-[11px] font-mono">
            <span className="uppercase tracking-widest text-muted-foreground font-bold text-[10px]">PLATFORMS:</span>
            <span className="rounded-md border border-border bg-card/80 px-2.5 py-1 text-foreground font-bold shadow-sm">PS5</span>
            <span className="rounded-md border border-border bg-card/80 px-2.5 py-1 text-foreground font-bold shadow-sm">XBOX SERIES X|S</span>
            <span className="rounded-md border border-border bg-card/80 px-2.5 py-1 text-muted-foreground shadow-sm">PC (TBD)</span>
          </div>
        </div>

        {/* Right Column: High-Tech Mission Countdown Terminal */}
        <div className="flex items-center justify-center w-full lg:w-auto shrink-0">
          <Countdown />
        </div>
      </div>
    </section>
  );
}
