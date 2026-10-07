/**
 * catalog.ts — merged catalog fetchers (server-only, plain module).
 *
 * Combines live Supabase rows with the bundled canonical dataset:
 * DB values WIN for matching records; canonical entries fill the rest.
 * Consumers: /vehicles, /weapons listings, /compare/* tools,
 * and the /api/search-index route.
 */
import {
  getPublicVehicleCatalog,
  type VehicleCatalogRow,
} from "./vehicles";
import {
  getPublicWeaponCatalog,
  type WeaponCatalogRow,
} from "./weapons";
import {
  canonicalVehicles,
  canonicalWeapons,
  type CanonicalVehicle,
  type CanonicalWeapon,
} from "@/lib/canonical-data";

const num = (s?: string | null): number | null => {
  const n = parseFloat((s || "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
};

/** Map a live DB vehicle row to the display shape — DB values WIN over canonical stats. */
function dbVehicleToDisplay(v: VehicleCatalogRow, c?: CanonicalVehicle): CanonicalVehicle {
  return {
    id: v.id,
    slug: v.slug || c?.slug || v.id,
    name: v.name,
    manufacturer: v.manufacturer || c?.manufacturer || "Unknown",
    klass: (v.class === "Sports"
      ? "Sports Car"
      : v.class === "Super"
        ? "Super Car"
        : (v.class as CanonicalVehicle["klass"])) || c?.klass || "Sports Car",
    img: v.images?.[0] || c?.img || "/img/car-purple.jpg",
    filter: c?.filter,
    topSpeed: num(v.top_speed) ?? c?.topSpeed ?? 150,
    acceleration: num(v.acceleration) ?? c?.acceleration ?? 4.0,
    braking: c?.braking ?? 75,
    handling: num(v.handling) ?? c?.handling ?? 75,
    power: v.power_hp ?? c?.power ?? 500,
    weight: v.weight || c?.weight || "1,500 kg",
    seating: v.seating ?? c?.seating ?? 2,
    drivetrain: (v.drivetrain as CanonicalVehicle["drivetrain"]) || c?.drivetrain || "RWD",
    price: v.price ?? c?.price ?? null,
    priceDisplay: v.price_display || c?.priceDisplay || "TBD",
    purchaseLocation: c?.purchaseLocation || "Southern San Andreas Super Autos",
    spawnLocations: c?.spawnLocations ?? ["Vice City Downtown", "Ocean Drive"],
    customizationOptions: c?.customizationOptions ?? ["Engine Tuning", "Brakes", "Suspension", "Turbo"],
    confidence: (v.confidence as CanonicalVehicle["confidence"]) || c?.confidence || "CONFIRMED",
    source: v.source || c?.source || "In-game Footage",
    description: v.summary || c?.description || `${v.name} in Grand Theft Auto VI.`,
    featured: c?.featured ?? true,
  };
}

/** Map a live DB weapon row to the display shape — DB values WIN over canonical stats. */
function dbWeaponToDisplay(w: WeaponCatalogRow, c?: CanonicalWeapon): CanonicalWeapon {
  return {
    id: w.id,
    slug: w.slug || c?.slug || w.id,
    name: w.name,
    klass: (w.category as CanonicalWeapon["klass"]) || c?.klass || "Pistol",
    damage: num(w.damage) ?? c?.damage ?? 50,
    fireRate: num(w.rate_of_fire) ?? c?.fireRate ?? 50,
    accuracy: num(w.range) ?? c?.accuracy ?? 50,
    range: num(w.range) ?? c?.range ?? 50,
    handling: c?.handling ?? 50,
    reloadTime: c?.reloadTime ?? "2.5s",
    magazineSize: num(w.magazine_size) ?? c?.magazineSize ?? 15,
    ammoType: w.ammunition || c?.ammoType || "9mm Standard",
    price: c?.price ?? null,
    priceDisplay: w.price_display || c?.priceDisplay || "TBD",
    rarity: (w.rarity as CanonicalWeapon["rarity"]) || c?.rarity || "Common",
    locations: c?.locations || [w.acquisition_method || "Ammu-Nation"],
    attachments: w.attachments || c?.attachments || [],
    confidence: (w.confidence as CanonicalWeapon["confidence"]) ||
      (w.verification === "verified" ? "CONFIRMED" : "SPECULATION"),
    source: c?.source || "In-game Database",
    description: w.notes || c?.description || `${w.name} in Grand Theft Auto VI.`,
    img: c?.img || "/img/hero-dark.jpg",
  };
}

/**
 * Published vehicles for display: live DB rows override matching canonical
 * entries; canonical entries the DB doesn't know about are kept so the
 * roster stays complete. Falls back to pure canonical data if the DB is
 * unreachable or empty.
 */
export async function getMergedVehicles(): Promise<CanonicalVehicle[]> {
  try {
    const dbVehicles = await getPublicVehicleCatalog();
    if (dbVehicles && dbVehicles.length > 0) {
      const dbMapped = dbVehicles.map((v) =>
        dbVehicleToDisplay(
          v,
          canonicalVehicles.find(
            (cv) => cv.id.toLowerCase() === v.id.toLowerCase() || cv.name.toLowerCase() === v.name.toLowerCase()
          )
        )
      );
      const dbIds = new Set(dbVehicles.map((v) => v.id.toLowerCase()));
      const dbNames = new Set(dbVehicles.map((v) => v.name.toLowerCase()));
      const remainingCanonical = canonicalVehicles.filter(
        (cv) => !dbIds.has(cv.id.toLowerCase()) && !dbNames.has(cv.name.toLowerCase())
      );
      return [...dbMapped, ...remainingCanonical];
    }
  } catch {
    // Fall through to canonical data
  }
  return canonicalVehicles;
}

/**
 * Published weapons for display: same merge rules as getMergedVehicles.
 */
export async function getMergedWeapons(): Promise<CanonicalWeapon[]> {
  try {
    const dbWeapons = await getPublicWeaponCatalog();
    if (dbWeapons && dbWeapons.length > 0) {
      const dbMapped = dbWeapons.map((w) =>
        dbWeaponToDisplay(
          w,
          canonicalWeapons.find(
            (cw) => cw.id.toLowerCase() === w.id.toLowerCase() || cw.name.toLowerCase() === w.name.toLowerCase()
          )
        )
      );
      const dbIds = new Set(dbWeapons.map((w) => w.id.toLowerCase()));
      const dbNames = new Set(dbWeapons.map((w) => w.name.toLowerCase()));
      const remainingCanonical = canonicalWeapons.filter(
        (cw) => !dbIds.has(cw.id.toLowerCase()) && !dbNames.has(cw.name.toLowerCase())
      );
      return [...dbMapped, ...remainingCanonical];
    }
  } catch {
    // Fall through to canonical data
  }
  return canonicalWeapons;
}
