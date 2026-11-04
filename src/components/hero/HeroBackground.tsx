"use client";

import Image from "next/image";

/**
 * Fixed hero artwork — NO daily rotation (changed Nov 2026 at the owner's
 * request). Every visitor always sees the same scene: the official
 * "Welcome to Leonida" key art, full-bleed. The old 7-scene calendar
 * rotation (midnight crossfade, hourly checks) is deliberately removed,
 * so the home hero never changes on its own again.
 */
const FIXED_SCENE = {
  src: "/img/gta6-hero-official.webp",
  label: "Welcome to Leonida",
  alt: "GTA VI Leonida key art",
} as const;

export function HeroBackground() {
  const scene = FIXED_SCENE;

  return (
    <div
      className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Base background: always black, behind the full-bleed image. */}
      <div className="absolute inset-0 bg-black" />

      {/* 2. Today's scene (base layer — correct from first paint).
          Full-bleed (object-cover): the image fills the whole hero width
          and height. This crops the top/bottom on wide screens instead of
          leaving side bars — the full-width look requested Nov 2026,
          superseding the earlier object-contain fit. */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={scene.src}
          alt={scene.alt}
          fill
          priority
          quality={80}
          sizes="100vw"
          className="object-cover object-center hero-bg-img"
        />
      </div>

      {/* 3. Atmospheric overlay preserving readability */}
      <div className="absolute inset-0 bg-black/15 transition-colors duration-300" />

      {/* 3b. Ambient neon drift — slow Vice City glow (pink + cyan) */}
      <div className="hero-neon-a absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#FF2E9A]/20 blur-[110px]" />
      <div className="hero-neon-b absolute -right-32 bottom-8 h-[26rem] w-[26rem] rounded-full bg-[#00F0FF]/15 blur-[120px]" />

      {/* 4. Subtle center vignette for contrast behind centered countdown */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 transition-all duration-300" />

      {/* 5. Edge vignettes */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />

    </div>
  );
}
