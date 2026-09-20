import Link from "next/link";
import {
  Map,
  Car,
  Crosshair,
  Trophy,
  DollarSign,
  TrendingUp,
  Building2,
  Compass,
  MapPin,
  Bot,
  Sliders,
  ArrowRight,
  ShieldCheck,
  Wrench,
  Sparkles,
  Search,
  Flag,
} from "lucide-react";
import { SiteShell } from "@/components/shells";
import { SectionHeader } from "@/components/section-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All 15 Interactive Tools & Calculators — GTA 6 Atlas",
  description:
    "Complete suite of 15 production-ready interactive tools for Grand Theft Auto VI: interactive maps, comparison duels, profit calculators, loadout builders, 100% tracker, and AI assistant.",
};

interface ToolItem {
  id: string;
  name: string;
  category: "Maps & Exploration" | "Databases & Compare" | "Financial & Business" | "Combat & Loadouts" | "AI & Assistance";
  desc: string;
  href: string;
  badge: string;
  icon: any;
  highlight?: boolean;
}

const ALL_TOOLS: ToolItem[] = [
  // Maps & Exploration
  {
    id: "tool-map",
    name: "Interactive Satellite Map",
    category: "Maps & Exploration",
    desc: "Explore full Leonida satellite topography with 24 POIs, live filter markers, custom field notes, and completed location checkboxes.",
    href: "/map",
    badge: "Tool 01",
    icon: Map,
    highlight: true,
  },
  {
    id: "tool-tracker",
    name: "100% Completion Tracker",
    category: "Maps & Exploration",
    desc: "Offline-first 11-category completion checklist. Track story milestones, underwater caches, stunt jumps, and export JSON backups.",
    href: "/tracker",
    badge: "Tool 09",
    icon: Trophy,
    highlight: true,
  },
  {
    id: "tool-collectibles",
    name: "Collectibles Finder",
    category: "Maps & Exploration",
    desc: "Pinpoint hidden packages, stunt ramps, rebel radio towers, and wildlife photo locations with coordinate step-by-step guides.",
    href: "/collectibles",
    badge: "Tool 10",
    icon: Compass,
  },
  {
    id: "tool-locations",
    name: "Location Finder & POIs",
    category: "Maps & Exploration",
    desc: "Directory of confirmed landmarks, gun shops, luxury estates, and underground facilities across Vice City, Port Gellhorn, and Keys.",
    href: "/locations",
    badge: "Tool 11",
    icon: MapPin,
  },

  // Databases & Compare
  {
    id: "tool-vehicles",
    name: "Vehicle Database",
    category: "Databases & Compare",
    desc: "Browse 12 verified rides with acceleration dyno bars, top speed records, horsepower ratings, prices, and garage favorites.",
    href: "/vehicles",
    badge: "Tool 02",
    icon: Car,
  },
  {
    id: "tool-compare-vehicles",
    name: "Vehicle Comparison Duel",
    category: "Databases & Compare",
    desc: "Head-to-head comparison tool for 2 to 4 rides across top speed, 0–60 acceleration, handling, braking, and purchase value.",
    href: "/compare/vehicles",
    badge: "Tool 03",
    icon: Car,
    highlight: true,
  },
  {
    id: "tool-missions",
    name: "Mission Database & Finder",
    category: "Databases & Compare",
    desc: "Walkthroughs, objectives, branch choices, cash rewards, and unlock trees for confirmed Lucia & Jason story and heist contracts.",
    href: "/missions",
    badge: "Tool 04",
    icon: Flag,
  },
  {
    id: "tool-weapons",
    name: "Weapon Database & Armory",
    category: "Databases & Compare",
    desc: "Tactical catalog of confirmed firearms with DPS, recoil, range, attachment customization options, and Ammu-Nation pricing.",
    href: "/weapons",
    badge: "Tool 07",
    icon: Crosshair,
  },
  {
    id: "tool-compare-weapons",
    name: "Weapon Comparison Duel",
    category: "Databases & Compare",
    desc: "Side-by-side firearm comparison for 2 to 4 weapons. Compare damage drop-off, bullet velocity, recoil patterns, and magazine sizes.",
    href: "/compare/weapons",
    badge: "Tool 08",
    icon: Crosshair,
  },
  {
    id: "tool-properties",
    name: "Properties & Real Estate",
    category: "Databases & Compare",
    desc: "Directory of safehouses, luxury penthouses, chop shops, and nightclubs with garage storage sizes, passive earnings, and side-by-side duels.",
    href: "/properties",
    badge: "Tool 12",
    icon: Building2,
  },

  // Financial & Business
  {
    id: "tool-money-calc",
    name: "Money & Goal Calculator",
    category: "Financial & Business",
    desc: "Calculate exactly how many heist runs or play hours are required to afford luxury supercars, penthouses, and nightclub upgrades.",
    href: "/tools/money-calculator",
    badge: "Tool 05",
    icon: DollarSign,
  },
  {
    id: "tool-business-profit",
    name: "Business Profit Calculator",
    category: "Financial & Business",
    desc: "Model passive revenue, upgrade multipliers, operating costs, and break-even payback days for Leonida commercial empires.",
    href: "/tools/business-profit-calculator",
    badge: "Tool 06",
    icon: TrendingUp,
  },
  {
    id: "tool-money-maker",
    name: "Money-Making Method Finder",
    category: "Financial & Business",
    desc: "Interactive strategy recommender. Find the highest-yield solo and squad cash methods filtered by bankroll and risk tolerance.",
    href: "/tools/money-maker",
    badge: "Tool 13",
    icon: DollarSign,
  },

  // Combat & Loadouts
  {
    id: "tool-loadout",
    name: "Tactical Loadout Builder",
    category: "Combat & Loadouts",
    desc: "Configure 5-slot weapon loadouts with tactical gear. Real-time firepower, accuracy, mobility, and stealth ratings with local save.",
    href: "/tools/loadout-builder",
    badge: "Tool 14",
    icon: Sliders,
    highlight: true,
  },

  // AI & Assistance
  {
    id: "tool-ai",
    name: "Ask GTA 6 AI Companion",
    category: "AI & Assistance",
    desc: "Ask any question regarding GTA 6 lore, vehicles, weapons, or heists. Grounded strictly in official disclosures with verifiable citations.",
    href: "/ai",
    badge: "Tool 15",
    icon: Bot,
    highlight: true,
  },
];

const CATEGORIES = [
  "All Tools",
  "Maps & Exploration",
  "Databases & Compare",
  "Financial & Business",
  "Combat & Loadouts",
  "AI & Assistance",
] as const;

export default function ToolsPage() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        {/* Header Hero */}
        <div className="card-carbon p-8 md:p-12 mb-10 border-primary/30 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-primary/10">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
              <Sparkles className="h-3 w-3" /> Complete Utility Suite
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              GTA 6 ATLAS <span className="bg-gradient-to-r from-primary via-accent to-amber-400 bg-clip-text text-transparent">TOOLBOX</span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Explore all 15 fully interactive utilities engineered for Grand Theft Auto VI.
              From satellite map navigation and comparison duels to financial simulators, loadout builders, and grounded AI.
            </p>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="space-y-12">
          {CATEGORIES.filter((c) => c !== "All Tools").map((cat) => {
            const catTools = ALL_TOOLS.filter((t) => t.category === cat);
            return (
              <section key={cat} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h2 className="font-display text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" /> {cat}
                  </h2>
                  <span className="text-xs font-mono text-slate-400">
                    {catTools.length} Utilities
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catTools.map((t) => {
                    const IconComponent = t.icon;
                    return (
                      <Link
                        key={t.id}
                        href={t.href}
                        className="card-carbon p-6 flex flex-col justify-between border border-slate-800 hover:border-primary/60 transition-all duration-200 group bg-slate-900/70 hover:bg-slate-900 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="p-2.5 rounded-xl bg-slate-800 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                              <IconComponent className="h-5 w-5" />
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 font-mono">
                              {t.badge}
                            </span>
                          </div>

                          <h3 className="font-display text-lg font-bold text-white group-hover:text-primary transition-colors">
                            {t.name}
                          </h3>

                          <p className="text-xs text-slate-300 leading-relaxed">
                            {t.desc}
                          </p>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-accent group-hover:text-white transition-colors">
                          <span>Launch Tool</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Suggest / Contact Bar */}
        <div className="card-carbon p-6 md:p-8 mt-16 border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-900/60">
          <div className="flex items-center gap-4">
            <span className="h-12 w-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
              <Wrench className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">
                Need a Custom Leonida Tool?
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Our suite is continuously updated as new official Rockstar disclosures and mechanics drop.
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="btn-secondary text-xs px-5 py-2.5 font-bold uppercase tracking-wider whitespace-nowrap"
          >
            Submit Feedback
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
