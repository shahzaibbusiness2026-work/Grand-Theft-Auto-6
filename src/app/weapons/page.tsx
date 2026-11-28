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
import { indexReady } from "@/lib/catalog-detail-availability";
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
  const state = readCatalogState(params, entries, CATALOG_PAGE_SIZE, "weapons");
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
                catalogPageEntries(entries, state, CATALOG_PAGE_SIZE, "weapons").filter(indexReady).map((entry) => ({
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
      {state.page === 1 && !isCatalogVariant(params) && (
        <section className="container-site max-w-5xl space-y-3 py-8">
          <h2 className="text-2xl font-bold">GTA 6 weapons named in official material</h2>
          <p>Rockstar&apos;s gameplay video shows the <Link className="underline" href="/weapons?q=Duke%20556">Duke 556</Link> by name in a pickup prompt around 25:07. The publisher&apos;s store listing names Jason&apos;s <Link className="underline" href="/weapons/girardi-es9">Girardi ES9</Link>, Lucia&apos;s <Link className="underline" href="/weapons/klose-k17">Klose K17</Link> and the two <Link className="underline" href="/weapons?q=Hawk%20%26%20Little%20Morgan%20Revolvers">Hawk &amp; Little Morgan Revolvers</Link> as weapons with Ultimate Edition versions.</p>
          <p>Search the exact name from the game&apos;s menu when you can. A named variant can have a different unlock, magazine or shop price from its base weapon. Check the source for those details before comparing two entries.</p>
          <p className="text-sm"><a className="underline" href="https://www.youtube.com/watch?v=tJbzMqJGH4k&amp;t=1507s">Rockstar gameplay at 25:07</a>{" · "}<a className="underline" href="https://store.playstation.com/en-us/product/EP1004-PPSA01547_00-ULTEDTIONUPGRADE/">Ultimate Edition listing on PlayStation</a></p>
        </section>
      )}
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
          Weapons guide and early pickup locations
        </Link>
        {" · "}
        <Link href="/guides/heists-big-score-guide" className="font-semibold text-primary underline">
          Heists and robberies
        </Link>
      </p>
    </SiteShell>
  );
}
