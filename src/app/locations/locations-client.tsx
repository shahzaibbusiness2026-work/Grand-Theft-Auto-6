"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Search,
  SlidersHorizontal,
  ExternalLink,
  ShieldAlert,
  Clock,
  Car,
  Crosshair,
  Flag,
  HelpCircle,
  Building,
  Navigation,
} from "lucide-react";
import { type CanonicalLocation } from "@/lib/canonical-data";
import { canonicalLocations as locationsFallback } from "@/lib/canonical-data";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { FavoriteButton } from "@/components/favorite-button";
import { cn } from "@/lib/utils";

const LOCATION_CATEGORIES = [
  "All",
  "Point of Interest",
  "Shop",
  "Business",
  "Property",
  "Garage",
  "Vehicle Spawn",
  "Collectible",
] as const;

export function LocationsClient({ initialLocations }: { initialLocations?: CanonicalLocation[] }) {
  const locations = initialLocations && initialLocations.length > 0 ? initialLocations : locationsFallback;
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All");
  const [selectedThreat, setSelectedThreat] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const districts = useMemo(() => {
    const set = new Set(locations.map((l) => l.district));
    return ["All", ...Array.from(set)];
  }, []);

  const filteredLocations = useMemo(() => {
    return locations.filter((item) => {
      if (selectedCategory !== "All" && item.category !== selectedCategory) {
        return false;
      }
      if (selectedDistrict !== "All" && item.district !== selectedDistrict) {
        return false;
      }
      if (selectedThreat !== "All" && item.threatLevel !== selectedThreat) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchDistrict = item.district.toLowerCase().includes(q);
        const matchDesc = item.desc.toLowerCase().includes(q);
        const matchVehicles = (item.relatedVehicles || []).some((v) => v.toLowerCase().includes(q));
        const matchWeapons = (item.relatedWeapons || []).some((w) => w.toLowerCase().includes(q));
        const matchMissions = (item.relatedMissions || []).some((m) => m.toLowerCase().includes(q));
        return matchName || matchDistrict || matchDesc || matchVehicles || matchWeapons || matchMissions;
      }

      return true;
    });
  }, [selectedCategory, selectedDistrict, selectedThreat, searchQuery]);

  const threatColor = (level: string) => {
    switch (level) {
      case "Low":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
      case "Medium":
        return "text-amber-400 bg-amber-500/10 border-amber-500/30";
      case "High":
        return "text-orange-400 bg-orange-500/10 border-orange-500/30";
      case "Restricted Area":
        return "text-rose-400 bg-rose-500/10 border-rose-500/30";
      default:
        return "text-muted-foreground bg-muted border-border";
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card-carbon p-4 text-center">
          <span className="font-display text-2xl sm:text-3xl font-black text-foreground">
            {locations.length}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mt-1">
            Confirmed POIs
          </span>
        </div>
        <div className="card-carbon p-4 text-center border-accent/20 bg-accent/10">
          <span className="font-display text-2xl sm:text-3xl font-black text-accent">
            {districts.length - 1}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-accent/80 block mt-1">
            Major Districts
          </span>
        </div>
        <div className="card-carbon p-4 text-center border-emerald-500/20 bg-emerald-950/10">
          <span className="font-display text-2xl sm:text-3xl font-black text-emerald-400">
            {locations.filter((l) => l.verified).length}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400/80 block mt-1">
            Trailer Verified
          </span>
        </div>
        <div className="card-carbon p-4 text-center border-primary/20 bg-primary/10">
          <span className="font-display text-2xl sm:text-3xl font-black text-primary">
            100%
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary/80 block mt-1">
            Interactive Map Sync
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-carbon p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search points of interest, districts, weapons, vehicles, or missions..."
              className="input-search pl-10 pr-4 py-2.5 w-full text-xs"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-card border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d === "All" ? "All Districts" : d}
                </option>
              ))}
            </select>

            <select
              value={selectedThreat}
              onChange={(e) => setSelectedThreat(e.target.value)}
              className="bg-card border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
            >
              <option value="All">All Danger Levels</option>
              <option value="Low">Low Threat</option>
              <option value="Medium">Medium Threat</option>
              <option value="High">High Threat</option>
              <option value="Restricted Area">Restricted Area</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          {LOCATION_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = cat === "All"
              ? locations.length
              : locations.filter((l) => l.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full font-semibold transition-all border",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-[0_0_12px_rgba(244,63,94,0.4)]"
                    : "border-border bg-card/80 text-muted-foreground hover:border-primary/40 hover:bg-card"
                )}
              >
                {cat} <span className="opacity-60 text-[11px]">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations.length === 0 ? (
          <div className="col-span-full card-carbon p-12 text-center">
            <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-display text-lg font-bold text-foreground">No Locations Found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              No points of interest match your current search and filter settings.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedDistrict("All");
                setSelectedThreat("All");
                setSearchQuery("");
              }}
              className="btn-secondary text-xs px-4 py-2 mt-4 inline-flex items-center gap-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredLocations.map((item) => {
            return (
              <div
                key={item.id}
                className="card-carbon overflow-hidden flex flex-col justify-between border border-border hover:border-primary/40 transition-all duration-200 group bg-card/60"
              >
                <div>
                  {/* Thumbnail Image Header */}
                  <div className="relative h-44 w-full overflow-hidden bg-background">
                    <Image
                      src={item.img}
                      alt={`${item.name} - GTA 6 Location`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span
                        className={cn(
                          "text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border backdrop-blur-md",
                          threatColor(item.threatLevel)
                        )}
                      >
                        {item.threatLevel}
                      </span>
                      <FavoriteButton type="locations" id={item.id} />
                    </div>

                    {/* Bottom Category & Confidence */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted/80 text-foreground border border-border">
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

                    <Link href={`/locations/${item.slug}`}>
                      <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                        {item.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>

                    {/* Meta info chips */}
                    <div className="space-y-1.5 pt-1 text-[11px] font-mono text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="truncate">{item.hours}</span>
                      </div>

                      {/* Associated Vehicles or Weapons */}
                      {(item.relatedVehicles?.length || 0) > 0 && (
                        <div className="flex items-center gap-1.5 text-muted-foreground truncate">
                          <Car className="h-3 w-3 text-primary flex-shrink-0" />
                          <span className="truncate">
                            Vehicles: {item.relatedVehicles?.join(", ")}
                          </span>
                        </div>
                      )}

                      {(item.relatedWeapons?.length || 0) > 0 && (
                        <div className="flex items-center gap-1.5 text-muted-foreground truncate">
                          <Crosshair className="h-3 w-3 text-amber-400 flex-shrink-0" />
                          <span className="truncate">
                            Armory: {item.relatedWeapons?.join(", ")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-border/60 mt-3">
                  <Link
                    href={`/map?poi=${item.id}&top=${item.top}&left=${item.left}`}
                    className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 py-1"
                  >
                    <Navigation className="h-3.5 w-3.5" /> Locate On Map
                  </Link>

                  <Link
                    href={`/locations/${item.slug}`}
                    className="btn-secondary text-xs px-3 py-1.5 inline-flex items-center gap-1 font-semibold"
                  >
                    View Dossier <ExternalLink className="h-3 w-3" />
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
