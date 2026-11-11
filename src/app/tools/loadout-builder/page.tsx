import { SiteShell } from "@/components/shells";
import { serializeJsonLd } from "@/lib/utils";
import { getEvidenceCatalog } from "@/lib/services/evidence-catalog";
import { LoadoutClient } from "./loadout-client";
export const revalidate = 3600;
export const metadata = {
  title: "GTA VI Personal Loadout Planner",
  description:
    "Save personal equipment plans in your workspace and sync them when signed in. Weapon identifications and loadout rules remain subject to source review.",
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
              }
            ],
          }),
        }}
      />
      <section className="container-site max-w-4xl py-10 space-y-6">
        <h1 className="text-4xl font-display font-bold">
          Personal Loadout Planner
        </h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-2xl">Organize a hypothetical loadout. Verified GTA VI firepower, mobility and stealth ratings are unavailable. Pick a primary, secondary, melee and heavy weapon to build a loadout, give it a name and save it — up to 100 plans, stored in your workspace and synced when you sign in. Weapon identifications and loadout rules are provisional and subject to source review; no firepower or mobility rating is verified.</p>
        <LoadoutClient entries={await getEvidenceCatalog("weapons")} />
      </section>
    </SiteShell>
  );
}
