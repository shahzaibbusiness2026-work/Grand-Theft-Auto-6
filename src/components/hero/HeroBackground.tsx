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
 * Server and client both initialise to today's scene (same UTC-day
 * formula), so the first paint is already correct — no post-load swap.
 * An open tab crossfades to the next scene at rotation time.
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
  // Initialise with TODAY's scene on both server and client, so the first
  // paint is already correct — no post-load swap that reads as a refresh.
  const [baseIdx, setBaseIdx] = useState<number>(() => todaysIndex());
  const [incomingIdx, setIncomingIdx] = useState<number | null>(null);
  const [incomingReady, setIncomingReady] = useState(false);
  const scene = SCENES[baseIdx];
  const incoming = incomingIdx !== null ? SCENES[incomingIdx] : null;

  useEffect(() => {
    const update = () => {
      const t = todaysIndex();
      if (t !== baseIdx && t !== incomingIdx) {
        setIncomingReady(false);
        setIncomingIdx(t);
      }
    };
    update();

    // Rotate an already-open page: check at the next local midnight, then hourly.
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
    const hourly = setInterval(update, 3_600_000);
    return () => {
      clearTimeout(timer);
      clearInterval(hourly);
    };
  }, [baseIdx, incomingIdx]);

  // Once the incoming scene has fully faded in, promote it to the base layer.
  useEffect(() => {
    if (incomingIdx === null || !incomingReady) return;
    const t = setTimeout(() => {
      setBaseIdx(incomingIdx);
      setIncomingIdx(null);
      setIncomingReady(false);
    }, 1100);
    return () => clearTimeout(t);
  }, [incomingIdx, incomingReady]);

  return (
    <div
      className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Base background: adapts to light/dark */}
      <div className="absolute inset-0 bg-slate-100 dark:bg-[#090d16] transition-colors duration-300" />

      {/* 2. Today's scene (base layer — correct from first paint) */}
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

      {/* 2b. Incoming scene (midnight rotation only): crossfades OVER the base
          once fully loaded, so the background never pops or vanishes. */}
      {incoming && (
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={incoming.src}
            alt={incoming.alt}
            fill
            quality={80}
            sizes="100vw"
            onLoad={() => setIncomingReady(true)}
            style={{
              opacity: incomingReady ? 1 : 0,
              transition: "opacity 1000ms ease",
            }}
            className="object-cover object-center hero-bg-kenburns"
          />
        </div>
      )}

      {/* 3. Atmospheric overlay preserving readability */}
      <div className="absolute inset-0 bg-black/35 transition-colors duration-300" />

      {/* 3b. Ambient neon drift — slow Vice City glow (pink + cyan) */}
      <div className="hero-neon-a absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#FF2E9A]/20 blur-[110px]" />
      <div className="hero-neon-b absolute -right-32 bottom-8 h-[26rem] w-[26rem] rounded-full bg-[#00F0FF]/15 blur-[120px]" />

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
