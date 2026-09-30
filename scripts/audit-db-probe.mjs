// One-off audit probe via plain REST (avoids realtime WebSocket requirement).
import { readFileSync } from "node:fs";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const getEnv = (k) => env.match(new RegExp(`^${k}=(.*)$`, "m"))?.[1].trim();

const url = getEnv("NEXT_PUBLIC_SUPABASE_URL").replace(/\/$/, "");
const serviceKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
const anonKey = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

const rest = (key) => `${url}/rest/v1`;
const headersFor = (key) => ({ apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" });

async function restCall(key, path, opts = {}) {
  const res = await fetch(`${rest(key)}${path}`, { headers: headersFor(key), ...opts });
  const text = await res.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  return { status: res.status, ok: res.ok, body, count: res.headers.get("content-range") };
}

console.log("== TABLE COUNTS (service key) ==");
for (const t of [
  "articles", "characters", "vehicles", "weapons", "site_settings", "map_markers",
  "seo_settings", "missions", "locations", "media_assets", "guides", "properties",
  "collectibles", "radio_stations", "contact_messages", "activity_log",
]) {
  const r = await restCall(serviceKey, `/${t}?select=id`, { method: "HEAD" });
  // HEAD may not return content-range on all setups; do a GET count fallback
  if (r.count === null) {
    const g = await restCall(serviceKey, `/${t}?select=id`);
    if (g.status === 404) console.log(`${t}: TABLE MISSING (404)`);
    else if (!g.ok) console.log(`${t}: ERROR ${JSON.stringify(g.body)}`);
    else console.log(`${t}: ${Array.isArray(g.body) ? g.body.length : "?"}`);
  } else {
    console.log(`${t}: ${r.count}`);
  }
}

console.log("\n== BUCKETS ==");
const bucketsRes = await fetch(`${url}/storage/v1/bucket`, { headers: headersFor(serviceKey) });
const buckets = await bucketsRes.json();
console.log(buckets.map ? buckets.map((b) => `${b.name}(${b.public ? "public" : "private"})`).join(", ") : JSON.stringify(buckets));

console.log("\n== ANON READ PROBES ==");
// NOTE: PostgREST applies RLS silently — a filtered read returns 200 with 0
// rows (not an error). "0 rows" therefore means "RLS is filtering correctly".
const drafts = await restCall(anonKey, `/articles?select=id,title,status&status=neq.published`);
console.log("anon read non-published articles:", !drafts.ok ? `blocked (${drafts.status})` : `${drafts.body.length} rows visible (0 = correctly filtered)`);

const settings = await restCall(anonKey, `/site_settings?select=key&limit=3`);
console.log("anon read site_settings:", !settings.ok ? `blocked (${settings.status})` : `ok ${settings.body.length} keys (public read intended)`);

const contactRead = await restCall(anonKey, `/contact_messages?select=id&limit=1`);
console.log("anon read contact_messages:", !contactRead.ok ? `blocked (${contactRead.status})` : `${contactRead.body.length} rows visible (0 = correctly filtered)`);

console.log("\n== ANON WRITE PROBES (must fail; probe row removed if it succeeds) ==");
const probeRow = {
  id: "audit-probe-delete-me", slug: "audit-probe-delete-me", title: "AUDIT PROBE",
  excerpt: "rls probe", category: "News", status: "published",
};
const ins = await restCall(anonKey, `/articles`, { method: "POST", body: JSON.stringify(probeRow) });
if (ins.ok) {
  console.log("anon INSERT articles: SUCCEEDED — CRITICAL RLS HOLE");
  await restCall(serviceKey, `/articles?id=eq.audit-probe-delete-me`, { method: "DELETE" });
  console.log("probe row removed: yes");
} else {
  console.log("anon INSERT articles: blocked ✓", ins.status, JSON.stringify(ins.body?.message || ins.body?.error || "").slice(0, 120));
}

const upd = await restCall(anonKey, `/site_settings?key=eq.siteTitle`, { method: "PATCH", body: JSON.stringify({ value: "hacked" }) });
// A PATCH matching rows filtered by RLS returns 200 with an empty body, so we
// must confirm whether the value actually changed to know if RLS held.
const after = await restCall(serviceKey, `/site_settings?select=value&key=eq.siteTitle`);
const changed = JSON.stringify(after.body?.[0]?.value || "") === JSON.stringify("hacked");
console.log("anon UPDATE site_settings:", upd.ok && !changed ? "blocked ✓ (0 rows affected)" : changed ? "SUCCEEDED — CRITICAL RLS HOLE (restore siteTitle!)" : "blocked ✓");

console.log("\n== PUBLIC SIGN-UP PROBE ==");
const email = `audit-probe-${Date.now()}@example.com`;
const signupRes = await fetch(`${url}/auth/v1/signup`, {
  method: "POST", headers: { apikey: anonKey, "Content-Type": "application/json" },
  body: JSON.stringify({ email, password: "AuditProbe!2026x" }),
});
const signup = await signupRes.json();
if (signup.error) {
  console.log("public sign-up:", signup.error.code || signup.error.msg || signup.message);
} else {
  console.log("public sign-up: OPEN — session granted:", !!signup.access_token || "email confirm required");
  const uid = signup.id || signup.user?.id;
  if (uid) {
    const del = await fetch(`${url}/auth/v1/admin/users/${uid}`, { method: "DELETE", headers: headersFor(serviceKey) });
    console.log("probe auth user deleted:", del.ok ? "yes" : `FAILED ${del.status}`);
  }
}

console.log("\n== ARTICLES SAMPLE ==");
const arts = await restCall(serviceKey, `/articles?select=id,slug,status,category,author_name,seo_title&limit=8`);
console.log(arts.ok ? JSON.stringify(arts.body, null, 1) : `ERROR ${JSON.stringify(arts.body)}`);
