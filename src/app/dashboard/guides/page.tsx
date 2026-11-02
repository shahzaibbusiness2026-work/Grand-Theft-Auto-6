import Link from "next/link";
import { getPublicGuides } from "@/lib/services/guides";
export default async function PlayerGuidesPage() {
  const guides = await getPublicGuides();
  return (
    <section className="player-panel">
      <h1 className="text-2xl font-bold">Guides</h1>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {guides.map((guide) => (
          <Link
            href={`/dashboard/guides/${guide.slug}`}
            key={guide.id}
            className="rounded-xl border border-white/10 p-4"
          >
            <h2 className="font-bold">{guide.title}</h2>
            <p className="mt-2 text-sm text-slate-400">{guide.description}</p>
          </Link>
        ))}
      </div>
      {!guides.length && (
        <p className="mt-4 text-sm text-slate-400">
          No complete guides have been published.
        </p>
      )}
    </section>
  );
}
