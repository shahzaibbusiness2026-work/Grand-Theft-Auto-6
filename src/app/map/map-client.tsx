import mapStyles from "@/components/map-workspace.module.css";

import Link from "next/link";
import { Compass, Radio, ChevronRight } from "lucide-react";
import { SatelliteInteractiveMap } from "@/components/satellite-interactive-map";

const DISTRICT_GUIDES = [
  {
    name: "Vice City Downtown",
    desc: "The glittering neon metropolis of Leonida. High-rise penthouses, corporate headquarters, luxury dealerships, and intense underground syndicates.",
    img: "/img/apartment.jpg",
    tags: ["Safehouses", "Luxury Showrooms", "Ammu-Nation"],
  },
  {
    name: "Ocean Drive & South Beach",
    desc: "Sun-soaked beachfront strips, art-deco hotels, waterfront mod garages, and iconic late-night clubs like The Malibú.",
    img: "/img/garage.jpg",
    tags: ["Mod Shops", "Nightclubs", "Waterfront"],
  },
  {
    name: "Leonida Keys",
    desc: "Vast archipelago of tropical islands, shallow coral reefs, smuggler marinas, hidden sunken caches, and coastal bank branches.",
    img: "/img/boat.jpg",
    tags: ["Speedboats", "Submerged Loot", "Heists"],
  },
  {
    name: "Grassrivers Marshlands",
    desc: "Expansive untamed swamplands, wildlife sanctuaries, abandoned military silos, and mysterious extraterrestrial graffiti murals.",
    img: "/img/ufo-mural.jpg",
    tags: ["Easter Eggs", "Airboats", "Wild Fauna"],
  },
  {
    name: "Port Gellhorn & Industrial",
    desc: "Heavy shipping cargo docks, industrial railyards, underground safehouses, container yards, and high-caliber weapon caches.",
    img: "/img/smg-gun.jpg",
    tags: ["Cargo Depots", "Weapons", "Escape Routes"],
  },
  {
    name: "Mount Kalaga National Park",
    desc: "Forested mountain wilderness, ranger stations, off-road trails, and panoramic lookouts. Confirmed as GTA 6's northern wilderness region.",
    img: "",
    tags: ["Stunt Jumps", "Lookouts", "Off-Road"],
  },
  {
    name: "Ambrosia",
    desc: "Rural inland heartland with farmland, small towns, and backroad Americana. A quieter corner of Leonida with hidden secrets.",
    img: "/img/garage.jpg",
    tags: ["Farms", "Small Towns", "Backroads"],
  },
];

export function MapClient() {
  return (
    <div className="overflow-x-clip">
      {/* Top Breadcrumb & Page Banner */}
      <div
        className={`dark-panel ${mapStyles.darkSurface} border-b border-white/10 bg-gradient-to-b from-[#0e0717] via-[#070b14] to-[#04070f] pt-8 pb-8`}
      >
        <div className="container-site">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-4">
            <Link href="/" className="hover:text-gold transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
            <span className="text-gold dark:text-gold-light font-bold">
              Interactive Map
            </span>
            <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
            <span className="text-slate-100">Leonida Satellite Atlas</span>
          </nav>

          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-gold dark:text-gold-light mb-3">
                <Radio className="h-3 w-3 animate-pulse" /> Fan-made Interactive
                Atlas
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-white">
                GTA 6 LEONIDA{" "}
                <span className="text-primary">INTERACTIVE MAP</span>
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-300 font-medium">
                Explore a fan-made Leonida map illustration. All pins are
                provisional concepts: placement, availability, hours, rewards
                and gameplay have not passed field-specific evidence review.
              </p>
            </div>

            {/* Quick Stat Chips */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-2.5 backdrop-blur-md">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Coverage
                </span>
                <span className="font-display text-lg font-black text-white">
                  Statewide
                </span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-2.5 backdrop-blur-md">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Evidence
                </span>
                <span className="font-display text-lg font-black text-[#00F0FF]">
                  Labelled per pin
                </span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-2.5 backdrop-blur-md">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Districts</span>
                <span className="font-display text-lg font-black text-gold-light">7 Districts</span>
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
      <div
        className="container-site pb-20 pt-8 border-t border-border"
        style={{
          contentVisibility: "auto",
          containIntrinsicSize: "auto 1000px",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gold dark:text-gold-light mb-1">
              <Compass className="h-3.5 w-3.5" /> Regional Intel
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-foreground tracking-wide">
              Districts of Leonida
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Explore official region background separately from speculative pin
              placement and gameplay.
            </p>
          </div>
          <Link
            href="/tracker"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-foreground hover:text-foreground hover:border-gold/50 transition-all"
          >
            <span>Open Progress Tracker</span>
            <ChevronRight className="h-3.5 w-3.5 text-gold dark:text-gold-light" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DISTRICT_GUIDES.map((d) => (
            <div
              key={d.name}
              className="group rounded-3xl border border-white/10 bg-[#070c18] overflow-hidden transition-all hover:-translate-y-1 hover:border-gold/50 hover:shadow-2xl flex flex-col"
            >
              <div className="relative h-44 overflow-hidden bg-black/60">
                {d.img ? (
                  <img loading="lazy"
                    src={d.img}
                    alt={d.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-[#070c18] via-transparent to-black/30" />
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-display text-lg font-black uppercase text-white drop-shadow-md">
                    {d.name}
                  </h3>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs leading-relaxed text-slate-300 font-medium">
                  Editorial region concept. Precise locations, services,
                  missions and mechanics remain unverified.
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {d.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-lg bg-white/5 border border-white/10 px-2 py-0.5 text-xs font-semibold text-slate-400"
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
    </div>
  );
}
