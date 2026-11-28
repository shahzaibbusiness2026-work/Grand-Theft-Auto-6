const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

require.extensions[".ts"] = (module, filename) =>
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText,
    filename,
  );

const { mapView, mapFit, searchPosterPlaces, zoomAt, POSTER_PLACES, POSTER_NATIVE_ZOOM } =
  require("../src/lib/official-map.ts");

test("the public map defaults to Rockstar while older pin and filter links still open their own map", () => {
  assert.equal(mapView({}), "official");
  assert.equal(mapView({ style: "official" }), "official");
  assert.equal(mapView({ poi: "gtadb-342" }), "community");
  assert.equal(mapView({ edition: "legacy" }), "community");
  assert.equal(mapView({ q: "garage" }), "community");
  assert.equal(mapView({ view: "community" }), "community");
  assert.equal(mapView({ place: "vice-city" }), "official");
});

test("zoom keeps the map under the cursor and respects the native detail limit", () => {
  const fit = mapFit({ width: 360, height: 580 });
  assert.ok(fit.zoom > 0 && fit.zoom * 1400 < 360);
  const cursor = { x: 100, y: 200 };
  const before = { x: (cursor.x - fit.x) / fit.zoom, y: (cursor.y - fit.y) / fit.zoom };
  const view = zoomAt(fit, 100, cursor, fit.zoom);
  assert.equal(view.zoom, POSTER_NATIVE_ZOOM);
  assert.ok(Math.abs((cursor.x - view.x) / view.zoom - before.x) < 1e-6);
  assert.ok(Math.abs((cursor.y - view.y) / view.zoom - before.y) < 1e-6);
});

test("Rockstar poster labels have unique links and coordinates inside the source image", () => {
  assert.ok(POSTER_PLACES.length >= 20);
  assert.equal(new Set(POSTER_PLACES.map((p) => p.id)).size, POSTER_PLACES.length);
  assert.ok(POSTER_PLACES.every((p) => p.x > 0 && p.x < 1400 && p.y > 0 && p.y < 1400));
  assert.ok(POSTER_PLACES.find((p) => p.id === "vice-city").y > POSTER_PLACES.find((p) => p.id === "port-gellhorn").y);
});

test("search finds common regional and airport terms without creating new coordinates", () => {
  assert.ok(searchPosterPlaces("Leonida Keys").some(({ id }) => id === "permit-keys"));
  assert.deepEqual(searchPosterPlaces("Vice City airport").map(({ id }) => id), ["vcia"]);
  assert.deepEqual(searchPosterPlaces("unverified secret bunker"), []);
});

test("all poster labels have tiles at every zoom, including the north coast and southern Keys", () => {
  const assetRoot = path.resolve(__dirname, "../public/maps/rockstar-official");
  const { ranges, nativeHeight } = require(path.join(assetRoot, "source.json"));
  assert.equal(nativeHeight, Math.round(POSTER_NATIVE_ZOOM * 1400));
  for (const [level, bounds] of Object.entries(ranges)) {
    const [minX, minY, maxX, maxY] = bounds;
    const tilesPerSide = 4 * 2 ** Number(level);
    assert.deepEqual([minY, maxY], [0, tilesPerSide - 1]);
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const tile = path.join(assetRoot, "tiles", level, `${level},${y},${x}.jpg`);
        assert.ok(fs.statSync(tile).size > 0, tile);
      }
    }
    for (const region of POSTER_PLACES) {
      const x = Math.floor(region.x / 1400 * tilesPerSide);
      const y = Math.floor(region.y / 1400 * tilesPerSide);
      assert.ok(x >= minX && x <= maxX && y >= minY && y <= maxY, region.name);
    }
  }
});
