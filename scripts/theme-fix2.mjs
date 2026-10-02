// Bright-mode fix pass #2 — public site only (admin stays dark by design).
// Dark-mode output is visually unchanged; light mode flips to tokens.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const FILES = [
  "src/components/satellite-interactive-map.tsx",
  "src/components/character-detail-modal.tsx",
  "src/components/hero/Countdown.tsx",
  "src/components/hero/HeroSection.tsx",
  "src/components/hero/HeroBackground.tsx",
  "src/components/protagonists-showcase.tsx",
  "src/components/command-palette.tsx",
  "src/components/favorite-button.tsx",
  "src/components/confidence-badge.tsx",
  "src/components/logo.tsx",
  "src/app/compare/vehicles/compare-vehicles-client.tsx",
  "src/app/compare/weapons/compare-weapons-client.tsx",
  "src/app/missions/missions-client.tsx",
  "src/app/missions/page.tsx",
  "src/app/map/map-client.tsx",
  "src/app/vehicles/[slug]/page.tsx",
  "src/app/vehicles/vehicles-client.tsx",
  "src/app/vehicles/page.tsx",
  "src/app/weapons/[slug]/page.tsx",
  "src/app/weapons/weapons-client.tsx",
  "src/app/weapons/page.tsx",
  "src/app/cheats/page.tsx",
  "src/app/about/page.tsx",
  "src/app/cookies/page.tsx",
  "src/app/privacy/page.tsx",
  "src/app/terms/page.tsx",
  "src/app/properties/properties-client.tsx",
  "src/app/properties/[slug]/page.tsx",
  "src/app/properties/page.tsx",
  "src/app/collectibles/collectibles-client.tsx",
  "src/app/collectibles/[slug]/page.tsx",
  "src/app/collectibles/page.tsx",
  "src/app/locations/locations-client.tsx",
  "src/app/locations/[slug]/page.tsx",
  "src/app/locations/page.tsx",
  "src/app/pricing/pricing-client.tsx",
  "src/app/pricing/page.tsx",
  "src/app/ai/ai-client.tsx",
  "src/app/ai/page.tsx",
  "src/app/dashboard/dashboard-sidebar.tsx",
  "src/app/dashboard/dashboard-view.tsx",
  "src/app/dashboard/loading.tsx",
  "src/components/dashboard/companion-topbar.tsx",
  "src/components/dashboard/companion-map-section.tsx",
  "src/components/dashboard/companion-vehicles-section.tsx",
  "src/components/dashboard/companion-weapons-section.tsx",
  "src/components/dashboard/companion-continue-card.tsx",
  "src/components/dashboard/companion-goals-card.tsx",
  "src/components/dashboard/companion-progress-card.tsx",
  "src/components/dashboard/companion-sidebar.tsx",
  "src/components/dashboard/companion-hero.tsx",
  "src/components/dashboard/companion-recommendations-card.tsx",
  "src/components/dashboard/companion-activity-card.tsx",
  "src/components/dashboard/companion-updates-card.tsx",
  "src/components/dashboard/companion-ai-card.tsx",
  "src/components/dashboard/companion-quote-card.tsx",
  "src/app/tools/business-profit-calculator/business-calculator-client.tsx",
  "src/app/tools/money-calculator/money-calculator-client.tsx",
  "src/app/tools/business-profit-calculator/page.tsx",
  "src/app/tools/money-calculator/page.tsx",
  "src/app/characters/characters-client.tsx",
  "src/app/page.tsx",
];

// lookbehind keeps already-migrated dark: variants intact
const MAP = [
  // neon cyan accent → readable in light, original in dark
  [/(?<!dark:)text-\[#00F0FF\]/g, "text-cyan-600 dark:text-[#00F0FF]"],
  [/(?<!dark:)border-\[#00F0FF\]/g, "border-cyan-500 dark:border-[#00F0FF]"],
  [/(?<!dark:)ring-\[#00F0FF\]/g, "ring-cyan-500 dark:ring-[#00F0FF]"],
  [/(?<!dark:)bg-\[#00F0FF\]/g, "bg-cyan-500 dark:bg-[#00F0FF]"],
  [/(?<!dark:)from-\[#00F0FF\]/g, "from-cyan-500 dark:from-[#00F0FF]"],
  [/(?<!dark:)via-\[#00F0FF\]/g, "via-cyan-500 dark:via-[#00F0FF]"],
  // hex navy/grey palette → tokens (radio/about/cheats family)
  [/text-\[#B5C0D4\]/g, "text-muted-foreground"],
  [/text-\[#94A3BD\]/g, "text-muted-foreground"],
  [/text-\[#B8AAFF\]/g, "text-primary"],
  [/placeholder-\[#94A3BD\]/g, "placeholder:text-muted-foreground"],
  [/placeholder-\[#374151\]/g, "placeholder:text-muted-foreground"],
  [/border-\[#33415C\]/g, "border-border"],
  [/bg-\[#141C2E\]/g, "bg-card"],
  [/bg-\[#1C2740\]/g, "bg-muted"],
  [/text-\[#F3A398\]/g, "text-accent"],
  // dashboard deep-navy backgrounds → theme-aware
  [/bg-\[#04060d\]/g, "bg-background dark:bg-[#04060d]"],
  [/bg-\[#070b14\]/g, "bg-background dark:bg-[#070b14]"],
  [/bg-\[#0c1222\]/g, "bg-card dark:bg-[#0c1222]"],
  [/bg-\[#0e0717\]/g, "bg-card dark:bg-[#0e0717]"],
  [/from-\[#070b14\]/g, "from-card dark:from-[#070b14]"],
  [/from-\[#0c0517\]/g, "from-card dark:from-[#0c0517]"],
  [/bg-\[#090d16\]/g, "bg-card dark:bg-[#090d16]"],
  [/bg-\[#020408\]/g, "bg-background dark:bg-[#020408]"],
  // mid-grey text → tokens
  [/text-slate-200/g, "text-foreground"],
  [/text-slate-300/g, "text-muted-foreground"],
  [/text-slate-400/g, "text-muted-foreground"],
  [/text-slate-500/g, "text-muted-foreground"],
  // white alphas → tokens
  [/border-white\/20/g, "border-border"],
  [/border-white\/15/g, "border-border"],
  [/border-white\/10/g, "border-border"],
  [/border-white\/5/g, "border-border"],
  [/divide-white\/10/g, "divide-border"],
  [/bg-white\/20/g, "bg-muted/60"],
  [/bg-white\/10/g, "bg-muted/50"],
  [/bg-white\/5/g, "bg-muted/40"],
  [/ring-white\/10/g, "ring-border"],
];

let total = 0;
for (const f of FILES) {
  const p = join(ROOT, f);
  let c;
  try { c = readFileSync(p, "utf8"); } catch { console.log("skip", f); continue; }
  let n = 0;
  for (const [re, to] of MAP) {
    c = c.replace(re, (m) => { n++; return to; });
  }
  writeFileSync(p, c);
  total += n;
  console.log(String(n).padStart(4), f);
}
console.log("total replacements:", total);
