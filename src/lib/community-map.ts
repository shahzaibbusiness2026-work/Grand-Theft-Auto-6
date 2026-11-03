import records from "./community-map-data.json";
import type { AdminMapMarker } from "./admin-store";
export interface CommunityLandmark {
  id: string;
  name: string;
  area: string;
  types: string[];
  position: { top: number; left: number } | null;
  counterpart: string;
  reference: string;
}
export const COMMUNITY_MAP_SPACE = "gtadb-world-32768-v1";
export const communityLandmarks = records as CommunityLandmark[];
export function applyCommunityOverrides(markers: AdminMapMarker[] = []) {
  const overrides = new Map(markers.map((item) => [item.id, item]));
  return communityLandmarks.flatMap((item) => {
    const override = overrides.get(item.id);
    if (override?.visible === false) return [];
    if (!override) return [item];
    return [
      {
        ...item,
        name: override.name || item.name,
        position: item.position && {
          top: override.coordinates.y,
          left: override.coordinates.x,
        },
      },
    ];
  });
}
export const COMMUNITY_MAP_CREDIT =
  "GTA VI Map Tiles & Landmarks Data — GTADB and contributors, CC BY 4.0. Community reconstruction; not an official map.";
export function communityCategory(types: string[]) {
  const label = types.join(" ").toLowerCase();
  if (/garage|safehouse/.test(label)) return "garages";
  if (/automotive|vehicle|car_dealer|marina|boat/.test(label))
    return "vehicles";
  if (/shop|store|restaurant|cafe|food|clothing|gas_station|bar\b/.test(label))
    return "shops";
  if (/residential|hotel|property|apartment/.test(label)) return "properties";
  if (
    /nature|natural|water|forest|beach|mountain|park|island|river/.test(label)
  )
    return "nature";
  if (/transport|rail|airport|station|bridge|road|highway/.test(label))
    return "transport";
  return "poi";
}
export function nextUnvisited<T extends { id: string }>(
  items: T[],
  marked: Record<string, boolean>,
  currentId?: string,
) {
  const start = items.findIndex((item) => item.id === currentId);
  for (let offset = 1; offset <= items.length; offset++) {
    const candidate = items[(start + offset) % items.length];
    if (!marked[candidate.id]) return candidate;
  }
  return null;
}
export function clusterMapPins<
  T extends { id: string; top: string; left: string },
>(
  items: T[],
  zoom: number,
  pan: { x: number; y: number },
  viewport: { width: number; height: number },
  width = 1400,
  height = 1400,
) {
  const cells = new Map<
    string,
    { key: string; top: number; left: number; members: T[] }
  >();
  for (const item of items) {
    const x = (parseFloat(item.left) / 100) * width,
      y = (parseFloat(item.top) / 100) * height;
    const screenX = x * zoom + pan.x,
      screenY = y * zoom + pan.y;
    if (
      screenX < -80 ||
      screenY < -80 ||
      screenX > viewport.width + 80 ||
      screenY > viewport.height + 80
    )
      continue;
    const cellSize = zoom >= 4 ? 28 : 56;
    const key = `${Math.floor((x * zoom) / cellSize)}:${Math.floor((y * zoom) / cellSize)}`;
    const cell = cells.get(key) || { key, top: 0, left: 0, members: [] };
    cell.top += parseFloat(item.top);
    cell.left += parseFloat(item.left);
    cell.members.push(item);
    cells.set(key, cell);
  }
  return [...cells.values()].map((cell) => ({
    ...cell,
    top: cell.top / cell.members.length,
    left: cell.left / cell.members.length,
  }));
}
