"use client";

import { useState, useEffect, useMemo, Fragment } from "react";
import Link from "next/link";
import {
  Trophy,
  Plus,
  X,
  Share2,
  Check,
  ArrowLeftRight,
  Search,
  RotateCcw,
  ChevronRight,
  Lightbulb,
  TrendingUp,
  Zap,
  Ruler,
  Car,
  Bike,
  Ship,
  Plane,
  Truck,
  LayoutGrid,
} from "lucide-react";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { canonicalVehicles, CanonicalVehicle } from "@/lib/canonical-data";
import type { VehicleScoreWeights } from "@/lib/scoring";
import { computeVehicleScore, getVehicleBestFor, DEFAULT_VEHICLE_WEIGHTS } from "@/lib/scoring";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FavoriteButton } from "@/components/favorite-button";
import { RadarChart, RADAR_COLORS } from "@/components/radar-chart";
import { ComparisonTable, type ComparisonRowDef } from "@/components/comparison-table";
import { EstimatedDataNote } from "@/components/estimated-data-note";

interface CompareVehiclesClientProps {
  initialSlugs?: string[];
  /** Live catalog (DB + canonical merge) passed from the server page; falls back to bundled data. */
  vehicles?: CanonicalVehicle[];
  /** CMS-configured overall-score weights. */
  weights?: VehicleScoreWeights;
}

/** Stored top speeds are mph; the redesign displays km/h like the reference layout. */
const toKmh = (mph: number) => Math.round(mph * 1.60934);
const fmtPrice = (n: number) => `$${n.toLocaleString()}`;

export function CompareVehiclesClient({ initialSlugs, vehicles, weights }: CompareVehiclesClientProps) {
  const vehicleList = vehicles && vehicles.length > 0 ? vehicles : canonicalVehicles;

  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(() => {
    if (initialSlugs && initialSlugs.length >= 2) return initialSlugs.slice(0, 4);
    return ["grotti-visione", "pfister-comet-s2"];
  });

  const [copied, setCopied] = useState(false);
  const [pickerSlotIndex, setPickerSlotIndex] = useState<number | null>(null);

  // Finder filters (left sidebar). These filter the picker candidates.
  const [search, setSearch] = useState("");
  const [klassFilter, setKlassFilter] = useState("");
  const [speedMin, setSpeedMin] = useState(0);
  const [speedMax, setSpeedMax] = useState(400);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(5000000);
  const [seatsFilter, setSeatsFilter] = useState(0); // 0 = Any, 1, 2, 4 = 4+
  const [manufacturerFilter, setManufacturerFilter] = useState("");
  const [driveFilter, setDriveFilter] = useState("");

  const filtersActive =
    search !== "" ||
    klassFilter !== "" ||
    speedMin > 0 ||
    speedMax < 400 ||
    priceMin > 0 ||
    priceMax < 5000000 ||
    seatsFilter !== 0 ||
    manufacturerFilter !== "" ||
    driveFilter !== "";

  const resetFilters = () => {
    setSearch("");
    setKlassFilter("");
    setSpeedMin(0);
    setSpeedMax(400);
    setPriceMin(0);
    setPriceMax(5000000);
    setSeatsFilter(0);
    setManufacturerFilter("");
    setDriveFilter("");
  };

  // Read URL params on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const vParam = params.get("v");
      if (vParam) {
        const slugs = vParam.split(",").filter((s) => vehicleList.some((v) => v.slug === s || v.id === s));
        if (slugs.length >= 2) {
          setSelectedSlugs(slugs.slice(0, 4));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The reference layout is designed dark. next-themes stores the theme on
  // <html> (:root carries the dark palette, .light overrides it), so a nested
  // .dark wrapper cannot flip it — force the document theme while mounted
  // and restore the visitor's theme on unmount.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const hadLight = root.classList.contains("light");
    const hadDark = root.classList.contains("dark");
    root.classList.remove("light");
    root.classList.add("dark");
    return () => {
      root.classList.remove("dark");
      if (hadLight) root.classList.add("light");
      else if (hadDark) root.classList.add("dark");
    };
  }, []);

  // Sync selected to URL
  const syncToUrl = (slugs: string[]) => {
    if (typeof window !== "undefined") {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("v", slugs.join(","));
        window.history.replaceState({}, "", url.toString());
      } catch {}
    }
  };

  const selectedVehicles: CanonicalVehicle[] = useMemo(() => {
    return selectedSlugs
      .map((slug) => vehicleList.find((v) => v.slug === slug || v.id === slug))
      .filter((v): v is CanonicalVehicle => v !== undefined);
  }, [selectedSlugs, vehicleList]);

  const handleRemoveVehicle = (index: number) => {
    if (selectedSlugs.length <= 2) return; // Keep minimum 2
    const next = selectedSlugs.filter((_, i) => i !== index);
    setSelectedSlugs(next);
    syncToUrl(next);
  };

  const handleSelectVehicleForSlot = (slug: string) => {
    if (pickerSlotIndex === null) return;
    const next = [...selectedSlugs];
    if (pickerSlotIndex < next.length) {
      next[pickerSlotIndex] = slug;
    } else {
      next.push(slug);
    }
    const deduplicated = Array.from(new Set(next));
    setSelectedSlugs(deduplicated);
    syncToUrl(deduplicated);
    setPickerSlotIndex(null);
  };

  const handleSwapFirstTwo = () => {
    if (selectedSlugs.length < 2) return;
    const next = [...selectedSlugs];
    [next[0], next[1]] = [next[1], next[0]];
    setSelectedSlugs(next);
    syncToUrl(next);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      const shareUrl = `${window.location.origin}/compare/vehicles?v=${selectedSlugs.join(",")}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Finder data: real counts / options computed from the catalog, never hardcoded.
  // Some DB rows use plural klass spellings ("Boats", "Motorcycles"); normalize them
  // so they merge with the canonical singular classes instead of doubling up.
  const normKlass = (k: string) => (k === "Boats" ? "Boat" : k === "Motorcycles" ? "Motorcycle" : k);
  const klassIcon = (k: string) => {
    const n = normKlass(k);
    if (n === "Motorcycle" || n === "Dirt Bike") return Bike;
    if (n === "Boat") return Ship;
    if (n === "Helicopter" || n === "Plane") return Plane;
    if (n === "Van" || n === "Commercial") return Truck;
    return Car;
  };
  const klassCounts = useMemo(() => {
    const map = new Map<string, number>();
    vehicleList.forEach((v) => {
      const nk = normKlass(v.klass);
      map.set(nk, (map.get(nk) ?? 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [vehicleList]);

  const manufacturers = useMemo(
    () => Array.from(new Set(vehicleList.map((v) => v.manufacturer).filter(Boolean))).sort(),
    [vehicleList]
  );

  const drivetrains = useMemo(
    () =>
      Array.from(
        new Set(vehicleList.map((v) => (v as { drivetrain?: string }).drivetrain).filter(Boolean) as string[])
      ).sort(),
    [vehicleList]
  );

  const filteredCandidates = useMemo(() => {
    const q = search.trim().toLowerCase();
    return vehicleList.filter((v) => {
      if (q !== "" && !`${v.name} ${v.manufacturer}`.toLowerCase().includes(q)) return false;
      if (klassFilter !== "" && normKlass(v.klass) !== klassFilter) return false;
      const kmh = toKmh(v.topSpeed);
      if (kmh < speedMin || kmh > speedMax) return false;
      const price = v.price ?? 0;
      if (price < priceMin || price > priceMax) return false;
      if (seatsFilter === 1 && v.seating !== 1) return false;
      if (seatsFilter === 2 && v.seating !== 2) return false;
      if (seatsFilter === 4 && (v.seating ?? 0) < 4) return false;
      if (manufacturerFilter !== "" && v.manufacturer !== manufacturerFilter) return false;
      if (driveFilter !== "" && (v as { drivetrain?: string }).drivetrain !== driveFilter) return false;
      return true;
    });
  }, [vehicleList, search, klassFilter, speedMin, speedMax, priceMin, priceMax, seatsFilter, manufacturerFilter, driveFilter]);

  // CMS-weighted Overall Scores + Best-For tags
  const overallScores = useMemo(
    () => selectedVehicles.map((v) => computeVehicleScore(v, weights)),
    [selectedVehicles, weights]
  );
  const overallScoreLeader = useMemo(() => {
    if (overallScores.length === 0) return null;
    return overallScores.indexOf(Math.max(...overallScores));
  }, [overallScores]);
  const bestForTags = useMemo(
    () => selectedVehicles.map((v) => getVehicleBestFor(v)),
    [selectedVehicles]
  );
  const effectiveWeights = weights ?? DEFAULT_VEHICLE_WEIGHTS;

  // Radar chart data (acceleration inverted so higher = better on the chart)
  const radarSeries = useMemo(
    () =>
      selectedVehicles.map((v, i) => ({
        name: v.name,
        color: RADAR_COLORS[i % RADAR_COLORS.length],
        values: [
          Math.min(100, Math.max(0, ((v.topSpeed - 80) / 150) * 100)),
          Math.min(100, Math.max(0, ((6.5 - v.acceleration) / 5) * 100)),
          v.braking,
          v.handling,
          v.traction ?? 70,
          Math.min(100, Math.max(0, ((v.price || 0) > 0 ? Math.sqrt(2000000 / v.price!) * 30 : 30))),
        ],
      })),
    [selectedVehicles]
  );

  const parseWeightNum = (s: string) => {
    const n = parseFloat(s.replace(/,/g, ""));
    return Number.isFinite(n) ? n : null;
  };

  // Screenshot-style stat table: Stat | cars (value + bar) | Winner.
  const tableRows: ComparisonRowDef[] = useMemo(() => {
    if (selectedVehicles.length < 2) return [];
    const winnerMax = (vals: number[]) => {
      const valid = vals.filter((v) => v != null) as number[];
      if (valid.length === 0 || new Set(valid).size === 1) return null;
      return vals.indexOf(Math.max(...valid));
    };
    const winnerMin = (vals: (number | null)[]) => {
      const valid = vals.filter((v): v is number => v != null);
      if (valid.length === 0 || new Set(valid).size === 1) return null;
      return vals.indexOf(Math.min(...(valid as number[])));
    };
    const kmhVals = selectedVehicles.map((v) => toKmh(v.topSpeed));
    const accelVals = selectedVehicles.map((v) => v.acceleration);
    const handlingVals = selectedVehicles.map((v) => v.handling);
    const brakingVals = selectedVehicles.map((v) => v.braking);
    const powerVals = selectedVehicles.map((v) => v.power);
    const weightVals = selectedVehicles.map((v) => parseWeightNum(v.weight || ""));
    const priceVals = selectedVehicles.map((v) => v.price ?? null);
    const seatVals = selectedVehicles.map((v) => v.seating ?? 0);

    return [
      {
        label: "Overall Score",
        values: overallScores.map((s) => `${s}/100 est.`),
        bars: overallScores,
        winnerIndex: new Set(overallScores).size === 1 ? null : overallScores.indexOf(Math.max(...overallScores)),
      },
      {
        label: "Top Speed",
        values: kmhVals.map((k) => `${k} km/h est.`),
        bars: kmhVals.map((k) => (k / 400) * 100),
        winnerIndex: winnerMax(kmhVals),
      },
      {
        label: "Acceleration (0–60)",
        values: accelVals.map((a) => `${a}s est.`),
        bars: accelVals.map((a) => ((6.5 - a) / 5) * 100),
        winnerIndex: winnerMin(accelVals),
      },
      {
        label: "Handling",
        values: handlingVals.map((h) => `${h}/100 est.`),
        bars: handlingVals,
        winnerIndex: winnerMax(handlingVals),
      },
      {
        label: "Braking",
        values: brakingVals.map((b) => `${b}/100 est.`),
        bars: brakingVals,
        winnerIndex: winnerMax(brakingVals),
      },
      {
        label: "Horsepower",
        values: powerVals.map((p) => `${p} HP est.`),
        bars: powerVals.map((p) => Math.min(100, p / 10)),
        winnerIndex: winnerMax(powerVals),
      },
      {
        label: "Weight",
        values: selectedVehicles.map((v) => (v.weight ? `${v.weight} est.` : "Not confirmed")),
        winnerIndex: winnerMin(weightVals),
      },
      {
        label: "Seats",
        values: seatVals.map((s) => String(s)),
        winnerIndex: winnerMax(seatVals),
      },
      {
        label: "Price",
        values: selectedVehicles.map((v) => (v.priceDisplay ? `${v.priceDisplay} est.` : "Not confirmed")),
        winnerIndex: winnerMin(priceVals),
      },
    ];
  }, [selectedVehicles, overallScores]);

  // Key takeaways: computed from the real numbers, leader-based so they work for 2–4 cars.
  const takeaways = useMemo(() => {
    if (selectedVehicles.length < 2) return [];
    const lines: string[] = [];
    const lead = (
      vals: number[],
      better: "max" | "min",
      text: (w: CanonicalVehicle, diff: number | null) => string
    ) => {
      const sorted = [...vals].sort((a, b) => (better === "max" ? b - a : a - b));
      if (sorted[0] === sorted[1]) return; // tied at the top
      const wi = vals.indexOf(sorted[0]);
      const diff = selectedVehicles.length === 2 ? Math.abs(sorted[0] - sorted[1]) : null;
      lines.push(text(selectedVehicles[wi], diff));
    };
    lead(
      selectedVehicles.map((v) => toKmh(v.topSpeed)),
      "max",
      (w, diff) =>
        diff != null
          ? `${w.name} is ${diff} km/h faster at top speed`
          : `${w.name} has the highest top speed (${toKmh(w.topSpeed)} km/h est.)`
    );
    lead(
      selectedVehicles.map((v) => v.acceleration),
      "min",
      (w) => `${w.name} launches quickest (0–60 in ${w.acceleration}s est.)`
    );
    lead(
      selectedVehicles.map((v) => v.handling),
      "max",
      (w) => `${w.name} handles corners most smoothly`
    );
    lead(
      selectedVehicles.map((v) => v.braking),
      "max",
      (w) => `${w.name} brakes hardest`
    );
    lead(
      selectedVehicles.map((v) => v.power),
      "max",
      (w) => `${w.name} brings the most horsepower (${w.power} HP est.)`
    );
    const weightVals = selectedVehicles.map((v) => parseWeightNum(v.weight || ""));
    if (weightVals.every((w) => w != null)) {
      lead(weightVals as number[], "min", (w) => `${w.name} is the lightest of the group`);
    }
    const priceVals = selectedVehicles.map((v) => v.price ?? null);
    if (priceVals.every((p) => p != null)) {
      lead(priceVals as number[], "min", (w) => `${w.name} offers the best value at ${w.priceDisplay}`);
    }
    const seatVals = selectedVehicles.map((v) => v.seating ?? 0);
    if (new Set(seatVals).size === 1) {
      lines.push(`All selected vehicles seat ${seatVals[0]}`);
    } else {
      lead(seatVals, "max", (w) => `${w.name} seats the most (${w.seating})`);
    }
    return lines.slice(0, 8);
  }, [selectedVehicles]);

  // Speed & acceleration chart: illustrative curves drawn from the two known numbers
  // per car (0–60 time and top speed). Never measured telemetry.
  const speedChart = useMemo(() => {
    const W = 640;
    const H = 300;
    const padL = 44;
    const padR = 12;
    const padT = 12;
    const padB = 28;
    const x = (t: number) => padL + (t / 20) * (W - padL - padR);
    const y = (s: number) => padT + (1 - s / 400) * (H - padT - padB);
    const series = selectedVehicles.map((v, i) => {
      const topKmh = toKmh(v.topSpeed);
      const accel = v.acceleration;
      const k = topKmh > 100 ? -Math.log(1 - 97 / topKmh) / Math.max(accel, 0.5) : 2 / Math.max(accel, 0.5);
      const pts: string[] = [];
      for (let t = 0; t <= 20; t += 0.5) {
        pts.push(`${x(t).toFixed(1)},${y(topKmh * (1 - Math.exp(-k * t))).toFixed(1)}`);
      }
      const marker =
        topKmh > 100 ? { mx: x(accel), my: y(97), dy: i % 2 === 0 ? -8 : 18, label: `0–60: ${accel}s` } : null;
      return { name: v.name, color: RADAR_COLORS[i % RADAR_COLORS.length], points: pts.join(" "), marker };
    });
    return { W, H, x, y, series };
  }, [selectedVehicles]);

  // Special features (✓ / ✗) across all selected vehicles
  const featureUnion = useMemo(() => {
    const set = new Set<string>();
    selectedVehicles.forEach((v) => (v.features || []).forEach((f) => set.add(f)));
    return Array.from(set);
  }, [selectedVehicles]);
  const featureMatrix = useMemo(
    () =>
      featureUnion.map((f) => ({
        feature: f,
        present: selectedVehicles.map((v) => (v.features || []).includes(f) || (f === "Weaponized" && !!v.weaponized)),
      })),
    [featureUnion, selectedVehicles]
  );

  const winnerVehicle = overallScoreLeader != null ? selectedVehicles[overallScoreLeader] : null;
  const winnerScore = overallScoreLeader != null ? overallScores[overallScoreLeader] : null;
  const powerLeader =
    selectedVehicles.length > 1 && new Set(selectedVehicles.map((v) => v.power)).size > 1
      ? selectedVehicles.indexOf(selectedVehicles.reduce((a, b) => (b.power > a.power ? b : a)))
      : null;
  const weightNums = selectedVehicles.map((v) => parseWeightNum(v.weight || ""));
  const lightestIdx =
    selectedVehicles.length > 1 &&
    weightNums.every((w) => w != null) &&
    new Set(weightNums).size > 1
      ? weightNums.indexOf(Math.min(...(weightNums as number[])))
      : null;

  return (
    <div className="space-y-8">
      <EstimatedDataNote />

      {/* Selected slots + swap + add + share */}
      <div className="card-surface rounded-3xl border border-border p-5">
        <div className="flex flex-wrap items-center gap-3">
          {selectedVehicles.map((v, idx) => (
            <Fragment key={v.id}>
              {idx === 1 && (
                <button
                  onClick={handleSwapFirstTwo}
                  title="Swap the first two vehicles"
                  aria-label="Swap the first two vehicles"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#FF2E9A] to-[#00B4FF] text-white shadow-lg shadow-[#FF2E9A]/30 transition hover:scale-105"
                >
                  <ArrowLeftRight className="h-5 w-5" />
                </button>
              )}
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/50 py-2 pl-2 pr-2.5">
                <button
                  onClick={() => setPickerSlotIndex(idx)}
                  className="flex items-center gap-3 text-left"
                  title="Change this vehicle"
                >
                  <img
                    loading="lazy"
                    src={v.img}
                    alt={v.name}
                    style={v.filter ? { filter: v.filter } : undefined}
                    className="h-11 w-16 rounded-xl object-cover"
                  />
                  <span>
                    <span className="block text-sm font-black text-foreground">{v.name}</span>
                    <span className="block text-xs font-bold text-muted-foreground">{v.klass}</span>
                  </span>
                </button>
                {selectedVehicles.length > 2 && (
                  <button
                    onClick={() => handleRemoveVehicle(idx)}
                    aria-label={`Remove ${v.name}`}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </Fragment>
          ))}
          {selectedSlugs.length < 4 && (
            <Button
              onClick={() => setPickerSlotIndex(selectedSlugs.length)}
              className="bg-muted/50 hover:bg-muted/60 text-foreground font-bold text-sm min-h-[44px]"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Vehicle
            </Button>
          )}
          <Button
            onClick={handleShare}
            className="bg-gradient-to-r from-[#FF2E9A] to-[#00B4FF] text-white font-bold text-sm shadow-md min-h-[44px]"
          >
            {copied ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-300" /> : <Share2 className="h-3.5 w-3.5 mr-1" />}
            <span>{copied ? "Link Copied!" : "Share Comparison URL"}</span>
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Comparing {selectedVehicles.length} of up to 4 vehicles. Tap a vehicle above to swap it, use the
          ⇄ button to swap the first two, or narrow the picker with the finder on the left.
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Finder sidebar */}
        <aside className="card-surface rounded-3xl border border-border p-5 lg:sticky lg:top-24">
          <h2 className="font-display text-base font-black text-foreground">Find &amp; Compare Vehicles</h2>

          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vehicles..."
              aria-label="Search vehicles"
              className="w-full rounded-xl border border-border bg-muted/50 py-2.5 pl-9 pr-3 text-sm font-bold text-foreground placeholder:font-normal placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="mt-5 space-y-1">
            <button
              onClick={() => setKlassFilter("")}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-bold transition",
                klassFilter === "" ? "bg-gradient-to-r from-[#FF2E9A] to-[#00B4FF] text-white" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <span className="flex items-center gap-2"><LayoutGrid className="h-4 w-4" />All Vehicles</span>
              <span className="tabular-nums text-xs opacity-80">{vehicleList.length}</span>
            </button>
            {klassCounts.map(([klass, count]) => {
              const Icon = klassIcon(klass);
              return (
                <button
                  key={klass}
                  onClick={() => setKlassFilter(klass)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-bold transition",
                    klassFilter === klass ? "bg-gradient-to-r from-[#FF2E9A] to-[#00B4FF] text-white" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <span className="flex items-center gap-2"><Icon className="h-4 w-4" />{klass}s</span>
                  <span className="tabular-nums text-xs opacity-80">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 space-y-4 border-t border-border pt-5">
            <div>
              <div className="flex items-center justify-between text-sm font-bold text-foreground">
                <span>Top Speed (km/h)</span>
                <span className="tabular-nums text-xs text-muted-foreground">
                  {speedMin} – {speedMax}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={400}
                step={5}
                value={speedMin}
                onChange={(e) => setSpeedMin(Math.min(Number(e.target.value), speedMax))}
                aria-label="Minimum top speed in km/h"
                className="mt-2 w-full accent-pink-500"
              />
              <input
                type="range"
                min={0}
                max={400}
                step={5}
                value={speedMax}
                onChange={(e) => setSpeedMax(Math.max(Number(e.target.value), speedMin))}
                aria-label="Maximum top speed in km/h"
                className="w-full accent-pink-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-sm font-bold text-foreground">
                <span>Price Range</span>
                <span className="tabular-nums text-xs text-muted-foreground">
                  {fmtPrice(priceMin)} – {fmtPrice(priceMax)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={5000000}
                step={50000}
                value={priceMin}
                onChange={(e) => setPriceMin(Math.min(Number(e.target.value), priceMax))}
                aria-label="Minimum price"
                className="mt-2 w-full accent-pink-500"
              />
              <input
                type="range"
                min={0}
                max={5000000}
                step={50000}
                value={priceMax}
                onChange={(e) => setPriceMax(Math.max(Number(e.target.value), priceMin))}
                aria-label="Maximum price"
                className="w-full accent-pink-500"
              />
            </div>

            <div>
              <span className="text-sm font-bold text-foreground">Seats</span>
              <div className="mt-2 flex gap-1.5">
                {[
                  { value: 0, label: "Any" },
                  { value: 1, label: "1" },
                  { value: 2, label: "2" },
                  { value: 4, label: "4+" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSeatsFilter(opt.value)}
                    className={cn(
                      "flex-1 rounded-lg py-2 text-sm font-black transition",
                      seatsFilter === opt.value
                        ? "bg-gradient-to-r from-[#FF2E9A] to-[#00B4FF] text-white"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="drive-filter" className="text-sm font-bold text-foreground">
                Drive Type
              </label>
              <select
                id="drive-filter"
                value={driveFilter}
                onChange={(e) => setDriveFilter(e.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-muted/50 px-3 py-2.5 text-sm font-bold text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">All Types</option>
                {drivetrains.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="manufacturer-filter" className="text-sm font-bold text-foreground">
                Manufacturer
              </label>
              <select
                id="manufacturer-filter"
                value={manufacturerFilter}
                onChange={(e) => setManufacturerFilter(e.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-muted/50 px-3 py-2.5 text-sm font-bold text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">All Manufacturers</option>
                {manufacturers.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={resetFilters}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-muted/40 py-2.5 text-sm font-bold text-foreground transition hover:bg-muted/60"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
            </button>
            <p className="text-center text-xs text-muted-foreground">
              {filteredCandidates.length} of {vehicleList.length} vehicles match the finder
              {filtersActive ? " — the picker shows only matches" : ""}
            </p>
          </div>
        </aside>

        {/* Main column */}
        <div className="min-w-0 space-y-6">
          {/* Vehicle cards */}
          <div
            className={cn(
              "grid gap-4",
              selectedVehicles.length === 2
                ? "grid-cols-1 md:grid-cols-[1fr_auto_1fr]"
                : selectedVehicles.length === 3
                  ? "grid-cols-1 md:grid-cols-3"
                  : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
            )}
          >
            {selectedVehicles.map((v, idx) => {
              const isWinner = overallScoreLeader === idx;
              return (
                <Fragment key={v.id}>
                  {selectedVehicles.length === 2 && idx === 1 && (
                    <div className="hidden items-center justify-center md:flex" aria-hidden="true">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#FF2E9A] to-[#00B4FF] text-lg font-black text-white shadow-lg shadow-[#FF2E9A]/40">
                        VS
                      </span>
                    </div>
                  )}
                  <div
                    className={cn(
                      "card-surface relative flex flex-col rounded-3xl border p-4 transition-all",
                      isWinner ? "border-gold-light/60 shadow-[0_0_24px_rgba(251,191,36,0.15)]" : "border-border"
                    )}
                  >
                    <div className="relative h-48 overflow-hidden rounded-2xl border border-border bg-black/60">
                      <img
                        loading="lazy"
                        src={v.img}
                        alt={v.name}
                        style={v.filter ? { filter: v.filter } : undefined}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute bottom-2 left-2 rounded-lg bg-black/80 px-2 py-0.5 text-sm font-bold text-accent backdrop-blur">
                        {v.klass}
                      </span>
                      <span className="absolute right-2 top-2">
                        <FavoriteButton type="vehicles" id={v.id} showText={false} />
                      </span>
                      {isWinner && (
                        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-gold-light/90 px-2 py-0.5 text-xs font-black text-black">
                          <Trophy className="h-3 w-3" /> Best Choice
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col pt-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display truncate text-lg font-black text-foreground">{v.name}</h3>
                      </div>
                      <span className="tabular-nums mt-0.5 text-base font-black text-[#FF2E9A]">
                        {v.priceDisplay ?? "Price not listed"}
                      </span>
                      <span className="text-sm text-muted-foreground">{v.manufacturer}</span>
                      <div className="mt-2">
                        <ConfidenceBadge level={v.confidence} size="sm" />
                      </div>
                      {bestForTags[idx]?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {bestForTags[idx].map((t) => (
                            <span
                              key={t.label}
                              className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-xs font-black text-accent"
                            >
                              {t.emoji} {t.label}
                            </span>
                          ))}
                        </div>
                      )}
                      {overallScores[idx] != null && (
                        <div className="mt-2 flex items-center justify-between rounded-xl border border-gold/30 bg-gold-light/10 px-2.5 py-1.5">
                          <span className="flex items-center gap-1 text-sm font-black text-gold-dark dark:text-amber-300">
                            <Trophy className="h-3 w-3" /> Overall Score
                          </span>
                          <span className="tabular-nums text-sm font-black text-gold-dark dark:text-gold-light">
                            {overallScores[idx]}/100 est.
                            {isWinner && overallScores.length > 1 && (
                              <span className="ml-1.5 text-sm font-black text-emerald-600 dark:text-emerald-400">Lead</span>
                            )}
                          </span>
                        </div>
                      )}
                      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-4">
                        <Link
                          href={`/vehicles/${v.slug}`}
                          className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-border bg-muted/40 py-2.5 text-sm font-bold text-foreground transition hover:bg-muted/60"
                        >
                          View Details <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Fragment>
              );
            })}
          </div>

          {/* Quick Verdict */}
          {winnerVehicle && winnerScore != null && (
            <div className="dark-panel relative overflow-hidden rounded-3xl border border-gold/30 bg-[#0a0f1d] p-6 shadow-2xl">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-gold-light" />
                <h3 className="font-display text-lg font-black text-white">Quick Verdict</h3>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {selectedVehicles.map((v, i) => (
                  <div key={v.id}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-black text-white">{v.name}</span>
                      <span className="tabular-nums font-black text-white">{overallScores[i]}/100 est.</span>
                    </div>
                    <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${Math.min(100, Math.max(0, overallScores[i]))}%`, backgroundColor: RADAR_COLORS[i % RADAR_COLORS.length] }}
                      />
                    </div>
                    {bestForTags[i]?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {bestForTags[i].map((t) => (
                          <span key={t.label} className="rounded-md bg-white/10 px-2 py-0.5 text-xs font-bold text-white/80">
                            {t.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-gold-light/40 bg-gold-light/10 p-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-light/40 bg-gold-light/10 px-3 py-1 text-xs font-black text-amber-300">
                  <Trophy className="h-3.5 w-3.5 text-gold-light" /> Pre-Release Estimated Winner
                </span>
                <p className="mt-2 text-sm leading-relaxed text-white/85">
                  <strong className="text-white">Winner for Most Players: {winnerVehicle.name}.</strong> Based on
                  combined top speed, acceleration, handling, braking, traction and features, it leads the field
                  with {winnerScore}/100 estimated points.
                </p>
                <p className="mt-2 text-xs leading-relaxed text-white/60">
                  Scores are pre-release estimates computed from estimated stats (Overall Score = Top Speed{" "}
                  {effectiveWeights.topSpeed}%, Acceleration {effectiveWeights.acceleration}%, Handling{" "}
                  {effectiveWeights.handling}%, Braking {effectiveWeights.braking}%, Traction {effectiveWeights.traction}%,
                  Features {effectiveWeights.features}%), not measured in-game performance.
                </p>
              </div>
            </div>
          )}

          {/* Overall Stats Comparison */}
          {tableRows.length > 0 && (
            <div>
              <h3 className="font-display mb-3 flex items-center gap-2 text-lg font-black text-foreground">
                Overall Stats Comparison
              </h3>
              <ComparisonTable
                contenders={selectedVehicles.map((v, i) => ({ name: v.name, color: RADAR_COLORS[i % RADAR_COLORS.length] }))}
                rows={tableRows}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Top speeds are converted from the stored mph values to km/h. All figures are pre-release estimates.
              </p>
            </div>
          )}

          {/* Radar + Key Takeaways */}
          {selectedVehicles.length >= 2 && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="card-surface rounded-3xl border border-border p-5">
                <h3 className="font-display mb-1 text-lg font-black text-foreground">Performance Radar Chart</h3>
                <p className="mb-3 text-sm text-muted-foreground">
                  Speed • Acceleration • Braking • Handling • Traction • Value
                </p>
                <RadarChart
                  axes={["Speed", "Accel", "Braking", "Handling", "Traction", "Value"]}
                  series={radarSeries}
                />
              </div>

              <div className="card-surface rounded-3xl border border-border p-5">
                <h3 className="font-display mb-3 flex items-center gap-2 text-lg font-black text-foreground">
                  <Lightbulb className="h-5 w-5 text-gold-light" /> Key Takeaways
                </h3>
                {takeaways.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    The selected vehicles are tied across every headline stat.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {takeaways.map((line) => (
                      <li key={line} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                          <Check className="h-3 w-3" />
                        </span>
                        {line}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Speed chart + Engine + Dimensions */}
          <div className="grid gap-6 xl:grid-cols-3">
            <div className="card-surface rounded-3xl border border-border p-5">
              <h3 className="font-display mb-1 flex items-center gap-2 text-base font-black text-foreground">
                <TrendingUp className="h-5 w-5 text-accent" /> Speed &amp; Acceleration
              </h3>
              <p className="mb-3 text-xs text-muted-foreground">Speed (km/h) over time (seconds)</p>
              <svg
                viewBox={`0 0 ${speedChart.W} ${speedChart.H}`}
                role="img"
                aria-label="Illustrative speed over time chart"
                className="w-full"
              >
                {[100, 200, 300, 400].map((s) => (
                  <g key={s}>
                    <line x1={44} x2={628} y1={speedChart.y(s)} y2={speedChart.y(s)} stroke="currentColor" className="text-border" strokeWidth={0.6} />
                    <text x={38} y={speedChart.y(s)} textAnchor="end" dominantBaseline="middle" fontSize={10} className="fill-current text-muted-foreground">
                      {s}
                    </text>
                  </g>
                ))}
                {[0, 5, 10, 15, 20].map((t) => (
                  <text key={t} x={speedChart.x(t)} y={speedChart.H - 8} textAnchor="middle" fontSize={10} className="fill-current text-muted-foreground">
                    {t}s
                  </text>
                ))}
                {speedChart.series.map((s) => (
                  <g key={s.name}>
                    <polyline points={s.points} fill="none" stroke={s.color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
                    {s.marker && (
                      <g>
                        <circle cx={s.marker.mx} cy={s.marker.my} r={4.5} fill={s.color} stroke="white" strokeWidth={1.5} />
                        <text x={s.marker.mx + 8} y={s.marker.my + s.marker.dy} fontSize={12} fontWeight={700} fill={s.color}>
                          {s.marker.label}
                        </text>
                      </g>
                    )}
                  </g>
                ))}
              </svg>
              <div className="mt-2 flex flex-wrap gap-3">
                {speedChart.series.map((s) => (
                  <span key={s.name} className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
                    {s.name}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Illustrative curves drawn from each car&apos;s 0–60 time and top speed — not measured telemetry.
              </p>
            </div>

            <div className="card-surface rounded-3xl border border-border p-5">
              <h3 className="font-display mb-3 flex items-center gap-2 text-base font-black text-foreground">
                <Zap className="h-5 w-5 text-accent" /> Engine &amp; Power
              </h3>
              <dl className="divide-y divide-border text-sm">
                {[
                  { label: "Engine Type", value: "Not confirmed", crown: null },
                  {
                    label: "Horsepower",
                    value: `${selectedVehicles.map((v) => `${v.name}: ${v.power} HP est.`).join(" · ")}`,
                    crown: powerLeader,
                  },
                  { label: "Torque", value: "Not confirmed", crown: null },
                  {
                    label: "Drivetrain",
                    value: selectedVehicles
                      .map((v) => `${v.name}: ${(v as { drivetrain?: string }).drivetrain ?? "Not confirmed"}`)
                      .join(" · "),
                  },
                  { label: "Transmission", value: "Not confirmed", crown: null },
                  { label: "Fuel Type", value: "Not confirmed", crown: null },
                  { label: "Fuel Capacity", value: "Not confirmed", crown: null },
                  { label: "Est. Range", value: "Not confirmed", crown: null },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-3 py-2">
                    <dt className="font-bold text-muted-foreground">{row.label}</dt>
                    <dd className="text-right font-bold text-foreground">
                      {row.value}
                      {row.crown != null && row.crown !== undefined && (
                        <span className="ml-1.5 inline-flex items-center gap-0.5 text-xs font-black text-gold-dark dark:text-amber-300">
                          <Trophy className="h-3 w-3" />
                          {selectedVehicles[row.crown as number]?.name}
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Engine details beyond horsepower and drivetrain are not confirmed yet — they arrive with launch data.
              </p>
            </div>

            <div className="card-surface rounded-3xl border border-border p-5">
              <h3 className="font-display mb-3 flex items-center gap-2 text-base font-black text-foreground">
                <Ruler className="h-5 w-5 text-accent" /> Dimensions &amp; Weight
              </h3>
              <dl className="divide-y divide-border text-sm">
                {[
                  {
                    label: "Weight",
                    value: selectedVehicles.map((v) => `${v.name}: ${v.weight ? `${v.weight} est.` : "Not confirmed"}`).join(" · "),
                    crown: lightestIdx,
                    crownNote: "lightest",
                  },
                  { label: "Length", value: "Not confirmed", crown: null },
                  { label: "Width", value: "Not confirmed", crown: null },
                  { label: "Height", value: "Not confirmed", crown: null },
                  { label: "Wheelbase", value: "Not confirmed", crown: null },
                  { label: "Ground Clearance", value: "Not confirmed", crown: null },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-3 py-2">
                    <dt className="font-bold text-muted-foreground">{row.label}</dt>
                    <dd className="text-right font-bold text-foreground">
                      {row.value}
                      {row.crown != null && row.crown !== undefined && (
                        <span className="ml-1.5 inline-flex items-center gap-0.5 text-xs font-black text-emerald-600 dark:text-emerald-400">
                          <Trophy className="h-3 w-3" />
                          {selectedVehicles[row.crown as number]?.name} ({(row as { crownNote?: string }).crownNote})
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Dimensions are not confirmed yet — only weight is currently listed for these vehicles.
              </p>
            </div>
          </div>

          {/* Special Features */}
          <div className="card-surface rounded-3xl border border-border p-5">
            <h3 className="font-display mb-1 text-lg font-black text-foreground">Special Features</h3>
            <p className="mb-3 text-sm text-muted-foreground">Weaponization, armor &amp; ability showdown</p>
            {featureUnion.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                None of the selected vehicles have special features listed yet.
              </p>
            ) : (
              <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                {featureMatrix.map(({ feature, present }) => (
                  <div
                    key={feature}
                    className="grid items-center gap-2"
                    style={{ gridTemplateColumns: `1.4fr repeat(${selectedVehicles.length}, 1fr)` }}
                  >
                    <span className="text-sm font-bold text-muted-foreground">{feature}</span>
                    {present.map((has, i) => (
                      <span key={i} className="text-center text-sm" aria-label={has ? "Yes" : "No"}>
                        {has ? (
                          <span className="font-black text-emerald-600 dark:text-emerald-400">✓</span>
                        ) : (
                          <span className="text-rose-600/70 dark:text-rose-400/70">✗</span>
                        )}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* VEHICLE PICKER MODAL (filtered by the finder sidebar) */}
      {pickerSlotIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in">
          <div className="card-surface flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-border p-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="font-display text-lg font-black text-foreground">
                  Choose Contender for Slot #{pickerSlotIndex + 1}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {filteredCandidates.length} match the finder
                  {filtersActive ? " — clear the finder filters to see every vehicle" : ""}
                </p>
              </div>
              <button
                onClick={() => setPickerSlotIndex(null)}
                className="rounded-lg p-2.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-2 overflow-y-auto pr-1">
              {filteredCandidates.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">No vehicles match the current finder filters.</p>
                  <button
                    onClick={resetFilters}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/40 px-4 py-2 text-sm font-bold text-foreground hover:bg-muted/60"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
                  </button>
                </div>
              )}
              {filteredCandidates.map((cand) => {
                const isCurrent = selectedSlugs.includes(cand.slug);
                return (
                  <button
                    key={cand.id}
                    onClick={() => handleSelectVehicleForSlot(cand.slug)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-2xl border p-3 text-left transition-all",
                      isCurrent
                        ? "border-accent bg-accent/10 opacity-60"
                        : "border-border bg-muted/60 hover:border-primary/40 hover:bg-muted/40"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <img loading="lazy" src={cand.img} alt={cand.name} className="h-12 w-16 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-display text-sm font-bold text-foreground">{cand.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {cand.klass} &bull; {toKmh(cand.topSpeed)} km/h
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="tabular-nums block text-sm font-bold text-cyan-600 dark:text-[#00F0FF]">
                        {cand.priceDisplay}
                      </span>
                      <ConfidenceBadge level={cand.confidence} size="sm" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
