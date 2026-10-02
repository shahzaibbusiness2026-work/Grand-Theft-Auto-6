// Bright-mode pass 3: slate-700/800/900 family → tokens in the remaining
// public surfaces. Over-image placeholders in hero/map components are
// intentionally NOT in this list.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const FILES = [
  "src/app/ai/ai-client.tsx",
  "src/app/collectibles/collectibles-client.tsx",
  "src/app/collectibles/[slug]/page.tsx",
  "src/app/locations/locations-client.tsx",
  "src/app/locations/[slug]/page.tsx",
  "src/app/pricing/pricing-client.tsx",
  "src/app/properties/properties-client.tsx",
  "src/app/properties/[slug]/page.tsx",
  "src/components/command-palette.tsx",
];

// Order matters: longer/more specific first.
const MAP = [
  ["hover:border-slate-700", "hover:border-primary/40"],
  ["border-slate-800/80", "border-border"],
  ["border-slate-800/60", "border-border/60"],
  ["border-slate-800", "border-border"],
  ["border-slate-700/60", "border-border"],
  ["border-slate-700", "border-border"],
  ["divide-slate-800/40", "divide-border"],
  ["bg-slate-950/80", "bg-muted/50"],
  ["bg-slate-950/70", "bg-muted/50"],
  ["bg-slate-950/60", "bg-muted/40"],
  ["bg-slate-950", "bg-background"],
  ["bg-slate-900/95", "bg-card/95"],
  ["bg-slate-900/90", "bg-muted/80"],
  ["bg-slate-900/80", "bg-card/80"],
  ["bg-slate-900/60", "bg-card/60"],
  ["bg-slate-900", "bg-card"],
  ["hover:bg-slate-800", "hover:bg-muted"],
  ["bg-slate-800/80", "bg-muted/80"],
  ["bg-slate-800/50", "bg-muted/50"],
  ["bg-slate-800", "bg-muted"],
];

let total = 0;
for (const f of FILES) {
  const p = join(ROOT, f);
  let c = readFileSync(p, "utf8");
  let n = 0;
  for (const [from, to] of MAP) {
    const parts = c.split(from);
    n += parts.length - 1;
    c = parts.join(to);
  }
  writeFileSync(p, c);
  total += n;
  console.log(String(n).padStart(3), f);
}
console.log("total replacements:", total);
