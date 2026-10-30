const assert = require("node:assert/strict");
const fs = require("node:fs");
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3002";
const results = [];
async function page(path) {
  const response = await fetch(base + path, { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, path);
  return response.text();
}
async function check(name, run) {
  try { await run(); results.push({ name, pass: true }); }
  catch (error) { results.push({ name, pass: false, error: error.message.slice(0, 400) }); }
  console.log((results.at(-1).pass ? "PASS " : "FAIL ") + name);
}
(async () => {
  await check("homepage retains one accessible page title after the visible hero heading removal", async () => {
    const html = await page("/");
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.match(html, /<h1[^>]*>Taish Gaming/);
  });
  await check("map answers place and size questions without inventing a playable-area measurement", async () => {
    const html = await page("/map");
    assert.match(html, /<title>GTA 6 Interactive Fan Map: Leonida &amp; Vice City/);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.match(html, /map size in km²/);
    assert.match(html, /have not verified a primary-source measurement/);
    assert.match(html, /href="https:\/\/www.rockstargames.com\/VI\/only-in-leonida"/);
    assert.match(html, /href="\/news\/map-size-comparison-gtav-rdr2"/);
  });
  await check("world and region hubs offer contextual links to the interactive fan map", async () => {
    const regions = await page("/regions");
    const world = await page("/gta-6-world");
    assert.match(regions, /href="\/map"[^>]*>Explore our interactive Leonida fan map/);
    assert.match(world, /href="\/map"[^>]*>interactive GTA 6 fan map/);
  });
  await check("imported money article has one page H1 and working section targets", async () => {
    const html = await page("/news/gta-6-money-guide-robberies-fences-economy");
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    const hrefs = [...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
    assert.ok(hrefs.length > 0);
    for (const id of hrefs) assert.ok(html.includes(`id="${id}"`), id);
  });
  for (const slug of ["vehicle-upgrade-calculator", "garage-planner", "photo-spot-finder", "wanted-level-guide", "business-income-calculator", "heist-payout-splitter"]) {
    await check(slug + " aligns search metadata, visible scope and application schema", async () => {
      const html = await page("/tools/" + slug);
      const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
      assert.ok(description);
      assert.match(description, /hypothetical|fictional|unverified/);
      const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map((m) => JSON.parse(m[1]));
      const app = schemas.flatMap((s) => s["@graph"] || [s]).find((s) => s["@type"] === "WebApplication");
      assert.ok(app);
      assert.equal(app.description, description);
      const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<[^>]+>/g, " ");
      assert.ok(visible.includes(description));
      assert.ok(html.includes(`rel="canonical" href="https://www.taishgaming.com/tools/${slug}"`));
    });
  }
  await check("unavailable police-response data is noindex, follow and absent from sitemap", async () => {
    const html = await page("/tools/wanted-level-guide");
    assert.match(html, /<meta name="robots" content="noindex, follow"/);
    const sitemap = await page("/sitemap.xml");
    assert.ok(!sitemap.includes("/tools/wanted-level-guide"));
  });
  await check("settings title is focused and keeps a self canonical", async () => {
    const html = await page("/settings-guide");
    assert.match(html, /<title>GTA 6 Settings: Display, Audio &amp; Accessibility \| Taish Gaming<\/title>/);
    assert.ok(html.includes('rel="canonical" href="https://www.taishgaming.com/settings-guide"'));
  });
  await check("file-size article links directly to the HTTPS primary announcement", async () => {
    const html = await page("/news/gta-6-file-size-210-gb-ps5-storage-guide");
    assert.ok(html.includes('href="https://www.take2games.com/ir/news/rockstar-games-announces-pre-orders-grand-theft-auto-vi"'));
    assert.ok(!html.includes('href="http://www.take2games.com'));
  });
  await check("release date is scheduled while the UTC timer boundary is distinguished from regional unlock", async () => {
    const html = await page("/");
    const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    assert.match(visible, /Scheduled release date:.*November 19, 2026/);
    assert.match(visible, /not a confirmed regional unlock time/);
    assert.doesNotMatch(visible, /exact launch day unconfirmed/);
  });
  await check("Guides offers useful crawlable resources instead of an empty popularity section", async () => {
    const html = await page("/guides");
    assert.match(html, /Browse Guides/);
    assert.doesNotMatch(html, />Popular Guides</);
    for (const path of ["/guides/vice-city-map-guide", "/news/map-size-comparison-gtav-rdr2", "/news/gta-6-release-date-pre-order-editions", "/characters", "/regions"])
      assert.ok(html.includes(`href="${path}"`), path);
  });
  await check("all eight character profiles explain source limits and connect the cast", async () => {
    for (const slug of ["jason", "lucia", "cal", "boobie-ike", "drequan-priest", "real-dimez", "raul-bautista", "brian-heder"]) {
      const html = await page("/characters/" + slug);
      assert.equal((html.match(/<h1\b/g) || []).length, 1, slug);
      assert.match(html, /id="character-connections"/);
      assert.match(html, /id="character-question"/);
      assert.match(html, /not a first-hand gameplay test/);
      assert.match(html, /href="https:\/\/www.rockstargames.com\/VI\/only-in-leonida"/);
    }
  });
  await check("money landing page withdraws unsupported payout rankings", async () => {
    const html = await page("/money-guide");
    assert.match(html, /earlier payout and effort rankings were unsupported and have been withdrawn/);
    assert.doesNotMatch(html, /Confirmed structure|High \(passive\)|pay the biggest single sums/);
  });
  await check("upgrade examples remain fictional in the FAQ, result labels and copied-summary scope", async () => {
    const html = await page("/tools/vehicle-upgrade-calculator");
    assert.match(html, /fictional presets for demonstrating a budget calculation/);
    assert.match(html, /Example Performance Points/);
    assert.doesNotMatch(html, /values are estimates based on leak reports/);
  });
  await check("article summaries do not repeat identical subtitles in sampled headers", async () => {
    for (const slug of ["how-gta-6-was-really-made-bloomberg", "gta-6-money-guide-robberies-fences-economy", "gta-6-release-date-pre-order-editions", "map-size-comparison-gtav-rdr2", "gta-6-map-guide-leonida-regions-size", "gta-6-cal-hampton", "gta-6-port-gellhorn-forgotten-coast-guide", "gta-6-file-size-210-gb-ps5-storage-guide", "trailer-2-breakdown-analysis", "gta-6-characters-lucia-jason-cast"]) {
      const html = await page("/news/" + slug);
      const excerpt = html.match(/<p class="font-semibold leading-relaxed">([\s\S]*?)<\/p>/)?.[1]?.trim();
      const header = html.match(/<header\b[^>]*>([\s\S]*?)<\/header>/)?.[1];
      assert.ok(excerpt && header, slug);
      assert.ok(!header.includes(excerpt), slug);
    }
  });
  await check("corrected economy article withdraws claims and pricing table is removed", async () => {
    const economy = await page("/news/gta-6-money-guide-robberies-fences-economy");
    const development = await page("/news/how-gta-6-was-really-made-bloomberg");
    assert.match(economy, /Those confirmation claims are withdrawn/);
    assert.match(economy, /Unverified here/);
    assert.doesNotMatch(economy, /Here&#x27;s everything confirmed|all confirmed via Rockstar/);
    assert.doesNotMatch(development, /\$79\.99|\$99\.99/);
    assert.match(development, /market-specific listing/);
  });
  await check("sitemap includes maintained utilities while noindex evidence details stay excluded", async () => {
    const xml = await page("/sitemap.xml");
    for (const path of ["/tools/vehicle-upgrade-calculator", "/tools/heist-payout-splitter", "/tools/garage-planner", "/tools/countdown-widget"])
      assert.ok(xml.includes(path), path);
    for (const path of ["/tools/business-income-calculator", "/controls", "/money-guide"])
      assert.ok(xml.includes(path), path);
    for (const path of ["/dmca", "/pricing", "/tools/character-quiz"])
      assert.ok(xml.includes(path), path);
    assert.ok(!xml.includes("/tools/photo-spot-finder"));
    assert.ok(!xml.includes("/weapons/girardi-es9"));
    assert.ok(!xml.includes("/tools/wanted-level-guide"));
    for (const path of ["/businesses", "/achievements", "/settings-guide", "/easter-eggs", "/activities", "/site-map", "/tools/photo-spot-finder"])
      assert.ok(!xml.includes(path), path);
    assert.ok(!xml.includes("?ids="));
  });
  await check("speculative gameplay hubs are clearly disclosed and excluded from indexing", async () => {
    for (const path of ["/businesses", "/achievements", "/settings-guide", "/easter-eggs", "/activities", "/site-map", "/tools/photo-spot-finder"]) {
      const html = await page(path);
      assert.match(html, /<meta name="robots" content="noindex, follow"/);
    }
    const controls = await page("/controls");
    assert.match(controls, /has not published the official GTA VI control layout/);
    assert.doesNotMatch(controls, /confirmed at launch/i);
  });
  await check("tool directory no longer promises unsupported business earnings or money rankings", async () => {
    const html = await page("/tools");
    assert.match(html, /Purchasable businesses, income and operating mechanics have not been confirmed/);
    assert.match(html, /Confirmed payouts, earning methods and efficiency rankings are not available/);
    assert.doesNotMatch(html, /Every way to make money in GTA 6 ranked by payout and effort/);
    assert.doesNotMatch(html, /Expected GTA 6 trophy list with an interactive checklist/);
    assert.doesNotMatch(html, /Everything to do between missions: hunting, fishing, mini-golf/);
    assert.doesNotMatch(html, /Every GTA 6 Easter egg spotted so far/);
    assert.doesNotMatch(html, /Best GTA 6 settings for PS5 and Xbox/);
  });
  await check("unsupported gameplay mechanics are withdrawn on both article URLs", async () => {
    const duo = await page("/news/duo-protagonist-mechanics-lucia-jason");
    const gameplay = await page("/news/gta-6-gameplay-confirmed-features-mechanics");
    for (const html of [duo, gameplay]) {
      assert.match(html, /Correction notice/);
      assert.match(html, /claims are withdrawn|confirmations are withdrawn/i);
      assert.match(html, /precise sources|exact source passages|time-coded official scene/i);
    }
    assert.doesNotMatch(gameplay, /six-star wanted level with a new Heat system/);
    assert.doesNotMatch(duo, /optional romance is confirmed/i);
  });
  const report = { base, checkedAt: new Date().toISOString(), passed: results.filter((r) => r.pass).length, total: results.length, checks: results };
  if (process.env.SEO_CHECK_OUTPUT) fs.writeFileSync(process.env.SEO_CHECK_OUTPUT, JSON.stringify(report, null, 2));
  if (report.passed !== report.total) process.exitCode = 1;
})();
