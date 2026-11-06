/**
 * Shared Open Graph defaults for pages that set their own openGraph.
 *
 * Next.js does NOT deep-merge a child page's `openGraph` with the layout's:
 * a page that sets `openGraph: { url }` and nothing else silently drops the
 * layout's default og:image and og:type. That is how 71 pages ended up with
 * incomplete Open Graph tags (Ahrefs Site Audit, 6 Nov 2026).
 *
 * Rule: every page that sets openGraph must go through `pageOpenGraph`
 * (or explicitly include `images`), so the share image can never be lost
 * again. The weekly live-audit sweep re-checks og:image on every template.
 */
export const DEFAULT_OG_IMAGE = "/img/hero-dark.jpg";
export const DEFAULT_OG_IMAGE_ALT =
  "Taish Gaming — GTA 6 Leonida skyline";

export function pageOpenGraph(url: string, image: string = DEFAULT_OG_IMAGE) {
  return {
    url,
    type: "website" as const,
    images: [{ url: image, alt: DEFAULT_OG_IMAGE_ALT }],
  };
}

const SITE_URL = "https://www.taishgaming.com";

/** Absolute URL helper for JSON-LD (accepts a relative path or a full URL). */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).href;
}

/**
 * ItemList JSON-LD for listing hubs (news, guides, characters, vehicles,
 * weapons). Ahrefs, Nov 2026: three category pages were missing ItemList;
 * every hub now emits one from the same list it renders, so the schema can
 * never drift from the page. Build it from the page's own fetched list.
 */
export function itemListJsonLd(
  name: string,
  description: string,
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Article JSON-LD for editorial content pages (characters, world, wildlife,
 * regions). News and guides already emit Article from their own templates;
 * these templates did not, which Ahrefs flagged on 24 pages (Nov 2026).
 * Dates are optional: only pass dateModified when the page itself states
 * a review/publication date — never invent one.
 */
export function articleJsonLd(args: {
  headline: string;
  description: string;
  url: string;
  image?: string;
  dateModified?: string;
  articleSection?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.headline,
    description: args.description,
    ...(args.image ? { image: [absoluteUrl(args.image)] } : {}),
    ...(args.dateModified ? { dateModified: args.dateModified } : {}),
    "@id": `${args.url}#article`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    author: {
      "@type": "Organization",
      "@id": `${SITE_URL}/team#editorial-team`,
      name: "Taish Gaming Editorial Team",
      url: `${SITE_URL}/team`,
    },
    publisher: {
      "@type": "Organization",
      name: "Taish Gaming",
      "@id": `${SITE_URL}/#organization`,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/img/taish-gaming-logo.png`,
      },
    },
    mainEntityOfPage: args.url,
    ...(args.articleSection ? { articleSection: args.articleSection } : {}),
  };
}
