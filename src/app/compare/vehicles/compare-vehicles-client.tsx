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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { FavoriteButton } from "@/components/favorite-button";

interface CompareVehiclesClientProps {
  initialSlugs?: string[];
}

export function CompareVehiclesClient({ initialSlugs }: CompareVehiclesClientProps) {
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
        const slugs = vParam.split(",").filter((s) => canonicalVehicles.some((v) => v.slug === s || v.id === s));
        if (slugs.length >= 2) {
          setSelectedSlugs(slugs.slice(0, 4));
        }
      }
    }
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
      .map((slug) => canonicalVehicles.find((v) => v.slug === slug || v.id === slug))
      .filter((v): v is CanonicalVehicle => v !== undefined);
  }, [selectedSlugs]);

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
    const unselected = canonicalVehicles.find((v) => !selectedSlugs.includes(v.slug));
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

  return (
    <div className="space-y-8">
      {/* Top Controls Header */}
      <div className="card-surface p-5 rounded-3xl border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-widest text-accent">Head-to-Head Duel Mode</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-black uppercase text-white tracking-wide">
            Comparing <span className="text-[#00F0FF]">{selectedVehicles.length}</span> Contenders
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Compare 2 to 4 rides across top speed, acceleration curve, handling physics, and value.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {selectedSlugs.length < 4 && (
            <Button
              onClick={handleAddSlot}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Add 3rd/4th Car
            </Button>
          )}

          <Button
            onClick={handleShare}
            className="bg-gradient-to-r from-primary to-accent text-white font-bold text-xs shadow-md"
          >
            {copied ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-300" /> : <Share2 className="h-3.5 w-3.5 mr-1" />}
            <span>{copied ? "Link Copied!" : "Share Comparison URL"}</span>
          </Button>
        </div>
      </div>

      {/* OVERALL WINNER & RECOMMENDATION CARD */}
      {overallWinner && (
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-[#0a0f1d] to-[#12071a] p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-300">
                <Trophy className="h-3.5 w-3.5 text-amber-400" /> Official Recommendation & Overall Winner
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-white">
                {overallWinner.vehicle.name} dominates with {overallWinner.total}/100 Performance Score
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Based on combined power output, zero-to-sixty acceleration rate, and cornering grip, the{" "}
                <strong>{overallWinner.vehicle.name}</strong> provides superior track dominance and getaway viability in Leonida.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="h-20 w-32 rounded-xl overflow-hidden border border-white/15 bg-black/40">
                <img
                  src={overallWinner.vehicle.img}
                  alt={overallWinner.vehicle.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <span className="block font-mono font-black text-2xl text-amber-400">{overallWinner.total} PTS</span>
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
                isWinner ? "border-amber-400/60 shadow-[0_0_24px_rgba(251,191,36,0.15)]" : "border-white/10"
              )}
            >
              {/* Header with Slot Selector & Remove */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPickerSlotIndex(idx)}
                      className="rounded-lg bg-white/10 px-2 py-1 text-[10px] font-bold text-slate-300 hover:bg-white/20 transition-colors"
                    >
                      Slot #{idx + 1}: Swap Vehicle ▾
                    </button>
                    {isWinner && (
                      <span className="flex items-center gap-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 text-[9px] font-black uppercase">
                        <Trophy className="h-2.5 w-2.5" /> Best Choice
                      </span>
                    )}
                  </div>
                  {selectedVehicles.length > 2 && (
                    <button
                      onClick={() => handleRemoveVehicle(idx)}
                      className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-white/10"
                      aria-label="Remove vehicle"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Vehicle Image */}
                <div className="relative h-44 rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-inner mb-4">
                  <img
                    src={v.img}
                    alt={v.name}
                    style={v.filter ? { filter: v.filter } : undefined}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 rounded-lg bg-black/80 px-2 py-0.5 text-[10px] font-bold text-accent backdrop-blur">
                    {v.klass}
                  </span>
                </div>

                {/* Title and Pricing */}
                <h3 className="font-display text-lg font-black uppercase text-white truncate">
                  {v.name}
                </h3>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-slate-400">{v.manufacturer}</span>
                  <span className="font-mono font-bold text-[#00F0FF]">{v.priceDisplay}</span>
                </div>
              </div>

              {/* STAT ROWS */}
              <div className="mt-5 space-y-3 pt-4 border-t border-white/10">
                {/* Top Speed */}
                <div className="rounded-xl border border-white/5 bg-black/40 p-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Gauge className="h-3.5 w-3.5 text-accent" /> Top Speed
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-white">{v.topSpeed} mph</span>
                      {v.topSpeed === bestSpeed && (
                        <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 text-[9px] font-black uppercase">
                          Winner
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 0-60 Launch */}
                <div className="rounded-xl border border-white/5 bg-black/40 p-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Timer className="h-3.5 w-3.5 text-amber-400" /> 0–60 Launch
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-white">{v.acceleration}s</span>
                      {v.acceleration === bestAccel && (
                        <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 text-[9px] font-black uppercase">
                          Winner
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Handling */}
                <div className="rounded-xl border border-white/5 bg-black/40 p-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Car className="h-3.5 w-3.5 text-[#00F0FF]" /> Handling Grip
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-white">{v.handling}/100</span>
                      {v.handling === bestHandling && (
                        <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 text-[9px] font-black uppercase">
                          Winner
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Braking */}
                <div className="rounded-xl border border-white/5 bg-black/40 p-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Disc3 className="h-3.5 w-3.5 text-rose-400" /> Braking Power
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-white">{v.braking}/100</span>
                      {v.braking === bestBraking && (
                        <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 text-[9px] font-black uppercase">
                          Winner
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Power */}
                <div className="rounded-xl border border-white/5 bg-black/40 p-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-purple-400" /> Horsepower
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-white">{v.power} HP</span>
                      {v.power === bestPower && (
                        <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 text-[9px] font-black uppercase">
                          Winner
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* PROS & CONS */}
              <div className="mt-4 pt-3 border-t border-white/10 space-y-2 text-[11px]">
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
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <FavoriteButton type="vehicles" id={v.id} showText={false} />
                <Link
                  href={`/vehicles/${v.slug}`}
                  className="flex-1 text-center rounded-xl bg-white/5 hover:bg-white/10 py-2 text-xs font-bold text-slate-200 hover:text-white transition-colors border border-white/10"
                >
                  View Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* VEHICLE PICKER MODAL */}
      {pickerSlotIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="card-surface max-w-2xl w-full max-h-[80vh] overflow-hidden rounded-3xl border border-white/20 p-6 flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-display text-lg font-black uppercase text-white">
                Choose Contender for Slot #{pickerSlotIndex + 1}
              </h3>
              <button
                onClick={() => setPickerSlotIndex(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto mt-4 space-y-2 pr-1">
              {canonicalVehicles.map((cand) => {
                const isCurrent = selectedSlugs.includes(cand.slug);
                return (
                  <button
                    key={cand.id}
                    onClick={() => handleSelectVehicleForSlot(cand.slug)}
                    className={cn(
                      "w-full text-left rounded-2xl border p-3 flex items-center justify-between gap-3 transition-all",
                      isCurrent
                        ? "border-accent bg-accent/10 opacity-60"
                        : "border-white/10 bg-black/40 hover:border-white/30 hover:bg-white/5"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <img src={cand.img} alt={cand.name} className="h-12 w-16 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-display text-sm font-bold text-white">{cand.name}</h4>
                        <p className="text-[11px] text-slate-400">{cand.klass} &bull; {cand.topSpeed} mph</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-[#00F0FF]">{cand.priceDisplay}</span>
                      <span className="block text-[10px] text-slate-400 font-semibold">{cand.confidence}</span>
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
