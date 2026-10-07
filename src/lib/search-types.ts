/**
 * search-types.ts — shared search index types + static tool entries.
 * Client-safe (no server imports) so both the command palette and the
 * /api/search-index route can use them.
 */

export interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category:
    | "Tool"
    | "Vehicle"
    | "Weapon"
    | "Mission"
    | "Location"
    | "Property"
    | "Collectible"
    | "Character"
    | "News"
    | "Guide";
  href: string;
  img?: string;
}

/** Static navigation entries for the site's fixed tools/pages. */
export const TOOL_SEARCH_ITEMS: SearchItem[] = [
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
