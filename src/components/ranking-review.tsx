import Link from "next/link";
import { SiteShell } from "@/components/shells";
export function RankingReview({
  title = "GTA VI Rankings",
}: {
  title?: string;
}) {
  return (
    <SiteShell>
      <section className="container-site max-w-3xl py-12 space-y-6">
        <h1 className="text-4xl font-display font-bold">{title}</h1>
        <h2 className="text-2xl font-bold">
          Performance evidence is awaiting review
        </h2>
        <p>
          We have withdrawn rankings calculated from unverified pre-release
          statistics. An editorial class average or a value from an older GTA
          game cannot establish the fastest car, best weapon or a GTA VI
          performance winner.
        </p>
        <p>
          A future ranking needs comparable measurements, a stated method and a
          reviewed source for every field used to score an entry.
        </p>
        <div className="flex flex-wrap gap-5">
          <Link href="/compare/vehicles" className="underline min-h-11">
            Compare vehicle evidence
          </Link>
          <Link href="/compare/weapons" className="underline min-h-11">
            Compare weapon evidence
          </Link>
          <Link href="/editorial-policy" className="underline min-h-11">
            Evidence policy
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
