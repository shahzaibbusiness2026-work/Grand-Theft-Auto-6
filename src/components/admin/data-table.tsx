"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ChevronRight as RowExpandIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface DataTableProps<T extends { id: string; name?: string; title?: string }> {
  data: T[];
  columns: Column<T>[];
  keyExtractor?: (item: T) => string;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectRow?: (id: string) => void;
  onSelectAll?: (allSelected: boolean) => void;
  bulkActions?: React.ReactNode;
  expandableRowRender?: (item: T) => React.ReactNode;
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
  pageSize?: number;
  emptyState?: React.ReactNode;
  className?: string;
}

export function DataTable<T extends { id: string; name?: string; title?: string }>({
  data,
  columns,
  selectable = false,
  selectedIds = [],
  onSelectRow,
  onSelectAll,
  bulkActions,
  expandableRowRender,
  onRowClick,
  actions,
  pageSize = 10,
  emptyState,
  className,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Sorting
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;
    return [...data].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortConfig.key];
      const bVal = (b as Record<string, unknown>)[sortConfig.key];
      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (sortConfig.direction === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }, [data, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        if (current.direction === "asc") return { key, direction: "desc" };
        return null;
      }
      return { key, direction: "asc" };
    });
  };

  const isAllSelected =
    data.length > 0 && selectedIds.length === data.length;

  const toggleExpand = (id: string, e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Bulk Action Bar (when rows are selected) */}
      {selectable && selectedIds.length > 0 && (
        <div
          role="region"
          aria-label="Bulk actions"
          className="flex items-center justify-between p-3 rounded-xl bg-[var(--admin-primary)]/10 border border-[var(--admin-primary)]/30 text-xs animate-in slide-in-from-top-1"
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--admin-primary)]">
              {selectedIds.length} selected
            </span>
            <span className="text-[var(--admin-text-muted)]" aria-hidden="true">
              •
            </span>
            <button
              type="button"
              onClick={() => onSelectAll?.(false)}
              className="text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)] rounded"
            >
              Clear selection
            </button>
          </div>

          <div className="flex items-center gap-2">{bulkActions}</div>
        </div>
      )}

      {/* Table Container */}
      <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[var(--admin-text)]">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text-muted)]">
                {selectable && (
                  <th scope="col" className="p-3.5 w-10 text-center">
                    <input
                      type="checkbox"
                      aria-label="Select all rows"
                      checked={isAllSelected}
                      onChange={(e) => onSelectAll?.(e.target.checked)}
                      className="rounded border-[var(--admin-border)] bg-[var(--admin-card)] text-[var(--admin-primary)] focus:ring-2 focus:ring-[var(--admin-primary)] focus:ring-offset-1 focus:ring-offset-[var(--admin-bg)]"
                    />
                  </th>
                )}
                {expandableRowRender && <th scope="col" className="p-3.5 w-8" aria-label="Row expansion" />}
                {columns.map((col) => {
                  const isSorted = sortConfig?.key === col.key;
                  const sortDir = isSorted
                    ? sortConfig.direction === "asc"
                      ? "ascending"
                      : "descending"
                    : "none";

                  return (
                    <th
                      key={col.key}
                      scope="col"
                      aria-sort={col.sortable ? sortDir : undefined}
                      tabIndex={col.sortable ? 0 : undefined}
                      role={col.sortable ? "button" : undefined}
                      onClick={() => col.sortable && handleSort(col.key)}
                      onKeyDown={(e) => {
                        if (col.sortable && (e.key === "Enter" || e.key === " ")) {
                          e.preventDefault();
                          handleSort(col.key);
                        }
                      }}
                      className={cn(
                        "p-3.5 font-bold uppercase tracking-wider select-none outline-none",
                        col.sortable &&
                          "cursor-pointer hover:text-[var(--admin-text)] focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)] focus-visible:ring-inset rounded",
                        col.className
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{col.header}</span>
                        {col.sortable && (
                          <span className="text-[10px]" aria-hidden="true">
                            {isSorted ? (
                              sortConfig.direction === "asc" ? (
                                <ChevronUp className="w-3.5 h-3.5 text-[var(--admin-primary)]" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5 text-[var(--admin-primary)]" />
                              )
                            ) : (
                              <ChevronDown className="w-3 h-3 opacity-30" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
                {actions && (
                  <th
                    scope="col"
                    className="p-3.5 w-16 text-right font-bold uppercase tracking-wider"
                  >
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-[var(--admin-border-subtle)]">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      columns.length +
                      (selectable ? 1 : 0) +
                      (expandableRowRender != null ? 1 : 0) +
                      (actions != null ? 1 : 0)
                    }
                    className="p-12 text-center text-[var(--admin-text-muted)]"
                  >
                    {emptyState || "No records found matching your filters."}
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  const isExpanded = expandedRowId === item.id;
                  const rowLabel = item.name || item.title || `Row ${item.id}`;

                  return (
                    <React.Fragment key={item.id}>
                      <tr
                        onClick={() => onRowClick?.(item)}
                        className={cn(
                          "transition-colors group",
                          isSelected
                            ? "bg-[var(--admin-primary)]/5"
                            : "hover:bg-[var(--admin-elevated)]/60",
                          onRowClick && "cursor-pointer"
                        )}
                      >
                        {selectable && (
                          <td
                            className="p-3.5 text-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              aria-label={`Select ${rowLabel}`}
                              checked={isSelected}
                              onChange={() => onSelectRow?.(item.id)}
                              className="rounded border-[var(--admin-border)] bg-[var(--admin-card)] text-[var(--admin-primary)] focus:ring-2 focus:ring-[var(--admin-primary)] focus:ring-offset-1 focus:ring-offset-[var(--admin-bg)]"
                            />
                          </td>
                        )}

                        {expandableRowRender && (
                          <td className="p-3.5 text-center">
                            <button
                              type="button"
                              aria-expanded={isExpanded}
                              aria-controls={`row-details-${item.id}`}
                              aria-label={
                                isExpanded
                                  ? `Collapse details for ${rowLabel}`
                                  : `Expand details for ${rowLabel}`
                              }
                              onClick={(e) => toggleExpand(item.id, e)}
                              className="p-1 rounded text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]"
                            >
                              <RowExpandIcon
                                className={cn(
                                  "w-3.5 h-3.5 transition-transform",
                                  isExpanded && "rotate-90 text-[var(--admin-primary)]"
                                )}
                              />
                            </button>
                          </td>
                        )}

                        {columns.map((col) => (
                          <td key={col.key} className={cn("p-3.5", col.className)}>
                            {col.render
                              ? col.render(item)
                              : (item as Record<string, unknown>)[col.key] != null
                              ? String((item as Record<string, unknown>)[col.key])
                              : "—"}
                          </td>
                        ))}

                        {actions && (
                          <td
                            className="p-3.5 text-right whitespace-nowrap"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {actions(item)}
                          </td>
                        )}
                      </tr>

                      {/* Expanded Row View */}
                      {isExpanded && expandableRowRender && (
                        <tr
                          id={`row-details-${item.id}`}
                          className="bg-[var(--admin-elevated)]/40 border-b border-[var(--admin-border-subtle)]"
                        >
                          <td
                            colSpan={
                              columns.length +
                              (selectable ? 1 : 0) +
                              (expandableRowRender != null ? 1 : 0) +
                              (actions != null ? 1 : 0)
                            }
                            className="p-4 pl-12"
                          >
                            {expandableRowRender(item)}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <nav
          aria-label="Table pagination"
          className="p-4 border-t border-[var(--admin-border)] bg-[var(--admin-surface)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--admin-text-muted)]"
        >
          <div className="flex items-center gap-2">
            <span>
              Showing{" "}
              <strong className="text-[var(--admin-text)]">
                {data.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              </strong>{" "}
              to{" "}
              <strong className="text-[var(--admin-text)]">
                {Math.min(currentPage * pageSize, data.length)}
              </strong>{" "}
              of <strong className="text-[var(--admin-text)]">{data.length}</strong> records
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-card)] text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]"
              aria-label="Go to previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                const isCurrent = currentPage === page;
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    aria-label={`Go to page ${page}`}
                    aria-current={isCurrent ? "page" : undefined}
                    className={cn(
                      "w-8 h-8 rounded-lg font-bold transition-colors text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]",
                      isCurrent
                        ? "bg-[var(--admin-primary)] text-white shadow-sm"
                        : "border border-[var(--admin-border)] bg-[var(--admin-card)] text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)]"
                    )}
                  >
                    {page}
                  </button>
                );
              } else if (
                (page === currentPage - 2 && page > 1) ||
                (page === currentPage + 2 && page < totalPages)
              ) {
                return (
                  <span
                    key={page}
                    className="px-1 text-[var(--admin-text-muted)] select-none"
                    aria-hidden="true"
                  >
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-card)] text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-elevated)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]"
              aria-label="Go to next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
