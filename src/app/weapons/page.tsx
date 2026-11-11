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

export default async function CatalogPage() {
  // No searchParams on this page: awaiting it would force the whole route
  // dynamic (every hit re-renders, ~1.3s+ TTFB, no cache). The catalog
  // reads ?page=N client-side instead (EvidenceCatalog's CatalogUrlSync),
  // so the page prerenders and is served from the ISR cache.
  const entries = await getEvidenceCatalog("weapons");
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            itemListJsonLd(
              "GTA 6 Weapons List",
              "Every weapon identified in GTA 6 official media, with evidence and sources.",
              entries.map((e) => ({
                name: e.name,
                url: `https://www.taishgaming.com/weapons/${e.slug}`,
              })),
            ),
          ),
        }}
      />
      <CatalogPageHeader
        kind="weapons"
        count={entries.length}
        categories={new Set(entries.map((e) => e.category)).size}
      />
      <section className={styles.area} aria-label="Weapons catalog">
        <CatalogSwitcher kind="weapons" />
        <SectionErrorBoundary fallbackTitle="Could not load weapons. Please try refreshing.">
          <EvidenceCatalog kind="weapons" entries={entries} />
        </SectionErrorBoundary>
      </section>
      <RelatedArticles category="Weapons" title="Weapons Guides & News" />
    </SiteShell>
  );
}
