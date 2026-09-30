// One-off seed: upserts every character from src/lib/data.ts into the
// `characters` table with the service role key, making the DB the single
// source of truth for characters on the public site and in the admin CMS.
import { readFileSync, rmSync, mkdirSync, cpSync } from "node:fs";
import { execSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const getEnv = (k) => env.match(new RegExp(`^${k}=(.*)$`, "m"))?.[1].trim();
const url = getEnv("NEXT_PUBLIC_SUPABASE_URL").replace(/\/$/, "");
const serviceKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");

// Compile data.ts to plain JS in a temp dir
const tmp = ".tmp-seed-characters";
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });
cpSync("tsconfig.json", `${tmp}/tsconfig.json`);
execSync(
  `npx tsc src/lib/data.ts --outDir ${tmp} --module nodenext --moduleResolution nodenext --target es2020 --skipLibCheck`,
  { stdio: "inherit" }
);
const { characters } = await import(pathToFileURL(`${tmp}/data.js`).href);

const toRow = (c) => ({
  id: c.id,
  name: c.name,
  role: c.role,
  description: c.desc,
  img: c.img,
  featured: Boolean(c.featured),
  alias: c.alias ?? null,
  voice_actor: c.voiceActor ?? null,
  origin: c.origin ?? null,
  specialty: c.specialty ?? null,
  perk: c.perk ?? null,
  vehicle: c.vehicle ?? null,
  weapons: c.weapons ?? [],
  affiliation: c.affiliation ?? null,
  status: c.status ?? "Active",
  quote: c.quote ?? null,
  bio: c.bio ?? [],
  tags: c.tags ?? [],
  updated_at: new Date().toISOString(),
});

let ok = 0;
for (const c of characters) {
  const res = await fetch(`${url}/rest/v1/characters?on_conflict=id`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(toRow(c)),
  });
  if (res.ok) {
    ok++;
    console.log(`upserted: ${c.id} (${c.name})`);
  } else {
    console.error(`FAILED ${c.id}: HTTP ${res.status} ${await res.text()}`);
  }
}
console.log(`\n${ok}/${characters.length} characters upserted.`);
rmSync(tmp, { recursive: true, force: true });
