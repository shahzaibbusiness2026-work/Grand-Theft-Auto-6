"use client";

import { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { trackPublicEvent } from "@/lib/public-events";
import Image from "next/image";
import mapStyles from "./map-workspace.module.css";
import {
  Search,
  Plus,
  Minus,
  LocateFixed,
  Layers,
  X,
  Eye,
  EyeOff,
  Flag,
  Star,
  Gem,
  Car,
  Crosshair,
  Warehouse,
  Home,
  PersonStanding,
  MapPin,
  Egg,
  Building2,
  Box,
  Check,
  Maximize2,
  Minimize2,
  Compass,
  Radio,
  Navigation,
  ShieldCheck,
  Sliders,
  Heart,
  FileText,
  Copy,
  Target,
  ShoppingBag,
  Flame,
  ChevronDown,
  Map as MapIcon,
  Moon,
  Satellite,
} from "lucide-react";
import {
  locationSubcategoryForTypes,
  DEFAULT_HIDDEN_SUBCATEGORIES,
} from "@/lib/map-icons";
import type { MapBaseStyle } from "./community-map-tiles";
import { cn } from "@/lib/utils";
import {
  getStoredUserState,
  toggleFavorite,
  toggleMapCompleted,
  setMapNote,
  saveStoredUserState,
} from "@/lib/user-store";
import type { PersonalMarker } from "@/lib/player-state";
import {
  communityLandmarks,
  communityCategory,
  COMMUNITY_MAP_SPACE,
  nextUnvisited,
} from "@/lib/community-map";
import { CommunityMapTiles } from "./community-map-tiles";
import { getMapMarkers } from "@/lib/services/map";
import { AdminMapMarker } from "@/lib/admin-store";

export interface MapPOI {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  subcategoryLabel?: string;
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
  source?: string;
  sourceUrl?: string;
  addedOn?: string;
  personal?: boolean;
}

function adminMarkerToPoi(m: AdminMapMarker): MapPOI {
  let iconComponent: any = MapPin;
  let color = "bg-[#FF2E9A]";
  const catLower = (m.category || "").toLowerCase();

  if (m.icon === "car") {
    iconComponent = Car;
    color = "bg-cyan-500";
  } else if (m.icon === "star") {
    iconComponent = Star;
    color = "bg-[#FF2E9A]";
  } else if (m.icon === "flag") {
    iconComponent = Flag;
    color = "bg-rose-500";
  } else if (m.icon === "square") {
    iconComponent = Crosshair;
    color = "bg-orange-500";
  } else if (m.icon === "dot") {
    iconComponent = Egg;
    color = "bg-emerald-500";
  } else if (catLower.includes("shop")) {
    iconComponent = ShoppingBag;
    color = "bg-emerald-500";
  } else if (catLower.includes("garage")) {
    iconComponent = Warehouse;
    color = "bg-cyan-500 dark:bg-[#00F0FF]";
  } else if (catLower.includes("prop")) {
    iconComponent = Building2;
    color = "bg-indigo-500";
  } else if (catLower.includes("collect")) {
    iconComponent = Gem;
    color = "bg-purple-500";
  } else if (catLower.includes("weapon")) {
    iconComponent = Crosshair;
    color = "bg-[#FF0055]";
  }

  let filterCategory = "poi";
  if (catLower.includes("shop")) filterCategory = "shops";
  else if (catLower.includes("garage")) filterCategory = "garages";
  else if (catLower.includes("collect")) filterCategory = "collectibles";
  else if (catLower.includes("weapon")) filterCategory = "weapons";
  else if (catLower.includes("activ") || catLower.includes("stunt"))
    filterCategory = "activities";
  else if (catLower.includes("prop") || catLower.includes("estate"))
    filterCategory = "properties";
  else if (catLower.includes("easter") || catLower.includes("secret"))
    filterCategory = "easter_eggs";
  else if (catLower.includes("vehic") || catLower.includes("car"))
    filterCategory = "vehicles";

  return {
    id: m.id,
    title: m.name,
    category: filterCategory,
    type: `${m.layer} ${m.category}`,
    district: m.category,
    desc: m.description || "Point of interest in Leonida.",
    img: "",
    hours: "Not confirmed",
    top: `${m.coordinates.y}%`,
    left: `${m.coordinates.x}%`,
    color,
    icon: iconComponent,
    verified: m.verification === "verified",
    source: m.source || undefined,
    addedOn: m.createdAt ? m.createdAt.slice(0, 10) : undefined,
  };
}

const CATEGORY_FILTERS = [
  {
    id: "nature",
    label: "Nature & landscape",
    icon: Compass,
    color: "text-slate-200",
  },
  {
    id: "transport",
    label: "Transport & roads",
    icon: Navigation,
    color: "text-slate-200",
  },
  {
    id: "personal",
    label: "My Private Pins",
    icon: MapPin,
    color: "text-slate-200",
  },
  {
    id: "all",
    label: "Show All",
    icon: Star,
    color: "text-slate-200",
    all: true,
  },
  {
    id: "missions",
    label: "Missions & Heists",
    icon: Target,
    color: "text-slate-200",
  },
  {
    id: "garages",
    label: "Garages & Safehouses",
    icon: Warehouse,
    color: "text-slate-200",
  },
  {
    id: "shops",
    label: "Ammu-Nation & Shops",
    icon: ShoppingBag,
    color: "text-slate-200",
  },
  { id: "vehicles", label: "Vehicles", icon: Car, color: "text-slate-200" },
  {
    id: "weapons",
    label: "Weapons",
    icon: Crosshair,
    color: "text-slate-200",
  },
  {
    id: "collectibles",
    label: "Collectibles",
    icon: Gem,
    color: "text-slate-200",
  },
  {
    id: "properties",
    label: "Real Estate",
    icon: Building2,
    color: "text-slate-200",
  },
  {
    id: "activities",
    label: "Stunts & Racing",
    icon: Flame,
    color: "text-slate-200",
  },
  {
    id: "easter-eggs",
    label: "Secrets & Lore",
    icon: Egg,
    color: "text-slate-200",
  },
  {
    id: "poi",
    label: "Points of Interest",
    icon: MapPin,
    color: "text-slate-200",
  },
];

const DISTRICTS = [
  { id: "all", name: "Full Leonida State", top: 50, left: 50, zoom: 1.0 },
  {
    id: "vice-city",
    name: "Vice City",
    top: 52,
    left: 60,
    zoom: 1.75,
    desc: "Neon-soaked urban heart of Leonida — Ocean Beach Art Deco, Little Cuba",
  },
  {
    id: "keys",
    name: "Leonida Keys",
    top: 72,
    left: 45,
    zoom: 1.65,
    desc: "Tropical archipelago — boats, bars, dangerous waters",
  },
  {
    id: "grassrivers",
    name: "Grassrivers",
    top: 35,
    left: 55,
    zoom: 1.6,
    desc: "Everglades-inspired wetlands — gators, airboats, mangroves",
  },
  {
    id: "port-gellhorn",
    name: "Port Gellhorn",
    top: 42,
    left: 35,
    zoom: 1.75,
    desc: "Faded coastal resort town — cheap motels, empty strip malls",
  },
  {
    id: "ambrosia",
    name: "Ambrosia",
    top: 28,
    left: 48,
    zoom: 1.65,
    desc: "Rural industrial town — Allied Crystal sugar refinery, biker gangs",
  },
  {
    id: "mount-kalaga",
    name: "Mount Kalaga National Park",
    top: 18,
    left: 40,
    zoom: 1.6,
    desc: "Northern wilderness — hunting, fishing, off-road trails",
  },
];

/** Map base styles. Shared by the floating switcher (panel closed) and the
    in-panel switcher (panel open) so the two never drift apart. */
const MAP_STYLE_OPTIONS = [
  { id: "community", label: "Community", icon: Satellite },
  { id: "official", label: "In-game", icon: MapIcon },
  { id: "streets", label: "Streets", icon: Moon },
] as const;

/** A generic CMS verification flag is not a field-specific evidence review. */
function publicMapPoi(poi: MapPOI): MapPOI {
  const aliases: Record<string, string> = {
    story: "missions",
    side: "missions",
    safehouses: "garages",
    locations: "poi",
    easter_eggs: "easter-eggs",
  };
  return {
    ...poi,
    category: aliases[poi.category] || poi.category,
    verified: false,
    desc: `Fan concept: ${poi.title}. Identity, placement, hours, rewards and gameplay are unverified. The background is a fan illustration, not an official GTA VI map.`,
    hours: "Unknown",
    source: "Source review pending; read our evidence policy",
    sourceUrl: "/editorial-policy",
  };
}

const COMMUNITY_POIS: MapPOI[] = communityLandmarks
  .filter((item) => item.position)
  .map((item) => {
    const sub = locationSubcategoryForTypes(item.types);
    return {
      id: item.id,
      title: item.name,
      category: communityCategory(item.types),
      subcategory: sub.id,
      subcategoryLabel: sub.label,
      type: `Community ${item.types.filter((tag) => tag !== "enterable").join(" · ") || "landmark"}`,
      district: item.area || "Community-mapped area",
      desc: `Community interpretation, not official geography or confirmed gameplay. ${item.counterpart ? `Contributors suggest a real-world counterpart: ${item.counterpart}.` : ""} Placement and identity may change as evidence improves.`,
      img: "",
      hours: "Unknown",
      top: `${item.position!.top}%`,
      left: `${item.position!.left}%`,
      color:
        (
          {
            shops: "bg-emerald-700",
            vehicles: "bg-cyan-700",
            properties: "bg-violet-700",
            garages: "bg-orange-700",
            transport: "bg-blue-700",
            nature: "bg-emerald-700",
          } as Record<string, string>
        )[communityCategory(item.types)] || "bg-[#FF2E9A]",
      icon: sub.icon,
      verified: false,
      source: "GTADB community record",
      sourceUrl: item.reference,
    };
  })
  // No generic teardrop/checkpoint pins on the map: entries with no
  // mappable location type fall back to the MapPin pictogram, which reads
  // as a checkpoint pin. Only real location pictograms are shown.
  .filter((poi) => poi.subcategory !== "poi");

// Bounding box of the bundled community pins, in canvas percent. The
// landmass occupies only the left ~40% of the square canvas (left
// ~20–60%, top ~23–74%), so cover-fitting the whole canvas leaves the
// first load mostly empty ocean. The default framing fits this box
// instead. Computed once from the static dataset — it never changes at
// runtime, so centering never re-runs when live markers arrive.
const COMMUNITY_BOUNDS = (() => {
  let minLeft = 100;
  let maxLeft = 0;
  let minTop = 100;
  let maxTop = 0;
  for (const poi of COMMUNITY_POIS) {
    const left = parseFloat(poi.left);
    const top = parseFloat(poi.top);
    if (!Number.isFinite(left) || !Number.isFinite(top)) continue;
    if (left < minLeft) minLeft = left;
    if (left > maxLeft) maxLeft = left;
    if (top < minTop) minTop = top;
    if (top > maxTop) maxTop = top;
  }
  return { minLeft, maxLeft, minTop, maxTop };
})();

const personalToPoi = (marker: PersonalMarker): MapPOI => ({
  id: marker.id,
  title: marker.title,
  category: "personal",
  type: "Private planning pin",
  district: "Your workspace",
  desc: "You placed this private planning pin. Its position is relative to this fan map and is not a verified game location.",
  img: "",
  hours: "Not applicable",
  top: `${marker.top}%`,
  left: `${marker.left}%`,
  color: "bg-violet-500",
  icon: MapPin,
  personal: true,
});
function communityPoisWithOverrides(markers: AdminMapMarker[] = []): MapPOI[] {
  return COMMUNITY_POIS.filter(
    (poi) =>
      !markers?.some(
        (marker) => marker.id === poi.id && marker.visible === false,
      ),
  ).map((poi) => {
    const override = markers?.find((marker) => marker.id === poi.id);
    return override
      ? {
          ...poi,
          title: override.name || poi.title,
          top: `${override.coordinates.y}%`,
          left: `${override.coordinates.x}%`,
          desc: `${poi.desc}${override.description ? ` Editor note (unverified): ${override.description}` : ""}`,
        }
      : poi;
  });
}

export function SatelliteInteractiveMap({
  initialFullscreen = false,
  standaloneMode = false,
  playerMode = false,
  edition = "community",
  initialMarkers,
}: {
  initialFullscreen?: boolean;
  standaloneMode?: boolean;
  playerMode?: boolean;
  edition?: "community" | "legacy";
  initialMarkers?: AdminMapMarker[];
}) {
  const CANVAS_W = 1400;
  const CANVAS_H = edition === "community" ? 1400 : 1050;

  // Taish Tilt (3D view): a fixed 55° tilt of the map plane, pure CSS —
  // no library, no new data, no invented buildings. Under the tilt the
  // island's on-screen height compresses by cos(55°) ≈ 0.57; the fit,
  // the pan math and the pin-separation gate all account for that.
  const TILT_DEG = 55;
  const TILT_RAD = (TILT_DEG * Math.PI) / 180;
  const COS_TILT = Math.cos(TILT_RAD);
  const SIN_TILT = Math.sin(TILT_RAD);
  // Perspective distance. 1200px blew up: the canvas bottom edge swings
  // ~1000px toward the viewer under the tilt, so at 1200px its
  // perspective scale hit ~6.3× and the island overflowed the frame.
  // At 3000px the near-edge scale is ~1.5× — a clear 3D feel with no
  // explosion — and the fit below solves the projection exactly.
  const PERSPECTIVE = 3000;
  const [checkedFilters, setCheckedFilters] = useState<Record<string, boolean>>(
    () => Object.fromEntries(CATEGORY_FILTERS.map((f) => [f.id, true])),
  );
  const [hideCollected, setHideCollected] = useState(false);
  const [editorialPOIs, setAllPOIs] = useState<MapPOI[]>(() =>
    edition === "community"
      ? communityPoisWithOverrides(initialMarkers)
      : (initialMarkers || [])
          .filter(
            (marker) =>
              marker.visible !== false && !marker.id.startsWith("gtadb-"),
          )
          .map(adminMarkerToPoi)
          .map(publicMapPoi),
  );
  const [personalMarkers, setPersonalMarkers] = useState<PersonalMarker[]>([]);
  const [pinFormOpen, setPinFormOpen] = useState(false);
  const [pinTitle, setPinTitle] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const personalDeepLink = useRef<string | null>(null);
  const allPOIs = useMemo(
    () => [
      ...editorialPOIs,
      ...personalMarkers
        .filter((marker) =>
          edition === "community"
            ? marker.mapSpace === COMMUNITY_MAP_SPACE
            : !marker.mapSpace,
        )
        .map(personalToPoi),
    ],
    [editorialPOIs, personalMarkers, edition],
  );
  const [selectedPOI, setSelectedPOI] = useState<MapPOI | null>(null);
  const [collectedPOIs, setCollectedPOIs] = useState<Record<string, boolean>>(
    {},
  );

  // Deep link (?poi=…) that pointed at a CMS marker: resolved once the
  // live markers finish loading, since their ids never appear in POIS.
  const pendingDeepLinkRef = useRef<{
    id: string;
    top?: string | null;
    left?: string | null;
  } | null>(null);
  const deepLinkTimeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    if (initialMarkers) return;
    async function loadLiveMapMarkers() {
      try {
        const markers = await getMapMarkers();
        if (markers && markers.length > 0) {
          const livePois = markers
            .filter((m) => m.visible !== false && !m.id.startsWith("gtadb-"))
            .map(adminMarkerToPoi)
            .map(publicMapPoi);
          const mergedPois =
            edition === "community"
              ? communityPoisWithOverrides(markers)
              : livePois;
          setAllPOIs(mergedPois);
          setSelectedPOI((prev) =>
            prev?.personal
              ? prev
              : prev
                ? mergedPois.find((p) => p.id === prev.id) || null
                : null,
          );

          const pending = pendingDeepLinkRef.current;
          if (pending) {
            pendingDeepLinkRef.current = null;
            const matched = mergedPois.find(
              (p) =>
                p.id === pending.id || p.id === pending.id.replace(/^poi-/, ""),
            );
            if (matched) {
              deepLinkTimeoutsRef.current.push(
                window.setTimeout(() => focusOnPOI(matched), 250),
              );
            } else if (pending.top && pending.left) {
              setTimeout(
                () => panToCanvasPoint(pending.top!, pending.left!),
                250,
              );
            }
          }
        }
      } catch (err) {
        console.error("Failed to load map markers in interactive map:", err);
      }
    }
    loadLiveMapMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});
  const [favoriteLocations, setFavoriteLocations] = useState<string[]>([]);
  const [copiedShare, setCopiedShare] = useState(false);
  useEffect(() => {
    const sync = () => {
      const current = getStoredUserState();
      setPersonalMarkers(current.personalMarkers);
      setFavoriteLocations(current.favorites.locations);
      setUserNotes(current.mapNotes);
      setCollectedPOIs(
        Object.fromEntries(current.mapCompletedIds.map((id) => [id, true])),
      );
      setSelectedPOI((previous) =>
        previous?.personal &&
        !current.personalMarkers.some((marker) => marker.id === previous.id)
          ? null
          : previous,
      );
    };
    sync();
    window.addEventListener("gta6_user_state_change", sync);
    return () => window.removeEventListener("gta6_user_state_change", sync);
  }, []);

  // Live category counts derived from the actual marker set (bundled + CMS).
  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allPOIs.length };
    for (const poi of allPOIs) {
      const key = (poi.category || "").toLowerCase().replace(/_/g, "-");
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return counts;
  }, [allPOIs]);

  // Per-subcategory counts + which subcategories exist under each category.
  const subcategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const poi of allPOIs) {
      const key = poi.subcategory || "poi";
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return counts;
  }, [allPOIs]);
  // Found (marked) counts per category and per subcategory.
  const foundByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const poi of allPOIs) {
      if (!collectedPOIs[poi.id]) continue;
      const key = (poi.category || "poi").toLowerCase().replace(/_/g, "-");
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return counts;
  }, [allPOIs, collectedPOIs]);
  const foundBySubcategory = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const poi of allPOIs) {
      if (!collectedPOIs[poi.id]) continue;
      const key = poi.subcategory || "poi";
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return counts;
  }, [allPOIs, collectedPOIs]);
  const categorySubcategories = useMemo(() => {
    const grouped: Record<string, { id: string; label: string }[]> = {};
    const seen = new Set<string>();
    for (const poi of allPOIs) {
      const cat = (poi.category || "poi").toLowerCase().replace(/_/g, "-");
      const sub = poi.subcategory || "poi";
      const key = `${cat}:${sub}`;
      if (seen.has(key)) continue;
      seen.add(key);
      (grouped[cat] ??= []).push({
        id: sub,
        label: poi.subcategoryLabel || "Point of interest",
      });
    }
    for (const list of Object.values(grouped))
      list.sort((a, b) => a.label.localeCompare(b.label));
    return grouped;
  }, [allPOIs]);

  // Map base style: community (YANIS) | official (Rockstar map) | streets
  // (dark). Kept in the URL (?style=) like gtamap.io keeps layer state.
  const [mapStyle, setMapStyle] = useState<MapBaseStyle>("community");
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const style = params.get("style");
    if (style === "official" || style === "streets" || style === "community")
      setMapStyle(style);
  }, []);
  useEffect(() => {
    const url = new URL(location.href);
    if (mapStyle === "community") url.searchParams.delete("style");
    else url.searchParams.set("style", mapStyle);
    history.replaceState(null, "", url.toString());
  }, [mapStyle]);

  // Switching base style closes an open cluster list (its pins are not on
  // the official map, and the panel would otherwise linger over it).
  useEffect(() => {
    setClusterMembers([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapStyle]);

  // Per-subcategory visibility. Noisy/generic kinds are hidden by default so
  // the map is readable on first load; everything else starts visible.
  const [checkedSubcategories, setCheckedSubcategories] = useState<
    Record<string, boolean>
  >(() => {
    const initial: Record<string, boolean> = {};
    return initial;
  });
  const isSubcategoryChecked = (id: string) =>
    checkedSubcategories[id] ?? !DEFAULT_HIDDEN_SUBCATEGORIES.includes(id);
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >(() =>
    Object.fromEntries(CATEGORY_FILTERS.map((f) => [f.id, true])),
  );

  const [zoom, setZoom] = useState<number>(1.0);

  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [namedOnly, setNamedOnly] = useState(true);
  const [resultSort, setResultSort] = useState("name");
  const [clusterMembers, setClusterMembers] = useState<MapPOI[]>([]);
  const [textListOpen, setTextListOpen] = useState(false);
  const [viewportSize, setViewportSize] = useState({
    width: 1000,
    height: 650,
  });
  const [mapFeedback, setMapFeedback] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery((params.get("q") || "").slice(0, 120));
    setNamedOnly(params.get("unnamed") !== "1");
    const category = params.get("category");
    if (CATEGORY_FILTERS.some((item) => item.id === category))
      setCheckedFilters(
        Object.fromEntries(
          CATEGORY_FILTERS.map((item) => [item.id, item.id === category]),
        ),
      );
    if (params.has("categories")) {
      const selected = (params.get("categories") || "").split(",").slice(0, 20);
      setCheckedFilters(
        Object.fromEntries(
          CATEGORY_FILTERS.map((item) => [
            item.id,
            item.id !== "all" && selected.includes(item.id),
          ]),
        ),
      );
    }
    setHideCollected(params.get("hideMarked") === "1");
  }, []);
  const [mapMode, setMapMode] = useState<"satellite" | "tactical" | "radar">(
    "satellite",
  );
  const [showGrid, setShowGrid] = useState(false);
  // 3D view ("Taish Tilt") — session-only for v1 (no localStorage).
  // is3DRef mirrors the state so centerMap / toggle3D can read the
  // current mode without changing their identity (centerMap's identity
  // feeds effects that must not re-run on a mode toggle).
  const [is3D, setIs3D] = useState(false);
  const is3DRef = useRef(false);
  useEffect(() => {
    is3DRef.current = is3D;
  }, [is3D]);
  // Point the tilt pivots on, in viewport px — the visible-rect centre,
  // so the island (centred there by centerMap) stays put when tilting.
  const [tiltOrigin, setTiltOrigin] = useState({ x: 0, y: 0 });
  // True only while the 400ms tilt animation runs; the transition is
  // removed afterwards so later origin updates never animate the view.
  const [tiltAnimating, setTiltAnimating] = useState(false);
  // Hide the toggle where preserve-3d is unsupported (old Safari/iOS).
  const [supports3D, setSupports3D] = useState(false);
  useEffect(() => {
    try {
      setSupports3D(
        typeof CSS !== "undefined" &&
          CSS.supports("transform-style", "preserve-3d"),
      );
    } catch {
      setSupports3D(false);
    }
  }, []);
  const [isFullscreen, setIsFullscreen] = useState(initialFullscreen);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [activeDistrict, setActiveDistrict] = useState("all");

  const toggleFullscreen = () => setIsFullscreen((prev) => !prev);

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{
    x: number;
    y: number;
    panX: number;
    panY: number;
  }>({
    x: 0,
    y: 0,
    panX: 0,
    panY: 0,
  });
  const viewportRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    const resize = () =>
      setViewportSize({
        width: element.clientWidth,
        height: element.clientHeight,
      });
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const filtersButtonRef = useRef<HTMLButtonElement>(null);
  const detailsCloseRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const livePanRef = useRef(pan);
  const panFrameRef = useRef<number | null>(null);
  // True once the user has moved the map themselves (drag, wheel, pinch,
  // zoom buttons, keyboard, region jump, or POI focus). The auto re-fit
  // below only runs while this is false, so it never yanks the map out
  // from under the user. centerMap / reset clears it.
  const hasInteractedRef = useRef(false);
  // Static-preview fade: the LCP preview (cover-fit poster) is painted by
  // the server HTML, but once hydrated the interactive canvas owns the
  // view — and the canvas never covers the whole frame (it is centred on
  // the island), so the preview's west coast / Keys peek out west of the
  // canvas edge as a ghost image at a different scale/position from the
  // canvas. Fade it out shortly after mount; by then the in-canvas
  // overview (same URL, cached) is painted and the viewport's ocean
  // background covers the rest.
  const [previewVisible, setPreviewVisible] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setPreviewVisible(false), 600);
    return () => window.clearTimeout(t);
  }, []);
  const closeFilters = () => {
    setLeftSidebarOpen(false);
    filtersButtonRef.current?.focus();
  };
  const closeDetails = () => {
    setRightDrawerOpen(false);
    returnFocusRef.current?.focus();
  };
  const queuePan = (next: { x: number; y: number }) => {
    hasInteractedRef.current = true;
    livePanRef.current = next;
    if (panFrameRef.current !== null) return;
    panFrameRef.current = window.requestAnimationFrame(() => {
      panFrameRef.current = null;
      const value = livePanRef.current;
      if (canvasRef.current)
        canvasRef.current.style.transform = `translate(${value.x}px, ${value.y}px) scale(${zoom})`;
    });
  };
  useEffect(() => {
    if (rightDrawerOpen) detailsCloseRef.current?.focus();
  }, [rightDrawerOpen, selectedPOI?.id]);
  useEffect(
    () => () => {
      if (panFrameRef.current !== null)
        cancelAnimationFrame(panFrameRef.current);
    },
    [],
  );

  // The part of the canvas the user can actually SEE, in canvas pixels.
  // Two things the old fit ignored:
  //  (1) the open filter panel overlays the left ~300px of the frame
  //      (#map-filters, absolute over the canvas) — centering in the
  //      full frame shifts the island ~150px left, so left pins hide
  //      behind the panel and the right side is empty ocean;
  //  (2) the frame is a fixed 640–780px tall starting ~620px down the
  //      page, so on a 768px window only the top ~150px of it is in view
  //      at scroll 0 — fitting to the full frame height overflows the
  //      VISIBLE height once the canvas is scrolled into view, cutting
  //      Vice City and the Keys off the bottom edge.
  // So the fit uses the visible rect only: width = frame minus the open
  // panel, height = the canvas height actually visible when the canvas
  // is scrolled into view (viewport height minus the ~80px scroll
  // margin the canvas lands at, plus a 16px margin). Measured from the
  // DOM at call time, so it is correct no matter when centerMap runs.
  // A panel covering most of the width (mobile overlay) is ignored —
  // the user closes it to see the map.
  const visibleMapRect = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return null;
    const cw = el.clientWidth;
    const ch = el.clientHeight;
    const panel = document.querySelector("#map-filters");
    let left = 12;
    if (panel instanceof HTMLElement) {
      // offsetLeft/offsetWidth, NOT getBoundingClientRect: the panel
      // slides in with `animate-in slide-in-from-left duration-200`, and
      // getBoundingClientRect reads its animated start position (fully
      // translated off-screen) for the first ~200ms after it opens —
      // that measured the panel as zero-width and left the island
      // ~150px left of the visible center on first load. Offsets ignore
      // the transform and give the panel's final position.
      const panelRight =
        panel.offsetLeft + panel.offsetWidth - el.offsetLeft + 12;
      if (panelRight < cw * 0.6) left = panelRight;
    }
    const right = cw - 12;
    const top = 12;
    const visibleH = Math.max(
      240,
      Math.min(ch, window.innerHeight - 96),
    );
    const bottom = Math.min(ch - 12, visibleH);
    return { left, right, top, bottom, width: right - left, height: bottom - top };
  }, []);

  // Default framing (first load + reset + FULL LEONIDA): fit the WHOLE
  // content box into the VISIBLE map area (contain, not cover). The
  // landmass occupies only the left ~40% of the square canvas, so
  // cover-fitting the canvas leaves the first load mostly empty ocean;
  // fitting only the content width zooms so far in (~271%) that the
  // island's edges crop and icons clip at the viewport edges. Containing
  // the whole box in the visible area shows the entire island on first
  // load, land as large as the frame allows, with no icons clipped and
  // none hidden behind the filter panel — the remaining space is map
  // ocean. The legacy illustration keeps the old cover-fit (its pins
  // span the whole illustration). In 3D the island's on-screen height
  // is compressed by cos(55°), so the contain uses the compressed
  // height — the island fits larger in 3D and still shows whole.
  // fit3D lets the 3D toggle pass the NEW mode explicitly (the ref still
  // holds the old mode until the next render); callers without an
  // argument read the ref.
  const centerMap = useCallback((fit3D?: boolean) => {
    if (!viewportRef.current) return;
    const in3D = fit3D ?? is3DRef.current;
    const { clientWidth, clientHeight } = viewportRef.current;
    if (edition === "community") {
      const rect = visibleMapRect();
      if (!rect) return;
      const boxW =
        ((COMMUNITY_BOUNDS.maxLeft - COMMUNITY_BOUNDS.minLeft) / 100) *
        CANVAS_W;
      const boxH =
        ((COMMUNITY_BOUNDS.maxTop - COMMUNITY_BOUNDS.minTop) / 100) *
        CANVAS_H;
      const cx =
        ((COMMUNITY_BOUNDS.minLeft + COMMUNITY_BOUNDS.maxLeft) / 2 / 100) *
        CANVAS_W;
      const cy =
        ((COMMUNITY_BOUNDS.minTop + COMMUNITY_BOUNDS.maxTop) / 2 / 100) *
        CANVAS_H;
      const ox = (rect.left + rect.right) / 2;
      const oy = (rect.top + rect.bottom) / 2;
      if (!in3D) {
        // Contain the whole content box in the VISIBLE area (94% — a
        // small margin so edge icons never clip), centered on the
        // visible area, so the entire island is visible at any
        // viewport size.
        const initialZoom =
          boxW > 0 && boxH > 0
            ? Math.min(rect.width / boxW, rect.height / boxH) * 0.94
            : 1;
        setZoom(initialZoom);
        setPan({
          x: ox - cx * initialZoom,
          y: oy - cy * initialZoom,
        });
      } else {
        // 3D fit: the tilt + perspective project the box NON-linearly
        // — the near (bottom) half is magnified and the projected
        // centre shifts down — so the cos-only fit overflows the
        // frame (at 1200px perspective it exploded ~6×). Solve by
        // iterating on the EXACT projection: start from the analytic
        // zoom, project the box corners, shrink the zoom until the
        // projected box contains in the visible area, and nudge the
        // pan so the projected box centres on the visible area. Five
        // rounds converge the centre to ~1px (pure math, no DOM reads).
        const project = (
          px: number,
          py: number,
          z: number,
          panX: number,
          panY: number,
        ) => {
          const dx = panX + px * z - ox;
          const dy = panY + py * z - oy;
          const s = PERSPECTIVE / (PERSPECTIVE - dy * SIN_TILT);
          return { x: ox + dx * s, y: oy + dy * COS_TILT * s };
        };
        const x0 = cx - boxW / 2;
        const x1 = cx + boxW / 2;
        const y0 = cy - boxH / 2;
        const y1 = cy + boxH / 2;
        const limitW = rect.width * 0.94;
        const limitH = rect.height * 0.94;
        const projectBox = (zz: number, px: number, py: number) => {
          const corners = [
            project(x0, y0, zz, px, py),
            project(x1, y0, zz, px, py),
            project(x0, y1, zz, px, py),
            project(x1, y1, zz, px, py),
          ];
          return {
            left: Math.min(...corners.map((c) => c.x)),
            right: Math.max(...corners.map((c) => c.x)),
            top: Math.min(...corners.map((c) => c.y)),
            bottom: Math.max(...corners.map((c) => c.y)),
          };
        };
        let z =
          boxW > 0 && boxH > 0
            ? Math.min(rect.width / boxW, rect.height / (boxH * COS_TILT)) *
              0.94
            : 1;
        let panX = ox - cx * z;
        let panY = oy - cy * z;
        // Two phases. (1) Settle the zoom: shrink until the projected
        // box contains in the visible area. (2) Centre the projected
        // box with ACCUMULATING pan nudges — one nudge under-corrects,
        // because under perspective the top edge moves slower than the
        // pan (its projected movement is damped), so a single nudge
        // leaves ~23px at 1919px. Each accumulated nudge shrinks the
        // residual ~2.5×, so a few rounds land within ~1px. (Resetting
        // the pan to the analytic centre each round — the first
        // version — discarded the previous nudge and never converged.)
        for (let i = 0; i < 8; i++) {
          const b = projectBox(z, panX, panY);
          const shrink = Math.min(
            1,
            limitW / (b.right - b.left),
            limitH / (b.bottom - b.top),
          );
          if (shrink < 0.999) {
            z *= shrink;
            panX = ox - cx * z;
            panY = oy - cy * z;
            continue;
          }
          const dx = ox - (b.left + b.right) / 2;
          const dy = oy - (b.top + b.bottom) / 2;
          if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) break;
          panX += dx;
          panY += dy;
        }
        setZoom(z);
        setPan({ x: panX, y: panY });
      }
    } else {
      const initialZoom = Math.max(
        clientWidth / CANVAS_W,
        clientHeight / CANVAS_H,
      );
      setZoom(initialZoom);
      setPan({
        x: (clientWidth - CANVAS_W * initialZoom) / 2,
        y: (clientHeight - CANVAS_H * initialZoom) / 2,
      });
    }
    setActiveDistrict("all");
    hasInteractedRef.current = false;
  }, [CANVAS_H, edition, visibleMapRect, COS_TILT, SIN_TILT, PERSPECTIVE]);

  const zoomAround = useCallback(
    (nextZoom: number, anchorX?: number, anchorY?: number) => {
      hasInteractedRef.current = true;
      const next = Math.min(12, Math.max(0.2, nextZoom));
      const rect = visibleMapRect();
      // In 3D the screen↔canvas mapping is only exact at the tilt pivot
      // (the visible-area centre), so zoom anchors there and ignores the
      // cursor/pinch midpoint. In 2D the anchor is the cursor (or the
      // visible centre when none is given).
      const centerX = rect
        ? (rect.left + rect.right) / 2
        : viewportSize.width / 2;
      const centerY = rect
        ? (rect.top + rect.bottom) / 2
        : viewportSize.height / 2;
      const x = is3D ? centerX : (anchorX ?? centerX);
      const y = is3D ? centerY : (anchorY ?? centerY);
      setPan({
        x: x - ((x - pan.x) / zoom) * next,
        y: y - ((y - pan.y) / zoom) * next,
      });
      setZoom(next);
    },
    [pan, zoom, viewportSize, visibleMapRect, is3D],
  );

  // 3D toggle ("Taish Tilt"): flip the map plane 0↔55° over ~400ms.
  // The pivot is measured from the visible rect first, so the island
  // (centred there) stays put. If the user has not moved the map yet,
  // re-fit with the NEW mode's framing; otherwise tilt in place (same
  // rule as the panel toggle). Reduced-motion snaps instead of animating.
  const toggle3D = useCallback(() => {
    const next = !is3DRef.current;
    const rect = visibleMapRect();
    if (rect)
      setTiltOrigin({
        x: (rect.left + rect.right) / 2,
        y: (rect.top + rect.bottom) / 2,
      });
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTiltAnimating(!reduceMotion);
    setIs3D(next);
    if (!reduceMotion)
      window.setTimeout(() => setTiltAnimating(false), 420);
    if (!hasInteractedRef.current) centerMap(next);
  }, [visibleMapRect, centerMap]);
  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    const wheel = (event: WheelEvent) => {
      if (!event.ctrlKey && document.activeElement !== element) return;
      event.preventDefault();
      const rect = element.getBoundingClientRect();
      zoomAround(
        zoom * Math.exp(-event.deltaY * 0.002),
        event.clientX - rect.left,
        event.clientY - rect.top,
      );
    };
    element.addEventListener("wheel", wheel, { passive: false });
    return () => element.removeEventListener("wheel", wheel);
  }, [zoom, zoomAround]);
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (document.activeElement !== viewportRef.current) return;
      const shifts: Record<string, [number, number]> = {
        ArrowLeft: [70, 0],
        ArrowRight: [-70, 0],
        ArrowUp: [0, 70],
        ArrowDown: [0, -70],
      };
      if (shifts[event.key]) {
        event.preventDefault();
        hasInteractedRef.current = true;
        const [x, y] = shifts[event.key];
        setPan((old) => ({ x: old.x + x, y: old.y + y }));
      } else if (["+", "=", "-", "0", "3"].includes(event.key)) {
        event.preventDefault();
        if (event.key === "0") centerMap();
        else if (event.key === "3") toggle3D();
        else zoomAround(zoom * (event.key === "-" ? 0.8 : 1.25));
      }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [zoom, zoomAround, centerMap, toggle3D]);

  // Pan/zoom to raw canvas coordinates without selecting a POI drawer —
  // used by deep links that carry &top=&left= for entities with no marker.
  const panToCanvasPoint = useCallback(
    (topPct: string, leftPct: string) => {
      if (!viewportRef.current) return;
      hasInteractedRef.current = true;
      const { clientWidth, clientHeight } = viewportRef.current;
      const targetZoom = Math.max(zoom, edition === "community" ? 3.0 : 1.65);
      setZoom(targetZoom);

      const px = (parseFloat(leftPct) / 100) * CANVAS_W;
      const py = (parseFloat(topPct) / 100) * CANVAS_H;
      const offsetX = rightDrawerOpen && clientWidth > 1024 ? -120 : 0;
      const rect = visibleMapRect();
      const centerX = rect ? (rect.left + rect.right) / 2 : clientWidth / 2;
      // Center on the visible area vertically too: after a search the
      // layout above the canvas grows (~150px), which can push the frame
      // center below a short viewport and clip the focused pin.
      const centerY = rect ? (rect.top + rect.bottom) / 2 : clientHeight / 2;
      setPan({
        x: centerX - px * targetZoom + offsetX,
        y: centerY - py * targetZoom,
      });
    },
    [zoom, rightDrawerOpen, edition, CANVAS_H, visibleMapRect],
  );

  // Center on a specific POI & sync shareable URL
  const focusOnPOI = useCallback(
    (poi: MapPOI) => {
      if (!viewportRef.current) return;
      hasInteractedRef.current = true;
      trackPublicEvent("map_pin_open");
      returnFocusRef.current = document.activeElement as HTMLElement;
      setClusterMembers([]);
      if (poi.title.startsWith("Unnamed ")) setNamedOnly(false);
      setSelectedPOI(poi);
      // On mobile the filter panel is a full overlay, so close it for the
      // detail card. On desktop the panel is persistent and stays open.
      if (window.innerWidth < 1024) setLeftSidebarOpen(false);
      setRightDrawerOpen(true);
      if (window.innerWidth < 640)
        window.setTimeout(
          () =>
            viewportRef.current?.scrollIntoView({
              block: "start",
              behavior: "auto",
            }),
          0,
        );

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
      const targetZoom = Math.max(zoom, edition === "community" ? 3.0 : 1.65);
      setZoom(targetZoom);

      const px = (parseFloat(poi.left) / 100) * CANVAS_W;
      const py = (parseFloat(poi.top) / 100) * CANVAS_H;

      // Adjust center slightly left if right drawer is open
      const offsetX = rightDrawerOpen && clientWidth > 1024 ? -120 : 0;

      // Center on the VISIBLE area, not the frame middle — the open
      // filter panel covers the left ~300px, so a POI centered in the
      // frame would land behind the panel; and after a search the layout
      // above the canvas grows, which can push the frame center below a
      // short viewport and clip the pin.
      const rect = visibleMapRect();
      const centerX = rect ? (rect.left + rect.right) / 2 : clientWidth / 2;
      const centerY = rect ? (rect.top + rect.bottom) / 2 : clientHeight / 2;
      const newPanX = centerX - px * targetZoom + offsetX;
      const newPanY = centerY - py * targetZoom;

      setPan({ x: newPanX, y: newPanY });
    },
    [zoom, rightDrawerOpen, edition, CANVAS_H, visibleMapRect],
  );

  // Center the map BEFORE first paint (layout effect, not a passive effect):
  // the initial state renders zoomed 1.0 at the top-left corner, and the old
  // passive effect recentered it after paint — a visible jump that also
  // delayed the LCP paint of the overview image. Centering here means the
  // first paint after hydration is already the final centered map.
  useLayoutEffect(() => {
    centerMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Desktop: the filter panel starts open (gtamap.io pattern) — it overlays
  // the left of the map and collapses with the Filters button. Mobile
  // starts closed so the map itself is visible first.
  useLayoutEffect(() => {
    if (window.innerWidth >= 1024) setLeftSidebarOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fit when the VISIBLE area changes — the filter panel opening or
  // closing, or the window resizing — because centerMap fits to the
  // visible area, not the frame. Guarded by hasInteractedRef: once the
  // user has moved the map themselves, resizing or toggling the panel
  // must not yank their view back. centerMap itself is stable, so this
  // runs only when the panel or the frame size actually changes.
  useLayoutEffect(() => {
    if (!hasInteractedRef.current) centerMap();
  }, [leftSidebarOpen, viewportSize, centerMap]);

  useEffect(() => {
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
      const targetTop = params.get("top");
      const targetLeft = params.get("left");
      if (targetPoiId) {
        // Prefix-tolerant: /map?poi=ocean-drive and ?poi=poi-ocean-drive both work.
        const matched = allPOIs.find(
          (p) =>
            p.id === targetPoiId || p.id === targetPoiId.replace(/^poi-/, ""),
        );
        if (matched) {
          setTimeout(() => focusOnPOI(matched), 250);
        } else {
          // Not a bundled marker — likely a CMS marker that loads async, or an
          // entity with only canvas coordinates (collectibles/properties).
          pendingDeepLinkRef.current = {
            id: targetPoiId,
            top: targetTop,
            left: targetLeft,
          };
        }
      } else if (targetTop && targetLeft) {
        deepLinkTimeoutsRef.current.push(
          window.setTimeout(() => panToCanvasPoint(targetTop, targetLeft), 250),
        );
      }
    }
    // One-time deep-link resolution: focusOnPOI's identity changes with zoom,
    // so re-running this effect would yank the user back on every zoom.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerMap]);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("poi");
    const marker = personalMarkers.find(
      (item) =>
        item.id === id &&
        (edition === "community"
          ? item.mapSpace === COMMUNITY_MAP_SPACE
          : !item.mapSpace),
    );
    if (!marker || personalDeepLink.current === id) return;
    const timer = window.setTimeout(() => {
      personalDeepLink.current = id;
      pendingDeepLinkRef.current = null;
      focusOnPOI(personalToPoi(marker));
    }, 100);
    return () => window.clearTimeout(timer);
  }, [personalMarkers, focusOnPOI]);

  // Clear pending deep-link timeouts on unmount so a late fire cannot
  // yank the viewport after navigation.
  useEffect(() => {
    const timeouts = deepLinkTimeoutsRef.current;
    return () => {
      timeouts.forEach((t) => window.clearTimeout(t));
      timeouts.length = 0;
    };
  }, []);

  // Jump to district
  const jumpToDistrict = (districtId: string) => {
    setActiveDistrict(districtId);
    const d = DISTRICTS.find((item) => item.id === districtId);
    if (!d || !viewportRef.current) return;

    const { clientWidth, clientHeight } = viewportRef.current;
    const matches =
      edition === "community"
        ? editorialPOIs.filter((poi) =>
            poi.district
              .toLowerCase()
              .includes(d.name.toLowerCase().replace(" national park", "")),
          )
        : [];
    if (edition === "community" && districtId !== "all" && !matches.length) {
      setMapFeedback(
        "No positioned community records match this destination yet.",
      );
      return;
    }
    if (districtId === "all") {
      // FULL LEONIDA shows the same whole-island framing as first load.
      centerMap();
      return;
    }
    hasInteractedRef.current = true;
    const targetZoom = edition === "community" ? 1.8 : d.zoom;
    setZoom(targetZoom);

    const px =
      ((matches.length
        ? matches.reduce((sum, poi) => sum + parseFloat(poi.left), 0) /
          matches.length
        : d.left) /
        100) *
      CANVAS_W;
    const py =
      ((matches.length
        ? matches.reduce((sum, poi) => sum + parseFloat(poi.top), 0) /
          matches.length
        : d.top) /
        100) *
      CANVAS_H;

    // Center on the visible area's horizontal middle (open filter panel
    // excluded) and vertical middle (viewport-capped), so the district
    // lands in view, not behind the panel or below a short viewport.
    const rect = visibleMapRect();
    const centerX = rect ? (rect.left + rect.right) / 2 : clientWidth / 2;
    const centerY = rect ? (rect.top + rect.bottom) / 2 : clientHeight / 2;
    const newPanX = centerX - px * targetZoom;
    const newPanY = centerY - py * targetZoom;

    setPan({ x: newPanX, y: newPanY });
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left button only
    livePanRef.current = pan;
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
      // In 3D the ground plane is compressed vertically by cos(55°),
      // so a screen drag covers more canvas vertically — divide dy out
      // so dragging still feels 1:1 with the cursor. Horizontal is
      // unaffected by the tilt.
      queuePan({
        x: dragStartRef.current.panX + dx,
        y: dragStartRef.current.panY + (is3D ? dy / COS_TILT : dy),
      });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) setPan(livePanRef.current);
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const touchStartRef = useRef<{ x: number; y: number; dist: number }>({
    x: 0,
    y: 0,
    dist: 0,
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      livePanRef.current = pan;
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
        e.touches[0].clientY - e.touches[1].clientY,
      );
      touchStartRef.current.dist = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const dx = e.touches[0].clientX - dragStartRef.current.x;
      const dy = e.touches[0].clientY - dragStartRef.current.y;
      queuePan({
        x: dragStartRef.current.panX + dx,
        y: dragStartRef.current.panY + (is3D ? dy / COS_TILT : dy),
      });
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      const factor = dist / touchStartRef.current.dist;
      touchStartRef.current.dist = dist;
      const rect = viewportRef.current?.getBoundingClientRect();
      zoomAround(
        zoom * factor,
        rect
          ? (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left
          : undefined,
        rect
          ? (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top
          : undefined,
      );
    }
  };

  const handleTouchEnd = () => {
    if (isDragging) setPan(livePanRef.current);
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
      const subUpdated: Record<string, boolean> = {};
      for (const list of Object.values(categorySubcategories))
        for (const sub of list) subUpdated[sub.id] = nextVal;
      setCheckedSubcategories(subUpdated);
    } else {
      const nextVal = !checkedFilters[id];
      setCheckedFilters((prev) => ({
        ...prev,
        [id]: nextVal,
        all: false,
      }));
      const subUpdated: Record<string, boolean> = {};
      for (const sub of categorySubcategories[id] || [])
        subUpdated[sub.id] = nextVal;
      setCheckedSubcategories((prev) => ({ ...prev, ...subUpdated }));
    }
  };

  const toggleSubcategory = (id: string) => {
    const nextVal = !isSubcategoryChecked(id);
    setCheckedSubcategories((prev) => ({ ...prev, [id]: nextVal }));
  };

  const showAllFilters = () => {
    const allOn: Record<string, boolean> = {};
    CATEGORY_FILTERS.forEach((c) => {
      allOn[c.id] = true;
    });
    setCheckedFilters(allOn);
    const subOn: Record<string, boolean> = {};
    for (const list of Object.values(categorySubcategories))
      for (const sub of list) subOn[sub.id] = true;
    setCheckedSubcategories(subOn);
  };

  const hideAllFilters = () => {
    const allOff: Record<string, boolean> = {};
    CATEGORY_FILTERS.forEach((c) => {
      allOff[c.id] = false;
    });
    setCheckedFilters(allOff);
    const subOff: Record<string, boolean> = {};
    for (const list of Object.values(categorySubcategories))
      for (const sub of list) subOff[sub.id] = false;
    setCheckedSubcategories(subOff);
  };

  // Filtered POIs
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const visiblePOIs = useMemo(() => {
    const filtered = allPOIs.filter((p) => {
      if (hideCollected && collectedPOIs[p.id]) return false;
      if (favoritesOnly && !favoriteLocations.includes(p.id)) return false;
      if (verifiedOnly && !p.sourceUrl?.startsWith("https://")) return false;
      if (namedOnly && !p.personal && p.title.startsWith("Unnamed "))
        return false;
      const isCategoryChecked =
        checkedFilters.all || checkedFilters[p.category];
      const isSubcategoryChecked =
        (checkedSubcategories[p.subcategory || "poi"] ??
          !DEFAULT_HIDDEN_SUBCATEGORIES.includes(p.subcategory || "poi"));
      const matchesSearch =
        searchQuery.trim() === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.type.toLowerCase().includes(searchQuery.toLowerCase());
      return isCategoryChecked && isSubcategoryChecked && matchesSearch;
    });
    return filtered.sort((a, b) =>
      resultSort === "area"
        ? a.district.localeCompare(b.district) || a.title.localeCompare(b.title)
        : resultSort === "unvisited"
          ? Number(!!collectedPOIs[a.id]) - Number(!!collectedPOIs[b.id]) ||
            a.title.localeCompare(b.title)
          : a.title.localeCompare(b.title),
    );
  }, [
    allPOIs,
    checkedFilters,
    checkedSubcategories,
    searchQuery,
    hideCollected,
    collectedPOIs,
    verifiedOnly,
    favoritesOnly,
    favoriteLocations,
    namedOnly,
    resultSort,
  ]);

  // Large, clearly visible pictograms: 30px at overview, 36px at the
  // district zoom (1.8x), up to 44px deep in. The pin button is
  // counter-scaled by 1/zoom, so the on-screen size is exactly iconPx at
  // any zoom — including mobile.
  const iconPx = Math.round(Math.min(44, Math.max(30, 22 + zoom * 8)));

  // No clustering, and no position nudging: every visible pin shows its own
  // location pictogram at its true coordinates. The numbered cluster badges
  // are gone. Crowding is solved with zoom-gated density instead: at the
  // current zoom, only one pin may occupy each icon-sized screen cell.
  // Pins are accepted in priority order — the selected pin and personal
  // pins first, then named pins, then by title — so the most useful pins
  // win the visible slot and the rest appear as you zoom in (their screen
  // separation grows with zoom). A gated pin is never hidden for good: it
  // is reachable by search, and selecting it always shows it. Viewport
  // culling is kept so off-screen pins are not rendered.
  const { clusters, densityHidden } = useMemo(() => {
    const inView = visiblePOIs.filter((item) => {
      const x = (parseFloat(item.left) / 100) * CANVAS_W;
      const y = (parseFloat(item.top) / 100) * CANVAS_H;
      const screenX = x * zoom + pan.x;
      const screenY = y * zoom + pan.y;
      return (
        screenX >= -80 &&
        screenY >= -80 &&
        screenX <= viewportSize.width + 80 &&
        screenY <= viewportSize.height + 80
      );
    });
    // Minimum on-screen gap between two pins: the icon size plus a small
    // margin, so icons never touch or stack at any zoom. Measured with
    // Chebyshev distance (the larger of |dx|, |dy|), NOT Euclidean:
    // icons are square, so two pins ~42px apart diagonally pass a
    // Euclidean check yet their square boxes overlap at the corners —
    // exactly the Downtown touching seen live at 180% zoom. Chebyshev
    // separation >= icon size guarantees the icon squares never touch.
    const minSep = iconPx + 6;
    const rank = (p: MapPOI) =>
      p.id === selectedPOI?.id
        ? 0
        : p.personal
          ? 1
          : p.title.startsWith("Unnamed ")
            ? 3
            : 2;
    const ordered = [...inView].sort(
      (a, b) => rank(a) - rank(b) || a.title.localeCompare(b.title),
    );
    const accepted: MapPOI[] = [];
    const acceptedXY: { x: number; y: number }[] = [];
    for (const item of ordered) {
      const x = (parseFloat(item.left) / 100) * CANVAS_W;
      const y = (parseFloat(item.top) / 100) * CANVAS_H;
      const sx = x * zoom + pan.x;
      const sy = y * zoom + pan.y;
      const exempt = item.id === selectedPOI?.id || item.personal;
      if (
        !exempt &&
        acceptedXY.some((p) => {
          // In 3D the tilt compresses on-screen vertical gaps by
          // cos(55°) — a pair that clears the gate in canvas space can
          // still touch on screen. Compare the COMPRESSED vertical gap,
          // so the gate guarantees minSep on screen in both modes.
          const dy = Math.abs(p.y - sy) * (is3D ? COS_TILT : 1);
          return Math.max(Math.abs(p.x - sx), dy) < minSep;
        })
      )
        continue;
      accepted.push(item);
      acceptedXY.push({ x: sx, y: sy });
    }
    return {
      clusters: accepted.map((item) => ({
        key: item.id,
        top: parseFloat(item.top),
        left: parseFloat(item.left),
        members: [item],
      })),
      densityHidden: inView.length - accepted.length,
    };
  }, [
    visiblePOIs,
    zoom,
    pan,
    viewportSize,
    CANVAS_H,
    selectedPOI?.id,
    iconPx,
    is3D,
    COS_TILT,
  ]);

  const verifiedTotal = allPOIs.filter((poi) => collectedPOIs[poi.id]).length;

  return (
    <div
      ref={containerRef}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          if (rightDrawerOpen) closeDetails();
          else if (leftSidebarOpen) closeFilters();
          else if (isFullscreen) setIsFullscreen(false);
        }
      }}
      className={cn(
        "w-full select-none transition-all",
        isFullscreen
          ? "fixed inset-0 z-[9999] flex h-dvh w-screen flex-col bg-[#02050b] p-0 overflow-hidden"
          : "relative rounded-3xl",
      )}
    >
      {/* ================================================================= */}
      {/* TOP COMMAND HEADER (GTA HUD BAR)                                  */}
      {/* ================================================================= */}
      <div
        className={`dark-panel ${mapStyles.darkSurface} flex flex-wrap items-center justify-between gap-3 border-b border-border bg-[#070b14] px-4 py-3 sm:px-6 rounded-t-3xl`}
      >
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#FF2E9A] to-violet-500 text-white shadow-[0_0_15px_rgba(255,46,154,0.4)]">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-black uppercase tracking-wider text-white">
                {edition === "community"
                  ? "LEONIDA COMMUNITY ATLAS"
                  : "ORIGINAL PLANNING MAP"}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-[#FF2E9A]/30 bg-[#FF2E9A]/10 px-2 py-0.5 text-xs font-black uppercase text-[#FF2E9A]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF2E9A] " />
                FAN MAP
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Fan-made Leonida Atlas • {visiblePOIs.length} provisional pins
            </p>
          </div>
        </div>

        {/* District Quick Jumper */}
        <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto rounded-xl border border-border bg-[#03060f] p-1">
          {DISTRICTS.map((d) => (
            <button
              key={d.id}
              onClick={() => jumpToDistrict(d.id)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-bold uppercase transition-all",
                activeDistrict === d.id
                  ? "bg-[#FF2E9A] text-white font-black shadow-xs"
                  : "text-muted-foreground hover:text-white hover:bg-muted/40",
              )}
            >
              {d.name.replace("State", "").replace("Waterfront", "").trim()}
            </button>
          ))}
        </div>

        {/* Viewport Action Icons */}
        <div className="flex max-w-full flex-wrap items-center gap-2">
          {playerMode && (
            <button
              type="button"
              className="player-button"
              onClick={() => setPinFormOpen((value) => !value)}
            >
              + Private pin
            </button>
          )}
          <button
            ref={filtersButtonRef}
            aria-expanded={leftSidebarOpen}
            aria-controls="map-filters"
            aria-label="Map filters"
            onClick={() => setLeftSidebarOpen((v) => !v)}
            className={cn(
              "flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold transition-all",
              leftSidebarOpen
                ? "border-[#FF2E9A]/50 bg-[#FF2E9A]/15 text-white"
                : "border-border bg-muted/40 text-muted-foreground hover:text-white",
            )}
            title="Toggle Filter Sidebar"
          >
            <Sliders className="h-3.5 w-3.5 text-[#FF2E9A]" />
            <span className="hidden sm:inline">Filters</span>
          </button>

          <button
            onClick={() => {
              if (mapMode === "satellite") setMapMode("tactical");
              else if (mapMode === "tactical") setMapMode("radar");
              else setMapMode("satellite");
            }}
            className="flex h-9 items-center gap-1.5 rounded-xl border border-border bg-muted/40 px-3 text-xs font-bold text-muted-foreground hover:text-white transition-colors"
            title="Cycle Map Visual Mode"
          >
            <Layers className="h-3.5 w-3.5 text-slate-200" />
            <span className="capitalize">
              {mapMode === "satellite" ? "Map" : mapMode}
            </span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-muted/40 text-muted-foreground hover:text-white hover:border-[#FF2E9A]/50 transition-all shadow-sm"
            title={isFullscreen ? "Exit Fullscreen" : "Full Screen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* ================================================================= */}
      {/* MAIN MAP WORKSPACE (FULL-HEIGHT INTERACTIVE VIEWPORT)             */}
      {/* ================================================================= */}
      <div
        className={`dark-panel ${mapStyles.darkSurface} border-b border-border p-3 sm:p-4 space-y-3`}
      >
        <div className="flex flex-wrap items-end gap-3">
          <label className="min-w-0 flex-1 basis-48 text-sm font-semibold">
            Find a location
            <input
              type="search"
              maxLength={120}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2.5 text-sm bg-[#101827] text-white focus:border-[#FF2E9A] focus:outline-none"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search names, areas or landmarks"
            />
          </label>
          <button
            aria-label="Next unvisited"
            className="player-button"
            onClick={() => {
              const next = nextUnvisited(
                visiblePOIs,
                collectedPOIs,
                selectedPOI?.id,
              );
              if (next) {
                focusOnPOI(next);
                setMapFeedback(`Next unvisited: ${next.title}`);
              } else
                setMapFeedback(
                  "All matching pins are marked, or there are no matching pins.",
                );
            }}
          >
            <span className="sm:hidden">Next</span>
            <span className="hidden sm:inline">Next unvisited</span>
          </button>
          <button
            aria-label="Reset filters"
            className="player-button"
            onClick={() => {
              setSearchQuery("");
              setNamedOnly(true);
              setVerifiedOnly(false);
              setFavoritesOnly(false);
              setHideCollected(false);
              setCheckedFilters(
                Object.fromEntries(
                  CATEGORY_FILTERS.map((item) => [item.id, true]),
                ),
              );
              setClusterMembers([]);
              centerMap();
              setSelectedPOI(null);
              setRightDrawerOpen(false);
              const resetUrl = new URL(location.href);
              for (const key of [
                "poi",
                "q",
                "category",
                "categories",
                "hideMarked",
                "unnamed",
                "top",
                "left",
              ])
                resetUrl.searchParams.delete(key);
              history.replaceState({}, "", resetUrl);
              setMapFeedback("Search and filters reset.");
            }}
          >
            <span className="sm:hidden">Reset</span>
            <span className="hidden sm:inline">Reset filters</span>
          </button>
          <button
            aria-label="Share search"
            className="player-button"
            onClick={async () => {
              try {
                const url = new URL("/map", location.origin);
                if (edition === "legacy")
                  url.searchParams.set("edition", "legacy");
                if (mapStyle !== "community")
                  url.searchParams.set("style", mapStyle);
                if (searchQuery.trim())
                  url.searchParams.set("q", searchQuery.trim());
                const active = CATEGORY_FILTERS.filter(
                  (item) => item.id !== "all" && checkedFilters[item.id],
                );
                if (!checkedFilters.all)
                  url.searchParams.set(
                    "categories",
                    active.map((item) => item.id).join(","),
                  );
                if (!namedOnly) url.searchParams.set("unnamed", "1");
                if (hideCollected) url.searchParams.set("hideMarked", "1");
                await navigator.clipboard.writeText(url.toString());
                setMapFeedback(
                  "Map search link copied. Private pins, notes and personal marks are excluded.",
                );
              } catch {
                setMapFeedback(
                  "Could not copy this view. Use the pin's share button or copy the page address.",
                );
              }
            }}
          >
            <span className="sm:hidden">Share</span>
            <span className="hidden sm:inline">Share search</span>
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span role="status">
            {visiblePOIs.length.toLocaleString("en-US")} matching pins ·{" "}
            {verifiedTotal} marked
          </span>
          {densityHidden > 0 && (
            <span className="text-muted-foreground">
              {densityHidden} more in view appear as you zoom in
            </span>
          )}
          <label className="hidden sm:flex items-center gap-2">
            <input
              type="checkbox"
              checked={namedOnly}
              onChange={(event) => setNamedOnly(event.target.checked)}
            />
            Hide unnamed community records
          </label>
          <label className="hidden sm:flex items-center gap-2">
            <input
              type="checkbox"
              checked={hideCollected}
              onChange={(event) => setHideCollected(event.target.checked)}
            />
            Hide marked
          </label>
          {!playerMode && (
            <Link
              href="/login"
              className="hidden sm:inline underline text-[#FF2E9A]"
            >
              My private map & account sync
            </Link>
          )}
        </div>
        {mapFeedback && (
          <p role="status" className="text-sm">
            {mapFeedback}
          </p>
        )}
        {searchQuery.trim() && (
          <div className="rounded-xl border border-border p-3 space-y-2">
            <label className="flex flex-wrap items-center gap-2 text-sm">
              Sort results
              <select
                className="rounded-lg border border-border bg-[#101827] px-3 py-2 text-white"
                value={resultSort}
                onChange={(event) => setResultSort(event.target.value)}
              >
                <option value="name">Name</option>
                <option value="area">Area</option>
                <option value="unvisited">Unvisited first</option>
              </select>
            </label>
            <div className="max-h-48 overflow-y-auto grid gap-2 sm:grid-cols-2">
              {visiblePOIs.slice(0, 20).map((poi) => (
                <button
                  key={poi.id}
                  className="min-h-11 rounded-lg border border-border p-3 text-left text-sm"
                  onClick={() => focusOnPOI(poi)}
                >
                  <strong>{poi.title}</strong>
                  <span className="block text-xs mt-1">
                    {poi.district} ·{" "}
                    {collectedPOIs[poi.id] ? "Marked" : "Unvisited"}
                  </span>
                </button>
              ))}
            </div>
            {!visiblePOIs.length && (
              <p className="text-sm">
                No positioned pins match these filters. Try a different name or
                reset the filters.
              </p>
            )}
            {edition === "community" &&
              communityLandmarks
                .filter(
                  (item) =>
                    !item.position &&
                    `${item.name} ${item.area}`
                      .toLowerCase()
                      .includes(searchQuery.trim().toLowerCase()),
                )
                .slice(0, 5)
                .map((item) => (
                  <p key={item.id} className="text-sm">
                    <a
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={item.reference}
                    >
                      {item.name}
                    </a>{" "}
                    · coordinates unknown; not placed on this map.
                  </p>
                ))}
          </div>
        )}
      </div>
      {pinFormOpen && (
        <form
          className="player-panel my-3 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (!pinTitle.trim() || !viewportRef.current) return;
            const rect = viewportRef.current;
            const marker: PersonalMarker = {
              id: `personal-${crypto.randomUUID()}`,
              title: pinTitle.trim(),
              ...(edition === "community"
                ? { mapSpace: COMMUNITY_MAP_SPACE }
                : {}),
              top: Math.min(
                100,
                Math.max(
                  0,
                  ((rect.clientHeight / 2 - pan.y) / zoom / CANVAS_H) * 100,
                ),
              ),
              left: Math.min(
                100,
                Math.max(
                  0,
                  ((rect.clientWidth / 2 - pan.x) / zoom / CANVAS_W) * 100,
                ),
              ),
            };
            const current = getStoredUserState();
            if (current.personalMarkers.length >= 200) return;
            if (
              saveStoredUserState({
                ...current,
                personalMarkers: [...current.personalMarkers, marker],
              })
            ) {
              setPinTitle("");
              setPinFormOpen(false);
              setSelectedPOI(personalToPoi(marker));
              setRightDrawerOpen(true);
            }
          }}
        >
          <label className="player-label">
            Private pin name
            <input
              required
              maxLength={120}
              autoFocus
              className="mt-1 block w-full min-w-0 rounded-lg border border-white/20 bg-[#111827] px-3 py-2.5 text-sm text-white outline-none focus:border-[#FF2E9A] focus:ring-2 focus:ring-[#FF2E9A]/30"
              value={pinTitle}
              onChange={(event) => setPinTitle(event.target.value)}
            />
          </label>
          <p className="text-xs text-slate-400">
            The pin is placed at the current map view’s center. Pan the map to
            the desired position first. Personal pins are private and do not
            appear in shared map links.
          </p>
          <div className="flex gap-2">
            <button
              disabled={personalMarkers.length >= 200}
              className="player-button player-button-primary"
            >
              Place at view center
            </button>
            <button
              type="button"
              className="player-button"
              onClick={() => setPinFormOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <div
        className={cn(
          "dark-panel",
          mapStyles.darkSurface,
          "relative w-full overflow-hidden bg-[#02050b]",
          isFullscreen
            ? "min-h-0 flex-1"
            : "h-[640px] sm:h-[720px] lg:h-[780px] rounded-b-3xl border border-t-0 border-border shadow-2xl",
        )}
      >
        {/* Static preview — paints immediately on first load (server HTML) so
            the map image is the LCP element before the interactive map's JS
            mounts. The interactive canvas renders on top once hydrated; the
            preview then fades out (see previewVisible) — it must not stay
            visible, because the canvas never covers the whole frame and the
            preview's west coast / Keys would peek out west of the canvas
            edge as a ghost image. object-cover matches the interactive
            map's cover-fit first view. Community edition only — legacy
            uses a different base image. */}
        {edition === "community" && (
          <img
            src="/maps/gtadb-yanis17/overview.webp"
            alt="Community reconstruction of Leonida by GTADB contributors, not official game geography"
            width={1536}
            height={1536}
            fetchPriority="high"
            decoding="sync"
            aria-hidden="true"
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
              previewVisible ? "opacity-100" : "opacity-0",
            )}
          />
        )}
        {/* ==================== 1. FLOATING LEFT FILTER DRAWER ==================== */}
        {leftSidebarOpen && (
          <div
            id="map-filters"
            role="region"
            aria-label="Map filters"
            className="absolute left-3 top-3 bottom-3 z-30 w-72 max-w-[calc(100%_-_24px)] flex flex-col rounded-2xl border border-border bg-[#070c18]/95 p-4 shadow-2xl  animate-in slide-in-from-left duration-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h2 className="font-display text-xs font-black uppercase tracking-wider text-white">
                  Map Categories
                </h2>
                <p className="text-xs text-muted-foreground">
                  Toggle pins and POIs
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={showAllFilters}
                  className="text-xs font-bold text-[#FF2E9A] hover:underline"
                >
                  Show all
                </button>
                <span className="text-xs text-muted-foreground">·</span>
                <button
                  onClick={hideAllFilters}
                  className="text-xs font-bold text-[#FF2E9A] hover:underline"
                >
                  Hide all
                </button>
                <button
                  onClick={closeFilters}
                  aria-label="Close map filters"
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-1 text-muted-foreground hover:text-white hover:bg-muted/50 ml-2"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Map style — lives here while the panel is open, so it never
                hides behind the panel. The floating switcher takes over
                when the panel is closed. */}
            {edition === "community" && (
              <div className="mt-3">
                <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Map style
                </p>
                <div className="grid grid-cols-3 gap-1 rounded-xl border border-border bg-black/50 p-1">
                  {MAP_STYLE_OPTIONS.map((s) => {
                    const SIcon = s.icon;
                    const active = mapStyle === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setMapStyle(s.id)}
                        className={cn(
                          "flex flex-col items-center gap-1 rounded-lg px-1 py-2 text-[11px] font-bold transition-all",
                          active
                            ? "bg-[#FF2E9A] text-white shadow"
                            : "text-muted-foreground hover:text-white",
                        )}
                      >
                        <SIcon className="h-3.5 w-3.5" />
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Filter Search */}
            <div className="relative mt-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                aria-label="Search map pins"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search weapons, stunts, banks..."
                className="w-full rounded-xl border border-border bg-black/50 py-2 pl-9 pr-3 text-xs text-white placeholder:text-muted-foreground focus:border-[#FF2E9A] focus:outline-none"
              />
              {searchQuery && (
                <button
                  aria-label="Clear map search"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Collectible Tracker */}
            {(() => {
              const collectiblePOIs = allPOIs.filter(
                (p) => p.category === "collectibles",
              );
              const collectedCount = collectiblePOIs.filter(
                (p) => collectedPOIs[p.id],
              ).length;
              const totalCount = collectiblePOIs.length;
              const pct =
                totalCount > 0
                  ? Math.round((collectedCount / totalCount) * 100)
                  : 0;
              return (
                <div className="mt-3 rounded-xl border border-border bg-black/40 p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[#FF2E9A] flex items-center gap-1.5">
                      <Gem className="h-3.5 w-3.5" />
                      Collectibles
                    </span>
                    <span className="text-xs font-mono text-[#FF2E9A]">
                      {collectedCount}/{totalCount} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-black/40 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#FF2E9A] to-violet-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <button
                    onClick={() => setHideCollected(!hideCollected)}
                    className={cn(
                      "mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-all border",
                      hideCollected
                        ? "border-[#FF2E9A]/50 bg-[#FF2E9A]/20 text-[#FF2E9A]"
                        : "border-slate-600 bg-slate-800/50 text-slate-300 hover:bg-slate-700/50",
                    )}
                  >
                    <EyeOff className="h-3 w-3" />
                    {hideCollected ? "Show collected too" : "Hide Collected"}
                  </button>
                </div>
              );
            })()}

            {/* Checklist items: per-category toggle + per-subcategory eye toggles */}
            <div
              tabIndex={0}
              role="region"
              aria-label="Scrollable map categories"
              className="mt-3 flex-1 space-y-0.5 overflow-y-auto pr-1"
            >
              {CATEGORY_FILTERS.map((f) => {
                const isChecked = checkedFilters[f.id] ?? false;
                const Icon = f.icon;
                const subs = categorySubcategories[f.id] || [];
                const expanded = expandedCategories[f.id] ?? true;
                return (
                  <div key={f.id}>
                    <div
                      className={cn(
                        "flex w-full min-h-[44px] select-none items-center justify-between rounded-xl px-2.5 py-2.5 text-left text-xs font-semibold transition-colors",
                        f.all
                          ? "border border-[#FF2E9A]/30 bg-[#FF2E9A]/10 text-white font-bold"
                          : "text-muted-foreground hover:bg-muted/40 hover:text-white",
                      )}
                    >
                      <button
                        type="button"
                        aria-pressed={isChecked}
                        onClick={() => toggleFilter(f.id)}
                        className="flex min-w-0 flex-1 items-center gap-2 truncate"
                      >
                        <Icon
                          className={cn("h-3.5 w-3.5 shrink-0", f.color)}
                        />
                        <span className="truncate">{f.label}</span>
                      </button>
                      <span className="flex items-center gap-1.5">
                        <span className="text-xs font-mono text-muted-foreground">
                          {foundByCategory[f.id] ?? 0}/{filterCounts[f.id] ?? 0}
                        </span>
                        {subs.length > 0 && (
                          <button
                            type="button"
                            aria-label={
                              expanded
                                ? `Collapse ${f.label} subcategories`
                                : `Expand ${f.label} subcategories`
                            }
                            aria-expanded={expanded}
                            onClick={() =>
                              setExpandedCategories((prev) => ({
                                ...prev,
                                [f.id]: !expanded,
                              }))
                            }
                            className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-white"
                          >
                            <ChevronDown
                              className={cn(
                                "h-3.5 w-3.5 transition-transform",
                                !expanded && "-rotate-90",
                              )}
                            />
                          </button>
                        )}
                        <button
                          type="button"
                          aria-pressed={isChecked}
                          aria-label={`Toggle ${f.label}`}
                          onClick={() => toggleFilter(f.id)}
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded transition-all",
                            isChecked
                              ? "bg-[#FF2E9A] text-white shadow-xs"
                              : "border border-border bg-black/40",
                          )}
                        >
                          {isChecked && (
                            <Check
                              className="h-3 w-3 text-white"
                              strokeWidth={3.5}
                            />
                          )}
                        </button>
                      </span>
                    </div>
                    {expanded &&
                      subs.map((sub) => {
                        const on = isSubcategoryChecked(sub.id);
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            aria-pressed={on}
                            onClick={() => toggleSubcategory(sub.id)}
                            className={cn(
                              "ml-5 flex w-[calc(100%-20px)] min-h-[36px] select-none items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs transition-colors",
                              on
                                ? "text-slate-200 hover:bg-muted/40"
                                : "text-muted-foreground/60 hover:bg-muted/40 hover:text-white",
                            )}
                          >
                            <span className="flex min-w-0 items-center gap-2 truncate">
                              {on ? (
                                <Eye className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                              ) : (
                                <EyeOff className="h-3.5 w-3.5 shrink-0" />
                              )}
                              <span className="truncate">{sub.label}</span>
                            </span>
                            <span className="shrink-0 text-xs font-mono text-muted-foreground">
                              {foundBySubcategory[sub.id] ?? 0}/
                              {subcategoryCounts[sub.id] ?? 0}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                );
              })}
            </div>

            <label className="sm:hidden flex min-h-11 items-center gap-2 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={namedOnly}
                onChange={(event) => setNamedOnly(event.target.checked)}
              />
              Hide unnamed records
            </label>
            {/* Evidence filter: only pins with a trailer source */}
            <div className="mt-3 pt-3 border-t border-border">
              <button
                type="button"
                aria-pressed={favoritesOnly}
                onClick={() => setFavoritesOnly((value) => !value)}
                className="mb-2 flex min-h-11 w-full items-center justify-between rounded-xl px-2.5 text-xs font-semibold text-slate-200"
              >
                <span>Favorites only</span>
                <span>{favoritesOnly ? "On" : "Off"}</span>
              </button>
              <button
                type="button"
                aria-pressed={verifiedOnly}
                onClick={() => setVerifiedOnly((v) => !v)}
                className="flex w-full min-h-[44px] cursor-pointer select-none items-center justify-between rounded-xl px-2.5 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-muted/40 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-2 truncate">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-slate-200" />
                  <span className="truncate">With community source link</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">
                    {
                      allPOIs.filter((p) => p.sourceUrl?.startsWith("https://"))
                        .length
                    }
                  </span>
                  <span
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded transition-all",
                      verifiedOnly
                        ? "bg-[#FF2E9A] text-white shadow-xs"
                        : "border border-border bg-black/40",
                    )}
                  >
                    {verifiedOnly && (
                      <Check
                        className="h-3 w-3 text-white"
                        strokeWidth={3.5}
                      />
                    )}
                  </span>
                </span>
              </button>
            </div>

            {/* Progress Strip */}
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-slate-200" /> Your
                  marked pins
                </span>
                <span className="text-[#FF2E9A]">
                  {verifiedTotal} / {allPOIs.length}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FF2E9A] to-violet-500 transition-all"
                  style={{
                    width: `${(verifiedTotal / Math.max(1, allPOIs.length)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. FLOATING RIGHT POI DETAIL DRAWER ==================== */}
        {selectedPOI && rightDrawerOpen && (
          <div
            role="region"
            aria-label="Map pin details"
            className="absolute right-3 top-3 bottom-3 overflow-y-auto z-30 w-80 max-w-[calc(100%_-_24px)] rounded-2xl border border-border border-t-[3px] border-t-[#FF2E9A] bg-[#070c18]/95 p-5 shadow-2xl  animate-in slide-in-from-right duration-200"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#FF2E9A]/40 bg-[#FF2E9A]/15 text-[#FF2E9A]">
                  <selectedPOI.icon className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="font-display text-sm font-black uppercase text-white truncate max-w-[180px]">
                    {selectedPOI.title}
                  </h2>
                  <p className="text-xs text-muted-foreground font-semibold">
                    {selectedPOI.district}
                  </p>
                  <p className="text-xs font-bold text-[#FF2E9A]">
                    {CATEGORY_FILTERS.find(
                      (f) => f.id === selectedPOI.category,
                    )?.label || selectedPOI.category}
                    {selectedPOI.subcategoryLabel
                      ? ` · ${selectedPOI.subcategoryLabel}`
                      : ""}
                  </p>
                </div>
              </div>
              <button
                ref={detailsCloseRef}
                onClick={closeDetails}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-1 text-muted-foreground hover:text-white hover:bg-muted/50"
                aria-label="Close details"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {selectedPOI.img ? (
              <div className="relative mt-3 h-36 overflow-hidden rounded-xl border border-border bg-black/60 shadow-inner">
                <img
                  src={selectedPOI.img}
                  alt={selectedPOI.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-2 top-2 rounded bg-black/75 px-2 py-0.5 text-xs font-black uppercase tracking-wider text-[#FF2E9A] backdrop-blur border border-border">
                  {selectedPOI.type}
                </span>
              </div>
            ) : null}

            <p className="mt-3 text-xs leading-relaxed text-muted-foreground font-medium">
              {selectedPOI.desc}
            </p>

            {/* Evidence: source, verification, added date */}
            <div className="mt-3 space-y-1.5 rounded-xl border border-border bg-black/40 px-3 py-2.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground font-semibold">
                  Evidence
                </span>
                <span
                  className={cn(
                    "font-bold",
                    selectedPOI.verified
                      ? "text-emerald-400"
                      : "text-slate-300",
                  )}
                >
                  {selectedPOI.verified
                    ? "Source-reviewed field"
                    : selectedPOI.personal
                      ? "Private user pin"
                      : edition === "community"
                        ? "Community placement"
                        : "Fan concept; unverified"}
                </span>
              </div>
              {selectedPOI.source && (
                <div className="flex items-start justify-between gap-2">
                  <span className="text-muted-foreground font-semibold shrink-0">
                    Source
                  </span>
                  <a
                    onClick={() =>
                      trackPublicEvent("evidence_source_open", {
                        surface: "map",
                      })
                    }
                    href={selectedPOI.sourceUrl || "/editorial-policy"}
                    className="text-right font-medium text-white underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedPOI.source}
                  </a>
                </div>
              )}
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground font-semibold">
                  Coordinates
                </span>
                <span className="font-mono text-white/90">
                  x {parseFloat(selectedPOI.left).toFixed(1)} · y{" "}
                  {parseFloat(selectedPOI.top).toFixed(1)}
                </span>
              </div>
              {selectedPOI.addedOn && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground font-semibold">
                    Added
                  </span>
                  <span className="font-mono text-white/90">
                    {selectedPOI.addedOn}
                  </span>
                </div>
              )}
            </div>

            {/* Action buttons: Visited, Center, Favorite, Share */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  const nextState = toggleMapCompleted(selectedPOI.id);
                  setCollectedPOIs((prev) => ({
                    ...prev,
                    [selectedPOI.id]: nextState,
                  }));
                }}
                className={cn(
                  "flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all border",
                  collectedPOIs[selectedPOI.id]
                    ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
                    : "border-slate-700 bg-slate-800 text-white hover:bg-slate-700",
                )}
              >
                <Check className="h-3.5 w-3.5" />
                <span>
                  {collectedPOIs[selectedPOI.id]
                    ? "✓ Found"
                    : "Mark as found"}
                </span>
              </button>

              <button
                onClick={() => focusOnPOI(selectedPOI)}
                className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#FF2E9A] to-violet-500 py-2 text-xs font-black text-white shadow-md hover:brightness-105 transition-all"
              >
                <Navigation className="h-3.5 w-3.5" />
                <span>Center pin</span>
              </button>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  const added = toggleFavorite("locations", selectedPOI.id);
                  setFavoriteLocations((prev) =>
                    added
                      ? [...prev, selectedPOI.id]
                      : prev.filter((id) => id !== selectedPOI.id),
                  );
                }}
                className={cn(
                  "flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all border",
                  favoriteLocations.includes(selectedPOI.id)
                    ? "border-[#FF2E9A]/50 bg-[#FF2E9A]/20 text-[#FF2E9A]"
                    : "border-slate-700 bg-slate-800 text-white hover:bg-slate-700",
                )}
              >
                <Heart
                  className={cn(
                    "h-3.5 w-3.5",
                    favoriteLocations.includes(selectedPOI.id) &&
                      "fill-[#FF2E9A] text-[#FF2E9A]",
                  )}
                />
                <span>
                  {favoriteLocations.includes(selectedPOI.id)
                    ? "Saved"
                    : "Favorite"}
                </span>
              </button>

              <button
                disabled={selectedPOI.personal}
                onClick={async () => {
                  if (typeof window !== "undefined") {
                    const shareUrl = `${window.location.origin}/map?poi=${encodeURIComponent(selectedPOI.id)}${edition === "legacy" ? "&edition=legacy" : ""}${mapStyle !== "community" ? `&style=${mapStyle}` : ""}`;
                    try {
                      await navigator.clipboard.writeText(shareUrl);
                      setCopiedShare(true);
                      setTimeout(() => setCopiedShare(false), 2000);
                    } catch {
                      setCopiedShare(false);
                    }
                  }
                }}
                className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 py-2 text-xs font-bold text-white hover:bg-slate-700 transition-all"
              >
                {copiedShare ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>
                  {selectedPOI.personal
                    ? "Private pin"
                    : copiedShare
                      ? "Copied!"
                      : "Share Link"}
                </span>
              </button>
            </div>

            {/* Personal Notes Section */}
            <div className="mt-4 pt-3 border-t border-border">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                <FileText className="h-3 w-3 text-[#FF2E9A]" />
                <span>Personal Field Notes</span>
              </div>
              <textarea
                maxLength={5000}
                aria-label="Personal notes for this pin"
                value={userNotes[selectedPOI.id] || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setUserNotes((prev) => ({ ...prev, [selectedPOI.id]: val }));
                  setMapNote(selectedPOI.id, val);
                }}
                placeholder="Add a private planning note…"
                rows={2}
                className="w-full rounded-xl border border-border bg-black/50 p-2 text-xs text-white placeholder:text-muted-foreground focus:border-[#FF2E9A]/50 focus:outline-none focus:ring-1 focus:ring-[#FF2E9A]/30 resize-none font-sans"
              />
              {selectedPOI.personal && (
                <button
                  className="player-button mt-3 text-rose-200"
                  onClick={() => {
                    if (
                      !window.confirm("Delete this private pin and its note?")
                    )
                      return;
                    const current = getStoredUserState();
                    const { [selectedPOI.id]: removed, ...mapNotes } =
                      current.mapNotes;
                    saveStoredUserState({
                      ...current,
                      personalMarkers: current.personalMarkers.filter(
                        (marker) => marker.id !== selectedPOI.id,
                      ),
                      mapNotes,
                      mapCompletedIds: current.mapCompletedIds.filter(
                        (id) => id !== selectedPOI.id,
                      ),
                      favorites: {
                        ...current.favorites,
                        locations: current.favorites.locations.filter(
                          (id) => id !== selectedPOI.id,
                        ),
                      },
                    });
                    setSelectedPOI(null);
                    setRightDrawerOpen(false);
                  }}
                >
                  Delete private pin
                </button>
              )}
            </div>
          </div>
        )}

        {/* ==================== 2b. MAP STYLE SWITCHER ==================== */}
        {/* Floating only while the filter panel is closed; when the panel
            is open the switcher lives inside it (see the panel section). */}
        {edition === "community" && !leftSidebarOpen && (
          <div
            className="absolute left-3 top-3 z-20 flex rounded-xl border border-border bg-black/80 p-1 shadow-2xl backdrop-blur-md"
            role="group"
            aria-label="Map style"
          >
            {MAP_STYLE_OPTIONS.map((s) => {
              const SIcon = s.icon;
              const active = mapStyle === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setMapStyle(s.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-bold transition-all",
                    active
                      ? "bg-[#FF2E9A] text-white shadow"
                      : "text-muted-foreground hover:text-white",
                  )}
                >
                  <SIcon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ==================== 3. FLOATING TOP HUD CONTROLS ==================== */}
        {edition === "community" && mapStyle === "official" && (
          <div className={cn(
            "pointer-events-none absolute left-0 right-0 top-14 z-20 flex justify-center px-4",
            leftSidebarOpen && "lg:left-[300px]",
          )}>
            <p className="rounded-xl border border-border bg-black/80 px-3 py-1.5 text-xs font-bold text-[#FF2E9A] shadow-2xl backdrop-blur-md">
              Official Rockstar map — pins are positioned on the Community
              map, so they are hidden here.
            </p>
          </div>
        )}
        <div className={cn(
          "pointer-events-none absolute left-0 right-0 top-3 z-20 flex justify-center px-4",
          leftSidebarOpen && "lg:left-[300px]",
        )}>
          <div className="pointer-events-auto flex max-w-full items-center gap-2 whitespace-nowrap rounded-2xl border border-border bg-black/80 px-3.5 py-1.5 shadow-2xl backdrop-blur-md">
            <span className="flex h-2 w-2 shrink-0 rounded-full bg-[#FF2E9A] " />
            <span className="text-xs font-mono text-muted-foreground font-bold">
              Fan map
              <span className="hidden min-[420px]:inline">
                {" "}
                · coordinates unverified
              </span>
            </span>
            <span className="h-3 w-px bg-muted/60" />
            <span className="text-xs font-mono text-white font-bold">
              ZOOM: {Math.round(zoom * 100)}%
            </span>
            {is3D && (
              <>
                <span className="h-3 w-px bg-muted/60" />
                <span className="text-xs font-mono font-bold text-[#FF2E9A]">
                  3D
                </span>
              </>
            )}
          </div>
        </div>

        {/* ==================== 4. THE INTERACTIVE PAN/ZOOM CANVAS ==================== */}
        <div
          ref={viewportRef}
          tabIndex={0}
          role="region"
          aria-label="Map canvas. Arrow keys pan, plus and minus zoom, zero resets, 3 toggles the 3D view. Focus the map or hold Control to zoom with the mouse wheel."
          style={{
            touchAction: "none",
            scrollMarginTop: "80px",
            // Taish Tilt: the perspective lives on the viewport so the
            // tilt wrapper below leans the map plane back around the
            // visible-rect centre. No perspective in 2D — the map is
            // exactly today's map.
            perspective: is3D ? `${PERSPECTIVE}px` : "none",
            perspectiveOrigin: `${tiltOrigin.x}px ${tiltOrigin.y}px`,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={cn(
            // Ocean background: the canvas never covers the whole frame
            // (it is centred on the island), so any uncovered strip reads
            // as ocean, not the frame's near-black. Matches the tile
            // ocean / margin-mask colour.
            "relative h-full w-full overflow-hidden select-none bg-[#2C66A5]",
            isDragging ? "cursor-grabbing" : "cursor-grab",
          )}
        >
          {/* Taish Tilt wrapper — the 3D tilt lives HERE, not on the
              canvas: drags write the canvas transform directly every
              frame (queuePan), so a tilt on the canvas would fight
              every drag. The wrapper is viewport-sized, pivots on the
              visible-rect centre, and carries preserve-3d so the pins
              inside the canvas can counter-rotate upright. The LCP
              preview and filter panel sit OUTSIDE this wrapper (siblings
              of the viewport), so they never tilt. */}
          <div
            className="absolute inset-0"
            style={{
              transform: is3D ? `rotateX(${TILT_DEG}deg)` : "rotateX(0deg)",
              transformOrigin: `${tiltOrigin.x}px ${tiltOrigin.y}px`,
              transformStyle: "preserve-3d",
              transition: tiltAnimating ? "transform 400ms ease" : "none",
            }}
          >
            {/* Scaled / Panned Coordinate Container */}
            <div
              ref={canvasRef}
              className="absolute origin-top-left will-change-transform"
              style={{
                width: `${CANVAS_W}px`,
                height: `${CANVAS_H}px`,
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformStyle: "preserve-3d",
              }}
            >
            {/* The Real Satellite Map Image */}
            {edition === "community" ? (
              <CommunityMapTiles
                zoom={zoom}
                pan={pan}
                viewport={viewportSize}
                mode={mapMode}
                base={mapStyle}
              />
            ) : (
              <Image
                width={1400}
                height={1050}
                sizes={
                  zoom > 1.5 ? "1400px" : "(max-width: 640px) 600px, 1400px"
                }
                quality={65}
                fetchPriority="high"
                priority
                src="/img/leonida-map-v2.jpg"
                alt="Original planning illustration; geography and pin coordinates unverified"
                draggable={false}
                className={cn(
                  "h-full w-full object-cover select-none pointer-events-none transition-all duration-300",
                  mapMode === "tactical" &&
                    "invert hue-rotate-180 brightness-90 saturate-200 contrast-125",
                  mapMode === "radar" &&
                    "filter contrast-150 brightness-75 sepia hue-rotate-[130deg] saturate-[3]",
                )}
              />
            )}

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

            {/* Interactive POI Pins — hidden on the official base: Rockstar's
                map does not align with the community pin coordinates, so
                showing pins there would place them in the wrong place. */}
            {mapStyle !== "official" &&
              clusters.map((cluster) => {
              const m = cluster.members[0];
              if (cluster.members.length > 1)
                return (
                  <button
                    key={`cluster:${cluster.key}`}
                    aria-label={`Explore cluster of ${cluster.members.length} locations`}
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#FF2E9A] text-white h-11 min-w-11 px-2 font-bold shadow-xl"
                    style={{
                      top: `${cluster.top}%`,
                      left: `${cluster.left}%`,
                      // In 3D the badge counter-rotates so it stays
                      // upright while its position follows the tilted plane.
                      transform: `translate(-50%, -50%) scale(${1 / zoom})${is3D ? ` rotateX(${-TILT_DEG}deg)` : ""}`,
                    }}
                    onMouseDown={(event) => event.stopPropagation()}
                    onTouchStart={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      hasInteractedRef.current = true;
                      setClusterMembers(cluster.members);
                      setRightDrawerOpen(false);
                      const next = Math.min(6, zoom * 1.8);
                      setZoom(next);
                      const rect = visibleMapRect();
                      const centerX = rect
                        ? (rect.left + rect.right) / 2
                        : viewportSize.width / 2;
                      const centerY = rect
                        ? (rect.top + rect.bottom) / 2
                        : viewportSize.height / 2;
                      setPan({
                        x:
                          centerX -
                          (cluster.left / 100) * CANVAS_W * next,
                        y:
                          centerY -
                          (cluster.top / 100) * CANVAS_H * next,
                      });
                    }}
                  >
                    {cluster.members.length}
                  </button>
                );
              const isSelected = selectedPOI?.id === m.id;
              const isCollected = collectedPOIs[m.id];
              const Icon = m.icon;

              return (
                <button
                  key={m.id}
                  onMouseDown={(event) => event.stopPropagation()}
                  onTouchStart={(event) => event.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    focusOnPOI(m);
                  }}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group focus-visible:outline focus-visible:outline-4 focus-visible:outline-cyan-300 transition-transform"
                  style={{
                    top: m.top,
                    left: m.left,
                    // In 3D the icon counter-rotates so it stays upright
                    // while its position follows the tilted plane. The
                    // tooltip lives inside the button, so it stays
                    // upright too.
                    transform: `translate(-50%, -50%) scale(${1 / zoom})${is3D ? ` rotateX(${-TILT_DEG}deg)` : ""}`,
                  }}
                  aria-label={m.title}
                >
                  {/* Selected outline */}
                  {isSelected && (
                    <span className="absolute -inset-2 rounded-lg border-2 border-[#FF2E9A] bg-[#FF2E9A]/20" />
                  )}

                  {/* Bare pictogram: large white icon with a thick dark halo
                      for contrast on any base map. No coloured disc. A
                      marked (found) pin turns emerald. */}
                  <span
                    className={cn(
                      "flex items-center justify-center transition-all",
                      isCollected ? "text-emerald-400" : "text-white",
                      isSelected && "text-[#FF2E9A]",
                    )}
                    style={{
                      filter:
                        "drop-shadow(0 0 5px rgba(0,0,0,1)) drop-shadow(0 2px 4px rgba(0,0,0,0.95))",
                    }}
                  >
                    <Icon
                      style={{ width: iconPx, height: iconPx }}
                      strokeWidth={3}
                    />
                  </span>

                  {/* Tooltip on Hover */}
                  <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 max-w-[70vw] whitespace-normal text-center rounded-lg bg-black/90 px-2.5 py-1 text-xs font-bold text-white opacity-0 shadow-2xl backdrop-blur-md border border-border group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity z-30">
                    <span className="text-[#FF2E9A] block font-black">
                      {m.title}
                    </span>
                    <span className="text-muted-foreground font-medium text-xs">
                      {m.district}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          </div>
        </div>

        {!!clusterMembers.length && (
          <section
            aria-label="Locations in selected cluster"
            className={`dark-panel ${mapStyles.darkSurface} absolute bottom-3 left-3 z-30 max-h-60 w-80 max-w-[calc(100%_-_88px)] overflow-y-auto rounded-xl border border-border p-3 shadow-2xl`}
          >
            <div className="flex justify-between items-center gap-3">
              <h3 className="font-bold text-sm">
                {clusterMembers.length} nearby community pins
              </h3>
              <button
                autoFocus
                aria-label="Close cluster list"
                className="min-h-11 min-w-11"
                onClick={() => setClusterMembers([])}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {clusterMembers.slice(0, 100).map((poi) => (
              <button
                key={poi.id}
                className="block min-h-11 w-full border-t border-border py-2 text-left text-sm"
                onClick={() => focusOnPOI(poi)}
              >
                {poi.title}
              </button>
            ))}
            {clusterMembers.length > 100 && (
              <p className="text-xs">
                Showing the first 100. Zoom further or search to narrow these
                results.
              </p>
            )}
          </section>
        )}
        {/* ==================== 5. BOTTOM RIGHT ZOOM & HUD CONTROLS ==================== */}
        <div className="absolute right-4 bottom-4 z-20 flex flex-col gap-2">
          {/* 3D View Toggle ("Taish Tilt") — hidden where preserve-3d
              is unsupported. Same 44×44 styling as the grid toggle. */}
          {supports3D && (
            <button
              onClick={toggle3D}
              aria-pressed={is3D}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl border  shadow-2xl transition-all",
                is3D
                  ? "border-[#FF2E9A] bg-[#FF2E9A]/20 text-[#FF2E9A]"
                  : "border-border bg-black/80 text-white hover:bg-muted/60",
              )}
              title={is3D ? "2D view" : "3D view"}
            >
              <Box className="h-4 w-4" />
            </button>
          )}

          {/* Tactical Grid Toggle */}
          <button
            onClick={() => setShowGrid((v) => !v)}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl border  shadow-2xl transition-all",
              showGrid
                ? "border-[#FF2E9A] bg-[#FF2E9A]/20 text-[#FF2E9A]"
                : "border-border bg-black/80 text-white hover:bg-muted/60",
            )}
            title="Toggle Tactical Grid"
          >
            <Compass className="h-4 w-4" />
          </button>

          {/* Zoom Buttons */}
          <div className="flex flex-col gap-1 rounded-xl border border-border bg-black/80 p-1.5  shadow-2xl">
            <button
              onClick={() => zoomAround(zoom * 1.25)}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-white hover:bg-muted/60 transition-colors"
              title="Zoom In"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              onClick={() => zoomAround(zoom * 0.8)}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-white hover:bg-muted/60 transition-colors"
              title="Zoom Out"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              onClick={() => centerMap()}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-white hover:bg-muted/60 transition-colors"
              title="Reset Center"
            >
              <LocateFixed className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ==================== 6. BOTTOM LEFT COMPASS & HINT ==================== */}
        <div className="absolute left-4 bottom-4 z-20 flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-black/80 px-3 py-1.5  shadow-2xl">
            <span className="font-display text-xs font-black text-[#FF2E9A] tracking-wider">
              N ▲
            </span>
            <span className="hidden min-[420px]:inline text-xs text-muted-foreground font-medium">
              Click &amp; Drag to Pan • +/- to Zoom
            </span>
          </div>
        </div>
      </div>

      {!isFullscreen && (
        <details
          className="mt-5 rounded-xl border border-border bg-card p-4"
          onToggle={(event) => setTextListOpen(event.currentTarget.open)}
        >
          <summary className="cursor-pointer min-h-11 font-bold">
            Browse {visiblePOIs.length} visible pins as a text list
          </summary>
          <p className="my-3 text-sm text-muted-foreground">
            Community reconstructions and original planning pins are not
            official coordinates. The list shows the first 100 search matches.
            Your marks and notes are kept in your workspace; signed-in accounts
            sync through the account connection.
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {(textListOpen ? visiblePOIs.slice(0, 100) : []).map((poi) => (
              <li key={poi.id}>
                <button
                  type="button"
                  className="min-h-11 w-full rounded-lg border border-border p-3 text-left focus-visible:outline focus-visible:outline-2"
                  onClick={() => {
                    focusOnPOI(poi);
                    containerRef.current?.scrollIntoView({
                      block: "start",
                      behavior: "auto",
                    });
                  }}
                >
                  {poi.title} · {poi.district}{" "}
                  <span className="block text-xs text-muted-foreground">
                    {poi.personal
                      ? "Private planning pin"
                      : edition === "community"
                        ? "Community placement; unverified"
                        : "Fan concept; unverified"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {!visiblePOIs.length && (
            <p role="status" className="py-3">
              No pins match. Clear the search, select all categories or turn off
              the source-link filter.
            </p>
          )}
          <Link
            className="mt-3 inline-block underline"
            href="/editorial-policy"
          >
            How evidence is reviewed
          </Link>
        </details>
      )}
    </div>
  );
}
