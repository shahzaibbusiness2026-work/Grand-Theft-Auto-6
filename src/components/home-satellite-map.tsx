"use client";

import { CommunityMapWorkspace } from "./community-map-workspace";
import type { AdminMapMarker } from "@/lib/admin-store";

/**
 * Home-screen map — the SAME interactive map as /map, not the old static
 * satellite-image preview. YANIS tiles, pictogram location icons, filters,
 * detail card and map styles are all shared with the full map page.
 */
export function HomeSatelliteMap({
  markers = [],
}: {
  markers?: AdminMapMarker[];
}) {
  return <CommunityMapWorkspace markers={markers} />;
}
