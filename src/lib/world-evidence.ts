import type { CanonicalLocation } from "./canonical-data";

/** Draft confidence labels cannot establish field-level public evidence. */
export function asConcept<T extends { confidence: string; source: string }>(
  record: T,
): T {
  return {
    ...record,
    confidence: "SPECULATION",
    source: "Fan concept; gameplay values are not source-approved",
  };
}

export function publicLocation(record: CanonicalLocation): CanonicalLocation {
  return {
    ...asConcept(record),
    verified: false,
    desc: `Provisional editorial entry for ${record.name}. Its identification, placement and availability in GTA VI have not passed field-specific evidence review.`,
    hours: "Unknown",
    threatLevel: "Unknown",
    relatedVehicles: [],
    relatedWeapons: [],
    relatedMissions: [],
  };
}
