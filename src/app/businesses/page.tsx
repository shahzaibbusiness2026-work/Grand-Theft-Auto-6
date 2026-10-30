import Link from "next/link";
import { SiteShell } from "@/components/shells";
import type { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: { url: "/businesses" },
  title: "GTA 6 Business Concepts | Taish Gaming",
  description: "Fan-made business ideas for GTA VI. Rockstar has not confirmed purchasable businesses, income or operating mechanics.",
  alternates: { canonical: "/businesses" },
  robots: { index: false, follow: true },
};

type Biz = { name: string; desc: string };
const BIZ: Biz[] = [
  { name: "Bait & Tackle Shop", desc: "Fan concept only. No official source confirms that this business can be purchased or operated." },
  { name: "Chop Shop", desc: "A chop shop appears in this fan-made list. Payouts, police response and ownership mechanics are unverified." },
  { name: "Luxury Car Dealership", desc: "A fictional planning concept. Prices, margins, inventory and dealership ownership have not been confirmed." },
  { name: "Malibú Nightclub", desc: "A fan-made business idea. The nightclub name and any related income or management system are unverified." },
  { name: "Smuggler Warehouse", desc: "A fictional scenario for planning. No official source confirms warehouse ownership, patrol behavior or profit mechanics." },
  { name: "Taxi Depot", desc: "A fan-made concept. Taxi ownership, passive income and business availability have not been confirmed." },
];

export default function BusinessesPage() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        <div className="max-w-3xl mb-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">Fan concepts · Not confirmed</p>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-foreground mt-2">Businesses</h1>
          <p className="text-foreground/70 mt-3">This is a fan-made concept list, not a guide to confirmed GTA VI features. Rockstar has not verified these businesses as purchasable, their income, or how they would operate. Calculator links below use hypothetical inputs only.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {BIZ.map((b) => (
            <article key={b.name} className="rounded-xl border border-white/10 bg-black/20 p-5 flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-bold text-lg leading-snug">{b.name}</h2>
                <span className="shrink-0 text-xs font-black px-2 py-1 rounded-full border bg-primary/10 text-primary border-primary/40">Fan concept</span>
              </div>
              <p className="text-sm text-foreground/70 mt-2 leading-relaxed flex-1">{b.desc}</p>
              <p className="text-sm text-foreground/90 mt-3"><strong>Evidence:</strong> No verified ownership or income data.</p>
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
