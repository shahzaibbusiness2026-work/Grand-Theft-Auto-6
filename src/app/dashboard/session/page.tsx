import { SessionPlanner } from "@/components/player-session-planner";
import { getReviewedProgressItems } from "@/lib/services/player-progress";
export default async function SessionPlannerPage() {
  return <SessionPlanner requirements={await getReviewedProgressItems()} />;
}
