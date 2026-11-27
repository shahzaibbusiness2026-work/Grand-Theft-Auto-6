import type { CatalogKind, EvidenceEntry } from "./catalog-evidence";

export const CATALOG_PAGE_SIZE = 24;
export const COMPARE_PAGE_SIZE = 8;

export type CatalogTabDef = {
  key: string;
  label: string;
  /** Entry categories the tab shows; empty means every entry. */
  categories: string[];
  /** Claim field to sort by, highest first (entries without it sort last). */
  stat?: string;
};

/** Category tabs: vehicles get fastest cars / fastest bikes / planes / boats;
    weapons get highest damage plus one tab per class. */
export const CATALOG_TABS: Record<CatalogKind, CatalogTabDef[]> = {
  vehicles: [
    { key: "all", label: "All vehicles", categories: [] },
    {
      key: "fastest-cars",
      label: "Fastest cars",
      categories: ["Sports Car", "Super Car", "Muscle Car", "Muscle", "Classic sedan"],
      stat: "Speed rating",
    },
    {
      key: "fastest-bikes",
      label: "Fastest bikes",
      categories: ["Motorcycle", "Dirt Bike"],
      stat: "Speed rating",
    },
    { key: "planes", label: "Planes & helicopters", categories: ["Plane", "Helicopter"] },
    { key: "boats", label: "Boats", categories: ["Boat"] },
  ],
  weapons: [
    { key: "all", label: "All weapons", categories: [] },
    { key: "highest-damage", label: "Highest damage", categories: [], stat: "Damage" },
    { key: "pistols", label: "Pistols", categories: ["Pistol"], stat: "Damage" },
    { key: "revolvers", label: "Revolvers", categories: ["Revolver"], stat: "Damage" },
    { key: "smgs", label: "SMGs", categories: ["SMG"], stat: "Damage" },
    { key: "shotguns", label: "Shotguns", categories: ["Shotgun"], stat: "Damage" },
    { key: "assault-rifles", label: "Assault rifles", categories: ["Assault Rifle"], stat: "Damage" },
    { key: "sniper-rifles", label: "Sniper rifles", categories: ["Sniper Rifle"], stat: "Damage" },
    { key: "heavy", label: "Heavy & launchers", categories: ["Heavy"], stat: "Damage" },
    { key: "melee", label: "Melee", categories: ["Melee"] },
  ],
};

export function catalogTabFor(kind: CatalogKind, key: string): CatalogTabDef | undefined {
  return CATALOG_TABS[kind].find((tab) => tab.key === key);
}

export function tabFilteredEntries(
  entries: EvidenceEntry[],
  kind: CatalogKind,
  tabKey: string,
): EvidenceEntry[] {
  const tab = catalogTabFor(kind, tabKey);
  if (!tab || tab.categories.length === 0) return entries;
  return entries.filter((entry) => tab.categories.includes(entry.category));
}

/** Numeric value of a "8.7/10" style claim, or null when the entry has none. */
export function statClaimValue(entry: EvidenceEntry, field: string): number | null {
  const claim = entry.claims.find((entryClaim) => entryClaim.field === field);
  if (!claim) return null;
  const match = claim.value.match(/(\d+(?:\.\d+)?)\s*\/\s*10/);
  return match ? Number(match[1]) : null;
}
export function canonicalCatalogSlug(kind: CatalogKind, slug: string) {
  return kind === "vehicles" && slug === "nagasaki-outlaw" ? "mer-can-outlaw" : slug;
}
export type CatalogSearchParams = Record<string, string | string[] | undefined>;

export type PublicCatalogState = {
  q: string;
  category: string;
  tab: string;
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
  state: Pick<PublicCatalogState, "q" | "category" | "tab" | "sort">,
  kind?: CatalogKind,
) {
  const query = state.q.trim().toLowerCase();
  const tab = kind && state.tab ? catalogTabFor(kind, state.tab) : undefined;
  const filtered = entries.filter(
    (entry) =>
      (!tab || tab.categories.length === 0 || tab.categories.includes(entry.category)) &&
      (!state.category || entry.category === state.category) &&
      `${entry.name} ${entry.category}`.toLowerCase().includes(query),
  );
  if (tab?.stat) {
    // Stat tabs sort highest first; entries without the stat sort last by name.
    return filtered.sort((a, b) => {
      const aStat = statClaimValue(a, tab.stat as string);
      const bStat = statClaimValue(b, tab.stat as string);
      if (aStat === null && bStat === null) return a.name.localeCompare(b.name);
      if (aStat === null) return 1;
      if (bStat === null) return -1;
      return bStat - aStat || a.name.localeCompare(b.name);
    });
  }
  return filtered.sort(
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
  kind?: CatalogKind,
): PublicCatalogState {
  const category = params.get("category") || "";
  const rawTab = params.get("tab") || "";
  const tab = kind && rawTab && catalogTabFor(kind, rawTab) ? rawTab : "";
  const filters = {
    q: (params.get("q") || "").trim().slice(0, 120),
    category: entries.some((e) => e.category === category) ? category : "",
    tab,
    sort: params.get("sort") === "reverse" ? "reverse" : "name",
  };
  const page = Math.min(
    pageNumber(params.get("page")),
    catalogPageCount(matchingCatalogEntries(entries, filters, kind).length, size),
  );
  const rawFrom = params.get("from");
  const from = rawFrom && /^[1-9]\d*$/.test(rawFrom) ? Number(rawFrom) : page;
  return { ...filters, page, ...(from < page ? { from } : {}) };
}

export function catalogPageEntries(
  entries: EvidenceEntry[],
  state: PublicCatalogState,
  size: number,
  kind?: CatalogKind,
) {
  return matchingCatalogEntries(entries, state, kind).slice(
    ((state.from ?? state.page) - 1) * size,
    state.page * size,
  );
}

export function isCatalogVariant(params: URLSearchParams) {
  return ["q", "category", "tab", "sort", "ids", "from", "v", "w", "saved", "recent"].some(
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
  for (const key of ["q", "category", "tab", "sort", "page", "from"] as const) {
    const value = state[key];
    if (
      !value ||
      (key === "tab" && value === "all") ||
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
