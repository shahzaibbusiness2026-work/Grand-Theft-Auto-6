import type { CatalogKind, EvidenceEntry } from "./catalog-evidence";

export function catalogSchema(
  entry: EvidenceEntry,
  kind: CatalogKind,
  base: string,
) {
  const page = `${base}/${kind}/${entry.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": page + "#webpage",
        url: page,
        name: `${entry.name} - GTA VI Evidence Review`,
        isPartOf: { "@id": base + "/#website" },
        breadcrumb: { "@id": page + "#breadcrumb" },
        mainEntity: { "@id": page + "#entity" },
      },
      {
        "@type": "Thing",
        "@id": page + "#entity",
        name: entry.name,
        description:
          "Provisional editorial catalog identification. Only the visible reviewed claims carry evidence; other GTA VI attributes remain unverified.",
        subjectOf: { "@id": page + "#webpage" },
      },
      {
        "@type": "BreadcrumbList",
        "@id": page + "#breadcrumb",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: base + "/" },
          {
            "@type": "ListItem",
            position: 2,
            name: kind === "vehicles" ? "Vehicles" : "Weapons",
            item: base + "/" + kind,
          },
          { "@type": "ListItem", position: 3, name: entry.name, item: page },
        ],
      },
    ],
  };
}
