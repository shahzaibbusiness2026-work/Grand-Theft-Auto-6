import { OptionalIntegrations } from "@/components/optional-integrations";
import { WebVitals } from "@/components/web-vitals";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { getSeoSettings } from "@/lib/services/seo";
import { getSiteSettings } from "@/lib/services/settings";
import { serializeJsonLd } from "@/lib/utils";
import { PUBLICATION, canonicalOrigin } from "@/lib/site-identity";
import "./globals.css";
import { PlayerSyncProvider } from "@/components/player-sync-provider";

// Generic system font stacks - clean, familiar, non-robotic
const fontDisplay = {
  variable: "--font-display",
};
const fontSans = {
  variable: "--font-sans",
};

const FALLBACK_SITE_URL = "https://www.taishgaming.com";

/**
 * Site-wide metadata is CMS-driven (admin → SEO settings / site settings),
 * with bundled fallbacks when Supabase is unreachable. Per-page `alternates`
 * are set by each page — the layout must NOT set a default canonical, or
 * every child page would inherit canonical "/" and conflict.
 */
export async function generateMetadata(): Promise<Metadata> {
  const [seo, settings] = await Promise.all([
    getSeoSettings(),
    getSiteSettings(),
  ]);

  const baseUrl = canonicalOrigin(seo.canonicalBaseUrl);
  const siteTitle = settings.siteTitle || "Taish Gaming";
  const description = seo.metaDescription || settings.siteDescription;
  const ogImage = seo.socialPreviewImage || "/img/hero-vice-skyline-hd.jpg";
  // Title template from the CMS; fall back to the classic "%s | Site" form.
  const template = seo.titleTemplate?.includes("%s")
    ? seo.titleTemplate
    : `%s | ${siteTitle}`;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: siteTitle,
      template,
    },
    description,
    authors: [{ name: PUBLICATION.teamName, url: "/team" }],
    creator: PUBLICATION.name,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    robots: { index: true, follow: true, "max-image-preview": "large" },
    // NOTE: no openGraph.url/title/description here — those are per-page.
    // A layout-level og:url leaked the homepage URL onto every child page
    // that did not set its own. Each page now sets openGraph.url equal to
    // its canonical; title/description fall back to the page's own values.
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: PUBLICATION.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${siteTitle} — Leonida skyline`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogImage],
      ...(settings.twitterHandle ? { creator: settings.twitterHandle } : {}),
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteUrl = FALLBACK_SITE_URL;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: PUBLICATION.name,
        url: siteUrl,
        logo: { "@type": "ImageObject", url: `${siteUrl}${PUBLICATION.logo}` },
        // Social profiles (Ahrefs, Nov 2026: Organization was "incomplete"
        // without sameAs). Facebook is deliberately absent: the only
        // Facebook URL supplied is a share link, not a profile page.
        sameAs: [
          "https://www.instagram.com/taishgaming1619/",
          "https://www.tiktok.com/@taishgaming1619",
          "https://www.reddit.com/u/taishgaming1619/",
          "https://x.com/taishgaming1619",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Taish Gaming",
        description: "The Ultimate GTA 6 Companion Platform & Database",
        publisher: { "@id": `${siteUrl}/#organization` },
      }
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${fontDisplay.variable} ${fontSans.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <ThemeProvider>
          <WebVitals />
          <OptionalIntegrations
            domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            adSenseId={process.env.NEXT_PUBLIC_ADSENSE_ID}
          />
          <PlayerSyncProvider>{children}</PlayerSyncProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
