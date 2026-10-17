import { SiteShell } from "@/components/shells";
import { serializeJsonLd } from "@/lib/utils";
import { PhotoSpotFinderClient } from "./photo-spot-finder-client";
import { Camera, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GTA 6 Photo Spot Finder — Best Screenshot Locations",
  description: "The most cinematic photo spots in Leonida. Best time of day, region, and pro tips for every shot.",

  alternates: { canonical: "/tools/photo-spot-finder" },
};

export default function PhotoSpotFinderPage() {
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
                  { "@type": "ListItem", position: 1, name: "Home", item: "https://grand-theft-auto-6-5ap5.vercel.app/" },
                  { "@type": "ListItem", position: 2, name: "Tools", item: "https://grand-theft-auto-6-5ap5.vercel.app/tools" },
                  { "@type": "ListItem", position: 3, name: "GTA 6 Photo Spot Finder \u2014 Best Screenshot Locations", item: "https://grand-theft-auto-6-5ap5.vercel.app/tools/photo-spot-finder" },
                ],
              },
              {
                "@type": "WebApplication",
                name: "GTA 6 Photo Spot Finder \u2014 Best Screenshot Locations",
                description: "The most cinematic photo spots in Leonida. Best time of day, region, and pro tips for every shot.",
                url: "https://grand-theft-auto-6-5ap5.vercel.app/tools/photo-spot-finder",
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
          <span className="text-foreground font-bold">Photo Spot Finder</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-cyan-400 mb-3">
            <Camera className="h-3 w-3" /> Photography Guide
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
            GTA 6 <span className="text-primary">PHOTO SPOT FINDER</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            The most cinematic screenshot locations across Leonida. Filter by region, check the best in-game time of day for every shot, and copy the full photo run checklist for your next session.
          </p>
        </div>

        <PhotoSpotFinderClient />
      </div>
    </SiteShell>
  );
}
