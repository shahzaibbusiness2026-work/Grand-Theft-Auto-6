"use client";

import Link from "next/link";
import { ArrowRight, Map, Newspaper, Car } from "lucide-react";
import { HeroBackground } from "./HeroBackground";
import { Countdown } from "./Countdown";

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative w-full overflow-hidden bg-[#090d16] pt-10 pb-6 sm:pt-14 sm:pb-8 lg:pt-16 lg:pb-6 px-4 sm:px-8 lg:px-14 min-h-[640px] lg:min-h-[700px] flex flex-col justify-between"
    >
      {/* 1. CINEMATIC BACKGROUND CANVAS */}
      <HeroBackground />

      {/* Accessible heading for SEO */}
      <h1 id="hero-heading" className="sr-only">
        Grand Theft Auto VI — A new city. Every detail.
      </h1>

      {/* 2. MAIN HERO CONTENT (Left Column) */}
      <div className="relative z-10 mx-auto w-full max-w-7xl flex flex-col justify-center flex-1">
        <div className="flex flex-col items-start text-left space-y-4 sm:space-y-5 max-w-2xl">
          {/* Eyebrow Tag */}
          <p className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.25em] text-slate-400">
            YOUR GUIDE TO VICE CITY
          </p>

          {/* Main Headline */}
          <div className="space-y-0.5">
            <h2 className="text-4xl sm:text-6xl lg:text-[4.5rem] font-black tracking-tight leading-[1.02] text-white">
              A new city.
            </h2>
            <h2 className="text-4xl sm:text-6xl lg:text-[4.5rem] font-black tracking-tight leading-[1.02] bg-gradient-to-r from-[#e879f9] via-[#f472b6] to-[#fb7185] bg-clip-text text-transparent">
              Every detail.
            </h2>
          </div>

          {/* Narrative Pitch */}
          <p className="text-sm sm:text-base text-slate-300 max-w-md leading-relaxed font-normal pt-1">
            Explore the latest stories, discover vehicles and weapons, and plan your next adventure.
          </p>

          {/* Countdown Card */}
          <Countdown />

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            <Link
              href="/map"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#a78bfa] hover:bg-[#b599f9] px-6 py-3.5 text-sm font-bold text-slate-950 transition-all shadow-lg hover:shadow-purple-500/25 active:scale-95"
            >
              <span>Explore the Atlas</span>
              <ArrowRight className="h-4 w-4 text-slate-950" />
            </Link>

            <Link
              href="/map-explorer"
              className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-purple-400/30 bg-purple-950/25 hover:bg-purple-950/45 px-6 py-3.5 text-sm font-semibold text-white transition-all backdrop-blur-md active:scale-95"
            >
              <span>Open interactive map</span>
              <Map className="h-4 w-4 text-purple-300" />
            </Link>
          </div>

          {/* Sub-disclaimer */}
          <p className="text-[11px] text-slate-400/80 font-medium">
            Independent fan platform • Unofficial
          </p>
        </div>
      </div>

      {/* 3. BOTTOM QUICK-ACCESS FEATURE BAR */}
      <div className="relative z-10 w-full border-t border-white/10 pt-5 mt-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Feature 1: Latest stories */}
          <Link href="/news" className="group flex items-center gap-4 transition-colors">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400 group-hover:border-purple-400 group-hover:bg-purple-500/20 transition-all">
              <Newspaper className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                <span>Latest stories</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
              <p className="text-xs text-slate-400">News, leaks and analysis</p>
            </div>
          </Link>

          {/* Feature 2: Vehicle database */}
          <Link href="/vehicles" className="group flex items-center gap-4 md:border-l md:border-white/10 md:pl-6 lg:pl-8 transition-colors">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400 group-hover:border-purple-400 group-hover:bg-purple-500/20 transition-all">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                <span>Vehicle database</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
              <p className="text-xs text-slate-400">Cars, bikes, boats and more</p>
            </div>
          </Link>

          {/* Feature 3: Interactive map */}
          <Link href="/map" className="group flex items-center gap-4 md:border-l md:border-white/10 md:pl-6 lg:pl-8 transition-colors">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400 group-hover:border-purple-400 group-hover:bg-purple-500/20 transition-all">
              <Map className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                <span>Interactive map</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
              <p className="text-xs text-slate-400">Explore Vice City</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
