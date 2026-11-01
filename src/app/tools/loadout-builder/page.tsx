import { SiteShell } from "@/components/shells";
import { serializeJsonLd } from "@/lib/utils";
import { getEvidenceCatalog } from "@/lib/services/evidence-catalog";
import { LoadoutClient } from "./loadout-client";
export const revalidate = 3600;
export const metadata = {
  title: "GTA VI Personal Loadout Planner",
  description:
    "Save personal equipment plans locally. Weapon identifications and loadout rules remain subject to source review.",
  alternates: { canonical: "/tools/loadout-builder" },
  robots: { index: false, follow: true },
};
export default async function Page() {
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: "https://www.taishgaming.com/",
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Tools",
                    item: "https://www.taishgaming.com/tools",
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: "GTA VI Personal Loadout Planner",
                    item: "https://www.taishgaming.com/tools/loadout-builder",
                  },
                ],
              },
              {
                "@type": "WebApplication",
                name: "GTA VI Personal Loadout Planner",
                description:
                  "Save personal equipment plans locally. Weapon identifications and loadout rules remain subject to source review.",
                url: "https://www.taishgaming.com/tools/loadout-builder",
                applicationCategory: "UtilitiesApplication",
                operatingSystem: "Web",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              },
            ],
          }),
        }}
      />
      <section className="container-site max-w-4xl py-10 space-y-6">
        <h1 className="text-4xl font-display font-bold">
          Personal Loadout Planner
        </h1>
        <LoadoutClient entries={await getEvidenceCatalog("weapons")} />
      </section>
    </SiteShell>
  );
}
