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
  Newspaper,
} from "lucide-react";
import {
  canonicalVehicles,
  canonicalWeapons,
  canonicalMissions,
  canonicalLocations,
  canonicalProperties,
  canonicalCollectibles,
} from "@/lib/canonical-data";
import { characters } from "@/lib/data";
import { TOOL_SEARCH_ITEMS, type SearchItem } from "@/lib/search-types";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Bundled fallback index (used when /api/search-index hasn't loaded or fails). */
function buildStaticIndex(): SearchItem[] {
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
      href: "/characters",
      img: c.img,
    });
  });

  return items;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [liveItems, setLiveItems] = useState<SearchItem[] | null>(null);

  // Lazily fetch the live (CMS-driven) index the first time the palette opens.
  useEffect(() => {
    if (!isOpen || liveItems) return;
    let cancelled = false;
    fetch("/api/search-index")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data && Array.isArray(data.items) && data.items.length > 0) {
          setLiveItems(data.items);
        }
      })
      .catch(() => {
        // Keep the bundled static index on failure
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, liveItems]);

  // Searchable index: live DB-driven items once loaded, bundled data otherwise.
  const searchIndex: SearchItem[] = useMemo(() => {
    if (liveItems && liveItems.length > 0) return liveItems;
    return buildStaticIndex();
  }, [liveItems]);

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
      case "News":
        return <Newspaper className="h-4 w-4 text-rose-400" />;
      case "Guide":
        return <BookOpen className="h-4 w-4 text-lime-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-muted/50 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-border">
          <Search className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
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
              className="p-1 text-muted-foreground hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-mono font-semibold text-muted-foreground bg-muted rounded border border-border">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div ref={listRef} className="max-h-96 overflow-y-auto p-2 divide-y divide-border">
          {filteredResults.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
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
                    isSelected ? "bg-primary/20 text-white" : "hover:bg-muted/50 text-muted-foreground"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-muted border border-border flex-shrink-0">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm font-bold text-white truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-muted text-muted-foreground font-mono">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
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
        <div className="px-4 py-2.5 bg-muted/50 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground font-mono">
          <span>Navigate with &uarr; &darr; arrow keys</span>
          <span>Press Enter to select</span>
        </div>
      </div>
    </div>
  );
}
