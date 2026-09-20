import Link from "next/link";
import { Crown, ArrowRight } from "lucide-react";
import { SiteShell } from "./shells";

export { SiteShell as AppShell, SiteShell } from "./shells";

export function PremiumCard() {
  return (
    <div className="card-carbon relative overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-br from-card to-primary/10 p-5 shadow-lg">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
        <Crown className="h-4 w-4 text-amber-400" /> Vice City Pro
      </div>
      <h3 className="mt-2 font-display text-base font-extrabold uppercase tracking-tight text-white">
        Unlock VIP Intelligence
      </h3>
      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
        Access real-time database comparisons, advanced calculators, and custom loadouts.
      </p>
      <Link
        href="/pricing"
        className="btn-primary mt-4 inline-flex w-full items-center justify-center gap-1.5 py-2 text-xs font-bold uppercase tracking-wider"
      >
        <span>Explore Pro Access</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

export default SiteShell;
