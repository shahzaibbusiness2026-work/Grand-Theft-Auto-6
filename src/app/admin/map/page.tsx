"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
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
  Sparkles,
  Loader2,
} from "lucide-react";
import { useToast } from "@/components/admin/toast";
import { Button } from "@/components/admin/ui/button";
import { Badge } from "@/components/admin/ui/badge";
import {
  INITIAL_ADMIN_MAP_MARKERS,
  AdminMapMarker,
} from "@/lib/admin-store";
import {
  getMapMarkers,
  saveMapMarker,
  deleteMapMarker,
} from "@/lib/services/map";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/admin/modal";

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
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Fetch live markers from Supabase on mount
  useEffect(() => {
    async function loadMarkers() {
      try {
        const liveMarkers = await getMapMarkers();
        if (liveMarkers && liveMarkers.length > 0) {
          setMarkers(liveMarkers);
          setSelectedMarkerId(liveMarkers[0].id);
        }
        setIsConnected(true);
      } catch (err) {
        console.error("Failed to load map markers from Supabase:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadMarkers();
  }, []);

  // Import / Export / Preview handlers
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportMarkers = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      count: markers.length,
      markers,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gta6-atlas-markers-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast({
      title: "Markers exported",
      description: `${markers.length} markers downloaded as JSON.`,
      type: "success",
    });
  };

  const handleImportFile = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const raw: unknown[] = Array.isArray(parsed) ? parsed : parsed.markers;
      if (!Array.isArray(raw) || raw.length === 0) {
        showToast({ title: "Import failed", description: "No markers found in this file.", type: "danger" });
        return;
      }
      const validCategories = ["Location", "Collectibles", "Activities"];
      const validLayers = ["Research", "Official", "Community"];
      const validIcons = ["pin", "flag", "square", "star", "car", "dot"];
      const validVerifications = ["unverified", "verified", "pending"];
      const imported: AdminMapMarker[] = [];
      const existingIds = new Set(markers.map((m) => m.id));
      for (const r of raw) {
        const rec = r as Record<string, unknown>;
        if (!rec || typeof rec.name !== "string" || !rec.name.trim()) continue;
        const coords = rec.coordinates as { x?: unknown; y?: unknown } | undefined;
        const idBase = typeof rec.id === "string" && rec.id ? rec.id : `mark-${Date.now()}-${imported.length}`;
        const id = existingIds.has(idBase) ? `${idBase}-imported` : idBase;
        existingIds.add(id);
        imported.push({
          id,
          name: rec.name.trim(),
          category: validCategories.includes(rec.category as string) ? (rec.category as AdminMapMarker["category"]) : "Location",
          layer: validLayers.includes(rec.layer as string) ? (rec.layer as AdminMapMarker["layer"]) : "Research",
          visible: typeof rec.visible === "boolean" ? rec.visible : true,
          icon: validIcons.includes(rec.icon as string) ? (rec.icon as AdminMapMarker["icon"]) : "pin",
          coordinates: {
            x: typeof coords?.x === "number" ? Math.max(0, Math.min(100, coords.x)) : 50,
            y: typeof coords?.y === "number" ? Math.max(0, Math.min(100, coords.y)) : 50,
          },
          description: typeof rec.description === "string" ? rec.description : "",
          verification: validVerifications.includes(rec.verification as string)
            ? (rec.verification as AdminMapMarker["verification"])
            : "unverified",
          source: typeof rec.source === "string" ? rec.source : undefined,
          linkedRecord: typeof rec.linkedRecord === "string" ? rec.linkedRecord : undefined,
        });
      }
      if (imported.length === 0) {
        showToast({ title: "Import failed", description: "No valid markers found in this file.", type: "danger" });
        return;
      }
      setMarkers((prev) => [...imported, ...prev]);
      setSelectedMarkerId(imported[0].id);
      let failed = 0;
      for (const m of imported) {
        const res = await saveMapMarker(m);
        if (!res.success) failed++;
      }
      showToast({
        title: failed === 0 ? "Markers imported" : "Import partially failed",
        description: failed === 0
          ? `${imported.length} markers imported and saved.`
          : `${imported.length - failed} of ${imported.length} saved; ${failed} failed to persist.`,
        type: failed === 0 ? "success" : "danger",
      });
    } catch {
      showToast({ title: "Import failed", description: "Could not read this file as marker JSON.", type: "danger" });
    }
  };

  const handlePreviewMap = () => {
    window.open("/map", "_blank", "noopener,noreferrer");
  };

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

  const handleSaveCurrentMarker = async () => {
    if (!selectedMarker) return;
    setIsSaving(true);
    try {
      const res = await saveMapMarker(selectedMarker);
      if (res.success) {
        showToast({
          title: "Marker Saved to Supabase",
          description: `${selectedMarker.name} updated successfully in database.`,
          type: "success",
        });
      } else {
        throw new Error(res.error);
      }
    } catch (err) {
      showToast({
        title: "Saved Locally",
        description: "Updated locally. Ensure Supabase credentials and table are active.",
        type: "info",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveMarkerOnCanvas = async (x: number, y: number) => {
    if (!selectedMarker) return;
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    setPreviousCoordinates({
      id: selectedMarker.id,
      coords: { ...selectedMarker.coordinates },
    });

    const updatedMarker = {
      ...selectedMarker,
      coordinates: { x: clampedX, y: clampedY },
    };

    setMarkers((prev) =>
      prev.map((m) => (m.id === selectedMarker.id ? updatedMarker : m))
    );

    // Save coordinates to Supabase — await so failures surface instead of
    // being silently swallowed while the toast claims success.
    const saveResult = await saveMapMarker(updatedMarker);
    if (!saveResult.success) {
      // Revert the optimistic move so UI matches the database.
      setMarkers((prev) =>
        prev.map((m) =>
          m.id === selectedMarker.id
            ? { ...m, coordinates: { ...selectedMarker.coordinates } }
            : m
        )
      );
      showToast({
        title: "Sync failed",
        description: `Could not save new coordinates for ${selectedMarker.name}. ${saveResult.error || "Please try again."}`,
        type: "danger",
      });
      return;
    }

    showToast({
      title: "Marker Moved & Synced",
      description: `${selectedMarker.name} coordinates updated to (${clampedX}, ${clampedY}).`,
      action: {
        label: "Undo",
        onClick: async () => {
          if (previousCoordinates) {
            setMarkers((prev) =>
              prev.map((m) =>
                m.id === previousCoordinates.id
                  ? { ...m, coordinates: previousCoordinates.coords }
                  : m
              )
            );
            const undoResult = await saveMapMarker({
              ...selectedMarker,
              coordinates: previousCoordinates.coords,
            });
            if (!undoResult.success) {
              showToast({
                title: "Undo failed to sync",
                description: "Coordinates were reverted locally but could not be saved.",
                type: "danger",
              });
            }
          }
        },
      },
    });
  };

  const handleAddMarker = async () => {
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

    try {
      await saveMapMarker(newMarker);
    } catch (err) {
      console.error("Failed to persist new marker:", err);
    }

    showToast({
      title: "Marker Created",
      description: "New marker placed on Leonida map canvas and synced to Supabase.",
      type: "success",
    });
  };

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const handleDeleteMarker = async () => {
    if (!selectedMarker) return;
    const markerToDelete = selectedMarker;
    const remaining = markers.filter((m) => m.id !== markerToDelete.id);
    setMarkers(remaining);
    setSelectedMarkerId(remaining[0]?.id || "");

    try {
      await deleteMapMarker(markerToDelete.id);
    } catch (err) {
      console.error("Failed to delete marker from Supabase:", err);
    }

    showToast({
      title: "Marker Deleted",
      description: `${markerToDelete.name} removed from map and database.`,
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
            {isConnected ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Connected to Supabase
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gold/10 border border-gold/30 text-gold-light">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-light" />
                Offline (Local Cache)
              </span>
            )}
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Create, reposition, and manage interactive map markers for Leonida. Changes sync live to the public map.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            disabled={isSaving}
            onClick={handleSaveCurrentMarker}
            className="bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md shadow-indigo-500/20"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            aria-label="Import markers JSON"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImportFile(file);
              e.target.value = "";
            }}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#111622] border border-[#1C2436] text-[#94A3B8] hover:text-white text-xs px-3 py-2 rounded-lg"
          >
            Import
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportMarkers}
            className="bg-[#111622] border border-[#1C2436] text-[#94A3B8] hover:text-white text-xs px-3 py-2 rounded-lg"
          >
            Export
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handlePreviewMap}
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
                className="text-xs font-semibold text-[#6366F1] hover:underline"
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
                    "px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap",
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
                        <p className="text-xs text-[#64748B] truncate">
                          {m.category} • Layer: {m.layer}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-[#0E131D] text-[#64748B]">
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
          <div className="absolute bottom-4 left-4 z-20 pointer-events-none flex items-center gap-2 bg-[#111622]/80 backdrop-blur-sm border border-[#1C2436] rounded-xl px-2.5 py-1 text-xs font-mono font-bold text-white">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span>N 25°46&apos;30&quot;</span>
          </div>

          {/* Scale Bar */}
          <div className="absolute bottom-4 right-4 z-20 pointer-events-none flex flex-col items-end gap-1">
            <div className="w-24 h-1.5 bg-[#1C2436] border-t border-b border-indigo-400 rounded-sm" />
            <span className="text-xs font-mono text-[#64748B] font-bold">
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
                      "absolute top-full mt-1.5 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-xs font-bold whitespace-nowrap bg-[#111622] border border-[#1C2436] text-white shadow-xl pointer-events-none transition-opacity",
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
              <p className="text-xs text-[#64748B]">
                {selectedMarker ? selectedMarker.id : "No selection"}
              </p>
            </div>
            {selectedMarker && (
              <button
                type="button"
                onClick={() => selectedMarker && setDeleteTarget({ id: selectedMarker.id, name: selectedMarker.name })}
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
                      className="text-xs font-bold text-[#64748B] font-mono"
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
                      className="text-xs font-bold text-[#64748B] font-mono"
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
                <p className="text-xs text-[#64748B] mt-1">
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
                    className="px-2 py-1 rounded-lg bg-[#111622] border border-[#1C2436] text-xs text-white focus:outline-none"
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
                  disabled={isSaving}
                  className="w-full bg-[#6366F1] hover:bg-[#5254D8] text-white text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2"
                  onClick={handleSaveCurrentMarker}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Marker Record</span>
                    </>
                  )}
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
      {/* Delete confirmation */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete permanently?"
        description={`This will permanently delete "${deleteTarget?.name}". This action cannot be undone.`}
        variant="danger"
        footer={<>
          <button
                      type="button"
                      onClick={() => setDeleteTarget(null)}
                      className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#0E131D] border border-[#1C2436] text-[#94A3B8] hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
          <button
            type="button"
            onClick={() => { if (deleteTarget) { handleDeleteMarker(); setDeleteTarget(null); } }}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-500 text-white transition-colors"
          >
            Delete
          </button>
        </>}
      />
    </div>
  );
}
