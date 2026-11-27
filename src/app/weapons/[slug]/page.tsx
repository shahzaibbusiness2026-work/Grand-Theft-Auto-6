import { catalogDetailMetadata } from "@/lib/catalog-metadata";
import { matchingCatalogEntries } from "@/lib/catalog-url-state";
import { notFound, permanentRedirect } from "next/navigation";
import { SiteShell } from "@/components/shells";
import { EvidenceDetail } from "@/components/evidence-detail";
import { getEvidenceCatalog } from "@/lib/services/evidence-catalog";
import { catalogEntryPath, indexReady } from "@/lib/catalog-detail-availability";
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
  return catalogDetailMetadata("weapons", e);
}
export default async function Detail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await resolve(slug);
  if (!entry) notFound();
  if (slug !== entry.slug || !indexReady(entry)) permanentRedirect(catalogEntryPath("weapons", entry));
  const sorted = matchingCatalogEntries((await getEvidenceCatalog("weapons")).filter(indexReady), {
    q: "",
    category: "",
    tab: "",
    sort: "name",
  });
  const index = sorted.findIndex((e) => e.slug === entry.slug);
  const prev = index > 0 ? sorted[index - 1] : null;
  const next =
    index >= 0 && index < sorted.length - 1 ? sorted[index + 1] : null;
  return (
    <SiteShell>
      <EvidenceDetail
        kind="weapons"
        entry={entry}
        prev={prev ? { name: prev.name, slug: prev.slug } : null}
        next={next ? { name: next.name, slug: next.slug } : null}
      />
    </SiteShell>
  );
}
