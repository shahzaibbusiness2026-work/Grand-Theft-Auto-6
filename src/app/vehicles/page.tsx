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
import { readCatalogState } from "@/lib/catalog-url-state";
import { serializeJsonLd } from "@/lib/utils";
import { itemListJsonLd } from "@/lib/page-metadata";
import styles from "@/components/catalog-ui.module.css";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const entries = await getEvidenceCatalog("vehicles");
  const raw = (await searchParams) || {};
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") params.set(key, value);
  }
  // Server pagination (?page=N) so crawlers can reach every detail page.
  const initialPage = readCatalogState(params, entries, 24).page;
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
          <EvidenceCatalog kind="vehicles" entries={entries} initialPage={initialPage} />
        </SectionErrorBoundary>
      </section>
      <RelatedArticles category="Vehicles" title="Vehicles Guides & News" />
    </SiteShell>
  );
}
