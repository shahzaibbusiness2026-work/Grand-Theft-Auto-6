import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/shells";
import { WILDLIFE_PAGES } from "@/lib/wildlife";
import type { EvidenceTier } from "@/lib/gta-world";
import { serializeJsonLd } from "@/lib/utils";
import { SafeImage } from "@/components/safe-image";

export const metadata: Metadata = {
  title: "GTA 6 Wildlife: Animals Seen in Official Trailers",
  description:
    "Every animal confirmed in GTA VI's official trailers, with real trailer frames: flamingos, alligators, the green iguana, and birds and marine life spotted on camera.",
  alternates: { canonical: "/wildlife" },
  openGraph: { url: "/wildlife" },
};

const TIER_STYLES: Record<EvidenceTier, string> = {
  "Rockstar confirmed":
    "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  "Observed in official media":
    "border-cyan-400/40 bg-cyan-400/10 text-cyan-300",
  "Community identification":
    "border-amber-400/40 bg-amber-400/10 text-amber-300",
};

export default function WildlifeHubPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.taishgaming.com/" },
      { "@type": "ListItem", position: 2, name: "GTA 6 Wildlife", item: "https://www.taishgaming.com/wildlife" },
    ],
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <div className="bg-[#000713] text-white">
        <div className="container-site py-8">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-white/60"
          >
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-white">GTA 6 Wildlife</span>
          </nav>

          <header className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">
              GTA VI Wildlife
            </p>
            <h1 className="mt-2 font-display text-3xl font-black leading-tight sm:text-4xl">
              GTA 6 Wildlife
            </h1>
            <p className="mt-3 text-base leading-relaxed text-white/75">
              Animals in GTA VI, shown only where the official trailers actually
              show them. Every frame below is a real trailer still, and every
              species claim carries its evidence level. Nothing here is guessed,
              and no species gets a page without a real frame.
            </p>
          </header>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {WILDLIFE_PAGES.map((page) => (
              <Link
                key={page.slug}
                href={`/wildlife/${page.slug}`}
                className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-colors hover:border-white/25"
              >
                <SafeImage
                  src={page.hero}
                  alt={page.heroAlt}
                  width={1200}
                  height={675}
                  className="h-auto w-full object-cover"
                />
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-bold leading-snug text-white group-hover:underline">
                      {page.name}
                    </h2>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${TIER_STYLES[page.tier]}`}
                    >
                      {page.tier}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    {page.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm leading-relaxed text-white/70">
              More species pages arrive as official footage confirms them. For
              the full evidence-labelled catalogue, see{" "}
              <Link href="/gta-6-world/animals-wildlife" className="font-bold text-white underline">
                Animals &amp; Wildlife
              </Link>{" "}
              and{" "}
              <Link href="/gta-6-world/birds-marine-life" className="font-bold text-white underline">
                Birds &amp; Marine Life
              </Link>{" "}
              in GTA VI World.
            </p>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
