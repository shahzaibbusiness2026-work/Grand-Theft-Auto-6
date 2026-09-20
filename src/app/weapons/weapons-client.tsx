"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Crosshair, ArrowRight, Trophy, Heart } from "lucide-react";
import { canonicalWeapons, CanonicalWeapon } from "@/lib/canonical-data";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { getStoredUserState, toggleFavorite } from "@/lib/user-store";

const CATEGORIES = [
  "All Categories",
  "Pistol",
  "SMG",
  "Assault Rifle",
  "Shotgun",
  "Sniper Rifle",
  "Heavy",
  "Melee",
  "Throwable",
];

const rarityStyles: Record<string, string> = {
  Featured: "bg-accent/15 text-accent border-accent/40",
  Legendary: "bg-amber-500/15 text-amber-400 border-amber-500/40",
  Epic: "bg-purple-500/15 text-purple-400 border-purple-500/40",
  Rare: "bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/40",
  Common: "bg-muted text-muted-foreground border-border",
};

export function WeaponsClient() {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All Categories");
  const [sortBy, setSortBy] = useState<"damage" | "fireRate" | "range" | "price">("damage");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const state = getStoredUserState();
    if (state.favorites?.weapons) {
      setFavorites(state.favorites.weapons);
    }
  }, []);

  const handleToggleFav = (id: string) => {
    const added = toggleFavorite("weapons", id);
    setFavorites((prev) => (added ? [...prev, id] : prev.filter((i) => i !== id)));
  };

  const filteredWeapons = useMemo(() => {
    return canonicalWeapons
      .filter((w) => {
        const matchesCat = selectedCat === "All Categories" || w.klass === selectedCat;
        const matchesSearch =
          w.name.toLowerCase().includes(search.toLowerCase()) ||
          w.klass.toLowerCase().includes(search.toLowerCase()) ||
          w.ammoType.toLowerCase().includes(search.toLowerCase());
        return matchesCat && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "damage") return b.damage - a.damage;
        if (sortBy === "fireRate") return b.fireRate - a.fireRate;
        if (sortBy === "range") return b.range - a.range;
        if (sortBy === "price") return (b.price || 0) - (a.price || 0);
        return 0;
      });
  }, [search, selectedCat, sortBy]);

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="card-surface p-5 rounded-2xl border border-white/10 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search firearms, shotguns, sniper rifles..."
              className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/30 p-1">
              <button
                onClick={() => setSortBy("damage")}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all",
                  sortBy === "damage" ? "bg-accent text-white font-bold" : "text-slate-400 hover:text-white"
                )}
              >
                Damage
              </button>
              <button
                onClick={() => setSortBy("fireRate")}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all",
                  sortBy === "fireRate" ? "bg-accent text-white font-bold" : "text-slate-400 hover:text-white"
                )}
              >
                Fire Rate
              </button>
              <button
                onClick={() => setSortBy("range")}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all",
                  sortBy === "range" ? "bg-accent text-white font-bold" : "text-slate-400 hover:text-white"
                )}
              >
                Range
              </button>
              <button
                onClick={() => setSortBy("price")}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all",
                  sortBy === "price" ? "bg-accent text-white font-bold" : "text-slate-400 hover:text-white"
                )}
              >
                Price
              </button>
            </div>

            <Link
              href="/compare/weapons"
              className="inline-flex items-center gap-1.5 rounded-xl border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent transition-colors hover:bg-accent/20"
            >
              <Trophy className="h-3.5 w-3.5" />
              <span>Duel (2-4)</span>
            </Link>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-semibold transition-all",
                selectedCat === cat
                  ? "bg-gradient-to-r from-primary to-accent text-white font-bold shadow-sm"
                  : "bg-white/5 text-slate-400 hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Weapons */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Showing <span className="text-white font-mono">{filteredWeapons.length}</span> Verified Weapons
          </p>
        </div>

        {filteredWeapons.length === 0 ? (
          <div className="card-surface p-12 text-center rounded-2xl border border-white/10">
            <p className="font-display text-lg font-bold text-white">No weapons found</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting your search query.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredWeapons.map((w) => {
              const isFav = favorites.includes(w.id);
              return (
                <div
                  key={w.id}
                  className="group card-surface relative rounded-3xl border border-white/10 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-xl"
                >
                  {/* Weapon image */}
                  <div className="relative h-44 overflow-hidden bg-gradient-to-br from-[#0c0517] via-black/90 to-[#170a1f] p-4 flex items-center justify-center">
                    <Image
                      src={w.img}
                      alt={`${w.name} - GTA 6 Weapon (${w.klass})`}
                      width={280}
                      height={140}
                      className="max-h-36 w-auto object-contain mix-blend-lighten brightness-125 transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Favorite Heart */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggleFav(w.id);
                      }}
                      className={cn(
                        "absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md transition-all",
                        isFav ? "bg-amber-500 text-slate-950 shadow-md" : "bg-black/50 text-white hover:bg-black/80"
                      )}
                      aria-label="Save weapon"
                    >
                      <Heart className={cn("h-3.5 w-3.5", isFav && "fill-current")} />
                    </button>

                    {/* Rarity & Confidence */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                      <span className={cn("rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider", rarityStyles[w.rarity])}>
                        {w.rarity}
                      </span>
                      <ConfidenceBadge level={w.confidence} size="sm" />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-display text-base font-black text-white group-hover:text-accent transition-colors truncate">
                        {w.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">{w.klass} &bull; {w.ammoType}</p>
                    </div>

                    {/* Stats */}
                    <div className="space-y-2 border-t border-white/10 pt-3 text-xs">
                      <div>
                        <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                          <span>Damage</span>
                          <span className="font-mono text-white font-bold">{w.damage}/100</span>
                        </div>
                        <Progress value={w.damage} className="h-1.5 mt-1" />
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                          <span>Fire Rate</span>
                          <span className="font-mono text-white font-bold">{w.fireRate}/100</span>
                        </div>
                        <Progress value={w.fireRate} className="h-1.5 mt-1" />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-[#00F0FF]">{w.priceDisplay}</span>
                      <Link
                        href={`/weapons/${w.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:text-white transition-colors"
                      >
                        <span>View Specs</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
