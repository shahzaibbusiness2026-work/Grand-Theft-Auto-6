import { getSeoSettings } from "@/lib/services/seo";

export const dynamic = "force-dynamic";

/**
 * robots.txt — fully CMS-driven (admin → SEO settings):
 *  - a custom body saved in seo_settings.robotsTxt is served verbatim;
 *  - otherwise a safe default is generated, with the sitemap URL derived
 *    from the admin's canonicalBaseUrl.
 */
export default async function robots(): Promise<Response> {
  const seo = await getSeoSettings();
  const baseUrl = seo.canonicalBaseUrl?.startsWith("http")
    ? seo.canonicalBaseUrl
    : "https://gta6atlas.com";

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
    headers: { "Content-Type": "text/plain" },
  });
}
