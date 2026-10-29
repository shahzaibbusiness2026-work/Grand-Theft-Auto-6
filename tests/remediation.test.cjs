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
  createHeadingIdAllocator,
} = require("../src/lib/toc.ts");
const { validClaim, claimsFor } = require("../src/lib/catalog-evidence.ts");
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
  const allocate = createHeadingIdAllocator();
  assert.equal(
    headings[0].id,
    allocate("GTA 6 Launch Trailer: The Main Takeaways"),
  );
  assert.equal(normalizeEditorialMarkdown(body), body);
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
