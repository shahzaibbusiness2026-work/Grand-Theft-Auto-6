import { catalogArtwork } from "@/lib/catalog-artwork";
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
  return (await getEvidenceCatalog("vehicles")).find(
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
  const artwork = catalogArtwork("vehicles", e);
  return {
    title: e.name + " — GTA VI Evidence Review",
    description: `${e.name} — GTA VI evidence review: what official footage shows, and which statistics are still unverified.`,
    alternates: { canonical: "/vehicles/" + e.slug },
    openGraph: {
      url: "/vehicles/" + e.slug,
      type: "website",
      title: e.name + " — GTA VI Evidence Review",
      description: `${e.name} — GTA VI evidence review: what official footage shows, and which statistics are still unverified.`,
      images: [{ url: artwork.src, alt: artwork.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: e.name + " — GTA VI Evidence Review",
      images: [artwork.src],
    },
    robots: {
      // Indexed on the user's instruction (8 Nov 2026): all vehicle
      // detail pages, including verification-pending entries.
      index: true,
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
  if (slug !== entry.slug) permanentRedirect("/vehicles/" + entry.slug);
  return (
    <SiteShell>
      <EvidenceDetail kind="vehicles" entry={entry} />
    </SiteShell>
  );
}
