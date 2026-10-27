import { RankingReview } from "@/components/ranking-review";
export const metadata = {
  title: "GTA VI Rankings — Evidence Review",
  description:
    "Performance rankings are awaiting verified, comparable source data.",
  alternates: { canonical: "/rankings" },
  robots: { index: false, follow: true },
};
export default function Page() {
  return <RankingReview />;
}
