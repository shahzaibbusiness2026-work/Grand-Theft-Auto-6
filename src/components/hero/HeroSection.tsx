"use client";

import Link from "next/link";
import { ArrowRight, Map, Newspaper, Car } from "lucide-react";
import { HeroBackground } from "./HeroBackground";
import { Countdown } from "./Countdown";
import { HeroSignup } from "./HeroSignup";
import type { ComprehensiveSiteSettings } from "@/lib/services/settings";

interface HeroSectionProps {
  settings?: ComprehensiveSiteSettings;
}

export function HeroSection({ settings }: HeroSectionProps) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative w-full overflow-hidden bg-background pt-6 pb-6 sm:pt-6 sm:pb-7 lg:pt-6 lg:pb-6 px-4 sm:px-8 lg:px-14 min-h-0 sm:min-h-[520px] flex flex-col justify-between transition-colors duration-300"
    >
      {/* 1. CINEMATIC BACKGROUND CANVAS */}
      <HeroBackground />

      {/* Accessible heading for SEO */}
      <h1
        id="hero-heading"
        className="relative z-10 mx-auto mb-4 sm:mb-6 max-w-3xl text-center font-display text-xl sm:text-4xl font-black text-white"
      >
        GTA VI News, Characters & Fan Planning Tools
      </h1>

      {/* 2. MAIN HERO CONTENT (Centered Transparent Countdown) */}
      <div className="relative z-10 mx-auto w-full max-w-5xl 3xl:max-w-6xl 4xl:max-w-7xl flex flex-col items-center justify-center flex-1 pb-3 sm:pb-8 text-center">
        {/* Countdown in Center */}
        <div className="hero-enter w-full" style={{ animationDelay: "0.05s" }}>
          <Countdown
            className="w-full max-w-xl sm:max-w-3xl mx-auto"
            targetDate={settings?.targetReleaseDate}
            caption={settings?.countdownCaption}
            isConfirmed={settings?.isReleaseDateConfirmed}
          />
        </div>

        {/* Action Buttons Centered Below Countdown */}
        <div
          className="hero-enter flex w-full flex-wrap items-center justify-center gap-3 pt-3 sm:gap-4 sm:pt-6"
          style={{ animationDelay: "0.45s" }}
        >
          <Link
            href="/map"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 dark:from-[#00D2FF] dark:via-[#00A3FF] dark:to-[#0066FF] hover:from-sky-400 hover:to-indigo-500 dark:hover:from-[#38BDF8] dark:hover:to-[#0055EE] px-8 py-3.5 text-sm sm:text-base font-bold text-white transition-all shadow-[0_4px_20px_rgba(14,165,233,0.35)] dark:shadow-[0_0_30px_rgba(0,210,255,0.45)] hover:shadow-[0_6px_25px_rgba(14,165,233,0.5)] dark:hover:shadow-[0_0_40px_rgba(0,210,255,0.7)] active:scale-95"
          >
            <span>Explore the Atlas</span>
            <ArrowRight className="h-4 w-4 text-white" />
          </Link>

          <Link
            href="/map-explorer"
            className="hidden sm:inline-flex items-center justify-center gap-2.5 rounded-full border border-white/25 bg-black/60 hover:bg-black/80 px-8 py-3.5 text-sm sm:text-base font-bold text-white transition-all backdrop-blur-xl hover:border-[#00F0FF]/60 active:scale-95 shadow-lg"
          >
            <span>Open Map Explorer</span>
            <Map className="h-4 w-4 text-[#00F0FF]" />
          </Link>
        </div>
        {/* Optional updates after the main product links */}
        <div
          className="hero-enter hidden w-full justify-center sm:flex"
          style={{ animationDelay: "0.3s" }}
        >
          <HeroSignup />
        </div>
      </div>

      {/* 3. BOTTOM QUICK-ACCESS FEATURE BAR */}
      <div
        className="hero-enter relative z-10 hidden sm:block w-full border-t border-white/10 pt-5 mt-6 max-w-7xl mx-auto"
        style={{ animationDelay: "0.65s" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Feature 1: Latest stories */}
          <Link
            href="/news"
            className="group flex items-center gap-4 transition-colors"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400 group-hover:border-purple-400 group-hover:bg-purple-500/20 transition-all">
              <Newspaper className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                <span>Latest stories</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
              <p className="text-xs text-white/70">News, leaks and analysis</p>
            </div>
          </Link>

          {/* Feature 2: Vehicle database */}
          <Link
            href="/vehicles"
            className="group flex items-center gap-4 md:border-l md:border-white/10 md:pl-6 lg:pl-8 transition-colors"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400 group-hover:border-purple-400 group-hover:bg-purple-500/20 transition-all">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                <span>Vehicle database</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
              <p className="text-xs text-white/70">
                Cars, bikes, boats and more
              </p>
            </div>
          </Link>

          {/* Feature 3: Interactive map */}
          <Link
            href="/map"
            className="group flex items-center gap-4 md:border-l md:border-white/10 md:pl-6 lg:pl-8 transition-colors"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400 group-hover:border-purple-400 group-hover:bg-purple-500/20 transition-all">
              <Map className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                <span>Interactive map</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
              <p className="text-xs text-white/70">Explore Vice City</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
