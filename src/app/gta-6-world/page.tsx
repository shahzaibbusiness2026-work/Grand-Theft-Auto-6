import type { Metadata } from "next";
import { SiteShell } from "@/components/shells";
import { SafeImage } from "@/components/safe-image";
import { WorldHubSections } from "./world-hub-client";

export const metadata: Metadata = {
  openGraph: { url: "/gta-6-world" },
  title: "GTA 6 World: Wildlife, Radio, City Life & Secrets",
  description:
    "Explore the world of GTA 6: wildlife, regions, media, city life, activities and discoveries across Leonida. Source-backed guides and fan analysis.",
  alternates: { canonical: "/gta-6-world" },
};

export default function GTAWorldHubPage() {
  return (
    <SiteShell>
      <div className="bg-[#000713] text-white">
        {/* Hero: live text over artwork, never a flattened screenshot. */}
        <div className="relative min-h-[252px] overflow-hidden">
          <SafeImage
            src="/img/hero-vice-skyline-hd.jpg"
            alt="Vice City skyline at sunset over the water"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#000713] via-transparent to-transparent" aria-hidden="true" />
          <div className="container-site relative flex min-h-[252px] flex-col justify-center py-10">
            <h1 className="font-display text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              <span className="text-white">GTA VI</span>{" "}
              <span className="bg-gradient-to-r from-[#FF2E9A] via-[#F13AAE] to-[#FF8A3D] bg-clip-text text-transparent">
                WORLD
              </span>
            </h1>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.28em] text-white/85 sm:text-sm">
              Explore the living world of GTA 6
            </p>
          </div>
        </div>

        <div className="container-site py-8">
          <p className="mb-8 max-w-3xl text-sm leading-relaxed text-white/70">
            Sixteen corners of Leonida, from its wetlands and airwaves to its
            hotels, gangs, and hidden secrets. Every guide inside labels its
            evidence: what Rockstar confirmed, what is visible in official
            footage, and what is still unconfirmed. Card images are official trailer stills and official
            Rockstar screenshots (wildlife images via Game Informer); the
            facts inside each guide are sourced.
          </p>
          <WorldHubSections />
        </div>
      </div>
    </SiteShell>
  );
}
