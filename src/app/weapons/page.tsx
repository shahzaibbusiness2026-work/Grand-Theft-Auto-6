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
  return catalogListingMetadata("weapons", params, await getEvidenceCatalog("weapons"));
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const params = catalogSearchParams(await searchParams);
  const entries = await getEvidenceCatalog("weapons");
  const state = readCatalogState(params, entries, CATALOG_PAGE_SIZE);
  return (
    <SiteShell>
      {!isCatalogVariant(params) && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(
              itemListJsonLd(
                `GTA 6 Weapons Catalog${state.page > 1 ? ` – Page ${state.page}` : ""}`,
                "Editorial GTA 6 weapon identifications and field-specific evidence.",
                catalogPageEntries(entries, state, CATALOG_PAGE_SIZE).map((entry) => ({
                  name: entry.name,
                  url: absoluteUrl(`/weapons/${entry.slug}`),
                })),
              ),
            ),
          }}
        />
      )}
      <CatalogPageHeader
        kind="weapons"
        count={entries.length}
        categories={new Set(entries.map((e) => e.category)).size}
      />
      <section className={styles.area} aria-label="Weapons catalog">
        <CatalogSwitcher kind="weapons" />
        <SectionErrorBoundary fallbackTitle="Could not load weapons. Please try refreshing.">
          <EvidenceCatalog
            kind="weapons"
            entries={entries}
            initialState={state}
            initialSelection={selectionFromParams(params, "weapons", entries)}
          />
        </SectionErrorBoundary>
      </section>
      <RelatedArticles category="Weapons" title="Weapons Guides & News" />
      <p className="container-site pb-10 text-sm text-muted-foreground">
        Related guides:{" "}
        <Link href="/guides/best-weapons-tier-list" className="font-semibold text-primary underline">
          Weapons guide: names and gameplay footage
        </Link>
        {" · "}
        <Link href="/guides/heists-big-score-guide" className="font-semibold text-primary underline">
          Heists and robberies
        </Link>
      </p>
    </SiteShell>
  );
}
