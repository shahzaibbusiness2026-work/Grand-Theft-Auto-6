import type { Metadata } from "next";
import { SiteShell } from "@/components/shells";
import {
  CatalogPageHeader,
  CatalogSwitcher,
} from "@/components/catalog-page-header";
import { EvidenceCatalog } from "@/components/evidence-catalog";
import { getEvidenceCatalog } from "@/lib/services/evidence-catalog";
import styles from "@/components/catalog-ui.module.css";

export const metadata: Metadata = {
  title: {
    absolute: "GTA 6 Weapon Comparison",
  },
  description:
    "Compare GTA 6 weapons side by side — every weapon spotted in official footage, with evidence labels. No stats are claimed before launch.",
  alternates: { canonical: "/compare/weapons" },
  openGraph: {
    url: "/compare/weapons",
    title: "GTA 6 Weapon Comparison",
    description:
      "Compare GTA 6 weapons side by side — every weapon spotted in official footage, with evidence labels. No stats are claimed before launch.",
    images: ["/img/hero-dark.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "GTA 6 Weapon Comparison",
    description:
      "Compare GTA 6 weapons side by side — every weapon spotted in official footage, with evidence labels. No stats are claimed before launch.",
    images: ["/img/hero-dark.jpg"],
  },
};

export const revalidate = 3600;

export default async function ComparisonPage() {
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
        <EvidenceCatalog kind="weapons" entries={entries} compare />
      </div>
    </SiteShell>
  );
}
