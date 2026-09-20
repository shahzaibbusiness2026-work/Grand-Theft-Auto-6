"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Minus,
  LocateFixed,
  Maximize2,
  ArrowRight,
  Layers,
  Sparkles,
  MapPin,
  Crosshair,
  Warehouse,
  Home,
  Gem,
  Star,
  Egg,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PREVIEW_PINS = [
  { id: "p-ammu", name: "Ammu-Nation", district: "Downtown Vice", top: "44%", left: "48%", color: "bg-amber-500", icon: Crosshair },
  { id: "p-garage", name: "Ocean Drive Garage", district: "Ocean Beach", top: "56%", left: "63%", color: "bg-cyan-500", icon: Warehouse },
  { id: "p-suite", name: "Ocean View Suite", district: "Vice City", top: "66%", left: "55%", color: "bg-sky-500", icon: Home },
  { id: "p-cache", name: "Hidden Cache #12", district: "Biscayne Reef", top: "72%", left: "50%", color: "bg-purple-500", icon: Gem },
  { id: "p-stunt", name: "Stunt Jump #8", district: "Causeway", top: "52%", left: "39%", color: "bg-amber-500", icon: Star },
  { id: "p-ufo", name: "UFO Mural", district: "Grassrivers", top: "29%", left: "66%", color: "bg-emerald-500", icon: Egg },
  { id: "p-heist", name: "Keys Bank Heist", district: "Leonida Keys", top: "68%", left: "41%", color: "bg-orange-500", icon: Star },
];

/**
 * Clean, cinematic HD Satellite Map for the Homepage.
 * Displays the high-definition map with smooth zoom controls and interactive pins,
 * with a prominent link to open the full detailed interactive map page.
 */
export function HomeSatelliteMap() {
  const [zoom, setZoom] = useState(1);
  const [satelliteMode, setSatelliteMode] = useState(true);
  const [activePin, setActivePin] = useState<string | null>("p-ammu");

  const handleZoom = (delta: number) => {
    setZoom((prev) => {
      const next = +(prev + delta).toFixed(2);
      return Math.min(2.4, Math.max(0.85, next));
    });
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-border bg-card shadow-[0_24px_60px_rgba(0,0,0,0.85)]">
      {/* Top Floating HUD Bar */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-black/75 px-5 py-3.5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00F0FF]" />
          </span>
          <span className="font-display text-xs font-black uppercase tracking-[0.25em] text-white">
            LEONIDA SATELLITE RADAR
          </span>
          <span className="hidden font-mono text-[11px] text-cyan-400/80 sm:inline-block">
            25°46&apos;31&quot;N 80°11&apos;32&quot;W // HD 4K
          </span>
        </div>

        {/* View Full Map Action Button */}
        <Link
          href="/map"
          className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 px-4 py-2 font-display text-xs font-black uppercase tracking-wider text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(245,158,11,0.55)]"
        >
          <span>Open Fullscreen Map</span>
          <Maximize2 className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
        </Link>
      </div>

      {/* Map Viewport */}
      <div className="relative h-[520px] sm:h-[620px] lg:h-[700px] w-full overflow-hidden select-none cursor-grab active:cursor-grabbing bg-[#020408]">
        <div
          className="relative h-full w-full transition-transform duration-300 ease-out origin-center flex items-center justify-center"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Ultra-HD Satellite Map */}
          <img
            src="/img/satellite-map-hd.jpg"
            alt="Leonida & Vice City High Definition Satellite Map"
            className={cn(
              "h-full w-full object-cover select-none pointer-events-none transition-all duration-300",
              !satelliteMode && "invert hue-rotate-180 brightness-90 saturate-150"
            )}
          />

          {/* Interactive Preview Pins */}
          {PREVIEW_PINS.map((p) => {
            const isSelected = activePin === p.id;
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => setActivePin(p.id)}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group focus:outline-none transition-transform hover:scale-125"
                style={{ top: p.top, left: p.left }}
                aria-label={p.name}
              >
                {isSelected && (
                  <span className="absolute -inset-2.5 rounded-full border-2 border-white bg-amber-500/40 animate-ping" />
                )}
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-white shadow-[0_0_14px_rgba(0,0,0,0.9)] transition-all",
                    p.color,
                    isSelected && "ring-4 ring-white scale-125 shadow-[0_0_20px_#f59e0b]"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>

                {/* Pin Tooltip */}
                <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-black/90 px-2.5 py-1 text-[11px] font-bold text-white shadow-xl backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-amber-400 font-black">{p.name}</span>
                  <span className="text-slate-400 block text-[9px] font-medium">{p.district}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Zoom Controls (Bottom Right) */}
        <div className="absolute right-5 bottom-6 z-20 flex flex-col gap-1.5 rounded-2xl border border-white/15 bg-black/80 p-1.5 backdrop-blur-xl shadow-2xl">
          <button
            onClick={() => handleZoom(0.25)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white hover:bg-white/20 transition-colors"
            aria-label="Zoom In"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleZoom(-0.25)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white hover:bg-white/20 transition-colors"
            aria-label="Zoom Out"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white hover:bg-white/20 transition-colors"
            aria-label="Reset Zoom"
          >
            <LocateFixed className="h-4 w-4" />
          </button>
        </div>

        {/* View Toggle (Bottom Left) */}
        <button
          onClick={() => setSatelliteMode((v) => !v)}
          className="absolute bottom-6 left-5 z-20 flex items-center gap-2.5 rounded-2xl border border-white/15 bg-black/80 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-xl shadow-2xl hover:bg-white/20 transition-colors"
        >
          <Layers className="h-4 w-4 text-amber-400" />
          <span>{satelliteMode ? "Switch to Tactical" : "Switch to Satellite"}</span>
        </button>

        {/* Floating Callout Bottom Banner */}
        <div className="absolute inset-x-5 bottom-20 sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:w-auto z-20 pointer-events-none">
          <Link
            href="/map"
            className="pointer-events-auto inline-flex items-center gap-3 rounded-2xl border border-border bg-card/90 px-5 py-3 text-xs font-semibold text-foreground shadow-2xl backdrop-blur-2xl transition-all hover:border-amber-500/60 hover:scale-105"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-500 dark:text-amber-400">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span>
              Click to view all <strong>312 POIs</strong>, missions, weapons & progress on the full map
            </span>
            <ArrowRight className="h-4 w-4 text-amber-500 dark:text-amber-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}
