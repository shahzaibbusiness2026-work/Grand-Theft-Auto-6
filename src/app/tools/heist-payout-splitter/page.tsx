import { SiteShell } from "@/components/shells";
import { HeistPayoutSplitterClient } from "./heist-payout-splitter-client";
import { Users, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GTA 6 Heist Payout Splitter — Divide Crew Cuts Fairly",
  description: "Split any GTA 6 heist take among your crew. Set each member's cut percentage and see everyone's payout instantly.",
};

export default function HeistPayoutSplitterPage() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/tools" className="hover:text-primary transition-colors">Tools</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-bold">Heist Payout Splitter</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-emerald-400 mb-3">
            <Users className="h-3 w-3" /> Crew Payout Utility
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
            GTA 6 <span className="text-primary">HEIST PAYOUT SPLITTER</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Split any GTA 6 heist take among your crew. Set each member&apos;s cut percentage and see everyone&apos;s payout instantly — no more arguing over who gets what.
          </p>
        </div>

        <HeistPayoutSplitterClient />
      </div>
    </SiteShell>
  );
}
