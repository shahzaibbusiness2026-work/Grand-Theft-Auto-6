// One-off: convert hardcoded dark-only color classes to theme-aware tokens
// across the pages the owner flagged as broken in bright mode.
// Dark-mode output is visually unchanged (tokens equal the dark palette).
import { readFileSync, writeFileSync } from "node:fs";

const files = [
  "src/app/tools/page.tsx",
  "src/app/tools/money-calculator/money-calculator-client.tsx",
  "src/app/tools/money-maker/money-maker-client.tsx",
  "src/app/tools/business-profit-calculator/business-calculator-client.tsx",
  "src/app/tools/loadout-builder/loadout-client.tsx",
  "src/app/database/vehicles/vehicles-db-client.tsx",
  "src/app/database/weapons/weapons-db-client.tsx",
  "src/app/radio/radio-client.tsx",
  "src/app/characters/characters-client.tsx",
];

const MAP = [
  // hero gradients → theme-aware (light: card tint, dark: original neon night)
  ["from-[#0e0717] via-[#070b15] to-[#040810]", "from-card via-card to-primary/5 dark:from-[#0e0717] dark:via-[#070b15] dark:to-[#040810]"],
  ["from-[#070b15] via-[#0e0717] to-[#040810]", "from-card via-card to-primary/5 dark:from-[#070b15] dark:via-[#0e0717] dark:to-[#040810]"],
  ["from-[#070b15] to-[#040810]", "from-card to-primary/5 dark:from-[#070b15] dark:to-[#040810]"],
  ["from-[#0B1020] via-[#141C2E] to-[#0B1020]", "from-card via-card to-primary/5 dark:from-[#0B1020] dark:via-[#141C2E] dark:to-[#0B1020]"],
  ["from-slate-900 via-slate-950 to-primary/10", "from-card via-card to-primary/10 dark:from-slate-900 dark:via-slate-950"],
  // cyan neon accent → readable in light, original in dark
  ["text-[#00F0FF]", "text-cyan-600 dark:text-[#00F0FF]"],
  ["border-[#00F0FF]", "border-cyan-500 dark:border-[#00F0FF]"],
  // radio page palette
  ["bg-[#141C2E]", "bg-card"],
  ["bg-[#1C2740]", "bg-muted"],
  ["border-[#33415C]", "border-border"],
  ["text-[#B5C0D4]", "text-muted-foreground"],
  ["text-[#94A3BD]", "text-muted-foreground"],
  ["text-[#B8AAFF]", "text-primary"],
  ["hover:border-[#66748F]", "hover:border-primary/40"],
  ["hover:bg-[#1C2740]/50", "hover:bg-muted/50"],
  ["focus:border-[#B8AAFF]", "focus:border-primary"],
  ["border-[#B8AAFF]", "border-primary"],
  ["hover:border-[#B8AAFF]", "hover:border-primary"],
  // slate scale → tokens
  ["border-slate-800/60", "border-border/60"],
  ["border-slate-800", "border-border"],
  ["border-slate-700", "border-border"],
  ["bg-slate-950", "bg-background"],
  ["bg-slate-900/70", "bg-card"],
  ["bg-slate-900/60", "bg-card/60"],
  ["bg-slate-900", "bg-card"],
  ["bg-slate-800", "bg-muted"],
  ["text-slate-200", "text-foreground"],
  ["text-slate-300", "text-muted-foreground"],
  ["text-slate-400", "text-muted-foreground"],
  ["text-slate-500", "text-muted-foreground"],
  // white alphas → tokens
  ["border-white/20", "border-border"],
  ["border-white/15", "border-border"],
  ["border-white/10", "border-border"],
  ["border-white/5", "border-border"],
  ["bg-white/20", "bg-muted/60"],
  ["bg-white/10", "bg-muted/50"],
  ["bg-white/5", "bg-muted/40"],
  // prefixed variant before generic
  ["group-hover:text-white", "group-hover:text-foreground"],
  // generic white text → token (dark mode renders the same)
  ["text-white", "text-foreground"],
];

let total = 0;
for (const f of files) {
  const path = new URL(`../${f}`, import.meta.url);
  let c = readFileSync(path, "utf8");
  let n = 0;
  for (const [from, to] of MAP) {
    const parts = c.split(from);
    if (parts.length > 1) {
      n += parts.length - 1;
      c = parts.join(to);
    }
  }
  writeFileSync(path, c);
  total += n;
  console.log(String(n).padStart(3), f);
}
console.log("total replacements:", total);
