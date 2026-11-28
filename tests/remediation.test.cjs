const { test } = require("node:test");
// Audit regressions: finance, editorial gates, evidence and private storage.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
// Compile pure TS modules only; no app server, database or browser required.
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
const {
  savingsScenario,
  businessScenario,
  UNREACHABLE,
} = require("../src/lib/calculators.ts");
const {
  hasGuideBody,
  normalizeEditorialMarkdown,
  readingTime,
  editorialProblems,
} = require("../src/lib/editorial-quality.ts");
const {
  extractHeadings,
} = require("../src/lib/toc.ts");
const { validClaim, claimsFor } = require("../src/lib/catalog-evidence.ts");
const {
  correctPublishedArticle,
  correctPublishedGuide,
  correctPublishedGuideContent,
} = require("../src/lib/published-editorial-corrections.ts");

test("the aircraft guide drops the dead reference and retains the route instructions", () => {
  const slug = "gta-6-planes-helicopters-locations";
  const instruction = "- **By air:** Use the dirt-mound stunt jump.";
  const original = instruction + " Our [stunt jumps guide](/guides/best-stunt-jumps-locations) has more on how these jumps work.";
  assert.equal(correctPublishedGuideContent(slug, original), instruction);
  assert.equal(correctPublishedGuideContent("unrelated-guide", original), original);
  assert.equal(correctPublishedGuideContent(slug, instruction), instruction);
});

test("the audited weapons guide gives a sourced acquisition example and newer copy takes precedence", () => {
  const legacy = "## Which weapons are confirmed for GTA 6?\n\nRockstar has officially named the **Hawk & Little Morgan Revolvers** as part of the GTA VI Ultimate Edition Upgrade.";
  const corrected = correctPublishedGuideContent("best-weapons-tier-list", legacy);
  assert.match(corrected, /\/weapons\?q=Kolt%20%26%20Associates%20556/);
  assert.match(corrected, /pcgamer\.com\/games\/grand-theft-auto\/gta-6-unique-weapons/);
  assert.equal(correctPublishedGuideContent("best-weapons-tier-list", corrected), corrected);
  assert.equal(correctPublishedGuideContent("best-weapons-tier-list", "A newer first-hand guide."), "A newer first-hand guide.");
});

test("release reporting answers the post-launch availability question and preserves the story URL", () => {
  const story = {
    slug: "gta-6-release-date-pre-order-editions",
    title: "GTA 6 Release Date, Platforms and Pre-Order Checks",
    excerpt: "GTA 6 releases November 19, 2026 on PlayStation 5 and Xbox Series X|S.",
    content: "## When Is GTA VI Coming Out?\n\nOriginal launch coverage.",
  };
  const corrected = correctPublishedArticle(story);
  assert.equal(corrected.slug, story.slug);
  assert.match(corrected.excerpt, /released November 19, 2026/);
  assert.match(corrected.content, /grand-theft-auto-vi-now-available/);
});

test("priority editorial corrections target the current public version and preserve newer CMS edits", () => {
  const wildlife = {
    slug: "vice-city-wildlife-ecosystem",
    title: "Are There Alligators in GTA 6? Sightings and Wildlife",
    excerpt: "Wildlife observations.",
    content: "## How many animals are actually in GTA 6?\n\nOriginal coverage.",
    updated_at: "2026-11-24T21:05:41.569Z",
  };
  const revised = correctPublishedArticle(wildlife);
  assert.equal(revised.slug, wildlife.slug);
  assert.match(revised.seo_title, /GTA 6 Wildlife: Alligators/);
  assert.match(revised.content, /Yes, GTA 6 has alligators/);
  assert.deepEqual(correctPublishedArticle(revised), revised);
  const newer = {
    ...wildlife,
    content: `${wildlife.content}\n\nThe headline number comes from Game Informer:`,
    updated_at: "2026-11-28T14:00:00Z",
  };
  assert.equal(correctPublishedArticle(newer), newer);
  assert.doesNotThrow(() => correctPublishedArticle({ ...wildlife, slug: "constructor" }));
});

test("the beginner guide accepts the audited apostrophe variants and removes launch-era instructions", () => {
  const guide = {
    slug: "gta-6-beginners-guide",
    title: "GTA 6 Beginner's Guide: 10 Things to Do First",
    description: "Preload advice",
    content: "## Before your first session: practical checklist\n\nCheck the release clock.",
    updated_at: "2026-11-23T05:05:01.241Z",
  };
  const revised = correctPublishedGuide(guide);
  assert.equal(revised.slug, guide.slug);
  assert.match(revised.title, /What to Do First/);
  assert.match(revised.content, /\/guides\/gta-6-xbox-controls/);
  assert.doesNotMatch(revised.content, /release clock/);
  assert.doesNotThrow(() => correctPublishedGuideContent("constructor", guide.content));
});

test("guide title, description and body refresh together while later CMS saves win", () => {
  const original = {
    slug: "heists-big-score-guide",
    title: "GTA 6 Heists and Robberies: Details and Questions",
    description: "A pre-launch guide.",
    content: "GTA VI plainly revolves around criminal jobs.",
    updated_at: "2026-11-25T09:00:00Z",
  };
  const revised = correctPublishedGuide(original);
  assert.match(revised.title, /Story Jobs, Safes and Vaults/);
  assert.match(revised.description, /Chapter 2 example/);
  assert.match(revised.content, /Hit Kingpin Bowling/);
  assert.notEqual(revised.updated_at, original.updated_at);
  assert.deepEqual(correctPublishedGuide(revised), revised);
  const newer = { ...original, updated_at: "2026-11-28T09:00:00Z" };
  assert.equal(correctPublishedGuide(newer), newer);
});

test("public editorial corrections retain the album table and respect newer CMS copy", () => {
  const original = {
    slug: "gta-6-soundtrack-the-album-out-now",
    title: "GTA 6 Soundtrack: The Album Is Out Now",
    excerpt: "Find all 34 tracks.",
    content: [
      "One honesty note before the list: Rockstar has not published the running order itself.",
      "## The full 34-track list",
      "| # | Song | Artist |",
      "|---|---|---|",
      "| 1 | Starting From Zero | Justice |",
      "The list above follows the order published today by news outlets.",
    ].join("\n\n"),
  };
  const corrected = correctPublishedArticle(original);
  assert.match(corrected.content, /\[Rockstar’s official 34-track list\]\(https:\/\/www\.rockstargames\.com\/VI\/music\)/);
  assert.match(corrected.content, /\| 1 \| Starting From Zero \| Justice \|/);
  assert.doesNotMatch(corrected.content, /has not published the running order/);
  assert.deepEqual(correctPublishedArticle(corrected), corrected);
  const edited = { ...original, content: "A newly edited introduction and its own sources." };
  assert.deepEqual(correctPublishedArticle(edited), edited);
  const unrelated = { ...original, slug: "future-soundtrack-story" };
  assert.equal(correctPublishedArticle(unrelated), unrelated);
});

test("crossplay coverage links both platforms and updates the purchase claim", () => {
  const article = correctPublishedArticle({
    slug: "is-gta-6-crossplay",
    title: "Is GTA 6 Crossplay?",
    excerpt: "Single player on PS5 and Xbox.",
    content: [
      "No — not at launch, and not because Rockstar blocked it. GTA 6 launches as a single-player game.",
      "The store listings agree. The PlayStation Store lists one player. The Microsoft Store lists only single player.",
      "| No microtransactions at launch | Confirmed | Zelnick, 17 September 2026 shareholder meeting |",
    ].join("\n\n"),
  });
  assert.match(article.content, /playstation\.com/);
  assert.match(article.content, /xbox\.com/);
  assert.match(article.content, /Optional in-game purchases/);
  assert.doesNotMatch(article.content, /No microtransactions at launch/);
  assert.deepEqual(correctPublishedArticle(article), article);
});

test("the seaplane roundup keeps its URL and distinguishes a mission sighting from a spawn", () => {
  const article = correctPublishedArticle({
    slug: "gta-6-watercraft-aircraft-guide",
    title: "From Airboats to Executive Jets: Every GTA 6 Boat, Plane & Helicopter Spotted So Far",
    excerpt: "Leonida is ocean, swamp, and open sky — so boats and aircraft matter as much as supercars in GTA 6. Here's the full watercraft and aircraft rundown from both trailers and the Extended Look, from the Airgator to the Mammoth Dodo.",
    subtitle: "Airboats, executive jets, and the Sea Sparrow on the cover",
    content: "IGN's PS5 Pro launch gameplay, with a mission objective. Our vehicle catalog lists each entry with its evidence status. Our vehicle catalog lists each entry with its evidence status.",
    seo_title: "GTA 6 Seaplane Locations & Water Planes",
    seo_description: "Where to find seaplanes and water planes in GTA 6 — every boat, plane and helicopter spotted so far, with the scene each one appears in.",
  });
  assert.equal(article.slug, "gta-6-watercraft-aircraft-guide");
  assert.match(article.title, /^GTA 6 Seaplanes/);
  assert.match(article.excerpt, /Sherwin Boatworks hangar and docks in Southwind/);
  assert.match(article.seo_description, /Find the Mammoth Dodo seaplane in Southwind/);
  assert.match(article.content, /youtube\.com\/watch\?v=3PiR0G3rVw8/);
  assert.equal(article.content.match(/Our vehicle catalog lists each entry/g).length, 1);
  assert.deepEqual(correctPublishedArticle(article), article);
});

test("the wildlife article cites the source of a sighting and qualifies repeatable spawns", () => {
  const article = correctPublishedArticle({
    slug: "vice-city-wildlife-ecosystem",
    title: "The Living State: Alligators, Everglades & Dynamic Ecosystems",
    excerpt: "An edited summary that should remain.",
    content: "Yes — alligators are in GTA 6. They prowl the Grassrivers swamps, turn up in suburban swimming pools, and star in one famous Trailer 1 shot walking through a convenience store.",
  });
  assert.match(article.title, /^Are There Alligators in GTA 6/);
  assert.equal(article.excerpt, "An edited summary that should remain.");
  assert.match(article.content, /gameinformer\.com\/exclusive/);
  assert.match(article.content, /repeatable free-roam spawn .* remains unverified/);
  assert.deepEqual(correctPublishedArticle(article), article);
});

test("zero income cannot produce a completion date or mission count", () => {
  const r = savingsScenario(0, 1000, 0, 0, 3);
  assert.equal(r.missionsNeeded, UNREACHABLE);
  assert.equal(r.hoursNeeded, UNREACHABLE);
  assert.equal(r.completionDateStr, UNREACHABLE);
});
test("zero daily time cannot produce a calendar date", () => {
  const r = savingsScenario(0, 1000, 500, 100, 0);
  assert.equal(r.hoursNeeded, 10);
  assert.equal(r.daysNeeded, UNREACHABLE);
  assert.equal(r.completionDateStr, UNREACHABLE);
});
test("completed and zero goals need no further income or time", () => {
  for (const r of [
    savingsScenario(1000, 500, 0, 0, 0),
    savingsScenario(0, 0, 0, 0, 0),
  ]) {
    assert.equal(r.progressPct, 100);
    assert.equal(r.remaining, 0);
    assert.equal(r.hoursNeeded, 0);
    assert.equal(r.missionsNeeded, 0);
  }
});
test("ordinary goal counts missions by ceiling and computes hours", () => {
  const r = savingsScenario(
    100,
    1100,
    300,
    200,
    2,
    new Date("2026-10-27T12:00:00Z"),
  );
  assert.equal(r.missionsNeeded, 4);
  assert.equal(r.hoursNeeded, 5);
  assert.equal(r.daysNeeded, 2.5);
});
test("invalid inputs never propagate NaN or Infinity", () => {
  const r = savingsScenario(NaN, Infinity, -1, NaN, -2);
  assert.equal(JSON.stringify(r).includes("null"), false);
  assert.equal(r.progressPct, 100);
});
test("losses remain negative and cannot recover an investment", () => {
  const r = businessScenario({
    purchasePrice: 1000,
    upgradeCost: 500,
    grossRevenuePerHour: 100,
    operatingCostPerHour: 150,
    hoursPerDay: 4,
  });
  assert.equal(r.netProfitPerHour, -50);
  assert.equal(r.netProfitPerDay, -200);
  assert.equal(r.breakEvenHours, UNREACHABLE);
  assert.equal(r.breakEvenDays, UNREACHABLE);
  assert.ok(r.annualRoiPct < 0);
});
test("zero working hours and zero investment are separate cases", () => {
  assert.equal(
    businessScenario({
      purchasePrice: 100,
      upgradeCost: 0,
      grossRevenuePerHour: 10,
      operatingCostPerHour: 0,
      hoursPerDay: 0,
    }).breakEvenDays,
    UNREACHABLE,
  );
  assert.equal(
    businessScenario({
      purchasePrice: 0,
      upgradeCost: 0,
      grossRevenuePerHour: 0,
      operatingCostPerHour: 0,
      hoursPerDay: 0,
    }).breakEvenHours,
    0,
  );
});
test("daily business hours cannot exceed a calendar day", () => {
  assert.equal(
    businessScenario({
      purchasePrice: 240,
      upgradeCost: 0,
      grossRevenuePerHour: 10,
      operatingCostPerHour: 0,
      hoursPerDay: 100,
    }).netProfitPerDay,
    240,
  );
});
test("guide summaries and empty bodies cannot masquerade as full guides", () => {
  assert.equal(hasGuideBody({ content: "  " }), false);
  assert.equal(
    hasGuideBody({ content: "Same summary", description: "Same summary" }),
    false,
  );
  assert.equal(
    hasGuideBody({
      content: "## Evidence\nA source-checked explanation.",
      description: "Summary",
    }),
    true,
  );
  assert.equal(readingTime("word ".repeat(221)), "2 min read");
});
test("the imported malformed heading yields readable, matching navigation ids", () => {
  const input =
    "## GTA 6 [Launch Trailer](https://www.youtube.com/watch?v=rz1B4B2yBZY: The Main Takeaways";
  const body = normalizeEditorialMarkdown(input);
  const headings = extractHeadings(body);
  assert.equal(headings[0].text, "GTA 6 Launch Trailer: The Main Takeaways");
  assert.equal(headings[0].id, "gta-6-launch-trailer-the-main-takeaways");
  assert.equal(normalizeEditorialMarkdown(body), body);
});
test("guide jump links match rendered headings with entities, indentation and fenced code", async () => {
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const { default: Markdown } = await import("react-markdown");
  const { default: gfm } = await import("remark-gfm");
  const input = "## GTA &amp; Xbox\n\n```\n## Driving\n```\n\n## Driving\n\n   ## Aiming";
  const headings = extractHeadings(input);
  assert.deepEqual(headings.map(({ id }) => id), ["gta-xbox", "driving", "aiming"]);
  const ids = new Map(headings.map(({ offset, id }) => [offset, id]));
  const html = renderToStaticMarkup(React.createElement(Markdown, {
    remarkPlugins: [gfm],
    components: {
      h2: ({ node, children }) => React.createElement("h2", { id: ids.get(node.position.start.offset) }, children),
    },
  }, input));
  for (const { id } of headings) assert.ok(html.includes(`id="${id}"`), id);
});
test("a source URL alone cannot verify a whole entity or a field", () => {
  const c = {
    kind: "vehicles",
    id: "test",
    field: "Top speed",
    value: "100 mph",
    source: "https://example.com/source",
    locator: "test measurement, section 2",
    reviewedAt: "2026-10-26",
    reviewer: "Reviewer",
  };
  assert.equal(validClaim(c), true);
  for (const change of [
    { source: "javascript:alert(1)" },
    { locator: "" },
    { reviewer: "" },
    { reviewedAt: "2100-01-01" },
    { source: "https://user:pass@example.com" },
  ])
    assert.equal(validClaim({ ...c, ...change }), false);
  assert.deepEqual(claimsFor("vehicles", "not-reviewed"), []);
});
test("unsubscribe tokens bind an address and subscription without accepting tampering", () => {
  process.env.NEWSLETTER_TOKEN_SECRET = "test-only-secret-never-used-by-an-app";
  const {
    newsletterToken,
    verifyNewsletterToken,
  } = require("../src/lib/newsletter-tokens.ts");
  const token = newsletterToken("Reader@example.org", "2026-10-26T00:00:00Z");
  assert.deepEqual(verifyNewsletterToken(token), {
    email: "reader@example.org",
    subscribedAt: "2026-10-26T00:00:00Z",
  });
  const parts = token.split(".");
  assert.equal(verifyNewsletterToken(parts[0] + "." + parts[1] + "x"), null);
  assert.equal(
    verifyNewsletterToken(
      Buffer.from(
        JSON.stringify({
          email: "other@example.org",
          subscribedAt: "2026-10-26",
        }),
      ).toString("base64url") +
        "." +
        parts[1],
    ),
    null,
  );
  assert.equal(verifyNewsletterToken("not-a-token"), null);
  assert.equal(verifyNewsletterToken("x".repeat(3000)), null);
  assert.equal(
    businessScenario({
      purchasePrice: 0,
      upgradeCost: 0,
      grossRevenuePerHour: 10,
      operatingCostPerHour: 0,
      hoursPerDay: 1,
    }).annualRoiPct,
    null,
  );
});
test("a private storage failure never writes a public fallback", async () => {
  const Module = require("node:module"),
    original = Module._load,
    seen = [];
  const client = {
    from(table) {
      seen.push(table);
      return {
        upsert: async () => ({ error: { message: "unavailable" } }),
        select() {
          return this;
        },
        eq() {
          return this;
        },
        maybeSingle: async () => ({
          error: { message: "unavailable" },
          data: null,
        }),
      };
    },
  };
  Module._load = function (request, ...args) {
    if (request === "@/lib/supabase/admin")
      return { createAdminClient: () => client };
    return original.call(this, request, ...args);
  };
  let privateSettings;
  try {
    privateSettings = require("../src/lib/services/private-settings.ts");
  } finally {
    Module._load = original;
  }
  assert.equal(
    await privateSettings.setPrivateSetting("newsletter_subscribers", []),
    false,
  );
  await assert.rejects(
    () => privateSettings.getPrivateSetting("newsletter_subscribers"),
    /unavailable/,
  );
  assert.deepEqual(seen, ["private_settings", "private_settings"]);
});

test("publishing rejects unclosed heading links while allowing valid links and fenced examples", () => {
  assert.equal(
    editorialProblems("## [Rockstar](https://www.rockstargames.com/VI").length,
    1,
  );
  assert.deepEqual(
    editorialProblems(
      "## [Rockstar](https://www.rockstargames.com/VI): Overview",
    ),
    [],
  );
  const fence = String.fromCharCode(96).repeat(3);
  assert.deepEqual(
    editorialProblems(fence + "\n## [Example](https://example.org\n" + fence),
    [],
  );
});

const comparisonHelpers = require("../src/lib/comparison-fields.ts");
test("comparison keeps unsupported fields unknown and includes every reviewed extension", () => {
  const entry = {
    id: "fixture",
    slug: "fixture",
    name: "Fixture",
    category: "Sports Car",
    img: "",
    claims: [],
  };
  assert.equal(comparisonHelpers.claimFor(entry, "Top speed"), undefined);
  assert.match(
    comparisonHelpers.comparisonCsv([entry], ["Top speed"]),
    /Not verified/,
  );
  const sourced = {
    ...entry,
    claims: [
      {
        field: "topSpeed",
        value: "100 mph",
        source: "https://example.org/source",
        locator: "Fixture measurement",
        reviewer: "Test reviewer",
        reviewedAt: "2026-10-26",
      },
      { field: "Reviewed custom feature", value: "Fixture value" },
    ],
  };
  assert.equal(
    comparisonHelpers.claimFor(sourced, "Top speed").value,
    "100 mph",
  );
  assert.ok(
    comparisonHelpers
      .comparisonGroups("vehicles", [sourced])
      .some((g) => g.fields.includes("Reviewed custom feature")),
  );
  assert.match(
    comparisonHelpers.comparisonCsv([sourced], ["Top speed"]),
    /https:\/\/example.org\/source/,
  );
});
test("comparison exports escape spreadsheet formulas and quotes", () => {
  assert.equal(comparisonHelpers.csvCell("=SUM(1,2)"), '"\'=SUM(1,2)"');
  assert.equal(comparisonHelpers.csvCell('Say "hello"'), '"Say ""hello"""');
  assert.ok(comparisonHelpers.csvCell("@command").includes("'@command"));
});

const {
  selectionFromParams,
  selectionUrl,
} = require("../src/lib/catalog-selection.ts");
test("shared comparisons resolve legacy slugs, remove unknowns and duplicates, and stop at four picks", () => {
  const entries = Array.from({ length: 5 }, (_, index) => ({
    id: "id-" + index,
    slug: "slug-" + index,
  }));
  assert.deepEqual(
    selectionFromParams(
      new URLSearchParams("v=slug-0,id-0,unknown,slug-1,id-2,id-3,id-4"),
      "vehicles",
      entries,
    ),
    ["id-0", "id-1", "id-2", "id-3"],
  );
  assert.deepEqual(
    selectionFromParams(new URLSearchParams("w=slug-1"), "weapons", entries),
    ["id-1"],
  );
  assert.deepEqual(
    selectionFromParams(
      new URLSearchParams("ids=&v=id-1"),
      "vehicles",
      entries,
    ),
    [],
  );
});
test("comparison URLs preserve unrelated parameters and remove legacy selections on reset", () => {
  const original = new URL(
    "https://example.org/compare/vehicles?v=old&w=other&view=full#details",
  );
  const selected = selectionUrl(original, ["one", "two"]);
  assert.equal(selected.searchParams.get("ids"), "one,two");
  assert.equal(selected.searchParams.get("view"), "full");
  assert.equal(selected.hash, "#details");
  assert.equal(selected.searchParams.has("v"), false);
  assert.equal(selected.searchParams.has("w"), false);
  assert.equal(selectionUrl(selected, []).searchParams.has("ids"), false);
  assert.equal(original.searchParams.get("v"), "old");
});
