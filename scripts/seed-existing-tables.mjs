/**
 * Seeds the EXISTING Supabase tables (vehicles, weapons) with the canonical
 * catalog via the service-role REST API — no DDL required.
 * Tables that don't exist yet (missions, locations, properties, collectibles,
 * guides, radio_stations) are skipped; 02_seeds_canonical.sql covers them
 * after 01_schema_v2_upgrade.sql runs.
 *
 * Usage: node scripts/seed-existing-tables.mjs
 */
import { execSync } from "child_process";
import { mkdirSync, rmSync, readFileSync } from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath, pathToFileURL } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tmp = path.join(root, ".tmp-canonical-build");

// Read env from .env.local
const env = Object.fromEntries(
  readFileSync(path.join(root, ".env.local"), "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);
const URL_BASE = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_BASE || !SERVICE_KEY) {
  console.error("Missing Supabase env vars in .env.local");
  process.exit(1);
}

console.log("Compiling canonical-data.ts ...");
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });
execSync(
  `npx tsc src/lib/canonical-data.ts --outDir "${tmp}" --module commonjs --target es2020 --skipLibCheck --esModuleInterop`,
  { cwd: root, stdio: "inherit" }
);
const require = createRequire(import.meta.url);
const cd = require(path.join(tmp, "canonical-data.js"));

async function upsert(table, rows, onConflict) {
  const res = await fetch(`${URL_BASE}/rest/v1/${table}?on_conflict=${onConflict}`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(rows),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`  ${table}: FAILED ${res.status} ${text.slice(0, 300)}`);
    return false;
  }
  console.log(`  ${table}: upserted ${rows.length} rows`);
  return true;
}

async function tableExists(table) {
  const res = await fetch(`${URL_BASE}/rest/v1/${table}?select=id&limit=1`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  });
  return res.status !== 404;
}

/* ---- Map canonical -> existing vehicle columns ---- */
const vehicleRows = cd.canonicalVehicles.map((v) => ({
  id: v.id,
  code: `V-${v.slug.toUpperCase().slice(0, 12)}`,
  name: v.name,
  display_name: v.name,
  class: v.klass.replace(" Car", ""),
  manufacturer: v.manufacturer,
  top_speed: `${v.topSpeed} mph`,
  acceleration: `${Number(v.acceleration).toFixed(1)}s`,
  handling: `${v.handling ?? 75}/100`,
  weight: v.weight,
  summary: v.source || "Cataloged vehicle in the State of Leonida.",
  images: [v.img],
  status: "published",
  verification: v.confidence === "OFFICIAL" || v.confidence === "CONFIRMED" ? "verified" : "pending",
  updated_at: new Date().toISOString(),
}));

/* ---- Map canonical -> existing weapon columns ---- */
const weaponRows = cd.canonicalWeapons.map((w) => ({
  id: w.id,
  code: `W-${w.slug.toUpperCase().slice(0, 12)}`,
  name: w.name,
  category: w.klass,
  ammunition: w.ammoType || "Unknown",
  damage: `${w.damage ?? 50}/100`,
  range: `${w.range ?? 30}m`,
  rate_of_fire: `${w.fireRate ?? 400} RPM`,
  magazine_size: `${w.magazineSize ?? 15} rounds`,
  acquisition_method: (w.locations && w.locations[0]) || "Ammu-Nation",
  notes: `Handling ${w.handling ?? 50}/100 • Reload ${w.reloadTime || "2.0s"} • ${w.priceDisplay || "Price TBD"} • Rarity: ${w.rarity || "Common"}`,
  status: "published",
  verification: w.confidence === "OFFICIAL" || w.confidence === "CONFIRMED" ? "verified" : "pending",
  updated_at: new Date().toISOString(),
}));

console.log("\nSeeding existing tables via service-role REST API ...");
if (await tableExists("vehicles")) {
  await upsert("vehicles", vehicleRows, "id");
} else {
  console.log("  vehicles table missing — run 01_schema_v2_upgrade.sql first");
}
if (await tableExists("weapons")) {
  await upsert("weapons", weaponRows, "id");
} else {
  console.log("  weapons table missing — run 01_schema_v2_upgrade.sql first");
}

// Probe the tables the DDL will create, so we can report status
for (const t of ["missions", "locations", "properties", "collectibles", "guides", "radio_stations", "contact_messages", "activity_log"]) {
  console.log(`  ${t}: ${await tableExists(t) ? "EXISTS" : "missing (created by 01_schema_v2_upgrade.sql)"}`);
}

rmSync(tmp, { recursive: true, force: true });
console.log("\nDone.");
