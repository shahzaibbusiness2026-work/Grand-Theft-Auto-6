"use client";

import { useState } from "react";
import {
  Trophy,
  LayoutGrid,
  Plus,
  RefreshCw,
  Sparkles,
  Check,
  ChevronDown,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CompareEntity {
  id: string;
  name: string;
  klass: string;
  img: string;
  filter?: string;
  stats: Record<string, string | number>;
}

interface InteractiveCompareProps {
  type: "vehicle" | "weapon";
  labels: { key: string; label: string; isNumeric?: boolean; max?: number; unit?: string; invertBetter?: boolean }[];
  initialEntities: CompareEntity[];
  availableEntities: CompareEntity[];
  recommendationTitle: string;
  recommendationText: string;
}

export function InteractiveCompare({
  type,
  labels,
  initialEntities,
  availableEntities,
  recommendationTitle,
  recommendationText,
}: InteractiveCompareProps) {
  const [selectedEntities, setSelectedEntities] = useState<CompareEntity[]>(initialEntities);
  const [swappingSlot, setSwappingSlot] = useState<number | null>(null);

  const handleSwap = (slotIdx: number, newEntity: CompareEntity) => {
    setSelectedEntities((prev) => {
      const next = [...prev];
      next[slotIdx] = newEntity;
      return next;
    });
    setSwappingSlot(null);
  };

  const calculateBest = (key: string, isNumeric?: boolean, invertBetter?: boolean) => {
    if (!isNumeric) return null;
    let bestVal: number | null = null;
    let bestId: string | null = null;

    selectedEntities.forEach((entity) => {
      const val = typeof entity.stats[key] === "number" 
        ? (entity.stats[key] as number)
        : parseFloat(String(entity.stats[key]).replace(/[^0-9.]/g, ""));

      if (!isNaN(val)) {
        if (bestVal === null) {
          bestVal = val;
          bestId = entity.id;
        } else if (invertBetter ? val < bestVal : val > bestVal) {
          bestVal = val;
          bestId = entity.id;
        }
      }
    });

    return bestId;
  };

  return (
    <div className="space-y-6">
      {/* Active Comparison Matrix */}
      <div className="card-surface overflow-x-auto shadow-xl border-border/80">
        <div className="min-w-[760px]">
          {/* Header Row: Column Cards with Quick Swap Trigger */}
          <div className="grid grid-cols-[180px_repeat(3,1fr)] gap-4 border-b border-border p-5 bg-card/60">
            <div className="flex flex-col justify-between">
              <span className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 px-3.5 py-2 font-display text-xs font-bold uppercase tracking-wider text-white shadow-neon-cyan">
                <LayoutGrid className="h-4 w-4" /> Stat Matrix
              </span>
              <p className="mt-3 text-xs text-muted-foreground">
                Click <strong className="text-foreground">Swap</strong> on any card to change competitor.
              </p>
            </div>

            {selectedEntities.map((entity, slotIdx) => (
              <div key={`${entity.id}-${slotIdx}`} className="relative text-center flex flex-col items-center">
                <div className="relative h-28 w-full overflow-hidden rounded-xl border border-border/70 bg-muted/50 group">
                  <img
                    src={entity.img}
                    alt={entity.name}
                    style={entity.filter ? { filter: entity.filter } : undefined}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={() => setSwappingSlot(swappingSlot === slotIdx ? null : slotIdx)}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-white gap-1.5 backdrop-blur-xs"
                    aria-label={`Swap ${entity.name}`}
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Swap {type}
                  </button>
                </div>

                <div className="mt-2.5 w-full">
                  <h3 className="font-display text-sm font-bold leading-tight text-foreground truncate">
                    {entity.name}
                  </h3>
                  <p className="mt-0.5 text-xs font-semibold text-accent truncate">
                    {entity.klass}
                  </p>
                  <button
                    onClick={() => setSwappingSlot(swappingSlot === slotIdx ? null : slotIdx)}
                    className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground hover:text-accent transition-colors"
                  >
                    <RefreshCw className="h-3 w-3" /> Change
                  </button>
                </div>

                {/* Swapping Dropdown Drawer */}
                {swappingSlot === slotIdx && (
                  <div className="absolute top-full left-1/2 z-50 mt-2 w-64 -translate-x-1/2 rounded-xl border border-border bg-card/95 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between border-b border-border/60 pb-1.5 px-2 mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Select Replacement</span>
                      <button onClick={() => setSwappingSlot(null)} className="p-0.5 text-muted-foreground hover:text-foreground">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="max-h-56 overflow-y-auto space-y-1">
                      {availableEntities.map((cand) => (
                        <button
                          key={cand.id}
                          onClick={() => handleSwap(slotIdx, cand)}
                          className={cn(
                            "flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left text-xs transition-colors",
                            cand.id === entity.id
                              ? "bg-accent/15 text-accent font-bold"
                              : "hover:bg-muted text-foreground"
                          )}
                        >
                          <img src={cand.img} alt="" style={cand.filter ? { filter: cand.filter } : undefined} className="h-8 w-10 rounded object-cover" />
                          <div className="min-w-0">
                            <p className="truncate font-semibold">{cand.name}</p>
                            <p className="truncate text-[10px] text-muted-foreground">{cand.klass}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Stat Comparison Rows */}
          <div className="p-5 space-y-1">
            {labels.map((row) => {
              const bestEntityId = calculateBest(row.key, row.isNumeric, row.invertBetter);

              return (
                <div
                  key={row.key}
                  className="grid grid-cols-[180px_repeat(3,1fr)] items-center gap-4 border-b border-border/40 py-3 last:border-0 hover:bg-muted/20 rounded-lg px-2 transition-colors"
                >
                  <span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {row.label}
                  </span>

                  {selectedEntities.map((entity) => {
                    const rawVal = entity.stats[row.key] ?? "N/A";
                    const isBest = bestEntityId === entity.id;
                    const numVal = typeof rawVal === "number" 
                      ? rawVal 
                      : parseFloat(String(rawVal).replace(/[^0-9.]/g, ""));
                    const pct = row.max && !isNaN(numVal) ? Math.min(100, (numVal / row.max) * 100) : null;

                    return (
                      <div key={entity.id} className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span
                            className={cn(
                              "font-display text-sm font-bold",
                              isBest ? "text-neon-green font-extrabold" : "text-foreground"
                            )}
                          >
                            {String(rawVal)}
                          </span>
                          {isBest && (
                            <span title="Best in class" className="inline-flex">
                              <Trophy className="h-3.5 w-3.5 text-neon-green" />
                            </span>
                          )}
                        </div>

                        {/* Relative Progress Bar for numeric metrics */}
                        {pct !== null && (
                          <div className="mx-auto mt-1.5 h-1.5 w-3/4 overflow-hidden rounded-full bg-muted">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                isBest
                                  ? "bg-neon-green shadow-[0_0_8px_rgba(16,185,129,0.7)]"
                                  : "bg-gradient-to-r from-primary to-accent"
                              )}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Editor's Choice Verdict Banner */}
      <div className="card-surface flex items-start gap-4 border-accent/40 bg-accent/5 p-5 rounded-2xl">
        <span className="icon-tile h-12 w-12 shrink-0 rounded-full border border-accent/50 bg-accent/10 text-accent shadow-neon-cyan">
          <Trophy className="h-6 w-6" />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-accent">VERIFIED BENCHMARK</span>
            <span className="h-1 w-1 rounded-full bg-accent" />
            <span className="text-[11px] font-bold text-muted-foreground">{type.toUpperCase()} DUEL</span>
          </div>
          <h3 className="mt-1 font-display text-base font-bold text-foreground">
            {recommendationTitle}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {recommendationText}
          </p>
        </div>
      </div>

      {/* Available Roster Quick Swap Tray */}
      <div className="card-surface p-5 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
              Quick Roster ({availableEntities.length} Ready to Duel)
            </h4>
            <p className="text-xs text-muted-foreground">
              Click any candidate below to instantly slot them into comparison.
            </p>
          </div>
          <span className="text-[11px] font-bold text-accent">Tap to Swap</span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {availableEntities.map((entity) => {
            const isSelected = selectedEntities.some((s) => s.id === entity.id);
            return (
              <button
                key={entity.id}
                onClick={() => {
                  if (!isSelected) {
                    handleSwap(2, entity); // swap into 3rd slot by default
                  }
                }}
                disabled={isSelected}
                className={cn(
                  "group relative w-36 shrink-0 rounded-xl border p-2.5 text-center transition-all duration-200",
                  isSelected
                    ? "border-accent bg-accent/10 opacity-60 cursor-default"
                    : "border-border hover:border-accent/80 hover:bg-muted/60 active:scale-95"
                )}
              >
                <div className="relative h-16 w-full overflow-hidden rounded-lg bg-muted">
                  <img
                    src={entity.img}
                    alt={entity.name}
                    style={entity.filter ? { filter: entity.filter } : undefined}
                    className="h-full w-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-[10px] font-bold text-white gap-1">
                      <Check className="h-3 w-3 text-neon-green" /> In Duel
                    </div>
                  )}
                </div>
                <h5 className="mt-2 font-display text-xs font-bold leading-tight truncate text-foreground">
                  {entity.name}
                </h5>
                <p className="mt-0.5 text-[10px] text-muted-foreground truncate">{entity.klass}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
