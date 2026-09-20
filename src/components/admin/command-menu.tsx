"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  FileText,
  Car,
  Crosshair,
  MapPin,
  Clock,
  ArrowRight,
  X,
  Layers,
  Sparkles,
  Command
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  INITIAL_ADMIN_ARTICLES,
  INITIAL_ADMIN_VEHICLES,
  INITIAL_ADMIN_WEAPONS,
  INITIAL_ADMIN_MAP_MARKERS,
  AdminMapMarker,
} from "@/lib/admin-store";

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandMenu({ isOpen, onClose }: CommandMenuProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "articles" | "vehicles" | "weapons" | "locations">("all");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open menu
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter items
  const filteredArticles = INITIAL_ADMIN_ARTICLES.filter(
    (a) =>
      (activeFilter === "all" || activeFilter === "articles") &&
      (a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.category.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredVehicles = INITIAL_ADMIN_VEHICLES.filter(
    (v) =>
      (activeFilter === "all" || activeFilter === "vehicles") &&
      (v.name.toLowerCase().includes(query.toLowerCase()) ||
        v.manufacturer.toLowerCase().includes(query.toLowerCase()) ||
        v.class.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredWeapons = INITIAL_ADMIN_WEAPONS.filter(
    (w) =>
      (activeFilter === "all" || activeFilter === "weapons") &&
      (w.name.toLowerCase().includes(query.toLowerCase()) ||
        w.category.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredMarkers = INITIAL_ADMIN_MAP_MARKERS.filter(
    (m: AdminMapMarker) =>
      (activeFilter === "all" || activeFilter === "locations") &&
      (m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.category.toLowerCase().includes(query.toLowerCase()))
  );

  const totalResults =
    filteredArticles.length +
    filteredVehicles.length +
    filteredWeapons.length +
    filteredMarkers.length;

  const handleSelect = (url: string) => {
    onClose();
    router.push(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-in fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-[var(--admin-surface)] border border-[var(--admin-border)] shadow-2xl shadow-black/80 overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--admin-border)] bg-[var(--admin-card)]">
          <Search className="w-5 h-5 text-[var(--admin-primary)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, vehicles, weapons, map markers..."
            className="flex-1 bg-transparent text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-bold text-[var(--admin-text-muted)] bg-[var(--admin-elevated)] border border-[var(--admin-border)] rounded-md">
            ESC
          </kbd>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[var(--admin-border-subtle)] bg-[var(--admin-surface)] overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => setActiveFilter("all")}
            className={cn(
              "px-3 py-1 rounded-lg font-bold transition-colors whitespace-nowrap",
              activeFilter === "all"
                ? "bg-[var(--admin-primary)] text-white"
                : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-elevated)]"
            )}
          >
            All Results
          </button>
          <button
            onClick={() => setActiveFilter("articles")}
            className={cn(
              "px-3 py-1 rounded-lg font-bold transition-colors whitespace-nowrap",
              activeFilter === "articles"
                ? "bg-[var(--admin-primary)] text-white"
                : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-elevated)]"
            )}
          >
            Articles ({INITIAL_ADMIN_ARTICLES.length})
          </button>
          <button
            onClick={() => setActiveFilter("vehicles")}
            className={cn(
              "px-3 py-1 rounded-lg font-bold transition-colors whitespace-nowrap",
              activeFilter === "vehicles"
                ? "bg-[var(--admin-primary)] text-white"
                : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-elevated)]"
            )}
          >
            Vehicles ({INITIAL_ADMIN_VEHICLES.length})
          </button>
          <button
            onClick={() => setActiveFilter("weapons")}
            className={cn(
              "px-3 py-1 rounded-lg font-bold transition-colors whitespace-nowrap",
              activeFilter === "weapons"
                ? "bg-[var(--admin-primary)] text-white"
                : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-elevated)]"
            )}
          >
            Weapons ({INITIAL_ADMIN_WEAPONS.length})
          </button>
          <button
            onClick={() => setActiveFilter("locations")}
            className={cn(
              "px-3 py-1 rounded-lg font-bold transition-colors whitespace-nowrap",
              activeFilter === "locations"
                ? "bg-[var(--admin-primary)] text-white"
                : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-elevated)]"
            )}
          >
            Map Markers ({INITIAL_ADMIN_MAP_MARKERS.length})
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 divide-y divide-[var(--admin-border-subtle)]">
          {totalResults === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Search className="w-8 h-8 mx-auto text-[var(--admin-text-muted)] opacity-50" />
              <p className="text-sm font-bold text-[var(--admin-text)]">No matches found</p>
              <p className="text-xs text-[var(--admin-text-muted)]">
                Try searching for &quot;Banshee&quot;, &quot;Trailer&quot;, &quot;Vice City&quot;, or &quot;Pistol&quot;
              </p>
            </div>
          ) : (
            <>
              {/* Articles Section */}
              {filteredArticles.length > 0 && (
                <div className="pt-2 first:pt-0 space-y-1">
                  <div className="flex items-center gap-2 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--admin-text-muted)]">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Articles ({filteredArticles.length})</span>
                  </div>
                  {filteredArticles.slice(0, 4).map((art) => (
                    <button
                      key={art.id}
                      onClick={() => handleSelect(`/admin/articles?edit=${art.id}`)}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-[var(--admin-elevated)] transition-colors group"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-[var(--admin-text)] group-hover:text-[var(--admin-primary)] truncate">
                          {art.title}
                        </p>
                        <p className="text-[11px] text-[var(--admin-text-muted)] truncate">
                          {art.category} • Updated {art.updatedAt}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase bg-[var(--admin-card)] border border-[var(--admin-border)] text-[var(--admin-text-muted)]">
                        {art.status}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Vehicles Section */}
              {filteredVehicles.length > 0 && (
                <div className="pt-3 space-y-1">
                  <div className="flex items-center gap-2 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--admin-text-muted)]">
                    <Car className="w-3.5 h-3.5 text-purple-400" />
                    <span>Vehicles ({filteredVehicles.length})</span>
                  </div>
                  {filteredVehicles.slice(0, 4).map((veh) => (
                    <button
                      key={veh.id}
                      onClick={() => handleSelect(`/admin/vehicles?edit=${veh.id}`)}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-[var(--admin-elevated)] transition-colors group"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-[var(--admin-text)] group-hover:text-[var(--admin-primary)] truncate">
                          {veh.displayName}
                        </p>
                        <p className="text-[11px] text-[var(--admin-text-muted)] truncate">
                          {veh.manufacturer} • {veh.class}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border",
                          veh.verification === "verified"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        )}
                      >
                        {veh.verification}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Weapons Section */}
              {filteredWeapons.length > 0 && (
                <div className="pt-3 space-y-1">
                  <div className="flex items-center gap-2 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--admin-text-muted)]">
                    <Crosshair className="w-3.5 h-3.5 text-pink-400" />
                    <span>Weapons ({filteredWeapons.length})</span>
                  </div>
                  {filteredWeapons.slice(0, 4).map((wep) => (
                    <button
                      key={wep.id}
                      onClick={() => handleSelect(`/admin/weapons?edit=${wep.id}`)}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-[var(--admin-elevated)] transition-colors group"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-[var(--admin-text)] group-hover:text-[var(--admin-primary)] truncate">
                          {wep.name}
                        </p>
                        <p className="text-[11px] text-[var(--admin-text-muted)] truncate">
                          {wep.category} • {wep.ammunition}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase bg-[var(--admin-card)] border border-[var(--admin-border)] text-[var(--admin-text-muted)]">
                        {wep.verification}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Map Markers Section */}
              {filteredMarkers.length > 0 && (
                <div className="pt-3 space-y-1">
                  <div className="flex items-center gap-2 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--admin-text-muted)]">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Map Markers ({filteredMarkers.length})</span>
                  </div>
                  {filteredMarkers.slice(0, 4).map((mark: AdminMapMarker) => (
                    <button
                      key={mark.id}
                      onClick={() => handleSelect(`/admin/map?marker=${mark.id}`)}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-[var(--admin-elevated)] transition-colors group"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-[var(--admin-text)] group-hover:text-[var(--admin-primary)] truncate">
                          {mark.name}
                        </p>
                        <p className="text-[11px] text-[var(--admin-text-muted)] truncate">
                          {mark.category} • Layer: {mark.layer}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-[var(--admin-text-muted)]">
                        ({mark.coordinates.x}, {mark.coordinates.y})
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-[var(--admin-card)] border-t border-[var(--admin-border)] flex items-center justify-between text-[11px] text-[var(--admin-text-muted)]">
          <div className="flex items-center gap-3">
            <span>
              Navigate with <kbd className="font-mono bg-[var(--admin-elevated)] px-1.5 py-0.5 rounded border border-[var(--admin-border)]">↑</kbd> <kbd className="font-mono bg-[var(--admin-elevated)] px-1.5 py-0.5 rounded border border-[var(--admin-border)]">↓</kbd>
            </span>
            <span>
              Select with <kbd className="font-mono bg-[var(--admin-elevated)] px-1.5 py-0.5 rounded border border-[var(--admin-border)]">↵</kbd>
            </span>
          </div>
          <span>Leonida Atlas Engine v1.4.2</span>
        </div>
      </div>
    </div>
  );
}
