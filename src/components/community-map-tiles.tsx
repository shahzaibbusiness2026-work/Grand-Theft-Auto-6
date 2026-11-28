"use client";

import officialMapSource from "../../public/maps/rockstar-official/source.json";

export type MapBaseStyle = "community" | "official" | "streets";

/** [x0, y0, x1, y1] of tiles that exist per level. */
const YANIS_RANGES: Record<number, [number, number, number, number]> = {
  0: [0, 0, 3, 3],
  1: [1, 1, 6, 6],
  2: [2, 2, 12, 12],
  3: [5, 5, 25, 24],
  4: [10, 10, 51, 49],
  5: [21, 21, 103, 99],
};
const OFFICIAL_RANGES: Record<number, number[]> = officialMapSource.ranges;

/**
 * Only visible local tiles load. The official overview stays beneath the
 * tiles so the poster remains visible while a higher level loads.
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
  const showOverview = base === "official" || zoom < 2.5;
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
      {/* Poster-margin masks (YANIS base only): the YANIS poster's map
          image occupies only the central square (12.5%–81.25% on both
          axes); everything outside it is flat pale poster background
          (#6396AC). The tile grid never covers those margins (tiles start
          at canvas 175px), so without a mask the overview shows a pale
          blue-grey band west of the island and pale strips top/bottom —
          it reads as a rendering bug, not ocean. The legend / credits /
          trailer-thumbnail side panel is likewise baked into the tiles
          on the right ~38% of the canvas. All four margins are covered
          with the surrounding ocean colour (#2C66A5), in canvas
          coordinates so they pan/zoom with the map, and inside the
          filtered container so the Streets / tactical / radar filters
          apply to them too. No land or pin sits in any masked area
          (land spans ~21–60% left, ~20–76% top), and the mask colour
          matches the tile ocean, so the seams are invisible. The
          official base has no such panel or margins, so all masks are
          skipped there. */}
      {base !== "official" && (
        <>
          <div
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{ left: 0, top: 0, width: "12.5%", height: "100%", background: "#2C66A5" }}
          />
          <div
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{ left: 0, top: 0, width: "100%", height: "12.5%", background: "#2C66A5" }}
          />
          <div
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{ left: 0, top: "81.25%", width: "100%", height: "18.75%", background: "#2C66A5" }}
          />
          <div
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{
              left: "61%",
              top: 0,
              width: "39%",
              height: "100%",
              background: "#2C66A5",
            }}
          />
        </>
      )}
    </div>
  );
}
