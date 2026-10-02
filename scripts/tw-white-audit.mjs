// List remaining text-white lines in public files (admin excluded).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "src");

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (f === "admin") continue; // admin is dark-only by design
      walk(p, out);
    } else if (/\.tsx?$/.test(f)) out.push(p);
  }
  return out;
}

for (const file of walk(ROOT)) {
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  lines.forEach((l, i) => {
    if (/\btext-white\b/.test(l) && !/text-white\/\d+/.test(l)) {
      console.log(relative(ROOT, file).replace(/\\/g, "/") + ":" + (i + 1) + ": " + l.trim().slice(0, 120));
    }
  });
}
