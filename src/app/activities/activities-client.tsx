"use client";

import { useEffect, useMemo, useState } from "react";
import { Compass, RotateCcw, CheckCircle2, Circle, AlertTriangle } from "lucide-react";

type Item = { name: string; desc: string; location: string; status: "Confirmed" | "Expected"; category: string };

const ITEMS: Item[] = [
  { name: "Hunting", desc: "Track wildlife across Mount Kalaga's backcountry.", location: "Mount Kalaga National Park", status: "Expected", category: "Outdoors" },
  { name: "Fishing", desc: "Cast off from Keys docks and boats.", location: "Leonida Keys", status: "Expected", category: "Outdoors" },
  { name: "Mini-Golf", desc: "Cal's pastime — a full round, Keys style.", location: "Leonida Keys", status: "Expected", category: "Leisure" },
  { name: "Diving & Underwater Caches", desc: "Dive for submerged caches hidden off the coast.", location: "Leonida coastline", status: "Expected", category: "Outdoors" },
  { name: "Stunt Jumps", desc: "Hit every ramp and land it clean.", location: "All Leonida", status: "Expected", category: "Driving" },
  { name: "Off-Road Trails", desc: "Mud, rock and river crossings in the national park.", location: "Mount Kalaga", status: "Expected", category: "Driving" },
  { name: "Street Racing", desc: "Unsanctioned night races through Vice City.", location: "Vice City", status: "Expected", category: "Driving" },
  { name: "Boat Racing", desc: "Powerboat runs through the Keys channels.", location: "Leonida Keys", status: "Expected", category: "Driving" },
  { name: "Air Challenges", desc: "Time trials and stunt runs in planes and helicopters.", location: "Leonida airspace", status: "Expected", category: "Flying" },
  { name: "Nightlife & Clubs", desc: "NINE 1 NINE and the Vice City club scene.", location: "Downtown Vice City", status: "Expected", category: "Leisure" },
  { name: "Wildlife Photography", desc: "Photograph flamingos, gators and other wildlife (a feline figure spotted in trailer footage is rumoured to be a mountain lion).", location: "Grassrivers / Kalaga", status: "Expected", category: "Outdoors" },
  { name: "Shooting Range", desc: "Test every weapon at Ammu-Nation ranges.", location: "Ammu-Nation stores", status: "Expected", category: "Combat" },
  { name: "Triathlon & Fitness", desc: "Swim, cycle and run endurance events.", location: "Vice Beach", status: "Expected", category: "Leisure" },
  { name: "Smuggling Runs", desc: "Move product through Coast Guard-patrolled waters.", location: "Leonida Keys", status: "Expected", category: "Work" },
];

const CATS = ["All", "Outdoors", "Driving", "Flying", "Leisure", "Combat", "Work"] as const;
const KEY = "tzg_activities_v1";

export function ActivitiesClient() {
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
          <strong>Confirmed vs Expected.</strong> Activities marked Confirmed appear in Rockstar&apos;s trailers or Newswire posts.
          Expected ones follow GTA 5&apos;s playbook and will be confirmed from real gameplay at launch.
        </p>
      </div>

      <div className="card-carbon p-6 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-primary" />
            <span className="font-black text-lg">{done} / {ITEMS.length} activities tried</span>
          </div>
          <span className="font-mono font-bold text-primary text-xl">{pct}%</span>
        </div>
        <div className="mt-3 h-3 rounded-full bg-black/40 border border-white/10 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-foreground/60 mt-2">Progress saves on this device only. Tick activities off as you try them in-game.</p>
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
                    <p className="text-xs text-foreground/50 mt-1.5">{item.location}</p>
                  </div>
                </div>
                <span className={`shrink-0 text-xs font-black px-2 py-1 rounded-full border ${item.status === "Confirmed" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40" : "bg-amber-500/15 text-amber-400 border-amber-500/40"}`}>{item.status}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
