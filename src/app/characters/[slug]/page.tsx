import { notFound } from "next/navigation";
import { SiteShell } from "@/components/shells";
import { characterEvidence } from "@/lib/character-evidence";
import { characterProfiles } from "@/lib/character-profile";
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
              // Review date stated on the page itself.
              dateModified: "2026-11-04",
              articleSection: "Characters",
            }),
          ),
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
