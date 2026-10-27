import { notFound, permanentRedirect } from "next/navigation";
import { SiteShell } from "@/components/shells";
import { EvidenceDetail } from "@/components/evidence-detail";
import { getEvidenceCatalog } from "@/lib/services/evidence-catalog";
import { indexReady } from "@/lib/catalog-evidence";
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
      "Review the evidence status of this provisional catalog identification. Unverified GTA VI statistics are withheld.",
    alternates: { canonical: "/weapons/" + e.slug },
    openGraph: { url: "/weapons/" + e.slug },
    robots: {
      index: indexReady(e),
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
