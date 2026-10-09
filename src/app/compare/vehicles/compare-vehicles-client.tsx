"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Trophy,
  Plus,
  X,
  Share2,
  Check,
  Sparkles,
  Gauge,
  Timer,
  Disc3,
  Car,
  Zap,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  Award,
  ChevronRight,
} from "lucide-react";
import { canonicalVehicles, CanonicalVehicle } from "@/lib/canonical-data";
import type { VehicleScoreWeights } from "@/lib/scoring";
import { computeVehicleScore, getVehicleBestFor, normalizeWeights } from "@/lib/scoring";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { FavoriteButton } from "@/components/favorite-button";
import { RadarChart, RADAR_COLORS } from "@/components/radar-chart";
import { ComparisonTable, type ComparisonRowDef } from "@/components/comparison-table";

interface CompareVehiclesClientProps {
  initialSlugs?: string[];
  /** Live catalog (DB + canonical merge) passed from the server page; falls back to bundled data. */
  vehicles?: CanonicalVehicle[];
  /** CMS-configured overall-score weights. */
  weights?: VehicleScoreWeights;
}

export function CompareVehiclesClient({ initialSlugs, vehicles, weights }: CompareVehiclesClientProps) {
  const vehicleList = vehicles && vehicles.length > 0 ? vehicles : canonicalVehicles;

  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(() => {
    if (initialSlugs && initialSlugs.length >= 2) return initialSlugs.slice(0, 4);
    return ["grotti-visione", "pfister-comet-s2"];
  });

  const [copied, setCopied] = useState(false);
  const [pickerSlotIndex, setPickerSlotIndex] = useState<number | null>(null);

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

  const handleAddSlot = () => {
    if (selectedSlugs.length >= 4) return;
    const unselected = vehicleList.find((v) => !selectedSlugs.includes(v.slug));
    if (unselected) {
      const next = [...selectedSlugs, unselected.slug];
      setSelectedSlugs(next);
      syncToUrl(next);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      const shareUrl = `${window.location.origin}/compare/vehicles?v=${selectedSlugs.join(",")}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Calculate Winners
  const bestSpeed = useMemo(() => Math.max(...selectedVehicles.map((v) => v.topSpeed)), [selectedVehicles]);
  const bestAccel = useMemo(() => Math.min(...selectedVehicles.map((v) => v.acceleration)), [selectedVehicles]);
  const bestBraking = useMemo(() => Math.max(...selectedVehicles.map((v) => v.braking)), [selectedVehicles]);
  const bestHandling = useMemo(() => Math.max(...selectedVehicles.map((v) => v.handling)), [selectedVehicles]);
  const bestPower = useMemo(() => Math.max(...selectedVehicles.map((v) => v.power)), [selectedVehicles]);
  const bestTraction = useMemo(
    () => Math.max(...selectedVehicles.map((v) => v.traction ?? 70)),
    [selectedVehicles]
  );

  // Overall Score Calculation (Speed 35%, Accel 25%, Handling 25%, Braking 15%)
  const scores = useMemo(() => {
    return selectedVehicles.map((v) => {
      const speedScore = (v.topSpeed / 240) * 35;
      const accelScore = Math.max(0, (5.5 - v.acceleration) / 3.5) * 25;
      const handlingScore = (v.handling / 100) * 25;
      const brakingScore = (v.braking / 100) * 15;
      const total = +(speedScore + accelScore + handlingScore + brakingScore).toFixed(1);
      return { vehicle: v, total };
    });
  }, [selectedVehicles]);

  const overallWinner = useMemo(() => {
    if (scores.length === 0) return null;
    return [...scores].sort((a, b) => b.total - a.total)[0];
  }, [scores]);

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
    const tractionVals = selectedVehicles.map((v) => v.traction ?? 70);
    const corneringVals = selectedVehicles.map((v) => v.cornering ?? 70);
    const launchVals = selectedVehicles.map((v) => v.launch ?? 70);
    const priceVals = selectedVehicles.map((v) => v.price ?? null);
    const weightVals = selectedVehicles.map((v) => parseWeightNum(v.weight || ""));
    const seatVals = selectedVehicles.map((v) => v.seating ?? 0);

    const rows: ComparisonRowDef[] = [
      {
        label: "Overall Score",
        values: overallScores.map((s) => `${s}/100`),
        bars: overallScores,
        winnerIndex: new Set(overallScores).size === 1 ? null : overallScores.indexOf(Math.max(...overallScores)),
      },
      {
        label: "Top Speed",
        values: selectedVehicles.map((v) => `${v.topSpeed} mph`),
        bars: selectedVehicles.map((v) => ((v.topSpeed - 80) / 150) * 100),
        winnerIndex: winnerMax(selectedVehicles.map((v) => v.topSpeed)),
      },
      {
        label: "0–60 Launch",
        values: selectedVehicles.map((v) => `${v.acceleration}s`),
        bars: selectedVehicles.map((v) => ((6.5 - v.acceleration) / 5) * 100),
        winnerIndex: winnerMin(selectedVehicles.map((v) => v.acceleration)),
      },
      {
        label: "Handling",
        values: selectedVehicles.map((v) => `${v.handling}/100`),
        bars: selectedVehicles.map((v) => v.handling),
        winnerIndex: winnerMax(selectedVehicles.map((v) => v.handling)),
      },
      {
        label: "Braking",
        values: selectedVehicles.map((v) => `${v.braking}/100`),
        bars: selectedVehicles.map((v) => v.braking),
        winnerIndex: winnerMax(selectedVehicles.map((v) => v.braking)),
      },
      {
        label: "Traction",
        values: tractionVals.map((t) => `${t}/100`),
        bars: tractionVals,
        winnerIndex: winnerMax(tractionVals),
      },
      {
        label: "Cornering",
        values: corneringVals.map((t) => `${t}/100`),
        bars: corneringVals,
        winnerIndex: winnerMax(corneringVals),
      },
      {
        label: "Launch / Takeoff",
        values: launchVals.map((t) => `${t}/100`),
        bars: launchVals,
        winnerIndex: winnerMax(launchVals),
      },
      {
        label: "Horsepower",
        values: selectedVehicles.map((v) => `${v.power} HP`),
        winnerIndex: winnerMax(selectedVehicles.map((v) => v.power)),
      },
      {
        label: "Price",
        values: selectedVehicles.map((v) => v.priceDisplay),
        winnerIndex: winnerMin(priceVals),
      },
      {
        label: "Weight",
        values: selectedVehicles.map((v) => v.weight),
        winnerIndex: winnerMin(weightVals),
      },
      {
        label: "Seats",
        values: seatVals.map((s) => String(s)),
        winnerIndex: winnerMax(seatVals),
      },
    ];
    return rows;
  }, [selectedVehicles, overallScores]);

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

  return (
    <div className="space-y-8">
      {/* Top Controls Header */}
      <div className="card-surface p-5 rounded-3xl border border-border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-ping" />
            <span className="text-xs font-black uppercase tracking-widest text-accent">Head-to-Head Duel Mode</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-black uppercase text-foreground tracking-wide">
            Comparing <span className="text-cyan-600 dark:text-[#00F0FF]">{selectedVehicles.length}</span> Contenders
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Compare 2 to 4 rides across top speed, acceleration curve, handling physics, and value.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {selectedSlugs.length < 4 && (
            <Button
              onClick={handleAddSlot}
              className="bg-muted/50 hover:bg-muted/60 text-foreground font-bold text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Add 3rd/4th Car
            </Button>
          )}

          <Button
            onClick={handleShare}
            className="bg-primary text-primary-foreground font-bold text-xs shadow-md"
          >
            {copied ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-300" /> : <Share2 className="h-3.5 w-3.5 mr-1" />}
            <span>{copied ? "Link Copied!" : "Share Comparison URL"}</span>
          </Button>
        </div>
      </div>

      {/* OVERALL WINNER & RECOMMENDATION CARD */}
      {overallWinner && (
        <div className="dark-panel relative overflow-hidden rounded-3xl border border-gold/30 bg-[#0a0f1d] bg-gradient-to-r from-gold/10 via-[#0a0f1d] to-[#12071a] p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-gold-light/40 bg-gold-light/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-300">
                <Trophy className="h-3.5 w-3.5 text-gold-light" /> Official Recommendation & Overall Winner
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-white">
                {overallWinner.vehicle.name} dominates with {overallWinner.total}/100 Performance Score
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Based on combined power output, zero-to-sixty acceleration rate, and cornering grip, the{" "}
                <strong>{overallWinner.vehicle.name}</strong> provides superior track dominance and getaway viability in Leonida.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="h-20 w-32 rounded-xl overflow-hidden border border-border bg-black/40">
                <img loading="lazy"
                  src={overallWinner.vehicle.img}
                  alt={overallWinner.vehicle.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <span className="block font-mono font-black text-2xl text-gold-light">{overallWinner.total} PTS</span>
                <Link
                  href={`/vehicles/${overallWinner.vehicle.slug}`}
                  className="text-xs font-bold text-accent hover:underline flex items-center gap-1 mt-1"
                >
                  Full Specs <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN SIDE-BY-SIDE CARDS GRID */}
      <div className={cn("grid gap-4", selectedVehicles.length === 2 ? "grid-cols-1 md:grid-cols-2" : selectedVehicles.length === 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4")}>
        {selectedVehicles.map((v, idx) => {
          const isWinner = overallWinner?.vehicle.slug === v.slug;
          return (
            <div
              key={v.id}
              className={cn(
                "card-surface relative rounded-3xl border p-5 flex flex-col justify-between transition-all",
                isWinner ? "border-gold-light/60 shadow-[0_0_24px_rgba(251,191,36,0.15)]" : "border-border"
              )}
            >
              {/* Header with Slot Selector & Remove */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPickerSlotIndex(idx)}
                      className="rounded-lg bg-muted/50 px-2 py-1 text-xs font-bold text-muted-foreground hover:bg-muted/60 transition-colors"
                    >
                      Slot #{idx + 1}: Swap Vehicle ▾
                    </button>
                    {isWinner && (
                      <span className="flex items-center gap-1 rounded-full bg-gold-light/20 text-gold-dark dark:text-amber-300 border border-gold-light/40 px-2 py-0.5 text-xs font-black uppercase">
                        <Trophy className="h-2.5 w-2.5" /> Best Choice
                      </span>
                    )}
                  </div>
                  {selectedVehicles.length > 2 && (
                    <button
                      onClick={() => handleRemoveVehicle(idx)}
                      className="rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      aria-label="Remove vehicle"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Vehicle Image */}
                <div className="relative h-44 rounded-2xl overflow-hidden border border-border bg-black/60 shadow-inner mb-4">
                  <img loading="lazy"
                    src={v.img}
                    alt={v.name}
                    style={v.filter ? { filter: v.filter } : undefined}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 rounded-lg bg-black/80 px-2 py-0.5 text-xs font-bold text-accent backdrop-blur">
                    {v.klass}
                  </span>
                </div>

                {/* Title and Pricing */}
                <h3 className="font-display text-lg font-black uppercase text-foreground truncate">
                  {v.name}
                </h3>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-muted-foreground">{v.manufacturer}</span>
                  <span className="font-mono font-bold text-cyan-600 dark:text-[#00F0FF]">{v.priceDisplay}</span>
                </div>
                {bestForTags[idx]?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {bestForTags[idx].map((t) => (
                      <span
                        key={t.label}
                        className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-xs font-black uppercase tracking-wide text-accent"
                      >
                        {t.emoji} {t.label}
                      </span>
                    ))}
                  </div>
                )}
                {overallScores[idx] != null && (
                  <div className="mt-2 flex items-center justify-between rounded-xl border border-gold/30 bg-gold-light/10 px-2.5 py-1.5">
                    <span className="text-xs font-black uppercase tracking-wider text-gold-dark dark:text-amber-300 flex items-center gap-1">
                      <Trophy className="h-3 w-3" /> Overall Score
                    </span>
                    <span className="font-mono font-black text-sm text-gold-light">
                      {overallScores[idx]}/100
                      {overallScoreLeader === idx && overallScores.length > 1 && (
                        <span className="ml-1.5 text-xs font-black uppercase text-emerald-400">Lead</span>
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* STAT ROWS */}
              <div className="mt-5 space-y-3 pt-4 border-t border-border">
                {/* Top Speed */}
                <div className="rounded-xl border-border bg-muted/60 p-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Gauge className="h-3.5 w-3.5 text-accent" /> Top Speed
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-foreground">{v.topSpeed} mph</span>
                      {v.topSpeed === bestSpeed && (
                        <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 text-xs font-black uppercase">
                          Winner
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 0-60 Launch */}
                <div className="rounded-xl border-border bg-muted/60 p-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Timer className="h-3.5 w-3.5 text-gold-light" /> 0–60 Launch
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-foreground">{v.acceleration}s</span>
                      {v.acceleration === bestAccel && (
                        <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 text-xs font-black uppercase">
                          Winner
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Handling */}
                <div className="rounded-xl border-border bg-muted/60 p-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Car className="h-3.5 w-3.5 text-cyan-600 dark:text-[#00F0FF]" /> Handling Grip
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-foreground">{v.handling}/100</span>
                      {v.handling === bestHandling && (
                        <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 text-xs font-black uppercase">
                          Winner
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Braking */}
                <div className="rounded-xl border-border bg-muted/60 p-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Disc3 className="h-3.5 w-3.5 text-rose-400" /> Braking Power
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-foreground">{v.braking}/100</span>
                      {v.braking === bestBraking && (
                        <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 text-xs font-black uppercase">
                          Winner
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Traction */}
                <div className="rounded-xl border-border bg-muted/60 p-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Car className="h-3.5 w-3.5 text-emerald-400" /> Traction
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-foreground">{v.traction ?? 70}/100</span>
                      {(v.traction ?? 70) === bestTraction && selectedVehicles.length > 1 && (
                        <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 text-xs font-black uppercase">
                          Winner
                        </span>
                      )}
                    </div>
                  </div>
                  <Progress value={v.traction ?? 70} className="h-1.5 mt-1.5" />
                </div>

                {/* Power */}
                <div className="rounded-xl border-border bg-muted/60 p-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-purple-400" /> Horsepower
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-foreground">{v.power} HP</span>
                      {v.power === bestPower && (
                        <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 text-xs font-black uppercase">
                          Winner
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* PROS & CONS */}
              <div className="mt-4 pt-3 border-t border-border space-y-2 text-xs">
                <div className="flex items-start gap-1.5 text-emerald-400">
                  <ThumbsUp className="h-3 w-3 shrink-0 mt-0.5" />
                  <span>
                    {v.topSpeed >= 200 ? "Blistering top end speed on open expressways" : "Highly responsive throttle curve for street getaways"}
                  </span>
                </div>
                <div className="flex items-start gap-1.5 text-rose-400">
                  <ThumbsDown className="h-3 w-3 shrink-0 mt-0.5" />
                  <span>
                    {(v.price || 0) > 1500000 ? "High acquisition cost and expensive insurance replacement" : "Lower top speed ceiling against hypercars"}
                  </span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-5 pt-3 border-t border-border flex items-center justify-between gap-2">
                <FavoriteButton type="vehicles" id={v.id} showText={false} />
                <Link
                  href={`/vehicles/${v.slug}`}
                  className="flex-1 text-center rounded-xl bg-muted/40 hover:bg-muted/50 py-2 text-xs font-bold text-foreground hover:text-foreground transition-colors border border-border"
                >
                  View Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* RADAR + FEATURE COMPARISON */}
      {selectedVehicles.length >= 2 && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card-surface rounded-3xl border border-border p-5">
            <h3 className="font-display text-sm font-black uppercase text-foreground mb-1">Performance Radar</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Speed • Acceleration • Braking • Handling • Traction • Value
            </p>
            <RadarChart
              axes={["Speed", "Accel", "Braking", "Handling", "Traction", "Value"]}
              series={radarSeries}
            />
          </div>

          <div className="card-surface rounded-3xl border border-border p-5">
            <h3 className="font-display text-sm font-black uppercase text-foreground mb-1">Special Features</h3>
            <p className="text-xs text-muted-foreground mb-3">Weaponization, armor & ability showdown</p>
            {featureUnion.length === 0 ? (
              <p className="text-xs text-muted-foreground py-8 text-center">
                None of the selected vehicles have special features listed yet.
              </p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {featureMatrix.map(({ feature, present }) => (
                  <div key={feature} className="grid gap-2 items-center" style={{ gridTemplateColumns: `1.4fr repeat(${selectedVehicles.length}, 1fr)` }}>
                    <span className="text-xs font-bold text-muted-foreground">{feature}</span>
                    {present.map((has, i) => (
                      <span key={i} className="text-center text-sm" aria-label={has ? "Yes" : "No"}>
                        {has ? (
                          <span className="text-emerald-400 font-black">✓</span>
                        ) : (
                          <span className="text-rose-400/70">✗</span>
                        )}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            )}
            {featureUnion.length === 0 && <div />}
          </div>
        </div>
      )}

      {/* FULL STAT TABLE WITH WINNERS */}
      {tableRows.length > 0 && (
        <ComparisonTable
          contenders={selectedVehicles.map((v, i) => ({ name: v.name, color: RADAR_COLORS[i % RADAR_COLORS.length] }))}
          rows={tableRows}
        />
      )}

      {/* VEHICLE PICKER MODAL */}
      {pickerSlotIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="card-surface max-w-2xl w-full max-h-[80vh] overflow-hidden rounded-3xl border border-border p-6 flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="font-display text-lg font-black uppercase text-foreground">
                Choose Contender for Slot #{pickerSlotIndex + 1}
              </h3>
                <button
                  onClick={() => setPickerSlotIndex(null)}
                  className="rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                  <X className="h-5 w-5" />
                </button>
            </div>

            <div className="overflow-y-auto mt-4 space-y-2 pr-1">
              {vehicleList.map((cand) => {
                const isCurrent = selectedSlugs.includes(cand.slug);
                return (
                  <button
                    key={cand.id}
                    onClick={() => handleSelectVehicleForSlot(cand.slug)}
                    className={cn(
                      "w-full text-left rounded-2xl border p-3 flex items-center justify-between gap-3 transition-all",
                      isCurrent
                        ? "border-accent bg-accent/10 opacity-60"
                        : "border-border bg-muted/60 hover:border-primary/40 hover:bg-muted/40"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <img loading="lazy" src={cand.img} alt={cand.name} className="h-12 w-16 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-display text-sm font-bold text-foreground">{cand.name}</h4>
                        <p className="text-xs text-muted-foreground">{cand.klass} &bull; {cand.topSpeed} mph</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-cyan-600 dark:text-[#00F0FF]">{cand.priceDisplay}</span>
                      <span className="block text-xs text-muted-foreground font-semibold">{cand.confidence}</span>
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
