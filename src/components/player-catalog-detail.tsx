import { notFound } from "next/navigation";
import Link from "@/components/player-tool-link";
import { getEvidenceCatalog } from "@/lib/services/evidence-catalog";
import { FavoriteButton } from "./favorite-button";
export async function PlayerCatalogDetail({
  kind,
  slug,
}: {
  kind: "vehicles" | "weapons";
  slug: string;
}) {
  const item = (await getEvidenceCatalog(kind)).find(
    (entry) => entry.slug === slug,
  );
  if (!item) notFound();
  return (
    <article className="player-panel">
      <Link href={`/${kind}`} className="text-sm text-gold-light">
        ← Back to {kind}
      </Link>
      <h1 className="my-4 text-3xl font-bold">{item.name}</h1>
      <p className="mb-4 text-sm text-slate-400">
        Editorial category: {item.category}. A catalog identification does not
        establish gameplay specifications.
      </p>
      <FavoriteButton type={kind} id={item.id} />
      {kind === "vehicles" && (
        <Link href="/dashboard/garage" className="player-button ml-2">
          Manage my garage & wishlist
        </Link>
      )}
      <h2 className="mb-3 mt-6 text-lg font-bold">Reviewed evidence</h2>
      {!item.claims.length && (
        <p className="text-sm text-slate-400">
          No field-specific evidence has been approved. Gameplay statistics
          remain unknown.
        </p>
      )}
      <div className="grid gap-3 md:grid-cols-2">
        {item.claims.map((claim) => (
          <div
            key={`${claim.field}:${claim.source}`}
            className="rounded-xl border border-white/10 p-4"
          >
            <h3 className="font-bold">{claim.field}</h3>
            <p className="my-2 text-sm">{claim.value}</p>
            <a
              href={claim.source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gold-light underline"
            >
              Source · {claim.locator}
            </a>
          </div>
        ))}
      </div>
    </article>
  );
}
