"use client";

/**
 * GTA VI Clean HD Panoramic Artwork Background
 * Ultra-high definition artwork with zero baked-in text or logos.
 * Spreads edge-to-edge across any viewport and handles zoom-out gracefully.
 */

export function HeroBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Theme-Adaptive Base Canvas */}
      <div className="absolute inset-0 bg-background transition-colors duration-300" />

      {/* 2. Tactical Leonida Satellite Coordinate Grid (Adapts to light/dark) */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_60%,transparent_100%)] transition-opacity duration-300"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
          color: "var(--foreground)",
        }}
      />

      {/* 3. Volumetric Vice City Sunset & Ocean Blooms */}
      <div className="absolute -top-32 -left-20 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-amber-500/15 dark:from-amber-500/20 via-orange-600/10 dark:via-orange-600/15 to-transparent blur-[140px] animate-pulse-glow" />
      <div className="absolute top-1/4 -right-24 h-[560px] w-[560px] rounded-full bg-gradient-to-bl from-cyan-500/12 dark:from-cyan-500/18 via-blue-600/10 dark:via-blue-600/15 to-transparent blur-[160px]" />
      <div className="absolute -bottom-24 left-1/3 h-[460px] w-[460px] rounded-full bg-gradient-to-tr from-amber-600/10 dark:from-amber-600/15 via-orange-500/08 dark:via-orange-500/10 to-transparent blur-[150px]" />

      {/* 4. Cinematic Edge Vignettes using Theme Background */}
      <div className="absolute inset-x-0 top-0 h-16 sm:h-20 bg-gradient-to-b from-background via-background/80 to-transparent transition-colors duration-300" />
      <div className="absolute inset-x-0 bottom-0 h-16 sm:h-20 bg-gradient-to-t from-background via-background/90 to-transparent transition-colors duration-300" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-500/25 dark:via-amber-500/35 to-transparent" />
    </div>
  );
}
