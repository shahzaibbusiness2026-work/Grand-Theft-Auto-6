"use client";
import { useMemo, useState } from "react";
import type { CatalogKind, EvidenceEntry } from "@/lib/catalog-evidence";
import {
  comparisonGroups,
  claimFor,
  comparisonCsv,
} from "@/lib/comparison-fields";
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
  const groups = useMemo(
    () => comparisonGroups(kind, entries),
    [kind, entries],
  );
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
            .includes(query.toLowerCase())
        );
      }),
    }))
    .filter((g) => g.fields.length);
  const resetFilters = () => {
    setGroup("");
    setQuery("");
    setReviewed(false);
    setDifferences(false);
  };
  const share = async () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("v");
      url.searchParams.delete("w");
      url.searchParams.set("ids", entries.map((e) => e.id).join(","));
      await navigator.clipboard.writeText(url.href);
      setMessage("Comparison link copied.");
    } catch {
      setMessage(
        "Copy is unavailable. You can share the page URL from your address bar.",
      );
    }
  };
  const download = () => {
    const csv = comparisonCsv(
      entries,
      shown.flatMap((g) => g.fields),
    );
    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "taish-" + kind + "-comparison.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("Comparison CSV downloaded.");
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={share}
          className="min-h-11 rounded-lg border border-border px-3 text-sm font-semibold"
        >
          Share comparison
        </button>
        <button
          type="button"
          onClick={download}
          className="min-h-11 rounded-lg border border-border px-3 text-sm font-semibold"
        >
          Download CSV
        </button>
        <button
          type="button"
          onClick={() => {
            onReset();
            resetFilters();
          }}
          className="min-h-11 rounded-lg border border-border px-3 text-sm font-semibold"
        >
          Reset comparison
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          Find a detail
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background p-3"
            placeholder="Speed, attachments, price…"
          />
        </label>
        <label className="text-sm font-semibold">
          Field group
          <select
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background p-3"
          >
            <option value="">
              All details ({groups.reduce((n, g) => n + g.fields.length, 0)})
            </option>
            {groups.map((g) => (
              <option key={g.name}>{g.name}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <label className="inline-flex min-h-11 items-center gap-2">
          <input
            type="checkbox"
            checked={reviewed}
            onChange={(e) => setReviewed(e.target.checked)}
          />
          Reviewed fields only
        </label>
        <label className="inline-flex min-h-11 items-center gap-2">
          <input
            type="checkbox"
            checked={differences}
            onChange={(e) => setDifferences(e.target.checked)}
          />
          Hide matching reviewed values
        </label>
      </div>
      <p className="text-xs text-muted-foreground">
        Missing evidence stays visible as “Not verified”. It does not produce a
        winner. Expand a group for more details; swipe its table sideways on a
        small screen.
      </p>
      <p role="status" className="text-sm">
        {message}
      </p>
      {shown.map((g, index) => (
        <details
          key={g.name}
          open={index === 0}
          className="rounded-xl border border-border"
        >
          <summary className="min-h-11 cursor-pointer p-4 font-bold">
            {g.name}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              ({g.fields.length} fields)
            </span>
          </summary>
          <div
            role="region"
            aria-label={g.name + " comparison table"}
            tabIndex={0}
            className="max-w-full overflow-x-auto rounded-b-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            <table className="w-full min-w-[580px] text-left text-sm">
              <caption className="sr-only">
                {g.name}: reviewed sources for selected {kind}
              </caption>
              <thead>
                <tr className="bg-muted/40">
                  <th scope="col" className="w-40 p-3">
                    Detail
                  </th>
                  {entries.map((e) => (
                    <th
                      scope="col"
                      key={e.id}
                      className="min-w-44 p-3 align-top"
                    >
                      {e.name}
                      <button
                        type="button"
                        onClick={() => onRemove(e.id)}
                        className="block min-h-11 text-xs font-normal underline"
                      >
                        Remove {e.name}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {g.fields.map((field) => (
                  <tr key={field} className="border-t border-border">
                    <th scope="row" className="p-3 align-top">
                      {field}
                    </th>
                    {entries.map((e) => {
                      const c = claimFor(e, field);
                      return (
                        <td key={e.id} className="p-3 align-top">
                          {c ? (
                            <>
                              <p>{c.value}</p>
                              <details className="mt-2">
                                <summary className="min-h-11 cursor-pointer text-xs underline">
                                  Source & review
                                </summary>
                                <a
                                  className="block break-words text-xs underline"
                                  href={c.source}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {c.locator}
                                </a>
                                <p className="mt-2 text-xs text-muted-foreground">
                                  {c.reviewer} · {c.reviewedAt}
                                </p>
                              </details>
                            </>
                          ) : (
                            "Not verified"
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
        <div className="rounded-xl border border-border p-5">
          <p>No fields match the current filters.</p>
          <button
            type="button"
            onClick={resetFilters}
            className="min-h-11 underline"
          >
            Show all details
          </button>
        </div>
      )}
    </div>
  );
}
