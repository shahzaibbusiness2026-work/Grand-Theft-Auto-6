import { PUBLIC_TOOL_COPY } from "./public-tool-copy";
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
export const TOOL_SEARCH_ITEMS: SearchItem[] = (
  [
    {
      id: "tool-map",
      title: "Interactive Satellite Map",
      subtitle:
        "Provisional fan-map pins, filters and device-local notes; placements unverified",
      category: "Tool",
      href: "/map",
    },
    {
      id: "tool-tracker",
      title: "100% Completion Tracker",
      subtitle:
        "Verified GTA VI checklist not yet available; readiness and evidence status",
      category: "Tool",
      href: "/tracker",
    },
    {
      id: "tool-compare-vehicles",
      title: "Vehicle Comparison Duel",
      subtitle:
        "Compare 2–4 editorial entries, reviewed fields, sources and unknowns",
      category: "Tool",
      href: "/compare/vehicles",
    },
    {
      id: "tool-compare-weapons",
      title: "Weapon Comparison Duel",
      subtitle:
        "Compare weapon evidence and unknowns; no unsupported performance rankings",
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
      subtitle:
        "Organize a hypothetical kit; verified GTA VI loadout ratings unavailable",
      category: "Tool",
      href: "/tools/loadout-builder",
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
      subtitle: "Directory of landmarks, gun shops & estates",
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
  ] satisfies SearchItem[]
).map((item) => ({
  ...item,
  subtitle: PUBLIC_TOOL_COPY[item.href] || item.subtitle,
}));
