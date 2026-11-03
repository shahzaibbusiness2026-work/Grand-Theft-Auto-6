const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const ts = require("typescript");
require.extensions[".ts"] = (module, filename) =>
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    }).outputText,
    filename,
  );
const { WORLD_MEDIA, worldImageSchema } = require("../src/lib/world-media.ts");
const {
  WORLD_SECTIONS,
  WORLD_CATEGORIES,
  getWorldCategory,
} = require("../src/lib/gta-world.ts");
const {
  canonicalVehicles,
  canonicalWeapons,
} = require("../src/lib/canonical-data.ts");
const {
  catalogArtwork,
  relatedCatalogScene,
} = require("../src/lib/catalog-artwork.ts");

test("reviewed world media has intact local files and explicit primary-source provenance", () => {
  for (const media of Object.values(WORLD_MEDIA)) {
    assert.match(media.src, /^\/img\/world-evidence\/gta-6-[a-z0-9-]+\.webp$/);
    const data = fs.readFileSync(path.join(__dirname, "../public", media.src));
    assert.equal(
      crypto.createHash("sha256").update(data).digest("hex"),
      media.sha256,
    );
    assert.ok(data.length < 180_000, media.src);
    assert.equal(media.width, 1280);
    assert.ok(media.height > 0 && media.height <= 720);
    assert.equal(new URL(media.sourceUrl).hostname, "www.rockstargames.com");
    assert.ok(media.alt.length > 30 && media.alt.length < 200);
    assert.ok(media.note.length > 20);
    if (media.kind === "trailer")
      assert.ok(
        Number.isInteger(media.seconds) &&
          media.seconds >= 0 &&
          media.seconds < 180,
      );
  }
});

test("every GTA6 hub card has a reviewed image matching its visible description", () => {
  for (const card of WORLD_SECTIONS.flatMap((section) => section.cards)) {
    const media = WORLD_MEDIA[card.href];
    assert.ok(media, card.href);
    assert.equal(card.image, media.src);
    assert.equal(card.imageAlt, media.alt);
  }
  assert.ok(WORLD_SECTIONS.flatMap((s) => s.cards).length >= 18);
});

test("birds, mammals and marine life remain distinct source-backed destinations", () => {
  assert.equal(
    new Set(WORLD_CATEGORIES.map((c) => c.slug)).size,
    WORLD_CATEGORIES.length,
  );
  for (const slug of ["birds", "mammals", "marine-life"]) {
    const category = getWorldCategory(slug);
    assert.ok(category);
    assert.ok(category.entries.length > 0);
    assert.ok(
      category.entries.every((entry) =>
        entry.sourceHref?.startsWith("https://"),
      ),
    );
    assert.ok(category.notConfirmed.length >= 3);
  }
  assert.ok(
    getWorldCategory("birds-marine-life"),
    "Existing combined URL remains available",
  );
});

test("catalogs resolve missing imagery without inventing an exact model photo or appearance evidence", () => {
  for (const [kind, rows] of [
    ["vehicles", canonicalVehicles],
    ["weapons", canonicalWeapons],
  ]) {
    for (const entry of rows) {
      const artwork = catalogArtwork(kind, entry);
      assert.ok(
        artwork.src &&
          fs.existsSync(path.join(__dirname, "../public", artwork.src)),
        entry.id,
      );
      if (artwork.contextual) {
        assert.equal(artwork.label, "Related trailer scene");
        assert.match(artwork.caption, /exact image.*not verified/);
      }
    }
  }
  const original = {
    id: "unknown",
    name: "Unreviewed model",
    img: "",
    claims: [],
  };
  assert.ok(catalogArtwork("weapons", original).contextual);
  assert.deepEqual(original.claims, []);
  assert.equal(
    relatedCatalogScene("vehicles").sourceUrl,
    "https://www.rockstargames.com/VI/trailer-2",
  );
});

test("image schema credits Rockstar without assigning an invented redistribution license", () => {
  const media = WORLD_MEDIA["/gta-6-world/mammals"];
  const graph = worldImageSchema(
    media,
    "https://www.taishgaming.com/gta-6-world/mammals",
  );
  assert.equal(graph.creditText, "Rockstar Games");
  assert.equal(graph.caption, media.alt);
  assert.equal(
    graph["@id"],
    "https://www.taishgaming.com/gta-6-world/mammals#primaryimage",
  );
  assert.equal(graph.license, undefined);
  assert.equal(graph.aggregateRating, undefined);
});
