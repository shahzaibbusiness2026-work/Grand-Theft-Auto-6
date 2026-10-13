"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Route,
  MapPin,
  Car,
  Ship,
  Timer,
  ArrowLeftRight,
  Copy,
  Check,
  Info,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapLocation {
  id: string;
  name: string;
  region: string;
  x: number;
  y: number;
  water: boolean; // coastal / dock / keys — boat routes possible
  offroad: boolean; // swamp / mountain — off-roader recommended
}

const KM_PER_GRID_UNIT = 0.8;
const DRIVE_KMH = 90;
const BOAT_KMH = 60;

const LOCATIONS: MapLocation[] = [
  { id: "ocean-drive", name: "Vice City – Ocean Drive", region: "Vice City", x: 60, y: 55, water: true, offroad: false },
  { id: "little-cuba", name: "Vice City – Little Cuba", region: "Vice City", x: 55, y: 50, water: false, offroad: false },
  { id: "downtown-vc", name: "Vice City – Downtown", region: "Vice City", x: 58, y: 48, water: false, offroad: false },
  { id: "port-vc", name: "Vice City – Port VC", region: "Vice City", x: 62, y: 52, water: true, offroad: false },
  { id: "key-lento", name: "Leonida Keys – Key Lento", region: "Leonida Keys", x: 45, y: 72, water: true, offroad: false },
  { id: "keys-marina", name: "Leonida Keys – Marina", region: "Leonida Keys", x: 48, y: 76, water: true, offroad: false },
  { id: "airboat-tours", name: "Grassrivers – Airboat Tours", region: "Grassrivers", x: 55, y: 35, water: true, offroad: true },
  { id: "gator-farm", name: "Grassrivers – Gator Farm", region: "Grassrivers", x: 50, y: 32, water: false, offroad: true },
  { id: "motel-row", name: "Port Gellhorn – Motel Row", region: "Port Gellhorn", x: 35, y: 42, water: false, offroad: false },
  { id: "gellhorn-docks", name: "Port Gellhorn – Docks", region: "Port Gellhorn", x: 32, y: 45, water: true, offroad: false },
  { id: "sugar-refinery", name: "Ambrosia – Sugar Refinery", region: "Ambrosia", x: 48, y: 28, water: false, offroad: false },
  { id: "biker-bar", name: "Ambrosia – Biker Bar", region: "Ambrosia", x: 52, y: 30, water: false, offroad: false },
  { id: "kalaga-trailhead", name: "Mount Kalaga – Trailhead", region: "Mount Kalaga", x: 40, y: 18, water: false, offroad: true },
  { id: "kalaga-summit", name: "Mount Kalaga – Summit", region: "Mount Kalaga", x: 38, y: 15, water: false, offroad: true },
];

const REGIONS = Array.from(new Set(LOCATIONS.map((l) => l.region)));

function formatTime(hours: number): string {
  const totalMinutes = Math.round(hours * 60);
  if (totalMinutes < 1) return "Under a minute";
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m} min`;
  return `${h}h ${m}m`;
}

export function MapDistanceCalculatorClient() {
  const [fromId, setFromId] = useState<string>("ocean-drive");
  const [toId, setToId] = useState<string>("kalaga-summit");
  const [copied, setCopied] = useState(false);

  const from = useMemo(() => LOCATIONS.find((l) => l.id === fromId) ?? LOCATIONS[0], [fromId]);
  const to = useMemo(() => LOCATIONS.find((l) => l.id === toId) ?? LOCATIONS[0], [toId]);

  const results = useMemo(() => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const gridDistance = Math.sqrt(dx * dx + dy * dy);
    const km = gridDistance * KM_PER_GRID_UNIT;
    const driveHours = km / DRIVE_KMH;
    const showBoat = from.water || to.water;
    const boatHours = showBoat ? km / BOAT_KMH : null;

    let recommendation: { label: string; reason: string };
    if (from.water && to.water) {
      recommendation = {
        label: "Boat / Watercraft",
        reason: "Both points are coastal or dockside — a boat avoids the road network entirely and is the fastest option.",
      };
    } else if (from.offroad || to.offroad) {
      recommendation = {
        label: "Off-Roader (4x4)",
        reason: "The route crosses swamp or mountain terrain where supercars lose traction — bring an off-roader.",
      };
    } else {
      recommendation = {
        label: "Supercar",
        reason: "Paved Leonida roads between these points — a top-speed supercar gives the fastest drive time.",
      };
    }

    return { km, driveHours, boatHours, showBoat, recommendation };
  }, [from, to]);

  const handleSwap = () => {
    setFromId(toId);
    setToId(fromId);
  };

  const handleCopySummary = () => {
    const lines = [
      `GTA 6 Route: ${from.name} → ${to.name}`,
      `Estimated distance: ~${results.km.toFixed(1)} km`,
      `Drive time (avg ${DRIVE_KMH} km/h): ~${formatTime(results.driveHours)}`,
    ];
    if (results.boatHours !== null) {
      lines.push(`Boat time (avg ${BOAT_KMH} km/h): ~${formatTime(results.boatHours)}`);
    }
    lines.push(`Fastest vehicle: ${results.recommendation.label}`);
    navigator.clipboard
      .writeText(lines.join("\n"))
      .then(() => setCopied(true))
      .catch(() => setCopied(false));
    setTimeout(() => setCopied(false), 2000);
  };

  const selectClass =
    "w-full appearance-none rounded-xl border border-border bg-card p-3 pr-10 text-sm font-semibold text-foreground focus:border-primary focus:outline-none";

  const renderSelect = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    icon: React.ReactNode
  ) => (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
        {icon} {label}
      </label>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>
          {REGIONS.map((region) => (
            <optgroup key={region} label={region} className="bg-card text-foreground">
              {LOCATIONS.filter((l) => l.region === region).map((l) => (
                <option key={l.id} value={l.id} className="bg-card text-foreground">
                  {l.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground">
          <MapPin className="h-4 w-4" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* INPUTS COLUMN */}
        <div className="lg:col-span-5 card-surface p-6 rounded-3xl border border-border shadow-xl space-y-5">
          <h2 className="font-display text-base font-black uppercase text-foreground flex items-center gap-2 pb-3 border-b border-border">
            <Route className="h-4 w-4 text-primary" /> Route Planner
          </h2>

          {renderSelect(
            "From",
            fromId,
            setFromId,
            <MapPin className="h-3.5 w-3.5" style={{ color: "#C9A86A" }} />
          )}

          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              aria-label="Swap origin and destination"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/60 px-4 min-h-[44px] text-xs font-bold text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" /> Swap
            </button>
          </div>

          {renderSelect(
            "To",
            toId,
            setToId,
            <MapPin className="h-3.5 w-3.5" style={{ color: "#C9A86A" }} />
          )}

          <p className="text-xs leading-relaxed text-muted-foreground flex gap-1.5">
            <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            Distances are estimated from the trailer-derived fan map (1 grid unit ≈ 0.8 km). Actual in-game distances may differ.
          </p>
        </div>

        {/* OUTPUTS COLUMN */}
        <div className="lg:col-span-7 space-y-6">
          {/* Hero Result Card */}
          <div className="card-surface p-6 rounded-3xl border border-border shadow-2xl">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <span className="text-xs uppercase font-bold text-muted-foreground">Estimated Distance</span>
                <div className="font-display text-3xl sm:text-4xl font-black text-foreground mt-0.5">
                  ~{results.km.toFixed(1)} <span className="text-lg font-bold text-muted-foreground">km</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs uppercase font-bold text-muted-foreground block">Route</span>
                <span className="text-sm font-bold text-foreground">{from.name}</span>
                <span className="block text-xs text-muted-foreground">↓</span>
                <span className="text-sm font-bold text-foreground">{to.name}</span>
              </div>
            </div>

            {/* Travel Time Metrics */}
            <div className={`mt-6 grid gap-3 ${results.showBoat ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"}`}>
              <div className="rounded-2xl border border-border bg-muted/60 p-3.5 text-center">
                <Car className="h-4 w-4 text-primary mx-auto mb-1" />
                <span className="font-mono text-lg font-black text-foreground block">{formatTime(results.driveHours)}</span>
                <span className="block text-xs uppercase font-bold text-muted-foreground">Drive ({DRIVE_KMH} km/h avg)</span>
              </div>

              {results.boatHours !== null && (
                <div className="rounded-2xl border border-border bg-muted/60 p-3.5 text-center">
                  <Ship className="h-4 w-4 text-primary mx-auto mb-1" />
                  <span className="font-mono text-lg font-black text-foreground block">{formatTime(results.boatHours)}</span>
                  <span className="block text-xs uppercase font-bold text-muted-foreground">Boat ({BOAT_KMH} km/h avg)</span>
                </div>
              )}

              <div className="rounded-2xl border border-border bg-muted/60 p-3.5 text-center">
                <Timer className="h-4 w-4 mx-auto mb-1" style={{ color: "#C9A86A" }} />
                <span className="font-mono text-lg font-black text-foreground block">
                  {formatTime(Math.min(results.driveHours, results.boatHours ?? Infinity))}
                </span>
                <span className="block text-xs uppercase font-bold text-muted-foreground">Fastest Option</span>
              </div>
            </div>

            {/* Vehicle Recommendation */}
            <div className="mt-4 rounded-2xl border border-primary/30 bg-primary/5 p-4 flex gap-3">
              {from.water && to.water ? (
                <Ship className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              ) : (
                <Car className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              )}
              <div>
                <h3 className="text-sm font-black uppercase tracking-wide text-foreground">
                  Recommended: <span className="text-primary">{results.recommendation.label}</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{results.recommendation.reason}</p>
              </div>
            </div>

            {/* Copy action */}
            <div className="mt-6 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
              <Button
                onClick={handleCopySummary}
                className="bg-muted/50 hover:bg-muted/60 text-foreground text-xs font-bold"
              >
                {copied ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                <span>{copied ? "Route Summary Copied!" : "Copy Route Summary"}</span>
              </Button>

              <Link
                href="/tools"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-foreground transition-colors"
              >
                <span>Browse All Tools</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Mini Map Visual */}
          <div className="card-surface p-6 rounded-3xl border border-border">
            <h3 className="font-display text-base font-bold uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Fan Map Overview
            </h3>
            <div className="relative w-full aspect-square rounded-2xl border border-border bg-muted/40 overflow-hidden">
              {/* faint grid */}
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
                  backgroundSize: "10% 10%",
                }}
              />
              {LOCATIONS.map((l) => {
                const isEndpoint = l.id === fromId || l.id === toId;
                return (
                  <div
                    key={l.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${l.x}%`, top: `${100 - l.y}%` }}
                    title={l.name}
                  >
                    <MapPin
                      className={isEndpoint ? "h-5 w-5" : "h-3 w-3 opacity-50"}
                      style={isEndpoint ? { color: "#C9A86A" } : { color: "var(--muted-foreground)" }}
                    />
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              Gold markers show your selected route. Positions are approximate fan-map estimates, not official Rockstar coordinates.
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="card-surface p-6 rounded-3xl border border-border">
        <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2 mb-2">
          <Info className="h-4 w-4 text-primary" /> Disclaimer
        </h3>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Distances are estimated from the trailer-derived fan map and should be treated as rough planning guides only —
          actual in-game distances, road layouts, and travel times may differ at launch. Speeds used are averages (drive {DRIVE_KMH} km/h,
          boat {BOAT_KMH} km/h) and do not account for traffic, police attention, or off-road slowdowns.
        </p>
      </div>
    </div>
  );
}
