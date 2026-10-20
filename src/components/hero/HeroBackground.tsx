"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Daily-rotating hero artwork.
 *
 * Every visitor sees the SAME scene on a given day: the scene is chosen
 * deterministically from the calendar date, so the background changes at
 * local midnight with no cron job, no API call, and no cache busting.
 *
 * The server renders scene[0] (matches the pre-mount HTML, no hydration
 * mismatch); after mount the client swaps to today's scene with a fade.
 * An open tab also re-checks at the next local midnight.
 */
const SCENES = [
  {
    src: "/img/hero-vice-skyline-hd.jpg",
    label: "Vice City Skyline",
    alt: "GTA VI Vice City skyline and muscle car",
  },
  {
    src: "/img/gta6-hero-official.webp",
    label: "Welcome to Leonida",
    alt: "GTA VI Leonida key art",
  },
  {
    src: "/img/hero-dark.jpg",
    label: "Vice City Nights",
    alt: "Vice City at night",
  },
  {
    src: "/img/gta6-hero-clean-hd.jpg",
    label: "Leonida Coast",
    alt: "Leonida coastline artwork",
  },
  {
    src: "/img/trailer-keys-marina.webp",
    label: "The Leonida Keys",
    alt: "Boat marina in the Leonida Keys, from the GTA VI trailer",
  },
  {
    src: "/img/trailer-vault-heli.webp",
    label: "The Vault Job",
    alt: "Helicopter over the city during a heist, from the GTA VI trailer",
  },
  {
    src: "/img/trailer-jason-marina.webp",
    label: "Brian's Marina",
    alt: "Jason at Brian's marina, from the GTA VI trailer",
  },
] as const;

const DAY_MS = 86_400_000;

function todaysIndex(): number {
  return Math.floor(Date.now() / DAY_MS) % SCENES.length;
}

export function HeroBackground() {
  const [idx, setIdx] = useState(0);
  const scene = SCENES[idx];

  useEffect(() => {
    const update = () => setIdx(todaysIndex());
    update();

    // Rotate an already-open page at the next local midnight.
    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      2,
    );
    const timer = setTimeout(update, nextMidnight.getTime() - now.getTime());
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Base background: adapts to light/dark */}
      <div className="absolute inset-0 bg-slate-100 dark:bg-[#090d16] transition-colors duration-300" />

      {/* 2. Daily-rotating scene (key forces a fade on change) */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          key={scene.src}
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
      <div className="absolute inset-0 bg-black/35 transition-colors duration-300" />

      {/* 4. Subtle center vignette for contrast behind centered countdown */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 transition-all duration-300" />

      {/* 5. Edge vignettes */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />

      {/* 6. Today's scene caption — hidden on small screens */}
      <div className="absolute right-4 top-4 hidden sm:flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3.5 py-1.5 backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-white/75">
          Today in Leonida — {scene.label}
        </span>
      </div>
    </div>
  );
}
