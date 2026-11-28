import { EvidenceSourceLink } from "./evidence-source-link";
import { catalogSchema } from "@/lib/catalog-schema";
import { SITE_CONFIG } from "@/lib/constants";
import { serializeJsonLd } from "@/lib/utils";
import Link from "next/link";
import { FavoriteButton } from "./favorite-button";
import { CatalogVisit } from "./catalog-visit";
import type { CatalogKind, EvidenceClaim, EvidenceEntry } from "@/lib/catalog-evidence";
import { hasSpecificAppearance, isPublisherEvidence } from "@/lib/catalog-detail-availability";
import { isCatalogStat } from "@/lib/comparison-fields";
import { CatalogArtwork } from "./catalog-artwork";
import { catalogArtwork } from "@/lib/catalog-artwork";

function EvidenceFields({ claims }: { claims: EvidenceClaim[] }) {
  return (
    <dl className="grid gap-5 sm:grid-cols-2">
      {claims.map((claim) => (
        <div key={`${claim.field}-${claim.source}-${claim.locator}`}>
          <dt className="font-bold">{claim.field}</dt>
          <dd>
            <p className="mt-1 text-lg tabular-nums">{claim.value}</p>
            <EvidenceSourceLink
              className="text-sm underline"
              href={claim.source}
              target="_blank"
              rel="noreferrer"
            >
              {claim.locator}
            </EvidenceSourceLink>
            <p className="text-sm text-muted-foreground">
              {isPublisherEvidence(claim) ? "Publisher or platform source" : "Third-party evidence"} · Reviewed {claim.reviewedAt.slice(0, 10)}
            </p>
          </dd>
        </div>
      ))}
    </dl>
  );
}

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
  const appearance = entry.claims.find((claim) => claim.field === "GTA VI appearance");
  const fields = entry.claims.filter((claim) =>
    !(claim.field === "GTA VI appearance" &&
      claim.source === nameClaim?.source &&
      claim.locator === nameClaim.locator &&
      claim.value === nameClaim.value),
  );
  const startingDetails = [
    "Acquisition method", "Acquisition location", "Observed gameplay", "Route landmark", "Purchase locations",
    "Spawn location", "Spawn locations", "Observed location", "Mission location",
    "Availability", "Edition availability", "Edition content", "Publisher identification", "Price shown", "Registration cost", "Speed rating",
    "Magazine size", "Damage",
  ].flatMap((field) => {
    const claim = fields.find((item) => item.field === field);
    return claim ? [claim] : [];
  }).slice(0, 3);
  const remaining = fields.filter((claim) => !startingDetails.includes(claim));
  const stats = remaining.filter((claim) => isCatalogStat(kind, claim.field));
  const details = remaining.filter((claim) => !isCatalogStat(kind, claim.field));
  const hasSourceContext = appearance && !startingDetails.length && hasSpecificAppearance(appearance);
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
        {nameClaim ? "Source-backed name" : "Catalog name"} · {entry.category}
      </p>
      <h1 className="font-display text-4xl font-bold">{entry.name}</h1>
      {startingDetails.length > 0 && (
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-xl font-bold">{entry.name} at a glance</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {startingDetails.map((claim) => (
              <li key={claim.field} className="space-y-1">
                <p className="font-bold">{claim.field}</p>
                <p>{claim.value}</p>
                <EvidenceSourceLink href={claim.source} className="underline">
                  {isPublisherEvidence(claim) ? "Official source" : "Third-party source"} · {claim.locator}
                </EvidenceSourceLink>
              </li>
            ))}
          </ul>
        </section>
      )}
      {hasSourceContext && (
        <p><strong>Where it was documented</strong>{" "}{appearance.locator}</p>
      )}
      {artwork && !artwork.contextual && (
        <figure className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="relative aspect-video">
            <CatalogArtwork
              kind={kind}
              entry={entry}
              priority
              sizes="(max-width: 768px) 100vw, 850px"
            />
          </div>
          {(artwork.caption || artwork.sourceUrl) && <figcaption className="px-4 py-3 text-xs leading-relaxed text-muted-foreground">
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
          </figcaption>}
        </figure>
      )}
      {stats.length > 0 && (
        <section className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-2xl font-bold">Stats and menu ratings</h2>
          <p className="text-sm text-muted-foreground">
            {kind === "vehicles"
              ? "A speed rating out of 10 is a menu score. Look for a separate top speed measurement in mph or km/h when available."
              : "Damage scores out of 10 are menu ratings. Magazine and ammo counts apply to the specific item or loadout shown."}
          </p>
          <EvidenceFields claims={stats} />
        </section>
      )}
      {details.length > 0 && (
        <section className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-2xl font-bold">Evidence and sources</h2>
          <EvidenceFields claims={details} />
        </section>
      )}
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
