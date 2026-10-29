import { notFound, permanentRedirect } from "next/navigation";
import { SiteShell } from "@/components/shells";
import { EvidenceDetail } from "@/components/evidence-detail";
import { getEvidenceCatalog } from "@/lib/services/evidence-catalog";
export const revalidate = 3600;
// An explicit runtime path list enables ISR for newly published CMS slugs.
export function generateStaticParams() {
  return [];
}
async function resolve(slug: string) {
  return (await getEvidenceCatalog("weapons")).find(
    (e) =>
      e.slug === slug ||
      e.id === slug ||
      e.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug,
  );
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const e = await resolve((await params).slug);
  if (!e) notFound();
  return {
    title: e.name + " — GTA VI Evidence Review",
    description:
      `${e.name} — GTA VI evidence review: what official footage actually shows for this weapon, and which statistics are still unverified before launch.`,
    alternates: { canonical: "/weapons/" + e.slug },
    openGraph: {
      url: "/weapons/" + e.slug,
      type: "website",
      title: e.name + " — GTA VI Evidence Review",
      description: `${e.name} — GTA VI evidence review: what official footage actually shows for this weapon, and which statistics are still unverified before launch.`,
      images: e.img ? [{ url: e.img, alt: e.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: e.name + " — GTA VI Evidence Review",
      images: e.img ? [e.img] : undefined,
    },
    robots: {
      // Pre-launch gate (29 Oct 2026): a single appearance claim is not
      // substantive content. Index only after launch, when verified
      // statistics exist. Follow stays true so hubs are still crawled.
      index: false,
      follow: true,
      googleBot: { "max-image-preview": "large" as const },
    },
  };
}
export default async function Detail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await resolve(slug);
  if (!entry) notFound();
  if (slug !== entry.slug) permanentRedirect("/weapons/" + entry.slug);
  return (
    <SiteShell>
      <EvidenceDetail kind="weapons" entry={entry} />
    </SiteShell>
  );
}
