import Link from "next/link";
import { SiteShell } from "@/components/shells";
import type { Metadata } from "next";

export const metadata: Metadata = {
    openGraph: { url: "/money-guide" },
  title: "GTA 6 Money Guide — How to Make Money Fast",
  description: "Every way to make money in GTA 6: story heists, businesses, side jobs, collectibles and caches — ranked by effort and payout, with calculators to plan each route.",
  alternates: { canonical: "/money-guide" },
};

type Method = { name: string; payout: string; effort: string; desc: string; status: string };
const METHODS: Method[] = [
  { name: "Story Heists", payout: "Highest", effort: "High", desc: "Jason and Lucia's headline jobs pay the biggest single sums in the game — the vault job from the trailers is the template. Progress-gated, unrepeatable, unforgettable.", status: "Confirmed structure" },
  { name: "Businesses", payout: "High (passive)", effort: "Medium", desc: "Buy in, then earn while you do other things. Nightclubs, dealerships and smuggling warehouses stack into a real empire over time.", status: "See businesses" },
  { name: "Side Jobs & Gigs", payout: "Medium", effort: "Medium", desc: "Taxi work, deliveries and odd jobs around Vice City. Steady money between big scores, and the fastest way to learn the map.", status: "Expected" },
  { name: "Collectibles & Caches", payout: "Medium", effort: "Low–Medium", desc: "Hidden packages and submerged caches pay in cash and unlockables. Slow per item, but free money while exploring.", status: "Confirmed (caches)" },
  { name: "Hunting & Fishing Trade", payout: "Low–Medium", effort: "Low", desc: "Sell what you catch and hunt in Kalaga and the Keys. Relaxing income that pairs with the outdoors activities.", status: "Expected" },
];

export default function MoneyGuidePage() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        <div className="max-w-3xl mb-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">Guides</p>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-foreground mt-2">Money Guide</h1>
          <p className="text-foreground/70 mt-3">Leonida rewards the patient and the bold in different ways. Every method below is ranked by payout and effort — no stock market has been confirmed for GTA 6, so don&apos;t plan around one.</p>
        </div>
        <div className="grid gap-4">
          {METHODS.map((m) => (
            <article key={m.name} className="rounded-xl border border-white/10 bg-black/20 p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="font-bold text-lg">{m.name}</h2>
                  <span className="text-xs font-black px-2 py-1 rounded-full border bg-primary/10 text-primary border-primary/40">{m.status}</span>
                </div>
                <p className="text-sm text-foreground/70 mt-2 leading-relaxed">{m.desc}</p>
              </div>
              <div className="sm:text-right shrink-0 text-sm">
                <p><span className="text-foreground/50">Payout:</span> <strong>{m.payout}</strong></p>
                <p className="mt-1"><span className="text-foreground/50">Effort:</span> <strong>{m.effort}</strong></p>
              </div>
            </article>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-8">
          <Link href="/tools/money-calculator" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white">Money Calculator</Link>
          <Link href="/tools/money-maker" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-bold">Money-Making Method Finder</Link>
          <Link href="/tools/heist-payout-splitter" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-bold">Heist Payout Splitter</Link>
          <Link href="/businesses" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-bold">Businesses</Link>
        </div>
      </div>
    </SiteShell>
  );
}
