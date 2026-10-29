"use client";

import { useEffect, useMemo, useState } from "react";
import { Trophy, RotateCcw, CheckCircle2, Circle, AlertTriangle } from "lucide-react";

type Tier = "Bronze" | "Silver" | "Gold" | "Platinum";
type Item = { name: string; desc: string; tier: Tier; category: string };

const ITEMS: Item[] = [
  { name: "Welcome to Leonida", desc: "Complete the opening chapter with Jason and Lucia.", tier: "Bronze", category: "Story" },
  { name: "Partners in Crime", desc: "Pull off your first heist as the duo.", tier: "Bronze", category: "Story" },
  { name: "Keys to the Kingdom", desc: "Finish the Leonida Keys story arc.", tier: "Silver", category: "Story" },
  { name: "Six Stars and Counting", desc: "Reach the six-star wanted level shown in the Extended Look.", tier: "Silver", category: "Story" },
  { name: "Vice City Legend", desc: "Complete the full story of GTA 6.", tier: "Gold", category: "Story" },
  { name: "Keys Explorer", desc: "Visit every district of the Leonida Keys.", tier: "Bronze", category: "Exploration" },
  { name: "Vice Beach Bum", desc: "Spend a day across Vice Beach, Ocean Drive and the boardwalk.", tier: "Bronze", category: "Exploration" },
  { name: "Kalaga Summit", desc: "Reach the top of Mount Kalaga National Park.", tier: "Silver", category: "Exploration" },
  { name: "Underwater Cache Hunter", desc: "Recover a submerged cache from Leonida's waters.", tier: "Silver", category: "Exploration" },
  { name: "Every Corner", desc: "Discover all locations on the interactive map.", tier: "Gold", category: "Exploration" },
  { name: "Sharpshooter", desc: "Land 50 headshots with scoped weapons.", tier: "Bronze", category: "Combat" },
  { name: "Demolition Man", desc: "Destroy 25 vehicles with explosives.", tier: "Bronze", category: "Combat" },
  { name: "One Man Army", desc: "Survive a five-star wanted level for 10 minutes.", tier: "Silver", category: "Combat" },
  { name: "Silent But Deadly", desc: "Complete a mission without raising an alarm.", tier: "Silver", category: "Combat" },
  { name: "Cache Collector", desc: "Find 25 hidden caches across Leonida.", tier: "Bronze", category: "Collectibles" },
  { name: "Hidden Package Hunter", desc: "Find all hidden packages.", tier: "Silver", category: "Collectibles" },
  { name: "Wildlife Photographer", desc: "Photograph 10 species in the wild.", tier: "Silver", category: "Collectibles" },
  { name: "Stunt Jumper", desc: "Land every stunt jump in Leonida.", tier: "Gold", category: "Collectibles" },
  { name: "Big Catch", desc: "Land a trophy fish in the Leonida Keys.", tier: "Bronze", category: "Activities" },
  { name: "Birdie in the Keys", desc: "Finish a round of mini-golf under par.", tier: "Bronze", category: "Activities" },
  { name: "Top of the Food Chain", desc: "Complete a full hunt in Mount Kalaga.", tier: "Silver", category: "Activities" },
  { name: "Ace Pilot", desc: "Complete an air challenge without damage.", tier: "Silver", category: "Activities" },
  { name: "Tommy's Lizard", desc: "Find the lizard in the Hawaiian shirt from Trailer 2.", tier: "Bronze", category: "Hidden" },
  { name: "The Truth Is Out There", desc: "Spend a night listening to Coast Guard radio with Cal.", tier: "Bronze", category: "Hidden" },
  { name: "100% Leonida", desc: "Reach 100% completion. The platinum.", tier: "Platinum", category: "Story" },
];

const CATS = ["All", "Story", "Exploration", "Combat", "Collectibles", "Activities", "Hidden"] as const;
const KEY = "tzg_achievements_v1";
const TIER_STYLE: Record<Tier, string> = {
  Bronze: "bg-amber-600/15 text-amber-500 border-amber-600/40",
  Silver: "bg-slate-400/15 text-slate-300 border-slate-400/40",
  Gold: "bg-yellow-500/15 text-yellow-400 border-yellow-500/40",
  Platinum: "bg-cyan-500/15 text-cyan-400 border-cyan-500/40",
};

export function AchievementsClient() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [cat, setCat] = useState<string>("All");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try { setChecked(JSON.parse(localStorage.getItem(KEY) || "{}")); } catch { /* ignore */ }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) { try { localStorage.setItem(KEY, JSON.stringify(checked)); } catch { /* ignore */ } }
  }, [checked, loaded]);

  const filtered = useMemo(() => cat === "All" ? ITEMS : ITEMS.filter((i) => i.category === cat), [cat]);
  const done = ITEMS.filter((i) => checked[i.name]).length;
  const pct = Math.round((done / ITEMS.length) * 100);

  return (
    <div>
      <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 mb-8 flex gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400" />
        <p className="text-sm text-foreground/90">
          <strong>Pre-release data — expected list, not official.</strong> Rockstar has not published GTA 6’s trophy or achievement list yet.
          This tracker is built from GTA 5’s trophy patterns and trailer evidence. Every item below carries an Expected badge and
          will be corrected against the real list at launch on November 19, 2026.
        </p>
      </div>

      <div className="card-carbon p-6 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <span className="font-black text-lg">{done} / {ITEMS.length} unlocked</span>
          </div>
          <span className="font-mono font-bold text-primary text-xl">{pct}%</span>
        </div>
        <div className="mt-3 h-3 rounded-full bg-black/40 border border-white/10 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-foreground/60 mt-2">Progress saves on this device only. PlayStation trophies and Xbox achievements share the same list.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${cat === c ? "bg-primary text-white border-primary" : "border-white/15 bg-black/20 hover:border-primary/50"}`}>{c}</button>
        ))}
        <button onClick={() => setChecked({})} className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold border border-white/15 hover:border-red-400/60">
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((item) => {
          const on = !!checked[item.name];
          return (
            <button key={item.name} onClick={() => setChecked((p) => ({ ...p, [item.name]: !p[item.name] }))}
              className={`text-left rounded-xl border p-4 transition-all ${on ? "border-primary/60 bg-primary/10" : "border-white/10 bg-black/20 hover:border-primary/40"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  {on ? <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary shrink-0" /> : <Circle className="h-5 w-5 mt-0.5 text-foreground/40 shrink-0" />}
                  <div>
                    <p className={`font-bold ${on ? "line-through text-foreground/60" : ""}`}>{item.name}</p>
                    <p className="text-sm text-foreground/70 mt-1">{item.desc}</p>
                  </div>
                </div>
                <span className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/15 bg-black/20 text-foreground/60">Expected</span>
                  <span className={`text-xs font-black px-2 py-1 rounded-full border ${TIER_STYLE[item.tier]}`}>{item.tier}</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
