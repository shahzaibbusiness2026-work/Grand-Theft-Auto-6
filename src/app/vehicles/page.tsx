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
import styles from "@/components/catalog-ui.module.css";

export default async function CatalogPage() {
  const entries = await getEvidenceCatalog("vehicles");
  return (
    <SiteShell>
      <CatalogPageHeader
        kind="vehicles"
        count={entries.length}
        categories={new Set(entries.map((e) => e.category)).size}
      />
      <section className={styles.area} aria-label="Vehicles catalog">
        <CatalogSwitcher kind="vehicles" />
        <SectionErrorBoundary fallbackTitle="Could not load vehicles. Please try refreshing.">
          <EvidenceCatalog kind="vehicles" entries={entries} />
        </SectionErrorBoundary>
      </section>
      <RelatedArticles category="Vehicles" title="Vehicles Guides & News" />
    </SiteShell>
  );
}
