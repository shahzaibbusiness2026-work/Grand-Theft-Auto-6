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
    verifier: "Editorial Team",
    details: "Supercar confirmed cruising Ocean Drive. Retains signature front aerodynamic splitter."
  },
  {
    id: "ast-v02",
    name: "Declasse Tulip",
    category: "vehicle",
    status: "verified",
    source: "Trailer 1 (0:19)",
    lastVerified: "2026-09-15",
    verifier: "Editorial Team",
    details: "Classic 4-door muscle car shown parked outside pawn shop in Vice City Beach."
  },
  {
    id: "ast-w01",
    name: "Combat Pistol (9mm)",
    category: "weapon",
    status: "verified",
    source: "Official Trailer 1 (Lucia Heist Sequence)",
    lastVerified: "2026-09-12",
    verifier: "Editorial Team",
    details: "Standard sidearm equipped during convenience store robbery scene."
  },
  {
    id: "ast-l01",
    name: "Vice Beaches Strip",
    category: "location",
    status: "verified",
    source: "Trailer 1 Opening Sequence",
    lastVerified: "2026-09-16",
    verifier: "Editorial Team",
    details: "Primary coastal arterial road featuring Art Deco hotels, lifeguard towers, and pedestrian boardwalk."
  },
  {
    id: "ast-l02",
    name: "Port Gellhorn",
    category: "location",
    status: "unconfirmed",
    source: "Trailer 2 — coastal industrial area",
    lastVerified: "2026-09-14",
    verifier: "Editorial Team",
    details: "Industrial port area on Leonida's west coast; awaiting further official detail."
  }
];

