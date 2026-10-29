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
  const report = { base, checkedAt: new Date().toISOString(), passed: results.filter((r) => r.pass).length, total: results.length, checks: results };
  if (process.env.SEO_CHECK_OUTPUT) fs.writeFileSync(process.env.SEO_CHECK_OUTPUT, JSON.stringify(report, null, 2));
  if (report.passed !== report.total) process.exitCode = 1;
})();
