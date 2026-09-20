"use client";

import { useState, useEffect, useMemo } from "react";
import {
  CheckCircle2,
  Circle,
  Trophy,
  Sparkles,
  RotateCcw,
  Star,
  Flag,
  Gem,
  Car,
  Crosshair,
  Shield,
  Layers,
} from "lucide-react";
import { Donut } from "@/components/ui/donut";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface TrackerItem {
  id: string;
  category: "Story" | "Side" | "Collectibles" | "Activities";
  title: string;
  district: string;
  rp: number;
}

const TRACKER_ITEMS: TrackerItem[] = [
  // Story Missions
  { id: "m-1", category: "Story", title: "01: Welcome to Leonida", district: "Vice City", rp: 500 },
  { id: "m-2", category: "Story", title: "02: Back in Vice (Lucia & Jason)", district: "Ocean Beach", rp: 650 },
  { id: "m-3", category: "Story", title: "03: The Score: Bank of Keys", district: "Leonida Keys", rp: 1200 },
  { id: "m-4", category: "Story", title: "04: The Exchange & Double Cross", district: "Port Gellhorn", rp: 800 },
  { id: "m-5", category: "Story", title: "05: Little Haiti Cartel Run", district: "Little Haiti", rp: 950 },
  { id: "m-6", category: "Story", title: "06: Starfish Island Mansion Heist", district: "Starfish Island", rp: 1500 },

  // Side Encounters
  { id: "s-1", category: "Side", title: "Lost Cartel Deliveries", district: "Grassrivers", rp: 350 },
  { id: "s-2", category: "Side", title: "Private Property Eviction", district: "Downtown Vice", rp: 300 },
  { id: "s-3", category: "Side", title: "South Beach Midnight Drag Race", district: "Ocean Drive", rp: 400 },
  { id: "s-4", category: "Side", title: "Bounty: The Gator Poacher", district: "Everglades Marsh", rp: 450 },

  // Collectibles
  { id: "c-1", category: "Collectibles", title: "Hidden Package #01 (Ocean View Suite)", district: "Ocean Beach", rp: 150 },
  { id: "c-2", category: "Collectibles", title: "Hidden Package #02 (Submerged Freighter)", district: "Biscayne Bay", rp: 200 },
  { id: "c-3", category: "Collectibles", title: "Rebel Radio Station Transmitter", district: "Wave 103 HQ", rp: 250 },
  { id: "c-4", category: "Collectibles", title: "Wildlife Photo: Rare Pink Flamingo", district: "Grassrivers", rp: 150 },

  // Activities
  { id: "a-1", category: "Activities", title: "Stunt Jump #01 (Vice Airport Runway)", district: "VIA Airport", rp: 200 },
  { id: "a-2", category: "Activities", title: "Ammu-Nation Subterranean Shooting Range", district: "Downtown", rp: 300 },
  { id: "a-3", category: "Activities", title: "Custom Vehicle Chop Shop Upgrade", district: "Little Haiti", rp: 250 },
];

export function TrackerClient() {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [mounted, setMounted] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("gta6_atlas_tracker_completed");
      if (saved) {
        setCompletedIds(JSON.parse(saved));
      } else {
        // Default some items as completed for initial feel
        setCompletedIds(["m-1", "m-2", "c-1", "a-1"]);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to LocalStorage
  const toggleItem = (id: string) => {
    setCompletedIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      try {
        localStorage.setItem("gta6_atlas_tracker_completed", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const resetAll = () => {
    setCompletedIds([]);
    try {
      localStorage.removeItem("gta6_atlas_tracker_completed");
    } catch {}
  };

  const completeAll = () => {
    const all = TRACKER_ITEMS.map((i) => i.id);
    setCompletedIds(all);
    try {
      localStorage.setItem("gta6_atlas_tracker_completed", JSON.stringify(all));
    } catch {}
  };

  const stats = useMemo(() => {
    const total = TRACKER_ITEMS.length;
    const completed = completedIds.length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    const totalRP = TRACKER_ITEMS.reduce((acc, curr) => {
      return completedIds.includes(curr.id) ? acc + curr.rp : acc;
    }, 0);

    return { total, completed, pct, totalRP };
  }, [completedIds]);

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return TRACKER_ITEMS;
    return TRACKER_ITEMS.filter((i) => i.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="space-y-6">
      {/* Real-time Progress HUD Header */}
      <div className="card-surface p-6 rounded-2xl border-border/80 shadow-xl bg-gradient-to-br from-card via-card to-primary/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <Donut value={mounted ? stats.pct : 25} size={84} strokeWidth={8} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-sm font-black text-foreground">
                  {mounted ? `${stats.pct}%` : "..."}
                </span>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-neon-green/30 bg-neon-green/10 px-2.5 py-0.5 text-[10px] font-bold text-neon-green">
                <Sparkles className="h-3 w-3" /> Live LocalStorage Sync Active
              </div>
              <h2 className="mt-1 font-display text-2xl font-black uppercase tracking-tight text-foreground">
                100% Completion <span className="text-accent text-glow-amber">Tracker</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {stats.completed} of {stats.total} Objectives Finished •{" "}
                <strong className="text-foreground">{stats.totalRP.toLocaleString()} RP Earned</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetAll}
              className="rounded-xl border border-border/80 bg-muted/40 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Reset All
            </button>
            <button
              onClick={completeAll}
              className="rounded-xl bg-primary px-3.5 py-1.5 font-display text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:brightness-110 active:scale-95 transition-all"
            >
              Check All 100%
            </button>
          </div>
        </div>

        {/* Global Bar */}
        <div className="mt-5">
          <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-1.5">
            <span>Progress Toward Leonida Platinum Trophy</span>
            <span className="text-foreground font-bold">{stats.pct}% Complete</span>
          </div>
          <Progress value={mounted ? stats.pct : 25} className="h-2.5 bg-muted" />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 no-scrollbar">
        <div className="flex items-center gap-1.5">
          {["All", "Story", "Side", "Collectibles", "Activities"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all",
                activeCategory === cat
                  ? "bg-accent text-white shadow-xs"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground hidden sm:inline">
          Click any circle to mark complete
        </span>
      </div>

      {/* Interactive Objectives Checklist */}
      <div className="space-y-2.5">
        {filteredItems.map((item) => {
          const isDone = completedIds.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={cn(
                "group card-surface flex cursor-pointer items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:border-accent/60",
                isDone
                  ? "border-neon-green/40 bg-neon-green/5 shadow-xs"
                  : "border-border/80 hover:bg-muted/30"
              )}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <button
                  type="button"
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all",
                    isDone
                      ? "border-neon-green bg-neon-green text-white shadow-sm"
                      : "border-border group-hover:border-accent text-transparent"
                  )}
                  aria-label={isDone ? "Mark incomplete" : "Mark complete"}
                >
                  <CheckCircle2 className="h-4 w-4 fill-current text-white" />
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "font-display text-sm font-bold truncate transition-colors",
                        isDone ? "line-through text-muted-foreground" : "text-foreground"
                      )}
                    >
                      {item.title}
                    </span>
                    <span className="rounded bg-muted px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.district}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span
                  className={cn(
                    "font-display text-xs font-bold",
                    isDone ? "text-neon-green" : "text-accent"
                  )}
                >
                  +{item.rp} RP
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
