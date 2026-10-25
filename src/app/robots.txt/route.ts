import { getSeoSettings } from "@/lib/services/seo";

export const dynamic = "force-dynamic";

/**
 * robots.txt — fully CMS-driven (admin → SEO settings):
 *  - a custom body saved in seo_settings.robotsTxt is served verbatim;
 *  - otherwise a safe default is generated, with the sitemap URL derived
 *    from the admin's canonicalBaseUrl.
 */
export async function GET() {
  const seo = await getSeoSettings();
  // Same stale-domain guard as sitemap.ts: a saved gta6atlas.com canonical
  // must never leak into robots.txt again.
  const adminUrl = seo.canonicalBaseUrl?.startsWith("http") && !seo.canonicalBaseUrl.includes("gta6atlas.com")
    ? seo.canonicalBaseUrl
    : null;
  const baseUrl = adminUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://www.taishgaming.com";

  const body =
    seo.robotsTxt && seo.robotsTxt.trim().length > 0
      ? seo.robotsTxt
      : [
          "User-agent: *",
          "Allow: /",
          "Disallow: /api/",
          "Disallow: /dashboard/",
          "Disallow: /admin/",
          "",
          `Sitemap: ${baseUrl}/sitemap.xml`,
        ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
