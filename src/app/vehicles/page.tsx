export { metadata } from "./metadata";
export const revalidate = 3600;
import { SiteShell } from "@/components/shells";
import {
  CatalogPageHeader,
  CatalogSwitcher,
} from "@/components/catalog-page-header";
import { EvidenceCatalog } from "@/components/evidence-catalog";
import { SectionErrorBoundary } from "@/components/section-error-boundary";
import { RelatedArticles } from "@/components/related-articles";
import { getEvidenceCatalog } from "@/lib/services/evidence-catalog";
import { serializeJsonLd } from "@/lib/utils";
import { itemListJsonLd } from "@/lib/page-metadata";
import styles from "@/components/catalog-ui.module.css";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // ?page=N is read server-side so each page renders its own cards in the
  // HTML (audit 15 Nov 2026: ?page=2 returned byte-identical page-1 HTML,
  // hiding 86 vehicles / 10 weapons from non-JS crawlers). This forces the
  // route dynamic (no ISR cache); crawlability of the catalog matters more
  // than the cached TTFB here. The client still syncs from the URL after
  // hydration (CatalogUrlSync), so the initial limit and the URL agree.
  const params = await searchParams;
  const pageSize = 24;
  const entries = await getEvidenceCatalog("vehicles");
  const totalPages = Math.max(1, Math.ceil(entries.length / pageSize));
  const page = Math.min(
    totalPages,
    Math.max(1, parseInt(params.page || "1", 10) || 1),
  );
  const initialLimit = page * pageSize;
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            itemListJsonLd(
              "GTA 6 Vehicles List",
              "Every vehicle identified in GTA 6 official media, with evidence and sources.",
              entries.map((e) => ({
                name: e.name,
                url: `https://www.taishgaming.com/vehicles/${e.slug}`,
              })),
            ),
          ),
        }}
      />
      <CatalogPageHeader
        kind="vehicles"
        count={entries.length}
        categories={new Set(entries.map((e) => e.category)).size}
      />
      <section className={styles.area} aria-label="Vehicles catalog">
        <CatalogSwitcher kind="vehicles" />
        <SectionErrorBoundary fallbackTitle="Could not load vehicles. Please try refreshing.">
          <EvidenceCatalog
            kind="vehicles"
            entries={entries}
            initialLimit={initialLimit}
          />
        </SectionErrorBoundary>
      </section>
      <RelatedArticles category="Vehicles" title="Vehicles Guides & News" />
    </SiteShell>
  );
}
