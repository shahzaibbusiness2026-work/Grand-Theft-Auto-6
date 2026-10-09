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
import type { WeaponScoreWeights } from "@/lib/scoring";
import { computeWeaponScore, getWeaponBestFor, computeDpsIndex } from "@/lib/scoring";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { FavoriteButton } from "@/components/favorite-button";
import { RadarChart, RADAR_COLORS } from "@/components/radar-chart";
import { ComparisonTable, type ComparisonRowDef } from "@/components/comparison-table";

interface CompareWeaponsClientProps {
  initialSlugs?: string[];
  /** Live catalog (DB + canonical merge) passed from the server page; falls back to bundled data. */
  weapons?: CanonicalWeapon[];
  /** CMS-configured overall-score weights. */
  weights?: WeaponScoreWeights;
}

export function CompareWeaponsClient({ initialSlugs, weapons, weights }: CompareWeaponsClientProps) {
  const weaponList = weapons && weapons.length > 0 ? weapons : canonicalWeapons;

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
        const slugs = wParam.split(",").filter((s) => weaponList.some((w) => w.slug === s || w.id === s));
        if (slugs.length >= 2) {
          setSelectedSlugs(slugs.slice(0, 4));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      .map((slug) => weaponList.find((w) => w.slug === slug || w.id === slug))
      .filter((w): w is CanonicalWeapon => w !== undefined);
  }, [selectedSlugs, weaponList]);

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
    const unselected = weaponList.find((w) => !selectedSlugs.includes(w.slug));
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

  // CMS-weighted Overall Scores + Best-For tags + DPS index
  const overallScores = useMemo(
    () => selectedWeapons.map((w) => computeWeaponScore(w, weights)),
    [selectedWeapons, weights]
  );
  const overallScoreLeader = useMemo(() => {
    if (overallScores.length === 0) return null;
    return overallScores.indexOf(Math.max(...overallScores));
  }, [overallScores]);
  const bestForTags = useMemo(
    () => selectedWeapons.map((w) => getWeaponBestFor(w)),
    [selectedWeapons]
  );
  const dpsIndices = useMemo(
    () => selectedWeapons.map((w) => computeDpsIndex(w.damage, w.fireRate)),
    [selectedWeapons]
  );
  const bestDps = useMemo(() => Math.max(...dpsIndices), [dpsIndices]);

  // Radar chart data
  const radarSeries = useMemo(
    () =>
      selectedWeapons.map((w, i) => ({
        name: w.name,
        color: RADAR_COLORS[i % RADAR_COLORS.length],
        values: [w.damage, w.fireRate, w.accuracy, w.range, w.reload ?? 60, Math.min(100, (w.magazineSize / 60) * 100)],
      })),
    [selectedWeapons]
  );

  const tableRows: ComparisonRowDef[] = useMemo(() => {
    if (selectedWeapons.length < 2) return [];
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
    const reloadVals = selectedWeapons.map((w) => w.reload ?? 60);
    const recoilVals = selectedWeapons.map((w) => w.recoil ?? 55);
    const magVals = selectedWeapons.map((w) => w.magazineSize);
    const priceVals = selectedWeapons.map((w) => w.price ?? null);

    const rows: ComparisonRowDef[] = [
      {
        label: "Overall Score",
        values: overallScores.map((s) => `${s}/100`),
        bars: overallScores,
        winnerIndex: new Set(overallScores).size === 1 ? null : overallScores.indexOf(Math.max(...overallScores)),
      },
      {
        label: "DPS Index",
        values: dpsIndices.map((d) => String(d)),
        bars: dpsIndices,
        winnerIndex: new Set(dpsIndices).size === 1 ? null : dpsIndices.indexOf(bestDps),
      },
      {
        label: "Damage",
        values: selectedWeapons.map((w) => `${w.damage}/100`),
        bars: selectedWeapons.map((w) => w.damage),
        winnerIndex: winnerMax(selectedWeapons.map((w) => w.damage)),
      },
      {
        label: "Fire Rate",
        values: selectedWeapons.map((w) => `${w.fireRate}/100`),
        bars: selectedWeapons.map((w) => w.fireRate),
        winnerIndex: winnerMax(selectedWeapons.map((w) => w.fireRate)),
      },
      {
        label: "Accuracy",
        values: selectedWeapons.map((w) => `${w.accuracy}/100`),
        bars: selectedWeapons.map((w) => w.accuracy),
        winnerIndex: winnerMax(selectedWeapons.map((w) => w.accuracy)),
      },
      {
        label: "Effective Range",
        values: selectedWeapons.map((w) => `${w.range}/100`),
        bars: selectedWeapons.map((w) => w.range),
        winnerIndex: winnerMax(selectedWeapons.map((w) => w.range)),
      },
      {
        label: "Reload Speed",
        values: reloadVals.map((v) => `${v}/100`),
        bars: reloadVals,
        winnerIndex: winnerMax(reloadVals),
      },
      {
        label: "Magazine",
        values: magVals.map((m) => `${m} rnd`),
        winnerIndex: winnerMax(magVals),
      },
      {
        label: "Recoil Control",
        values: recoilVals.map((v) => `${v}/100`),
        bars: recoilVals,
        winnerIndex: winnerMax(recoilVals),
      },
      {
        label: "Mobility",
        values: selectedWeapons.map((w) => `${w.mobility ?? 70}/100`),
        bars: selectedWeapons.map((w) => w.mobility ?? 70),
        winnerIndex: winnerMax(selectedWeapons.map((w) => w.mobility ?? 70)),
      },
      {
        label: "Price",
        values: selectedWeapons.map((w) => w.priceDisplay),
        winnerIndex: winnerMin(priceVals),
      },
    ];
    return rows;
  }, [selectedWeapons, overallScores, dpsIndices, bestDps]);

  // Special features (✓ / ✗) across all selected weapons
  const featureUnion = useMemo(() => {
    const set = new Set<string>();
    selectedWeapons.forEach((w) => (w.features || []).forEach((f) => set.add(f)));
    return Array.from(set);
  }, [selectedWeapons]);
  const featureMatrix = useMemo(
    () =>
      featureUnion.map((f) => ({
        feature: f,
        present: selectedWeapons.map((w) => (w.features || []).includes(f)),
      })),
    [featureUnion, selectedWeapons]
  );

  return (
    <div className="space-y-8">
      {/* Top Controls Header */}
      <div className="card-surface p-5 rounded-3xl border border-border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-ping" />
            <span className="text-xs font-black uppercase tracking-widest text-accent">Ballistic Comparison Duel</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-black uppercase text-foreground tracking-wide">
            Comparing <span className="text-accent">{selectedWeapons.length}</span> Firearms
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Analyze stopping power, firing cycle DPS, effective range, and reload speeds.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {selectedSlugs.length < 4 && (
            <Button onClick={handleAddSlot} className="bg-muted/50 hover:bg-muted/60 text-foreground font-bold text-xs">
              <Plus className="h-3.5 w-3.5 mr-1" /> Add 3rd/4th Gun
            </Button>
          )}

          <Button onClick={handleShare} className="bg-primary text-primary-foreground font-bold text-xs shadow-md">
            {copied ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-300" /> : <Share2 className="h-3.5 w-3.5 mr-1" />}
            <span>{copied ? "Link Copied!" : "Share Comparison URL"}</span>
          </Button>
        </div>
      </div>

      {/* OVERALL WINNER CARD */}
      {overallWinner && (
        <div className="dark-panel relative overflow-hidden rounded-3xl border border-amber-500/30 bg-[#0a0f1d] bg-gradient-to-r from-amber-500/10 via-[#0e0717] to-[#040810] p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-300">
                <Trophy className="h-3.5 w-3.5 text-amber-400" /> Ballistic Recommendation & Highest Combat Rating
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-white">
                {overallWinner.weapon.name} leads with {overallWinner.total}/100 Rating
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Featuring the optimal blend of stopping power and high cycle fire rate, the{" "}
                <strong>{overallWinner.weapon.name}</strong> delivers superior time-to-kill (TTK) across both indoor room-clearing and open street firefights.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="h-20 w-32 rounded-xl overflow-hidden border border-border bg-black/60 p-2 flex items-center justify-center">
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
                isWinner ? "border-amber-400/60 shadow-[0_0_24px_rgba(251,191,36,0.15)]" : "border-border"
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <button
                    onClick={() => setPickerSlotIndex(idx)}
                    className="rounded-lg bg-muted/50 px-2 py-1 text-xs font-bold text-muted-foreground hover:bg-muted/60 transition-colors"
                  >
                    Slot #{idx + 1}: Swap Weapon ▾
                  </button>
                  {selectedWeapons.length > 2 && (
                    <button
                      onClick={() => handleRemove(idx)}
                      className="rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Visual */}
                <div className="relative h-40 rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-card dark:from-[#0c0517] via-black/90 to-[#170a1f] p-4 flex items-center justify-center mb-4">
                  <img src={w.img} alt={w.name} className="max-h-28 w-full object-contain mix-blend-lighten brightness-125" />
                  <span className="absolute bottom-2 left-2 rounded-lg bg-black/80 px-2 py-0.5 text-xs font-bold text-accent backdrop-blur">
                    {w.klass}
                  </span>
                </div>

                <h3 className="font-display text-base font-black uppercase text-foreground truncate">
                  {w.name}
                </h3>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-muted-foreground">{w.ammoType}</span>
                  <span className="font-mono font-bold text-cyan-600 dark:text-[#00F0FF]">{w.priceDisplay}</span>
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
                  <div className="mt-2 flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-400/10 px-2.5 py-1.5">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-300 flex items-center gap-1">
                      <Trophy className="h-3 w-3" /> Overall Score
                    </span>
                    <span className="font-mono font-black text-sm text-amber-400">
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
                {/* Damage */}
                <div className="rounded-xl border-border bg-muted/60 p-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Damage</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-foreground">{w.damage}/100</span>
                      {w.damage === bestDamage && (
                        <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 text-xs font-black uppercase">
                          Winner
                        </span>
                      )}
                    </div>
                  </div>
                  <Progress value={w.damage} className="h-1.5 mt-1.5" />
                </div>

                {/* DPS Index */}
                <div className="rounded-xl border-border bg-muted/60 p-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-purple-400" /> DPS Index
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-foreground">{dpsIndices[idx]}</span>
                      {dpsIndices[idx] === bestDps && selectedWeapons.length > 1 && (
                        <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 text-xs font-black uppercase">
                          Winner
                        </span>
                      )}
                    </div>
                  </div>
                  <Progress value={dpsIndices[idx]} className="h-1.5 mt-1.5" />
                </div>

                {/* Fire Rate */}
                <div className="rounded-xl border-border bg-muted/60 p-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Fire Rate</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-foreground">{w.fireRate}/100</span>
                      {w.fireRate === bestFireRate && (
                        <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 text-xs font-black uppercase">
                          Winner
                        </span>
                      )}
                    </div>
                  </div>
                  <Progress value={w.fireRate} className="h-1.5 mt-1.5" />
                </div>

                {/* Accuracy */}
                <div className="rounded-xl border-border bg-muted/60 p-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Accuracy</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-foreground">{w.accuracy}/100</span>
                      {w.accuracy === bestAccuracy && (
                        <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 text-xs font-black uppercase">
                          Winner
                        </span>
                      )}
                    </div>
                  </div>
                  <Progress value={w.accuracy} className="h-1.5 mt-1.5" />
                </div>

                {/* Range */}
                <div className="rounded-xl border-border bg-muted/60 p-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Range</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-foreground">{w.range}/100</span>
                      {w.range === bestRange && (
                        <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 text-xs font-black uppercase">
                          Winner
                        </span>
                      )}
                    </div>
                  </div>
                  <Progress value={w.range} className="h-1.5 mt-1.5" />
                </div>
              </div>

              {/* PROS & CONS */}
              <div className="mt-4 pt-3 border-t border-border space-y-2 text-xs">
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
              <div className="mt-5 pt-3 border-t border-border flex items-center justify-between gap-2">
                <FavoriteButton type="weapons" id={w.id} showText={false} />
                <Link
                  href={`/weapons/${w.slug}`}
                  className="flex-1 text-center rounded-xl bg-muted/40 hover:bg-muted/50 py-2 text-xs font-bold text-foreground transition-colors border border-border"
                >
                  Full Ballistics
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* RADAR + FEATURE COMPARISON */}
      {selectedWeapons.length >= 2 && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card-surface rounded-3xl border border-border p-5">
            <h3 className="font-display text-sm font-black uppercase text-foreground mb-1">Ballistics Radar</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Damage • Fire Rate • Accuracy • Range • Reload • Magazine
            </p>
            <RadarChart axes={["Damage", "Fire Rate", "Accuracy", "Range", "Reload", "Mag"]} series={radarSeries} />
          </div>

          <div className="card-surface rounded-3xl border border-border p-5">
            <h3 className="font-display text-sm font-black uppercase text-foreground mb-1">Special Features</h3>
            <p className="text-xs text-muted-foreground mb-3">Attachments, ammunition & special traits</p>
            {featureUnion.length === 0 ? (
              <p className="text-xs text-muted-foreground py-8 text-center">
                None of the selected weapons have special features listed yet.
              </p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {featureMatrix.map(({ feature, present }) => (
                  <div key={feature} className="grid gap-2 items-center" style={{ gridTemplateColumns: `1.4fr repeat(${selectedWeapons.length}, 1fr)` }}>
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
          contenders={selectedWeapons.map((w, i) => ({ name: w.name, color: RADAR_COLORS[i % RADAR_COLORS.length] }))}
          rows={tableRows}
        />
      )}

      {/* WEAPON PICKER MODAL */}
      {pickerSlotIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="card-surface max-w-2xl w-full max-h-[80vh] overflow-hidden rounded-3xl border border-border p-6 flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="font-display text-lg font-black uppercase text-foreground">
                Choose Firearm for Slot #{pickerSlotIndex + 1}
              </h3>
              <button
                onClick={() => setPickerSlotIndex(null)}
                className="rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-muted/50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto mt-4 space-y-2 pr-1">
              {weaponList.map((cand) => {
                const isCurrent = selectedSlugs.includes(cand.slug);
                return (
                  <button
                    key={cand.id}
                    onClick={() => handleSelectSlot(cand.slug)}
                    className={cn(
                      "w-full text-left rounded-2xl border p-3 flex items-center justify-between gap-3 transition-all",
                      isCurrent
                        ? "border-accent bg-accent/10 opacity-60"
                        : "border-border bg-muted/60 hover:border-primary/40 hover:bg-muted/40"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-16 rounded-xl bg-black/60 p-1 flex items-center justify-center">
                        <img src={cand.img} alt={cand.name} className="max-h-full max-w-full object-contain mix-blend-lighten" />
                      </div>
                      <div>
                        <h4 className="font-display text-sm font-bold text-foreground">{cand.name}</h4>
                        <p className="text-xs text-muted-foreground">{cand.klass} &bull; Damage {cand.damage}</p>
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
