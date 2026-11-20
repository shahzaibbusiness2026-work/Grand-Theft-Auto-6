"use client";

export type MapBaseStyle = "community" | "official" | "streets";

/** [x0, y0, x1, y1] of tiles that exist per level. */
const YANIS_RANGES: Record<number, [number, number, number, number]> = {
  0: [0, 0, 3, 3],
  1: [1, 1, 6, 6],
  2: [2, 2, 12, 12],
  3: [5, 5, 25, 24],
  4: [10, 10, 51, 49],
  5: [20, 20, 103, 99],
};
const OFFICIAL_RANGES: Record<number, [number, number, number, number]> = {
  0: [0, 0, 3, 3],
  1: [1, 1, 6, 6],
  2: [2, 2, 12, 12],
  3: [5, 5, 25, 24],
};

/**
 * Only the visible local tiles load. The overview stays underneath at low
 * zoom only — at deep zoom it would be a blurry upscale, so it is hidden
 * there and uncovered sea simply shows the dark canvas behind the tiles.
 */
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
  const tileDir =
    base === "official" ? "rockstar-official" : "gtadb-yanis17";
  const ranges = base === "official" ? OFFICIAL_RANGES : YANIS_RANGES;
  const maxZ = base === "official" ? 3 : 5;
  const z = Math.min(
    maxZ,
    Math.max(0, Math.ceil(Math.log2((1400 * zoom) / 1024))),
  );
  const size = 1400 / (4 * 2 ** z);
  const [x0, y0, x1, y1] = ranges[z];
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
          src={`/maps/${tileDir}/tiles/${z}/${z},${y},${x}.jpg`}
          alt=""
          draggable={false}
          decoding="async"
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
  const showOverview = zoom < 2.5;
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ filter }}>
      {showOverview && (
        <img
          src={`/maps/${tileDir}/overview.webp`}
          alt={
            base === "official"
              ? "Rockstar's official map of Leonida"
              : "Community reconstruction of Leonida by GTADB contributors, not official game geography"
          }
          width={1536}
          height={1536}
          fetchPriority="high"
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full"
        />
      )}
      {tiles}
    </div>
  );
}
