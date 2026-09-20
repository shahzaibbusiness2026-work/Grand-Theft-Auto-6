"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Flag,
  Target,
  Clock,
  Coins,
  ChevronRight,
  ShieldAlert,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { canonicalMissions, CanonicalMission } from "@/lib/canonical-data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ConfidenceBadge } from "@/components/confidence-badge";

const TYPES = ["All Types", "Main Story", "Side Contract", "Heist"];
const CHARACTERS = ["All Characters", "Lucia", "Jason", "Both"];
const DIFFICULTIES = ["All Difficulties", "Easy", "Medium", "Hard", "Extreme"];

export function MissionsClient() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedChar, setSelectedChar] = useState("All Characters");
  const [selectedDiff, setSelectedDiff] = useState("All Difficulties");
  const [sortBy, setSortBy] = useState<"default" | "reward" | "title">("default");

  const filteredMissions = useMemo(() => {
    return canonicalMissions
      .filter((m) => {
        const matchesType = selectedType === "All Types" || m.type === selectedType;
        const matchesChar =
          selectedChar === "All Characters" ||
          m.character === selectedChar ||
          (selectedChar === "Both" && (m.character === "Both" || m.character === "Any"));
        const matchesDiff = selectedDiff === "All Difficulties" || m.difficulty === selectedDiff;
        const matchesSearch =
          m.title.toLowerCase().includes(search.toLowerCase()) ||
          m.district.toLowerCase().includes(search.toLowerCase()) ||
          m.description.toLowerCase().includes(search.toLowerCase());
        return matchesType && matchesChar && matchesDiff && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "reward") return (b.cashReward || 0) - (a.cashReward || 0);
        if (sortBy === "title") return a.title.localeCompare(b.title);
        return a.id.localeCompare(b.id);
      });
  }, [search, selectedType, selectedChar, selectedDiff, sortBy]);

  return (
    <div className="space-y-8">
      {/* Controls Container */}
      <div className="card-surface p-5 rounded-3xl border border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search missions, districts, or objectives..."
              className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          {/* Sort pills */}
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/30 p-1">
            <button
              onClick={() => setSortBy("default")}
              className={cn(
                "rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all",
                sortBy === "default" ? "bg-accent text-white font-bold" : "text-slate-400 hover:text-white"
              )}
            >
              Default
            </button>
            <button
              onClick={() => setSortBy("reward")}
              className={cn(
                "rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all",
                sortBy === "reward" ? "bg-accent text-white font-bold" : "text-slate-400 hover:text-white"
              )}
            >
              Highest Payout
            </button>
            <button
              onClick={() => setSortBy("title")}
              className={cn(
                "rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all",
                sortBy === "title" ? "bg-accent text-white font-bold" : "text-slate-400 hover:text-white"
              )}
            >
              Title A–Z
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-white/10">
          {/* Type */}
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Mission Type:</span>
            <div className="flex flex-wrap gap-1">
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all",
                    selectedType === t
                      ? "bg-[#00F0FF] text-black font-bold shadow-sm"
                      : "bg-white/5 text-slate-400 hover:text-white"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Character */}
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Operative:</span>
            <div className="flex flex-wrap gap-1">
              {CHARACTERS.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedChar(c)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all",
                    selectedChar === c
                      ? "bg-accent text-white font-bold shadow-sm"
                      : "bg-white/5 text-slate-400 hover:text-white"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Threat Level:</span>
            <div className="flex flex-wrap gap-1">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDiff(d)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all",
                    selectedDiff === d
                      ? "bg-amber-400 text-black font-bold shadow-sm"
                      : "bg-white/5 text-slate-400 hover:text-white"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Missions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Showing <span className="text-white font-mono">{filteredMissions.length}</span> Verified Missions & Contracts
          </p>
        </div>

        {filteredMissions.length === 0 ? (
          <div className="card-surface p-12 text-center rounded-3xl border border-white/10">
            <p className="font-display text-lg font-bold text-white">No missions found matching your filters</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting your search query or selecting &ldquo;All Types&rdquo;.</p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedType("All Types");
                setSelectedChar("All Characters");
                setSelectedDiff("All Difficulties");
              }}
              className="mt-4 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-md"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredMissions.map((m) => (
              <div
                key={m.id}
                className="group card-surface relative rounded-3xl border border-white/10 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-2xl"
              >
                {/* Image Banner */}
                <div className="relative h-44 overflow-hidden bg-black/60">
                  <Image
                    src={m.img}
                    alt={`${m.title} - GTA 6 Mission (${m.type})`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070b15] via-transparent to-transparent pointer-events-none" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full bg-black/75 px-2.5 py-0.5 text-[9px] font-black uppercase text-accent border border-accent/30 backdrop-blur">
                      {m.type}
                    </span>
                    <ConfidenceBadge level={m.confidence} size="sm" />
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-black/80 px-2 py-0.5 rounded border border-white/10 backdrop-blur">
                      {m.cashRewardDisplay}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-300 bg-black/80 px-2 py-0.5 rounded border border-white/10 backdrop-blur">
                      ⏱ {m.duration}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#00F0FF] uppercase mb-1">
                      <Users className="h-3 w-3" />
                      <span>{m.character} &bull; {m.district}</span>
                    </div>
                    <h3 className="font-display text-base font-black text-white group-hover:text-accent transition-colors leading-snug">
                      {m.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-300 line-clamp-2">
                      {m.description}
                    </p>
                  </div>

                  {/* Objectives summary */}
                  <div className="rounded-2xl border border-white/5 bg-black/40 p-3 space-y-1 text-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Key Objective:</span>
                    <p className="text-[11px] text-slate-200 truncate">🎯 {m.objectives[0]}</p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className={cn(
                      "text-[10px] font-black uppercase px-2 py-0.5 rounded border",
                      m.difficulty === "Easy" && "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
                      m.difficulty === "Medium" && "border-amber-500/40 text-amber-400 bg-amber-500/10",
                      (m.difficulty === "Hard" || m.difficulty === "Extreme") && "border-rose-500/40 text-rose-400 bg-rose-500/10"
                    )}>
                      {m.difficulty}
                    </span>

                    <Link
                      href={`/missions/${m.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:text-white transition-colors"
                    >
                      <span>Full Walkthrough</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
