"use client";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "@/components/player-tool-link";
import { trackPublicEvent } from "@/lib/public-events";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Heart,
  Layers2,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { CatalogArtwork } from "@/components/catalog-artwork";
import { catalogArtwork } from "@/lib/catalog-artwork";
import { EvidenceComparison } from "@/components/evidence-comparison";
import {
  getStoredUserState,
  saveStoredUserState,
  toggleFavorite,
} from "@/lib/user-store";
import { selectionFromParams, selectionUrl } from "@/lib/catalog-selection";
import type { CatalogKind, EvidenceEntry } from "@/lib/catalog-evidence";
import styles from "./catalog-ui.module.css";
import { readCatalogState, catalogStateUrl } from "@/lib/catalog-url-state";

type FiltersProps = {
  entries: EvidenceEntry[];
  category: string;
  setCategory: (value: string) => void;
  saved: boolean;
  setSaved: (value: boolean) => void;
  recentOnly: boolean;
  setRecentOnly: (value: boolean) => void;
  savedCount: number;
  recentCount: number;
  clear: () => void;
};
function Filters(p: FiltersProps) {
  return (
    <div className={styles.filterContent}>
      <div className={styles.filterTop}>
        <p className={styles.filterHeading}>
          <SlidersHorizontal size={16} aria-hidden="true" />
          Filters
        </p>
        <button type="button" onClick={p.clear} className={styles.textButton}>
          Reset
        </button>
      </div>
      <span className={styles.filterLabel}>Category</span>
      <div className={styles.categoryList}>
        {[
          "",
          ...Array.from(new Set(p.entries.map((e) => e.category))).sort(),
        ].map((category) => (
          <button
            type="button"
            key={category}
            className={styles.categoryButton}
            aria-pressed={p.category === category}
            onClick={() => p.setCategory(category)}
          >
            <span>{category || "All categories"}</span>
            <span className={styles.categoryCount}>
              {
                p.entries.filter((e) => !category || e.category === category)
                  .length
              }
            </span>
          </button>
        ))}
      </div>
      <span className={styles.filterLabel}>Your collection</span>
      <label className={styles.check}>
        <input
          type="checkbox"
          checked={p.saved}
          onChange={(e) => p.setSaved(e.target.checked)}
        />
        Saved ({p.savedCount})
      </label>
      <label className={styles.check}>
        <input
          type="checkbox"
          checked={p.recentOnly}
          onChange={(e) => p.setRecentOnly(e.target.checked)}
        />
        Recently viewed ({p.recentCount})
      </label>
    </div>
  );
}

// Reads the URL search params client-side and syncs catalog state.
// useSearchParams suspends during static prerendering, so this component
// must live inside a Suspense boundary (see the usage in EvidenceCatalog).
// The boundary renders nothing while suspended, so the catalog itself still
// prerenders fully — only the URL sync waits for hydration.
function CatalogUrlSync({
  onSync,
}: {
  onSync: (params: URLSearchParams) => void;
}) {
  const searchParams = useSearchParams();
  useEffect(() => {
    onSync(new URLSearchParams(searchParams.toString()));
  }, [searchParams, onSync]);
  return null;
}

export function EvidenceCatalog({
  kind,
  entries,
  compare = false,
}: {
  kind: CatalogKind;
  entries: EvidenceEntry[];
  compare?: boolean;
}) {
  const [query, setQueryState] = useState("");
  const [category, setCategoryState] = useState("");
  const [saved, setSaved] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [recentOnly, setRecentOnly] = useState(false);
  const [sort, setSortState] = useState("name");
  // First page by default; CatalogUrlSync expands this from ?page=N
  // client-side after hydration (and on pagination navigation).
  const [limit, setLimitState] = useState(compare ? 8 : 24);
  const [pickerOpen, setPickerOpen] = useState(false);
  const picker = useRef<HTMLDialogElement>(null);
  // Slots shown in the comparison workspace. Two by default; picking more
  // vehicles than there are slots grows them automatically, up to four.
  const [slotCount, setSlotCount] = useState(2);
  const label = kind === "vehicles" ? "vehicle" : "weapon";
  const pageSize = compare ? 8 : 24;
  const writeState = (
    patch: Partial<{ q: string; category: string; sort: string; page: number }>,
    push = true,
  ) => {
    trackPublicEvent("catalog_filter_used", {
      kind,
      filter:
        Object.keys(patch)
          .filter((key) => key !== "q")
          .join(",") || "search",
    });
    const next = {
      q: query,
      category,
      sort,
      page: Math.ceil(limit / pageSize),
      ...patch,
    };
    setQueryState(next.q);
    setCategoryState(next.category);
    setSortState(next.sort);
    setLimitState(next.page * pageSize);
    const url = catalogStateUrl(new URL(window.location.href), next);
    if (url.href !== window.location.href)
      window.history[push ? "pushState" : "replaceState"](
        window.history.state,
        "",
        url,
      );
  };
  const setQuery = (q: string) => writeState({ q, page: 1 }, false);
  const setCategory = (category: string) => writeState({ category, page: 1 });
  const setSort = (sort: string) => writeState({ sort, page: 1 });
  const setLimit = (limit: number) =>
    writeState({ page: Math.ceil(limit / pageSize) });
  // Sync catalog state from the URL (?q, ?category, ?sort, ?page, ?ids).
  // Runs on mount and whenever the search params change — pagination
  // <Link> clicks, back/forward, and shared deep links. The hub pages are
  // static (no server-side searchParams), so this client-side sync is what
  // makes ?page=N work. It lives in a suspended child (CatalogUrlSync
  // below) so the catalog itself still prerenders fully on the server.
  const syncFromParams = useCallback(
    (params: URLSearchParams) => {
      const state = readCatalogState(params, entries, compare ? 8 : 24);
      setQueryState(state.q);
      setCategoryState(state.category);
      setSortState(state.sort);
      setLimitState(state.page * (compare ? 8 : 24));
      const initialSelected = selectionFromParams(params, kind, entries);
      setSelected(initialSelected);
      // Slots follow the selection: never fewer than two, never more than
      // four, and never fewer than the picks the URL already carries.
      setSlotCount(Math.max(2, Math.min(4, initialSelected.length)));
    },
    [entries, kind, compare],
  );
  useEffect(() => {
    const update = () => {
      const state = getStoredUserState();
      setFavorites(state.favorites[kind]);
      setRecent(state.recentCatalogIds[kind]);
    };
    update();
    window.addEventListener("gta6_user_state_change", update);
    return () => {
      window.removeEventListener("gta6_user_state_change", update);
    };
  }, [kind]);
  useEffect(() => {
    if (!pickerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [pickerOpen]);
  const openPicker = () => {
    picker.current?.showModal();
    setPickerOpen(true);
  };
  const closePicker = () => picker.current?.close();
  const visit = (id: string) => {
    const next = [id, ...recent.filter((x) => x !== id)].slice(0, 8);
    setRecent(next);
    const state = getStoredUserState();
    saveStoredUserState({
      ...state,
      recentCatalogIds: { ...state.recentCatalogIds, [kind]: next },
    });
  };
  const select = (ids: string[]) => {
    setSelected(ids);
    // Picking past the visible slots grows them so no pick is hidden.
    setSlotCount((c) => Math.max(c, Math.min(4, ids.length)));
    window.history.replaceState(
      window.history.state,
      "",
      selectionUrl(new URL(window.location.href), ids),
    );
  };
  const toggle = (id: string) =>
    select(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id].slice(0, 4),
    );
  const clear = () => {
    writeState({ q: "", category: "", sort: "name", page: 1 });
    setSaved(false);
    setRecentOnly(false);
  };
  const recentRank = (id: string) =>
    recent.includes(id) ? recent.indexOf(id) : Number.MAX_SAFE_INTEGER;
  const shown = entries
    .filter(
      (e) =>
        (!category || e.category === category) &&
        (!saved || favorites.includes(e.id)) &&
        (!recentOnly || recent.includes(e.id)) &&
        [e.name, e.category]
          .join(" ")
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    )
    .sort((a, b) =>
      sort === "recent"
        ? recentRank(a.id) - recentRank(b.id)
        : (sort === "reverse" ? -1 : 1) * a.name.localeCompare(b.name),
    );
  // Pagination links to every ?page=N exist, but each ?page=N serves the
  // same first-page HTML and the catalog expands to the requested page
  // client-side — so a non-JS crawler never sees links to items past the
  // first 24. Detail pages therefore carry plain prev/next links as well
  // (EvidenceDetail), and the sitemap lists them all.
  // Mirrors catalogStateUrl: defaults (page 1, sort name) stay out of the URL.
  const pathname = usePathname();
  const totalPages = Math.max(1, Math.ceil(shown.length / pageSize));
  const currentPage = Math.min(
    totalPages,
    Math.max(1, Math.ceil(limit / pageSize)),
  );
  const pageHref = (n: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category) params.set("category", category);
    if (sort === "reverse") params.set("sort", "reverse");
    if (n > 1) params.set("page", String(n));
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };
  const comparison = selected
    .map((id) => entries.find((e) => e.id === id))
    .filter((e): e is EvidenceEntry => !!e);
  const activeFilters = Number(!!category) + Number(saved) + Number(recentOnly);
  const filters: FiltersProps = {
    entries,
    category,
    setCategory,
    saved,
    setSaved,
    recentOnly,
    setRecentOnly,
    clear,
    savedCount: favorites.filter((id) => entries.some((e) => e.id === id))
      .length,
    recentCount: recent.filter((id) => entries.some((e) => e.id === id)).length,
  };
  const browser = (
    <div className={styles.catalogLayout}>
      <aside
        className={styles.filters}
        aria-label="Catalog filters"
        tabIndex={0}
      >
        <Filters {...filters} />
      </aside>
      <div className="min-w-0">
        <div className={styles.toolbar}>
          <label className={styles.search}>
            <span className="sr-only">Search {kind}</span>
            <Search size={17} aria-hidden="true" />
            <input
              className={styles.input}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder={`Search ${kind} or categories…`}
            />
          </label>
          <label className={styles.sortLabel}>
            Sort by
            <select
              className={styles.select}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="name">Name A–Z</option>
              <option value="reverse">Name Z–A</option>
              <option value="recent">Recently viewed first</option>
            </select>
          </label>
        </div>
        <details className={styles.mobileFilter}>
          <summary>
            <span>Filters{activeFilters ? ` (${activeFilters})` : ""}</span>
            <SlidersHorizontal size={16} aria-hidden="true" />
          </summary>
          <Filters {...filters} />
        </details>
        <div className={styles.results}>
          <p role="status">
            <strong>{shown.length}</strong> {kind}
            {category ? ` / ${category}` : " in the catalog"}
          </p>
          <span>{selected.length}/4 selected</span>
        </div>
        <div className={styles.grid}>
          {shown.slice(0, limit).map((e) => {
            const picked = selected.includes(e.id);
            const favorite = favorites.includes(e.id);
            // Text-only entries have no verified image: hide the image
            // area entirely instead of showing an empty box.
            const hasArtwork = !!catalogArtwork(kind, e);
            return (
              <article
                key={e.id}
                className={styles.card}
                data-selected={picked}
              >
                {hasArtwork &&
                  (compare ? (
                    <button
                      type="button"
                      onClick={() => toggle(e.id)}
                      aria-pressed={picked}
                      aria-label={`${picked ? "Remove" : "Add"} ${e.name} ${picked ? "from" : "to"} comparison`}
                      disabled={!picked && selected.length >= 4}
                      className={`${styles.cardImage} ${styles.cardPick} ${styles.cardPickImage}`}
                    >
                      <CatalogArtwork
                        kind={kind}
                        entry={e}
                        sizes="(max-width:359px) 100vw, (max-width:767px) 50vw, 30vw"
                      />
                    </button>
                  ) : (
                    <Link
                      href={`/${kind}/${e.slug}`}
                      onClick={() => visit(e.id)}
                      className={styles.cardImage}
                      aria-label={`View ${e.name}`}
                    >
                      <CatalogArtwork
                        kind={kind}
                        entry={e}
                        sizes="(max-width:359px) 100vw, (max-width:767px) 50vw, 30vw"
                      />
                    </Link>
                  ))}
                <div className={styles.cardBody}>
                  <p className={styles.cardCategory}>{e.category}</p>
                  <h2 className={styles.cardTitle}>
                    {compare ? (
                      <button
                        type="button"
                        onClick={() => toggle(e.id)}
                        aria-pressed={picked}
                        aria-label={`${picked ? "Remove" : "Add"} ${e.name} ${picked ? "from" : "to"} comparison`}
                        disabled={!picked && selected.length >= 4}
                        className={styles.cardPick}
                      >
                        {e.name}
                      </button>
                    ) : (
                      <Link
                        href={`/${kind}/${e.slug}`}
                        onClick={() => visit(e.id)}
                      >
                        {e.name}
                      </Link>
                    )}
                  </h2>
                  <p className={styles.cardEvidence}>
                    <span className={styles.dot} />
                    {e.claims.some((c) => c.field === "GTA VI appearance")
                      ? "Appearance evidence reviewed"
                      : "Identification awaiting review"}
                  </p>
                  <div className={styles.cardActions}>
                    <button
                      type="button"
                      className={styles.compareButton}
                      aria-pressed={picked}
                      aria-label={`${picked ? "Remove" : "Compare"} ${e.name}`}
                      disabled={!picked && selected.length >= 4}
                      onClick={() => toggle(e.id)}
                    >
                      {picked ? (
                        <Check size={14} aria-hidden="true" />
                      ) : (
                        <Plus size={14} aria-hidden="true" />
                      )}
                      {picked ? "Selected" : "Compare"}
                    </button>
                    <button
                      type="button"
                      className={styles.favorite}
                      aria-pressed={favorite}
                      aria-label={`${favorite ? "Unsave" : "Save"} ${e.name}`}
                      onClick={() => {
                        toggleFavorite(kind, e.id);
                        setFavorites(getStoredUserState().favorites[kind]);
                      }}
                    >
                      <Heart
                        size={16}
                        fill={favorite ? "currentColor" : "none"}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        {!shown.length && (
          <div className={styles.empty}>
            <Search size={28} aria-hidden="true" />
            <h3>No {kind} found</h3>
            <p>Try another name or reset your filters.</p>
            <button className={styles.secondary} type="button" onClick={clear}>
              Reset filters
            </button>
          </div>
        )}
        {shown.length > limit && (
          <div className={styles.loadMore}>
            <button
              className={styles.secondary}
              type="button"
              onClick={() => setLimit(limit + (compare ? 8 : 24))}
            >
              Show more · {Math.min(limit, shown.length)} of {shown.length}
              <ChevronDown size={15} aria-hidden="true" />
            </button>
          </div>
        )}
        {!compare && totalPages > 1 && (
          <nav className={styles.pagination} aria-label={`${label} pages`}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={pageHref(n)}
                aria-current={n === currentPage ? "page" : undefined}
                className={`${styles.secondary} ${n === currentPage ? styles.pageCurrent : ""}`}
              >
                {n}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
  return (
    <div
      className={styles.root}
      id={compare ? "comparison-workspace" : "catalog-browser"}
      style={{ scrollMarginTop: 90 }}
    >
      <Suspense fallback={null}>
        <CatalogUrlSync onSync={syncFromParams} />
      </Suspense>
      <div className={styles.notice}>
        <ShieldCheck size={17} aria-hidden="true" />
        <p>
          <span className={styles.desktopNotice}>
            Editorial identifications and illustrations are provisional. Only
            reviewed field-specific evidence establishes GTA VI details.{" "}
          </span>
          <span className={styles.mobileNotice}>
            Editorial catalog · Unverified stats stay marked.{" "}
          </span>
          <Link href="/editorial-policy">Our source policy</Link>
        </p>
      </div>
      {compare ? (
        <>
          <section
            className={styles.workspace}
            aria-labelledby="selection-heading"
          >
            <div className={styles.workspaceHeading}>
              <div>
                <h2 id="selection-heading">
                  Your comparison{" "}
                  <span className="font-normal text-muted-foreground">
                    {selected.length}/4
                  </span>
                </h2>
                <p>
                  Select up to four {kind}. Add, remove, or replace any pick.
                </p>
              </div>
              <button
                className={styles.secondary}
                onClick={openPicker}
                type="button"
              >
                <Plus size={16} aria-hidden="true" />
                Choose {kind}
              </button>
            </div>
            <div
              className={[
                styles.slots,
                slotCount === 2
                  ? styles.slotsTwo
                  : slotCount === 3
                    ? styles.slotsThree
                    : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {Array.from({ length: slotCount }, (_, i) => {
                const entry = comparison[i];
                return entry ? (
                  <article className={styles.slot} key={entry.id}>
                    {catalogArtwork(kind, entry) && (
                      <div className={styles.slotImage}>
                        <CatalogArtwork
                          kind={kind}
                          entry={entry}
                          sizes="(max-width:767px) 45vw, 23vw"
                        />
                      </div>
                    )}
                    <button
                      className={styles.removeSlot}
                      type="button"
                      onClick={() => toggle(entry.id)}
                      aria-label={`Remove ${entry.name} from comparison`}
                    >
                      <X size={16} aria-hidden="true" />
                    </button>
                    <div className={styles.slotText}>
                      <h3>{entry.name}</h3>
                      <p>{entry.category}</p>
                    </div>
                  </article>
                ) : (
                  <button
                    key={"slot-" + i}
                    type="button"
                    className={styles.addSlot}
                    onClick={openPicker}
                    aria-label={`Add ${label} to slot ${i + 1}`}
                  >
                    <Plus aria-hidden="true" />
                    <span>
                      Add {label} {i + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
          {comparison.length ? (
            <EvidenceComparison
              kind={kind}
              entries={comparison}
              onRemove={toggle}
              onReset={() => {
                select([]);
                setSlotCount(2);
              }}
            />
          ) : (
            <div className={styles.empty}>
              <Layers2 size={32} aria-hidden="true" />
              <h3>Start with your first {label}</h3>
              <p>
                Your selections appear above. Every comparison field remains
                available below.
              </p>
              <button
                className={styles.primary}
                type="button"
                onClick={openPicker}
              >
                Choose {kind}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          )}
          <dialog
            className={styles.dialog}
            ref={picker}
            aria-labelledby="picker-heading"
            onClose={() => setPickerOpen(false)}
          >
            <div className={styles.dialogHeader}>
              <h2 id="picker-heading">Choose {kind}</h2>
              <button
                type="button"
                className={styles.iconButton}
                onClick={closePicker}
                aria-label="Close selection"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className={styles.dialogBody}>{browser}</div>
            <div className={styles.dialogFooter}>
              <span role="status">
                {selected.length}/4 selected
                {selected.length === 4 ? " · Remove a pick to replace it" : ""}
              </span>
              <button
                type="button"
                className={styles.primary}
                onClick={closePicker}
              >
                View comparison
                <ArrowRight size={15} aria-hidden="true" />
              </button>
            </div>
          </dialog>
        </>
      ) : (
        <>
          {browser}
          {comparison.length > 0 && (
            <section className={styles.tray} aria-label="Comparison shortlist">
              <div>
                <strong>
                  {comparison.length}/4 {kind} selected
                </strong>
                <div className={styles.trayNames}>
                  {comparison.map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => toggle(e.id)}
                      aria-label={`Remove ${e.name} from shortlist`}
                    >
                      {e.name} ×
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.trayActions}>
                <button
                  className={styles.textButton}
                  type="button"
                  onClick={() => select([])}
                >
                  Clear
                </button>
                <Link
                  className={styles.primary}
                  href={`/compare/${kind}?ids=${encodeURIComponent(selected.join(","))}`}
                >
                  Compare picks
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
