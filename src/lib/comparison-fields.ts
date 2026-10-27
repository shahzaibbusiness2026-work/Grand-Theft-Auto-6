import type { CatalogKind, EvidenceEntry } from "./catalog-evidence";
export interface ComparisonGroup {
  name: string;
  fields: string[];
}
export function comparisonGroups(
  kind: CatalogKind,
  entries: EvidenceEntry[] = [],
): ComparisonGroup[] {
  const groups: ComparisonGroup[] =
    kind === "vehicles"
      ? [
          {
            name: "Identity & appearance",
            fields: [
              "GTA VI appearance",
              "Official name",
              "Manufacturer",
              "Vehicle class",
              "Seating",
              "Doors",
              "Drivetrain",
            ],
          },
          {
            name: "Performance",
            fields: [
              "Top speed",
              "Acceleration",
              "Braking",
              "Handling",
              "Power",
              "Weight",
              "Traction",
              "Cornering",
              "Launch",
              "Reverse speed",
              "Torque",
            ],
          },
          {
            name: "Purchase & running costs",
            fields: [
              "Price",
              "Purchase location",
              "Resale price",
              "Insurance cost",
              "Upgrade cost",
              "Repair cost",
              "Storage cost",
            ],
          },
          {
            name: "Engine & transmission",
            fields: [
              "Engine type",
              "Engine size",
              "Transmission",
              "Gears",
              "Fuel type",
              "Turbo",
              "Electric",
            ],
          },
          {
            name: "Body & capability",
            fields: [
              "Convertible",
              "Roof type",
              "Trunk capacity",
              "Off-road rating",
              "Water rating",
              "Amphibious",
            ],
          },
          {
            name: "Protection & special features",
            fields: [
              "Bullet resistance",
              "Explosion resistance",
              "Armor rating",
              "Weaponized",
              "Drift rating",
              "Special ability",
              "Features",
            ],
          },
          {
            name: "Customization & audio",
            fields: [
              "Customization options",
              "Customization",
              "Sound rating",
              "Engine sound",
              "Exhaust sound",
              "Horn",
              "Turbo sound",
              "Gear shift sound",
            ],
          },
          { name: "Availability", fields: ["Availability", "Spawn locations"] },
        ]
      : [
          {
            name: "Identity & appearance",
            fields: [
              "GTA VI appearance",
              "Official name",
              "Manufacturer",
              "Weapon class",
              "Rarity",
            ],
          },
          {
            name: "Combat performance",
            fields: [
              "Damage",
              "Fire rate",
              "Accuracy",
              "Range",
              "Handling",
              "Recoil",
              "Mobility",
              "Projectile speed",
              "Headshot multiplier",
              "Damage falloff",
            ],
          },
          {
            name: "Ammunition & operation",
            fields: [
              "Magazine size",
              "Ammo capacity",
              "Ammo type",
              "Reload time",
              "Reload speed",
              "Fire mode",
            ],
          },
          {
            name: "Purchase & availability",
            fields: [
              "Price",
              "Ammo cost",
              "Upgrade cost",
              "Availability",
              "Locations",
              "Acquisition method",
            ],
          },
          {
            name: "Equipment & customization",
            fields: ["Attachments", "Features", "Customization"],
          },
        ];
  const known = new Set(groups.flatMap((g) => g.fields).map(normalizeField));
  const extra = [
    ...new Set(entries.flatMap((e) => e.claims.map((c) => c.field))),
  ].filter((f) => !known.has(normalizeField(f)));
  return extra.length
    ? [...groups, { name: "Other reviewed fields", fields: extra }]
    : groups;
}
export function normalizeField(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}
const aliases: Record<string, string[]> = {
  topspeed: ["topspeedmph"],
  acceleration: ["060", "060launch"],
  power: ["powerhp", "horsepower"],
  magazinesize: ["magazine"],
  ammocapacity: ["reserveammo"],
  customizationoptions: ["customisationoptions"],
  spawnlocations: ["spawns"],
  firerate: ["rateoffire"],
  reloadspeed: ["reload"],
};
export function claimFor(entry: EvidenceEntry, field: string) {
  const key = normalizeField(field);
  return entry.claims.find((c) =>
    [key, ...(aliases[key] || [])].includes(normalizeField(c.field)),
  );
}
export function csvCell(value: string) {
  const safe = /^[\s]*[=+@-]/.test(value) ? "'" + value : value;
  return '"' + safe.replace(/"/g, '""') + '"';
}
export function comparisonCsv(entries: EvidenceEntry[], fields: string[]) {
  const header = [
    "Field",
    ...entries.flatMap((e) => [
      e.name,
      e.name + " source",
      e.name + " reviewed",
    ]),
  ];
  const rows = fields.map((field) => [
    field,
    ...entries.flatMap((e) => {
      const c = claimFor(e, field);
      return [
        c?.value || "Not verified",
        c ? c.source + " · " + c.locator : "",
        c ? c.reviewedAt + " · " + c.reviewer : "",
      ];
    }),
  ]);
  return [header, ...rows]
    .map((row) => row.map(csvCell).join(","))
    .join("\r\n");
}
