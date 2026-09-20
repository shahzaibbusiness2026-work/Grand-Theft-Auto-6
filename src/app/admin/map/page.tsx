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
  Check,
  RotateCcw,
  Sparkles
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
      {/* Page Header (Image 4) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Map manager
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-[#E5A83B]">
              <span className="w-2 h-2 rounded-full bg-[#E5A83B]" />
              <span>Unsaved changes</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2A2015] border border-[#4A3818] text-[#E5A83B]">
              Demo data
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Create and manage map markers for the interactive map. All locations and data are unverified.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              showToast({
                title: "Changes Saved",
                description: "Map marker configuration preserved.",
                type: "success",
              });
            }}
            className="bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md shadow-indigo-500/20"
          >
            Save changes
          </Button>

          <Button
            variant="secondary"
            size="sm"
            className="bg-[#111622] border border-[#1C2436] text-[#94A3B8] hover:text-white text-xs px-3 py-2 rounded-lg"
          >
            Import
          </Button>

          <Button
            variant="secondary"
            size="sm"
            className="bg-[#111622] border border-[#1C2436] text-[#94A3B8] hover:text-white text-xs px-3 py-2 rounded-lg"
          >
            Export
          </Button>

          <Button
            variant="secondary"
            size="sm"
            className="bg-[#111622] border border-[#1C2436] text-[#94A3B8] hover:text-white text-xs px-3 py-2 rounded-lg"
          >
            Preview
          </Button>
        </div>
      </div>

      {/* 3-Column Layout (Image 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-210px)] min-h-[640px]">
        {/* Column 1: Marker Directory (3 cols) */}
        <div className="lg:col-span-3 rounded-xl border border-[#1C2436] bg-[#111622] flex flex-col overflow-hidden shadow-sm">
          <div className="p-3 border-b border-[#1C2436] bg-[#0E131D] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Markers ({filteredMarkers.length})
              </span>
              <button
                type="button"
                onClick={handleAddMarker}
                className="text-[11px] font-semibold text-[#6366F1] hover:underline"
              >
                + New
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter markers..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#111622] border border-[#1C2436] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1]"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pt-1">
              {(["all", "Location", "Collectibles", "Activities"] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors whitespace-nowrap",
                    activeCategory === cat
                      ? "bg-[#6366F1] text-white"
                      : "text-[#94A3B8] hover:bg-[#182030]"
                  )}
                >
                  {cat === "all" ? "All" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Markers List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-[#1C2436]">
            {filteredMarkers.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#64748B]">
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
                      "w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors group",
                      isSelected
                        ? "bg-[#3730A3]/50 text-white border border-[#4F46E5]/40 shadow-sm"
                        : "hover:bg-[#141B2A] text-white"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={cn(
                          "p-1.5 rounded-lg border",
                          isSelected
                            ? "bg-white/20 border-white/30 text-white"
                            : "bg-[#0E131D] border-[#1C2436] text-indigo-400"
                        )}
                      >
                        {getMarkerIcon(m.icon)}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">{m.name}</p>
                        <p className="text-[10px] text-[#64748B] truncate">
                          {m.category} • Layer: {m.layer}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0E131D] text-[#64748B]">
                      {m.coordinates.x},{m.coordinates.y}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Column 2: Interactive Map Canvas (6 cols, Image 4) */}
        <div className="lg:col-span-6 rounded-xl border border-[#1C2436] bg-[#070A10] relative overflow-hidden flex flex-col shadow-inner select-none">
          {/* Top Canvas Toolbar */}
          <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-2 bg-[#111622]/90 backdrop-blur-md border border-[#1C2436] rounded-xl px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Leonida State Grid (1:25000)</span>
            </div>

            <div className="pointer-events-auto flex items-center gap-1 bg-[#111622]/90 backdrop-blur-md border border-[#1C2436] rounded-xl p-1 shadow-lg">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(2, z + 0.2))}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#182030]"
                title="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#182030]"
                title="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#182030]"
                title="Reset zoom"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Compass Rose */}
          <div className="absolute bottom-4 left-4 z-20 pointer-events-none flex items-center gap-2 bg-[#111622]/80 backdrop-blur-sm border border-[#1C2436] rounded-xl px-2.5 py-1 text-[11px] font-mono font-bold text-white">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span>N 25°46&apos;30&quot;</span>
          </div>

          {/* Scale Bar */}
          <div className="absolute bottom-4 right-4 z-20 pointer-events-none flex flex-col items-end gap-1">
            <div className="w-24 h-1.5 bg-[#1C2436] border-t border-b border-indigo-400 rounded-sm" />
            <span className="text-[10px] font-mono text-[#64748B] font-bold">
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
              <path
                d="M 20,25 Q 35,10 65,15 Q 85,20 80,50 Q 75,80 50,85 Q 25,80 15,60 Z"
                fill="#1e293b"
                stroke="#334155"
                strokeWidth="0.5"
              />
              <path
                d="M 50,88 Q 60,92 70,90 Q 75,95 65,97 Q 55,95 50,88 Z"
                fill="#1e293b"
                stroke="#334155"
                strokeWidth="0.5"
              />
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
                        ? "bg-[#6366F1] border-white text-white ring-4 ring-[#6366F1]/40"
                        : "bg-[#111622] border-[#1C2436] text-indigo-400 hover:border-[#6366F1]"
                    )}
                  >
                    {getMarkerIcon(m.icon)}
                  </div>

                  {/* Marker tooltip on hover / selected */}
                  <div
                    className={cn(
                      "absolute top-full mt-1.5 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-[10px] font-bold whitespace-nowrap bg-[#111622] border border-[#1C2436] text-white shadow-xl pointer-events-none transition-opacity",
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

        {/* Column 3: Marker Details Inspector (3 cols, Image 4) */}
        <div className="lg:col-span-3 rounded-xl border border-[#1C2436] bg-[#111622] flex flex-col overflow-hidden shadow-sm">
          <div className="p-3.5 border-b border-[#1C2436] bg-[#0E131D] flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Marker Inspector
              </h3>
              <p className="text-[11px] text-[#64748B]">
                {selectedMarker ? selectedMarker.id : "No selection"}
              </p>
            </div>
            {selectedMarker && (
              <button
                type="button"
                onClick={handleDeleteMarker}
                aria-label={`Delete ${selectedMarker.name}`}
                className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 p-1 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {selectedMarker ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scrollbar-thin scrollbar-thumb-[#1C2436]">
              <div>
                <label
                  htmlFor="marker-name"
                  className="block font-medium text-[#94A3B8] mb-1"
                >
                  Marker Label
                </label>
                <input
                  id="marker-name"
                  type="text"
                  value={selectedMarker.name}
                  onChange={(e) => handleUpdateMarker({ name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1] font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label
                    htmlFor="marker-category"
                    className="block font-medium text-[#94A3B8] mb-1"
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
                    className="w-full px-2.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                  >
                    <option value="Location">Location</option>
                    <option value="Collectibles">Collectibles</option>
                    <option value="Activities">Activities</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="marker-layer"
                    className="block font-medium text-[#94A3B8] mb-1"
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
                    className="w-full px-2.5 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                  >
                    <option value="Official">Official</option>
                    <option value="Research">Research</option>
                    <option value="Community">Community</option>
                  </select>
                </div>
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block font-medium text-[#94A3B8] mb-1.5">
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
                        "p-2 rounded-xl border flex items-center justify-center transition-colors",
                        selectedMarker.icon === ic
                          ? "bg-[#6366F1] text-white border-[#6366F1] shadow-sm"
                          : "bg-[#0E131D] border-[#1C2436] text-[#64748B] hover:text-white"
                      )}
                    >
                      {getMarkerIcon(ic)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Coordinates */}
              <div>
                <label className="block font-medium text-[#94A3B8] mb-1">
                  Canvas Coordinates (X, Y)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436]">
                    <label
                      htmlFor="marker-coord-x"
                      className="text-[10px] font-bold text-[#64748B] font-mono"
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
                      className="w-full bg-transparent text-xs text-white font-mono focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436]">
                    <label
                      htmlFor="marker-coord-y"
                      className="text-[10px] font-bold text-[#64748B] font-mono"
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
                      className="w-full bg-transparent text-xs text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-[#64748B] mt-1">
                  💡 Tip: Click anywhere on the map canvas to reposition this marker.
                </p>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="marker-description"
                  className="block font-medium text-[#94A3B8] mb-1"
                >
                  Description / Field Notes
                </label>
                <textarea
                  id="marker-description"
                  rows={3}
                  value={selectedMarker.description}
                  onChange={(e) => handleUpdateMarker({ description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131D] border border-[#1C2436] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              {/* Verification & Visibility */}
              <div className="p-3 rounded-xl bg-[#0E131D] border border-[#1C2436] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Public Visibility</span>
                  <button
                    type="button"
                    onClick={() => handleUpdateMarker({ visible: !selectedMarker.visible })}
                    className={cn(
                      "p-1.5 rounded-lg border transition-colors",
                      selectedMarker.visible
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-[#182030] border-[#1C2436] text-[#64748B]"
                    )}
                  >
                    {selectedMarker.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#182030]">
                  <label
                    htmlFor="marker-verification"
                    className="font-semibold text-white"
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
                    className="px-2 py-1 rounded-lg bg-[#111622] border border-[#1C2436] text-[11px] text-white focus:outline-none"
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
                  className="w-full bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold py-2.5 rounded-lg"
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
            <div className="flex-1 flex items-center justify-center p-6 text-center text-xs text-[#64748B]">
              Select a marker from the left list or click on the map to inspect.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
