import { PlayerReading } from "@/components/player-reading";
export default async function PlayerGuideDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <PlayerReading kind="guide" slug={(await params).slug} />;
}
