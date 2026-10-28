"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Download,
  ExternalLink,
  Minus,
  RotateCcw,
  Share2,
} from "lucide-react";
import type { CatalogKind, EvidenceEntry } from "@/lib/catalog-evidence";
import {
  comparisonGroups,
  claimFor,
  comparisonCsv,
} from "@/lib/comparison-fields";
import { selectionUrl } from "@/lib/catalog-selection";
import styles from "./catalog-ui.module.css";

export function EvidenceComparison({
  kind,
  entries,
  onRemove,
  onReset,
}: {
  kind: CatalogKind;
  entries: EvidenceEntry[];
  onRemove: (id: string) => void;
  onReset: () => void;
}) {
  const [group, setGroup] = useState("");
  const [query, setQuery] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [differences, setDifferences] = useState(false);
  const [message, setMessage] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [expanded, setExpanded] = useState(["Identity & appearance"]);
  const selectionKey = entries.map((entry) => entry.id).join(",");
  useEffect(() => {
    setShareLink("");
    setMessage("");
  }, [selectionKey]);
  const groups = useMemo(
    () => comparisonGroups(kind, entries),
    [kind, entries],
  );
  useEffect(() => {
    if (query || group || reviewed) setExpanded(groups.map((g) => g.name));
  }, [query, group, reviewed, groups]);
  const shown = groups
    .filter((g) => !group || g.name === group)
    .map((g) => ({
      ...g,
      fields: g.fields.filter((field) => {
        const claims = entries.map((e) => claimFor(e, field));
        if (reviewed && !claims.some(Boolean)) return false;
        if (
          differences &&
          entries.length > 1 &&
          claims.every(Boolean) &&
          new Set(claims.map((c) => c?.value)).size === 1
        )
          return false;
        return (
          !query ||
          [field, ...claims.map((c) => c?.value || "Not verified")]
            .join(" ")
            .toLowerCase()
            .includes(query.trim().toLowerCase())
        );
      }),
    }))
    .filter((g) => g.fields.length);
  const fieldCount = groups.reduce((n, g) => n + g.fields.length, 0);
  const visibleCount = shown.reduce((n, g) => n + g.fields.length, 0);
  const resetFilters = () => {
    setGroup("");
    setQuery("");
    setReviewed(false);
    setDifferences(false);
    setExpanded(["Identity & appearance"]);
  };
  const share = async () => {
    const url = selectionUrl(
      new URL(window.location.href),
      entries.map((e) => e.id),
    );
    url.hash = "";
    setShareLink(url.href);
    try {
      await navigator.clipboard.writeText(url.href);
      setMessage("Comparison link copied.");
    } catch {
      setMessage("Select and copy the comparison link below.");
    }
  };
  // A real download link supports keyboard activation and Save link as.
  // The small four-item export needs no short-lived blob URL or extra request.
  const downloadHref =
    "data:text/csv;charset=utf-8,%EF%BB%BF" +
    encodeURIComponent(
      comparisonCsv(
        entries,
        shown.flatMap((g) => g.fields),
      ),
    );
  return (
    <section aria-labelledby="comparison-details-heading">
      <div className={styles.detailsHeader}>
        <div>
          <h2 id="comparison-details-heading">The details, side by side.</h2>
          <p>
            {fieldCount} comparison fields · {entries.length} selected {kind}
          </p>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.secondary} onClick={share}>
            <Share2 size={14} aria-hidden="true" />
            Share comparison
          </button>
          <a
            className={styles.secondary}
            href={downloadHref}
            download={"taish-" + kind + "-comparison.csv"}
            onClick={() =>
              setMessage(
                `Export requested with ${visibleCount} visible fields and their source reviews.`,
              )
            }
          >
            <Download size={14} aria-hidden="true" />
            Download CSV
          </a>
          <button
            type="button"
            className={styles.secondary}
            onClick={() => {
              onReset();
              resetFilters();
            }}
          >
            <RotateCcw size={14} aria-hidden="true" />
            Reset comparison
          </button>
        </div>
      </div>
      <div className={styles.detailTools}>
        <label>
          Find a detail
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.input}
            placeholder={
              kind === "vehicles"
                ? "Speed, engine, price, customization…"
                : "Damage, reload, attachments, price…"
            }
          />
        </label>
        <label>
          Field group
          <select
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className={styles.select}
          >
            <option value="">All details ({fieldCount})</option>
            {groups.map((g) => (
              <option key={g.name} value={g.name}>
                {g.name} ({g.fields.length})
              </option>
            ))}
          </select>
        </label>
        <div className={styles.detailChecks}>
          <label className={styles.check}>
            <input
              type="checkbox"
              checked={reviewed}
              onChange={(e) => setReviewed(e.target.checked)}
            />
            Reviewed fields only
          </label>
          <label className={styles.check}>
            <input
              type="checkbox"
              checked={differences}
              onChange={(e) => setDifferences(e.target.checked)}
            />
            Hide matching reviewed values
          </label>
          <button
            type="button"
            className={styles.textButton}
            onClick={resetFilters}
          >
            Clear filters
          </button>
        </div>
      </div>
      <p role="status" className={styles.status}>
        {message}
      </p>
      {shareLink && (
        <label className="mt-3 block text-xs font-semibold">
          Comparison link
          <input
            className={styles.input}
            readOnly
            value={shareLink}
            onFocus={(e) => e.currentTarget.select()}
          />
        </label>
      )}
      <div className={styles.groupActions}>
        <p>
          {visibleCount} of {fieldCount} fields · Unknown values stay “Not
          verified”.
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.textButton}
            onClick={() => setExpanded(groups.map((g) => g.name))}
          >
            Expand all
          </button>
          <button
            type="button"
            className={styles.textButton}
            onClick={() => setExpanded([])}
          >
            Collapse all
          </button>
        </div>
      </div>
      {shown.map((g) => (
        <details
          key={g.name}
          className={styles.tableGroup}
          open={expanded.includes(g.name)}
        >
          <summary
            className={styles.groupSummary}
            onClick={(event) => {
              event.preventDefault();
              setExpanded((previous) =>
                previous.includes(g.name)
                  ? previous.filter((name) => name !== g.name)
                  : [...previous, g.name],
              );
            }}
          >
            <span>{g.name}</span>
            <span className={styles.fieldCount}>{g.fields.length} fields</span>
            <ChevronDown size={17} aria-hidden="true" />
          </summary>
          <div
            role="region"
            aria-label={g.name + " comparison table"}
            tabIndex={0}
            className={styles.tableRegion}
          >
            <table className={styles.table}>
              <caption className="sr-only">
                {g.name}: reviewed sources for selected {kind}. Scroll
                horizontally to view all selections.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Detail</th>
                  {entries.map((e) => (
                    <th scope="col" key={e.id}>
                      <Link href={`/${kind}/${e.slug}`}>{e.name}</Link>
                      <button
                        type="button"
                        className={styles.textButton}
                        onClick={() => onRemove(e.id)}
                        aria-label={`Remove ${e.name} from ${g.name} comparison`}
                      >
                        Remove
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {g.fields.map((field) => (
                  <tr key={field}>
                    <th scope="row">{field}</th>
                    {entries.map((e) => {
                      const c = claimFor(e, field);
                      return (
                        <td key={e.id}>
                          {c ? (
                            <>
                              <p>{c.value}</p>
                              <details className={styles.source}>
                                <summary>Source & review</summary>
                                <a
                                  href={c.source}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {c.locator}
                                  <ExternalLink size={11} aria-hidden="true" />
                                </a>
                                <p>
                                  {c.reviewer} · {c.reviewedAt}
                                </p>
                              </details>
                            </>
                          ) : (
                            <span className={styles.unverified}>
                              <Minus size={12} aria-hidden="true" />
                              Not verified
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      ))}
      {!shown.length && (
        <div className={styles.empty}>
          <h3>No fields match these filters</h3>
          <p>
            Unknown values are never treated as confirmed matches or used to
            declare a winner.
          </p>
          <button
            type="button"
            className={styles.secondary}
            onClick={resetFilters}
          >
            Show all details
          </button>
        </div>
      )}
      <p className={styles.status}>
        Swipe a table sideways on mobile to see every selection. Open “Source &
        review” for the evidence behind a published value.
      </p>
    </section>
  );
}
