"use client";

import Image from "next/image";

/**
 * Fixed hero artwork — NO daily rotation (changed Nov 2026 at the owner's
 * request). Every visitor always sees the same scene. First fixed to the
 * official Leonida key art, then switched Nov 2026 to the Vice City
 * skyline: the key art's faces sat right behind the centered countdown,
 * while the skyline's center is clean sky and water, so nothing overlaps
 * the timer. Full-bleed, never changes on its own.
 */
const FIXED_SCENE = {
  src: "/img/hero-vice-skyline-hd.jpg",
  label: "Vice City Skyline",
  alt: "GTA VI Vice City skyline and muscle car",
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

      {/* 3. Atmospheric overlay preserving readability, plus a soft
          center scrim so the white countdown never fights a bright sky. */}
      <div className="absolute inset-0 bg-black/10 transition-colors duration-300" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.28),transparent_68%)]" />

      {/* 3b. Ambient neon drift — slow Vice City glow (pink + cyan) */}
      <div className="hero-neon-a absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#FF2E9A]/20 blur-[110px]" />
      <div className="hero-neon-b absolute -right-32 bottom-8 h-[26rem] w-[26rem] rounded-full bg-[#00F0FF]/15 blur-[120px]" />

      {/* 4. Subtle center vignette for contrast behind centered countdown */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 transition-all duration-300" />

    </div>
  );
}
