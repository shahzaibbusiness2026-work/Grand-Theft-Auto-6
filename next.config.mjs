/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  devIndicators: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 3600,
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      // CMS media uploads live in the project's Storage bucket; allow the
      // optimizer to serve them. Any OTHER external host is intentionally
      // not whitelisted — src/components/safe-image.tsx falls back to a
      // plain <img> for those so an arbitrary CMS URL can't crash a page.
      ...(process.env.NEXT_PUBLIC_SUPABASE_URL
        ? [{ protocol: "https", hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname }]
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
      { source: "/articles", destination: "/news", permanent: true },
      // Editorial consolidation (P0 SEO fix): /blog duplicates the /news
      // hub around the same articles. /news is canonical; /blog 301s to it.
      { source: "/blog", destination: "/news", permanent: true },
      { source: "/countdown", destination: "/", permanent: true },
      // Duplicate compare routes: the /compare/* versions are canonical.
      { source: "/weapons/compare", destination: "/compare/weapons", permanent: true },
      { source: "/vehicles/compare", destination: "/compare/vehicles", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        // Cache static images for 1 year
        source: "/img/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Frame headers intentionally live in middleware.ts, which exempts
        // /embed/* so the public countdown iframe is not blocked.
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;
