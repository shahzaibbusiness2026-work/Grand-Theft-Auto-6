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
  return catalogListingMetadata("vehicles", params, await getEvidenceCatalog("vehicles"));
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const params = catalogSearchParams(await searchParams);
  const entries = await getEvidenceCatalog("vehicles");
  const state = readCatalogState(params, entries, CATALOG_PAGE_SIZE, "vehicles");
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
                catalogPageEntries(entries, state, CATALOG_PAGE_SIZE, "vehicles").filter(indexReady).map((entry) => ({
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
      {state.page === 1 && !isCatalogVariant(params) && (
        <section className="container-site max-w-5xl space-y-3 py-8">
          <h2 className="text-2xl font-bold">GTA 6 vehicles confirmed by Rockstar</h2>
          <p>Looking for an edition bonus? Rockstar lists the <Link className="underline" href="/vehicles/grotti-cheetah-classic">’95 Grotti Cheetah</Link>, <Link className="underline" href="/vehicles/crest-kayak">Crest Kayak</Link> and <Link className="underline" href="/vehicles/dinka-enduro">Dinka Enduro</Link> among its Ultimate Edition extras. It also names the <Link className="underline" href="/vehicles/shitzu-squalo">Shitzu Squalo</Link> and <Link className="underline" href="/vehicles/vapid-dominator-buggy-67">’67 Vapid Dominator Buggy</Link>. The <Link className="underline" href="/vehicles/vapid-stanier-55">’55 Vapid Stanier</Link> is part of the Vintage Vice City Pack.</p>
          <p>For vehicles you can find in the story, start with the <Link className="underline" href="/guides/gta-6-planes-helicopters-locations">aircraft location guide</Link> or open a catalog entry and look for its documented pickup, shop or mission. The catalog distinguishes a source&apos;s menu rating from a measured top speed.</p>
          <p className="text-sm"><a className="underline" href="https://www.rockstargames.com/VI/add-ons/ultimate-edition">Rockstar&apos;s add-on listings</a>{" · "}<a className="underline" href="https://www.rockstargames.com/VI/media/screenshots">Official screenshot gallery</a></p>
        </section>
      )}
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
