"use client";
import { indexReady } from "@/lib/catalog-detail-availability";
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
import {
  CATALOG_PAGE_SIZE,
  CATALOG_TABS,
  COMPARE_PAGE_SIZE,
  catalogPageCount,
  catalogStateUrl,
  catalogTabFor,
  matchingCatalogEntries,
  readCatalogState,
  tabFilteredEntries,
  type PublicCatalogState,
} from "@/lib/catalog-url-state";

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
  initialState = { q: "", category: "", tab: "", sort: "name", page: 1 },
  initialSelection = [],
}: {
  kind: CatalogKind;
  entries: EvidenceEntry[];
  compare?: boolean;
  initialState?: PublicCatalogState;
  initialSelection?: string[];
}) {
  const [state, setState] = useState(initialState);
  const { q: query, category, tab, sort } = state;
  const activeTab = catalogTabFor(kind, tab);
  const [saved, setSaved] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selected, setSelected] = useState(initialSelection);
  const [recent, setRecent] = useState<string[]>([]);
  const [recentOnly, setRecentOnly] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const picker = useRef<HTMLDialogElement>(null);
  // Slots shown in the comparison workspace. Two by default; picking more
  // vehicles than there are slots grows them automatically, up to four.
  const [slotCount, setSlotCount] = useState(Math.max(2, initialSelection.length));
  const label = kind === "vehicles" ? "vehicle" : "weapon";
  const pageSize = compare ? COMPARE_PAGE_SIZE : CATALOG_PAGE_SIZE;
  const writeState = (patch: Partial<PublicCatalogState>, push = true) => {
    trackPublicEvent("catalog_filter_used", {
      kind,
      filter:
        Object.keys(patch)
          .filter((key) => key !== "q")
          .join(",") || "search",
    });
    const next = { ...state, ...patch };
    setState(next);
    const url = catalogStateUrl(new URL(window.location.href), next);
    if (url.href !== window.location.href)
      window.history[push ? "pushState" : "replaceState"](
        window.history.state,
        "",
        url,
      );
  };
  const firstPage = { page: 1, from: undefined };
  const setQuery = (q: string) => writeState({ ...firstPage, q }, false);
  const setCategory = (category: string) => writeState({ ...firstPage, category });
  const setSort = (sort: string) => writeState({ ...firstPage, sort });
  // Switching tabs clears the category filter; tapping the active tab goes back to All.
  const setTab = (nextTab: string) =>
    writeState({ ...firstPage, tab: nextTab === tab ? "" : nextTab, category: "" });
  const syncFromParams = useCallback(
    (params: URLSearchParams) => {
      const next = readCatalogState(params, entries, pageSize, kind);
      setState((previous) => ({
        ...next,
        q: next.q === previous.q.trim() ? previous.q : next.q,
        sort: previous.sort === "recent" && next.sort === "name" ? previous.sort : next.sort,
      }));
      const initialSelected = selectionFromParams(params, kind, entries);
      setSelected(initialSelected);
      // Slots follow the selection: never fewer than two, never more than
      // four, and never fewer than the picks the URL already carries.
      setSlotCount(Math.max(2, Math.min(4, initialSelected.length)));
    },
    [entries, kind, pageSize],
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
    writeState({ ...firstPage, q: "", category: "", tab: "", sort: "name" });
    setSaved(false);
    setRecentOnly(false);
  };
  const recentRank = (id: string) =>
    recent.includes(id) ? recent.indexOf(id) : Number.MAX_SAFE_INTEGER;
  const shown = matchingCatalogEntries(entries, state, kind)
    .filter(
      (e) =>
        (!saved || favorites.includes(e.id)) &&
        (!recentOnly || recent.includes(e.id)),
    );
  if (sort === "recent") shown.sort((a, b) => recentRank(a.id) - recentRank(b.id));
  const pathname = usePathname();
  const totalPages = catalogPageCount(shown.length, pageSize);
  const currentPage = Math.min(state.page, totalPages);
  const firstVisiblePage = compare ? 1 : Math.min(state.from ?? currentPage, currentPage);
  const cards = shown.slice((firstVisiblePage - 1) * pageSize, currentPage * pageSize);
  const pageHref = (page: number) => {
    const url = catalogStateUrl(new URL(pathname, "https://www.taishgaming.com"), {
      ...state,
      page,
      from: undefined,
    });
    if (selected.length) url.searchParams.set("ids", selected.join(","));
    return url.pathname + url.search;
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
        <nav aria-label={`${kind} categories`} className={styles.tabList}>
          {CATALOG_TABS[kind].map((tabDef) => {
            const active = (tab || "all") === tabDef.key;
            return (
              <button
                type="button"
                key={tabDef.key}
                className={styles.tabButton}
                aria-pressed={active}
                onClick={() => setTab(tabDef.key === "all" ? "" : tabDef.key)}
              >
                <span>{tabDef.label}</span>
                <span className={styles.categoryCount}>
                  {tabFilteredEntries(entries, kind, tabDef.key).length}
                </span>
              </button>
            );
          })}
        </nav>
        <div className={styles.toolbar}>
          <label className={styles.search}>
            <span className="sr-only">Search {kind}</span>
            <Search size={17} aria-hidden="true" />
            <input
              className={styles.input}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              maxLength={120}
              placeholder={`Search ${kind} or categories…`}
            />
          </label>
          {activeTab?.stat ? (
            <span className={styles.sortNote}>
              Sorted by {activeTab.stat === "Speed rating" ? "speed" : "damage"}, highest first
            </span>
          ) : (
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
          )}
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
            {activeTab && activeTab.key !== "all"
              ? ` / ${activeTab.label}`
              : category
                ? ` / ${category}`
                : " in the catalog"}
          </p>
          <span>{selected.length}/4 selected</span>
        </div>
        <div className={styles.grid}>
          {cards.map((e) => {
            const picked = selected.includes(e.id);
            const favorite = favorites.includes(e.id);
            const hasDetail = indexReady(e);
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
                  ) : hasDetail ? (
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
                  ) : (
                    <div className={styles.cardImage}>
                      <CatalogArtwork kind={kind} entry={e} sizes="(max-width:767px) 50vw, 30vw" />
                    </div>
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
                    ) : hasDetail ? (
                      <Link
                        href={`/${kind}/${e.slug}`}
                        onClick={() => visit(e.id)}
                      >
                        {e.name}
                      </Link>
                    ) : e.name}
                  </h2>
                  <p className={styles.cardEvidence}>
                    <span className={styles.dot} />
                    {hasDetail ? "Source-backed detail page" : "Catalog listing"}
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
        {currentPage < totalPages && (
          <div className={styles.loadMore}>
            <button
              className={styles.secondary}
              type="button"
              onClick={() => writeState({
                page: currentPage + 1,
                from: compare ? undefined : firstVisiblePage,
              })}
            >
              Show more · {cards.length} of {shown.length} shown
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
                scroll={false}
                onClick={(event) => {
                  if ((!saved && !recentOnly && sort !== "recent") || event.button || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
                  event.preventDefault();
                  writeState({ page: n, from: undefined });
                }}
                aria-label={`Page ${n}`}
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
