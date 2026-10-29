import type { EvidenceEntry } from "./catalog-evidence";

export type PublicCatalogState = {
  q: string;
  category: string;
  sort: string;
  page: number;
};
/** Only public catalog state travels in a link. Favorites/history stay local. */
export function readCatalogState(
  params: URLSearchParams,
  entries: EvidenceEntry[],
  size: number,
): PublicCatalogState {
  const category = params.get("category") || "";
  const page = Number(params.get("page") || "1");
  return {
    q: (params.get("q") || "").trim().slice(0, 120),
    category: entries.some((e) => e.category === category) ? category : "",
    sort: params.get("sort") === "reverse" ? "reverse" : "name",
    page:
      Number.isInteger(page) && page > 0
        ? Math.min(page, Math.max(1, Math.ceil(entries.length / size)))
        : 1,
  };
}
export function catalogStateUrl(url: URL, state: PublicCatalogState): URL {
  const next = new URL(url.href);
  for (const [key, value] of Object.entries(state)) {
    if (
      !value ||
      (key === "sort" && value !== "reverse") ||
      (key === "page" && value === 1)
    )
      next.searchParams.delete(key);
    else next.searchParams.set(key, String(value));
  }
  next.searchParams.delete("saved");
  next.searchParams.delete("recent");
  return next;
}
