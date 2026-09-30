// Diagnose admin login against the running dev server on :3000.
import { readFileSync } from "node:fs";
const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const getEnv = (k) => env.match(new RegExp(`^${k}=(.*)$`, "m"))?.[1].trim();
const base = "http://localhost:3000";

async function tryLogin(label, username, password) {
  try {
    const res = await fetch(`${base}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const body = await res.json().catch(() => ({}));
    const cookie = res.headers.get("set-cookie") || "";
    console.log(`${label}: HTTP ${res.status} | ${body.error || body.success || ""} | cookie: ${cookie ? "set" : "none"}`);
    return { status: res.status, body, cookie };
  } catch (e) {
    console.log(`${label}: SERVER UNREACHABLE — ${e.message}`);
    return { status: 0 };
  }
}

const email = "admin@gta6.com";
const pass = getEnv("ADMIN_MASTER_PASSWORD");

// 1. exact master credentials from .env.local
await tryLogin("1. admin@gta6.com + env password", email, pass);

// 2. only if #1 failed — check whether the OLD password still authenticates (stale provisioned user)
if (true) {
  await tryLogin("2. admin@gta6.com + old default", email, "admin12345");
}
