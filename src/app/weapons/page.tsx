export { metadata } from "./metadata";
export const revalidate = 3600;
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
  const entries = await getEvidenceCatalog("weapons");
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
          <EvidenceCatalog
            kind="weapons"
            entries={entries}
            initialLimit={initialLimit}
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
