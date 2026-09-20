"use client";

import Image from "next/image";

export function HeroBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Base dark navy background */}
      <div className="absolute inset-0 bg-[#090d16]" />

      {/* 2. Ultra-HD 4K Vice City Panoramic Artwork */}
      <div className="absolute inset-0 w-full h-full">
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

      {/* 3. Atmospheric dark overlay preserving #090d16 background tone while revealing skyline */}
      <div className="absolute inset-0 bg-[#090d16]/40" />

      {/* 4. Subtle center vignette for contrast behind centered countdown */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#090d16]/60 via-transparent to-[#090d16]/80" />

      {/* 5. Edge vignettes */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#090d16] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#090d16] to-transparent" />
    </div>
  );
}
