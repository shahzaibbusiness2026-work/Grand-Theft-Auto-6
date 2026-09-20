"use client";

import { useState, useEffect, useMemo, useTransition } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Trophy,
  Sparkles,
  RotateCcw,
  Search,
  Download,
  Upload,
  BookOpen,
  MapPin,
  Car,
  Crosshair,
  Building2,
  HelpCircle,
  FileEdit,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  Flame,
  Radio,
  Compass,
} from "lucide-react";
import { Donut } from "@/components/ui/donut";
import { Progress } from "@/components/ui/progress";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { cn } from "@/lib/utils";
import {
  getStoredUserState,
  saveStoredUserState,
  toggleTrackerItem,
  type UserState,
} from "@/lib/user-store";

export interface TrackerMilestone {
  id: string;
  category:
    | "Story Missions"
    | "Strangers & Freaks"
    | "Collectibles"
    | "Hobbies & Pastimes"
    | "Random Events"
    | "Miscellaneous"
    | "Properties & Businesses"
    | "Weapon Masteries"
    | "Vehicle Collections"
    | "Map Exploration"
    | "Trophies & Achievements";
  title: string;
  district: string;
  description: string;
  reward: string;
  confidence: "OFFICIAL" | "CONFIRMED" | "REPORTED" | "RUMORED" | "SPECULATION";
  source: string;
  mapPoiId?: string;
}

export const TRACKER_CATEGORIES = [
  "All",
  "Story Missions",
  "Strangers & Freaks",
  "Collectibles",
  "Hobbies & Pastimes",
  "Random Events",
  "Miscellaneous",
  "Properties & Businesses",
  "Weapon Masteries",
  "Vehicle Collections",
  "Map Exploration",
  "Trophies & Achievements",
] as const;

export const MILESTONES: TrackerMilestone[] = [
  // 1. Story Missions
  {
    id: "m-1",
    category: "Story Missions",
    title: "01: Welcome to Leonida (Lucia Parole)",
    district: "Vice City",
    description: "Lucia is released on probation into the buzzing streets of neon Vice City. Establish first contact with Jason.",
    reward: "$2,500 + Starter Safehouse",
    confidence: "OFFICIAL",
    source: "Trailer 1 & Official Announcement",
  },
  {
    id: "m-2",
    category: "Story Missions",
    title: "02: Vice Bodega Stickup & Dash",
    district: "Ocean Beach",
    description: "Execute the convenience store holdup featured in Trailer 1. Evade VCPD cruiser perimeter.",
    reward: "$4,800 + High Rep",
    confidence: "OFFICIAL",
    source: "Trailer 1 Shot 32",
    mapPoiId: "poi-ocean-drive",
  },
  {
    id: "m-3",
    category: "Story Missions",
    title: "03: Keys Depository Vault Crack",
    district: "Leonida Keys",
    description: "Infiltrate the Keys Credit Union vault during hurricane high-tide via wet submersible equipment.",
    reward: "$450,000 heist cut",
    confidence: "CONFIRMED",
    source: "September 2022 Leaks — 'Bank Heist Script'",
    mapPoiId: "poi-keys",
  },
  {
    id: "m-4",
    category: "Story Missions",
    title: "04: Port Gellhorn Cargo Exchange",
    district: "Port Gellhorn",
    description: "Rendezvous with shipping brokers at the container terminal. Survive ambush by rival smuggler syndicates.",
    reward: "$22,000 + Harbor Access",
    confidence: "CONFIRMED",
    source: "September 2022 Leaks — Port Gellhorn Docks",
    mapPoiId: "poi-gellhorn",
  },
  {
    id: "m-5",
    category: "Story Missions",
    title: "05: Starfish Island Kingpin Estate",
    district: "Starfish Island",
    description: "Infiltrate a fortified mansion estate, breach biometric security, and extract encrypted cartel ledger.",
    reward: "$120,000 + Luxury Supercar",
    confidence: "CONFIRMED",
    source: "September 2022 Leaks & Trailer 1",
    mapPoiId: "poi-starfish",
  },

  // 2. Strangers & Freaks
  {
    id: "sf-1",
    category: "Strangers & Freaks",
    title: "Bounty: The Everglades Gator Poacher",
    district: "Grassrivers",
    description: "Track rogue wildlife traffickers operating illicit skin-trading camps deep in the murky swamps.",
    reward: "$7,500 + Custom Hunting Rifle skin",
    confidence: "CONFIRMED",
    source: "September 2022 Leaks — Wildlife Event",
    mapPoiId: "poi-grassrivers",
  },
  {
    id: "sf-2",
    category: "Strangers & Freaks",
    title: "Leonida Eccentrics: The Mud Club",
    district: "Leonida Wetlands",
    description: "Compete in off-road monster truck obstacle courses against Leonida's infamous Thrillbilly mud-bogging crew.",
    reward: "Cheval Marshall Truck + $5,000",
    confidence: "OFFICIAL",
    source: "Trailer 1 Mud Club Scene",
  },
  {
    id: "sf-3",
    category: "Strangers & Freaks",
    title: "Corrupt Port Gellhorn Inspector Holdup",
    district: "Port Gellhorn",
    description: "Blackmail or intimidate port authorities refusing to clear offshore container shipments.",
    reward: "$14,000 + Dock Cut %",
    confidence: "CONFIRMED",
    source: "September 2022 Leaks — Harbor Script",
    mapPoiId: "poi-gellhorn",
  },

  // 3. Collectibles
  {
    id: "col-1",
    category: "Collectibles",
    title: "Recover 25 Submerged Contraband Caches",
    district: "Biscayne Bay & Offshore",
    description: "Use scuba gear and submersibles to dredge sunken smuggling cargo crates littered along coastal reefs.",
    reward: "$250,000 total + Scuba Wet-Suit",
    confidence: "CONFIRMED",
    source: "Canonical Collectible Tracker",
    mapPoiId: "poi-ocean-drive",
  },
  {
    id: "col-2",
    category: "Collectibles",
    title: "Snap 20 Rare Leonida Wildlife Encounters",
    district: "Leonida Wilderness",
    description: "Photograph American Alligators, Pink Flamingos, Florida Panthers, and Wild Boars in natural habitats.",
    reward: "Safari Camo Outfit + Wildlife Trophy",
    confidence: "OFFICIAL",
    source: "Trailer 1 Fauna Footage",
    mapPoiId: "poi-grassrivers",
  },
  {
    id: "col-3",
    category: "Collectibles",
    title: "Hack 15 Pirate Radio Broadcast Antennas",
    district: "All Districts",
    description: "Climb broadcast masts across Vice City and the Keys to transmit pirate station feeds and unlock secret tunes.",
    reward: "Secret Radio Station Unlocked",
    confidence: "CONFIRMED",
    source: "September 2022 Leaks — Radio Masts",
  },
  {
    id: "col-4",
    category: "Collectibles",
    title: "Locate 30 Golden Vice Flamingos",
    district: "Vice City Metro",
    description: "Hidden brass flamingo statues placed in historic art-deco rooftops, motel courtyards, and neon corridors.",
    reward: "$100,000 + Golden Pistol Skin",
    confidence: "SPECULATION",
    source: "Community Landmark Mapping",
  },

  // 4. Hobbies & Pastimes
  {
    id: "hp-1",
    category: "Hobbies & Pastimes",
    title: "South Beach Midnight Street Race Circuit",
    district: "Ocean Drive",
    description: "Win all 5 sanctioned and unsanctioned street races down illuminated palm tree boulevards.",
    reward: "Custom Grotti Furia Upgrade Kit",
    confidence: "OFFICIAL",
    source: "Trailer 1 Night Strip Footage",
    mapPoiId: "poi-ocean-drive",
  },
  {
    id: "hp-2",
    category: "Hobbies & Pastimes",
    title: "Ammu-Nation Subterranean Shooting Range",
    district: "Downtown Vice",
    description: "Attain Gold Medals in all 6 firearm categories (Pistol, SMG, AR, Shotgun, Sniper, Heavy).",
    reward: "15% Weapon Store Discount + Fast Reload Perk",
    confidence: "CONFIRMED",
    source: "September 2022 Leaks — Weapon Range",
    mapPoiId: "poi-ammu",
  },
  {
    id: "hp-3",
    category: "Hobbies & Pastimes",
    title: "Deep Sea Marlin & Shark Trophy Fishing",
    district: "Leonida Keys Outer Waters",
    description: "Charter sport fishing boats and haul in record-breaking gamefish using manual spool tension reels.",
    reward: "Angler Yacht Trophy + Fishing Apparel",
    confidence: "CONFIRMED",
    source: "September 2022 Leaks — Fishing Minigame",
    mapPoiId: "poi-keys",
  },
  {
    id: "hp-4",
    category: "Hobbies & Pastimes",
    title: "Everglades Fanboat High-Speed Obstacle Runs",
    district: "Grassrivers",
    description: "Navigate narrow swamp channels at breakneck speeds while clearing ramps and avoiding submerged obstacles.",
    reward: "Special Fanboat Vehicle Unlock",
    confidence: "OFFICIAL",
    source: "Trailer 1 Airboat Scene",
    mapPoiId: "poi-grassrivers",
  },

  // 5. Random Events
  {
    id: "re-1",
    category: "Random Events",
    title: "Highway Armored Securicar Interceptions",
    district: "All Interstates",
    description: "Ambush Gruppe Sechs armored transports on interstates using sticky explosives and tactical spike strips.",
    reward: "$40,000–$80,000 cash per heist",
    confidence: "CONFIRMED",
    source: "September 2022 Leaks — World Events",
  },
  {
    id: "re-2",
    category: "Random Events",
    title: "Gas Station & 24/7 Supermarket Holdups",
    district: "Statewide",
    description: "Rob 10 convenience stores at gunpoint, demand register bags, and shake down safes before squad cars respond.",
    reward: "$1,200–$3,500 cash per store",
    confidence: "OFFICIAL",
    source: "Trailer 1 Lucia/Jason Robbery",
  },
  {
    id: "re-3",
    category: "Random Events",
    title: "Assist Stranded Cartel Drivers",
    district: "Leonida Keys Bridges",
    description: "Escort broken-down smuggling vehicles past State Trooper checkpoints for generous cash kickbacks.",
    reward: "$5,000 + Cartel Safehouse access",
    confidence: "REPORTED",
    source: "Leaked World Event Scripts",
  },

  // 6. Miscellaneous
  {
    id: "mis-1",
    category: "Miscellaneous",
    title: "Complete 25 Stunt Jumps",
    district: "All Districts",
    description: "Launch sports vehicles off billboard ramps, collapsed highway overpasses, and beach dune jumps.",
    reward: "100% Stunt Driver Trophy",
    confidence: "CONFIRMED",
    source: "Canonical Series Staple",
  },
  {
    id: "mis-2",
    category: "Miscellaneous",
    title: "Fly Under 15 Leonida Bridges",
    district: "Waterways & Causeways",
    description: "Pilot fixed-wing aircraft or Maverick helicopters beneath low-clearance bridges connecting Vice City and Keys.",
    reward: "Ace Aviator Title + Aircraft Discount",
    confidence: "CONFIRMED",
    source: "Canonical Series Staple",
  },
  {
    id: "mis-3",
    category: "Miscellaneous",
    title: "Upgrade 10 Vehicles to Max Performance",
    district: "Downtown Vice Mod Shop",
    description: "Equip level 4 turbo, race transmission, titanium brakes, and bulletproof tires at Vice Customs.",
    reward: "Master Mechanic Perk (-25% mod costs)",
    confidence: "CONFIRMED",
    source: "Trailer 1 Customs Garage",
    mapPoiId: "poi-garage",
  },

  // 7. Properties & Businesses
  {
    id: "pb-1",
    category: "Properties & Businesses",
    title: "Acquire & Renovate Malibu Nightclub",
    district: "Ocean Drive",
    description: "Purchase Vice City's premier neon dance venue, hire top DJs, manage security, and collect passive revenue.",
    reward: "$18,500 / day passive profit",
    confidence: "CONFIRMED",
    source: "Canonical Property Database",
    mapPoiId: "poi-ocean-drive",
  },
  {
    id: "pb-2",
    category: "Properties & Businesses",
    title: "Acquire Keys Marina & Speedboat Docks",
    district: "Leonida Keys",
    description: "Control luxury charter docks, boat repair bays, and offshore fueling points for tourist and smuggler traffic.",
    reward: "$12,000 / day passive profit",
    confidence: "CONFIRMED",
    source: "Canonical Property Database",
    mapPoiId: "poi-keys",
  },
  {
    id: "pb-3",
    category: "Properties & Businesses",
    title: "Establish Little Haiti Chop Shop Operation",
    district: "Little Haiti",
    description: "High-volume vehicle dismantling facility stripping stolen sports cars and exporting crated parts to South America.",
    reward: "$28,000 / day active profit",
    confidence: "CONFIRMED",
    source: "Canonical Property Database",
  },

  // 8. Weapon Masteries
  {
    id: "wm-1",
    category: "Weapon Masteries",
    title: "M4 Carbine: 500 Tactical Eliminations",
    district: "Statewide",
    description: "Achieve 500 enemy eliminations with M4 Carbine including 150 headshots and 50 vehicle drive-by downs.",
    reward: "Extended 60-Round Drum Mag + Gold Finish",
    confidence: "CONFIRMED",
    source: "Canonical Armory Progression",
  },
  {
    id: "wm-2",
    category: "Weapon Masteries",
    title: "Heavy Sniper Marksmanship: 100 Long-Range Hits",
    district: "Statewide",
    description: "Down targets at ranges exceeding 200 meters using thermal optics and armor-piercing cartridges.",
    reward: "Variable 16x Rangefinder Scope",
    confidence: "CONFIRMED",
    source: "Canonical Armory Progression",
  },
  {
    id: "wm-3",
    category: "Weapon Masteries",
    title: "Glock 21 CQC Master: 200 Point-Blank Kills",
    district: "Statewide",
    description: "Demonstrate handgun mastery with quick-draw combat kills within 5 meters.",
    reward: "Dual-Wield Holster Unlocked",
    confidence: "REPORTED",
    source: "September 2022 Leaks — Dual-Wield Animations",
  },

  // 9. Vehicle Collections
  {
    id: "vc-1",
    category: "Vehicle Collections",
    title: "Collect All 10 Verified Supercars",
    district: "Vice City Luxury Showrooms",
    description: "Store Grotti Visione, Bravado Banshee GTS, Pegassi Infernus, and 7 other verified exotics in your garages.",
    reward: "Apex Collector Garage Space + Neon Trophy",
    confidence: "CONFIRMED",
    source: "Canonical Vehicle Registry",
  },
  {
    id: "vc-2",
    category: "Vehicle Collections",
    title: "Clock 160+ MPH in 5 Speed Traps",
    district: "Highways & Expressways",
    description: "Trigger radar cameras down Ocean Drive, Port Gellhorn Interstate, and Leonida Keys Causeway at terminal velocity.",
    reward: "$20,000 + Nitro Boost Tuning Option",
    confidence: "REPORTED",
    source: "Leaked Radar Scripts",
  },

  // 10. Map Exploration
  {
    id: "me-1",
    category: "Map Exploration",
    title: "Clear 100% Fog of War Across Leonida",
    district: "Full State of Leonida",
    description: "Travel by air, boat, and road to uncover every square kilometer of Vice City, Port Gellhorn, and the Keys.",
    reward: "Complete Topographical Satellite Overlay",
    confidence: "CONFIRMED",
    source: "Standard Open-World Discovery Mechanics",
  },
  {
    id: "me-2",
    category: "Map Exploration",
    title: "Discover All 24 Canonical Points of Interest",
    district: "Statewide",
    description: "Locate and log every major landmark, nightclub, gun store, hospital, harbor, and hidden facility on your map.",
    reward: "Map Master Ribbon + Instant Fast Travel Points",
    confidence: "CONFIRMED",
    source: "Canonical Map POI Database",
  },

  // 11. Trophies & Achievements
  {
    id: "ta-1",
    category: "Trophies & Achievements",
    title: "Platinum: The Leonida Syndicate Kingpin",
    district: "All Leonida",
    description: "Earn 100% completion checklist across all missions, collectibles, businesses, and mastery challenges.",
    reward: "Ultimate Platinum Trophy + Special Ending Cutscene",
    confidence: "OFFICIAL",
    source: "Rockstar 100% Completion Tradition",
  },
  {
    id: "ta-2",
    category: "Trophies & Achievements",
    title: "Achievement: Bonnie & Clyde Moderno",
    district: "Statewide",
    description: "Perform 15 co-op sync maneuvers or switch between Lucia and Jason during high-heat 5-star police chases.",
    reward: "Gamerscore / Gold PSN Trophy",
    confidence: "OFFICIAL",
    source: "Trailer 1 Focus on Duo Dynamic",
  },
  {
    id: "ta-3",
    category: "Trophies & Achievements",
    title: "Achievement: Keys Money Launderer",
    district: "Leonida Keys",
    description: "Accumulate and bank over $10,000,000 in clean business profits without sustaining an asset freeze.",
    reward: "Golden Offshore Offshore Account Trophy",
    confidence: "CONFIRMED",
    source: "Canonical Financial Engine",
  },
];

export function TrackerClient() {
  const [userState, setUserState] = useState<UserState | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending">("all");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  // Load and sync user state
  useEffect(() => {
    setUserState(getStoredUserState());

    const handleSync = () => {
      setUserState(getStoredUserState());
    };

    window.addEventListener("gta6_user_state_change", handleSync);
    return () => window.removeEventListener("gta6_user_state_change", handleSync);
  }, []);

  const completedIds = useMemo(() => {
    return userState?.tracker.completedIds || [];
  }, [userState]);

  const personalNotes = useMemo(() => {
    return userState?.tracker.notes || {};
  }, [userState]);

  // Overall Completion Calculations
  const totalMilestones = MILESTONES.length;
  const totalCompleted = useMemo(() => {
    return MILESTONES.filter((m) => completedIds.includes(m.id)).length;
  }, [completedIds]);

  const overallPercent = Math.round((totalCompleted / (totalMilestones || 1)) * 100);

  // Category-specific stats
  const categoryStats = useMemo(() => {
    const map: Record<string, { total: number; completed: number; percent: number }> = {};
    for (const cat of TRACKER_CATEGORIES) {
      if (cat === "All") continue;
      const catItems = MILESTONES.filter((m) => m.category === cat);
      const done = catItems.filter((m) => completedIds.includes(m.id)).length;
      map[cat] = {
        total: catItems.length,
        completed: done,
        percent: Math.round((done / (catItems.length || 1)) * 100),
      };
    }
    return map;
  }, [completedIds]);

  // Filtered Milestones
  const filteredMilestones = useMemo(() => {
    return MILESTONES.filter((item) => {
      // Category filter
      if (selectedCategory !== "All" && item.category !== selectedCategory) {
        return false;
      }
      // Status filter
      const isDone = completedIds.includes(item.id);
      if (filterStatus === "completed" && !isDone) return false;
      if (filterStatus === "pending" && isDone) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDistrict = item.district.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchReward = item.reward.toLowerCase().includes(q);
        const matchNote = (personalNotes[item.id] || "").toLowerCase().includes(q);
        return matchTitle || matchDistrict || matchDesc || matchReward || matchNote;
      }

      return true;
    });
  }, [selectedCategory, filterStatus, searchQuery, completedIds, personalNotes]);

  // Actions
  const handleToggle = (id: string) => {
    toggleTrackerItem(id);
  };

  const handleSaveNote = (id: string) => {
    if (!userState) return;
    const current = { ...userState };
    if (!current.tracker.notes) current.tracker.notes = {};
    if (noteText.trim()) {
      current.tracker.notes[id] = noteText.trim();
    } else {
      delete current.tracker.notes[id];
    }
    saveStoredUserState(current);
    setEditingNoteId(null);
  };

  const handleResetAll = () => {
    if (!confirm("Are you sure you want to reset all checklist progress? Your saved personal notes will be preserved.")) {
      return;
    }
    if (!userState) return;
    const current = { ...userState };
    current.tracker.completedIds = [];
    saveStoredUserState(current);
  };

  const handleExportJSON = () => {
    if (!userState) return;
    const payload = {
      version: "1.0",
      app: "GTA 6 Atlas 100% Completion Tracker",
      exportedAt: new Date().toISOString(),
      stats: {
        total: totalMilestones,
        completed: totalCompleted,
        percent: overallPercent,
      },
      completedIds: userState.tracker.completedIds,
      notes: userState.tracker.notes,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gta6-atlas-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed && Array.isArray(parsed.completedIds)) {
          if (!userState) return;
          const current = { ...userState };
          current.tracker.completedIds = Array.from(new Set([...current.tracker.completedIds, ...parsed.completedIds]));
          if (parsed.notes && typeof parsed.notes === "object") {
            current.tracker.notes = { ...current.tracker.notes, ...parsed.notes };
          }
          saveStoredUserState(current);
          alert(`Success! Restored ${parsed.completedIds.length} completed checklist items.`);
        } else {
          alert("Invalid backup file format. Expected a valid GTA 6 Atlas JSON export.");
        }
      } catch (err) {
        alert("Failed to parse the backup JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-8">
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Progress Donut */}
        <div className="card-carbon p-6 flex flex-col sm:flex-row items-center gap-6 border-accent/30">
          <div className="relative flex-shrink-0">
            <Donut value={overallPercent} size={130} strokeWidth={12} color="var(--primary)" />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-display text-3xl font-black text-foreground">{overallPercent}%</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total</span>
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <Trophy className="h-5 w-5 text-amber-500 dark:text-amber-400" />
              <h2 className="font-display text-lg font-bold text-foreground uppercase tracking-wide">
                100% Leonida Completion
              </h2>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              Track all story milestones, submerged caches, high-stakes robberies, and pastimes across Leonida.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-4 text-xs font-mono">
              <span className="text-primary font-bold">{totalCompleted} Done</span>
              <span className="text-muted-foreground/60">/</span>
              <span className="text-muted-foreground">{totalMilestones} Total Items</span>
            </div>
          </div>
        </div>

        {/* Quick Action Controls */}
        <div className="card-carbon p-6 flex flex-col justify-between border-primary/20">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Data Sync & Backup
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">Local Auto-Save</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your tracker is securely persisted in your browser. Export anytime to back up or transfer between devices.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
            <button
              onClick={handleExportJSON}
              className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5 flex-1 justify-center"
              title="Export completion progress as JSON"
            >
              <Download className="h-3.5 w-3.5 text-accent" /> Export JSON
            </button>
            <label className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5 flex-1 justify-center cursor-pointer">
              <Upload className="h-3.5 w-3.5 text-primary" /> Import
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>
            <button
              onClick={handleResetAll}
              className="btn-ghost text-xs px-3 py-2 text-rose-500 dark:text-rose-400 hover:text-rose-600 hover:bg-rose-500/10 flex items-center gap-1"
              title="Reset all checkboxes"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Interactive Map Link Box */}
        <div className="card-carbon p-6 flex flex-col justify-between bg-gradient-to-br from-card via-card to-primary/10 border-border">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-accent mb-2">
              <MapPin className="h-3.5 w-3.5" /> Live Map Sync
            </div>
            <h3 className="font-display text-base font-bold text-foreground mb-2">
              Locate Milestones on Map
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Many checklist items feature direct pins on the high-res Leonida satellite atlas with live coordinate waypoints.
            </p>
          </div>
          <Link
            href="/map"
            className="btn-primary text-xs px-4 py-2.5 mt-4 flex items-center justify-center gap-2 font-bold tracking-wide"
          >
            Launch Interactive Map <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Category Progress Badges */}
      <div className="card-carbon p-5">
        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" /> Category Completion Breakdown (11 Categories)
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
          {TRACKER_CATEGORIES.filter((c) => c !== "All").map((cat) => {
            const stat = categoryStats[cat] || { total: 0, completed: 0, percent: 0 };
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(isSelected ? "All" : cat)}
                className={cn(
                  "text-left p-3 rounded-xl border transition-all duration-200",
                  isSelected
                    ? "border-primary bg-primary/15 text-foreground shadow-sm ring-1 ring-primary/30"
                    : "border-border bg-card/60 hover:border-border hover:bg-muted/50 text-card-foreground"
                )}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-semibold text-foreground truncate pr-1">{cat}</span>
                  <span className="font-mono font-black text-accent">{stat.percent}%</span>
                </div>
                <Progress value={stat.percent} className="h-1.5 bg-muted" />
                <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-1.5 font-mono">
                  <span>{stat.completed} / {stat.total}</span>
                  {stat.percent === 100 && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                      <CheckCircle2 className="h-2.5 w-2.5" /> 100%
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Filters Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search objectives, locations, rewards, or personal notes..."
            className="input-search pl-10 pr-4 py-2.5 w-full text-xs bg-background text-foreground placeholder:text-muted-foreground border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="bg-muted/80 p-1 rounded-xl border border-border flex text-xs">
            <button
              onClick={() => setFilterStatus("all")}
              className={cn(
                "px-3 py-1.5 rounded-lg font-medium transition-colors",
                filterStatus === "all" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              All ({MILESTONES.length})
            </button>
            <button
              onClick={() => setFilterStatus("pending")}
              className={cn(
                "px-3 py-1.5 rounded-lg font-medium transition-colors",
                filterStatus === "pending" ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Pending ({MILESTONES.length - totalCompleted})
            </button>
            <button
              onClick={() => setFilterStatus("completed")}
              className={cn(
                "px-3 py-1.5 rounded-lg font-medium transition-colors",
                filterStatus === "completed" ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Completed ({totalCompleted})
            </button>
          </div>
        </div>
      </div>

      {/* Milestones List */}
      <div className="space-y-3">
        {filteredMilestones.length === 0 ? (
          <div className="card-carbon p-12 text-center">
            <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-display text-lg font-bold text-foreground">No Milestones Found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              No checklist objectives matched your current search and category filters. Try clearing your search query.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setFilterStatus("all");
              }}
              className="btn-secondary text-xs px-4 py-2 mt-4 inline-flex items-center gap-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredMilestones.map((item) => {
            const isDone = completedIds.includes(item.id);
            const userNote = personalNotes[item.id];
            const isEditing = editingNoteId === item.id;

            return (
              <div
                key={item.id}
                className={cn(
                  "card-carbon p-4 transition-all duration-200 border",
                  isDone
                    ? "border-emerald-500/30 bg-emerald-500/[0.05] dark:bg-emerald-950/20"
                    : "border-border hover:border-border/80 bg-card hover:bg-card/90 shadow-sm"
                )}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Toggle Checkbox Button */}
                  <button
                    onClick={() => handleToggle(item.id)}
                    className="mt-0.5 flex-shrink-0 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                    aria-label={`Mark ${item.title} as ${isDone ? "incomplete" : "complete"}`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-500 dark:text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground/40 hover:text-primary transition-colors" />
                    )}
                  </button>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-accent" /> {item.district}
                      </span>
                      <ConfidenceBadge confidence={item.confidence} source={item.source} size="sm" />
                    </div>

                    <h3
                      className={cn(
                        "font-display text-base font-bold text-foreground transition-all",
                        isDone && "line-through text-muted-foreground"
                      )}
                    >
                      {item.title}
                    </h3>

                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-mono text-[11px]">
                        <Trophy className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
                        <span>Reward: {item.reward}</span>
                      </div>

                      {item.mapPoiId && (
                        <Link
                          href={`/map?poi=${item.mapPoiId}`}
                          className="text-[11px] font-medium text-accent hover:underline flex items-center gap-1"
                        >
                          <MapPin className="h-3 w-3" /> View On Live Map
                        </Link>
                      )}

                      {/* Personal Note Button */}
                      <button
                        onClick={() => {
                          setEditingNoteId(isEditing ? null : item.id);
                          setNoteText(userNote || "");
                        }}
                        className="text-[11px] font-medium text-muted-foreground hover:text-foreground flex items-center gap-1"
                      >
                        <FileEdit className="h-3 w-3" />
                        {userNote ? "Edit Personal Note" : "+ Add Note"}
                      </button>
                    </div>

                    {/* Personal Note Box */}
                    {userNote && !isEditing && (
                      <div className="mt-2.5 p-2.5 rounded-lg bg-muted/50 border border-border text-xs text-foreground font-mono">
                        <span className="text-primary font-bold uppercase tracking-wider text-[10px] block mb-1">
                          Personal Field Note:
                        </span>
                        {userNote}
                      </div>
                    )}

                    {/* Note Editor Drawer */}
                    {isEditing && (
                      <div className="mt-3 p-3 rounded-lg bg-card border border-primary/40 shadow-lg space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                          Add Field Note for: {item.title}
                        </label>
                        <textarea
                          rows={2}
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="e.g., Hidden package located underneath eastern dock piling at low tide..."
                          className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-mono transition-all"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingNoteId(null)}
                            className="btn-ghost text-xs px-3 py-1 text-muted-foreground hover:text-foreground"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveNote(item.id)}
                            className="btn-primary text-xs px-3 py-1 font-bold"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
