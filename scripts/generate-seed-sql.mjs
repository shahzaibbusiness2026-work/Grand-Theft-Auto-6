/**
 * Generates supabase/02_seeds_canonical.sql from src/lib/canonical-data.ts
 * so the Supabase DB mirrors the full canonical catalog and the admin
 * dashboard can see & edit every entry.
 *
 * Usage:  node scripts/generate-seed-sql.mjs
 * (compiles canonical-data.ts to a temp dir with the repo's tsc, then maps rows)
 */
import { execSync } from "child_process";
import { mkdirSync, rmSync, writeFileSync, readFileSync } from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath, pathToFileURL } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tmp = path.join(root, ".tmp-canonical-build");

console.log("Compiling canonical-data.ts ...");
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });
execSync(
  `npx tsc src/lib/canonical-data.ts --outDir "${tmp}" --module commonjs --target es2020 --skipLibCheck --esModuleInterop`,
  { cwd: root, stdio: "inherit" }
);

const require = createRequire(import.meta.url);
const cd = require(path.join(tmp, "canonical-data.js"));

/* ---------------- SQL helpers ---------------- */
const q = (v) => {
  if (v === null || v === undefined) return "NULL";
  return "'" + String(v).replace(/'/g, "''") + "'";
};
const qn = (v) => (v === null || v === undefined ? "NULL" : String(Number(v)));
const qarr = (v) => {
  if (!Array.isArray(v) || v.length === 0) return "ARRAY[]::TEXT[]";
  return "ARRAY[" + v.map((x) => q(String(x))).join(",") + "]::TEXT[]";
};
const qjson = (v) => {
  if (v === null || v === undefined) return "'[]'::jsonb";
  return q(JSON.stringify(v)) + "::jsonb";
};

/* ---------------- Vehicles ---------------- */
const vehicleRows = cd.canonicalVehicles.map((v) => {
  return `  (${q(v.id)}, ${q(v.slug)}, ${q(v.name)}, ${q(v.name)}, ${q(v.klass.replace(" Car", "").replace("Dirt Bike", "Motorcycle"))}, ${q(v.manufacturer)}, ${qn(v.topSpeed)} || ' mph', ${q(Number(v.acceleration).toFixed(1) + "s")}, ${v.handling ?? 75} || '/100', ${q(v.weight)}, ${q(v.description || v.source || "Cataloged vehicle in the State of Leonida.")}, ${qarr([v.img])}, 'published', ${(v.confidence === "OFFICIAL" || v.confidence === "CONFIRMED") ? "'verified'" : "'pending'"}, ${q(v.confidence)}, ${q(v.source)}, ${v.price === null ? "NULL" : qn(v.price)}, ${q(v.priceDisplay)}, ${qn(v.seating ?? 2)}, ${q(v.drivetrain ?? "RWD")}, ${qn(v.power ?? 500)})`;
});

/* ---------------- Weapons ---------------- */
const weaponRows = cd.canonicalWeapons.map((w) => {
  return `  (${q(w.id)}, ${q(w.slug)}, ${q(w.name)}, ${q(w.klass)}, ${q(w.ammoType || "9mm")}, ${w.damage ?? 50} || '/100', ${q((w.range ?? 30) + "m")}, ${q((w.fireRate ?? 400) + " RPM")}, ${q((w.magazineSize ?? 15) + " rounds")}, ${q((w.locations && w.locations[0]) || "Ammu-Nation")}, ${q("Handling " + (w.handling ?? 50) + "/100 • Reload " + (w.reloadTime || "2.0s") + " • " + (w.priceDisplay || "Price TBD") + " • Rarity: " + (w.rarity || "Common"))}, 'published', ${(w.confidence === "OFFICIAL" || w.confidence === "CONFIRMED") ? "'verified'" : "'pending'"}, ${q(w.confidence)}, ${q(w.price === null ? null : w.priceDisplay)}, ${q(w.rarity || null)}, ${qarr(w.attachments || [])})`;
});

/* ---------------- Missions ---------------- */
const missionRows = cd.canonicalMissions.map((m) => {
  const protagonist = m.character === "Any" ? "Both" : m.character;
  const status = m.confidence === "OFFICIAL" || m.confidence === "CONFIRMED" ? "Confirmed" : "Rumoured";
  const description = [m.difficulty, m.duration, m.district].filter(Boolean).join(" • ");
  return `  (${q(m.id)}, ${q(m.slug)}, ${q(m.title)}, ${q(protagonist)}, ${q(m.type || "Main Story")}, ${q(m.type || "Main Story")}, ${q(m.difficulty || "Medium")}, ${q(m.duration || null)}, ${q(m.district || null)}, ${q(m.cashRewardDisplay || null)}, ${qjson(m.otherRewards || [])}, ${qjson(m.requirements || [])}, ${q((m.objectives || []).join("\n"))}, ${q(description)}, ${q(status)}, ${q(m.confidence)})`;
});

/* ---------------- Locations ---------------- */
const locationRows = cd.canonicalLocations.map((l) => {
  const verification = l.confidence === "OFFICIAL" || l.confidence === "CONFIRMED" ? "verified" : "pending";
  return `  (${q(l.id)}, ${q(l.slug)}, ${q(l.name)}, ${q(l.district)}, ${q(l.category)}, ${q(verification)}, ${q("top " + l.top + ", left " + l.left)}, ${q(l.desc)}, ${q(l.hours || null)}, ${q(l.threatLevel || null)}, ${q(l.img || null)}, ${q(l.confidence)}, ${q(l.source || null)})`;
});

/* ---------------- Properties ---------------- */
const propertyRows = cd.canonicalProperties.map((p) => {
  return `  (${q(p.id)}, ${q(p.slug)}, ${q(p.name)}, ${q(p.district)}, ${q(p.type)}, ${p.price === null ? "NULL" : qn(p.price)}, ${q(p.priceDisplay)}, ${qn(p.garageCapacity ?? 0)}, ${p.passiveIncomePerHour === null ? "NULL" : qn(p.passiveIncomePerHour)}, ${q(p.passiveIncomeDisplay)}, ${qjson(p.features || [])}, ${qjson(p.upgrades || [])}, ${qjson(p.requirements || [])}, ${q(p.confidence)}, ${q(p.source || null)}, ${q(p.img || null)}, ${q(p.description || null)})`;
});

/* ---------------- Collectibles ---------------- */
const collectibleRows = cd.canonicalCollectibles.map((c) => {
  return `  (${q(c.id)}, ${q(c.slug)}, ${q(c.title)}, ${q(c.category)}, ${q(c.district)}, ${q(c.reward)}, ${q(c.requirements)}, ${q(c.description)}, ${q(c.guideTip)}, ${q(c.coordinates?.top || "50%")}, ${q(c.coordinates?.left || "50%")}, ${q(c.confidence)}, ${q(c.source)}, ${q(c.img)})`;
});

/* ---------------- Radio stations (from public client hardcoded list) ---------------- */
const radioSource = readFileSync(path.join(root, "src/app/radio/radio-client.tsx"), "utf8");
const stationsMatch = radioSource.match(/const STATIONS: RadioStation\[\] = (\[[\s\S]*?\n\]);/);
let radioRows = [];
if (stationsMatch) {
  // The array is plain JS object literals — eval it in isolation.
  const stations = new Function("return " + stationsMatch[1])();
  radioRows = stations.map((s, i) =>
    `  (${q(s.id)}, ${q(s.name)}, ${q(s.genre)}, ${q(s.host)}, ${q(s.frequency)}, ${q(s.accentColor)}, ${q(s.description)}, ${qjson(s.tracks || [])}, ${i + 1})`
  );
}

/* ---------------- Emit ---------------- */
const out = [];
out.push(`-- ====================================================================`);
out.push(`-- GTA 6 Atlas — Canonical Content Seeds (GENERATED FILE — do not edit)`);
out.push(`-- Generated by scripts/generate-seed-sql.mjs from src/lib/canonical-data.ts`);
out.push(`-- Run AFTER 01_schema_v2_upgrade.sql. Idempotent: ON CONFLICT DO NOTHING.`);
out.push(`-- ====================================================================`);
out.push(``);
out.push(`-- Replace the old demo-only rows (only if never edited by an admin)`);
out.push(`DELETE FROM public.vehicles WHERE id IN ('veh-001','veh-002','veh-003','veh-004','veh-005') AND updated_at <= created_at;`);
out.push(`DELETE FROM public.weapons WHERE id IN ('wep-001','wep-002','wep-003','wep-004','wep-005','wep-006','wep-007') AND updated_at <= created_at;`);
out.push(``);

out.push(`-- VEHICLES (${vehicleRows.length})`);
out.push(`INSERT INTO public.vehicles (id, slug, name, display_name, class, manufacturer, top_speed, acceleration, handling, weight, summary, images, status, verification, confidence, source, price, price_display, seating, drivetrain, power_hp) VALUES`);
out.push(vehicleRows.join(",\n") + `\nON CONFLICT (id) DO NOTHING;`);
out.push(``);

out.push(`-- WEAPONS (${weaponRows.length})`);
out.push(`INSERT INTO public.weapons (id, slug, name, category, ammunition, damage, range, rate_of_fire, magazine_size, acquisition_method, notes, status, verification, confidence, price_display, rarity, attachments) VALUES`);
out.push(weaponRows.join(",\n") + `\nON CONFLICT (id) DO NOTHING;`);
out.push(``);

out.push(`-- MISSIONS (${missionRows.length})`);
out.push(`INSERT INTO public.missions (id, slug, name, protagonist, act, mission_type, difficulty, duration, district, cash_reward_display, other_rewards, requirements, objectives, description, status, confidence) VALUES`);
out.push(missionRows.join(",\n") + `\nON CONFLICT (id) DO NOTHING;`);
out.push(``);

out.push(`-- LOCATIONS (${locationRows.length})`);
out.push(`INSERT INTO public.locations (id, slug, name, district, type, verification, coordinates, description, hours, threat_level, img, confidence, source) VALUES`);
out.push(locationRows.join(",\n") + `\nON CONFLICT (id) DO NOTHING;`);
out.push(``);

out.push(`-- PROPERTIES (${propertyRows.length})`);
out.push(`INSERT INTO public.properties (id, slug, name, district, type, price, price_display, garage_capacity, passive_income_per_hour, passive_income_display, features, upgrades, requirements, confidence, source, img, description) VALUES`);
out.push(propertyRows.join(",\n") + `\nON CONFLICT (id) DO NOTHING;`);
out.push(``);

out.push(`-- COLLECTIBLES (${collectibleRows.length})`);
out.push(`INSERT INTO public.collectibles (id, slug, title, category, district, reward, requirements, description, guide_tip, coord_top, coord_left, confidence, source, img) VALUES`);
out.push(collectibleRows.join(",\n") + `\nON CONFLICT (id) DO NOTHING;`);
out.push(``);

out.push(`-- RADIO STATIONS (${radioRows.length})`);
out.push(`INSERT INTO public.radio_stations (id, name, genre, host, frequency, accent_color, description, tracks, sort_order) VALUES`);
out.push(radioRows.join(",\n") + `\nON CONFLICT (id) DO NOTHING;`);
out.push(``);

const outFile = path.join(root, "supabase", "02_seeds_canonical.sql");
writeFileSync(outFile, out.join("\n"), "utf8");
console.log(`Wrote ${outFile}`);
console.log(
  `vehicles=${vehicleRows.length} weapons=${weaponRows.length} missions=${missionRows.length} locations=${locationRows.length} properties=${propertyRows.length} collectibles=${collectibleRows.length} radio=${radioRows.length}`
);

rmSync(tmp, { recursive: true, force: true });
