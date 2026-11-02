import { PlayerCatalogDetail } from "@/components/player-catalog-detail";
export default async function PlayerVehicleDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <PlayerCatalogDetail kind="vehicles" slug={(await params).slug} />;
}
