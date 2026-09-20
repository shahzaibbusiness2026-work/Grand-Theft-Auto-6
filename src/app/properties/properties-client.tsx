"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Car,
  DollarSign,
  TrendingUp,
  Search,
  ExternalLink,
  MapPin,
  CheckCircle2,
  ArrowRightLeft,
  X,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  Clock,
  Layers,
} from "lucide-react";
import { canonicalProperties, type CanonicalProperty } from "@/lib/canonical-data";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { FavoriteButton } from "@/components/favorite-button";
import { cn } from "@/lib/utils";

const PROPERTY_TYPES = [
  "All",
  "Safehouse",
  "Luxury Penthouse",
  "Nightclub",
  "Chop Shop Garage",
  "Commercial Warehouse",
  "Marina Dock",
] as const;

export function PropertiesClient() {
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  const districts = useMemo(() => {
    const list = Array.from(new Set(canonicalProperties.map((p) => p.district)));
    return ["All", ...list];
  }, []);

  const filteredProperties = useMemo(() => {
    return canonicalProperties.filter((item) => {
      if (selectedType !== "All" && item.type !== selectedType) {
        return false;
      }
      if (selectedDistrict !== "All" && item.district !== selectedDistrict) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchDistrict = item.district.toLowerCase().includes(q);
        const matchDesc = item.desc.toLowerCase().includes(q);
        const matchFeatures = item.features.some((f) => f.toLowerCase().includes(q));
        return matchName || matchDistrict || matchDesc || matchFeatures;
      }
      return true;
    });
  }, [selectedType, selectedDistrict, searchQuery]);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((p) => p !== id);
      }
      if (prev.length >= 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const comparedProps = useMemo(() => {
    return compareIds
      .map((id) => canonicalProperties.find((p) => p.id === id))
      .filter(Boolean) as CanonicalProperty[];
  }, [compareIds]);

  return (
    <div className="space-y-8">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card-carbon p-4 text-center">
          <span className="font-display text-2xl sm:text-3xl font-black text-white">
            {canonicalProperties.length}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mt-1">
            Confirmed Properties
          </span>
        </div>
        <div className="card-carbon p-4 text-center border-amber-500/20 bg-amber-950/10">
          <span className="font-display text-2xl sm:text-3xl font-black text-amber-400">
            $3.5M
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400/80 block mt-1">
            Top Luxury Price
          </span>
        </div>
        <div className="card-carbon p-4 text-center border-emerald-500/20 bg-emerald-950/10">
          <span className="font-display text-2xl sm:text-3xl font-black text-emerald-400">
            $18.5k/hr
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400/80 block mt-1">
            Peak Passive Yield
          </span>
        </div>
        <div className="card-carbon p-4 text-center border-primary/20 bg-primary/10">
          <span className="font-display text-2xl sm:text-3xl font-black text-primary">
            10-Car
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary/80 block mt-1">
            Max Garage Storage
          </span>
        </div>
      </div>

      {/* Floating Compare Banner when 1 or 2 items selected */}
      {compareIds.length > 0 && (
        <div className="sticky top-20 z-30 p-4 rounded-2xl bg-slate-900/95 border border-primary/40 backdrop-blur-xl shadow-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-primary/20 text-primary">
              <ArrowRightLeft className="h-5 w-5" />
            </span>
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Side-by-Side Property Comparison ({compareIds.length} / 2 Selected)
              </span>
              <span className="text-[11px] text-slate-300">
                {compareIds.length === 1
                  ? "Select 1 more property from below to duel specs & ROI"
                  : "Both properties selected. Ready to compare!"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {compareIds.length === 2 && (
              <button
                onClick={() => setShowCompareModal(true)}
                className="btn-primary text-xs px-4 py-2 font-bold flex items-center gap-1.5 shadow-lg shadow-primary/30"
              >
                Launch Duel <ArrowRightLeft className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={() => setCompareIds([])}
              className="btn-ghost text-xs px-3 py-2 text-slate-400 hover:text-white"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card-carbon p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search real estate, nightclubs, chop shops, districts, or features..."
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
          </div>
        </div>

        {/* Property Type Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
          {PROPERTY_TYPES.map((type) => {
            const isSelected = selectedType === type;
            const count = type === "All"
              ? canonicalProperties.length
              : canonicalProperties.filter((p) => p.type === type).length;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full font-semibold transition-all border",
                  isSelected
                    ? "border-primary bg-primary text-white shadow-[0_0_12px_rgba(244,63,94,0.4)]"
                    : "border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                )}
              >
                {type} <span className="opacity-60 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.length === 0 ? (
          <div className="col-span-full card-carbon p-12 text-center">
            <HelpCircle className="h-10 w-10 text-slate-500 mx-auto mb-3" />
            <h3 className="font-display text-lg font-bold text-white">No Properties Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No real estate listings match your search criteria.
            </p>
            <button
              onClick={() => {
                setSelectedType("All");
                setSelectedDistrict("All");
                setSearchQuery("");
              }}
              className="btn-secondary text-xs px-4 py-2 mt-4 inline-flex items-center gap-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredProperties.map((item) => {
            const isCompared = compareIds.includes(item.id);

            return (
              <div
                key={item.id}
                className={cn(
                  "card-carbon overflow-hidden flex flex-col justify-between border transition-all duration-200 group bg-slate-900/60",
                  isCompared ? "border-primary shadow-[0_0_15px_rgba(244,63,94,0.3)]" : "border-slate-800 hover:border-slate-700"
                )}
              >
                <div>
                  {/* Top Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    <Image
                      src={item.img}
                      alt={`${item.name} - GTA 6 Property (${item.type})`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-slate-900/90 text-primary border border-primary/30 backdrop-blur-md">
                        {item.type}
                      </span>
                      <FavoriteButton type="properties" id={item.id} />
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <div className="text-lg font-display font-black text-amber-400 drop-shadow-md">
                        {item.priceDisplay}
                      </div>
                      <ConfidenceBadge confidence={item.confidence} source={item.source} size="sm" />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-accent font-medium">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{item.district}</span>
                    </div>

                    <Link href={`/properties/${item.slug}`}>
                      <h3 className="font-display text-lg font-bold text-white group-hover:text-primary transition-colors leading-snug">
                        {item.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>

                    {/* Stats Metrics Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                          Garage Space
                        </span>
                        <span className="font-bold text-white flex items-center gap-1">
                          <Car className="h-3.5 w-3.5 text-primary" /> {item.garageCapacity} Vehicles
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                          Passive Yield
                        </span>
                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                          <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                          {item.passiveIncomePerHour ? `$${item.passiveIncomePerHour.toLocaleString()}/hr` : "None"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 pt-0 space-y-2 border-t border-slate-800/60 mt-3">
                  <div className="flex items-center justify-between gap-2 pt-2">
                    <button
                      onClick={() => toggleCompare(item.id)}
                      className={cn(
                        "text-xs px-3 py-1.5 rounded-lg font-semibold border transition-colors flex items-center gap-1.5",
                        isCompared
                          ? "bg-primary text-white border-primary"
                          : "border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:border-slate-600"
                      )}
                    >
                      <ArrowRightLeft className="h-3 w-3" />
                      {isCompared ? "Remove Compare" : "Compare"}
                    </button>

                    <Link
                      href={`/properties/${item.slug}`}
                      className="btn-secondary text-xs px-3 py-1.5 inline-flex items-center gap-1 font-semibold"
                    >
                      Dossier <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Side-by-Side Comparison Modal */}
      {showCompareModal && comparedProps.length === 2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-bold text-white uppercase tracking-wide">
                  Property Duel Comparison
                </h3>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Duel Grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 font-mono text-xs">
              {comparedProps.map((p, idx) => (
                <div key={p.id} className="space-y-4">
                  <div className="h-36 rounded-xl overflow-hidden relative bg-slate-950">
                    <Image
                      src={p.img}
                      alt={`${p.name} - GTA 6 Property`}
                      fill
                      sizes="280px"
                      className="object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <span className="text-[10px] uppercase font-bold text-primary block">
                        {p.type}
                      </span>
                      <h4 className="font-display text-sm font-bold text-white truncate">
                        {p.name}
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Price:</span>
                      <span className="text-amber-400 font-bold">{p.priceDisplay}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">District:</span>
                      <span className="text-slate-200">{p.district}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Garage:</span>
                      <span className="text-white font-bold">{p.garageCapacity} Vehicles</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Passive Rate:</span>
                      <span className="text-emerald-400 font-bold">
                        {p.passiveIncomePerHour ? `$${p.passiveIncomePerHour.toLocaleString()}/hr` : "$0 (Private)"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Daily Revenue:</span>
                      <span className="text-emerald-400 font-bold">
                        ${((p.passiveIncomePerHour || 0) * 24).toLocaleString()} / day
                      </span>
                    </div>
                  </div>

                  {/* Upgrades */}
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Available Upgrades:
                    </span>
                    <ul className="text-[11px] text-slate-300 space-y-1">
                      {p.upgrades.map((u) => (
                        <li key={u} className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                          <span className="truncate">{u}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={`/properties/${p.slug}`}
                    className="btn-primary w-full py-2 text-center block text-xs font-bold"
                  >
                    View Full Dossier
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
