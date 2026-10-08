"use client";

import React from "react";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

/** One comparison row: label, one cell per contender, optional 0-100 bars. */
export interface ComparisonRowDef {
  label: string;
  values: string[];
  bars?: (number | null)[];
  winnerIndex: number | null; // null = tie / unknown
  highlightWinner?: boolean;
}

/** Side-by-side stat table: Statistic | A | B | ... with Winner column. */
export function ComparisonTable({
  contenders,
  rows,
}: {
  contenders: { name: string; color: string }[];
  rows: ComparisonRowDef[];
}) {
  return (
    <div className="card-surface rounded-3xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs" aria-label="Comparison stat table">
          <thead>
            <tr className="border-b border-border text-[11px] text-muted-foreground">
              <th scope="col" className="py-3 px-4 font-bold uppercase tracking-wider">
                Statistic
              </th>
              {contenders.map((c) => (
                <th key={c.name} scope="col" className="py-3 px-4 font-bold uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: c.color }} />
                    {c.name}
                  </span>
                </th>
              ))}
              <th scope="col" className="py-3 px-4 text-right font-bold uppercase tracking-wider">
                Winner
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.label} className="hover:bg-muted/40 transition-colors">
                <td className="py-2.5 px-4 font-semibold text-muted-foreground whitespace-nowrap">{row.label}</td>
                {row.values.map((val, i) => (
                  <td key={i} className="py-2.5 px-4 font-mono font-bold text-foreground whitespace-nowrap">
                    {val}
                    {row.bars && row.bars[i] != null && (
                      <div className="mt-1.5 h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${Math.min(100, Math.max(0, row.bars![i] || 0))}%`, backgroundColor: contenders[i]?.color }}
                        />
                      </div>
                    )}
                  </td>
                ))}
                <td className="py-2.5 px-4 text-right whitespace-nowrap">
                  {row.winnerIndex != null ? (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-black uppercase"
                      )}
                    >
                      <Trophy className="h-2.5 w-2.5" />
                      {contenders[row.winnerIndex]?.name.slice(0, 18)}
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold uppercase text-muted-foreground">Tie</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
