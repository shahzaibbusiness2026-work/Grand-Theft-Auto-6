// Full-project bright-mode audit: hardcoded dark-only classes per file.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, relative, dirname } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "src");

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(tsx|ts|css)$/.test(f)) out.push(p);
  }
  return out;
}

const COLOR_RE = /(?:text|bg|border|placeholder|divide|ring|from|via|to|fill|stroke)-(?:\[[0-9a-fA-F#]{3,8}\]|slate-[1-4]\d\d|zinc-[1-4]\d\d|gray-[1-4]\d\d|white\/\d+|black\/\d+)(?=[\s"'`,)])/g;

const results = [];
for (const file of walk(ROOT)) {
  const c = readFileSync(file, "utf8");
  const matches = c.match(COLOR_RE) || [];
  if (matches.length === 0) continue;
  // Classify: white/black alphas and slate/zinc/gray on dark-designed surfaces
  const counts = {};
  for (const m of matches) counts[m] = (counts[m] || 0) + 1;
  results.push({ file: relative(ROOT, file), total: matches.length, counts });
}
results.sort((a, b) => b.total - a.total);
for (const r of results) {
  const top = Object.entries(r.counts).sort((a, b) => b[1] - a[1]).slice(0, 6)
    .map(([k, v]) => `${k}×${v}`).join(" ");
  console.log(String(r.total).padStart(4), r.file, "  |", top);
}
console.log("\nfiles with hardcoded colors:", results.length);
