"use client";

import Image from "next/image";

export function HeroBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Base background: adapts to light/dark */}
      <div className="absolute inset-0 bg-slate-100 dark:bg-[#090d16] transition-colors duration-300" />

      {/* 2. Ultra-HD 4K Vice City Panoramic Artwork */}
      <div className="absolute inset-0 w-full h-full opacity-35 dark:opacity-100 transition-opacity duration-300">
        <Image
          src="/img/hero-vice-skyline-hd.jpg"
          alt="GTA VI Vice City Skyline and Muscle Car"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover object-right lg:object-center"
        />
      </div>

      {/* 3. Atmospheric overlay preserving readability */}
      <div className="absolute inset-0 bg-white/65 dark:bg-[#090d16]/25 transition-colors duration-300" />

      {/* 4. Subtle center vignette for contrast behind centered countdown */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-white/90 dark:from-[#090d16]/40 dark:via-transparent dark:to-[#090d16]/70 transition-all duration-300" />

      {/* 5. Edge vignettes */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
