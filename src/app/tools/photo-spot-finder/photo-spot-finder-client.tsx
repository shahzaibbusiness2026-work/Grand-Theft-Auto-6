"use client";

import { useState, useMemo } from "react";
import {
  Camera,
  SunMoon,
  Copy,
  Check,
  MapPin,
  Lightbulb,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Region =
  | "Vice City"
  | "Leonida Keys"
  | "Grassrivers"
  | "Port Gellhorn"
  | "Ambrosia"
  | "Mount Kalaga";

interface PhotoSpot {
  name: string;
  region: Region;
  bestTime: string;
  description: string;
  tip: string;
}

const SPOTS: PhotoSpot[] = [
  {
    name: "Ocean Drive Neon Strip",
    region: "Vice City",
    bestTime: "Night 21:00–02:00 game time",
    description: "The legendary beachfront strip bathed in neon — hotel signs and club lights reflect off the wet asphalt after rain for that perfect cinematic glow.",
    tip: "Wait for a rain storm to pass, then shoot from the median at a low angle to catch the full neon reflections.",
  },
  {
    name: "Leonida Keys Pier",
    region: "Leonida Keys",
    bestTime: "Sunrise 05:45–06:30 game time",
    description: "Weathered stilt houses stand over glassy morning water as the sun breaks the horizon — the calmest, most atmospheric framing in the game.",
    tip: "Swim out past the pier and frame back toward the houses so the sun flares between the stilts.",
  },
  {
    name: "Grassrivers Airboat Run",
    region: "Grassrivers",
    bestTime: "Golden hour 17:30–18:45 game time",
    description: "An airboat kicking up a curtain of spray through sawgrass channels, with gators watching from the reeds — pure Florida energy.",
    tip: "Switch to slow-mo camera as the boat banks hard; the spray trail photographs like fireworks.",
  },
  {
    name: "Mount Kalaga Summit",
    region: "Mount Kalaga",
    bestTime: "Sunset 18:30–19:15 game time",
    description: "The highest vantage point in Leonida — a full panoramic sweep over the entire state as the sun drops into the Everglades haze.",
    tip: "Face west toward Port Gellhorn and use the widest FOV; city lights start blinking on below as dusk settles.",
  },
  {
    name: "Port Gellhorn Docks",
    region: "Port Gellhorn",
    bestTime: "Blue hour 19:15–20:00 game time",
    description: "Container ship silhouettes and crane arms against a deep indigo sky — industrial scale that makes any character shot feel epic.",
    tip: "Climb a stacked container near the harbor mouth to get the ship, cranes, and skyline in one layered frame.",
  },
  {
    name: "Ambrosia Sugar Fields",
    region: "Ambrosia",
    bestTime: "Midday 11:00–14:00 game time",
    description: "Endless cane rows under a huge dome of sky — harsh noon light here is a feature, not a bug, giving razor-sharp symmetrical compositions.",
    tip: "Line the dirt road down the center of the frame and stand on a truck bed for a vanishing-point shot.",
  },
  {
    name: "Vice Beach Boardwalk",
    region: "Vice City",
    bestTime: "Sunrise 06:00–07:15 game time",
    description: "Joggers, roller skaters, and palms in long morning shadows — the pastel lifeguard towers pop against a peach sky.",
    tip: "Sprint along the boardwalk until NPC activity clusters, then crouch and shoot at tower height for a lifestyle-magazine look.",
  },
  {
    name: "Stockyard Rooftops",
    region: "Vice City",
    bestTime: "Night 22:00–01:00 game time",
    description: "Skyline panorama with the stadium lights blazing on the horizon — the best wide establishing shot in Vice City.",
    tip: "Position so the stadium floodlights sit just off-center; the light bloom balances the dark rooftop foreground.",
  },
];

const REGIONS: ("All" | Region)[] = [
  "All",
  "Vice City",
  "Leonida Keys",
  "Grassrivers",
  "Port Gellhorn",
  "Ambrosia",
  "Mount Kalaga",
];

export function PhotoSpotFinderClient() {
  const [regionFilter, setRegionFilter] = useState<"All" | Region>("All");
  const [copied, setCopied] = useState(false);

  const filteredSpots = useMemo(
    () =>
      regionFilter === "All"
        ? SPOTS
        : SPOTS.filter((s) => s.region === regionFilter),
    [regionFilter]
  );

  const handleCopyRunList = () => {
    const lines = SPOTS.map(
      (s, i) =>
        `${i + 1}. [ ] ${s.name} — ${s.region} — best at ${s.bestTime}\n    Tip: ${s.tip}`
    );
    const summary = `GTA 6 PHOTO RUN LIST (8 spots)\n\n${lines.join("\n\n")}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Region Filter Pills */}
      <div className="card-surface p-4 rounded-2xl border border-border flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-2 flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-gold-light" /> Region:
        </span>
        {REGIONS.map((r) => (
          <button
            key={r}
            onClick={() => setRegionFilter(r)}
            className={cn(
              "rounded-xl px-3 py-1.5 text-xs font-semibold transition-all border min-h-[44px]",
              regionFilter === r
                ? "border-accent bg-accent/20 text-foreground font-bold shadow-sm"
                : "border-border bg-muted/60 text-muted-foreground hover:border-border hover:text-foreground"
            )}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Spots Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredSpots.map((spot) => (
          <div
            key={spot.name}
            className="card-surface p-5 rounded-3xl border border-border shadow-xl flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-2">
              <Camera className="h-5 w-5 text-cyan-600 dark:text-[#00F0FF] shrink-0 mt-0.5" />
              <span className="rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-gold-light">
                {spot.region}
              </span>
            </div>

            <h2 className="font-display text-base font-black uppercase text-foreground leading-tight">
              {spot.name}
            </h2>

            <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted/60 border border-border px-2.5 py-1.5 text-xs font-semibold text-foreground w-fit">
              <SunMoon className="h-3.5 w-3.5 text-gold-light" />
              {spot.bestTime}
            </span>

            <p className="text-xs leading-relaxed text-muted-foreground flex-1">
              {spot.description}
            </p>

            <div className="rounded-xl border border-border bg-muted/60 p-3">
              <p className="text-xs text-muted-foreground italic flex items-start gap-1.5">
                <Lightbulb className="h-3.5 w-3.5 text-gold-light shrink-0 mt-0.5 not-italic" />
                {spot.tip}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Copy Run List */}
      <div className="card-surface p-6 rounded-3xl border border-border flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-base font-bold uppercase tracking-wider text-foreground">
            Take all 8 spots with you
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Copy the full photo run as a checklist — region, best time, and pro tip for every stop.
          </p>
        </div>
        <Button onClick={handleCopyRunList} className="min-h-[44px]">
          {copied ? (
            <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" />
          ) : (
            <Copy className="h-3.5 w-3.5 mr-1" />
          )}
          <span>{copied ? "Run List Copied!" : "Copy photo run list"}</span>
        </Button>
      </div>

      {/* Disclaimer */}
      <div className="card-surface p-5 rounded-3xl border border-border flex items-start gap-3">
        <Info className="h-4 w-4 text-cyan-600 dark:text-[#00F0FF] shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          Locations are based on trailer footage and official map reveals — treat them as estimates until
          the game launches. Region boundaries and in-game names may change at release.
        </p>
      </div>
    </div>
  );
}
