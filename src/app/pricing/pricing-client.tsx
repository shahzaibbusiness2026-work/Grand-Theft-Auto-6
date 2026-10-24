import Link from "next/link";
import { Check, Crown } from "lucide-react";

const FREE_FEATURES = [
  "Full Leonida interactive map and map explorer",
  "Complete vehicle, weapon, character and mission databases",
  "Side-by-side vehicle and weapon comparisons",
  "100% completion tracker (saves on your device)",
  "All calculators: money, business, heist splits, loadouts, upgrades",
  "Achievements, activities, Easter eggs and controls guides",
];

/**
 * Honest membership page: there are no paid plans. Everything on
 * Taish Gaming is free. This page exists so the "Membership" links
 * across the site land on a truthful statement instead of a fake
 * paywall for features that do not exist.
 */
export function PricingClient() {
  return (
    <div className="space-y-10">
      <div className="rounded-2xl border border-primary/40 bg-primary/10 p-6 sm:p-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-primary">
          <Crown className="h-3.5 w-3.5 text-gold-light" /> Free Forever
        </div>
        <h2 className="mt-4 font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
          No Paid Plans. Everything Is Free.
        </h2>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
          Taish Gaming has no subscriptions, no premium tier and nothing for
          sale. Every map, database, comparison, tracker and tool on this site
          is free to use. If a paid membership is ever introduced after the
          game launches, it will be announced here first — nothing is charged
          today, and no account upgrade exists.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h3 className="font-display text-lg font-bold text-foreground">What&apos;s included — free</h3>
        <ul className="mt-4 space-y-2.5">
          {FREE_FEATURES.map((feat) => (
            <li key={feat} className="flex items-start gap-2.5 text-sm text-foreground/85">
              <Check className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
              {feat}
            </li>
          ))}
        </ul>
        <Link
          href="/tools"
          className="btn-primary mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wider"
        >
          Explore All Free Tools
        </Link>
      </div>
    </div>
  );
}
