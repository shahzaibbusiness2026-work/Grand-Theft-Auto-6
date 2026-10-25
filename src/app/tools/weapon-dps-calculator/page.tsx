import { SiteShell } from "@/components/shells";
import { serializeJsonLd } from "@/lib/utils";
import { WeaponDpsCalculatorClient } from "./weapon-dps-calculator-client";
import { Crosshair, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GTA 6 Weapon DPS Calculator — Damage, Fire Rate & Attachments",
  description: "Compare GTA 6 weapons by DPS. Add attachments and see live damage-per-second, damage-per-magazine, and time-to-empty.",

  alternates: { canonical: "/tools/weapon-dps-calculator" },
};

export default function WeaponDpsCalculatorPage() {
  return (
        <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: "https://www.taishgaming.com/" },
                  { "@type": "ListItem", position: 2, name: "Tools", item: "https://www.taishgaming.com/tools" },
                  { "@type": "ListItem", position: 3, name: "GTA 6 Weapon DPS Calculator \u2014 Damage, Fire Rate & Attachments", item: "https://www.taishgaming.com/tools/weapon-dps-calculator" },
                ],
              },
              {
                "@type": "WebApplication",
                name: "GTA 6 Weapon DPS Calculator \u2014 Damage, Fire Rate & Attachments",
                description: "Compare GTA 6 weapons by DPS. Add attachments and see live damage-per-second, damage-per-magazine, and time-to-empty.",
                url: "https://www.taishgaming.com/tools/weapon-dps-calculator",
                applicationCategory: "UtilitiesApplication",
                operatingSystem: "Web",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              },
            ],
          }),
        }}
      />
      <div className="container-site py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/tools" className="hover:text-primary transition-colors">Tools</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-bold">Weapon DPS Calculator</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-orange-400 mb-3">
            <Crosshair className="h-3 w-3" /> Combat Analytics
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
            GTA 6 <span className="text-primary">WEAPON DPS CALCULATOR</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Pick a weapon, stack attachments, and watch damage-per-second update live. Compare every loadout at a glance, then copy your final build to share with your crew.
          </p>
        </div>

        <WeaponDpsCalculatorClient />
      </div>
    </SiteShell>
  );
}
