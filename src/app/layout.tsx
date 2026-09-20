import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  // Only load weights actually used by the design system
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

const siteUrl = "https://gta6atlas.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "GTA 6 Atlas — Your Ultimate GTA 6 Companion",
    template: "%s | GTA 6 Atlas",
  },
  description:
    "Explore the world of GTA 6 with the most complete fan database. Interactive maps, missions, vehicles, characters, weapons and more for Grand Theft Auto 6.",
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
  authors: [{ name: "GTA 6 Atlas" }],
  creator: "GTA 6 Atlas",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "GTA 6 Atlas",
    title: "GTA 6 Atlas — Your Ultimate GTA 6 Companion",
    description:
      "The most complete GTA 6 fan database. Maps, missions, vehicles, characters and more.",
    images: [
      {
        url: "/img/hero-dark.jpg",
        width: 1200,
        height: 630,
        alt: "GTA 6 Atlas — Leonida skyline",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GTA 6 Atlas — Your Ultimate GTA 6 Companion",
    description:
      "The most complete GTA 6 fan database. Maps, missions, vehicles, characters and more.",
    images: ["/img/hero-dark.jpg"],
    creator: "@gta6atlas",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
    <html lang="en" className="dark" style={{ colorScheme: "dark" }} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${poppins.variable} ${inter.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
