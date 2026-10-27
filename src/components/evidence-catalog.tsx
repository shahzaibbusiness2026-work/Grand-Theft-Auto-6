"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SafeImage } from "@/components/safe-image";
import { FavoriteButton } from "@/components/favorite-button";
import { EvidenceComparison } from "@/components/evidence-comparison";
import { getStoredUserState } from "@/lib/user-store";
import type { CatalogKind, EvidenceEntry } from "@/lib/catalog-evidence";

export function EvidenceCatalog({
  kind,
  entries,
  compare = false,
}: {
  kind: CatalogKind;
  entries: EvidenceEntry[];
  compare?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [saved, setSaved] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [recentOnly, setRecentOnly] = useState(false);
  const [sort, setSort] = useState("name");
  const [limit, setLimit] = useState(24);
  useEffect(() => setLimit(24), [query, category, saved, recentOnly, sort]);
  const storageKey = "taish-recent-" + kind;
  useEffect(() => {
    const update = () => setFavorites(getStoredUserState().favorites[kind]);
    update();
    window.addEventListener("gta6_user_state_change", update);
    try {
      const ids = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (Array.isArray(ids))
        setRecent(ids.filter((x) => typeof x === "string"));
    } catch {}
    if (compare) {
      const params = new URLSearchParams(window.location.search);
      const ids = (
        params.get("ids") ||
        params.get(kind === "vehicles" ? "v" : "w") ||
        ""
      ).split(",");
      setSelected(
        Array.from(
          new Set(
            ids
              .map(
                (id) => entries.find((e) => e.id === id || e.slug === id)?.id,
              )
              .filter((id): id is string => !!id),
          ),
        ).slice(0, 4),
      );
    }
    return () => window.removeEventListener("gta6_user_state_change", update);
  }, [kind, storageKey, compare, entries]);
  const visit = (id: string) => {
    const next = [id, ...recent.filter((x) => x !== id)].slice(0, 8);
    setRecent(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {}
  };
  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id].slice(0, 4);
    setSelected(next);
    const url = new URL(window.location.href);
    url.searchParams.delete("v");
    url.searchParams.delete("w");
    if (next.length) url.searchParams.set("ids", next.join(","));
    else url.searchParams.delete("ids");
    if (compare) window.history.replaceState(window.history.state, "", url);
  };
  const recentRank = (id: string) =>
    recent.includes(id) ? recent.indexOf(id) : Number.MAX_SAFE_INTEGER;
  const shown = entries
    .filter(
      (e) =>
        (!category || e.category === category) &&
        (!saved || favorites.includes(e.id)) &&
        (!recentOnly || recent.includes(e.id)) &&
        e.name.toLowerCase().includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "recent"
        ? recentRank(a.id) - recentRank(b.id)
        : (sort === "reverse" ? -1 : 1) * a.name.localeCompare(b.name),
    );
  const comparison = selected
    .map((id) => entries.find((e) => e.id === id))
    .filter((e): e is EvidenceEntry => !!e);
  return (
    <div className="space-y-6">
      <p className="hidden sm:block rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
        This is an editorial identification catalog. Names, categories and
        illustrations are provisional until linked evidence confirms them.
        Speeds, prices, damage, spawns and attachments are not verified. Older
        game values do not establish GTA VI performance.
        <Link
          href="/editorial-policy"
          className="ml-1 underline text-foreground"
        >
          How we verify claims
        </Link>
        .
      </p>
      <p className="text-xs text-muted-foreground sm:hidden">
        Editorial identifications · Statistics need reviewed evidence.{" "}
        <Link href="/editorial-policy" className="underline">
          Source policy
        </Link>
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          Search {kind}
          <input
            className="mt-2 w-full rounded-xl border border-border bg-background p-3"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
          />
        </label>
        <label className="text-sm font-semibold">
          Editorial category
          <select
            className="mt-2 w-full rounded-xl border border-border bg-background p-3"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories ({entries.length})</option>
            {Array.from(new Set(entries.map((e) => e.category)))
              .sort()
              .map((c) => (
                <option key={c} value={c}>
                  {c} ({entries.filter((e) => e.category === c).length})
                </option>
              ))}
          </select>
        </label>
      </div>
      <div className="flex flex-wrap gap-5 text-sm">
        <label>
          Order{" "}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="ml-2 rounded-lg border border-border bg-background p-2"
          >
            <option value="name">Name A–Z</option>
            <option value="reverse">Name Z–A</option>
            <option value="recent">Recently viewed first</option>
          </select>
        </label>
        <label>
          <input
            type="checkbox"
            checked={saved}
            onChange={(e) => setSaved(e.target.checked)}
            className="mr-2"
          />
          Saved (
          {favorites.filter((id) => entries.some((e) => e.id === id)).length})
        </label>
        <label>
          <input
            type="checkbox"
            checked={recentOnly}
            onChange={(e) => setRecentOnly(e.target.checked)}
            className="mr-2"
          />
          Recently viewed (
          {recent.filter((id) => entries.some((e) => e.id === id)).length})
        </label>
        <p role="status">
          {shown.length} of {entries.length} entries
        </p>
      </div>
      {!!comparison.length && (
        <section
          className="rounded-xl border border-border p-5 space-y-4"
          aria-label="Selected comparison"
        >
          <h2 className="text-xl font-bold">
            Selected entries ({comparison.length}/4)
          </h2>
          {compare ? (
            <EvidenceComparison
              kind={kind}
              entries={comparison}
              onRemove={toggle}
              onReset={() => {
                setSelected([]);
                const url = new URL(window.location.href);
                url.searchParams.delete("ids");
                url.searchParams.delete("v");
                url.searchParams.delete("w");
                window.history.replaceState(window.history.state, "", url);
              }}
            />
          ) : (
            <Link
              className="inline-flex min-h-11 items-center underline"
              href={
                "/compare/" +
                kind +
                "?ids=" +
                encodeURIComponent(selected.join(","))
              }
            >
              Compare selected entries
            </Link>
          )}
        </section>
      )}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shown.slice(0, limit).map((e) => (
          <article
            key={e.id}
            className="overflow-hidden rounded-2xl border border-border bg-card"
          >
            <Link
              href={"/" + kind + "/" + e.slug}
              onClick={() => visit(e.id)}
              className="block"
            >
              <div className="relative h-44">
                <SafeImage
                  src={e.img}
                  alt={"Editorial illustration for " + e.name}
                  fill
                  sizes="(max-width:640px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <h2 className="px-4 pt-4 font-display text-base font-bold">
                {e.name}
              </h2>
            </Link>
            <div className="p-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                {e.category} ·{" "}
                {e.claims.some((c) => c.field === "GTA VI appearance")
                  ? "Appearance evidence available"
                  : "Identification awaiting review"}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <FavoriteButton type={kind} id={e.id} />
                <label className="inline-flex min-h-11 items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selected.includes(e.id)}
                    disabled={!selected.includes(e.id) && selected.length >= 4}
                    onChange={() => toggle(e.id)}
                  />
                  Compare {e.name}
                </label>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!shown.length && <p className="py-8">No entries match these filters.</p>}
      {shown.length > limit && (
        <button
          type="button"
          onClick={() => setLimit(limit + 24)}
          className="min-h-11 rounded-xl border border-border px-5 font-semibold"
        >
          Show more ({Math.min(limit, shown.length)} of {shown.length} shown)
        </button>
      )}
    </div>
  );
}
