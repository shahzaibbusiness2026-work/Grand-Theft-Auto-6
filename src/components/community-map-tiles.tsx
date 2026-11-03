"use client";
const ranges: Record<number, [number, number, number, number]> = {
  0: [0, 0, 3, 3],
  1: [1, 1, 6, 6],
  2: [2, 2, 12, 12],
  3: [5, 5, 25, 24],
};
/** Only the visible local tiles load. The overview remains underneath during drags. */
export function CommunityMapTiles({
  zoom,
  pan,
  viewport,
  mode,
}: {
  zoom: number;
  pan: { x: number; y: number };
  viewport: { width: number; height: number };
  mode: string;
}) {
  const z = Math.min(
    3,
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
          src={`/maps/gtadb-yanis17/tiles/${z}/${z},${y},${x}.jpg`}
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
    mode === "tactical"
      ? "grayscale(1) contrast(1.2)"
      : mode === "radar"
        ? "sepia(0.8) hue-rotate(90deg)"
        : undefined;
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ filter }}>
      <img
        src="/maps/gtadb-yanis17/overview.webp"
        alt="Community reconstruction of Leonida by GTADB contributors, not official game geography"
        draggable={false}
        className="absolute inset-0 h-full w-full"
      />
      {tiles}
    </div>
  );
}
