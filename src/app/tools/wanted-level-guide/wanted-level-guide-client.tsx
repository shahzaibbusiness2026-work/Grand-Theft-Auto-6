"use client";

import { useState, useMemo } from "react";
import {
  Star,
  ShieldAlert,
  Radar,
  Car,
  Timer,
  Lightbulb,
  Copy,
  Check,
  Info,
  Siren,
  OctagonAlert,
  Route,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type WantedLevel = {
  stars: number;
  label: string;
  response: string;
  units: string;
  helicopter: string;
  roadblocks: string;
  spikeStrips: string;
  evadeTime: string;
  evadeSeconds: number;
  tips: string[];
  intensity: number; // 0-100 for intensity bar
};

const LEVELS: WantedLevel[] = [
  {
    stars: 1,
    label: "Local Patrol",
    response:
      "A single nearby patrol unit investigates the disturbance. Officers walk up on foot or drive over slowly; pursuit is lazy and they lose interest fast.",
    units: "1-2 patrol cars",
    helicopter: "No",
    roadblocks: "No",
    spikeStrips: "No",
    evadeTime: "~30 sec",
    evadeSeconds: 30,
    tips: [
      "Break line of sight — duck behind a building or into an alley for a few seconds.",
      "Swap to a different vehicle; patrols track your current car, not you.",
    ],
    intensity: 20,
  },
  {
    stars: 2,
    label: "Increased Patrol",
    response:
      "More units converge on your position and pursuit gets aggressive. Rolling roadblocks become possible on major roads.",
    units: "3-4 patrol cars",
    helicopter: "No",
    roadblocks: "Rolling roadblocks possible",
    spikeStrips: "No",
    evadeTime: "~60 sec",
    evadeSeconds: 60,
    tips: [
      "Use alleyways and side streets to cut between blocks where cruisers can't follow.",
      "Duck into a spray shop / garage equivalent to clear your wanted level instantly.",
    ],
    intensity: 40,
  },
  {
    stars: 3,
    label: "Air Support",
    response:
      "The Leonida police helicopter joins the chase, lighting up your position for ground units. Spike strips may be deployed at chokepoints.",
    units: "5+ patrol cars + 1 helicopter",
    helicopter: "Yes — 1 helicopter",
    roadblocks: "Yes",
    spikeStrips: "Possible",
    evadeTime: "~2 min",
    evadeSeconds: 120,
    tips: [
      "Go off-road — dense trees and rough terrain shake the helicopter spotlight.",
      "Use tunnels and underpasses; the heli loses tracking overhead.",
    ],
    intensity: 60,
  },
  {
    stars: 4,
    label: "NOOSE / SWAT",
    response:
      "NOOSE tactical teams take over with armored SUVs, two helicopters, and full roadblocks across major routes. Spike strips are deployed aggressively.",
    units: "NOOSE/SWAT teams + 2 helicopters",
    helicopter: "Yes — 2 helicopters",
    roadblocks: "Yes — full roadblocks",
    spikeStrips: "Yes",
    evadeTime: "~4 min",
    evadeSeconds: 240,
    tips: [
      "Leave the Vice City core — pursuit thins out dramatically in the outskirts.",
      "Take to the water — boats are harder to box in than cars.",
    ],
    intensity: 80,
  },
  {
    stars: 5,
    label: "Maximum Response",
    response:
      "The full federal weight: FIB involvement, three helicopters, and every available unit in Leonida hunting you. Expect roadblocks everywhere and no breathing room.",
    units: "Maximum response + FIB units",
    helicopter: "Yes — 3 helicopters",
    roadblocks: "Yes — full lockdown",
    spikeStrips: "Yes",
    evadeTime: "~6 min+",
    evadeSeconds: 360,
    tips: [
      "Use train tunnels — long sightlines underground break aerial tracking.",
      "Hide in the Grassrivers swamps; dense reeds and water defeat thermal vision.",
      "Change outfits at a safehouse to reset identification.",
    ],
    intensity: 100,
  },
];

const GOLD = "#C9A86A";

export function WantedLevelGuideClient() {
  const [level, setLevel] = useState<number>(3);
  const [copied, setCopied] = useState(false);

  const current = useMemo(
    () => LEVELS.find((l) => l.stars === level) ?? LEVELS[0],
    [level]
  );

  const handleCopyIntel = () => {
    const text = `GTA 6 Wanted Level ${current.stars}-Star (${current.label})
Response: ${current.response}
Units Deployed: ${current.units}
Helicopter: ${current.helicopter}
Roadblocks: ${current.roadblocks}
Spike Strips: ${current.spikeStrips}
Estimated Evade Time: ${current.evadeTime}
Escape Tips:
${current.tips.map((t) => `- ${t}`).join("\n")}

Note: estimates based on GTA series patterns + trailer analysis; mechanics may differ at launch.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* STAR SELECTOR */}
      <div className="card-surface p-6 rounded-3xl border border-border shadow-xl">
        <h2 className="font-display text-base font-black uppercase text-foreground flex items-center gap-2 mb-1">
          <ShieldAlert className="h-4 w-4 text-primary" /> Select Wanted Level
        </h2>
        <p className="text-xs text-muted-foreground mb-5">
          Tap a star to view the police response intel for that level.
        </p>

        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {LEVELS.map((l) => (
            <button
              key={l.stars}
              onClick={() => setLevel(l.stars)}
              aria-label={`${l.stars}-star wanted level`}
              className={cn(
                "rounded-2xl border p-3 sm:p-4 transition-all flex flex-col items-center gap-1.5 min-w-[52px] sm:min-w-[72px]",
                level === l.stars
                  ? "border-primary bg-primary/10 shadow-lg scale-105"
                  : "border-border bg-muted/60 hover:border-primary/50 hover:text-foreground"
              )}
            >
              <div className="flex">
                {Array.from({ length: l.stars }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    style={{
                      color: GOLD,
                      fill: GOLD,
                    }}
                  />
                ))}
              </div>
              <span
                className={cn(
                  "text-[10px] sm:text-xs font-black uppercase tracking-wider",
                  level === l.stars ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {l.stars}-Star
              </span>
            </button>
          ))}
        </div>

        {/* INTENSITY BAR */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            <span className="flex items-center gap-1">
              <Siren className="h-3.5 w-3.5 text-primary" /> Response Intensity
            </span>
            <span className="font-mono text-foreground">{current.intensity}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/80 border border-border">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${current.intensity}%`,
                background: `linear-gradient(to right, ${GOLD}88, ${GOLD})`,
              }}
            />
          </div>
        </div>
      </div>

      {/* DETAIL CARD */}
      <div className="card-surface p-6 sm:p-8 rounded-3xl border border-border shadow-2xl bg-gradient-to-br from-card via-card to-primary/5">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-border">
          <div className="flex">
            {Array.from({ length: current.stars }).map((_, i) => (
              <Star
                key={i}
                className="h-7 w-7 sm:h-8 sm:w-8"
                style={{ color: GOLD, fill: GOLD }}
              />
            ))}
          </div>
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-black uppercase text-foreground">
              {current.stars}-Star — <span className="text-primary">{current.label}</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              All figures below are estimates
            </p>
          </div>
        </div>

        {/* Response description */}
        <p className="mt-4 text-sm leading-relaxed text-foreground/90">
          {current.response}
        </p>

        {/* Intel grid */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-border bg-muted/60 p-3.5">
            <Car className="h-4 w-4 text-primary mb-1.5" />
            <span className="block text-[10px] uppercase font-black tracking-wider text-muted-foreground">
              Units Deployed
            </span>
            <span className="font-mono text-sm font-bold text-foreground">{current.units}</span>
          </div>

          <div className="rounded-2xl border border-border bg-muted/60 p-3.5">
            <Radar className="h-4 w-4 text-primary mb-1.5" />
            <span className="block text-[10px] uppercase font-black tracking-wider text-muted-foreground">
              Helicopter
            </span>
            <span className="font-mono text-sm font-bold text-foreground">{current.helicopter}</span>
          </div>

          <div className="rounded-2xl border border-border bg-muted/60 p-3.5">
            <OctagonAlert className="h-4 w-4 text-primary mb-1.5" />
            <span className="block text-[10px] uppercase font-black tracking-wider text-muted-foreground">
              Roadblocks
            </span>
            <span className="font-mono text-sm font-bold text-foreground">{current.roadblocks}</span>
          </div>

          <div className="rounded-2xl border border-border bg-muted/60 p-3.5">
            <Route className="h-4 w-4 text-primary mb-1.5" />
            <span className="block text-[10px] uppercase font-black tracking-wider text-muted-foreground">
              Spike Strips
            </span>
            <span className="font-mono text-sm font-bold text-foreground">{current.spikeStrips}</span>
          </div>

          <div className="rounded-2xl border border-border bg-muted/60 p-3.5 col-span-2 lg:col-span-1">
            <Timer className="h-4 w-4 text-primary mb-1.5" />
            <span className="block text-[10px] uppercase font-black tracking-wider text-muted-foreground">
              Est. Evade Time
            </span>
            <span className="font-mono text-sm font-bold text-foreground">{current.evadeTime}</span>
          </div>
        </div>

        {/* Escape tips */}
        <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-5">
          <h3 className="font-display text-sm font-black uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary" /> Escape Tips
          </h3>
          <ul className="space-y-2.5">
            {current.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/90">
                <Check className="h-4 w-4 shrink-0 mt-0.5" style={{ color: GOLD }} />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Copy action */}
        <div className="mt-6 pt-4 border-t border-border">
          <Button
            onClick={handleCopyIntel}
            className="bg-muted/50 hover:bg-muted/60 text-foreground text-xs font-bold"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5 mr-1" />
            )}
            <span>{copied ? "Level Intel Copied!" : "Copy Level Intel"}</span>
          </Button>
        </div>
      </div>

      {/* DISCLAIMER */}
      <div className="card-surface p-6 rounded-3xl border border-border">
        <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2 mb-2">
          <Info className="h-4 w-4 text-primary" /> Disclaimer
        </h3>
        <p className="text-xs leading-relaxed text-muted-foreground">
          This guide is based on GTA series patterns and trailer analysis — all response details,
          unit counts, and evade times are estimates and may differ at launch. Rockstar may
          balance the wanted system before or after release.
        </p>
      </div>
    </div>
  );
}
