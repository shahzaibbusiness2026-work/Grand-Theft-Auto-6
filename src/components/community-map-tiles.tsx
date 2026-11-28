"use client";

import artwork from "../lib/community-map-assets.json";
import { MAP_CANVAS, MAP_OVERVIEW } from "../lib/map-explorer";

export type MapBaseStyle = "community" | "streets";

/** [x0, y0, x1, y1] of tiles that exist per level. */
const ranges: Record<number, number[]> = artwork.upstreamRanges;

/** Requests local tiles around the viewport. The clean overview covers loading gaps. */
export function CommunityMapTiles({
  zoom,
  pan,
  viewport,
  mode,
  base = "community",
}: {
  zoom: number;
  pan: { x: number; y: number };
  viewport: { width: number; height: number };
  mode: string;
  base?: MapBaseStyle;
}) {
  const z = Math.min(
    5,
    Math.max(0, Math.ceil(Math.log2((MAP_CANVAS * zoom) / 1024))),
  );
  const tilesPerAxis = 4 * 2 ** z;
  const size = MAP_CANVAS / tilesPerAxis;
  const [x0, y0, originalX1, y1] = ranges[z];
  const x1 = Math.min(originalX1, Math.ceil(artwork.artworkRight * tilesPerAxis) - 1);
  const tiles = [];
  for (let y = y0; y <= y1; y++)
    for (let x = x0; x <= x1; x++) {
      if (
        (x + 1) * size * zoom + pan.x < -256 ||
        (y + 1) * size * zoom + pan.y < -256 ||
        x * size * zoom + pan.x > viewport.width + 256 ||
        y * size * zoom + pan.y > viewport.height + 256
      )
        continue;
      tiles.push(
        <img
          key={`${z}:${x}:${y}`}
          src={`${artwork.directory}/tiles/${z}/${z},${y},${x}.jpg?v=${artwork.artworkVersion}`}
          alt=""
          draggable={false}
          decoding="async"
          fetchPriority={zoom < 2.5 ? "low" : undefined}
          className="absolute pointer-events-none"
          style={{
            left: x * size,
            top: y * size,
            width: size + 0.2,
            height: size + 0.2,
          }}
        />,
      );
    }
  const filter =
    base === "streets"
      ? "brightness(0.42) saturate(0.72) contrast(1.08)"
      : mode === "tactical"
        ? "grayscale(1) contrast(1.2)"
        : mode === "radar"
          ? "sepia(0.8) hue-rotate(90deg)"
          : undefined;
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ filter, background: artwork.oceanColor }}>
        <img
          src={MAP_OVERVIEW}
          alt="Community reconstruction of Leonida by GTADB and Yanis"
          width={1536}
          height={1536}
          fetchPriority="high"
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full"
        />
      {tiles}
    </div>
  );
}
