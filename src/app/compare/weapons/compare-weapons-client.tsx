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
  Crosshair,
  Zap,
  Disc3,
  Clock,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { canonicalWeapons, CanonicalWeapon } from "@/lib/canonical-data";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { FavoriteButton } from "@/components/favorite-button";

interface CompareWeaponsClientProps {
  initialSlugs?: string[];
}

export function CompareWeaponsClient({ initialSlugs }: CompareWeaponsClientProps) {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(() => {
    if (initialSlugs && initialSlugs.length >= 2) return initialSlugs.slice(0, 4);
    return ["m4-carbine", "ak-74-kalashnikov"];
  });

  const [copied, setCopied] = useState(false);
  const [pickerSlotIndex, setPickerSlotIndex] = useState<number | null>(null);

  // Read URL params
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const wParam = params.get("w");
      if (wParam) {
        const slugs = wParam.split(",").filter((s) => canonicalWeapons.some((w) => w.slug === s || w.id === s));
        if (slugs.length >= 2) {
          setSelectedSlugs(slugs.slice(0, 4));
        }
      }
    }
  }, []);

  const syncToUrl = (slugs: string[]) => {
    if (typeof window !== "undefined") {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("w", slugs.join(","));
        window.history.replaceState({}, "", url.toString());
      } catch {}
    }
  };

  const selectedWeapons: CanonicalWeapon[] = useMemo(() => {
    return selectedSlugs
      .map((slug) => canonicalWeapons.find((w) => w.slug === slug || w.id === slug))
      .filter((w): w is CanonicalWeapon => w !== undefined);
  }, [selectedSlugs]);

  const handleRemove = (index: number) => {
    if (selectedSlugs.length <= 2) return;
    const next = selectedSlugs.filter((_, i) => i !== index);
    setSelectedSlugs(next);
    syncToUrl(next);
  };

  const handleSelectSlot = (slug: string) => {
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
    const unselected = canonicalWeapons.find((w) => !selectedSlugs.includes(w.slug));
    if (unselected) {
      const next = [...selectedSlugs, unselected.slug];
      setSelectedSlugs(next);
      syncToUrl(next);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      const shareUrl = `${window.location.origin}/compare/weapons?w=${selectedSlugs.join(",")}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Best Stat Calculations
  const bestDamage = useMemo(() => Math.max(...selectedWeapons.map((w) => w.damage)), [selectedWeapons]);
  const bestFireRate = useMemo(() => Math.max(...selectedWeapons.map((w) => w.fireRate)), [selectedWeapons]);
  const bestAccuracy = useMemo(() => Math.max(...selectedWeapons.map((w) => w.accuracy)), [selectedWeapons]);
  const bestRange = useMemo(() => Math.max(...selectedWeapons.map((w) => w.range)), [selectedWeapons]);

  // Overall Score (Damage 40%, FireRate 30%, Accuracy 20%, Range 10%)
  const scores = useMemo(() => {
    return selectedWeapons.map((w) => {
      const total = +(w.damage * 0.4 + w.fireRate * 0.3 + w.accuracy * 0.2 + w.range * 0.1).toFixed(1);
      return { weapon: w, total };
    });
  }, [selectedWeapons]);

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
            <span className="text-[10px] font-black uppercase tracking-widest text-accent">Ballistic Comparison Duel</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-black uppercase text-white tracking-wide">
            Comparing <span className="text-accent">{selectedWeapons.length}</span> Firearms
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Analyze stopping power, firing cycle DPS, effective range, and reload speeds.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {selectedSlugs.length < 4 && (
            <Button onClick={handleAddSlot} className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs">
              <Plus className="h-3.5 w-3.5 mr-1" /> Add 3rd/4th Gun
            </Button>
          )}

          <Button onClick={handleShare} className="bg-gradient-to-r from-primary to-accent text-white font-bold text-xs shadow-md">
            {copied ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-300" /> : <Share2 className="h-3.5 w-3.5 mr-1" />}
            <span>{copied ? "Link Copied!" : "Share Comparison URL"}</span>
          </Button>
        </div>
      </div>

      {/* OVERALL WINNER CARD */}
      {overallWinner && (
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-[#0e0717] to-[#040810] p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-300">
                <Trophy className="h-3.5 w-3.5 text-amber-400" /> Ballistic Recommendation & Highest Combat Rating
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-white">
                {overallWinner.weapon.name} leads with {overallWinner.total}/100 Rating
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Featuring the optimal blend of stopping power and high cycle fire rate, the{" "}
                <strong>{overallWinner.weapon.name}</strong> delivers superior time-to-kill (TTK) across both indoor room-clearing and open street firefights.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="h-20 w-32 rounded-xl overflow-hidden border border-white/15 bg-black/60 p-2 flex items-center justify-center">
                <img src={overallWinner.weapon.img} alt={overallWinner.weapon.name} className="max-h-full max-w-full object-contain mix-blend-lighten" />
              </div>
              <div>
                <span className="block font-mono font-black text-2xl text-amber-400">{overallWinner.total} PTS</span>
                <Link href={`/weapons/${overallWinner.weapon.slug}`} className="text-xs font-bold text-accent hover:underline flex items-center gap-1 mt-1">
                  Full Specs <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIDE-BY-SIDE CARDS */}
      <div className={cn("grid gap-4", selectedWeapons.length === 2 ? "grid-cols-1 md:grid-cols-2" : selectedWeapons.length === 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4")}>
        {selectedWeapons.map((w, idx) => {
          const isWinner = overallWinner?.weapon.slug === w.slug;
          return (
            <div
              key={w.id}
              className={cn(
                "card-surface relative rounded-3xl border p-5 flex flex-col justify-between transition-all",
                isWinner ? "border-amber-400/60 shadow-[0_0_24px_rgba(251,191,36,0.15)]" : "border-white/10"
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <button
                    onClick={() => setPickerSlotIndex(idx)}
                    className="rounded-lg bg-white/10 px-2 py-1 text-[10px] font-bold text-slate-300 hover:bg-white/20 transition-colors"
                  >
                    Slot #{idx + 1}: Swap Weapon ▾
                  </button>
                  {selectedWeapons.length > 2 && (
                    <button
                      onClick={() => handleRemove(idx)}
                      className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-white/10"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Visual */}
                <div className="relative h-40 rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#0c0517] via-black/90 to-[#170a1f] p-4 flex items-center justify-center mb-4">
                  <img src={w.img} alt={w.name} className="max-h-28 w-full object-contain mix-blend-lighten brightness-125" />
                  <span className="absolute bottom-2 left-2 rounded-lg bg-black/80 px-2 py-0.5 text-[10px] font-bold text-accent backdrop-blur">
                    {w.klass}
                  </span>
                </div>

                <h3 className="font-display text-base font-black uppercase text-white truncate">
                  {w.name}
                </h3>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-slate-400">{w.ammoType}</span>
                  <span className="font-mono font-bold text-[#00F0FF]">{w.priceDisplay}</span>
                </div>
              </div>

              {/* STAT ROWS */}
              <div className="mt-5 space-y-3 pt-4 border-t border-white/10">
                {/* Damage */}
                <div className="rounded-xl border border-white/5 bg-black/40 p-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Damage</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-white">{w.damage}/100</span>
                      {w.damage === bestDamage && (
                        <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 text-[9px] font-black uppercase">
                          Winner
                        </span>
                      )}
                    </div>
                  </div>
                  <Progress value={w.damage} className="h-1.5 mt-1.5" />
                </div>

                {/* Fire Rate */}
                <div className="rounded-xl border border-white/5 bg-black/40 p-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Fire Rate</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-white">{w.fireRate}/100</span>
                      {w.fireRate === bestFireRate && (
                        <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 text-[9px] font-black uppercase">
                          Winner
                        </span>
                      )}
                    </div>
                  </div>
                  <Progress value={w.fireRate} className="h-1.5 mt-1.5" />
                </div>

                {/* Accuracy */}
                <div className="rounded-xl border border-white/5 bg-black/40 p-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Accuracy</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-white">{w.accuracy}/100</span>
                      {w.accuracy === bestAccuracy && (
                        <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 text-[9px] font-black uppercase">
                          Winner
                        </span>
                      )}
                    </div>
                  </div>
                  <Progress value={w.accuracy} className="h-1.5 mt-1.5" />
                </div>

                {/* Range */}
                <div className="rounded-xl border border-white/5 bg-black/40 p-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Range</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-white">{w.range}/100</span>
                      {w.range === bestRange && (
                        <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 text-[9px] font-black uppercase">
                          Winner
                        </span>
                      )}
                    </div>
                  </div>
                  <Progress value={w.range} className="h-1.5 mt-1.5" />
                </div>
              </div>

              {/* PROS & CONS */}
              <div className="mt-4 pt-3 border-t border-white/10 space-y-2 text-[11px]">
                <div className="flex items-start gap-1.5 text-emerald-400">
                  <ThumbsUp className="h-3 w-3 shrink-0 mt-0.5" />
                  <span>
                    {w.damage >= 70 ? "Devastating per-round ballistic trauma" : "Rapid cycle rate for intense close-quarter skirmishes"}
                  </span>
                </div>
                <div className="flex items-start gap-1.5 text-rose-400">
                  <ThumbsDown className="h-3 w-3 shrink-0 mt-0.5" />
                  <span>
                    {w.range < 50 ? "Significant damage falloff at long distances" : "Heavier recoil climb during sustained full-auto spray"}
                  </span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <FavoriteButton type="weapons" id={w.id} showText={false} />
                <Link
                  href={`/weapons/${w.slug}`}
                  className="flex-1 text-center rounded-xl bg-white/5 hover:bg-white/10 py-2 text-xs font-bold text-slate-200 hover:text-white transition-colors border border-white/10"
                >
                  Full Ballistics
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* WEAPON PICKER MODAL */}
      {pickerSlotIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="card-surface max-w-2xl w-full max-h-[80vh] overflow-hidden rounded-3xl border border-white/20 p-6 flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-display text-lg font-black uppercase text-white">
                Choose Firearm for Slot #{pickerSlotIndex + 1}
              </h3>
              <button
                onClick={() => setPickerSlotIndex(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto mt-4 space-y-2 pr-1">
              {canonicalWeapons.map((cand) => {
                const isCurrent = selectedSlugs.includes(cand.slug);
                return (
                  <button
                    key={cand.id}
                    onClick={() => handleSelectSlot(cand.slug)}
                    className={cn(
                      "w-full text-left rounded-2xl border p-3 flex items-center justify-between gap-3 transition-all",
                      isCurrent
                        ? "border-accent bg-accent/10 opacity-60"
                        : "border-white/10 bg-black/40 hover:border-white/30 hover:bg-white/5"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-16 rounded-xl bg-black/60 p-1 flex items-center justify-center">
                        <img src={cand.img} alt={cand.name} className="max-h-full max-w-full object-contain mix-blend-lighten" />
                      </div>
                      <div>
                        <h4 className="font-display text-sm font-bold text-white">{cand.name}</h4>
                        <p className="text-[11px] text-slate-400">{cand.klass} &bull; Damage {cand.damage}</p>
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
