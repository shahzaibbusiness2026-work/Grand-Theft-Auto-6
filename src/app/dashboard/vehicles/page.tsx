import { EvidenceCatalog } from "@/components/evidence-catalog";
import { getEvidenceCatalog } from "@/lib/services/evidence-catalog";
export default async function PlayerVehicleCatalog() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My vehicle workspace</h1>
      <p className="text-sm text-slate-400">
        Save catalog entries and create comparison shortlists. Gameplay
        statistics require supporting sources.
      </p>
      <EvidenceCatalog
        kind="vehicles"
        entries={await getEvidenceCatalog("vehicles")}
      />
    </div>
  );
}
