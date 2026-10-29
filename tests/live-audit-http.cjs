const assert = require("node:assert/strict");
const fs = require("node:fs");
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3002";
const checks = [];
const cache = new Map();
async function page(path) {
  if (!cache.has(path))
    cache.set(
      path,
      (async () => {
        const r = await fetch(base + path, {
          signal: AbortSignal.timeout(30000),
        });
        const html = await r.text();
        assert.equal(r.status, 200, path);
        return {
          html,
          text: html
            .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " "),
        };
      })(),
    );
  return cache.get(path);
}
async function check(name, fn) {
  try {
    await fn();
    checks.push({ name, pass: true });
    console.log("PASS " + name);
  } catch (e) {
    checks.push({ name, pass: false, error: e.message });
    console.log("FAIL " + name + ": " + e.message.slice(0, 250));
  }
}
const noindex = (html) =>
  /<meta name="robots" content="[^"]*noindex/.test(html);
(async () => {
  await check(
    "location dossier withholds hours, spawn associations and response-time precision",
    async () => {
      const { html, text } = await page("/locations/the-malibu-nightclub");
      assert.ok(noindex(html));
      assert.match(text, /Fan concept/);
      assert.match(text, /availability.*have not passed field-specific evidence review/);
      assert.doesNotMatch(text, /21:00|90s|passive.revenue/i);
    },
  );
  await check(
    "mission example cannot claim official-media verification",
    async () => {
      const { html, text } = await page("/missions/welcome-to-leonida");
      assert.ok(noindex(html));
      assert.match(text, /Fan concept/);
      assert.doesNotMatch(text, /Observed in Official Media/);
    },
  );
  await check(
    "property cards are concepts rather than confirmed properties",
    async () => {
      const { text } = await page("/properties");
      assert.match(text, /Fan Property Concepts/);
      assert.doesNotMatch(text, /Confirmed Properties/);
    },
  );
  await check(
    "activity planning does not advertise confirmed playable mechanics",
    async () => {
      const { text } = await page("/activities");
      assert.match(text, /Fan activity ideas/);
      assert.doesNotMatch(text, /Activities marked Confirmed|activities tried/);
    },
  );
  await check(
    "weather evidence has usable sources and withdraws unsupported precision",
    async () => {
      const { html, text } = await page("/gta-6-world/weather-climate");
      assert.match(text, /withdrawn pending traceable source review/);
      assert.match(html, /href="https:\/\/www.rockstargames.com\/VI"/);
      assert.doesNotMatch(
        text,
        /Rockstar confirms Leonida.*seasonal hurricanes/,
      );
    },
  );
  await check(
    "initial map markup makes no seeded personal completion assertion",
    async () => {
      const { html, text } = await page("/map");
      assert.doesNotMatch(
        text,
        /Verified Visited|Completed ✔|3 \/ 18|LIVE GPS/,
      );
      assert.match(html, /Fan illustration of Leonida/);
      assert.match(text, /Browse.*visible pins as a text list/);
    },
  );
  await check(
    "release article withdraws precise logistics and absolute purchase assurances",
    async () => {
      const { html, text } = await page(
        "/news/gta-6-release-date-pre-order-editions",
      );
      assert.match(text, /Preload opening.*Confirmed: November 12, 2026/);
      assert.match(text, /November 19, 2026/);
      assert.match(text, /Regional unlock time.*Unverified here/);
      assert.match(html, /https:\/\/www.take2games.com\/ir\/news\/rockstar-games-announces-pre-orders-grand-theft-auto-vi/);
      assert.doesNotMatch(
        text,
        /pre-ordering is low-risk|there.s genuinely no downside/,
      );
      assert.match(html, /<table/);
    },
  );
  await check("article and guide tables are semantic HTML", async () => {
    for (const path of [
      "/news/gta-6-trailer-2-breakdown",
      "/guides/vice-city-map-guide",
    ]) {
      const { html } = await page(path);
      assert.match(html, /<table/);
      assert.match(html, /<th/);
      assert.doesNotMatch(html, /<h[23][^>]*>[^<]*\[[^<]*https:/);
    }
  });
  await check(
    "corrected map-size deck matches the narrower evidence boundary",
    async () => {
      const { text } = await page("/news/map-size-comparison-gtav-rdr2");
      assert.doesNotMatch(
        text,
        /Scale projections based on GPS telemetry leaks/,
      );
      assert.match(text, /comparison limits|comparison.*measurement/i);
    },
  );
  await check(
    "article byline and structured author share an identity and profile anchor",
    async () => {
      const { html } = await page(
        "/news/gta-6-port-gellhorn-forgotten-coast-guide",
      );
      assert.match(html, /href="\/team#editorial-team"/);
      const graphs = [
        ...html.matchAll(
          /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
        ),
      ].map((x) => JSON.parse(x[1]));
      const a = graphs
        .flatMap((x) => x["@graph"] || [x])
        .find((x) => x["@type"] === "Article");
      assert.equal(a.author.name, "Taish Gaming Editorial Team");
      assert.equal(
        a.author["@id"],
        "https://www.taishgaming.com/team#editorial-team",
      );
    },
  );
  await check(
    "reviewed entry intro agrees with its review block and has entity/breadcrumb markup",
    async () => {
      const { html, text } = await page("/vehicles/vapid-ganado");
      assert.match(text, /appearance claim has been reviewed/);
      assert.doesNotMatch(text, /This entry is awaiting field-by-field/);
      const graphs = [
        ...html.matchAll(
          /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
        ),
      ].map((x) => JSON.parse(x[1]));
      const all = graphs.flatMap((x) => x["@graph"] || [x]);
      assert.ok(all.some((x) => x["@type"] === "Thing"));
      assert.ok(all.some((x) => x["@type"] === "BreadcrumbList"));
      assert.doesNotMatch(JSON.stringify(all), /aggregateRating|priceCurrency/);
    },
  );
  await check(
    "all three simulator outputs disclose assumptions beside the tool",
    async () => {
      for (const path of [
        "/tools/weapon-dps-calculator",
        "/tools/day-night-converter",
        "/tools/map-distance-calculator",
      ]) {
        const { text } = await page(path);
        assert.match(text, /hypothetical/i);
        assert.match(text, /editable|Editable/);
        assert.doesNotMatch(
          text,
          /— Live Stats|fastest vehicle recommendation/,
        );
      }
    },
  );
  await check(
    "search summaries stop promising unavailable statistics and completed tools",
    async () => {
      const { html } = await page("/api/search-index");
      const items = JSON.parse(html).items;
      for (const href of [
        "/tracker",
        "/compare/vehicles",
        "/compare/weapons",
        "/tools/loadout-builder",
      ]) {
        const tool = items.find(
          (x) => x.href === href && x.category === "Tool",
        );
        assert.ok(tool, href);
        assert.doesNotMatch(
          tool.subtitle,
          /dyno bars|11-category|firepower & mobility ratings/,
        );
        assert.match(
          tool.subtitle,
          /unavailable|not yet|unknown|Unknown|unsupported/,
        );
      }
    },
  );
  await check(
    "privacy policy publishes manual review targets without claiming an automated purge",
    async () => {
      const { text, html } = await page("/privacy");
      for (const v of [
        "90 days",
        "12 months",
        "30 days",
        "automatic cleanup job is not currently running",
      ])
        assert.ok(text.includes(v), v);
      assert.match(html, /href="\/contact\?topic=privacy"/);
    },
  );
  await check(
    "curated simulator URLs are in the sitemap; unreviewed dossiers remain excluded",
    async () => {
      const { html } = await page("/sitemap.xml");
      for (const path of [
        "/tools/weapon-dps-calculator",
        "/tools/day-night-converter",
        "/tools/map-distance-calculator",
      ])
        assert.ok(html.includes(path));
      assert.doesNotMatch(html, /<loc>[^<]+\/locations\/the-malibu-nightclub/);
    },
  );
  await check(
    "corrected map-size badge is fresh on embedded cards",
    async () => {
      const { html } = await page("/map");
      const related = html.match(
        /<section[^>]+aria-label="Map Guides &(?:amp;)? Location Intel"[^>]*>([\s\S]*?)<\/section>/,
      )?.[1];
      assert.ok(related, "related article section present");
      const card = related.match(
        /<a[^>]+href="\/news\/map-size-comparison-gtav-rdr2"[\s\S]*?<\/a>/,
      )?.[0];
      assert.ok(card, "related card present");
      assert.match(card, /Map Evidence/);
      assert.doesNotMatch(card, />Confirmed</i);
    },
  );
  fs.mkdirSync("tmp/live-audit-fixes-2026-10-28", { recursive: true });
  fs.writeFileSync(
    "tmp/live-audit-fixes-2026-10-28/http.json",
    JSON.stringify(
      {
        base,
        checkedAt: new Date().toISOString(),
        passed: checks.filter((x) => x.pass).length,
        total: checks.length,
        checks,
      },
      null,
      2,
    ),
  );
  if (checks.some((x) => !x.pass)) process.exitCode = 1;
})();
