// Targeted bg-black/NN → token conversions for FLAT tiles/inputs/cards only.
// Image scrims, map HUDs, chips over photos, and modal backdrops are kept dark.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// [file, [from, to][]] — all occurrences of each pair in that file.
const PLAN = [
  ["src/app/tools/money-calculator/money-calculator-client.tsx", [
    ["bg-black/40", "bg-muted/60"],
    ["bg-black/50", "bg-muted/70"],
    ["bg-black/60", "bg-muted/80"],
  ]],
  ["src/app/tools/business-profit-calculator/business-calculator-client.tsx", [
    ["bg-black/40", "bg-muted/60"],
    ["bg-black/50", "bg-muted/70"],
  ]],
  ["src/app/missions/[slug]/page.tsx", [
    ["bg-black/40", "bg-muted/60"],
    ["bg-black/50", "bg-muted/70"],
  ]],
  ["src/app/compare/vehicles/compare-vehicles-client.tsx", [
    ["border border-border bg-black/40 p-2.5", "border-border bg-muted/60 p-2.5"],
    ["bg-black/40 hover:border-white/30 hover:bg-muted/40", "bg-muted/60 hover:border-primary/40 hover:bg-muted/40"],
  ]],
  ["src/app/compare/weapons/compare-weapons-client.tsx", [
    ["border border-border bg-black/40 p-2.5", "border-border bg-muted/60 p-2.5"],
    ["bg-black/40 hover:border-white/30 hover:bg-muted/40", "bg-muted/60 hover:border-primary/40 hover:bg-muted/40"],
  ]],
  ["src/app/weapons/weapons-client.tsx", [
    ["border border-border bg-black/40 py-2.5", "border-border bg-muted/60 py-2.5"],
    ["bg-black/30 p-1", "bg-muted/50 p-1"],
  ]],
  ["src/app/missions/missions-client.tsx", [
    ["border border-border bg-black/40 py-2.5", "border-border bg-muted/60 py-2.5"],
    ["bg-black/30 p-1", "bg-muted/50 p-1"],
    ["border border-border bg-black/40 p-3", "border-border bg-muted/60 p-3"],
  ]],
  ["src/app/vehicles/[slug]/page.tsx", [
    ["border border-border bg-black/40 p-3.5", "border-border bg-muted/60 p-3.5"],
    ["border border-border bg-black/40 p-3", "border-border bg-muted/60 p-3"],
  ]],
  ["src/app/weapons/[slug]/page.tsx", [
    ["border border-border bg-black/40 p-3.5", "border-border bg-muted/60 p-3.5"],
    ["border border-border bg-black/40 p-3", "border-border bg-muted/60 p-3"],
  ]],
  ["src/components/character-detail-modal.tsx", [
    ["bg-black/50 border border-border", "bg-muted/70 border border-border"],
  ]],
];

let total = 0;
for (const [f, pairs] of PLAN) {
  const p = join(ROOT, f);
  let c = readFileSync(p, "utf8");
  let n = 0;
  for (const [from, to] of pairs) {
    const parts = c.split(from);
    n += parts.length - 1;
    c = parts.join(to);
  }
  writeFileSync(p, c);
  total += n;
  console.log(String(n).padStart(3), f);
}
console.log("total:", total);
