// Add alternates.canonical to static pages whose metadata lacks it.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const PAGES = [
  ["src/app/about/page.tsx", "/about"],
  ["src/app/cheats/page.tsx", "/cheats"],
  ["src/app/privacy/page.tsx", "/privacy"],
  ["src/app/terms/page.tsx", "/terms"],
  ["src/app/cookies/page.tsx", "/cookies"],
  ["src/app/pricing/page.tsx", "/pricing"],
  ["src/app/ai/page.tsx", "/ai"],
  ["src/app/tracker/page.tsx", "/tracker"],
  ["src/app/contact/page.tsx", "/contact"],
];

for (const [f, route] of PAGES) {
  const p = join(ROOT, f);
  let c = readFileSync(p, "utf8");
  if (c.includes("alternates")) { console.log("skip (has canonical)", f); continue; }

  // Insert an alternates line right before the closing "};" of the metadata object.
  const marker = "export const metadata: Metadata = {";
  const idx = c.indexOf(marker);
  if (idx === -1) { console.log("skip (no metadata object)", f); continue; }
  // find the closing "};" after the metadata start
  const closeIdx = c.indexOf("};", idx);
  if (closeIdx === -1) { console.log("skip (no close)", f); continue; }
  c = c.slice(0, closeIdx) + `  alternates: { canonical: "${route}" },\n  ` + c.slice(closeIdx);
  writeFileSync(p, c);
  console.log("canonical added:", f, route);
}
