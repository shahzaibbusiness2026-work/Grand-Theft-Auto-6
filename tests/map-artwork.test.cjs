const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

require.extensions[".ts"] = (module, filename) => module._compile(
  ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText, filename,
);

const root = path.resolve(__dirname, "..");

test("the public map asset directory contains no Rockstar poster or full trailer-panel tiles", () => {
  assert.ok(!fs.existsSync(path.join(root, "public/maps/rockstar-official")));
  const atlas = path.join(root, "public/maps/gtadb-yanis17");
  const source = require(path.join(atlas, "source.json"));
  const config = require(path.join(root, "src/lib/community-map-assets.json"));
  assert.equal(source.cleanArtworkVersion, config.artworkVersion);
  for (const level of Object.keys(config.upstreamRanges)) {
    const side = 4 * 2 ** Number(level);
    const maxX = Math.ceil(config.artworkRight * side) - 1;
    const files = fs.readdirSync(path.join(atlas, "tiles", level));
    assert.ok(files.length && files.every((file) => Number(file.split(",")[2].split(".")[0]) <= maxX));
  }
});

test("the explorer only pins positions supplied by the selected community snapshot", () => {
  const { explorerPlaces, findExplorerPlace, searchExplorerPlaces } = require("../src/lib/map-explorer.ts");
  const rows = require("../src/lib/community-map-data.json");
  const places = explorerPlaces(rows);
  const byId = new Map(rows.map((row) => [row.id, row]));
  assert.ok(places.length > 500);
  for (const place of places) {
    const row = byId.get(place.record);
    assert.equal(place.x, row.position.left * 14);
    assert.equal(place.y, row.position.top * 14);
  }
  assert.equal(findExplorerPlace(places, "vice-city")?.record, "gtadb-L441");
  assert.equal(findExplorerPlace(places, "permit-keys"), undefined);
  assert.ok(searchExplorerPlaces(places, "Leonida Keys").some(({ id }) => id === "leonida-keys"));
  const removed = explorerPlaces(rows.filter((row) => row.id !== "gtadb-L441"));
  assert.equal(findExplorerPlace(removed, "vice-city"), undefined);
});

test("old map links stay on-site and zoom retains its anchor", () => {
  const { mapView, mapFit, zoomAt, MAP_NATIVE_ZOOM } = require("../src/lib/map-explorer.ts");
  assert.equal(mapView({}), "explore");
  assert.equal(mapView({ style: "official" }), "explore");
  assert.equal(mapView({ place: "permit-keys" }), "explore");
  assert.equal(mapView({ poi: "gtadb-L441" }), "planner");
  assert.equal(mapView({ edition: "legacy" }), "planner");
  const camera = mapFit({ width: 390, height: 520 });
  const anchor = { x: 170, y: 230 };
  const zoomed = zoomAt(camera, 99, anchor, camera.zoom);
  assert.equal(zoomed.zoom, MAP_NATIVE_ZOOM);
  assert.ok(Math.abs((anchor.x - zoomed.x) / zoomed.zoom - (anchor.x - camera.x) / camera.zoom) < 1e-6);
});
