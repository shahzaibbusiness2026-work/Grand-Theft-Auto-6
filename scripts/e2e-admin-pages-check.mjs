// E2E: verify the four new admin pages load with the admin cookie.
import { readFileSync } from "node:fs";
const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const getEnv = (k) => env.match(new RegExp(`^${k}=(.*)$`, "m"))?.[1].trim();
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const base = "http://localhost:3000";

(async () => {
  await wait(3000);
  const r = await fetch(`${base}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin@gta6.com", password: getEnv("ADMIN_MASTER_PASSWORD") }),
  });
  const cookie = (r.headers.get("set-cookie") || "").split(";")[0];
  console.log("login:", r.status, "| cookie:", cookie ? "set" : "none");

  for (const p of ["/admin/guides", "/admin/properties", "/admin/collectibles", "/admin/radio"]) {
    const res = await fetch(base + p, { redirect: "manual", headers: { cookie } });
    const t = res.status === 200 ? await res.text() : "";
    const marker =
      p.endsWith("guides") ? "Complete Beginner Guide" :
      p.endsWith("properties") ? "" :
      p.endsWith("collectibles") ? "" :
      "Wave";
    console.log(p + ":", res.status, marker && t.includes(marker) ? `| contains "${marker}" ✓` : "");
  }
})();
