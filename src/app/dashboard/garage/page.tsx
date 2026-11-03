import { getEvidenceCatalog } from "@/lib/services/evidence-catalog";
import { getPublicProperties } from "@/lib/services/properties";
import { PortfolioWorkspace } from "@/components/player-portfolio-workspace";
export default async function PlayerGaragePage() {
  const [vehicles, properties] = await Promise.all([
    getEvidenceCatalog("vehicles"),
    getPublicProperties(),
  ]);
  const choices = [
    ...vehicles.map((item) => ({
      id: `vehicle:${item.id}`,
      kind: "vehicle" as const,
      name: item.name,
      path: `/dashboard/vehicles/${item.slug}`,
    })),
    ...properties.map((item) => ({
      id: `property:${item.id}`,
      kind: "property" as const,
      name: item.name,
      path: "",
    })),
  ];
  return <PortfolioWorkspace choices={choices} />;
}
