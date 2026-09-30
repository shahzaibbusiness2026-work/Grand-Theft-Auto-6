/**
 * Editorial database-asset tracker types (admin "Database" page).
 *
 * NOTE: the article CMS types (AdminArticle / INITIAL_ADMIN_ARTICLES) live in
 * @/lib/admin-store — do not redeclare them here; two conflicting shapes
 * previously existed and silently diverged.
 */

export interface DatabaseAsset {
  id: string;
  name: string;
  category: "vehicle" | "weapon" | "location";
  status: "verified" | "unconfirmed" | "deprecated";
  source: string;
  lastVerified: string;
  verifier: string;
  details: string;
}

export const INITIAL_DATABASE_ASSETS: DatabaseAsset[] = [
  {
    id: "ast-v01",
    name: "Grotti Visione",
    category: "vehicle",
    status: "verified",
    source: "Trailer 1 (0:42) & Official Keyart",
    lastVerified: "2026-09-15",
    verifier: "Marcus Vance",
    details: "Supercar confirmed cruising Ocean Drive. Retains signature front aerodynamic splitter."
  },
  {
    id: "ast-v02",
    name: "Declasse Tulip",
    category: "vehicle",
    status: "verified",
    source: "Trailer 1 (0:19)",
    lastVerified: "2026-09-15",
    verifier: "Elena Rostova",
    details: "Classic 4-door muscle car shown parked outside pawn shop in Vice City Beach."
  },
  {
    id: "ast-v03",
    name: "Hovercraft Amphibian",
    category: "vehicle",
    status: "unconfirmed",
    source: "Community Mapping Coordinates (Grassrivers)",
    lastVerified: "2026-09-18",
    verifier: "Devon Reed",
    details: "Referenced in sound files and environmental textures; awaiting visual confirmation."
  },
  {
    id: "ast-w01",
    name: "Combat Pistol (9mm)",
    category: "weapon",
    status: "verified",
    source: "Official Trailer 1 (Lucia Heist Sequence)",
    lastVerified: "2026-09-12",
    verifier: "Devon Reed",
    details: "Standard sidearm equipped during convenience store robbery scene."
  },
  {
    id: "ast-w02",
    name: "Speargun / Harpoon",
    category: "weapon",
    status: "unconfirmed",
    source: "Diver gear props in port area renders",
    lastVerified: "2026-09-10",
    verifier: "Elena Rostova",
    details: "Potentially usable in underwater exploration; not yet shown in combat."
  },
  {
    id: "ast-l01",
    name: "Vice Beaches Strip",
    category: "location",
    status: "verified",
    source: "Trailer 1 Opening Sequence",
    lastVerified: "2026-09-16",
    verifier: "Elena Rostova",
    details: "Primary coastal arterial road featuring Art Deco hotels, lifeguard towers, and pedestrian boardwalk."
  },
  {
    id: "ast-l02",
    name: "Port Gellhorn Naval Base",
    category: "location",
    status: "unconfirmed",
    source: "Road sign references in trailer background",
    lastVerified: "2026-09-14",
    verifier: "Marcus Vance",
    details: "Signposts indicate Port Gellhorn 45 miles west along Interstate 97."
  }
];

