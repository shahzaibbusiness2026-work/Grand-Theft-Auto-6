import artwork from "./community-map-assets.json";
import type { CommunityLandmark } from "./community-map";

export const MAP_CANVAS = 1400;
export const MAP_NATIVE_ZOOM = (artwork.tileSize * 4 * 2 ** 5) / MAP_CANVAS;
export const MAP_OVERVIEW = `${artwork.directory}/overview.webp?v=${artwork.artworkVersion}`;

export type MapPoint = { x: number; y: number };
export type MapSize = { width: number; height: number };
export type MapCamera = MapPoint & { zoom: number };
type MapParams = Record<string, string | string[] | undefined>;

export function mapView(params: MapParams) {
  if (params.edition === "legacy" || params.view === "community") return "planner";
  if (params.place || params.style === "official") return "explore";
  const plannerKeys = ["poi", "q", "category", "categories", "unnamed", "top", "left"];
  return params.style === "community" || params.style === "streets" ||
    plannerKeys.some((key) => params[key]) ? "planner" : "explore";
}

export function mapFit(size: MapSize): MapCamera {
  // Fit the land area in the square artwork, which leaves ocean on either side.
  const scaleX = (size.width - 24) / (MAP_CANVAS * 0.42);
  const scaleY = (size.height - 24) / (MAP_CANVAS * 0.60);
  const zoom = Math.max(0.01, Math.min(scaleX, scaleY, MAP_NATIVE_ZOOM));
  return {
    x: size.width / 2 - MAP_CANVAS * 0.40 * zoom,
    y: size.height / 2 - MAP_CANVAS * 0.48 * zoom,
    zoom,
  };
}

export function zoomAt(camera: MapCamera, target: number, anchor: MapPoint, minimum: number): MapCamera {
  const zoom = Math.max(minimum, Math.min(MAP_NATIVE_ZOOM, target));
  const ratio = zoom / camera.zoom;
  return { x: anchor.x - (anchor.x - camera.x) * ratio, y: anchor.y - (anchor.y - camera.y) * ratio, zoom };
}

export function keepMapVisible(camera: MapCamera, size: MapSize): MapCamera {
  const extent = MAP_CANVAS * camera.zoom;
  const fitAxis = (offset: number, viewport: number) => Math.max(
    Math.min(0, viewport - extent),
    Math.min(Math.max(0, viewport - extent), offset),
  );
  return { ...camera, x: fitAxis(camera.x, size.width), y: fitAxis(camera.y, size.height) };
}

export type ExplorerPlace = MapPoint & { id: string; name: string; area: string; record: string };

// Use a named community landmark to give each broad area a representative map position.
const featuredPlaces = [
  ["vice-city", "Vice City", "gtadb-L441"],
  ["leonida-keys", "Leonida Keys", "gtadb-L328"],
  ["grassrivers", "Grassrivers", "gtadb-L625"],
  ["port-gellhorn", "Port Gellhorn", "gtadb-L538"],
  ["ambrosia", "Ambrosia", "gtadb-L591"],
  ["mount-kalaga", "Mount Kalaga National Park", "gtadb-L530"],
  ["vcia", "Vice City International Airport", "gtadb-L345"],
] as const;

export function explorerPlaces(landmarks: CommunityLandmark[]) {
  const located = landmarks.flatMap((row) => {
    if (!row.position || !row.name || row.name.startsWith("Unnamed ")) return [];
    const { left, top } = row.position;
    if (!(left > 0 && left < artwork.artworkRight * 100 && top > 0 && top < 100)) return [];
    return [{ id: row.id, name: row.name, area: row.area, record: row.id, x: left * 14, y: top * 14 }];
  });
  const byId = new Map(located.map((row) => [row.id, row]));
  const featured = featuredPlaces.flatMap(([id, name, record]) => {
    const row = byId.get(record);
    return row ? [{ ...row, id, name, area: `Near ${row.name}` }] : [];
  });
  return [...featured, ...located.sort((a, b) => a.name.localeCompare(b.name))];
}

function normalize(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, " ").trim();
}

export function findExplorerPlace(places: ExplorerPlace[], id: string) {
  const direct = places.find((place) => place.id === id);
  if (direct || id.startsWith("gtadb-")) return direct;
  const matches = places.filter((place) => normalize(place.name) === normalize(id));
  return matches.length === 1 ? matches[0] : undefined;
}

export function searchExplorerPlaces(places: ExplorerPlace[], query: string) {
  const term = normalize(query);
  return places.filter((place) => normalize(`${place.name} ${place.area}`).includes(term));
}
