import { SiteShell } from "@/components/shells";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { REGION_PAGES } from "@/lib/regions";

export const metadata: Metadata = {
  alternates: { canonical: "/regions" },
  openGraph: { url: "/regions" },
  title: "GTA 6 Leonida: All Six Regions & Map",
  description:
    "Explore Rockstar's six named GTA VI regions, from Vice City to Mount Kalaga, with official descriptions separated from unconfirmed map details.",
};

export default function RegionsHubPage() {
  return (
    <SiteShell>
      <main className="min-h-screen bg-[#000713] text-white">
        <section className="container-site px-4 pt-12 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#34D399]">
            Leonida
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
            GTA 6 Regions
          </h1>
          <p className="mt-3 max-w-3xl text-white/70">
            Rockstar describes Leonida as a state of six regions — from Vice
            City’s excess to Mount Kalaga’s backwoods. Each page below quotes
            Rockstar’s own region description, lists what is confirmed, and
            says plainly what is not. Rockstar has published no official map,
            so borders and positions are left unconfirmed throughout.
          </p>
          <p className="mt-4 text-sm text-white/70">
            <Link href="/map" className="underline text-white">
              Explore our interactive Leonida fan map
            </Link>{" "}
            with provisional pins and device-local notes. Pin placement is
            separate from Rockstar&apos;s confirmed destination names.
            {" "}Our <Link href="/guides/vice-city-map-guide" className="underline text-white">Leonida map guide</Link> explains
            how the named destinations relate to the available official evidence.
          </p>
        </section>
        <section className="container-site px-4 pb-16">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {REGION_PAGES.map((region) => (
              <Link
                key={region.slug}
                href={`/regions/${region.slug}`}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-white/30"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={region.hero}
                    alt={region.heroAlt}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#34D399]">
                    Rockstar confirmed
                  </p>
                  <h2 className="mt-1 text-xl font-bold">{region.name}</h2>
                  <p className="mt-1 text-sm text-white/60">
                    {region.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <p className="mt-8 text-sm text-white/50">
            Region descriptions are Rockstar’s own words from the official
            “Only in Leonida” page. Everything else on each region page is
            labelled by its evidence tier.
          </p>
        </section>
      </main>
    </SiteShell>
  );
}
