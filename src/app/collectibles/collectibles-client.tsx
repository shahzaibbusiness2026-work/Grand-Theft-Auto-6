"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Circle,
  Search,
  MapPin,
  Sparkles,
  ExternalLink,
  HelpCircle,
  Trophy,
  Filter,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { canonicalCollectibles, type CanonicalCollectible } from "@/lib/canonical-data";
import { ConfidenceBadge } from "@/components/confidence-badge";
import {
  getStoredUserState,
  saveStoredUserState,
  toggleTrackerItem,
  type UserState,
} from "@/lib/user-store";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const COLLECTIBLE_CATEGORIES = [
  "All",
  "Hidden Packages",
  "Stunt Jumps",
  "Rebel Radio",
  "Wildlife Photos",
  "Weapon Parts",
  "Easter Eggs",
] as const;

export function CollectiblesClient() {
  const [userState, setUserState] = useState<UserState | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<"all" | "collected" | "uncollected">("all");

  useEffect(() => {
    setUserState(getStoredUserState());

    const handleSync = () => {
      setUserState(getStoredUserState());
    };

    window.addEventListener("gta6_user_state_change", handleSync);
    return () => window.removeEventListener("gta6_user_state_change", handleSync);
  }, []);

  const completedIds = useMemo(() => {
    return userState?.tracker.completedIds || [];
  }, [userState]);

  const districts = useMemo(() => {
    const list = Array.from(new Set(canonicalCollectibles.map((c) => c.district)));
    return ["All", ...list];
  }, []);

  const totalCount = canonicalCollectibles.length;
  const collectedCount = canonicalCollectibles.filter((c) => completedIds.includes(c.id)).length;
  const progressPercent = Math.round((collectedCount / (totalCount || 1)) * 100);

  const filteredItems = useMemo(() => {
    return canonicalCollectibles.filter((item) => {
      if (selectedCategory !== "All" && item.category !== selectedCategory) {
        return false;
      }
      if (selectedDistrict !== "All" && item.district !== selectedDistrict) {
        return false;
      }
      const isDone = completedIds.includes(item.id);
      if (filterStatus === "collected" && !isDone) return false;
      if (filterStatus === "uncollected" && isDone) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDistrict = item.district.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchReward = item.reward.toLowerCase().includes(q);
        return matchTitle || matchDistrict || matchDesc || matchReward;
      }

      return true;
    });
  }, [selectedCategory, selectedDistrict, filterStatus, searchQuery, completedIds]);

  const handleToggle = (id: string) => {
    toggleTrackerItem(id);
  };

  return (
    <div className="space-y-8">
      {/* Overview Stat Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card-carbon p-4 text-center border-slate-800">
          <span className="font-display text-2xl sm:text-3xl font-black text-white">{totalCount}</span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mt-1">
            Verified Collectibles
          </span>
        </div>
        <div className="card-carbon p-4 text-center border-emerald-500/20 bg-emerald-950/10">
          <span className="font-display text-2xl sm:text-3xl font-black text-emerald-400">{collectedCount}</span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400/80 block mt-1">
            Found / Collected
          </span>
        </div>
        <div className="card-carbon p-4 text-center border-amber-500/20 bg-amber-950/10">
          <span className="font-display text-2xl sm:text-3xl font-black text-amber-400">{totalCount - collectedCount}</span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400/80 block mt-1">
            Remaining To Find
          </span>
        </div>
        <div className="card-carbon p-4 text-center border-accent/20 bg-accent/10">
          <span className="font-display text-2xl sm:text-3xl font-black text-accent">{progressPercent}%</span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-accent/80 block mt-1">
            Collection Progress
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card-carbon p-4">
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
          <span>Overall Leonida Collectible Progress</span>
          <span className="font-mono text-primary">{collectedCount} / {totalCount} Items</span>
        </div>
        <Progress value={progressPercent} className="h-2 bg-slate-800" />
      </div>

      {/* Search & Filter Toolbar */}
      <div className="card-carbon p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search collectible name, reward, district, guide instructions..."
              className="input-search pl-10 pr-4 py-2.5 w-full text-xs"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-primary"
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d === "All" ? "All Districts" : d}
                </option>
              ))}
            </select>

            <div className="bg-slate-900 p-1 rounded-xl border border-slate-700 flex text-xs">
              <button
                onClick={() => setFilterStatus("all")}
                className={cn(
                  "px-3 py-1 rounded-lg font-medium transition-colors",
                  filterStatus === "all" ? "bg-primary text-white" : "text-slate-400 hover:text-white"
                )}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus("uncollected")}
                className={cn(
                  "px-3 py-1 rounded-lg font-medium transition-colors",
                  filterStatus === "uncollected" ? "bg-amber-500/20 text-amber-300" : "text-slate-400 hover:text-white"
                )}
              >
                Pending
              </button>
              <button
                onClick={() => setFilterStatus("collected")}
                className={cn(
                  "px-3 py-1 rounded-lg font-medium transition-colors",
                  filterStatus === "collected" ? "bg-emerald-500/20 text-emerald-300" : "text-slate-400 hover:text-white"
                )}
              >
                Found
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
          {COLLECTIBLE_CATEGORIES.map((cat) => {
            const count = cat === "All"
              ? canonicalCollectibles.length
              : canonicalCollectibles.filter((c) => c.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full font-semibold transition-all border",
                  isSelected
                    ? "border-primary bg-primary text-white shadow-[0_0_12px_rgba(244,63,94,0.4)]"
                    : "border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                )}
              >
                {cat} <span className="opacity-60 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Collectibles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.length === 0 ? (
          <div className="col-span-full card-carbon p-12 text-center">
            <HelpCircle className="h-10 w-10 text-slate-500 mx-auto mb-3" />
            <h3 className="font-display text-lg font-bold text-white">No Collectibles Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No items match your filter criteria. Try expanding your search or selecting &quot;All Categories&quot;.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedDistrict("All");
                setFilterStatus("all");
                setSearchQuery("");
              }}
              className="btn-secondary text-xs px-4 py-2 mt-4 inline-flex items-center gap-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isDone = completedIds.includes(item.id);

            return (
              <div
                key={item.id}
                className={cn(
                  "card-carbon overflow-hidden flex flex-col justify-between border transition-all duration-200 group",
                  isDone
                    ? "border-emerald-500/30 bg-emerald-950/10"
                    : "border-slate-800/80 hover:border-slate-700 bg-slate-900/60"
                )}
              >
                <div>
                  {/* Top Thumbnail */}
                  <div className="relative h-40 w-full overflow-hidden bg-slate-950">
                    <Image
                      src={item.img}
                      alt={`${item.title} - GTA 6 Collectible`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />

                    {/* Toggle Button */}
                    <button
                      onClick={() => handleToggle(item.id)}
                      className={cn(
                        "absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md border transition-all",
                        isDone
                          ? "bg-emerald-500 text-white border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                          : "bg-slate-950/70 text-slate-300 border-slate-700 hover:text-white hover:border-slate-500"
                      )}
                      title={isDone ? "Mark as uncollected" : "Mark as collected"}
                    >
                      {isDone ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                    </button>

                    {/* District & Category */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900/90 text-slate-200 border border-slate-700">
                        {item.category}
                      </span>
                      <ConfidenceBadge confidence={item.confidence} source={item.source} size="sm" />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-accent font-medium">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{item.district}</span>
                    </div>

                    <Link href={`/collectibles/${item.slug}`}>
                      <h3
                        className={cn(
                          "font-display text-base font-bold text-white group-hover:text-primary transition-colors",
                          isDone && "line-through text-slate-400"
                        )}
                      >
                        {item.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[11px] font-mono space-y-1">
                      <div className="text-amber-400 flex items-center gap-1">
                        <Trophy className="h-3 w-3 text-amber-400 flex-shrink-0" />
                        <span className="truncate">Reward: {item.reward}</span>
                      </div>
                      <div className="text-slate-400 truncate">
                        Req: {item.requirements}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-slate-800/60 mt-2">
                  <Link
                    href={`/map?poi=poi-ocean-drive`}
                    className="text-[11px] font-medium text-accent hover:underline flex items-center gap-1 py-1"
                  >
                    <MapPin className="h-3 w-3" /> Map View
                  </Link>

                  <Link
                    href={`/collectibles/${item.slug}`}
                    className="btn-secondary text-xs px-3 py-1.5 inline-flex items-center gap-1 font-semibold"
                  >
                    Walkthrough <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
