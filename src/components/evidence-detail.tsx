import Link from "next/link";
import { FavoriteButton } from "./favorite-button";
import { CatalogVisit } from "./catalog-visit";
import type { CatalogKind, EvidenceEntry } from "@/lib/catalog-evidence";
export function EvidenceDetail({
  entry,
  kind,
}: {
  entry: EvidenceEntry;
  kind: CatalogKind;
}) {
  return (
    <article className="container-site max-w-4xl py-10 space-y-6">
      <CatalogVisit kind={kind} id={entry.id} />
      <Link className="underline" href={"/" + kind}>
        All {kind}
      </Link>
      <p className="text-sm text-muted-foreground">
        Editorial identification · {entry.category}
      </p>
      <h1 className="font-display text-4xl font-bold">{entry.name}</h1>
      <p>
        This entry is awaiting field-by-field evidence review. The catalog name
        is a provisional identification and does not establish that this model
        appears in GTA VI.
      </p>
      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-2xl font-bold">What is verified?</h2>
        {entry.claims.length ? (
          <dl className="space-y-5">
            {entry.claims.map((c) => (
              <div key={c.field}>
                <dt className="font-bold">{c.field}</dt>
                <dd>
                  {c.value}
                  <br />
                  <a
                    className="underline"
                    href={c.source}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {c.locator}
                  </a>
                  <p className="text-sm text-muted-foreground">
                    Reviewed {c.reviewedAt} by {c.reviewer}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p>
            No field-specific source has been approved for this entry.
            Performance, price, unlock conditions, spawn locations and
            customization remain unverified.
          </p>
        )}
      </section>
      <p>
        We do not substitute GTA V statistics or class averages for missing GTA
        VI data. Official footage may establish an appearance without proving
        speed, damage or purchase price.
      </p>
      <div className="flex flex-wrap gap-5 items-center">
        <FavoriteButton type={kind} id={entry.id} />
        <Link
          className="underline"
          href={"/compare/" + kind + "?ids=" + encodeURIComponent(entry.id)}
        >
          Compare evidence
        </Link>
        <Link className="underline" href="/corrections">
          Submit a source or correction
        </Link>
      </div>
      <Link className="block underline" href="/editorial-policy">
        Read our evidence policy
      </Link>
    </article>
  );
}
