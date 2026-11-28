import officialMapSource from "../../public/maps/rockstar-official/source.json";

export const POSTER_CANVAS = 1400;
export const POSTER_NATIVE_ZOOM = officialMapSource.nativeHeight / POSTER_CANVAS;

export type MapPoint = { x: number; y: number };
export type MapSize = { width: number; height: number };
export type MapCamera = MapPoint & { zoom: number };
type MapParams = Record<string, string | string[] | undefined>;

export function mapView(params: MapParams) {
  if (params.edition === "legacy" || params.view === "community") return "community";
  if (params.style === "official" || params.place) return "official";
  const legacyKeys = ["poi", "q", "category", "categories", "unnamed", "top", "left"];
  return params.style === "community" || params.style === "streets" ||
    legacyKeys.some((key) => params[key]) ? "community" : "official";
}

export function mapFit(size: MapSize): MapCamera {
  const zoom = Math.max(0.01, (Math.min(size.width, size.height) - 24) / POSTER_CANVAS);
  return { x: (size.width - POSTER_CANVAS * zoom) / 2, y: (size.height - POSTER_CANVAS * zoom) / 2, zoom };
}

export function zoomAt(camera: MapCamera, target: number, anchor: MapPoint, minimum: number) {
  const zoom = Math.max(minimum, Math.min(POSTER_NATIVE_ZOOM, target));
  const ratio = zoom / camera.zoom;
  return { x: anchor.x - (anchor.x - camera.x) * ratio, y: anchor.y - (anchor.y - camera.y) * ratio, zoom };
}

export function keepPosterVisible(camera: MapCamera, size: MapSize): MapCamera {
  const extent = POSTER_CANVAS * camera.zoom;
  const fitAxis = (offset: number, viewport: number) => Math.max(
    Math.min(0, viewport - extent),
    Math.min(Math.max(0, viewport - extent), offset),
  );
  return { ...camera, x: fitAxis(camera.x, size.width), y: fitAxis(camera.y, size.height) };
}

// Centers of printed labels measured on the bundled 1536 × 1536 Rockstar
// poster preview. These belong to this image's coordinate system.
const labels = [
  ["abismo-key", "Abismo Key", 707, 1400],
  ["ambrosia", "Ambrosia", 829, 536],
  ["bayside", "Bayside", 1026, 724],
  ["belville", "Belville", 949, 598],
  ["bonanza", "Bonanza", 748, 187],
  ["breakwater-quarry", "Breakwater Quarry", 690, 904],
  ["buckskin-swamp", "Buckskin Swamp", 748, 721],
  ["capri", "Capri", 516, 812],
  ["crosstown", "Crosstown", 1002, 762],
  ["dalton-island", "Dalton Island", 1199, 921],
  ["downtown", "Downtown", 1004, 824],
  ["draper-island", "Draper Island", 465, 445],
  ["emerald-springs", "Emerald Springs", 724, 639],
  ["gloriana-key", "Gloriana Key", 1117, 973],
  ["grassrivers", "Grassrivers", 713, 1031],
  ["grayson", "Grayson", 625, 312],
  ["hamlet", "Hamlet", 847, 1069],
  ["hyde-island", "Hyde Island", 853, 145],
  ["kelly-county", "Kelly County", 677, 597],
  ["key-lento", "Key Lento", 848, 1306],
  ["lake-leonida", "Lake Leonida", 891, 466],
  ["la-perle", "La Perle", 980, 710],
  ["leonard-county", "Leonard County", 1007, 540],
  ["little-cuba", "Little Cuba", 951, 823],
  ["lummox-county", "Lummox County", 770, 285],
  ["mariana-county", "Mariana County", 666, 1139],
  ["maroon-key", "Maroon Key", 707, 1352],
  ["mile-zero-air-station", "Mile Zero Air Station", 507, 1363],
  ["millport", "Millport", 956, 332],
  ["mount-kalaga", "Mount Kalaga National Park", 763, 326],
  ["ocean-beach", "Ocean Beach", 1194, 804],
  ["permit-keys", "Permit Keys", 606, 1323],
  ["port-gellhorn", "Port Gellhorn", 535, 538],
  ["port-vice-city", "Port Vice City", 1130, 859],
  ["rialto-islands", "Rialto Islands", 1080, 714],
  ["southwind", "Southwind", 564, 1340],
  ["starfish-island", "Starfish Island", 1110, 791],
  ["stockyard", "Stockyard", 1030, 685],
  ["tequesta", "Tequesta", 974, 922],
  ["vcia", "VCIA", 846, 882],
  ["vespucci-island", "Vespucci Island", 1093, 748],
  ["vice-beach", "Vice Beach", 1183, 749],
  ["vice-city", "Vice City", 969, 801],
  ["vice-dale-county", "Vice-Dale County", 1033, 886],
  ["waning-sands", "Waning Sands", 1050, 482],
  ["washington-beach", "Washington Beach", 1199, 679],
  ["watson-bay", "Watson Bay", 688, 1097],
] as const;

export const POSTER_PLACES = labels.map(([id, name, x, y]) => ({
  id,
  name,
  x: x * POSTER_CANVAS / 1536,
  y: y * POSTER_CANVAS / 1536,
})).sort((first, second) => first.name.localeCompare(second.name));

const areaAliases: Partial<Record<(typeof labels)[number][0], string>> = {
  "abismo-key": "leonida keys",
  "key-lento": "leonida keys",
  "maroon-key": "leonida keys",
  "mile-zero-air-station": "leonida keys",
  "permit-keys": "leonida keys",
  southwind: "leonida keys",
  vcia: "vice city international airport vice city airport",
};

export function searchPosterPlaces(query: string) {
  const normalized = query.trim().toLowerCase().replace(/\s+/g, " ");
  return POSTER_PLACES.filter(({ id, name }) =>
    name.toLowerCase().includes(normalized) || areaAliases[id]?.includes(normalized),
  );
}
