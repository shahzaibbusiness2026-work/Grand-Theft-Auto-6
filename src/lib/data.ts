/* ------------------------------------------------------------------ */
/* Taish Gaming — shared types & label lists only.                   */
/* All content (articles, characters, vehicles, weapons, guides…)      */
/* lives in Supabase and is managed from the admin dashboard.          */
/* Nothing content-shaped is hardcoded here — no dummy data, ever.     */
/* ------------------------------------------------------------------ */

export interface Character {
  id: string;
  name: string;
  role: "Protagonist" | "Antagonist" | "Supporting" | "Law Enforcement" | "Civilian";
  desc: string;
  img: string;
  filter?: string;
  featured?: boolean;
  alias?: string;
  voiceActor?: string;
  origin?: string;
  specialty?: string;
  perk?: string;
  vehicle?: string;
  weapons?: string[];
  affiliation?: string;
  status?: "Active" | "Incarcerated" | "Under Surveillance" | "Civilian" | "Unknown";
  quote?: string;
  bio?: string[];
  tags?: string[];
}

export const roleColor: Record<Character["role"], string> = {
  Protagonist: "text-accent",
  Antagonist: "text-neon-orange",
  Supporting: "text-neon-purple",
  "Law Enforcement": "text-neon-blue",
  Civilian: "text-neon-green",
};

/* ------------------------------------------------------------------ */

export interface Vehicle {
  id: string;
  name: string;
  klass: string;
  img: string;
  filter?: string;
  topSpeed: number;
  power: number;
  price?: string;
  featured?: boolean;
}

// Vehicle category labels only. Counts are intentionally omitted — GTA 6 is
// not released and any per-category totals would be invented. Live counts
// come from the database.
export const vehicleCategories = [
  { label: "All Vehicles" },
  { label: "Super Cars" },
  { label: "Sports Cars" },
  { label: "Muscle Cars" },
  { label: "SUVs & Trucks" },
  { label: "Motorcycles" },
  { label: "Boats" },
  { label: "Aircraft" },
  { label: "Off-Road" },
  { label: "Sedans" },
];

// Ranking/comparison shells stay empty — live rankings are computed from the
// database only. Invented stats must never be presented as real.
export const topVehicles: { rank: number; name: string; stat: string; img: string; filter?: string }[] = [];

export const dbVehicles: { name: string; klass: string; price: string; img: string; filter?: string; stats: number[] }[] = [];

export const vehicleComparison: { name: string; klass: string; img: string; best?: boolean; filter?: string; rows: string[] }[] = [];
export const vehicleComparisonLabels = ["Top Speed", "Acceleration", "Braking", "Handling", "Transmission", "Drive Type", "Seating", "Weight", "Price", "Featured In"];

export const moreCompareVehicles: { name: string; klass: string; img: string; filter?: string }[] = [];

/* ------------------------------------------------------------------ */

// Rockstar has not revealed GTA 6 mission titles. Missions are managed in
// the database (admin → Missions) and added only when officially confirmed.
export const mainMissions: { num: string; title: string; desc: string; status: string }[] = [];

export const sideMissions: { num: string; title: string; desc: string; reward: string; status: string }[] = [];

// Activity labels only — availability counts were invented. GTA 6 is unreleased.
export const activities = [
  { label: "Street Races", icon: "car", color: "text-neon-cyan" },
  { label: "Shooting Range", icon: "target", color: "text-neon-amber" },
  { label: "Stunt Jumps", icon: "ramp", color: "text-neon-purple" },
  { label: "Boat Races", icon: "boat", color: "text-neon-blue" },
  { label: "Darts", icon: "darts", color: "text-neon-orange" },
] as const;

export const statusVariant: Record<string, "green" | "orange" | "gray"> = {
  Completed: "green",
  "In Progress": "orange",
  "Not Started": "gray",
};

/* ------------------------------------------------------------------ */

// Map filter labels only — live marker counts come from the database.
export const mapFilters = [
  { label: "All" },
  { label: "Missions" },
  { label: "Safe Houses" },
  { label: "Garages" },
  { label: "Ammu-Nation" },
  { label: "Points of Interest" },
  { label: "Businesses" },
  { label: "Races" },
  { label: "Collectibles" },
] as const;

// Leonida regions (names + descriptions only; counts come from the database).
export const regions = [
  { name: "Vice City", desc: "The heart of Leonida. A vibrant city full of life, crime and opportunity.", img: "/img/vice-sunset.svg", accent: "border-primary" },
  { name: "Grassrivers", desc: "Swamps, wilderness and hidden secrets.", img: "/img/vice-sunset.svg", filter: "hue-rotate(90deg) saturate(0.6)", accent: "border-neon-orange" },
  { name: "Leonida Keys", desc: "Beautiful islands and coastal escapes.", img: "/img/boat.jpg", accent: "border-neon-blue" },
  { name: "Port Gellhorn", desc: "Industrial hub and gateway to the ocean.", img: "/img/vice-sunset.svg", filter: "hue-rotate(-40deg)", accent: "border-neon-purple" },
];

/* ------------------------------------------------------------------ */

// Collectible category labels only — progress numbers come from the database.
export const collectibleCategories = [
  { label: "Hidden Packages", icon: "package", color: "text-neon-purple" },
  { label: "Stunt Jumps", icon: "ramp", color: "text-neon-blue" },
  { label: "Rebel Radio", icon: "radio", color: "text-neon-cyan" },
  { label: "Wildlife Photos", icon: "camera", color: "text-neon-green" },
  { label: "Weapon Parts", icon: "wrench", color: "text-neon-orange" },
  { label: "Easter Eggs", icon: "egg", color: "text-neon-yellow" },
] as const;

/* ------------------------------------------------------------------ */

export interface Article {
  title: string;
  excerpt: string;
  date: string;
  read: string;
  img: string;
  filter?: string;
  tag?: string;
  /** CMS slug for DB-backed articles. */
  slug?: string;
  category?: string;
  /** Full article body (HTML/markdown) for CMS articles. */
  content?: string;
}

/* ------------------------------------------------------------------ */

// Weapon comparison shells stay empty — live data comes from the database.
export const weaponStats: { label: string; value: number }[] = [];

export const weaponComparison: { name: string; klass: string; img?: string; filter?: string; rows: (number | string)[] }[] = [];
export const weaponComparisonLabels = ["Damage", "Fire Rate", "Accuracy", "Range", "Handling", "Mobility", "Reload Time", "Magazine Size", "Price"];

export const dbWeapons: { name: string; klass: string; price: string; rarity: string; stats: number[] }[] = [];

export const topWeapons: { rank: number; name: string; klass: string; score: string }[] = [];

// Weapon category labels only — live counts from the database.
export const weaponCategories = [
  { label: "Pistols" },
  { label: "SMGs" },
  { label: "Shotguns" },
  { label: "Assault Rifles" },
  { label: "Sniper Rifles" },
  { label: "LMGs" },
  { label: "Launchers" },
  { label: "Melee" },
];

/* ------------------------------------------------------------------ */

export const faqs = [
  { q: "How can I report a bug or issue?", a: "Use the contact form on this page — every message lands in the admin inbox." },
  { q: "Can I suggest new features for Taish Gaming?", a: "Absolutely! We love community ideas. Send us your suggestion and we might build it for the next release." },
  { q: "Is Taish Gaming affiliated with Rockstar Games?", a: "No. Taish Gaming is an unofficial fan-made companion and is not affiliated with Rockstar Games or Take-Two Interactive." },
  { q: "How long does it take to get a response?", a: "We reply within 24 hours on business days. Live chat is available 9:00 AM – 9:00 PM EST, Monday to Sunday." },
  { q: "Where can I follow Taish Gaming for updates?", a: "Follow us on Instagram, Twitter, YouTube and Discord for the latest news and announcements." },
];
