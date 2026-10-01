// Extract unique hardcoded-color class fragments per file.
import { readFileSync } from "node:fs";

const files = [
  "src/app/tools/money-calculator/money-calculator-client.tsx",
  "src/app/tools/money-maker/money-maker-client.tsx",
  "src/app/tools/business-profit-calculator/business-calculator-client.tsx",
  "src/app/tools/loadout-builder/loadout-client.tsx",
  "src/app/database/vehicles/vehicles-db-client.tsx",
  "src/app/database/weapons/weapons-db-client.tsx",
];

const re = /[a-z-]*(?:text|bg|border|placeholder|from|via|to|ring|divide)-(?:\[[^\]]+\]|slate-\d+|white\/\d+|white)(?=[\s"'`])/g;

for (const f of files) {
  const c = readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
  const counts = {};
  for (const m of c.match(re) || []) counts[m] = (counts[m] || 0) + 1;
  console.log("== " + f.split("/").slice(-1)[0]);
  console.log(Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([k, v]) => `  ${String(v).padStart(3)} ${k}`).join("\n"));
}
