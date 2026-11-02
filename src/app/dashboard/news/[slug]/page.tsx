import { PlayerReading } from "@/components/player-reading";
export default async function PlayerNewsDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <PlayerReading kind="article" slug={(await params).slug} />;
}
