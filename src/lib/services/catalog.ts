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
import {
  VEHICLE_CLASS_DEFAULTS,
  WEAPON_CATEGORY_DEFAULTS,
} from "@/lib/scoring";

const num = (s?: string | null): number | null => {
  const n = parseFloat((s || "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
};

/** Map a live DB vehicle row to the display shape — DB values WIN over canonical stats. */
function dbVehicleToDisplay(v: VehicleCatalogRow, c?: CanonicalVehicle): CanonicalVehicle {
  // Class-based stat defaults fill NULL columns so comparisons/rankings
  // stay meaningful before the admin enters real values.
  const defaults = VEHICLE_CLASS_DEFAULTS[(v.class || "").trim()] || {};
  const rating = (db: number | null | undefined, canon?: number, dflt?: number): number =>
    db ?? canon ?? dflt ?? 60;
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
    customizationOptions: v.customization?.length ? v.customization : c?.customizationOptions ?? ["Engine Tuning", "Brakes", "Suspension", "Turbo"],
    confidence: (v.confidence as CanonicalVehicle["confidence"]) || c?.confidence || "CONFIRMED",
    source: v.source || c?.source || "In-game Footage",
    description: v.summary || c?.description || `${v.name} in Grand Theft Auto VI.`,
    featured: v.featured ?? c?.featured ?? true,

    /* Deep-dive fields (DB first → canonical → class defaults) */
    traction: rating(v.traction, c?.traction, defaults.traction),
    cornering: rating(v.cornering, c?.cornering, defaults.cornering),
    launch: rating(v.launch, c?.launch, defaults.launch),
    reverseSpeed: rating(v.reverse_speed, c?.reverseSpeed, defaults.reverseSpeed),
    torque: v.torque ?? c?.torque ?? undefined,
    resalePrice: v.resale_price ?? c?.resalePrice ?? null,
    insuranceCost: v.insurance_cost ?? c?.insuranceCost ?? null,
    upgradeCost: v.upgrade_cost ?? c?.upgradeCost ?? null,
    repairCost: v.repair_cost ?? c?.repairCost ?? null,
    storageCost: v.storage_cost ?? c?.storageCost ?? null,
    engineType: v.engine_type || c?.engineType || undefined,
    engineSize: v.engine_size || c?.engineSize || undefined,
    transmission: v.transmission || c?.transmission || undefined,
    gears: v.gears ?? c?.gears ?? undefined,
    fuelType: v.fuel_type || c?.fuelType || undefined,
    turbo: v.turbo ?? c?.turbo ?? false,
    electric: v.electric ?? c?.electric ?? false,
    doors: v.doors ?? c?.doors ?? defaults.doors ?? 2,
    convertible: v.convertible ?? c?.convertible ?? false,
    roofType: v.roof_type || c?.roofType || undefined,
    trunkCapacity: v.trunk_capacity || c?.trunkCapacity || undefined,
    offroadRating: rating(v.offroad_rating, c?.offroadRating, defaults.offroadRating),
    waterRating: rating(v.water_rating, c?.waterRating, defaults.waterRating),
    amphibious: v.amphibious ?? c?.amphibious ?? false,
    bulletResistance: rating(v.bullet_resistance, c?.bulletResistance, defaults.bulletResistance),
    explosionResistance: rating(v.explosion_resistance, c?.explosionResistance, defaults.explosionResistance),
    armorRating: rating(v.armor_rating, c?.armorRating, defaults.armorRating),
    weaponized: v.weaponized ?? c?.weaponized ?? false,
    driftRating: rating(v.drift_rating, c?.driftRating, defaults.driftRating),
    specialAbility: v.special_ability || c?.specialAbility || undefined,
    features: v.features?.length ? v.features : c?.features ?? [],
    customization: v.customization?.length ? v.customization : c?.customization ?? [],
    soundRating: v.sound_rating ?? c?.soundRating ?? undefined,
    engineSound: v.engine_sound || c?.engineSound || undefined,
    exhaustSound: v.exhaust_sound || c?.exhaustSound || undefined,
    horn: v.horn || c?.horn || undefined,
    turboSound: v.turbo_sound || c?.turboSound || undefined,
    gearShiftSound: v.gear_shift_sound || c?.gearShiftSound || undefined,
    availability: v.availability || c?.availability || "Confirmed for GTA 6",
    gallery: v.gallery?.length ? v.gallery : c?.gallery ?? [],
    tags: v.tags?.length ? v.tags : c?.tags ?? [],
  };
}

/** Map a live DB weapon row to the display shape — DB values WIN over canonical stats. */
function dbWeaponToDisplay(w: WeaponCatalogRow, c?: CanonicalWeapon): CanonicalWeapon {
  // Category-based stat defaults fill NULL columns.
  const defaults = WEAPON_CATEGORY_DEFAULTS[(w.category || "").trim()] || {};
  const rating = (db: number | null | undefined, canon?: number, dflt?: number): number =>
    db ?? canon ?? dflt ?? 55;
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
    price: w.price ?? c?.price ?? null,
    priceDisplay: w.price_display || c?.priceDisplay || "TBD",
    rarity: (w.rarity as CanonicalWeapon["rarity"]) || c?.rarity || "Common",
    locations: c?.locations || [w.acquisition_method || "Ammu-Nation"],
    attachments: w.attachments || c?.attachments || [],
    confidence: (w.confidence as CanonicalWeapon["confidence"]) ||
      (w.verification === "verified" ? "CONFIRMED" : "SPECULATION"),
    source: c?.source || "In-game Database",
    description: w.notes || c?.description || `${w.name} in Grand Theft Auto VI.`,
    img: w.image || c?.img || "/img/hero-dark.jpg",

    /* Deep-dive fields (DB first → canonical → category defaults) */
    reload: rating(w.reload, c?.reload, defaults.reload),
    ammoCapacity: w.ammo_capacity ?? c?.ammoCapacity ?? defaults.ammoCapacity ?? undefined,
    recoil: rating(w.recoil, c?.recoil, defaults.recoil),
    mobility: rating(w.mobility, c?.mobility, defaults.mobility),
    projectileSpeed: rating(w.projectile_speed, c?.projectileSpeed, defaults.projectileSpeed),
    headshotMultiplier: w.headshot_multiplier ?? c?.headshotMultiplier ?? undefined,
    damageFalloff: rating(w.damage_falloff, c?.damageFalloff, defaults.damageFalloff),
    fireMode: w.fire_mode || c?.fireMode || undefined,
    features: w.features?.length ? w.features : c?.features ?? [],
    ammoCost: w.ammo_cost ?? c?.ammoCost ?? null,
    upgradeCost: w.upgrade_cost ?? c?.upgradeCost ?? null,
    manufacturer: w.manufacturer || c?.manufacturer || undefined,
    availability: w.availability || c?.availability || "Confirmed for GTA 6",
    featured: w.featured ?? c?.featured ?? false,
    gallery: w.gallery?.length ? w.gallery : c?.gallery ?? [],
    tags: w.tags?.length ? w.tags : c?.tags ?? [],
    customization: w.customization?.length ? w.customization : c?.customization ?? [],
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
