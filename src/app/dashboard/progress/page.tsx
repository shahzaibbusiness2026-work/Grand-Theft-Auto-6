import { PlayerProgress } from "@/components/player-progress";
import { getReviewedProgressItems } from "@/lib/services/player-progress";
export default async function PlayerProgressPage() {
  return <PlayerProgress items={await getReviewedProgressItems()} />;
}
