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
        <p>{c.context}</p>
        <section aria-labelledby="character-connections" className="space-y-3">
          <h2 id="character-connections" className="text-2xl font-bold">People and places to explore next</h2>
          <ul className="list-disc space-y-3 pl-5">
            {c.related.map((link) => <li key={link.href}><Link className="underline" href={link.href}>{link.label}</Link></li>)}
          </ul>
        </section>
        <section aria-labelledby="character-question" className="space-y-3">
          <h2 id="character-question" className="text-2xl font-bold">{c.question}</h2>
          <p>{c.answer}</p>
        </section>
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
          Reviewed October 30, 2026. Background summaries cite Rockstar&apos;s published biographies.
          The questions above explain the limits of that evidence. This is a source-based profile,
          not a first-hand gameplay test. Send the exact source passage or video timestamp with a correction.
        </p>
        <Link className="block underline" href="/corrections">
          Send a correction
        </Link>
      </article>
    </SiteShell>
  );
}
