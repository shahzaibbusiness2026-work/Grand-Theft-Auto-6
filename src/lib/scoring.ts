/**
 * scoring.ts — pure scoring helpers for vehicles & weapons (client-safe).
 *
 * Weights are CMS-configurable (site_settings: vehicle_score_weights /
 * weapon_score_weights via the admin Comparison Settings page) so the
 * scoring formula can be tuned without code changes.
 */

/* ------------------------------------------------------------------ */
/* Weights                                                             */
/* ------------------------------------------------------------------ */

export interface VehicleScoreWeights {
  topSpeed: number;
  acceleration: number;
  handling: number;
  braking: number;
  traction: number;
  features: number;
  [key: string]: number;
}

export interface WeaponScoreWeights {
  damage: number;
  fireRate: number;
  accuracy: number;
  range: number;
  reload: number;
  magazine: number;
  handling: number;
  [key: string]: number;
}

export const DEFAULT_VEHICLE_WEIGHTS: VehicleScoreWeights = {
  topSpeed: 25,
  acceleration: 20,
  handling: 20,
  braking: 10,
  traction: 15,
  features: 10,
};

export const DEFAULT_WEAPON_WEIGHTS: WeaponScoreWeights = {
  damage: 25,
  fireRate: 20,
  accuracy: 15,
  range: 15,
  reload: 10,
  magazine: 5,
  handling: 10,
};

/** Scale raw weights so they always sum to 100 (CMS values may not). */
export function normalizeWeights(w: Record<string, number>): Record<string, number> {
  const total = Object.values(w).reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);
  if (total <= 0) return { ...w };
  const out: Record<string, number> = {};
  for (const k of Object.keys(w)) {
    out[k] = Math.round(((Number(w[k]) || 0) / total) * 1000) / 10;
  }
  return out;
}

const clamp = (n: number, min = 0, max = 100) => Math.min(max, Math.max(min, n));

/* ------------------------------------------------------------------ */
/* Feature score (special features component of vehicle rating)        */
/* ------------------------------------------------------------------ */

export function vehicleFeatureScore(v: {
  features?: string[];
  armorRating?: number;
  bulletResistance?: number;
  weaponized?: boolean;
  boost?: boolean;
  specialAbility?: string;
}): number {
  const feats = v.features || [];
  let score = feats.length * 14;
  score += clamp(v.armorRating || 0) * 0.25;
  score += clamp(v.bulletResistance || 0) * 0.2;
  if (v.weaponized) score += 10;
  if (v.boost) score += 6;
  if (v.specialAbility) score += 6;
  return clamp(Math.round(score));
}

/* ------------------------------------------------------------------ */
/* Overall scores                                                      */
/* ------------------------------------------------------------------ */

export function computeVehicleScore(
  v: {
    topSpeed: number;
    acceleration: number; // seconds, lower is better
    handling: number;
    braking: number;
    traction?: number;
    features?: string[];
    armorRating?: number;
    bulletResistance?: number;
    weaponized?: boolean;
    boost?: boolean;
    specialAbility?: string;
  },
  weights: VehicleScoreWeights = DEFAULT_VEHICLE_WEIGHTS
): number {
  const w = normalizeWeights({ ...weights });
  const speedScore = clamp(((v.topSpeed - 80) / (230 - 80)) * 100);
  const accelScore = clamp(((6.5 - clamp(v.acceleration, 1.5, 6.5)) / (6.5 - 1.5)) * 100);
  const handlingScore = clamp(v.handling);
  const brakingScore = clamp(v.braking);
  const tractionScore = clamp(v.traction ?? handlingScore * 0.9);
  const featuresScore = vehicleFeatureScore(v);
  const total =
    (speedScore * w.topSpeed +
      accelScore * w.acceleration +
      handlingScore * w.handling +
      brakingScore * w.braking +
      tractionScore * w.traction +
      featuresScore * w.features) /
    100;
  return Math.round(total * 10) / 10;
}

export function computeWeaponScore(
  w: {
    damage: number;
    fireRate: number;
    accuracy: number;
    range: number;
    reload?: number;
    magazineSize: number;
    handling: number;
  },
  weights: WeaponScoreWeights = DEFAULT_WEAPON_WEIGHTS
): number {
  const wt = normalizeWeights({ ...weights });
  const reloadScore = clamp(w.reload ?? 60);
  const magazineScore = clamp((w.magazineSize / 60) * 100);
  const total =
    (clamp(w.damage) * wt.damage +
      clamp(w.fireRate) * wt.fireRate +
      clamp(w.accuracy) * wt.accuracy +
      clamp(w.range) * wt.range +
      reloadScore * wt.reload +
      magazineScore * wt.magazine +
      clamp(w.handling) * wt.handling) /
    100;
  return Math.round(total * 10) / 10;
}

/** DPS index — Damage × effective shots-per-second (rating-based). */
export function computeDpsIndex(damage: number, fireRate: number): number {
  return Math.round((clamp(damage) * clamp(fireRate)) / 100);
}

/* ------------------------------------------------------------------ */
/* "Best For" tags                                                     */
/* ------------------------------------------------------------------ */

export interface BestForTag {
  emoji: string;
  label: string;
}

export function getVehicleBestFor(v: {
  klass?: string;
  topSpeed: number;
  acceleration: number;
  handling: number;
  traction?: number;
  offroadRating?: number;
  waterRating?: number;
  armorRating?: number;
  bulletResistance?: number;
  features?: string[];
  weaponized?: boolean;
  price?: number | null;
  priceDisplay?: string;
  driftRating?: number;
}): BestForTag[] {
  const tags: BestForTag[] = [];
  const feats = v.features || [];
  const has = (...keys: string[]) => feats.some((f) => keys.some((k) => f.toLowerCase().includes(k.toLowerCase())));

  if (v.topSpeed >= 185) tags.push({ emoji: "🛣️", label: "Best for High Speed" });
  if ((v.handling || 0) >= 85 || (v.traction || 0) >= 85) tags.push({ emoji: "🎯", label: "Best Handling" });
  if ((v.offroadRating ?? 0) >= 70) tags.push({ emoji: "🏔️", label: "Best for Off-Road" });
  if ((v.waterRating ?? 0) >= 80) tags.push({ emoji: "🚤", label: "Best on Water" });
  if (v.weaponized || has("Missile", "Machine Gun", "Weaponiz", "Rockets", "Mines", "Torpedo"))
    tags.push({ emoji: "🔫", label: "Best Weaponized" });
  if ((v.armorRating ?? 0) >= 55 || (v.bulletResistance ?? 0) >= 55 || has("Armor", "Bulletproof"))
    tags.push({ emoji: "🛡️", label: "Best Defense" });
  if ((v.driftRating ?? 0) >= 75) tags.push({ emoji: "🌀", label: "Best for Drifting" });
  if ((v.price ?? Infinity) > 0 && (v.price ?? Infinity) <= 250000 && (v.handling || 0) >= 65)
    tags.push({ emoji: "💰", label: "Best Value" });
  if ((v.traction ?? 0) >= 82 && (v.acceleration || 9) <= 4.2 && (v.topSpeed >= 160))
    tags.push({ emoji: "🏁", label: "Best for Racing" });
  return tags.slice(0, 4);
}

export function getWeaponBestFor(w: {
  klass?: string;
  damage: number;
  fireRate: number;
  accuracy: number;
  range: number;
  reload?: number;
  features?: string[];
}): BestForTag[] {
  const tags: BestForTag[] = [];
  const feats = w.features || [];
  const has = (...keys: string[]) => feats.some((f) => keys.some((k) => f.toLowerCase().includes(k.toLowerCase())));

  if ((w.damage ?? 0) >= 70) tags.push({ emoji: "💀", label: "Highest Damage" });
  if ((w.fireRate ?? 0) >= 75) tags.push({ emoji: "⚡", label: "Fastest Firing" });
  if ((w.range ?? 0) >= 75 || (w.accuracy ?? 0) >= 80) tags.push({ emoji: "🎯", label: "Best for Long Range" });
  if (has("Suppressor")) tags.push({ emoji: "🤫", label: "Best for Stealth" });
  if (has("Armor Penetration")) tags.push({ emoji: "🪖", label: "Anti-Armor" });
  if (has("Explosive", "Incendiary", "Area")) tags.push({ emoji: "💥", label: "Area Damage" });
  if (w.klass === "Sniper Rifle") tags.push({ emoji: "🔭", label: "Best for Sniping" });
  if ((w.reload ?? 60) >= 80 && (w.accuracy ?? 0) >= 70) tags.push({ emoji: "🏅", label: "Best All-Rounder" });
  return tags.slice(0, 4);
}

/* ------------------------------------------------------------------ */
/* Class/category stat defaults                                        */
/* ------------------------------------------------------------------ */

/**
 * Neutral-but-believable stat defaults per vehicle class. Used when the
 * database column is NULL so comparisons and rankings stay meaningful
 * before the admin fills in real values.
 */
export const VEHICLE_CLASS_DEFAULTS: Record<string, Partial<CanonicalVehicleStats>> = {
  "Super Car": { traction: 90, cornering: 88, launch: 90, reverseSpeed: 55, driftRating: 40, offroadRating: 15, waterRating: 0, bulletResistance: 30, explosionResistance: 25, armorRating: 20, doors: 2 },
  "Sports Car": { traction: 84, cornering: 82, launch: 82, reverseSpeed: 55, driftRating: 55, offroadRating: 20, waterRating: 0, bulletResistance: 25, explosionResistance: 25, armorRating: 15, doors: 2 },
  "Muscle Car": { traction: 74, cornering: 70, launch: 80, reverseSpeed: 55, driftRating: 85, offroadRating: 30, waterRating: 0, bulletResistance: 35, explosionResistance: 30, armorRating: 25, doors: 2 },
  "Off-Road": { traction: 88, cornering: 62, launch: 70, reverseSpeed: 60, driftRating: 45, offroadRating: 92, waterRating: 45, bulletResistance: 40, explosionResistance: 35, armorRating: 30, doors: 4 },
  Motorcycle: { traction: 72, cornering: 80, launch: 90, reverseSpeed: 30, driftRating: 70, offroadRating: 25, waterRating: 0, bulletResistance: 5, explosionResistance: 5, armorRating: 0, doors: 0 },
  "Dirt Bike": { traction: 80, cornering: 75, launch: 88, reverseSpeed: 25, driftRating: 75, offroadRating: 96, waterRating: 20, bulletResistance: 5, explosionResistance: 5, armorRating: 0, doors: 0 },
  Boat: { traction: 50, cornering: 55, launch: 60, reverseSpeed: 45, driftRating: 0, offroadRating: 0, waterRating: 100, bulletResistance: 20, explosionResistance: 15, armorRating: 10, doors: 0 },
  Helicopter: { traction: 40, cornering: 50, launch: 85, reverseSpeed: 70, driftRating: 0, offroadRating: 50, waterRating: 10, bulletResistance: 30, explosionResistance: 20, armorRating: 20, doors: 4 },
  Plane: { traction: 35, cornering: 45, launch: 80, reverseSpeed: 10, driftRating: 0, offroadRating: 40, waterRating: 0, bulletResistance: 25, explosionResistance: 20, armorRating: 15, doors: 4 },
  Van: { traction: 65, cornering: 55, launch: 55, reverseSpeed: 50, driftRating: 20, offroadRating: 40, waterRating: 0, bulletResistance: 45, explosionResistance: 40, armorRating: 35, doors: 4 },
  Commercial: { traction: 65, cornering: 52, launch: 52, reverseSpeed: 50, driftRating: 15, offroadRating: 38, waterRating: 0, bulletResistance: 45, explosionResistance: 40, armorRating: 38, doors: 4 },
};

/** Simplified shape so scoring.ts stays decoupled from canonical-data.ts. */
export interface CanonicalVehicleStats {
  traction?: number;
  cornering?: number;
  launch?: number;
  reverseSpeed?: number;
  driftRating?: number;
  offroadRating?: number;
  waterRating?: number;
  bulletResistance?: number;
  explosionResistance?: number;
  armorRating?: number;
  doors?: number;
}

export const WEAPON_CATEGORY_DEFAULTS: Record<string, Partial<CanonicalWeaponStats>> = {
  Pistol: { reload: 82, recoil: 72, mobility: 92, projectileSpeed: 60, damageFalloff: 55, ammoCapacity: 60 },
  SMG: { reload: 75, recoil: 62, mobility: 88, projectileSpeed: 62, damageFalloff: 50, ammoCapacity: 75 },
  "Assault Rifle": { reload: 68, recoil: 58, mobility: 72, projectileSpeed: 75, damageFalloff: 65, ammoCapacity: 80 },
  Shotgun: { reload: 45, recoil: 40, mobility: 80, projectileSpeed: 45, damageFalloff: 20, ammoCapacity: 40 },
  "Sniper Rifle": { reload: 35, recoil: 45, mobility: 55, projectileSpeed: 95, damageFalloff: 95, ammoCapacity: 25 },
  Heavy: { reload: 30, recoil: 35, mobility: 40, projectileSpeed: 55, damageFalloff: 60, ammoCapacity: 20 },
  Melee: { reload: 100, recoil: 100, mobility: 100, projectileSpeed: 0, damageFalloff: 100, ammoCapacity: 0 },
  Throwable: { reload: 70, recoil: 100, mobility: 95, projectileSpeed: 35, damageFalloff: 100, ammoCapacity: 15 },
};

/** Simplified weapon stat shape for defaults/scoring. */
export interface CanonicalWeaponStats {
  reload?: number;
  ammoCapacity?: number;
  recoil?: number;
  mobility?: number;
  projectileSpeed?: number;
  damageFalloff?: number;
}
