// E2E auth-flow verification against the running production server.
import { readFileSync } from "node:fs";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const getEnv = (k) => env.match(new RegExp(`^${k}=(.*)$`, "m"))?.[1].trim();
const url = getEnv("NEXT_PUBLIC_SUPABASE_URL").replace(/\/$/, "");
const skey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const base = "http://localhost:3111";

(async () => {
  await wait(3000);

  // 1. master login
  let r = await fetch(`${base}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin@gta6.com", password: getEnv("ADMIN_MASTER_PASSWORD") }),
  });
  const setCookie = r.headers.get("set-cookie") || "";
  const cookie = setCookie.split(";")[0];
  console.log("1. master login:", r.status, "| admin cookie set:", !!cookie);

  // 2. admin page with cookie
  r = await fetch(`${base}/admin`, { redirect: "manual", headers: { cookie } });
  console.log("2. /admin with admin cookie:", r.status, "(expect 200)");

  // 3. /admin/messages with cookie
  r = await fetch(`${base}/admin/messages`, { redirect: "manual", headers: { cookie } });
  console.log("3. /admin/messages with cookie:", r.status, "(expect 200)");

  // 4. create a non-admin Supabase user, then attempt admin login with it
  const email = `e2e-nonadmin-${Date.now()}@example.com`;
  const cu = await fetch(`${url}/auth/v1/admin/users`, {
    method: "POST",
    headers: { apikey: skey, Authorization: `Bearer ${skey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "NonAdminTest2026!", email_confirm: true }),
  });
  const u = await cu.json();
  console.log("4. created non-admin auth user:", cu.status);

  r = await fetch(`${base}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: email, password: "NonAdminTest2026!" }),
  });
  const body = await r.json();
  console.log("5. non-admin login attempt:", r.status, "|", body.error, "(expect 403)");

  // 6. admin API without any auth
  r = await fetch(`${base}/api/admin/logout`, { method: "POST", redirect: "manual" });
  console.log("6. POST /api/admin/logout without auth:", r.status, "(200 expected — logout is open by design)");

  // cleanup test user
  if (u.id) {
    const del = await fetch(`${url}/auth/v1/admin/users/${u.id}`, {
      method: "DELETE",
      headers: { apikey: skey, Authorization: `Bearer ${skey}` },
    });
    console.log("7. cleanup test user:", del.status);
  }

  // 8. sanity: news still healthy
  r = await fetch(`${base}/news`);
  console.log("8. /news final:", r.status);
})();
