const assert = require("node:assert/strict");
const fs = require("node:fs");
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3001";
const out = "tmp/remediation/http-verification.json";
const checks = [];
async function request(path) {
  const r = await fetch(base + path, {
    redirect: "manual",
    signal: AbortSignal.timeout(30000),
  });
  return {
    status: r.status,
    headers: Object.fromEntries(r.headers),
    body: await r.text(),
  };
}
function meta(html, key) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  const t = tags.find((t) =>
    new RegExp('(?:name|property)="' + key + '"', "i").test(t),
  );
  return t?.match(/content="([^"]*)"/i)?.[1] || "";
}
async function check(name, fn) {
  try {
    const detail = await fn();
    checks.push({ name, pass: true, ...detail });
    console.log("PASS " + name);
  } catch (e) {
    checks.push({ name, pass: false, error: e.message });
    console.log("FAIL " + name + ": " + e.message);
  }
}
(async () => {
  for (const path of [
    "/news/gta-6-easter-eggs-hidden-trailer-details",
    "/news/audit-missing-article-2026",
    "/vehicles/audit-missing-vehicle-2026",
    "/weapons/audit-missing-weapon-2026",
  ]) {
    await check("real 404 " + path, async () => {
      const r = await request(path);
      assert.equal(r.status, 404);
      assert.match(meta(r.body, "robots"), /noindex/);
      return { status: r.status };
    });
  }
  for (const [from, to] of [
    ["/database/vehicles", "/vehicles"],
    ["/database/weapons", "/weapons"],
    ["/blog", "/news"],
  ]) {
    await check("permanent redirect " + from, async () => {
      const r = await request(from);
      assert.ok([301, 308].includes(r.status));
      assert.equal(new URL(r.headers.location, base).pathname, to);
      return { status: r.status, location: to };
    });
  }
  await check("unwritten guide excluded from indexing", async () => {
    const r = await request("/guides/make-money-fast");
    assert.equal(r.status, 200);
    assert.match(meta(r.body, "robots"), /noindex/);
    assert.match(r.body, /not ready for publication/);
    return { robots: meta(r.body, "robots") };
  });
  await check("sitemap canonical quality gate", async () => {
    const r = await request("/sitemap.xml");
    assert.equal(r.status, 200);
    assert.doesNotMatch(
      r.body,
      /<loc>[^<]*(?:\/database\/|\/tracker|\/map-explorer|\/guides\/make-money-fast|\/rankings)/,
    );
    assert.match(r.body, /\/characters\/jason/);
    assert.match(r.body, /\/editorial-policy/);
    const urls = [...r.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    assert.equal(urls.length, new Set(urls).size);
    return { urls: urls.length };
  });
  await check("favicon delivered", async () => {
    const r = await request("/favicon.ico");
    assert.equal(r.status, 200);
    assert.match(r.headers["content-type"], /image/);
    return { status: r.status };
  });
  for (const path of [
    "/team",
    "/editorial-policy",
    "/corrections",
    "/characters/jason",
    "/radio",
    "/unsubscribe",
  ]) {
    await check("public destination " + path, async () => {
      const r = await request(path);
      assert.equal(r.status, 200);
      return { status: r.status };
    });
  }
  await check("radio has sourced current lineup", async () => {
    const r = await request("/radio");
    for (const s of [
      "Cocoteo",
      "Back Country",
      "Afro Bank FM",
      "The Chamber",
      "Flash FM",
      "Dirty South Classics",
    ])
      assert.ok(r.body.includes(s), s);
    assert.ok(r.body.includes("rockstargames.com/VI/music"));
    return { stations: 6 };
  });
  await check("article cache and trailer heading", async () => {
    const r = await request("/news/gta-6-launch-trailer-breakdown");
    assert.equal(r.status, 200);
    assert.doesNotMatch(r.headers["cache-control"] || "", /private|no-store/);
    assert.ok(!r.headers["set-cookie"]);
    assert.match(r.body, /Launch Trailer<\/a>: The Main Takeaways/);
    assert.match(r.body, /max-image-preview:large/);
    assert.match(r.body, /taish-gaming-logo.png/);
    assert.match(r.body, /<details/);
    return { cache: r.headers["cache-control"], cookies: false };
  });
  await check("Port Gellhorn hero and social card agree", async () => {
    const r = await request("/news/gta-6-port-gellhorn-forgotten-coast-guide");
    assert.equal(r.status, 200);
    const og = meta(r.body, "og:image"),
      twitter = meta(r.body, "twitter:image");
    assert.match(og, /port-gellhorn-official.jpg/);
    assert.equal(twitter, og);
    assert.equal(meta(r.body, "og:image:width"), "3840");
    assert.equal(meta(r.body, "og:image:height"), "2160");
    return { image: og, width: 3840, height: 2160 };
  });
  await check("catalog detail unverified and noindex", async () => {
    const r = await request("/vehicles/grotti-visione");
    assert.equal(r.status, 200);
    assert.match(meta(r.body, "robots"), /noindex/);
    assert.match(r.body, /No field-specific source/);
    assert.doesNotMatch(r.body, /\d+ mph/);
    return { robots: meta(r.body, "robots") };
  });
  await check(
    "search index withholds unsupported catalog statistics",
    async () => {
      const r = await request("/api/search-index");
      assert.equal(r.status, 200);
      const catalog = JSON.parse(r.body).items.filter((x) =>
        ["Vehicle", "Weapon"].includes(x.category),
      );
      assert.ok(catalog.length > 100);
      for (const item of catalog)
        assert.doesNotMatch(item.subtitle, /\d+\s*(?:mph|Dmg)|\$\d/i);
      return { entries: catalog.length };
    },
  );
  await check("security headers staged without breaking embed", async () => {
    const page = await request("/radio"),
      embed = await request("/embed/countdown");
    assert.match(
      page.headers["content-security-policy-report-only"],
      /object-src 'none'/,
    );
    assert.match(
      page.headers["content-security-policy"],
      /frame-ancestors 'none'/,
    );
    assert.ok(!embed.headers["x-frame-options"]);
    assert.ok(
      !/frame-ancestors 'none'/.test(
        embed.headers["content-security-policy"] || "",
      ),
    );
    return { reportOnly: true, embedAllowed: true };
  });
  await check("CSP reports accepted without body reflection", async () => {
    const r = await fetch(base + "/api/csp-report", {
      method: "POST",
      headers: { "Content-Type": "application/csp-report" },
      body: JSON.stringify({
        "csp-report": {
          "effective-directive": "script-src-elem",
          "blocked-uri": "https://example.org/private?token=test-only",
        },
      }),
    });
    assert.equal(r.status, 204);
    assert.equal(await r.text(), "");
    return { status: r.status };
  });
  await check("optional third-party services absent by default", async () => {
    const r = await request("/privacy");
    assert.doesNotMatch(
      r.body,
      /<script[^>]+src="https:\/\/(?:plausible\.io|pagead2\.googlesyndication\.com)/,
    );
    assert.match(r.body, /Optional service choices/);
    return { default: "off" };
  });
  fs.writeFileSync(
    out,
    JSON.stringify(
      {
        base,
        checkedAt: new Date().toISOString(),
        passed: checks.filter((c) => c.pass).length,
        total: checks.length,
        checks,
      },
      null,
      2,
    ),
  );
  if (checks.some((c) => !c.pass)) process.exitCode = 1;
})();
