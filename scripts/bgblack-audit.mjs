// List bg-black/NN occurrences in public files (admin excluded) with context,
// to separate image scrims (keep) from flat tiles on cards (convert).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "src");

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (f === "admin") continue;
      walk(p, out);
    } else if (/\.tsx?$/.test(f)) out.push(p);
  }
  return out;
}

for (const file of walk(ROOT)) {
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  const hits = [];
  lines.forEach((l, i) => {
    const m = l.match(/bg-black\/\d+/g);
    if (m) hits.push(`${relative(ROOT, file).replace(/\\/g, "/")}:${i + 1}: ${m.join(",")} | ${l.trim().replace(/\s+/g, " ").slice(0, 95)}`);
  });
  if (hits.length) console.log(hits.join("\n") + "\n");
}
