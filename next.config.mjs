/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  devIndicators: false,
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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none';" },
        ],
      },
    ];
  },
};

export default nextConfig;
