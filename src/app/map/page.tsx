"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Compass,
  Radio,
  Maximize2,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Layers,
  Search,
  Crosshair,
  Building2,
  Car,
  Home,
  CheckCircle2,
} from "lucide-react";
import { SiteShell } from "@/components/shells";
import { SatelliteInteractiveMap } from "@/components/satellite-interactive-map";
import { Button } from "@/components/ui/button";

const DISTRICT_GUIDES = [
  {
    name: "Vice City Downtown",
    desc: "The glittering neon metropolis of Leonida. High-rise penthouses, corporate headquarters, luxury dealerships, and intense underground syndicates.",
    pois: 58,
    missions: 24,
    collectibles: 32,
    threat: "High Police Activity",
    img: "/img/apartment.jpg",
    tags: ["Safehouses", "Luxury Showrooms", "Ammu-Nation"],
  },
  {
    name: "Ocean Drive & South Beach",
    desc: "Sun-soaked beachfront strips, art-deco hotels, waterfront mod garages, and iconic late-night clubs like The Malibú.",
    pois: 46,
    missions: 18,
    collectibles: 28,
    threat: "Medium Patrols",
    img: "/img/garage.jpg",
    tags: ["Mod Shops", "Nightclubs", "Waterfront"],
  },
  {
    name: "Leonida Keys",
    desc: "Vast archipelago of tropical islands, shallow coral reefs, smuggler marinas, hidden sunken caches, and coastal bank branches.",
    pois: 38,
    missions: 14,
    collectibles: 35,
    threat: "Coastguard Patrols",
    img: "/img/boat.jpg",
    tags: ["Speedboats", "Submerged Loot", "Heists"],
  },
  {
    name: "Grassrivers Marshlands",
    desc: "Expansive untamed swamplands, wildlife sanctuaries, abandoned military silos, and mysterious extraterrestrial graffiti murals.",
    pois: 42,
    missions: 16,
    collectibles: 41,
    threat: "Wildlife & Smugglers",
    img: "/img/ufo-mural.jpg",
    tags: ["Easter Eggs", "Airboats", "Wild Fauna"],
  },
  {
    name: "Port Gellhorn & Industrial",
    desc: "Heavy shipping cargo docks, industrial railyards, underground safehouses, container yards, and high-caliber weapon caches.",
    pois: 36,
    missions: 12,
    collectibles: 24,
    threat: "Private Security",
    img: "/img/smg-gun.jpg",
    tags: ["Cargo Depots", "Weapons", "Escape Routes"],
  },
  {
    name: "Northern Wilds",
    desc: "Mountain ridge lookouts, off-road logging trails, winding switchback highways, and extreme high-altitude stunt jump ramps.",
    pois: 32,
    missions: 11,
    collectibles: 19,
    threat: "Remote / Low",
    img: "/img/hero-dark.jpg",
    tags: ["Stunt Jumps", "Fire Lookouts", "Off-Road"],
  },
];

export default function MapPage() {
  const [fullscreenMode, setFullscreenMode] = useState(false);

  return (
    <SiteShell>
      {/* Top Breadcrumb & Page Banner */}
      <div className="border-b border-white/10 bg-gradient-to-b from-[#0e0717] via-[#070b14] to-[#04070f] pt-8 pb-8">
        <div className="container-site">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-4">
            <Link href="/" className="hover:text-amber-500 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
            <span className="text-amber-500 dark:text-amber-400 font-bold">Interactive Map</span>
            <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
            <span className="text-foreground">Leonida Satellite Atlas</span>
          </nav>

          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-500 dark:text-amber-400 mb-3">
                <Radio className="h-3 w-3 animate-pulse" /> Official Interactive Radar
              </div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                LEONIDA STATE <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 bg-clip-text text-transparent">SATELLITE ATLAS</span>
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-300 font-medium">
                Explore every street, island, mission, weapon cache, mod garage, and hidden easter egg across the entire state of Leonida in Ultra-HD 4K reconnaissance.
              </p>
            </div>

            {/* Quick Stat Chips */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-2.5 backdrop-blur-md">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Total POIs</span>
                <span className="font-display text-lg font-black text-white">312 Verified</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-2.5 backdrop-blur-md">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Resolution</span>
                <span className="font-display text-lg font-black text-[#00F0FF]">Ultra-HD 4K</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-2.5 backdrop-blur-md">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Districts</span>
                <span className="font-display text-lg font-black text-amber-400">6 Regions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="container-site py-6 sm:py-8">
        <SatelliteInteractiveMap />
      </div>

      {/* Regional Exploration Guides */}
      <div className="container-site pb-20 pt-8 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-500 dark:text-amber-400 mb-1">
              <Compass className="h-3.5 w-3.5" /> Regional Intel
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-white tracking-wide">
              Districts of Leonida
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Detailed breakdown of verified mission targets, collectibles, and points of interest by region
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-200 hover:text-white hover:border-amber-500/50 transition-all"
          >
            <span>Open 100% Progress Tracker</span>
            <ChevronRight className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DISTRICT_GUIDES.map((d) => (
            <div
              key={d.name}
              className="group rounded-3xl border border-white/10 bg-[#070c18] overflow-hidden transition-all hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-2xl flex flex-col"
            >
              <div className="relative h-44 overflow-hidden bg-black/60">
                <img
                  src={d.img}
                  alt={d.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070c18] via-transparent to-black/30" />
                <span className="absolute top-3 right-3 rounded-full bg-black/80 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-400 border border-emerald-500/30 backdrop-blur">
                  {d.threat}
                </span>
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-display text-lg font-black uppercase text-white drop-shadow-md">
                    {d.name}
                  </h3>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs leading-relaxed text-slate-300 font-medium">
                  {d.desc}
                </p>

                {/* Stat row */}
                <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-black/40 p-3 text-center">
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-400">POIs</span>
                    <span className="font-mono text-sm font-black text-white">{d.pois}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-400">Missions</span>
                    <span className="font-mono text-sm font-black text-amber-400">{d.missions}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-400">Secrets</span>
                    <span className="font-mono text-sm font-black text-[#00F0FF]">{d.collectibles}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {d.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-lg bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-semibold text-slate-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
