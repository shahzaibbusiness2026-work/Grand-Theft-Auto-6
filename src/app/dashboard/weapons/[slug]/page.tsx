import { PlayerCatalogDetail } from "@/components/player-catalog-detail";
export default async function PlayerWeaponDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <PlayerCatalogDetail kind="weapons" slug={(await params).slug} />;
}
