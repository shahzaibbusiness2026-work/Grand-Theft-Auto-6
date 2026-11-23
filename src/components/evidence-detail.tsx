import { EvidenceSourceLink } from "./evidence-source-link";
import { catalogSchema } from "@/lib/catalog-schema";
import { SITE_CONFIG } from "@/lib/constants";
import { serializeJsonLd } from "@/lib/utils";
import Link from "next/link";
import { FavoriteButton } from "./favorite-button";
import { CatalogVisit } from "./catalog-visit";
import type { CatalogKind, EvidenceEntry } from "@/lib/catalog-evidence";
import { CatalogArtwork } from "./catalog-artwork";
import { catalogArtwork } from "@/lib/catalog-artwork";
export function EvidenceDetail({
  entry,
  kind,
  prev,
  next,
}: {
  entry: EvidenceEntry;
  kind: CatalogKind;
  prev?: { name: string; slug: string } | null;
  next?: { name: string; slug: string } | null;
}) {
  const artwork = catalogArtwork(kind, entry);
  const nameClaim = entry.claims.find((claim) => claim.field === "Official name");
  const seen = entry.claims.some((claim) => claim.field === "GTA VI appearance");
  const fields = entry.claims.filter((claim) =>
    !(claim.field === "GTA VI appearance" &&
      claim.source === nameClaim?.source &&
      claim.locator === nameClaim.locator &&
      claim.value === nameClaim.value),
  );
  return (
    <article className="container-site max-w-4xl py-10 space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(catalogSchema(entry, kind, SITE_CONFIG.url)),
        }}
      />
      <CatalogVisit kind={kind} id={entry.id} />
      <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-sm">
        <Link href="/" className="underline">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link href={"/" + kind} className="underline">
          {kind === "vehicles" ? "Vehicles" : "Weapons"}
        </Link>
        <span aria-hidden="true">/</span>
        <span>{entry.name}</span>
      </nav>
      <Link className="underline" href={"/" + kind}>
        All {kind}
      </Link>
      <p className="text-sm text-muted-foreground">
        {nameClaim ? "Source-reviewed name" : "Editorial identification"} · {entry.category}
      </p>
      <h1 className="font-display text-4xl font-bold">{entry.name}</h1>
      {artwork && (
        <figure className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="relative aspect-video">
            <CatalogArtwork
              kind={kind}
              entry={entry}
              priority
              sizes="(max-width: 768px) 100vw, 850px"
            />
          </div>
          <figcaption className="px-4 py-3 text-xs leading-relaxed text-muted-foreground">
            {artwork.caption}
            {artwork.sourceUrl && (
              <>
                {" "}
                <a
                  href={artwork.sourceUrl}
                  className="underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Official trailer source
                </a>
                .
              </>
            )}
          </figcaption>
        </figure>
      )}
      <p>
        {seen
          ? "Sources below show which details have been documented in GTA VI. Shop prices, mission locations and menu ratings describe the context shown by each source."
          : "The exact GTA VI identification is still provisional. Any footage or reported sightings are listed with their limits below."}
      </p>
      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-2xl font-bold">Evidence and sources</h2>
        {fields.length ? (
          <dl className="space-y-5">
            {fields.map((c) => (
              <div key={c.field}>
                <dt className="font-bold">{c.field}</dt>
                <dd>
                  {c.value}
                  <br />
                  <EvidenceSourceLink
                    className="underline"
                    href={c.source}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {c.locator}
                  </EvidenceSourceLink>
                  <p className="text-sm text-muted-foreground">
                    Reviewed {c.reviewedAt} · {c.reviewer}
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
      <p className="text-sm text-muted-foreground">
        Each review includes a source and identifies the detail it supports. See the{" "}
        <Link href="/editorial-policy" className="underline">
          editorial policy
        </Link>
        .
      </p>
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
      {(prev || next) && (
        <nav
          aria-label="More in this catalog"
          className="flex flex-wrap justify-between gap-4 border-t border-border pt-6"
        >
          {prev ? (
            <Link className="underline" href={`/${kind}/${prev.slug}`}>
              ← {prev.name}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link className="underline" href={`/${kind}/${next.slug}`}>
              {next.name} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </article>
  );
}
