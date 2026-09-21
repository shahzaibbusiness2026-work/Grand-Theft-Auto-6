"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ArrowUpDown, SlidersHorizontal, Trophy, Car, ArrowRight, ShieldCheck } from "lucide-react";
import { canonicalVehicles, CanonicalVehicle } from "@/lib/canonical-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { getStoredUserState, toggleFavorite, isFavorite } from "@/lib/user-store";

const CATEGORIES = [
  "All Types",
  "Super Car",
  "Sports Car",
  "Muscle Car",
  "Off-Road",
  "Motorcycle",
  "Dirt Bike",
  "Boat",
  "Helicopter",
  "Plane",
];

export function VehiclesClient({ initialVehicles }: { initialVehicles?: CanonicalVehicle[] }) {
  const vehicles = initialVehicles && initialVehicles.length > 0 ? initialVehicles : canonicalVehicles;

  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All Types");
  const [sortBy, setSortBy] = useState<"speed" | "power" | "price" | "name">("speed");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const state = getStoredUserState();
    if (state.favorites?.vehicles) {
      setFavorites(state.favorites.vehicles);
    }

    const handleStateChange = () => {
      const updated = getStoredUserState();
      setFavorites(updated.favorites?.vehicles || []);
    };
    window.addEventListener("gta6_user_state_change", handleStateChange);
    return () => window.removeEventListener("gta6_user_state_change", handleStateChange);
  }, []);

  const handleToggleFav = (id: string) => {
    const added = toggleFavorite("vehicles", id);
    setFavorites((prev) => (added ? [...prev, id] : prev.filter((item) => item !== id)));
  };

  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        const matchesCat =
          selectedCat === "All Types" ||
          v.klass.toLowerCase() === selectedCat.toLowerCase();
        const matchesSearch =
          v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.manufacturer.toLowerCase().includes(search.toLowerCase()) ||
          v.klass.toLowerCase().includes(search.toLowerCase());
        return matchesCat && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "speed") return b.topSpeed - a.topSpeed;
        if (sortBy === "power") return b.power - a.power;
        if (sortBy === "price") return (b.price || 0) - (a.price || 0);
        return a.name.localeCompare(b.name);
      });
  }, [vehicles, search, selectedCat, sortBy]);


  return (
    <div className="space-y-8">
      {/* Interactive Controls Bar */}
      <div className="card-surface p-4 sm:p-5 rounded-2xl shadow-lg border-border/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, manufacturer, or class..."
              className="w-full rounded-xl border border-border/80 bg-muted/40 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          {/* Sort Selector & Compare Link */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 rounded-xl border border-border/80 bg-muted/30 p-1">
              <button
                onClick={() => setSortBy("speed")}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all",
                  sortBy === "speed" ? "bg-accent text-white shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Top Speed
              </button>
              <button
                onClick={() => setSortBy("power")}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all",
                  sortBy === "power" ? "bg-accent text-white shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Horsepower
              </button>
              <button
                onClick={() => setSortBy("price")}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all",
                  sortBy === "price" ? "bg-accent text-white shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Price
              </button>
              <button
                onClick={() => setSortBy("name")}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all",
                  sortBy === "name" ? "bg-accent text-white shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Name A-Z
              </button>
            </div>

            <Link
              href="/compare/vehicles"
              className="inline-flex items-center gap-1.5 rounded-xl border border-accent/40 bg-accent/10 px-3.5 py-2 text-xs font-bold text-accent transition-colors hover:bg-accent/20"
            >
              <Trophy className="h-3.5 w-3.5" />
              <span>Compare (2-4)</span>
            </Link>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="mt-4 flex flex-wrap gap-1.5 border-t border-border/50 pt-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                selectedCat === cat
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-sm font-bold"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Showing <span className="text-foreground">{filteredVehicles.length}</span> Verified Vehicles
          </p>
          {mounted && favorites.length > 0 && (
            <span className="text-xs text-accent font-semibold flex items-center gap-1">
              <Heart className="h-3.5 w-3.5 fill-accent text-accent" /> {favorites.length} Saved in Garage
            </span>
          )}
        </div>

        {filteredVehicles.length === 0 ? (
          <div className="card-surface p-12 text-center rounded-2xl">
            <p className="font-display text-lg font-bold">No vehicles match your filter</p>
            <p className="text-xs text-muted-foreground mt-1">Try clearing your search query or selecting &ldquo;All Types&rdquo;.</p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCat("All Types");
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-bold text-white shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredVehicles.map((v) => {
              const isFav = favorites.includes(v.id);
              return (
                <div
                  key={v.id}
                  className="group card-surface relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-xl flex flex-col justify-between"
                >
                  {/* Vehicle Image */}
                  <div className="relative h-44 overflow-hidden bg-muted/50">
                    <Image
                      src={v.img}
                      alt={`${v.name} - GTA 6 Vehicle (${v.klass})`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80 pointer-events-none" />

                    {/* Favorite Heart Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggleFav(v.id);
                      }}
                      className={cn(
                        "absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md transition-all",
                        isFav
                          ? "bg-amber-500 text-slate-950 shadow-md"
                          : "bg-black/50 text-white hover:bg-black/80"
                      )}
                      aria-label="Save to garage"
                    >
                      <Heart className={cn("h-3.5 w-3.5", isFav && "fill-current")} />
                    </button>

                    {/* Class & Confidence Tags */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                      <span className="inline-block rounded-full bg-black/70 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent backdrop-blur-sm border border-accent/30">
                        {v.klass}
                      </span>
                      <ConfidenceBadge level={v.confidence} size="sm" />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-base font-bold text-foreground group-hover:text-accent transition-colors truncate">
                          {v.name}
                        </h3>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{v.manufacturer} &bull; {v.drivetrain}</p>
                    </div>

                    {/* Metric Bars */}
                    <div className="mt-3 space-y-2 border-t border-border/60 pt-3">
                      <div>
                        <div className="flex justify-between text-[11px] font-semibold">
                          <span className="text-muted-foreground">Top Speed</span>
                          <span className="font-display font-bold text-foreground">{v.topSpeed} mph</span>
                        </div>
                        <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-accent to-sky-400"
                            style={{ width: `${Math.min(100, (v.topSpeed / 240) * 100)}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] font-semibold">
                          <span className="text-muted-foreground">Engine Power</span>
                          <span className="font-display font-bold text-foreground">{v.power} hp</span>
                        </div>
                        <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-orange-500"
                            style={{ width: `${Math.min(100, (v.power / 1300) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3 text-xs">
                      <span className="font-mono font-bold text-[#00F0FF]">{v.priceDisplay}</span>
                      <Link
                        href={`/vehicles/${v.slug}`}
                        className="inline-flex items-center gap-1 font-bold text-accent transition-colors hover:text-foreground"
                      >
                        <span>View Specs</span>
                        <ArrowRight className="h-3.5 w-3.5" />
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
