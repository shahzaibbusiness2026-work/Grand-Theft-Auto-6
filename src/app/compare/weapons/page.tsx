import { SiteShell } from "@/components/shells";
import {
  CatalogPageHeader,
  CatalogSwitcher,
} from "@/components/catalog-page-header";
import { EvidenceCatalog } from "@/components/evidence-catalog";
import { getEvidenceCatalog } from "@/lib/services/evidence-catalog";
import styles from "@/components/catalog-ui.module.css";
import { catalogComparisonMetadata } from "@/lib/catalog-metadata";
import {
  COMPARE_PAGE_SIZE,
  catalogSearchParams,
  readCatalogState,
  type CatalogSearchParams,
} from "@/lib/catalog-url-state";
import { selectionFromParams } from "@/lib/catalog-selection";

type PageProps = { searchParams: Promise<CatalogSearchParams> };

export async function generateMetadata({ searchParams }: PageProps) {
  return catalogComparisonMetadata("weapons", catalogSearchParams(await searchParams));
}

export default async function ComparisonPage({ searchParams }: PageProps) {
  const params = catalogSearchParams(await searchParams);
  const entries = await getEvidenceCatalog("weapons");
  return (
    <SiteShell>
      <CatalogPageHeader
        kind="weapons"
        compare
        count={entries.length}
        categories={new Set(entries.map((e) => e.category)).size}
      />
      <div className={styles.area}>
        <CatalogSwitcher kind="weapons" compare />
        <EvidenceCatalog
          kind="weapons"
          entries={entries}
          compare
          initialState={readCatalogState(params, entries, COMPARE_PAGE_SIZE)}
          initialSelection={selectionFromParams(params, "weapons", entries)}
        />
      </div>
    </SiteShell>
  );
}
