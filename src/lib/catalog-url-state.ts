import type { CatalogKind, EvidenceEntry } from "./catalog-evidence";

export const CATALOG_PAGE_SIZE = 24;
export const COMPARE_PAGE_SIZE = 8;
export type CatalogSearchParams = Record<string, string | string[] | undefined>;

export type PublicCatalogState = {
  q: string;
  category: string;
  sort: string;
  page: number;
  from?: number;
};

export function catalogSearchParams(params: CatalogSearchParams) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    for (const part of Array.isArray(value) ? value : [value]) {
      if (part !== undefined) search.append(key, part);
    }
  }
  return search;
}

function pageNumber(value: string | null): number {
  return value && /^[1-9]\d*$/.test(value) ? Number(value) : 1;
}

export function matchingCatalogEntries(
  entries: EvidenceEntry[],
  state: Pick<PublicCatalogState, "q" | "category" | "sort">,
) {
  const query = state.q.trim().toLowerCase();
  return entries
    .filter(
      (entry) =>
        (!state.category || entry.category === state.category) &&
        `${entry.name} ${entry.category}`.toLowerCase().includes(query),
    )
    .sort(
      (a, b) =>
        (state.sort === "reverse" ? -1 : 1) * a.name.localeCompare(b.name) ||
        a.slug.localeCompare(b.slug),
    );
}

export function catalogPageCount(entryCount: number, size: number) {
  return Math.max(1, Math.ceil(entryCount / size));
}

/** Only public catalog state travels in a link. Favorites/history stay local. */
export function readCatalogState(
  params: URLSearchParams,
  entries: EvidenceEntry[],
  size: number,
): PublicCatalogState {
  const category = params.get("category") || "";
  const filters = {
    q: (params.get("q") || "").trim().slice(0, 120),
    category: entries.some((e) => e.category === category) ? category : "",
    sort: params.get("sort") === "reverse" ? "reverse" : "name",
  };
  const page = Math.min(
    pageNumber(params.get("page")),
    catalogPageCount(matchingCatalogEntries(entries, filters).length, size),
  );
  const rawFrom = params.get("from");
  const from = rawFrom && /^[1-9]\d*$/.test(rawFrom) ? Number(rawFrom) : page;
  return { ...filters, page, ...(from < page ? { from } : {}) };
}

export function catalogPageEntries(
  entries: EvidenceEntry[],
  state: PublicCatalogState,
  size: number,
) {
  return matchingCatalogEntries(entries, state).slice(
    ((state.from ?? state.page) - 1) * size,
    state.page * size,
  );
}

export function isCatalogVariant(params: URLSearchParams) {
  return ["q", "category", "sort", "ids", "from", "v", "w", "saved", "recent"].some(
    (key) => Boolean(params.get(key)),
  );
}

export function catalogCanonicalPath(
  kind: CatalogKind,
  params: URLSearchParams,
  entries: EvidenceEntry[],
) {
  const { page } = readCatalogState(params, entries, CATALOG_PAGE_SIZE);
  return isCatalogVariant(params) || page === 1
    ? `/${kind}`
    : `/${kind}?page=${page}`;
}

export function catalogStateUrl(url: URL, state: PublicCatalogState): URL {
  const next = new URL(url.href);
  for (const key of ["q", "category", "sort", "page", "from"] as const) {
    const value = state[key];
    if (
      !value ||
      (key === "sort" && value !== "reverse") ||
      (key === "page" && value === 1) ||
      (key === "from" && Number(value) >= state.page)
    )
      next.searchParams.delete(key);
    else next.searchParams.set(key, String(value));
  }
  next.searchParams.delete("saved");
  next.searchParams.delete("recent");
  return next;
}
