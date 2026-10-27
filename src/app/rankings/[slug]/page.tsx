import { notFound } from "next/navigation";
import { getRankingDef } from "@/lib/rankings";
import { RankingReview } from "@/components/ranking-review";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const match = getRankingDef(slug);
  if (!match) notFound();
  return {
    title: match.def.title + " — Evidence Review",
    description:
      "This ranking is withheld until its inputs have verified, comparable sources.",
    alternates: { canonical: "/rankings/" + slug },
    robots: { index: false, follow: true },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const match = getRankingDef((await params).slug);
  if (!match) notFound();
  return <RankingReview title={match.def.title} />;
}
