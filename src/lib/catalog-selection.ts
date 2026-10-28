import type { CatalogKind, EvidenceEntry } from "./catalog-evidence";

/** Resolve old shared links and current IDs against the public catalog only. */
export function selectionFromParams(
  params: URLSearchParams,
  kind: CatalogKind,
  entries: EvidenceEntry[],
): string[] {
  const raw =
    params.get("ids") ?? params.get(kind === "vehicles" ? "v" : "w") ?? "";
  return [
    ...new Set(
      raw
        .split(",")
        .map((id) => entries.find((e) => e.id === id || e.slug === id)?.id)
        .filter((id): id is string => !!id),
    ),
  ].slice(0, 4);
}

export function selectionUrl(url: URL, ids: string[]): URL {
  const next = new URL(url.href);
  next.searchParams.delete("v");
  next.searchParams.delete("w");
  if (ids.length) next.searchParams.set("ids", ids.join(","));
  else next.searchParams.delete("ids");
  return next;
}
