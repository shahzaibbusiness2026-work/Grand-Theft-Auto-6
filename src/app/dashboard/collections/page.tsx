import { getEvidenceCatalog } from "@/lib/services/evidence-catalog";
import { PlayerCollections } from "./collections-client";
export default async function CollectionsPage() {
  const [vehicles, weapons] = await Promise.all([
    getEvidenceCatalog("vehicles"),
    getEvidenceCatalog("weapons"),
  ]);
  return (
    <PlayerCollections
      vehicles={vehicles.map(({ id, name }) => ({ id, name }))}
      weapons={weapons.map(({ id, name }) => ({ id, name }))}
    />
  );
}
