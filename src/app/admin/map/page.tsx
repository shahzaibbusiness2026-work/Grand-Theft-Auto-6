"use client";

import React, { useState, useMemo } from "react";
import {
  Map,
  MapPin,
  Search,
  Plus,
  Compass,
  Eye,
  EyeOff,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Flag,
  Star,
  Car,
  Square,
  CircleDot,
} from "lucide-react";
import { useToast } from "@/components/admin/toast";
import { Button } from "@/components/admin/ui/button";
import { Badge } from "@/components/admin/ui/badge";
import {
  INITIAL_ADMIN_MAP_MARKERS,
  AdminMapMarker,
} from "@/lib/admin-store";
import { cn } from "@/lib/utils";

export default function AdminMapPage() {
  const { showToast } = useToast();
  const [markers, setMarkers] = useState<AdminMapMarker[]>(INITIAL_ADMIN_MAP_MARKERS);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string>(
    INITIAL_ADMIN_MAP_MARKERS[0]?.id || "mark-1"
  );
  const [activeCategory, setActiveCategory] = useState<"all" | "Location" | "Collectibles" | "Activities">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLayers, setActiveLayers] = useState({
    Official: true,
    Research: true,
    Community: true,
  });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [previousCoordinates, setPreviousCoordinates] = useState<{ id: string; coords: { x: number; y: number } } | null>(null);

  // Selected Marker
  const selectedMarker = useMemo(() => {
    return markers.find((m) => m.id === selectedMarkerId) || markers[0];
  }, [markers, selectedMarkerId]);

  // Filtered Markers for Left Column
  const filteredMarkers = useMemo(() => {
    return markers.filter((m) => {
      if (activeCategory !== "all" && m.category !== activeCategory) return false;
      if (!activeLayers[m.layer]) return false;
      if (
        searchQuery &&
        !m.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !m.category.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [markers, activeCategory, activeLayers, searchQuery]);

  const handleUpdateMarker = (updated: Partial<AdminMapMarker>) => {
    if (!selectedMarker) return;
    setMarkers((prev) =>
      prev.map((m) => (m.id === selectedMarker.id ? { ...m, ...updated } : m))
    );
  };

  const handleMoveMarkerOnCanvas = (x: number, y: number) => {
    if (!selectedMarker) return;
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    setPreviousCoordinates({
      id: selectedMarker.id,
      coords: { ...selectedMarker.coordinates },
    });

    handleUpdateMarker({ coordinates: { x: clampedX, y: clampedY } });

    showToast({
      title: "Marker Moved",
      description: `${selectedMarker.name} coordinates updated to (${clampedX}, ${clampedY}).`,
      action: {
        label: "Undo",
        onClick: () => {
          if (previousCoordinates) {
            setMarkers((prev) =>
              prev.map((m) =>
                m.id === previousCoordinates.id
                  ? { ...m, coordinates: previousCoordinates.coords }
                  : m
              )
            );
          }
        },
      },
    });
  };

  const handleAddMarker = () => {
    const newMarker: AdminMapMarker = {
      id: `mark-${Date.now()}`,
      name: "New Landmark Coordinate",
      category: "Location",
      layer: "Research",
      visible: true,
      icon: "pin",
      coordinates: { x: 50, y: 50 },
      description: "Coordinates identified from trailer landscape analysis.",
      verification: "unverified",
    };
    setMarkers([newMarker, ...markers]);
    setSelectedMarkerId(newMarker.id);
    showToast({
      title: "Marker Created",
      description: "New marker placed on Leonida map canvas.",
      type: "success",
    });
  };

  const handleDeleteMarker = () => {
    if (!selectedMarker) return;
    const remaining = markers.filter((m) => m.id !== selectedMarker.id);
    setMarkers(remaining);
    setSelectedMarkerId(remaining[0]?.id || "");
    showToast({
      title: "Marker Deleted",
      description: `${selectedMarker.name} removed from map.`,
      type: "danger",
    });
  };

  const getMarkerIcon = (icon: AdminMapMarker["icon"]) => {
    switch (icon) {
      case "flag":
        return <Flag className="w-3.5 h-3.5" />;
      case "star":
        return <Star className="w-3.5 h-3.5" />;
      case "car":
        return <Car className="w-3.5 h-3.5" />;
      case "square":
        return <Square className="w-3.5 h-3.5" />;
      case "dot":
        return <CircleDot className="w-3.5 h-3.5" />;
      default:
        return <MapPin className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[var(--admin-border-subtle)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--admin-text)] tracking-tight flex items-center gap-2.5">
            <Map className="w-6 h-6 text-[var(--admin-primary)]" />
            <span>Atlas Map Manager</span>
          </h1>
          <p className="text-xs text-[var(--admin-text-muted)] mt-0.5">
            Calibrate geographical markers, territory boundaries, and points of interest across Leonida.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Layer toggles */}
          <div
            role="group"
            aria-label="Filter map layers"
            className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs"
          >
            <button
              type="button"
              role="switch"
              aria-checked={activeLayers.Official}
              onClick={() =>
                setActiveLayers((prev) => ({ ...prev, Official: !prev.Official }))
              }
              className={cn(
                "px-2.5 py-1 rounded-lg font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]",
                activeLayers.Official
                  ? "bg-indigo-500/20 text-indigo-400"
                  : "text-[var(--admin-text-muted)] opacity-60"
              )}
            >
              Official
            </button>
            <button
              type="button"
              role="switch"
              aria-checked={activeLayers.Research}
              onClick={() =>
                setActiveLayers((prev) => ({ ...prev, Research: !prev.Research }))
              }
              className={cn(
                "px-2.5 py-1 rounded-lg font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]",
                activeLayers.Research
                  ? "bg-purple-500/20 text-purple-400"
                  : "text-[var(--admin-text-muted)] opacity-60"
              )}
            >
              Research
            </button>
            <button
              type="button"
              role="switch"
              aria-checked={activeLayers.Community}
              onClick={() =>
                setActiveLayers((prev) => ({ ...prev, Community: !prev.Community }))
              }
              className={cn(
                "px-2.5 py-1 rounded-lg font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]",
                activeLayers.Community
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "text-[var(--admin-text-muted)] opacity-60"
              )}
            >
              Community
            </button>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleAddMarker}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Marker
          </Button>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-210px)] min-h-[640px]">
        {/* Column 1: Marker Directory (3 cols) */}
        <div className="lg:col-span-3 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] flex flex-col overflow-hidden shadow-sm">
          <div className="p-3 border-b border-[var(--admin-border)] bg-[var(--admin-card)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)]">
                Markers ({filteredMarkers.length})
              </span>
              <button
                type="button"
                onClick={handleAddMarker}
                className="text-[11px] font-bold text-[var(--admin-primary)] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--admin-primary)] rounded"
              >
                + New
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--admin-text-muted)]" />
              <input
                type="text"
                aria-label="Filter markers by name or category"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter markers..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)]"
              />
            </div>

            {/* Category Filter Pills */}
            <div
              role="tablist"
              aria-label="Filter markers by category"
              className="flex items-center gap-1 overflow-x-auto scrollbar-none pt-1"
            >
              {(["all", "Location", "Collectibles", "Activities"] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]",
                    activeCategory === cat
                      ? "bg-[var(--admin-primary)] text-white"
                      : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-elevated)]"
                  )}
                >
                  {cat === "all" ? "All" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Markers List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-[var(--admin-border)]">
            {filteredMarkers.length === 0 ? (
              <div className="py-8 text-center text-xs text-[var(--admin-text-muted)]">
                No markers found matching your filters.
              </div>
            ) : (
              filteredMarkers.map((m) => {
                const isSelected = selectedMarker?.id === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMarkerId(m.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]",
                      isSelected
                        ? "bg-[var(--admin-primary)] text-white shadow-sm"
                        : "hover:bg-[var(--admin-elevated)] text-[var(--admin-text)]"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={cn(
                          "p-1.5 rounded-lg border",
                          isSelected
                            ? "bg-white/20 border-white/30 text-white"
                            : "bg-[var(--admin-card)] border-[var(--admin-border)] text-[var(--admin-primary)]"
                        )}
                        aria-hidden="true"
                      >
                        {getMarkerIcon(m.icon)}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">{m.name}</p>
                        <p
                          className={cn(
                            "text-[10px] truncate",
                            isSelected ? "text-white/80" : "text-[var(--admin-text-muted)]"
                          )}
                        >
                          {m.category} • Layer: {m.layer}
                        </p>
                      </div>
                    </div>

                    <span
                      className={cn(
                        "text-[10px] font-mono px-1.5 py-0.5 rounded",
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-[var(--admin-card)] text-[var(--admin-text-muted)]"
                      )}
                    >
                      {m.coordinates.x},{m.coordinates.y}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Column 2: Interactive Map Canvas (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl border border-[var(--admin-border)] bg-[#090d16] relative overflow-hidden flex flex-col shadow-inner select-none">
          {/* Top Canvas Toolbar */}
          <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-2 bg-[var(--admin-surface)]/90 backdrop-blur-md border border-[var(--admin-border)] rounded-xl px-3 py-1.5 text-xs font-bold text-[var(--admin-text)] shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" aria-hidden="true" />
              <span>Leonida State Grid (1:25000)</span>
            </div>

            <div
              role="toolbar"
              aria-label="Map navigation controls"
              className="pointer-events-auto flex items-center gap-1 bg-[var(--admin-surface)]/90 backdrop-blur-md border border-[var(--admin-border)] rounded-xl p-1 shadow-lg"
            >
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(2, z + 0.2))}
                className="p-1.5 rounded-lg text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]"
                title="Zoom in"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
                className="p-1.5 rounded-lg text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]"
                title="Zoom out"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="p-1.5 rounded-lg text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]"
                title="Reset zoom"
                aria-label="Reset zoom"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Compass Rose */}
          <div className="absolute bottom-4 left-4 z-20 pointer-events-none flex items-center gap-2 bg-[var(--admin-surface)]/80 backdrop-blur-sm border border-[var(--admin-border)] rounded-xl px-2.5 py-1 text-[11px] font-mono font-bold text-[var(--admin-text)]">
            <Compass className="w-4 h-4 text-indigo-400 animate-spin-slow" />
            <span>N 25°46&apos;30&quot;</span>
          </div>

          {/* Scale Bar */}
          <div className="absolute bottom-4 right-4 z-20 pointer-events-none flex flex-col items-end gap-1">
            <div className="w-24 h-1.5 bg-[var(--admin-border)] border-t border-b border-indigo-400 rounded-sm" />
            <span className="text-[10px] font-mono text-[var(--admin-text-muted)] font-bold">
              1,000 meters
            </span>
          </div>

          {/* Map Surface Grid & Island SVG */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = Math.round(((e.clientX - rect.left) / rect.width) * 100);
              const clickY = Math.round(((e.clientY - rect.top) / rect.height) * 100);
              handleMoveMarkerOnCanvas(clickX, clickY);
            }}
            className="flex-1 w-full h-full relative cursor-crosshair overflow-hidden"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: "center center",
              transition: "transform 0.15s ease-out",
            }}
          >
            {/* Coordinate Grid Background */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(#6366f1 1px, transparent 1px), linear-gradient(to right, #1f293d 1px, transparent 1px), linear-gradient(to bottom, #1f293d 1px, transparent 1px)",
                backgroundSize: "40px 40px, 80px 80px, 80px 80px",
              }}
            />

            {/* Stylized Leonida Island Shapes */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full absolute inset-0 opacity-30 pointer-events-none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* Main Vice City Island */}
              <path
                d="M 20,25 Q 35,10 65,15 Q 85,20 80,50 Q 75,80 50,85 Q 25,80 15,60 Z"
                fill="#1e293b"
                stroke="#334155"
                strokeWidth="0.5"
              />
              {/* Secondary Keys Archipelago */}
              <path
                d="M 50,88 Q 60,92 70,90 Q 75,95 65,97 Q 55,95 50,88 Z"
                fill="#1e293b"
                stroke="#334155"
                strokeWidth="0.5"
              />
              {/* Vice City Metro Roads */}
              <path
                d="M 25,30 L 70,35 M 40,20 L 55,75 M 65,30 L 50,85"
                stroke="#6366f1"
                strokeWidth="0.4"
                strokeDasharray="1,1"
                fill="none"
              />
            </svg>

            {/* Render Map Markers */}
            {filteredMarkers.map((m) => {
              const isSelected = selectedMarker?.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMarkerId(m.id);
                  }}
                  className={cn(
                    "absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-150 group z-10",
                    isSelected ? "scale-125 z-30" : "hover:scale-110"
                  )}
                  style={{
                    left: `${m.coordinates.x}%`,
                    top: `${m.coordinates.y}%`,
                  }}
                >
                  {isSelected && (
                    <span className="absolute -inset-2 rounded-2xl border-2 border-indigo-400/80 animate-ping opacity-75 pointer-events-none" />
                  )}
                  <div
                    className={cn(
                      "relative p-1.5 rounded-xl border shadow-lg flex items-center justify-center transition-colors",
                      isSelected
                        ? "bg-[var(--admin-primary)] border-white text-white ring-4 ring-[var(--admin-primary)]/40"
                        : "bg-[var(--admin-surface)] border-[var(--admin-border)] text-[var(--admin-primary)] hover:border-[var(--admin-primary)]"
                    )}
                  >
                    {getMarkerIcon(m.icon)}
                  </div>

                  {/* Marker tooltip on hover / selected */}
                  <div
                    className={cn(
                      "absolute top-full mt-1.5 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-[10px] font-bold whitespace-nowrap bg-[var(--admin-surface)] border border-[var(--admin-border)] text-[var(--admin-text)] shadow-xl pointer-events-none transition-opacity",
                      isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}
                  >
                    {m.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 3: Marker Details Inspector (3 cols) */}
        <div className="lg:col-span-3 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] flex flex-col overflow-hidden shadow-sm">
          <div className="p-3.5 border-b border-[var(--admin-border)] bg-[var(--admin-card)] flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)]">
                Marker Inspector
              </h3>
              <p className="text-[11px] text-[var(--admin-text-muted)]">
                {selectedMarker ? selectedMarker.id : "No selection"}
              </p>
            </div>
            {selectedMarker && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDeleteMarker}
                aria-label={`Delete ${selectedMarker.name}`}
                className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          {selectedMarker ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scrollbar-thin scrollbar-thumb-[var(--admin-border)]">
              <div>
                <label
                  htmlFor="marker-name"
                  className="block font-bold text-[var(--admin-text)] mb-1"
                >
                  Marker Label
                </label>
                <input
                  id="marker-name"
                  type="text"
                  value={selectedMarker.name}
                  onChange={(e) => handleUpdateMarker({ name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label
                    htmlFor="marker-category"
                    className="block font-bold text-[var(--admin-text)] mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="marker-category"
                    value={selectedMarker.category}
                    onChange={(e) =>
                      handleUpdateMarker({
                        category: e.target.value as AdminMapMarker["category"],
                      })
                    }
                    className="w-full px-2.5 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
                  >
                    <option value="Location">Location</option>
                    <option value="Collectibles">Collectibles</option>
                    <option value="Activities">Activities</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="marker-layer"
                    className="block font-bold text-[var(--admin-text)] mb-1"
                  >
                    Data Layer
                  </label>
                  <select
                    id="marker-layer"
                    value={selectedMarker.layer}
                    onChange={(e) =>
                      handleUpdateMarker({
                        layer: e.target.value as AdminMapMarker["layer"],
                      })
                    }
                    className="w-full px-2.5 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
                  >
                    <option value="Official">Official</option>
                    <option value="Research">Research</option>
                    <option value="Community">Community</option>
                  </select>
                </div>
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block font-bold text-[var(--admin-text)] mb-1.5">
                  Pin Icon
                </label>
                <div
                  role="radiogroup"
                  aria-label="Pin icon options"
                  className="grid grid-cols-6 gap-1.5"
                >
                  {(["pin", "flag", "star", "car", "square", "dot"] as const).map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      role="radio"
                      aria-checked={selectedMarker.icon === ic}
                      aria-label={`${ic} icon`}
                      onClick={() => handleUpdateMarker({ icon: ic })}
                      className={cn(
                        "p-2 rounded-xl border flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]",
                        selectedMarker.icon === ic
                          ? "bg-[var(--admin-primary)] text-white border-[var(--admin-primary)] shadow-sm"
                          : "bg-[var(--admin-card)] border-[var(--admin-border)] text-[var(--admin-text-muted)] hover:text-[var(--admin-text)]"
                      )}
                    >
                      {getMarkerIcon(ic)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Coordinates */}
              <div>
                <label className="block font-bold text-[var(--admin-text)] mb-1">
                  Canvas Coordinates (X, Y)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)]">
                    <label
                      htmlFor="marker-coord-x"
                      className="text-[10px] font-bold text-[var(--admin-text-muted)] font-mono"
                    >
                      X:
                    </label>
                    <input
                      id="marker-coord-x"
                      type="number"
                      min={0}
                      max={100}
                      value={selectedMarker.coordinates.x}
                      onChange={(e) =>
                        handleUpdateMarker({
                          coordinates: {
                            ...selectedMarker.coordinates,
                            x: Math.max(0, Math.min(100, Number(e.target.value) || 0)),
                          },
                        })
                      }
                      className="w-full bg-transparent text-xs text-[var(--admin-text)] font-mono focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)]">
                    <label
                      htmlFor="marker-coord-y"
                      className="text-[10px] font-bold text-[var(--admin-text-muted)] font-mono"
                    >
                      Y:
                    </label>
                    <input
                      id="marker-coord-y"
                      type="number"
                      min={0}
                      max={100}
                      value={selectedMarker.coordinates.y}
                      onChange={(e) =>
                        handleUpdateMarker({
                          coordinates: {
                            ...selectedMarker.coordinates,
                            y: Math.max(0, Math.min(100, Number(e.target.value) || 0)),
                          },
                        })
                      }
                      className="w-full bg-transparent text-xs text-[var(--admin-text)] font-mono focus:outline-none"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-[var(--admin-text-muted)] mt-1">
                  💡 Tip: Click anywhere on the map canvas to reposition this marker.
                </p>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="marker-description"
                  className="block font-bold text-[var(--admin-text)] mb-1"
                >
                  Description / Field Notes
                </label>
                <textarea
                  id="marker-description"
                  rows={3}
                  value={selectedMarker.description}
                  onChange={(e) => handleUpdateMarker({ description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-primary)]"
                />
              </div>

              {/* Verification & Visibility */}
              <div className="p-3 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--admin-text)]">Public Visibility</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={selectedMarker.visible}
                    aria-label={`Toggle public visibility for ${selectedMarker.name}`}
                    onClick={() => handleUpdateMarker({ visible: !selectedMarker.visible })}
                    className={cn(
                      "p-1.5 rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]",
                      selectedMarker.visible
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-[var(--admin-elevated)] border-[var(--admin-border)] text-[var(--admin-text-muted)]"
                    )}
                  >
                    {selectedMarker.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--admin-border-subtle)]">
                  <label
                    htmlFor="marker-verification"
                    className="font-bold text-[var(--admin-text)]"
                  >
                    Verification
                  </label>
                  <select
                    id="marker-verification"
                    value={selectedMarker.verification}
                    onChange={(e) =>
                      handleUpdateMarker({
                        verification: e.target.value as AdminMapMarker["verification"],
                      })
                    }
                    className="px-2 py-1 rounded-lg bg-[var(--admin-surface)] border border-[var(--admin-border)] text-[11px] text-[var(--admin-text)] focus:outline-none"
                  >
                    <option value="verified">Verified</option>
                    <option value="pending">Pending</option>
                    <option value="unverified">Unverified</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => {
                    showToast({
                      title: "Marker Saved",
                      description: `Changes to ${selectedMarker.name} have been committed.`,
                      type: "success",
                    });
                  }}
                >
                  Save Marker Record
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6 text-center text-xs text-[var(--admin-text-muted)]">
              Select a marker from the left list or click on the map to inspect.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
