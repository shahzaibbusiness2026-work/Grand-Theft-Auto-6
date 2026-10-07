/**
 * rankings.ts — registry of auto-generated "Best Of" ranking pages.
 *
 * Every ranking is computed from the live catalog (CMS → DB → merged
 * catalog) at request time — nothing here is manually maintained.
 * Client-safe pure definitions; scoring comes from @/lib/scoring.
 */
import type { CanonicalVehicle, CanonicalWeapon } from "@/lib/canonical-data";
import {
  computeVehicleScore,
  computeWeaponScore,
  computeDpsIndex,
  DEFAULT_VEHICLE_WEIGHTS,
  DEFAULT_WEAPON_WEIGHTS,
} from "@/lib/scoring";

export interface VehicleRankingDef {
  slug: string;
  title: string;
  emoji: string;
  description: string;
  metricLabel: string;
  value: (v: CanonicalVehicle) => number | null;
  format: (v: CanonicalVehicle) => string;
  lowerIsBetter?: boolean;
}

export interface WeaponRankingDef {
  slug: string;
  title: string;
  emoji: string;
  description: string;
  metricLabel: string;
  value: (w: CanonicalWeapon) => number | null;
  format: (w: CanonicalWeapon) => string;
  lowerIsBetter?: boolean;
}

const vScore = (v: CanonicalVehicle) => computeVehicleScore(v, DEFAULT_VEHICLE_WEIGHTS);
const wScore = (w: CanonicalWeapon) => computeWeaponScore(w, DEFAULT_WEAPON_WEIGHTS);

const hasFeature = (v: CanonicalVehicle, ...keys: string[]) =>
  (v.features || []).some((f) => keys.some((k) => f.toLowerCase().includes(k.toLowerCase())));

const accelScore = (v: CanonicalVehicle) => Math.max(0, Math.min(100, ((6.5 - v.acceleration) / 5) * 100));

export const VEHICLE_RANKINGS: VehicleRankingDef[] = [
  {
    slug: "fastest-vehicles",
    title: "Fastest Vehicles in GTA 6",
    emoji: "🛣️",
    description:
      "Every confirmed GTA 6 vehicle ranked by top speed. The definitive fastest cars, bikes, boats and aircraft in Grand Theft Auto VI, updated automatically from our database.",
    metricLabel: "Top Speed",
    value: (v) => v.topSpeed,
    format: (v) => `${v.topSpeed} mph`,
  },
  {
    slug: "best-acceleration",
    title: "Quickest 0–60 Acceleration",
    emoji: "🚀",
    description:
      "GTA 6 vehicles ranked by 0–60 launch. Which confirmed rides in Grand Theft Auto VI hit the mark fastest, from hypercars to superbikes.",
    metricLabel: "0–60 Time",
    value: (v) => v.acceleration,
    format: (v) => `${v.acceleration}s`,
    lowerIsBetter: true,
  },
  {
    slug: "best-handling",
    title: "Best Handling Vehicles",
    emoji: "🎯",
    description:
      "The best handling cars and bikes in GTA 6, ranked by grip and cornering from our vehicle database.",
    metricLabel: "Handling",
    value: (v) => v.handling,
    format: (v) => `${v.handling}/100`,
  },
  {
    slug: "best-braking",
    title: "Best Braking Vehicles",
    emoji: "🛑",
    description: "GTA 6 vehicles with the strongest brakes, ranked from the community vehicle database.",
    metricLabel: "Braking",
    value: (v) => v.braking,
    format: (v) => `${v.braking}/100`,
  },
  {
    slug: "best-racing",
    title: "Best Racing Vehicles",
    emoji: "🏁",
    description:
      "The best race-day machines in GTA 6 — a composite of top speed, acceleration and handling computed from live database stats.",
    metricLabel: "Racing Score",
    value: (v) => Math.round((v.topSpeed / 230) * 100 * 0.4 + accelScore(v) * 0.3 + v.handling * 0.3),
    format: (v) => `${Math.round((v.topSpeed / 230) * 100 * 0.4 + accelScore(v) * 0.3 + v.handling * 0.3)} pts`,
  },
  {
    slug: "best-off-road",
    title: "Best Off-Road Vehicles",
    emoji: "🏔️",
    description:
      "Best off-road vehicles in GTA 6 for the swamps, everglades and backroads of Leonida, ranked by off-road capability.",
    metricLabel: "Off-Road",
    value: (v) => v.offroadRating ?? 0,
    format: (v) => `${v.offroadRating ?? 0}/100`,
  },
  {
    slug: "best-weaponized",
    title: "Best Weaponized Vehicles",
    emoji: "🔫",
    description:
      "Vehicles with weapons, armor and special abilities in GTA 6, ranked by combat loadout from the database.",
    metricLabel: "Combat Loadout",
    value: (v) => (hasFeature(v, "Weaponiz", "Missile", "Machine Gun", "Rockets", "Mines") ? Math.round(vehicleCombat(v)) : null),
    format: (v) => `${Math.round(vehicleCombat(v))} pts`,
  },
  {
    slug: "best-armored",
    title: "Best Armored Vehicles",
    emoji: "🛡️",
    description:
      "The most bullet-resistant and armored vehicles in GTA 6, ranked for getaway durability.",
    metricLabel: "Defense Rating",
    value: (v) => (v.armorRating ?? 0) + (v.bulletResistance ?? 0),
    format: (v) => `${v.armorRating ?? 0} armor • ${v.bulletResistance ?? 0} bullet`,
  },
  {
    slug: "cheapest-vehicles",
    title: "Cheapest Vehicles Worth Buying",
    emoji: "💰",
    description:
      "The cheapest confirmed vehicles in GTA 6 with a real price, ranked by value for money.",
    metricLabel: "Price",
    value: (v) => (v.price && v.price > 0 ? v.price : null),
    format: (v) => v.priceDisplay,
    lowerIsBetter: true,
  },
  {
    slug: "best-value-vehicles",
    title: "Best Value Vehicles",
    emoji: "🏷️",
    description:
      "Overall performance per dollar — the best cheap-but-capable rides in GTA 6, computed automatically from database stats.",
    metricLabel: "Score per $100k",
    value: (v) => (v.price && v.price > 0 ? Math.round((vScore(v) / (v.price / 100000)) * 10) / 10 : null),
    format: (v) => `${vScore(v)}/100 for ${v.priceDisplay}`,
  },
  {
    slug: "best-vehicles-overall",
    title: "Best Vehicles Overall",
    emoji: "🏆",
    description:
      "Every GTA 6 vehicle ranked by our weighted Overall Score — speed, acceleration, handling, braking, traction and special features combined.",
    metricLabel: "Overall Score",
    value: (v) => vScore(v),
    format: (v) => `${vScore(v)}/100`,
  },
];

function vehicleCombat(v: CanonicalVehicle): number {
  const feats = v.features || [];
  let s = feats.length * 12 + (v.armorRating ?? 0) * 0.4 + (v.bulletResistance ?? 0) * 0.3;
  if (v.weaponized) s += 12;
  return Math.min(100, s);
}

export const WEAPON_RANKINGS: WeaponRankingDef[] = [
  {
    slug: "highest-damage",
    title: "Highest Damage Weapons",
    emoji: "💀",
    description:
      "GTA 6 weapons ranked by damage. The hardest-hitting guns in Grand Theft Auto VI, updated automatically from the weapon database.",
    metricLabel: "Damage",
    value: (w) => w.damage,
    format: (w) => `${w.damage}/100`,
  },
  {
    slug: "fastest-firing",
    title: "Fastest Firing Weapons",
    emoji: "⚡",
    description: "The fastest firing weapons in GTA 6, ranked by fire rate from the live database.",
    metricLabel: "Fire Rate",
    value: (w) => w.fireRate,
    format: (w) => `${w.fireRate}/100`,
  },
  {
    slug: "most-accurate",
    title: "Most Accurate Weapons",
    emoji: "🎯",
    description: "Pinpoint accuracy — GTA 6 weapons ranked by accuracy rating from the weapon database.",
    metricLabel: "Accuracy",
    value: (w) => w.accuracy,
    format: (w) => `${w.accuracy}/100`,
  },
  {
    slug: "best-range",
    title: "Best Long-Range Weapons",
    emoji: "🔭",
    description: "GTA 6 weapons ranked by effective range for long-distance engagements.",
    metricLabel: "Range",
    value: (w) => w.range,
    format: (w) => `${w.range}/100`,
  },
  {
    slug: "highest-dps",
    title: "Highest DPS Weapons",
    emoji: "🔥",
    description:
      "DPS = Damage × rate of fire. The highest damage-per-second weapons in GTA 6, computed automatically — never manually entered.",
    metricLabel: "DPS Index",
    value: (w) => computeDpsIndex(w.damage, w.fireRate),
    format: (w) => `${computeDpsIndex(w.damage, w.fireRate)} DPS`,
  },
  {
    slug: "best-pistols",
    title: "Best Pistols",
    emoji: "🔫",
    description: "Every confirmed GTA 6 pistol ranked by overall combat score.",
    metricLabel: "Overall Score",
    value: (w) => (w.klass === "Pistol" ? wScore(w) : null),
    format: (w) => `${wScore(w)}/100`,
  },
  {
    slug: "best-smgs",
    title: "Best SMGs",
    emoji: "🔩",
    description: "The best submachine guns in GTA 6 ranked by overall combat score.",
    metricLabel: "Overall Score",
    value: (w) => (w.klass === "SMG" ? wScore(w) : null),
    format: (w) => `${wScore(w)}/100`,
  },
  {
    slug: "best-assault-rifles",
    title: "Best Assault Rifles",
    emoji: "🪖",
    description: "The best assault rifles in GTA 6 ranked by overall combat score.",
    metricLabel: "Overall Score",
    value: (w) => (w.klass === "Assault Rifle" ? wScore(w) : null),
    format: (w) => `${wScore(w)}/100`,
  },
  {
    slug: "best-shotguns",
    title: "Best Shotguns",
    emoji: "💥",
    description: "The best shotguns in GTA 6 ranked by overall combat score.",
    metricLabel: "Overall Score",
    value: (w) => (w.klass === "Shotgun" ? wScore(w) : null),
    format: (w) => `${wScore(w)}/100`,
  },
  {
    slug: "best-snipers",
    title: "Best Snipers",
    emoji: "🧊",
    description: "The best sniper rifles in GTA 6 ranked by overall combat score.",
    metricLabel: "Overall Score",
    value: (w) => (w.klass === "Sniper Rifle" ? wScore(w) : null),
    format: (w) => `${wScore(w)}/100`,
  },
  {
    slug: "best-weapons-overall",
    title: "Best Weapons Overall",
    emoji: "🏆",
    description:
      "Every GTA 6 weapon ranked by our weighted Overall Score — damage, fire rate, accuracy, range, reload, magazine and handling combined.",
    metricLabel: "Overall Score",
    value: (w) => wScore(w),
    format: (w) => `${wScore(w)}/100`,
  },
];

export function getRankingDef(slug: string):
  | { def: VehicleRankingDef; type: "vehicle" }
  | { def: WeaponRankingDef; type: "weapon" }
  | null {
  const v = VEHICLE_RANKINGS.find((r) => r.slug === slug);
  if (v) return { def: v, type: "vehicle" };
  const w = WEAPON_RANKINGS.find((r) => r.slug === slug);
  if (w) return { def: w, type: "weapon" };
  return null;
}

export const ALL_RANKING_SLUGS: string[] = [
  ...VEHICLE_RANKINGS.map((r) => r.slug),
  ...WEAPON_RANKINGS.map((r) => r.slug),
];
