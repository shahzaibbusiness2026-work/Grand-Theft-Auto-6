/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  devIndicators: false,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    // Cap served widths at 1920: the default deviceSizes go up to 3840, which
    // made phones/desktops request 3840px hero variants (Screaming Frog, Nov 2026).
    // No page layout is wider than 1920, so 2048/3840 variants were pure weight.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 3600,
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      {
        protocol: "https",
        hostname: "www.rockstargames.com",
        pathname: "/VI/_next/static/media/**",
      },
      // CMS media uploads live in the project's Storage bucket; allow the
      // optimizer to serve them. Any OTHER external host is intentionally
      // not whitelisted — src/components/safe-image.tsx falls back to a
      // plain <img> for those so an arbitrary CMS URL can't crash a page.
      ...(process.env.NEXT_PUBLIC_SUPABASE_URL
        ? [
            {
              protocol: "https",
              hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname,
            },
          ]
        : []),
    ],
  },
  async redirects() {
    return [
      // Retired URLs from the admin SEO redirect defaults — real routes,
      // not just rows in a settings table.
      { source: "/old-map", destination: "/map", permanent: true },
      { source: "/vehicle-list", destination: "/vehicles", permanent: true },
      { source: "/home", destination: "/", permanent: true },
      { source: "/weapon", destination: "/weapons", permanent: true },
      { source: "/vehicle", destination: "/vehicles", permanent: true },
      { source: "/maps", destination: "/map", permanent: true },
      { source: "/cheats", destination: "/guides", permanent: true },
      // Trailer 2 consolidation: also mirrored here (not only the CMS rule)
      // because the middleware CMS fetch can time out and drop the 301.
      { source: "/news/gta-6-trailer-2-breakdown", destination: "/news/trailer-2-breakdown-analysis", permanent: true },
      { source: "/articles", destination: "/news", permanent: true },
      // Editorial consolidation (P0 SEO fix): /blog duplicates the /news
      // hub around the same articles. /news is canonical; /blog 301s to it.
      { source: "/blog", destination: "/news", permanent: true },
      { source: "/countdown", destination: "/", permanent: true },
      // Duplicate compare routes: the /compare/* versions are canonical.
      {
        source: "/weapons/compare",
        destination: "/compare/weapons",
        permanent: true,
      },
      {
        source: "/vehicles/compare",
        destination: "/compare/vehicles",
        permanent: true,
      },
      // Thin-content consolidation (12 Nov 2026 audit): fan-concept /
      // rumoured / withdrawn detail pages consolidate into their parent
      // hubs. None of these URLs is in sitemap.xml. The hubs keep the
      // entries, so no content is lost — only the thin detail page goes.
      // Location detail pages (18) -> /locations
      { source: "/locations/loc-1", destination: "/locations", permanent: true },
      { source: "/locations/loc-2", destination: "/locations", permanent: true },
      { source: "/locations/loc-3", destination: "/locations", permanent: true },
      { source: "/locations/loc-4", destination: "/locations", permanent: true },
      { source: "/locations/ocean-drive-waterfront", destination: "/locations", permanent: true },
      { source: "/locations/ammu-nation-downtown", destination: "/locations", permanent: true },
      { source: "/locations/the-malibu-nightclub", destination: "/locations", permanent: true },
      { source: "/locations/port-gellhorn-docks", destination: "/locations", permanent: true },
      { source: "/locations/leonida-keys-smuggler-marina", destination: "/locations", permanent: true },
      { source: "/locations/grassrivers-everglades-sanctuary", destination: "/locations", permanent: true },
      { source: "/locations/starfish-island-estates", destination: "/locations", permanent: true },
      { source: "/locations/vice-city-international-airport", destination: "/locations", permanent: true },
      { source: "/locations/cryptic-ufo-radar-dome", destination: "/locations", permanent: true },
      { source: "/locations/customs-garage-ocean-drive", destination: "/locations", permanent: true },
      { source: "/locations/high-end-bayfront-penthouse", destination: "/locations", permanent: true },
      { source: "/locations/northern-wilds-fire-lookout", destination: "/locations", permanent: true },
      { source: "/locations/port-gellhorn-underground-safehouse", destination: "/locations", permanent: true },
      { source: "/locations/submerged-biscayne-smuggler-cache", destination: "/locations", permanent: true },
      // Mission detail pages (11) -> /missions
      { source: "/missions/mis-1", destination: "/missions", permanent: true },
      { source: "/missions/mis-2", destination: "/missions", permanent: true },
      { source: "/missions/mis-3", destination: "/missions", permanent: true },
      { source: "/missions/welcome-to-leonida", destination: "/missions", permanent: true },
      { source: "/missions/back-in-vice", destination: "/missions", permanent: true },
      { source: "/missions/the-score-bank-of-keys", destination: "/missions", permanent: true },
      { source: "/missions/the-exchange-port-ambush", destination: "/missions", permanent: true },
      { source: "/missions/grassrivers-gator-bounty", destination: "/missions", permanent: true },
      { source: "/missions/south-beach-drag-circuit", destination: "/missions", permanent: true },
      { source: "/missions/starfish-island-mansion-heist", destination: "/missions", permanent: true },
      { source: "/missions/malibu-vip-protection", destination: "/missions", permanent: true },
      // Collectible detail pages (6) -> /collectibles
      { source: "/collectibles/hidden-package-ocean-view", destination: "/collectibles", permanent: true },
      { source: "/collectibles/stunt-jump-airport-express", destination: "/collectibles", permanent: true },
      { source: "/collectibles/rebel-radio-antenna-wave103", destination: "/collectibles", permanent: true },
      { source: "/collectibles/wildlife-photo-pink-flamingo", destination: "/collectibles", permanent: true },
      { source: "/collectibles/weapon-part-titanium-suppressor", destination: "/collectibles", permanent: true },
      { source: "/collectibles/easter-egg-ufo-dome-graffiti", destination: "/collectibles", permanent: true },
      // Property detail pages (6) -> /properties
      { source: "/properties/biscayne-bayfront-penthouse", destination: "/properties", permanent: true },
      { source: "/properties/the-malibu-nightclub-property", destination: "/properties", permanent: true },
      { source: "/properties/little-haiti-chop-shop", destination: "/properties", permanent: true },
      { source: "/properties/port-gellhorn-cargo-warehouse", destination: "/properties", permanent: true },
      { source: "/properties/leonida-keys-marina-slips", destination: "/properties", permanent: true },
      { source: "/properties/ocean-beach-starter-motel", destination: "/properties", permanent: true },
      // Withdrawn rankings (hub + 22 sub-pages): vehicle rankings -> /vehicles, weapon rankings -> /weapons
      { source: "/rankings", destination: "/vehicles", permanent: true },
      { source: "/rankings/fastest-vehicles", destination: "/vehicles", permanent: true },
      { source: "/rankings/best-acceleration", destination: "/vehicles", permanent: true },
      { source: "/rankings/best-handling", destination: "/vehicles", permanent: true },
      { source: "/rankings/best-braking", destination: "/vehicles", permanent: true },
      { source: "/rankings/best-racing", destination: "/vehicles", permanent: true },
      { source: "/rankings/best-off-road", destination: "/vehicles", permanent: true },
      { source: "/rankings/best-weaponized", destination: "/vehicles", permanent: true },
      { source: "/rankings/best-armored", destination: "/vehicles", permanent: true },
      { source: "/rankings/cheapest-vehicles", destination: "/vehicles", permanent: true },
      { source: "/rankings/best-value-vehicles", destination: "/vehicles", permanent: true },
      { source: "/rankings/best-vehicles-overall", destination: "/vehicles", permanent: true },
      { source: "/rankings/highest-damage", destination: "/weapons", permanent: true },
      { source: "/rankings/fastest-firing", destination: "/weapons", permanent: true },
      { source: "/rankings/most-accurate", destination: "/weapons", permanent: true },
      { source: "/rankings/best-range", destination: "/weapons", permanent: true },
      { source: "/rankings/highest-dps", destination: "/weapons", permanent: true },
      { source: "/rankings/best-pistols", destination: "/weapons", permanent: true },
      { source: "/rankings/best-smgs", destination: "/weapons", permanent: true },
      { source: "/rankings/best-assault-rifles", destination: "/weapons", permanent: true },
      { source: "/rankings/best-shotguns", destination: "/weapons", permanent: true },
      { source: "/rankings/best-snipers", destination: "/weapons", permanent: true },
      { source: "/rankings/best-weapons-overall", destination: "/weapons", permanent: true },
      // Withdrawn / empty single pages
      { source: "/easter-eggs", destination: "/gta-6-world", permanent: true },
      { source: "/tracker", destination: "/tools", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/maps/gtadb-yanis17/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/players/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        // Cache static images for 1 year
        source: "/img/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Frame headers intentionally live in middleware.ts, which exempts
        // /embed/* so the public countdown iframe is not blocked.
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
