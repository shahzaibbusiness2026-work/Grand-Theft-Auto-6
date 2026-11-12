import { catalogArtwork } from "@/lib/catalog-artwork";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT } from "@/lib/page-metadata";
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
  // Text-only entries (no verified image) share the neutral skyline og
  // image instead of a generic scene that does not show the vehicle.
  const ogImage = artwork ?? {
    src: DEFAULT_OG_IMAGE,
    alt: DEFAULT_OG_IMAGE_ALT,
  };
  // The layout appends " | Taish Gaming" (15 chars). Names that would push
  // the rendered title past 60 chars use an absolute title instead, so the
  // full catalog name is kept without truncation.
  const baseTitle = e.name + " — GTA VI";
  const title =
    baseTitle.length + 15 > 60 ? { absolute: baseTitle } : baseTitle;
  // The compare link is rendered on every detail page (see EvidenceDetail),
  // so the closing sentence is true for all entries. It is appended only
  // when the templated description would otherwise fall under 120 chars;
  // long names already land in the 120–155 range without it.
  const baseDescription = `${e.name} — GTA VI evidence review: what official footage shows, and which statistics are still unverified.`;
  const description =
    baseDescription.length < 120
      ? baseDescription + " Compare with other GTA VI entries."
      : baseDescription;
  return {
    title,
    description,
    alternates: { canonical: "/vehicles/" + e.slug },
    openGraph: {
      url: "/vehicles/" + e.slug,
      type: "website",
      title: baseTitle,
      description,
      images: [{ url: ogImage.src, alt: ogImage.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: e.name + " — GTA VI",
      images: [ogImage.src],
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
  // Plain-HTML prev/next links: the catalog hub only server-renders the
  // first 24 cards (the rest expand client-side), so without these, 96
  // detail pages had zero inlinks in crawler-visible HTML (audit 12 Nov
  // 2026). Neighbours follow the hub's default name sort (localeCompare).
  const sorted = [...(await getEvidenceCatalog("vehicles"))].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  const index = sorted.findIndex((e) => e.slug === entry.slug);
  const prev = index > 0 ? sorted[index - 1] : null;
  const next =
    index >= 0 && index < sorted.length - 1 ? sorted[index + 1] : null;
  return (
    <SiteShell>
      <EvidenceDetail
        kind="vehicles"
        entry={entry}
        prev={prev ? { name: prev.name, slug: prev.slug } : null}
        next={next ? { name: next.name, slug: next.slug } : null}
      />
    </SiteShell>
  );
}
