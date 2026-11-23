const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
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
const { publicLocation, asConcept } = require("../src/lib/world-evidence.ts");
const {
  readCatalogState,
  catalogStateUrl,
  catalogPageEntries,
  catalogSearchParams,
  catalogCanonicalPath,
  isCatalogVariant,
} = require("../src/lib/catalog-url-state.ts");
const { catalogSchema } = require("../src/lib/catalog-schema.ts");
const {
  normalizeEditorialMarkdown,
  editorialProblems,
  articleBodyMarkdown,
  articlePublicationDates,
} = require("../src/lib/editorial-quality.ts");
const entries = Array.from({ length: 60 }, (_, i) => ({
  id: "entry-" + i,
  slug: "entry-" + i,
  name: "Entry " + i,
  category: i % 2 ? "Boat" : "Car",
  claims: [],
  img: "/img/hero-dark.jpg",
}));

test("draft location confidence cannot publish unsupported mechanics or spawn associations", () => {
  const draft = {
    name: "Example shop",
    confidence: "CONFIRMED",
    source: "Trailer",
    verified: true,
    desc: "Passive income and guaranteed weapon spawns",
    hours: "08:00-23:00",
    threatLevel: "High",
    relatedWeapons: ["rifle"],
    relatedVehicles: ["car"],
  };
  const safe = publicLocation(draft);
  assert.equal(safe.confidence, "SPECULATION");
  assert.equal(safe.verified, false);
  assert.equal(safe.hours, "Unknown");
  assert.equal(safe.threatLevel, "Unknown");
  assert.deepEqual(safe.relatedWeapons, []);
  assert.deepEqual(safe.relatedVehicles, []);
  assert.doesNotMatch(safe.desc, /Passive income|guaranteed/);
  assert.equal(draft.verified, true);
  assert.equal(draft.hours, "08:00-23:00");
  assert.equal(
    asConcept({ confidence: "OFFICIAL", source: "broad homepage" }).confidence,
    "SPECULATION",
  );
});
test("public catalog URL round-trips filters and cumulative page without exposing collections", () => {
  const state = { q: "Entry", category: "Boat", sort: "reverse", page: 2, from: 1 };
  const url = catalogStateUrl(
    new URL(
      "https://www.taishgaming.com/vehicles?ids=entry-1&saved=1&recent=1",
    ),
    state,
  );
  assert.deepEqual(readCatalogState(url.searchParams, entries, 24), state);
  assert.equal(url.searchParams.get("ids"), "entry-1");
  assert.equal(url.searchParams.has("saved"), false);
  assert.equal(url.searchParams.has("recent"), false);
  const reset = catalogStateUrl(url, {
    q: "",
    category: "",
    sort: "name",
    page: 1,
  });
  assert.equal(reset.search, "?ids=entry-1");
});
test("tampered catalog filters and unbounded pagination are normalized", () => {
  const state = readCatalogState(
    new URLSearchParams({
      q: "x".repeat(999),
      category: "invented",
      sort: "recent",
      page: "999999",
    }),
    entries,
    24,
  );
  assert.equal(state.q.length, 120);
  assert.equal(state.category, "");
  assert.equal(state.sort, "name");
  assert.equal(state.page, 1);
  for (const page of ["NaN", "Infinity", "0", "-1", "1.5", "2abc", "0x2"]) {
    assert.equal(
      readCatalogState(new URLSearchParams({ page }), entries, 24).page,
      1,
    );
  }
});
test("numbered pages are distinct, while Show more can share the expanded range", () => {
  const first = readCatalogState(new URLSearchParams(), entries, 24);
  const next = readCatalogState(new URLSearchParams("page=2"), entries, 24);
  const last = readCatalogState(new URLSearchParams("page=99999"), entries, 24);
  const names = (state) => catalogPageEntries(entries, state, 24).map((e) => e.name);
  assert.deepEqual([first.page, next.page, last.page], [1, 2, 3]);
  assert.deepEqual([names(first).length, names(next).length, names(last).length], [24, 24, 12]);
  assert.equal(new Set([...names(first), ...names(next), ...names(last)]).size, 60);
  const expanded = readCatalogState(new URLSearchParams("page=2&from=1"), entries, 24);
  assert.deepEqual(names(expanded), [...names(first), ...names(next)]);
  assert.equal(readCatalogState(new URLSearchParams("page=2&from=3"), entries, 24).from, undefined);
});

test("clean pagination canonicals exclude filters, selections and expanded ranges", () => {
  const plain = catalogSearchParams({ page: ["2", "3"], utm_source: "test" });
  assert.equal(catalogCanonicalPath("vehicles", plain, entries), "/vehicles?page=2");
  assert.equal(isCatalogVariant(plain), false);
  for (const query of ["q=Entry&page=2", "category=Boat", "sort=reverse", "ids=entry-1", "page=2&from=1"]) {
    const params = new URLSearchParams(query);
    assert.equal(isCatalogVariant(params), true, query);
    assert.equal(catalogCanonicalPath("weapons", params, entries), "/weapons");
  }
  const filtered = readCatalogState(new URLSearchParams("category=Boat&sort=reverse&page=2"), entries, 24);
  assert.equal(catalogPageEntries(entries, filtered, 24).length, 6);
  assert.ok(catalogPageEntries(entries, filtered, 24).every((entry) => entry.category === "Boat"));
});
test("entity graph has stable page/entity/breadcrumb references and no fabricated offers or ratings", () => {
  const graph = catalogSchema(
    entries[0],
    "vehicles",
    "https://www.taishgaming.com",
  )["@graph"];
  const ids = new Set(graph.map((x) => x["@id"]));
  assert.equal(graph[0].mainEntity["@id"], graph[1]["@id"]);
  assert.ok(ids.has(graph[0].breadcrumb["@id"]));
  assert.equal(
    graph[2].itemListElement[2].item,
    "https://www.taishgaming.com/vehicles/entry-0",
  );
  assert.doesNotMatch(
    JSON.stringify(graph),
    /Product|Offer|aggregateRating|reviewRating|priceCurrency/,
  );
});
test("both imported trailer heading patterns are repaired while valid links remain unchanged", () => {
  for (const label of ["Launch Trailer", "Trailer 2"]) {
    const broken = `## What Did [${label}](https://www.youtube.com/watch?v=example-ID Reveal?`;
    const repaired = normalizeEditorialMarkdown(broken);
    assert.match(repaired, /example-ID\) Reveal/);
    assert.deepEqual(editorialProblems(repaired), []);
    assert.equal(normalizeEditorialMarkdown(repaired), repaired);
  }
  assert.equal(
    normalizeEditorialMarkdown("[Link](https://example.com/path)"),
    "[Link](https://example.com/path)",
  );
});
test("publish dates preserve timezone information and discard a pre-publication edit", () => {
  const published = "2026-11-19T05:00:00+05:00";
  assert.deepEqual(articlePublicationDates(published, "2026-11-18T23:00:00Z"), {
    published,
    modified: undefined,
  });
  assert.deepEqual(articlePublicationDates(published, "2026-11-19T01:00:00Z"), {
    published,
    modified: "2026-11-19T01:00:00Z",
  });
  assert.deepEqual(articlePublicationDates("invalid", "2026-11-19T01:00:00Z"), {
    published: undefined,
    modified: undefined,
  });
});
test("the actual Markdown renderer emits semantic table cells and escapes raw HTML", async () => {
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const Markdown = (await import("react-markdown")).default;
  const gfm = (await import("remark-gfm")).default;
  const html = renderToStaticMarkup(
    React.createElement(
      Markdown,
      { remarkPlugins: [gfm] },
      "| Platform | Status |\n| --- | --- |\n| Xbox Series X\\|S | Listed |\n\n<script>alert(1)</script>",
    ),
  );
  assert.match(html, /<table>/);
  assert.match(html, /<th>Platform<\/th>/);
  assert.match(html, /<td>Xbox Series X\|S<\/td>/);
  assert.doesNotMatch(html, /<script>/);
});

test("imported article titles render once while body sections stay navigable", async () => {
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const Markdown = (await import("react-markdown")).default;
  const { extractHeadings } = require("../src/lib/toc.ts");
  const title = "How Money Works in GTA 6: Robberies, Fences & the Criminal Economy";
  for (const heading of [`# ${title}`, `${title}\n===`]) {
    const body = articleBodyMarkdown(
      `${heading}\n\nIntroduction.\n\n# Robberies\n\n## Fences\n\nKeep the source links.`,
      title,
    );
    const html = renderToStaticMarkup(React.createElement(Markdown, null, body));
    assert.doesNotMatch(html, /<h1|How Money Works/);
    assert.match(html, /<h2>Robberies<\/h2>/);
    assert.match(html, /<h2>Fences<\/h2>/);
    assert.deepEqual(extractHeadings(body).map((h) => h.id), ["robberies", "fences"]);
    assert.match(html, /Introduction/);
    assert.match(html, /Keep the source links/);
  }
});

test("article heading normalization preserves fenced and indented code examples", () => {
  const code = "````markdown\n# Literal title\n```\n# Still code\n````\n\n    # Indented example\n\n  # Real section";
  const body = articleBodyMarkdown(code, "Different page title");
  assert.equal(body, code.replace("  # Real section", "  ## Real section"));
  assert.equal(articleBodyMarkdown("# A different title\n\nText", "Page title"), "## A different title\n\nText");
  const { extractHeadings } = require("../src/lib/toc.ts");
  const setext = articleBodyMarkdown("Other section\n===\n\n## Other section", "Page title");
  assert.deepEqual(extractHeadings(setext).map((heading) => heading.id), ["other-section", "other-section-2"]);
});
