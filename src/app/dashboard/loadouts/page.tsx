import { LoadoutClient } from "@/app/tools/loadout-builder/loadout-client";
import { getEvidenceCatalog } from "@/lib/services/evidence-catalog";
export default async function PlayerLoadoutsPage() {
  return (
    <section className="player-panel space-y-5">
      <h1 className="text-2xl font-bold">My loadouts</h1>
      <LoadoutClient entries={await getEvidenceCatalog("weapons")} />
    </section>
  );
}
