import { notFound } from "next/navigation";
import { SiteShell } from "@/components/shells";
import { characterEvidence, CHARACTER_REVIEWED_AT } from "@/lib/character-evidence";
import { characterProfiles, OFFICIAL_TRAILERS } from "@/lib/character-profile";
import { pageOpenGraph, articleJsonLd } from "@/lib/page-metadata";
import { serializeJsonLd } from "@/lib/utils";
import { CharacterProfileClient } from "./character-profile-client";

export function generateStaticParams() {
  return Object.keys(characterEvidence).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = characterEvidence[slug];
  if (!c) notFound();
  const facts = characterProfiles[slug];
  return {
    title: c.name + " — GTA VI Character",
    description: c.summary,
    alternates: { canonical: "/characters/" + slug },
    openGraph: pageOpenGraph(
      "/characters/" + slug,
      facts?.portrait,
    ),
  };
}

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = characterEvidence[slug];
  const facts = characterProfiles[slug];
  if (!c || !facts) notFound();
  // Both official trailers are embedded on every character page
  // (Trailers tab), so they each get a VideoObject entry.
  const videoObjects = OFFICIAL_TRAILERS.map((t) => {
    const [minutes, seconds] = t.duration.split(":").map(Number);
    return {
      "@type": "VideoObject",
      name: t.title,
      description: `Official ${t.title} from Rockstar Games.`,
      thumbnailUrl: `https://i.ytimg.com/vi/${t.videoId}/hqdefault.jpg`,
      uploadDate: t.uploadDate,
      duration: `PT${minutes}M${seconds}S`,
      embedUrl: `https://www.youtube.com/embed/${t.videoId}`,
    };
  });
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            articleJsonLd({
              headline: `${c.name} — GTA VI Character`,
              description: c.summary,
              url: `https://www.taishgaming.com/characters/${slug}`,
              // Evidence review date (src/lib/character-evidence.ts) — the
              // same date the sitemap uses as lastmod. The previous
              // hard-coded 2026-11-04 had no source and was not stated on
              // the page; the reviewed date is 2026-10-30.
              dateModified: CHARACTER_REVIEWED_AT,
              articleSection: "Characters",
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            "@context": "https://schema.org",
            "@graph": videoObjects,
          }),
        }}
      />
      <CharacterProfileClient
        name={c.name}
        summary={c.summary}
        context={c.context}
        question={c.question}
        answer={c.answer}
        related={c.related}
        facts={facts}
      />
    </SiteShell>
  );
}
