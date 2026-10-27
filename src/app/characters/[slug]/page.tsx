import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/shells";
import { characterEvidence, CHARACTER_SOURCE } from "@/lib/character-evidence";
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
  return {
    title: c.name + " — GTA VI Character",
    description: c.summary,
    alternates: { canonical: "/characters/" + slug },
    openGraph: { url: "/characters/" + slug },
  };
}
export default async function CharacterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = characterEvidence[slug];
  if (!c) notFound();
  return (
    <SiteShell>
      <article className="container-site max-w-3xl py-12 space-y-6">
        <Link href="/characters" className="underline">
          All characters
        </Link>
        <h1 className="font-display text-4xl font-bold">{c.name}</h1>
        <h2 className="text-2xl font-bold">Official character background</h2>
        <p>{c.summary}</p>
        <p>
          <a
            className="underline"
            href={CHARACTER_SOURCE}
            target="_blank"
            rel="noreferrer"
          >
            Source: Rockstar Games, {c.name} section
          </a>
        </p>
        <p className="text-sm text-muted-foreground">
          Reviewed October 27, 2026. This profile summarizes official background
          information. It does not establish gameplay abilities, mission rewards
          or an actor’s identity.
        </p>
        <Link className="block underline" href="/corrections">
          Send a correction
        </Link>
      </article>
    </SiteShell>
  );
}
