import { notFound } from "next/navigation";
import { EvidenceCatalog } from "@/components/evidence-catalog";
import { getEvidenceCatalog } from "@/lib/services/evidence-catalog";
export default async function PlayerComparisonPage({
  params,
}: {
  params: Promise<{ kind: string }>;
}) {
  const { kind } = await params;
  if (kind !== "vehicles" && kind !== "weapons") notFound();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Compare {kind}</h1>
      <p className="text-sm text-slate-400">
        Unknown gameplay values stay unknown. Save named comparison sets from
        Collections and Comparisons.
      </p>
      <EvidenceCatalog
        kind={kind}
        entries={await getEvidenceCatalog(kind)}
        compare
      />
    </div>
  );
}
