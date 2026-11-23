import Link from "next/link";
import { SiteShell } from "@/components/shells";
import type { Metadata } from "next";
import { pageOpenGraph } from "@/lib/page-metadata";

export const metadata: Metadata = {
    openGraph: pageOpenGraph("/money-guide"),
  title: "GTA 6 Money: Evidence & Methods",
  description: "Bank vaults up to $200,000, Randy's cars $30,000+, jewelry $10,000–$25,000 — verified GTA 6 money methods, payouts and unlocks.",
  alternates: { canonical: "/money-guide" },
};

type Method = { name: string; payout: string; effort: string; desc: string; status: string };
const METHODS: Method[] = [
  { name: "Story Heists", payout: "Up to $200,000", effort: "Chapter 4", desc: "Large bank vault robberies pay up to $200,000 per job in Chapter 4, after the side quest \"That's Where The Money Is...\" and two Payday Loan jobs. Jewelry store robberies pay $10,000–$25,000 from Chapter 3.", status: "Payouts verified" },
  { name: "Businesses", payout: "Not for sale", effort: "—", desc: "No businesses are for sale in GTA 6. The eight garages in the Vice City Real Estate app (about $160,000 for the set) are storage, not investments — they earn nothing.", status: "Confirmed unavailable" },
  { name: "Side Jobs & Gigs", payout: "$1,000–$30,000+", effort: "Chapters 2–3", desc: "Selling cars to Moses pays $1,000–$5,000 from Chapter 2; Randy's Wish List deliveries pay $30,000 or more per car from Chapter 3. Races and shooting-range competitions pay a few thousand.", status: "Payouts verified" },
  { name: "Collectibles & Caches", payout: "$200–$2,600 a piece", effort: "Chapter 1", desc: "Sunken treasure sells for $200–$2,600 a piece, and a full clear adds up to tens of thousands. Pawn shops buy cards, doubloons and meteorites for a few hundred each.", status: "Payouts verified" },
  { name: "Hunting & Fishing Trade", payout: "Varies", effort: "Open world", desc: "Bret at Killtelligence Provisions buys pristine skins — one-shot kills pay best. Boars, bears and alligators are the ones he arranges pickup for himself.", status: "Mechanics verified" },
];

export default function MoneyGuidePage() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        <div className="max-w-3xl mb-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">Guides</p>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-foreground mt-2">Money Guide</h1>
          <p className="text-foreground/70 mt-3">GTA 6 launched on 19 November 2026, and the methods below are now verified from gameplay reporting. Payouts are ranges, not promises — they change with the car, the loot and the chapter. Our calculators demonstrate custom or fictional inputs; they do not establish GTA VI earnings.</p>
          <p className="mt-3 text-sm text-foreground/70">Correction, October 30, 2026: earlier payout and effort rankings were unsupported and have been withdrawn. Story context: <a className="underline" href="https://www.rockstargames.com/VI" target="_blank" rel="noreferrer">Rockstar&apos;s official GTA VI page</a>. Character business backgrounds: <a className="underline" href="https://www.rockstargames.com/VI/only-in-leonida" target="_blank" rel="noreferrer">Only in Leonida</a>.</p>
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
          <Link href="/tools/business-profit-calculator" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-bold">Business Profit Calculator</Link>
          <Link href="/tools/business-income-calculator" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-bold">Business Income Calculator</Link>
          <Link href="/businesses" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-bold">Businesses</Link>
        </div>
        <p className="mt-6 text-sm text-foreground/70">Read the <Link className="underline" href="/news/gta-6-money-guide-robberies-fences-economy">economy claim correction log</Link> for the specific robbery, wanted-level and app claims awaiting source verification, or <Link className="underline" href="/corrections">send exact supporting evidence</Link>.</p>
      </div>
    </SiteShell>
  );
}
