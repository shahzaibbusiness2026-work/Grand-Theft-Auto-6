import Link from "next/link";
import { SiteShell } from "@/components/shells";
import type { Metadata } from "next";

export const metadata: Metadata = {
    openGraph: { url: "/money-guide" },
  title: "GTA 6 Money Guide: Evidence & Unverified Methods",
  description: "What is verified about GTA 6 money? Check source limits for heists, businesses and other proposed methods before relying on payouts or income calculators.",
  alternates: { canonical: "/money-guide" },
};

type Method = { name: string; payout: string; effort: string; desc: string; status: string };
const METHODS: Method[] = [
  { name: "Story Heists", payout: "Unverified", effort: "Unverified", desc: "Rockstar's story setup places Jason and Lucia in a criminal conspiracy. That premise does not establish the number of heists, their rewards, whether they can be repeated or which missions require money.", status: "Payout rules unverified" },
  { name: "Businesses", payout: "Unverified", effort: "Unverified", desc: "A character running a business does not establish that players can buy it or receive passive income. Purchase prices, running costs and return on investment need their own gameplay evidence.", status: "Player ownership unverified" },
  { name: "Side Jobs & Gigs", payout: "Unverified", effort: "Unverified", desc: "Taxi work, deliveries and other activities from earlier GTA games should not be presented as verified GTA VI income methods without a direct source. We have not established a reliable payout comparison.", status: "Income methods unverified" },
  { name: "Collectibles & Caches", payout: "Unverified", effort: "Unverified", desc: "A provisional fan-map pin is not a verified collectible location or reward. Cache payouts, unlockables and completion requirements remain unverified in this guide.", status: "Locations and rewards unverified" },
  { name: "Hunting & Fishing Trade", payout: "Unverified", effort: "Unverified", desc: "Animals and outdoor scenery do not by themselves confirm a hunting or fishing economy. Selling rules, buyers and prices require explicit evidence before they can support a money-making guide.", status: "Trading mechanics unverified" },
];

export default function MoneyGuidePage() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        <div className="max-w-3xl mb-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">Guides</p>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-foreground mt-2">Money Guide</h1>
          <p className="text-foreground/70 mt-3">There is no verified payout ranking in this guide. Use it to check which claims still need evidence before planning a money-making route. Our calculators demonstrate custom or fictional inputs; they do not establish GTA VI earnings.</p>
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
          <Link href="/businesses" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-bold">Businesses</Link>
        </div>
        <p className="mt-6 text-sm text-foreground/70">Read the <Link className="underline" href="/news/gta-6-money-guide-robberies-fences-economy">economy claim correction log</Link> for the specific robbery, wanted-level and app claims awaiting source verification, or <Link className="underline" href="/corrections">send exact supporting evidence</Link>.</p>
      </div>
    </SiteShell>
  );
}
