"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Car,
  User,
  Crosshair,
  MapPin,
  BookOpen,
  ArrowRight,
  Sparkles,
  Trophy,
  Compass,
  Building2,
  DollarSign,
  TrendingUp,
  Sliders,
  Bot,
  Map,
  Flag,
} from "lucide-react";
import {
  canonicalVehicles,
  canonicalWeapons,
  canonicalMissions,
  canonicalLocations,
  canonicalProperties,
  canonicalCollectibles,
  canonicalMoneyMethods,
} from "@/lib/canonical-data";
import { characters } from "@/lib/data";
import { cn } from "@/lib/utils";

export interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Tool" | "Vehicle" | "Weapon" | "Mission" | "Location" | "Property" | "Collectible" | "Character";
  href: string;
  img?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOOL_SEARCH_ITEMS: SearchItem[] = [
  {
    id: "tool-map",
    title: "Interactive Satellite Map",
    subtitle: "24 POIs, satellite topography, personal field notes & filters",
    category: "Tool",
    href: "/map",
  },
  {
    id: "tool-tracker",
    title: "100% Completion Tracker",
    subtitle: "11-category completion checklist with offline backup",
    category: "Tool",
    href: "/tracker",
  },
  {
    id: "tool-compare-vehicles",
    title: "Vehicle Comparison Duel",
    subtitle: "Head-to-head 2–4 vehicle stats, dyno bars & recommendation",
    category: "Tool",
    href: "/compare/vehicles",
  },
  {
    id: "tool-compare-weapons",
    title: "Weapon Comparison Duel",
    subtitle: "Head-to-head firearm comparison across DPS, velocity & recoil",
    category: "Tool",
    href: "/compare/weapons",
  },
  {
    id: "tool-money-calc",
    title: "Money & Goal Calculator",
    subtitle: "Calculate required missions and hours for target items",
    category: "Tool",
    href: "/tools/money-calculator",
  },
  {
    id: "tool-business-profit",
    title: "Business Profit Calculator",
    subtitle: "Model hourly/daily yields and break-even payback timelines",
    category: "Tool",
    href: "/tools/business-profit-calculator",
  },
  {
    id: "tool-money-maker",
    title: "Money-Making Method Finder",
    subtitle: "Find the best cash grinds based on playstyle and bankroll",
    category: "Tool",
    href: "/tools/money-maker",
  },
  {
    id: "tool-loadout",
    title: "Tactical Loadout Builder",
    subtitle: "Assemble 5-slot weapon kits with firepower & mobility ratings",
    category: "Tool",
    href: "/tools/loadout-builder",
  },
  {
    id: "tool-ai",
    title: "Ask GTA 6 AI Assistant",
    subtitle: "Grounded intelligence companion with confidence citations",
    category: "Tool",
    href: "/ai",
  },
  {
    id: "tool-collectibles",
    title: "Collectibles Finder",
    subtitle: "Hidden packages, stunt ramps, radio masts & wildlife photos",
    category: "Tool",
    href: "/collectibles",
  },
  {
    id: "tool-locations",
    title: "Locations & POI Directory",
    subtitle: "Directory of confirmed landmarks, gun shops & estates",
    category: "Tool",
    href: "/locations",
  },
  {
    id: "tool-properties",
    title: "Properties & Real Estate",
    subtitle: "Safehouses, luxury penthouses, chop shops & nightclubs",
    category: "Tool",
    href: "/properties",
  },
];

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Build searchable index from canonical datasets
  const searchIndex: SearchItem[] = useMemo(() => {
    const items: SearchItem[] = [...TOOL_SEARCH_ITEMS];

    // Vehicles
    canonicalVehicles.forEach((v) => {
      items.push({
        id: `veh-${v.id}`,
        title: v.name,
        subtitle: `${v.klass} • ${v.topSpeed} mph • ${v.priceDisplay}`,
        category: "Vehicle",
        href: `/vehicles/${v.slug}`,
        img: v.img,
      });
    });

    // Weapons
    canonicalWeapons.forEach((w) => {
      items.push({
        id: `wep-${w.id}`,
        title: w.name,
        subtitle: `${w.klass} • ${w.damage} Dmg • ${w.priceDisplay}`,
        category: "Weapon",
        href: `/weapons/${w.slug}`,
        img: w.img,
      });
    });

    // Missions
    canonicalMissions.forEach((m) => {
      items.push({
        id: `mis-${m.id}`,
        title: m.title,
        subtitle: `${m.type} • ${m.character} • ${m.cashRewardDisplay}`,
        category: "Mission",
        href: `/missions/${m.slug}`,
        img: m.img,
      });
    });

    // Locations
    canonicalLocations.forEach((l) => {
      items.push({
        id: `loc-${l.id}`,
        title: l.name,
        subtitle: `${l.district} • Threat: ${l.threatLevel}`,
        category: "Location",
        href: `/locations/${l.slug}`,
        img: l.img,
      });
    });

    // Properties
    canonicalProperties.forEach((p) => {
      items.push({
        id: `prop-${p.id}`,
        title: p.name,
        subtitle: `${p.type} in ${p.district} • ${p.priceDisplay}`,
        category: "Property",
        href: `/properties/${p.slug}`,
        img: p.img,
      });
    });

    // Collectibles
    canonicalCollectibles.forEach((c) => {
      items.push({
        id: `col-${c.id}`,
        title: c.title,
        subtitle: `${c.category} in ${c.district} • ${c.reward}`,
        category: "Collectible",
        href: `/collectibles/${c.slug}`,
        img: c.img,
      });
    });

    // Characters
    characters.forEach((c) => {
      items.push({
        id: `char-${c.id}`,
        title: c.name,
        subtitle: `${c.role} • ${c.desc.slice(0, 50)}...`,
        category: "Character",
        href: `/characters`,
        img: c.img,
      });
    });

    return items;
  }, []);

  // Filter items
  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      return searchIndex.slice(0, 10);
    }
    const q = query.toLowerCase();
    return searchIndex
      .filter((item) => {
        return (
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      })
      .slice(0, 15);
  }, [searchIndex, query]);

  // Handle focus on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredResults.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % (filteredResults.length || 1));
      } else if (e.key === "Enter" && filteredResults[selectedIndex]) {
        e.preventDefault();
        handleSelect(filteredResults[selectedIndex]);
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex]);

  const handleSelect = (item: SearchItem) => {
    onClose();
    router.push(item.href);
  };

  if (!isOpen) return null;

  const getCategoryIcon = (category: SearchItem["category"]) => {
    switch (category) {
      case "Tool":
        return <Sparkles className="h-4 w-4 text-primary" />;
      case "Vehicle":
        return <Car className="h-4 w-4 text-accent" />;
      case "Weapon":
        return <Crosshair className="h-4 w-4 text-amber-400" />;
      case "Location":
        return <MapPin className="h-4 w-4 text-emerald-400" />;
      case "Property":
        return <Building2 className="h-4 w-4 text-sky-400" />;
      case "Collectible":
        return <Compass className="h-4 w-4 text-cyan-400" />;
      case "Mission":
        return <Flag className="h-4 w-4 text-orange-400" />;
      case "Character":
        return <User className="h-4 w-4 text-purple-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800">
          <Search className="h-5 w-5 text-slate-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search all 15 tools, rides, armory, missions, properties, or locations..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-slate-800 rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div ref={listRef} className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filteredResults.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No results found for &ldquo;{query}&rdquo;. Try &ldquo;map&rdquo;, &ldquo;grotti&rdquo;, &ldquo;m4&rdquo;, or &ldquo;malibu&rdquo;.
            </div>
          ) : (
            filteredResults.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors",
                    isSelected ? "bg-primary/20 text-white" : "hover:bg-slate-800/50 text-slate-300"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-800 border border-slate-700/60 flex-shrink-0">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm font-bold text-white truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate">{item.subtitle}</p>
                    </div>
                  </div>

                  <ArrowRight
                    className={cn(
                      "h-4 w-4 text-primary flex-shrink-0 transition-opacity ml-2",
                      isSelected ? "opacity-100" : "opacity-0"
                    )}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Footer Helper */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Navigate with &uarr; &darr; arrow keys</span>
          <span>Press Enter to select</span>
        </div>
      </div>
    </div>
  );
}
