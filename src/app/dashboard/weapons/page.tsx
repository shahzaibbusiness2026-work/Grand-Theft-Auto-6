import { EvidenceCatalog } from "@/components/evidence-catalog";
import { getEvidenceCatalog } from "@/lib/services/evidence-catalog";
export default async function PlayerWeaponCatalog() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My weapon workspace</h1>
      <p className="text-sm text-slate-400">
        Save editorial identifications and review evidence before planning a
        loadout.
      </p>
      <EvidenceCatalog
        kind="weapons"
        entries={await getEvidenceCatalog("weapons")}
      />
    </div>
  );
}
