import {
  Anchor,
  BedDouble,
  Bike,
  Briefcase,
  Brush,
  BusFront,
  Car,
  Clapperboard,
  Cross,
  Crosshair,
  Disc3,
  Drama,
  Droplets,
  Dumbbell,
  Factory,
  FerrisWheel,
  Flag,
  Footprints,
  Fuel,
  HardHat,
  Home,
  Landmark,
  Lock,
  MapPin,
  Martini,
  PartyPopper,
  Pill,
  Pizza,
  Plane,
  PlugZap,
  Scissors,
  Shield,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  SprayCan,
  Star,
  Store,
  Timer,
  TrainFront,
  TramFront,
  TreePine,
  Trophy,
  Tv,
  UtensilsCrossed,
  Volleyball,
  Wine,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export interface LocationSubcategory {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Normalised type tokens that select this subcategory (first match wins). */
  tokens: string[];
}

/**
 * Pictogram per location type, in the thin-line style gtamap.io uses:
 * one recognisable pictogram per kind of place. Rules are ordered most
 * specific first; the first rule whose token appears in the entry's types
 * wins. Tokens are matched against normalised types (lowercased, leading
 * '#' / '//' stripped).
 */
export const LOCATION_SUBCATEGORIES: LocationSubcategory[] = [
  { id: "guns", label: "Gun store", icon: Crosshair, tokens: ["guns", "gun"] },
  { id: "gas", label: "Gas station", icon: Fuel, tokens: ["gas"] },
  {
    id: "supermarket",
    label: "Supermarket",
    icon: ShoppingCart,
    tokens: ["supermarket"],
  },
  {
    id: "restaurant",
    label: "Restaurant",
    icon: UtensilsCrossed,
    tokens: ["restaurant"],
  },
  { id: "fastfood", label: "Fast food", icon: Pizza, tokens: ["fastfood", "food"] },
  { id: "bar", label: "Bar", icon: Martini, tokens: ["bar"] },
  { id: "liquor", label: "Liquor store", icon: Wine, tokens: ["liquor", "drinks"] },
  { id: "clothes", label: "Clothing", icon: Shirt, tokens: ["clothes"] },
  { id: "shoes", label: "Shoe store", icon: Footprints, tokens: ["shoes"] },
  { id: "hair", label: "Barber", icon: Scissors, tokens: ["hair"] },
  { id: "tattoos", label: "Tattoo parlor", icon: Brush, tokens: ["tattoos"] },
  { id: "electronics", label: "Electronics", icon: Tv, tokens: ["electronics"] },
  { id: "pharmacy", label: "Pharmacy", icon: Pill, tokens: ["pharmacy"] },
  { id: "airport", label: "Airport", icon: Plane, tokens: ["airport", "airbase"] },
  { id: "marina", label: "Marina", icon: Anchor, tokens: ["marina"] },
  { id: "train", label: "Train station", icon: TrainFront, tokens: ["train"] },
  {
    id: "metro",
    label: "Metro station",
    icon: TramFront,
    tokens: ["metro", "metromover"],
  },
  { id: "bus", label: "Bus stop", icon: BusFront, tokens: ["bus"] },
  { id: "police", label: "Police station", icon: Shield, tokens: ["police"] },
  { id: "hospital", label: "Hospital", icon: Cross, tokens: ["hospital"] },
  { id: "jail", label: "Jail", icon: Lock, tokens: ["jail"] },
  { id: "hotel", label: "Hotel", icon: BedDouble, tokens: ["hotel"] },
  { id: "safehouse", label: "Safehouse", icon: Home, tokens: ["safehouse"] },
  { id: "nightclub", label: "Nightclub", icon: Disc3, tokens: ["nightclub"] },
  { id: "stripclub", label: "Strip club", icon: Sparkles, tokens: ["stripclub"] },
  { id: "modshop", label: "Mod shop", icon: Wrench, tokens: ["modshop"] },
  {
    id: "paynspray",
    label: "Pay 'n' Spray",
    icon: SprayCan,
    tokens: ["pay'n'spray"],
  },
  { id: "carwash", label: "Car wash", icon: Droplets, tokens: ["carwash"] },
  { id: "bikeshop", label: "Bike shop", icon: Bike, tokens: ["bikeshop"] },
  { id: "gym", label: "Gym", icon: Dumbbell, tokens: ["gym"] },
  { id: "cinema", label: "Cinema", icon: Clapperboard, tokens: ["cinema"] },
  { id: "golf", label: "Golf course", icon: Flag, tokens: ["golf"] },
  { id: "tennis", label: "Tennis court", icon: Trophy, tokens: ["tennis"] },
  { id: "racetrack", label: "Racetrack", icon: Timer, tokens: ["racetrack"] },
  {
    id: "beachvolley",
    label: "Beach volleyball",
    icon: Volleyball,
    tokens: ["beach_volleyball"],
  },
  {
    id: "ferriswheel",
    label: "Ferris wheel",
    icon: FerrisWheel,
    tokens: ["ferriswheel"],
  },
  { id: "landmark", label: "Landmark", icon: Star, tokens: ["landmark", "point-of-interest"] },
  { id: "natural", label: "Nature", icon: TreePine, tokens: ["natural"] },
  { id: "residential", label: "Residential", icon: Home, tokens: ["residential"] },
  { id: "retail", label: "Shop", icon: ShoppingBag, tokens: ["retail"] },
  { id: "vendor", label: "Vendor", icon: Store, tokens: ["vendor"] },
  { id: "leisure", label: "Leisure", icon: Drama, tokens: ["leisure", "recreation"] },
  { id: "government", label: "Government", icon: Landmark, tokens: ["government"] },
  {
    id: "industrial",
    label: "Industrial",
    icon: Factory,
    tokens: ["industrial", "agriculture"],
  },
  {
    id: "transportation",
    label: "Transport",
    icon: Car,
    tokens: ["transportation"],
  },
  { id: "events", label: "Event venue", icon: PartyPopper, tokens: ["events"] },
  { id: "public", label: "Public place", icon: MapPin, tokens: ["public"] },
  {
    id: "construction",
    label: "Construction",
    icon: HardHat,
    tokens: ["construction"],
  },
  { id: "office", label: "Office", icon: Briefcase, tokens: ["office"] },
  {
    id: "utilities",
    label: "Utility",
    icon: PlugZap,
    tokens: ["utilities", "service"],
  },
];

export const FALLBACK_SUBCATEGORY: LocationSubcategory = {
  id: "poi",
  label: "Point of interest",
  icon: MapPin,
  tokens: [],
};

/** Normalise one raw type tag: lowercase, strip leading '#' / '//'. */
export function normalizeMapType(raw: string): string {
  return raw.toLowerCase().replace(/^(#|\/\/)+/, "").trim();
}

/**
 * Metadata-only tags that never describe a kind of place (floor/level tags,
 * review flags, duplicate markers, author tags). They are skipped when
 * picking a subcategory so a real type on the same entry wins.
 */
const IGNORED_TOKENS = new Set([
  "l1",
  "l2",
  "l3",
  "l4",
  "l5",
  "l6",
  "l7",
  "l8",
  "enterable",
  "unconfirmed",
  "demolished",
  "closed",
  "reused",
  "mirrored",
  "gtav",
  "fictional",
  "cancelled",
  "scarface",
  "badboys",
  "dexter",
  "fence",
]);

export function locationSubcategoryForTypes(
  types: string[],
): LocationSubcategory {
  const tokens = types
    .map(normalizeMapType)
    .filter((t) => t && !IGNORED_TOKENS.has(t) && !t.startsWith("//") && !t.startsWith("@") && !t.startsWith("duplicate-of") && !t.startsWith("doesnt"));
  if (!tokens.length) return FALLBACK_SUBCATEGORY;
  for (const sub of LOCATION_SUBCATEGORIES) {
    if (sub.tokens.some((token) => tokens.includes(token))) return sub;
  }
  return FALLBACK_SUBCATEGORY;
}

/**
 * Subcategories hidden by default on first load: the generic / noisy ones
 * that would drown the map (untyped records, housing, generic shops and
 * roads, industrial yards). The user can turn any of them back on.
 */
export const DEFAULT_HIDDEN_SUBCATEGORIES: string[] = [
  "residential",
  "retail",
  "transportation",
  "industrial",
  "public",
  "utilities",
  // Noisy generic kinds that drown the first load (nature spots,
  // government buildings, bus stops, generic leisure). The user can
  // turn any of them back on in the filter sidebar.
  "natural",
  "government",
  "bus",
  "leisure",
];
