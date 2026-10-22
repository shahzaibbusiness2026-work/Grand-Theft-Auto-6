import Link from "next/link";
import { SiteShell } from "@/components/shells";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GTA 6 Businesses — Buy, Run & Profit — Tahzaib Gaming",
  description: "Every GTA 6 business type: bait & tackle, chop shop, luxury dealership, nightclub, smuggler warehouse and taxi depot — with income calculators to plan your empire.",
  alternates: { canonical: "/businesses" },
};

type Biz = { name: string; style: string; desc: string; tip: string };
const BIZ: Biz[] = [
  { name: "Bait & Tackle Shop", style: "Passive + Active", desc: "Supply Leonida's fishing scene from the Keys. Steady foot traffic, low heat, and it pairs perfectly with a day on the water.", tip: "Run it alongside fishing runs for stacked income." },
  { name: "Chop Shop", style: "Active", desc: "Strip stolen rides and sell the parts. High payout per car, high police attention — the classic risk-reward business.", tip: "Use the garage planner to keep your own fleet separate from stock." },
  { name: "Luxury Car Dealership", style: "Passive + Active", desc: "Move high-end inventory to Vice City's wealthy buyers. Big margins, big upfront cost, and the best-looking front in Leonida.", tip: "Source rare vehicles first — rarity drives the margin." },
  { name: "Malibú Nightclub", style: "Passive", desc: "The NINE 1 NINE-era club scene pays while you sleep — as long as you keep the venue popular and the cops unbothered.", tip: "Popularity drives nightly income; promote before big weekends." },
  { name: "Smuggler Warehouse", style: "Active", desc: "Move product through Coast Guard-patrolled waters. The Keys smuggling routes pay the most — and carry the most risk.", tip: "Watch patrol patterns before every run; one seizure wipes a week's profit." },
  { name: "Taxi Depot", style: "Passive + Active", desc: "A fleet of cabs working Vice City around the clock. Modest per-trip money, but it never stops while you do other jobs.", tip: "The best starter business — cheap to run, always earning." },
];

export default function BusinessesPage() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        <div className="max-w-3xl mb-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">Empire Building</p>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-foreground mt-2">Businesses</h1>
          <p className="text-foreground/70 mt-3">Six ways to own Leonida instead of just robbing it. Business types match the site&apos;s income calculators — full GTA 6 business mechanics will be confirmed from gameplay at launch.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {BIZ.map((b) => (
            <article key={b.name} className="rounded-xl border border-white/10 bg-black/20 p-5 flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-bold text-lg leading-snug">{b.name}</h2>
                <span className="shrink-0 text-xs font-black px-2 py-1 rounded-full border bg-primary/10 text-primary border-primary/40">{b.style}</span>
              </div>
              <p className="text-sm text-foreground/70 mt-2 leading-relaxed flex-1">{b.desc}</p>
              <p className="text-sm text-foreground/90 mt-3"><strong>Tip:</strong> {b.tip}</p>
            </article>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-8">
          <Link href="/tools/business-income-calculator" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white">Business Income Calculator</Link>
          <Link href="/tools/business-profit-calculator" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-bold">Business Profit Calculator</Link>
          <Link href="/money-guide" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-bold">Money Guide</Link>
        </div>
      </div>
    </SiteShell>
  );
}
