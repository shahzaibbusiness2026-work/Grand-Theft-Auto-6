import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { OnboardingModal } from "@/components/onboarding/onboarding-modal";
import { getSeoSettings } from "@/lib/services/seo";
import { getSiteSettings } from "@/lib/services/settings";
import { serializeJsonLd } from "@/lib/utils";
import "./globals.css";

// Generic system font stacks - clean, familiar, non-robotic
const fontDisplay = {
  variable: "--font-display",
};
const fontSans = {
  variable: "--font-sans",
};

const FALLBACK_SITE_URL = "https://gta6atlas.com";

/**
 * Site-wide metadata is CMS-driven (admin → SEO settings / site settings),
 * with bundled fallbacks when Supabase is unreachable. Per-page `alternates`
 * are set by each page — the layout must NOT set a default canonical, or
 * every child page would inherit canonical "/" and conflict.
 */
export async function generateMetadata(): Promise<Metadata> {
  const [seo, settings] = await Promise.all([getSeoSettings(), getSiteSettings()]);

  const baseUrl = seo.canonicalBaseUrl?.startsWith("http")
    ? seo.canonicalBaseUrl
    : FALLBACK_SITE_URL;
  const siteTitle = settings.siteTitle || "GTA 6 Atlas";
  const description = seo.metaDescription || settings.siteDescription;
  const ogImage = seo.socialPreviewImage || "/img/hero-dark.jpg";
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
    keywords: [
      "GTA 6",
      "Grand Theft Auto 6",
      "GTA 6 map",
      "GTA 6 characters",
      "GTA 6 vehicles",
      "GTA 6 missions",
      "Leonida",
      "Vice City",
      "GTA 6 guide",
    ],
    authors: [{ name: siteTitle }],
    creator: siteTitle,
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: baseUrl,
      siteName: siteTitle,
      title: siteTitle,
      description,
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
      title: siteTitle,
      description,
      images: [ogImage],
      creator: settings.twitterHandle || "@gta6atlas",
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const siteUrl = FALLBACK_SITE_URL;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": "GTA 6 Atlas",
        "description": "The Ultimate GTA 6 Companion Platform & Database",
        "publisher": {
          "@type": "Organization",
          "name": "GTA 6 Atlas",
        },
      },
      {
        "@type": "VideoGame",
        "@id": `${siteUrl}/#game`,
        "name": "Grand Theft Auto VI",
        "alternateName": ["GTA 6", "GTA VI", "Grand Theft Auto 6"],
        "description": "Grand Theft Auto VI heads to the state of Leonida, home to the neon-soaked streets of Vice City and beyond.",
        "genre": ["Action-adventure", "Open world", "Action"],
        "gamePlatform": ["PlayStation 5", "Xbox Series X and Series S"],
        "publisher": {
          "@type": "Organization",
          "name": "Rockstar Games",
        },
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        )}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
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
          {children}
          <OnboardingModal />
        </ThemeProvider>
      </body>
    </html>
  );
}
