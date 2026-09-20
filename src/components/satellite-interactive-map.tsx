"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Minus,
  LocateFixed,
  Layers,
  X,
  Sun,
  EyeOff,
  Flag,
  RotateCcw,
  Star,
  CircleDot,
  Gem,
  Car,
  Crosshair,
  Warehouse,
  Home,
  ShoppingCart,
  PersonStanding,
  MapPin,
  Egg,
  Crown,
  Building2,
  SlidersHorizontal,
  List,
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Compass,
  Radio,
  Navigation,
  Sparkles,
  Share2,
  ShieldCheck,
  Sliders,
  Heart,
  FileText,
  Copy,
  Layers2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { canonicalLocations } from "@/lib/canonical-data";
import {
  getStoredUserState,
  toggleFavorite,
  isFavorite,
  toggleMapCompleted,
  setMapNote,
} from "@/lib/user-store";

export interface MapPOI {
  id: string;
  title: string;
  category: string;
  type: string;
  district: string;
  desc: string;
  img: string;
  hours: string;
  top: string;
  left: string;
  color: string;
  icon: any;
  verified?: boolean;
}

const CATEGORY_FILTERS = [
  { id: "all", label: "Show All", count: 312, icon: Star, color: "text-amber-400", all: true },
  { id: "missions", label: "Missions & Heists", count: 48, icon: Target, color: "text-amber-400" },
  { id: "garages", label: "Garages & Safehouses", count: 26, icon: Warehouse, color: "text-cyan-400" },
  { id: "shops", label: "Ammu-Nation & Shops", count: 38, icon: ShoppingBag, color: "text-emerald-400" },
  { id: "vehicles", label: "Vehicles", count: 63, icon: Car, color: "text-cyan-400" },
  { id: "weapons", label: "Weapons", count: 45, icon: Crosshair, color: "text-orange-400" },
  { id: "collectibles", label: "Collectibles", count: 62, icon: Gem, color: "text-purple-400" },
  { id: "properties", label: "Real Estate", count: 30, icon: Building2, color: "text-indigo-400" },
  { id: "activities", label: "Stunts & Racing", count: 40, icon: Flame, color: "text-yellow-400" },
  { id: "easter-eggs", label: "Secrets & Lore", count: 21, icon: Egg, color: "text-teal-400" },
  { id: "poi", label: "Points of Interest", count: 52, icon: MapPin, color: "text-amber-400" },
];

const DISTRICTS = [
  { id: "all", name: "Full Leonida State", top: 50, left: 50, zoom: 1.0 },
  { id: "vice-downtown", name: "Vice City Downtown", top: 48, left: 58, zoom: 1.75 },
  { id: "ocean-drive", name: "Ocean Drive Waterfront", top: 56, left: 63, zoom: 2.0 },
  { id: "keys", name: "Leonida Keys", top: 72, left: 45, zoom: 1.65 },
  { id: "swamps", name: "Grassrivers Marshlands", top: 35, left: 55, zoom: 1.6 },
  { id: "port-gellhorn", name: "Port Gellhorn Docks", top: 42, left: 35, zoom: 1.75 },
  { id: "north-wilds", name: "Northern Wilds", top: 22, left: 34, zoom: 1.65 },
];

const POIS: MapPOI[] = [
  {
    id: "poi-ammu",
    title: "Ammu-Nation Downtown",
    category: "shops",
    type: "Weapon Shop",
    district: "Downtown Vice City",
    desc: "Buy military weapons, heavy body armor, ammo and specialized weapon attachments.",
    img: "/img/ammu-nation.jpg",
    hours: "09:00 – 22:00",
    top: "46%",
    left: "58%",
    color: "bg-[#FF0055]",
    icon: Crosshair,
    verified: true,
  },
  {
    id: "poi-garage",
    title: "Garage – Ocean Drive",
    category: "garages",
    type: "Garage & Mod Shop",
    district: "Ocean Drive Waterfront",
    desc: "Vehicle storage, custom widebody kits, performance turbo tuning, and instant respray.",
    img: "/img/garage.jpg",
    hours: "Open 24/7",
    top: "56%",
    left: "64%",
    color: "bg-[#00F0FF]",
    icon: Warehouse,
    verified: true,
  },
  {
    id: "poi-suite",
    title: "High-End Bayfront Penthouse",
    category: "properties",
    type: "Safehouse / Property",
    district: "Vice City Downtown",
    desc: "Luxury penthouse with 10-car garage, private helipad, and panoramic Biscayne bay view.",
    img: "/img/apartment.jpg",
    hours: "Private Residence",
    top: "51%",
    left: "61%",
    color: "bg-indigo-500",
    icon: Building2,
    verified: true,
  },
  {
    id: "poi-cache",
    title: "Hidden Smuggler Cache #12",
    category: "collectibles",
    type: "Submerged Collectible",
    district: "Biscayne Bay Reef",
    desc: "Smuggler's waterproof cargo chest submerged beneath coastal coral reef.",
    img: "/img/cache-chest.jpg",
    hours: "Requires Scuba Gear",
    top: "62%",
    left: "67%",
    color: "bg-purple-500",
    icon: Gem,
    verified: false,
  },
  {
    id: "poi-stunt",
    title: "Stunt Jump #8 – Escobar Causeway",
    category: "activities",
    type: "Unique Stunt Jump",
    district: "Escobar Causeway Ramp",
    desc: "Highway bridge ramp launch over dual express lanes with cinematic slow-mo camera.",
    img: "/img/stunt-bike.jpg",
    hours: "Anytime",
    top: "49%",
    left: "53%",
    color: "bg-amber-500",
    icon: Star,
    verified: true,
  },
  {
    id: "poi-heist",
    title: "Keys Depository Branch",
    category: "story",
    type: "Main Story Heist",
    district: "Leonida Keys",
    desc: "Main story bank heist target with Lucia and Jason targeting regional depository vault.",
    img: "/img/boat.jpg",
    hours: "Chapter 3 Mission",
    top: "73%",
    left: "44%",
    color: "bg-rose-500",
    icon: Star,
    verified: false,
  },
  {
    id: "poi-ufo",
    title: "Cryptic UFO Swamplands Mural",
    category: "easter_eggs",
    type: "Mystery / Easter Egg",
    district: "Grassrivers Marshlands",
    desc: "Cryptic extraterrestrial artwork painted across abandoned cold-war military radar dome.",
    img: "/img/ufo-mural.jpg",
    hours: "00:00 – 04:00 (Rain Only)",
    top: "32%",
    left: "54%",
    color: "bg-emerald-500",
    icon: Egg,
    verified: true,
  },
  {
    id: "poi-weapon-smg",
    title: "Tactical SMG Drop",
    category: "weapons",
    type: "Rare Weapon Pickup",
    district: "Port Gellhorn Docks",
    desc: "Military suppressed submachine gun hidden inside high-security shipping depot container.",
    img: "/img/smg-gun.jpg",
    hours: "Unrestricted Pickup",
    top: "41%",
    left: "35%",
    color: "bg-amber-500",
    icon: Crosshair,
    verified: true,
  },
  {
    id: "poi-north-wilds",
    title: "Northern Wilds Fire Lookout",
    category: "poi",
    type: "Scenic Vantage Point",
    district: "Northern Wilds",
    desc: "Mountain ridge fire lookout tower with 360-degree panorama spanning Leonida wilderness.",
    img: "/img/hero-dark.jpg",
    hours: "Open 24/7",
    top: "22%",
    left: "34%",
    color: "bg-amber-500",
    icon: MapPin,
    verified: true,
  },
  {
    id: "poi-port-gellhorn",
    title: "Port Gellhorn Underground Safehouse",
    category: "safehouses",
    type: "Safehouse",
    district: "Port Gellhorn",
    desc: "Low-profile industrial safehouse with escape tunnel to docks, armory, and vehicle stash.",
    img: "/img/garage.jpg",
    hours: "Story Unlocked",
    top: "44%",
    left: "33%",
    color: "bg-emerald-500",
    icon: Home,
    verified: true,
  },
  {
    id: "poi-club",
    title: "Malibú Neon Nightclub",
    category: "activities",
    type: "Nightlife & Syndicate",
    district: "Ocean Drive Waterfront",
    desc: "Legendary 80s-inspired oceanfront nightclub. Hotspot for Vice City underground contacts.",
    img: "/img/vice-sunset.svg",
    hours: "22:00 – 06:00",
    top: "58%",
    left: "62%",
    color: "bg-fuchsia-500",
    icon: PersonStanding,
    verified: false,
  },
  {
    id: "poi-supercar",
    title: "Grotti Visione Exotic Dealership",
    category: "vehicles",
    type: "Luxury Showroom",
    district: "Downtown Vice City",
    desc: "Exclusive showroom housing the fastest exotic hypercars and customized test vehicles.",
    img: "/img/car-purple.jpg",
    hours: "10:00 – 20:00",
    top: "47%",
    left: "60%",
    color: "bg-amber-500",
    icon: Car,
    verified: true,
  },
  {
    id: "poi-heli",
    title: "Vice International Helipad",
    category: "vehicles",
    type: "Aviation Hub",
    district: "Escobar International",
    desc: "Charter flight landing pad with available police and civilian transport helicopters.",
    img: "/img/heli.jpg",
    hours: "Open 24/7",
    top: "54%",
    left: "51%",
    color: "bg-cyan-500",
    icon: Car,
    verified: false,
  },
  {
    id: "poi-keys-docks",
    title: "Smuggler Marina & Speedboats",
    category: "vehicles",
    type: "Marina",
    district: "Leonida Keys",
    desc: "Deep-sea marina docked with high-speed offshore powerboats and jet-skis.",
    img: "/img/boat.jpg",
    hours: "Open 24/7",
    top: "76%",
    left: "48%",
    color: "bg-blue-500",
    icon: Car,
    verified: true,
  },
];

const FOUND_ON_MAP_RAIL = [
  { title: "Hidden Cache #12", type: "Collectible", when: "2h ago", img: "/img/cache-chest.jpg", badge: "COLLECTIBLE", badgeColor: "bg-amber-600", icon: Gem, color: "text-amber-400" },
  { title: "Stunt Jump #8", type: "Activity", when: "5h ago", img: "/img/stunt-bike.jpg", badge: "ACTIVITY", badgeColor: "bg-[#7E22CE]", icon: Star, color: "text-purple-400" },
  { title: "Garage – Ocean Drive", type: "Garage", when: "1d ago", img: "/img/garage.jpg", badge: "GARAGE", badgeColor: "bg-[#D97706]", icon: Warehouse, color: "text-cyan-400" },
  { title: "Tactical SMG Drop", type: "Weapon", when: "2d ago", img: "/img/smg-gun.jpg", badge: "WEAPON", badgeColor: "bg-[#7E22CE]", icon: Crosshair, color: "text-rose-400" },
  { title: "High-End Penthouse", type: "Property", when: "2d ago", img: "/img/apartment.jpg", badge: "PROPERTY", badgeColor: "bg-[#6366F1]", icon: Building2, color: "text-indigo-400" },
  { title: "UFO Swamplands Mural", type: "Easter Egg", when: "3d ago", img: "/img/ufo-mural.jpg", badge: "EASTER EGG", badgeColor: "bg-[#059669]", icon: Egg, color: "text-emerald-400" },
];

// Coordinate system bounds (virtual canvas width: 1400, height: 1050)
const CANVAS_W = 1400;
const CANVAS_H = 1050;

export function SatelliteInteractiveMap({
  initialFullscreen = false,
  standaloneMode = false,
}: {
  initialFullscreen?: boolean;
  standaloneMode?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"filters" | "legend">("filters");
  const [checkedFilters, setCheckedFilters] = useState<Record<string, boolean>>({
    all: true,
    story: true,
    side: true,
    collectibles: true,
    vehicles: true,
    weapons: true,
    garages: true,
    properties: true,
    safehouses: true,
    shops: true,
    activities: true,
    poi: true,
    easter_eggs: true,
  });

  const [selectedPOI, setSelectedPOI] = useState<MapPOI | null>(POIS[0]);
  const [collectedPOIs, setCollectedPOIs] = useState<Record<string, boolean>>({
    "poi-ammu": true,
    "poi-garage": true,
    "poi-suite": true,
  });
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});
  const [favoriteLocations, setFavoriteLocations] = useState<string[]>([]);
  const [copiedShare, setCopiedShare] = useState(false);
  const [clusterMode, setClusterMode] = useState(false);

  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [mapMode, setMapMode] = useState<"satellite" | "tactical" | "radar">("satellite");
  const [showGrid, setShowGrid] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(initialFullscreen);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(true);
  const [activeDistrict, setActiveDistrict] = useState("all");
  const [mouseCoords, setMouseCoords] = useState<{ lat: string; lng: string }>({
    lat: "25°46'31\"N",
    lng: "80°11'32\"W",
  });

  const toggleFullscreen = () => setIsFullscreen((prev) => !prev);

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number }>({
    x: 0,
    y: 0,
    panX: 0,
    panY: 0,
  });
  const viewportRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Center the map in the container initially
  const centerMap = useCallback(() => {
    if (!viewportRef.current) return;
    const { clientWidth, clientHeight } = viewportRef.current;
    const initialZoom = clientWidth < 640 ? 0.75 : clientWidth < 1024 ? 0.9 : 1.0;
    const initialPanX = (clientWidth - CANVAS_W * initialZoom) / 2;
    const initialPanY = (clientHeight - CANVAS_H * initialZoom) / 2;
    setZoom(initialZoom);
    setPan({ x: initialPanX, y: initialPanY });
    setActiveDistrict("all");
  }, []);

  // Center on a specific POI & sync shareable URL
  const focusOnPOI = useCallback(
    (poi: MapPOI) => {
      if (!viewportRef.current) return;
      setSelectedPOI(poi);
      setRightDrawerOpen(true);

      if (typeof window !== "undefined") {
        try {
          const url = new URL(window.location.href);
          url.searchParams.set("poi", poi.id);
          window.history.replaceState({}, "", url.toString());
        } catch (e) {
          // ignore
        }
      }

      const { clientWidth, clientHeight } = viewportRef.current;
      const targetZoom = Math.max(zoom, 1.65);
      setZoom(targetZoom);

      const px = (parseFloat(poi.left) / 100) * CANVAS_W;
      const py = (parseFloat(poi.top) / 100) * CANVAS_H;

      // Adjust center slightly left if right drawer is open
      const offsetX = rightDrawerOpen && clientWidth > 1024 ? -120 : 0;

      const newPanX = clientWidth / 2 - px * targetZoom + offsetX;
      const newPanY = clientHeight / 2 - py * targetZoom;

      setPan({ x: newPanX, y: newPanY });
    },
    [zoom, rightDrawerOpen]
  );

  useEffect(() => {
    centerMap();
    if (typeof window !== "undefined") {
      const state = getStoredUserState();
      if (state.favorites?.locations) {
        setFavoriteLocations(state.favorites.locations);
      }
      if (state.mapNotes) {
        setUserNotes(state.mapNotes);
      }
      if (state.mapCompletedIds) {
        const completedMap: Record<string, boolean> = {};
        state.mapCompletedIds.forEach((id) => {
          completedMap[id] = true;
        });
        setCollectedPOIs(completedMap);
      }

      const params = new URLSearchParams(window.location.search);
      const targetPoiId = params.get("poi");
      if (targetPoiId) {
        const matched = POIS.find((p) => p.id === targetPoiId || p.id === `poi-${targetPoiId}`);
        if (matched) {
          setTimeout(() => focusOnPOI(matched), 250);
        }
      }
    }
  }, [centerMap, focusOnPOI]);

  // Jump to district
  const jumpToDistrict = (districtId: string) => {
    setActiveDistrict(districtId);
    const d = DISTRICTS.find((item) => item.id === districtId);
    if (!d || !viewportRef.current) return;

    const { clientWidth, clientHeight } = viewportRef.current;
    const targetZoom = d.zoom;
    setZoom(targetZoom);

    const px = (d.left / 100) * CANVAS_W;
    const py = (d.top / 100) * CANVAS_H;

    const newPanX = clientWidth / 2 - px * targetZoom;
    const newPanY = clientHeight / 2 - py * targetZoom;

    setPan({ x: newPanX, y: newPanY });
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left button only
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPan({
        x: dragStartRef.current.panX + dx,
        y: dragStartRef.current.panY + dy,
      });
    }

    // Update GPS coordinates based on cursor relative to canvas
    if (viewportRef.current) {
      const rect = viewportRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - pan.x) / zoom;
      const mouseY = (e.clientY - rect.top - pan.y) / zoom;

      // Map canvas coords to Vice City lat/lng
      const latDeg = (25.85 - (mouseY / CANVAS_H) * 0.35).toFixed(4);
      const lngDeg = (80.35 - (mouseX / CANVAS_W) * 0.45).toFixed(4);
      setMouseCoords({
        lat: `${latDeg}°N`,
        lng: `${lngDeg}°W`,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.15 : -0.15;
    const newZoom = Math.min(3.2, Math.max(0.65, +(zoom + delta).toFixed(2)));

    if (!viewportRef.current) return;
    const rect = viewportRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Zoom towards cursor
    const scaleFactor = newZoom / zoom;
    const newPanX = mouseX - (mouseX - pan.x) * scaleFactor;
    const newPanY = mouseY - (mouseY - pan.y) * scaleFactor;

    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
  };

  // Touch handlers for mobile
  const touchStartRef = useRef<{ x: number; y: number; dist: number }>({ x: 0, y: 0, dist: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        panX: pan.x,
        panY: pan.y,
      };
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartRef.current.dist = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const dx = e.touches[0].clientX - dragStartRef.current.x;
      const dy = e.touches[0].clientY - dragStartRef.current.y;
      setPan({
        x: dragStartRef.current.panX + dx,
        y: dragStartRef.current.panY + dy,
      });
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / touchStartRef.current.dist;
      touchStartRef.current.dist = dist;
      setZoom((prev) => Math.min(3.0, Math.max(0.65, prev * factor)));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const toggleFilter = (id: string) => {
    if (id === "all") {
      const nextVal = !checkedFilters.all;
      const updated: Record<string, boolean> = {};
      CATEGORY_FILTERS.forEach((c) => {
        updated[c.id] = nextVal;
      });
      setCheckedFilters(updated);
    } else {
      setCheckedFilters((prev) => ({
        ...prev,
        [id]: !prev[id],
        all: false,
      }));
    }
  };

  const toggleCollected = (poiId: string) => {
    setCollectedPOIs((prev) => ({
      ...prev,
      [poiId]: !prev[poiId],
    }));
  };

  // Filtered POIs
  const visiblePOIs = useMemo(() => {
    return POIS.filter((p) => {
      const isCategoryChecked = checkedFilters.all || checkedFilters[p.category];
      const matchesSearch =
        searchQuery.trim() === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.type.toLowerCase().includes(searchQuery.toLowerCase());
      return isCategoryChecked && matchesSearch;
    });
  }, [checkedFilters, searchQuery]);

  const verifiedTotal = Object.values(collectedPOIs).filter(Boolean).length;

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full select-none transition-all",
        isFullscreen
          ? "fixed inset-0 z-[9999] h-screen w-screen bg-[#02050b] p-0 overflow-hidden"
          : "relative rounded-3xl"
      )}
    >
      {/* ================================================================= */}
      {/* TOP COMMAND HEADER (GTA HUD BAR)                                  */}
      {/* ================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#070b14]/95 px-4 py-3 backdrop-blur-xl sm:px-6 rounded-t-3xl">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-black uppercase tracking-wider text-white">
                LEONIDA SATELLITE ATLAS
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE GPS
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              HD 4K Topographic Reconnaissance • {visiblePOIs.length} Active Targets Displayed
            </p>
          </div>
        </div>

        {/* District Quick Jumper */}
        <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto rounded-xl border border-white/10 bg-[#03060f] p-1">
          {DISTRICTS.map((d) => (
            <button
              key={d.id}
              onClick={() => jumpToDistrict(d.id)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase transition-all",
                activeDistrict === d.id
                  ? "bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 text-slate-950 font-black shadow-xs"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              {d.name.replace("State", "").replace("Waterfront", "").trim()}
            </button>
          ))}
        </div>

        {/* Viewport Action Icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLeftSidebarOpen((v) => !v)}
            className={cn(
              "flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold transition-all",
              leftSidebarOpen
                ? "border-amber-500/50 bg-amber-500/15 text-white"
                : "border-white/10 bg-white/5 text-slate-300 hover:text-white"
            )}
            title="Toggle Filter Sidebar"
          >
            <Sliders className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Filters</span>
          </button>

          <button
            onClick={() => {
              if (mapMode === "satellite") setMapMode("tactical");
              else if (mapMode === "tactical") setMapMode("radar");
              else setMapMode("satellite");
            }}
            className="flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-bold text-slate-300 hover:text-white transition-colors"
            title="Cycle Map Visual Mode"
          >
            <Layers className="h-3.5 w-3.5 text-cyan-400" />
            <span className="capitalize">{mapMode}</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-amber-500/50 transition-all shadow-sm"
            title={isFullscreen ? "Exit Fullscreen" : "Full Screen"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* ================================================================= */}
      {/* MAIN MAP WORKSPACE (FULL-HEIGHT INTERACTIVE VIEWPORT)             */}
      {/* ================================================================= */}
      <div
        className={cn(
          "relative w-full overflow-hidden bg-[#02050b]",
          isFullscreen
            ? "h-[calc(100vh-62px)]"
            : "h-[640px] sm:h-[720px] lg:h-[780px] rounded-b-3xl border border-t-0 border-white/10 shadow-2xl"
        )}
      >
        {/* ==================== 1. FLOATING LEFT FILTER DRAWER ==================== */}
        {leftSidebarOpen && (
          <div className="absolute left-3 top-3 bottom-3 z-30 w-72 max-w-[calc(100vw-24px)] flex flex-col rounded-2xl border border-white/15 bg-[#070c18]/95 p-4 shadow-2xl backdrop-blur-2xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-display text-xs font-black uppercase tracking-wider text-white">
                  Map Categories
                </h3>
                <p className="text-[10px] text-slate-400">Toggle pins and POIs</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleFilter("all")}
                  className="text-[10px] font-bold text-amber-400 hover:underline"
                >
                  {checkedFilters.all ? "Invert" : "Select All"}
                </button>
                <button
                  onClick={() => setLeftSidebarOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-white/10 ml-2"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Filter Search */}
            <div className="relative mt-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search weapons, stunts, banks..."
                className="w-full rounded-xl border border-white/10 bg-black/50 py-2 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Checklist items */}
            <div className="mt-3 flex-1 space-y-0.5 overflow-y-auto pr-1 no-scrollbar">
              {CATEGORY_FILTERS.map((f) => {
                const isChecked = checkedFilters[f.id] ?? false;
                const Icon = f.icon;
                return (
                  <div
                    key={f.id}
                    onClick={() => toggleFilter(f.id)}
                    className={cn(
                      "flex cursor-pointer select-none items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-colors",
                      f.all
                        ? "border border-amber-500/30 bg-amber-500/10 text-white font-bold"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Icon className={cn("h-3.5 w-3.5 shrink-0", f.color)} />
                      <span className="truncate">{f.label}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400">{f.count}</span>
                      <span
                        className={cn(
                          "flex h-4 w-4 items-center justify-center rounded transition-all",
                          isChecked
                            ? "bg-amber-500 text-slate-950 shadow-xs"
                            : "border border-white/20 bg-black/40"
                        )}
                      >
                        {isChecked && <Check className="h-3 w-3 text-white" strokeWidth={3.5} />}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Progress Strip */}
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-[11px] font-bold text-white">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Verified Visited
                </span>
                <span className="text-amber-400">
                  {verifiedTotal} / {POIS.length}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 transition-all"
                  style={{ width: `${(verifiedTotal / POIS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. FLOATING RIGHT POI DETAIL DRAWER ==================== */}
        {selectedPOI && rightDrawerOpen && (
          <div className="absolute right-3 top-3 z-30 w-80 max-w-[calc(100vw-24px)] rounded-2xl border border-white/15 bg-[#070c18]/95 p-5 shadow-2xl backdrop-blur-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-amber-500/40 bg-amber-500/15 text-amber-400">
                  <selectedPOI.icon className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-display text-sm font-black uppercase text-white truncate max-w-[180px]">
                    {selectedPOI.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold">{selectedPOI.district}</p>
                </div>
              </div>
              <button
                onClick={() => setRightDrawerOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-white/10"
                aria-label="Close details"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative mt-3 h-36 overflow-hidden rounded-xl border border-white/10 bg-black/60 shadow-inner">
              <img
                src={selectedPOI.img}
                alt={selectedPOI.title}
                className="h-full w-full object-cover"
              />
              <span className="absolute left-2 top-2 rounded bg-black/75 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-400 backdrop-blur border border-white/10">
                {selectedPOI.type}
              </span>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-slate-300 font-medium">
              {selectedPOI.desc}
            </p>

            <div className="mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Sun className="h-3.5 w-3.5 text-amber-400" /> Best Hours:
              </span>
              <span className="font-bold text-white text-[11px] font-mono">
                {selectedPOI.hours}
              </span>
            </div>

            {/* Action buttons: Visited, Center, Favorite, Share */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  const nextState = toggleMapCompleted(selectedPOI.id);
                  setCollectedPOIs((prev) => ({ ...prev, [selectedPOI.id]: !nextState }));
                }}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all border",
                  collectedPOIs[selectedPOI.id]
                    ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
                    : "border-white/15 bg-white/5 text-slate-300 hover:bg-white/10"
                )}
              >
                <Check className="h-3.5 w-3.5" />
                <span>{collectedPOIs[selectedPOI.id] ? "Completed ✔" : "Mark Done"}</span>
              </button>

              <button
                onClick={() => focusOnPOI(selectedPOI)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 py-2 text-xs font-black text-slate-950 shadow-md hover:brightness-105 transition-all"
              >
                <Navigation className="h-3.5 w-3.5" />
                <span>Center GPS</span>
              </button>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  const added = toggleFavorite("locations", selectedPOI.id);
                  setFavoriteLocations((prev) =>
                    added ? [...prev, selectedPOI.id] : prev.filter((id) => id !== selectedPOI.id)
                  );
                }}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all border",
                  favoriteLocations.includes(selectedPOI.id)
                    ? "border-amber-500/50 bg-amber-500/20 text-amber-300"
                    : "border-white/15 bg-white/5 text-slate-300 hover:bg-white/10"
                )}
              >
                <Heart className={cn("h-3.5 w-3.5", favoriteLocations.includes(selectedPOI.id) && "fill-amber-400 text-amber-400")} />
                <span>{favoriteLocations.includes(selectedPOI.id) ? "Saved" : "Favorite"}</span>
              </button>

              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    const shareUrl = `${window.location.origin}/map?poi=${selectedPOI.id}`;
                    navigator.clipboard.writeText(shareUrl);
                    setCopiedShare(true);
                    setTimeout(() => setCopiedShare(false), 2000);
                  }
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 transition-all"
              >
                {copiedShare ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedShare ? "Copied!" : "Share Link"}</span>
              </button>
            </div>

            {/* Personal Notes Section */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                <FileText className="h-3 w-3 text-[#00F0FF]" />
                <span>Personal Field Notes</span>
              </div>
              <textarea
                value={userNotes[selectedPOI.id] || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setUserNotes((prev) => ({ ...prev, [selectedPOI.id]: val }));
                  setMapNote(selectedPOI.id, val);
                }}
                placeholder="Add tactical notes, stash codes, enemy routes..."
                rows={2}
                className="w-full rounded-xl border border-white/10 bg-black/50 p-2 text-xs text-slate-200 placeholder:text-slate-500 focus:border-[#00F0FF]/50 focus:outline-none focus:ring-1 focus:ring-[#00F0FF]/30 resize-none font-sans"
              />
            </div>
          </div>
        )}

        {/* ==================== 3. FLOATING TOP HUD CONTROLS ==================== */}
        <div className="pointer-events-none absolute left-0 right-0 top-3 z-20 flex justify-center px-4">
          <div className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-white/15 bg-black/80 px-3.5 py-1.5 shadow-2xl backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-mono text-slate-300 font-bold">
              GPS: {mouseCoords.lat} {mouseCoords.lng}
            </span>
            <span className="h-3 w-px bg-white/20" />
            <span className="text-[11px] font-mono text-[#00F0FF] font-bold">
              ZOOM: {Math.round(zoom * 100)}%
            </span>
            <span className="h-3 w-px bg-white/20" />
            <button
              onClick={() => setClusterMode((prev) => !prev)}
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors",
                clusterMode ? "bg-accent text-white" : "bg-white/10 text-slate-300 hover:text-white"
              )}
            >
              <Layers2 className="h-3 w-3" />
              <span>{clusterMode ? "Clusters ON" : "Pins"}</span>
            </button>
          </div>
        </div>

        {/* ==================== 4. THE INTERACTIVE PAN/ZOOM CANVAS ==================== */}
        <div
          ref={viewportRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={cn(
            "relative h-full w-full overflow-hidden select-none",
            isDragging ? "cursor-grabbing" : "cursor-grab"
          )}
        >
          {/* Scaled / Panned Coordinate Container */}
          <div
            className="absolute origin-top-left transition-transform duration-75 ease-out"
            style={{
              width: `${CANVAS_W}px`,
              height: `${CANVAS_H}px`,
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            }}
          >
            {/* The Real Satellite Map Image */}
            <img
              src="/img/satellite-map-hd.jpg"
              alt="Leonida High Definition Satellite Map"
              draggable={false}
              className={cn(
                "h-full w-full object-cover select-none pointer-events-none transition-all duration-300",
                mapMode === "tactical" &&
                  "invert hue-rotate-180 brightness-90 saturate-200 contrast-125",
                mapMode === "radar" &&
                  "filter contrast-150 brightness-75 sepia hue-rotate-[130deg] saturate-[3]"
              )}
            />

            {/* Tactical Grid Overlay (When toggled) */}
            {showGrid && (
              <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(0,240,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,240,255,0.2) 1px, transparent 1px)",
                  backgroundSize: "70px 70px",
                }}
              />
            )}

            {/* Interactive POI Pins */}
            {visiblePOIs.map((m) => {
              const isSelected = selectedPOI?.id === m.id;
              const isCollected = collectedPOIs[m.id];
              const Icon = m.icon;

              return (
                <button
                  key={m.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    focusOnPOI(m);
                  }}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group focus:outline-none transition-transform hover:scale-125"
                  style={{ top: m.top, left: m.left }}
                  aria-label={m.title}
                >
                  {/* Selected Ping Ring */}
                  {isSelected && (
                    <span className="absolute -inset-3 rounded-full border-2 border-amber-500 bg-amber-500/30 animate-ping" />
                  )}

                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-white shadow-[0_0_15px_rgba(0,0,0,0.9)] transition-all",
                      isCollected ? "bg-emerald-500" : m.color,
                      isSelected && "ring-4 ring-white scale-125 shadow-[0_0_20px_#f59e0b]"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>

                  {/* Tooltip on Hover */}
                  <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-black/90 px-2.5 py-1 text-[10px] font-bold text-white opacity-0 shadow-2xl backdrop-blur-md border border-white/20 group-hover:opacity-100 transition-opacity z-30">
                    <span className="text-amber-400 block font-black">{m.title}</span>
                    <span className="text-slate-400 font-medium text-[9px]">{m.district}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ==================== 5. BOTTOM RIGHT ZOOM & HUD CONTROLS ==================== */}
        <div className="absolute right-4 bottom-4 z-20 flex flex-col gap-2">
          {/* Tactical Grid Toggle */}
          <button
            onClick={() => setShowGrid((v) => !v)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl border backdrop-blur-xl shadow-2xl transition-all",
              showGrid
                ? "border-[#00F0FF] bg-[#00F0FF]/20 text-[#00F0FF]"
                : "border-white/15 bg-black/80 text-white hover:bg-white/20"
            )}
            title="Toggle Tactical Grid"
          >
            <Compass className="h-4 w-4" />
          </button>

          {/* Zoom Buttons */}
          <div className="flex flex-col gap-1 rounded-xl border border-white/15 bg-black/80 p-1.5 backdrop-blur-xl shadow-2xl">
            <button
              onClick={() => {
                const nextZoom = Math.min(3.2, +(zoom + 0.3).toFixed(2));
                setZoom(nextZoom);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white hover:bg-white/20 transition-colors"
              title="Zoom In"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                const nextZoom = Math.max(0.65, +(zoom - 0.3).toFixed(2));
                setZoom(nextZoom);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white hover:bg-white/20 transition-colors"
              title="Zoom Out"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              onClick={centerMap}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white hover:bg-white/20 transition-colors"
              title="Reset Center"
            >
              <LocateFixed className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ==================== 6. BOTTOM LEFT COMPASS & HINT ==================== */}
        <div className="absolute left-4 bottom-4 z-20 flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-black/80 px-3 py-1.5 backdrop-blur-xl shadow-2xl">
            <span className="font-display text-[10px] font-black text-amber-400 tracking-wider">
              N ▲
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Click & Drag to Pan • Scroll to Zoom
            </span>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* BOTTOM CAROUSEL: RECENTLY FOUND ON MAP                            */}
      {/* ================================================================= */}
      {!isFullscreen && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-sm font-black uppercase tracking-wider text-white">
                Featured Intel & Key Locations
              </h3>
              <p className="text-xs text-slate-400">
                Click any key location below to center the satellite camera
              </p>
            </div>
            <Link
              href="/collectibles"
              className="text-xs font-bold text-amber-400 hover:underline"
            >
              View Full 100% Checklist →
            </Link>
          </div>

          <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
            {FOUND_ON_MAP_RAIL.map((r) => {
              const matchedPOI = POIS.find((p) => p.title.includes(r.title));
              return (
                <div
                  key={r.title}
                  onClick={() => {
                    if (matchedPOI) focusOnPOI(matchedPOI);
                  }}
                  className="group w-48 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#070c18] transition-all hover:-translate-y-1 hover:border-amber-500/60 shadow-xl"
                >
                  <div className="relative h-24 overflow-hidden bg-black/50">
                    <img
                      src={r.img}
                      alt={r.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-300"
                    />
                    <span
                      className={cn(
                        "absolute left-2 top-2 rounded px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-white shadow-sm",
                        r.badgeColor
                      )}
                    >
                      {r.badge}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="flex items-center gap-1.5 truncate text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                      <MapPin className={cn("h-3.5 w-3.5 shrink-0", r.color)} /> {r.title}
                    </p>
                    <p className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{r.type}</span>
                      <span className="font-mono text-[9px]">{r.when}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
