import { SiteShell } from "@/components/shells";
import { PricingClient } from "./pricing-client";
import { Crown } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Membership — Everything Is Free | Taish Gaming",
  description:
    "Taish Gaming has no paid plans. Every map, database, comparison, tracker and tool on the site is free to use.",
  alternates: { canonical: "/pricing" },
  };

export default function PricingPage() {
  return (
    <SiteShell>
      <div className="container-site py-12">
        {/* Header Hero */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-primary mb-2">
            <Crown className="h-3.5 w-3.5 text-gold-light" /> Free Forever
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-foreground">
            MEMBERSHIP
          </h1>
          <p className="text-sm text-muted-foreground">
            There are no paid plans on Taish Gaming. Everything here is free.
          </p>
        </div>

        <PricingClient />
      </div>
    </SiteShell>
  );
}
