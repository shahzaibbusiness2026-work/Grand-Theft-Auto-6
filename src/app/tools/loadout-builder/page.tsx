import { SiteShell } from "@/components/shells";
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
      <section className="container-site max-w-4xl py-10 space-y-6">
        <h1 className="text-4xl font-display font-bold">
          Personal Loadout Planner
        </h1>
        <LoadoutClient entries={await getEvidenceCatalog("weapons")} />
      </section>
    </SiteShell>
  );
}
