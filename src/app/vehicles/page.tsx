import Link from "next/link";
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
import { absoluteUrl, itemListJsonLd } from "@/lib/page-metadata";
import { catalogListingMetadata } from "@/lib/catalog-metadata";
import {
  CATALOG_PAGE_SIZE,
  catalogPageEntries,
  catalogSearchParams,
  isCatalogVariant,
  readCatalogState,
  type CatalogSearchParams,
} from "@/lib/catalog-url-state";
import { selectionFromParams } from "@/lib/catalog-selection";
import styles from "@/components/catalog-ui.module.css";

type PageProps = { searchParams: Promise<CatalogSearchParams> };

export async function generateMetadata({ searchParams }: PageProps) {
  const params = catalogSearchParams(await searchParams);
  return catalogListingMetadata("vehicles", params, await getEvidenceCatalog("vehicles"));
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const params = catalogSearchParams(await searchParams);
  const entries = await getEvidenceCatalog("vehicles");
  const state = readCatalogState(params, entries, CATALOG_PAGE_SIZE);
  return (
    <SiteShell>
      {!isCatalogVariant(params) && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(
              itemListJsonLd(
                `GTA 6 Vehicles Catalog${state.page > 1 ? ` – Page ${state.page}` : ""}`,
                "Editorial GTA 6 vehicle identifications and field-specific evidence.",
                catalogPageEntries(entries, state, CATALOG_PAGE_SIZE).map((entry) => ({
                  name: entry.name,
                  url: absoluteUrl(`/vehicles/${entry.slug}`),
                })),
              ),
            ),
          }}
        />
      )}
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
            initialState={state}
            initialSelection={selectionFromParams(params, "vehicles", entries)}
          />
        </SectionErrorBoundary>
      </section>
      <RelatedArticles category="Vehicles" title="Vehicles Guides & News" />
      <p className="container-site pb-10 text-sm text-muted-foreground">
        Related guides:{" "}
        <Link href="/guides/gta-6-best-early-cars-steal-keep-guide" className="font-semibold text-primary underline">
          Best early cars to steal and keep
        </Link>
        {" · "}
        <Link href="/guides/gta-6-planes-helicopters-locations" className="font-semibold text-primary underline">
          Planes and helicopters guide
        </Link>
      </p>
    </SiteShell>
  );
}
