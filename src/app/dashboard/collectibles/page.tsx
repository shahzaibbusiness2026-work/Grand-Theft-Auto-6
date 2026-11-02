import { PlayerProgress } from "@/components/player-progress";
import { getReviewedProgressItems } from "@/lib/services/player-progress";
export default async function PlayerCollectiblesPage() {
  return (
    <PlayerProgress
      items={(await getReviewedProgressItems()).filter(
        (item) => item.category === "Collectibles",
      )}
    />
  );
}
