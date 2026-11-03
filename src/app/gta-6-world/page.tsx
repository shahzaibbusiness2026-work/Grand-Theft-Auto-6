import type { Metadata } from "next";
import { SiteShell } from "@/components/shells";
import { SafeImage } from "@/components/safe-image";
import { WorldHubSections } from "./world-hub-client";
import Link from "next/link";
import { WORLD_SECTIONS } from "@/lib/gta-world";
import {
  getWorldMedia,
  mediaSourceLabel,
  mediaWatchUrl,
  worldImageSchema,
} from "@/lib/world-media";
import { serializeJsonLd } from "@/lib/utils";

const hubImage = getWorldMedia("/gta-6-world/hotels-motels")!;

export const metadata: Metadata = {
  openGraph: {
    url: "/gta-6-world",
    images: [
      {
        url: hubImage.src,
        alt: hubImage.alt,
        width: hubImage.width,
        height: hubImage.height,
      },
    ],
  },
  twitter: { card: "summary_large_image", images: [hubImage.src] },
  robots: { "max-image-preview": "large" },
  title: "GTA 6 World: Wildlife, Radio & City Life",
  description:
    "Explore the world of GTA 6: wildlife, regions, media, city life, activities and discoveries across Leonida. Source-backed guides and fan analysis.",
  alternates: { canonical: "/gta-6-world" },
};

export default function GTAWorldHubPage() {
  const pageUrl = "https://www.taishgaming.com/gta-6-world";
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": pageUrl + "#webpage",
        url: pageUrl,
        name: "GTA 6 World",
        primaryImageOfPage: { "@id": pageUrl + "#primaryimage" },
        mainEntity: { "@id": pageUrl + "#sections" },
      },
      worldImageSchema(hubImage, pageUrl),
      {
        "@type": "ItemList",
        "@id": pageUrl + "#sections",
        itemListElement: WORLD_SECTIONS.flatMap((s) => s.cards).map(
          (card, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: card.title,
            url: "https://www.taishgaming.com" + card.href,
          }),
        ),
      },
    ],
  };
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(graph) }}
      />
      <div className="bg-[#000713] text-white">
        {/* Hero: live text over artwork, never a flattened screenshot. */}
        <div className="relative min-h-[252px] overflow-hidden">
          <SafeImage
            src={hubImage.src}
            alt={hubImage.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#000713] via-transparent to-transparent"
            aria-hidden="true"
          />
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
          <p className="mb-6 text-sm leading-relaxed text-white/80 sm:hidden">
            Explore wildlife, music and city life through official GTA VI
            images. Sources and evidence limits accompany each section.
          </p>
          <p className="mb-8 hidden max-w-3xl text-sm leading-relaxed text-white/70 sm:block">
            Explore Leonida, from its wetlands and airwaves to its hotels,
            gangs, and hidden secrets. Every guide inside labels its evidence:
            what Rockstar confirmed, what is visible in official footage, and
            what is still unconfirmed. Images come from Rockstar&apos;s official
            GTA VI trailers and screenshots. Scene context does not establish
            gameplay features; image sources are listed below.
          </p>
          <WorldHubSections />
          <details
            id="image-sources"
            className="rounded-xl border border-white/20 bg-white/5 p-4"
          >
            <summary className="min-h-11 cursor-pointer text-sm font-bold">
              Image sources and credits
            </summary>
            <ul className="mt-3 grid gap-3 text-xs text-white/80 sm:grid-cols-2">
              {WORLD_SECTIONS.flatMap((section) => section.cards).map(
                (card) => {
                  const media = getWorldMedia(card.href);
                  return media ? (
                    <li key={card.href}>
                      <a
                        className="inline-flex min-h-11 items-center underline"
                        href={mediaWatchUrl(media)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {card.title}: {mediaSourceLabel(media)}
                      </a>
                      <p>
                        {media.note} © {media.credit}.
                      </p>
                    </li>
                  ) : null;
                },
              )}
            </ul>
            <a
              href="/img/world-evidence/sources.json"
              className="mt-4 inline-flex min-h-11 items-center text-xs underline"
            >
              Download image source record
            </a>
          </details>
          <p className="mt-8 text-sm leading-relaxed text-white/70">
            Continue exploring with the{" "}
            <Link href="/regions" className="underline text-white">
              Leonida destination guides
            </Link>{" "}
            or the{" "}
            <Link href="/map" className="underline text-white">
              interactive GTA 6 fan map
            </Link>
            . Map pins and placement remain provisional.
          </p>
        </div>
      </div>
    </SiteShell>
  );
}
