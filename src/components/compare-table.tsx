import { LayoutGrid, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CompareColumn {
  name: string;
  klass: string;
  img?: string;
  filter?: string;
  bg?: string;
  best?: boolean;
  rows: (string | number)[];
}

interface CompareTableProps {
  labels: string[];
  columns: CompareColumn[];
  recommendation: { title: string; text: React.ReactNode };
}

/** Side-by-side stat comparison table (vehicles & weapons). */
export function CompareTable({ labels, columns, recommendation }: CompareTableProps) {
  return (
    <div className="space-y-6">
      <div className="card-surface overflow-x-auto">
        <div className="min-w-[720px]">
          {/* Header row */}
          <div className="grid grid-cols-[160px_repeat(3,1fr)] gap-4 border-b border-border p-5">
            <div className="space-y-2">
              <span className="flex w-full items-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 px-3 py-2 font-display text-[13px] font-bold text-white shadow-neon-cyan">
                <LayoutGrid className="h-3.5 w-3.5" /> Overview
              </span>
            </div>
            {columns.map((c) => (
              <div key={c.name} className="text-center">
                <div className={cn("h-28 overflow-hidden rounded-xl", c.bg ?? "bg-muted")}>
                  {c.img && (
                    <img src={c.img} alt={c.name} style={c.filter ? { filter: c.filter } : undefined} className="h-full w-full object-cover" />
                  )}
                </div>
                <h3 className="mt-3 font-display text-sm font-bold leading-tight">{c.name}</h3>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{c.klass}</p>
              </div>
            ))}
          </div>

          {/* Stat rows */}
          <div className="p-5">
            {labels.map((label, row) => (
              <div key={label} className="grid grid-cols-[160px_repeat(3,1fr)] items-center gap-4 border-b border-border/50 py-3 last:border-0">
                <span className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <span className="h-1 w-1 rounded-full bg-accent" /> {label}
                </span>
                {columns.map((c) => (
                  <div key={c.name} className="text-center">
                    <span className={cn("font-display text-sm font-bold", c.best ? "text-neon-green" : "text-foreground")}>
                      {c.rows[row]}
                    </span>
                    {typeof c.rows[row] === "number" && (
                      <div className="mx-auto mt-1.5 h-1 w-3/4 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn("h-full rounded-full", c.best ? "bg-neon-green" : "bg-gradient-to-r from-primary to-accent")}
                          style={{ width: `${Math.min(100, (c.rows[row] as number) || 30)}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="card-surface flex items-start gap-4 border-accent/40 bg-accent/5 p-5">
        <span className="icon-tile h-12 w-12 shrink-0 rounded-full border border-accent/50 bg-accent/10 text-accent">
          <Trophy className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-display text-sm font-bold">{recommendation.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{recommendation.text}</p>
        </div>
      </div>
    </div>
  );
}
