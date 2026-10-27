"use client";
import { useState } from "react";
export function MoneyMakerClient() {
  const [rows, setRows] = useState([
    { id: "a", name: "Scenario A", gross: 30000, cost: 5000, minutes: 30 },
    { id: "b", name: "Scenario B", gross: 50000, cost: 10000, minutes: 60 },
  ]);
  const scored = rows
    .map((r) => ({
      ...r,
      rate: r.minutes > 0 ? ((r.gross - r.cost) * 60) / r.minutes : null,
    }))
    .sort((a, b) => (b.rate ?? -Infinity) - (a.rate ?? -Infinity));
  const set = (id: string, key: string, value: string | number) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
  return (
    <div className="space-y-6">
      <p className="rounded-xl border border-border p-5">
        These are editable arithmetic examples, not verified GTA VI activities
        or payouts. Results depend entirely on your assumptions and omit travel,
        cooldowns and failures unless you include them in the time and costs.
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        {rows.map((r) => (
          <section
            key={r.id}
            className="rounded-2xl border border-border bg-card p-5 space-y-4"
          >
            <h2 className="text-xl font-bold">{r.name}</h2>
            <label className="block text-sm">
              Scenario name
              <input
                className="block w-full rounded-lg border border-border bg-background p-3"
                value={r.name}
                onChange={(e) => set(r.id, "name", e.target.value)}
              />
            </label>
            {(["gross", "cost", "minutes"] as const).map((key) => (
              <label key={key} className="block text-sm">
                {key === "gross"
                  ? "Gross payout ($)"
                  : key === "cost"
                    ? "Costs per run ($)"
                    : "Total minutes per run"}
                <input
                  className="block w-full rounded-lg border border-border bg-background p-3"
                  type="number"
                  min="0"
                  max="1000000000"
                  value={r[key]}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    set(
                      r.id,
                      key,
                      Number.isFinite(n) ? Math.max(0, Math.min(n, 1e9)) : 0,
                    );
                  }}
                />
              </label>
            ))}
          </section>
        ))}
      </div>
      <section
        aria-label="Scenario results"
        className="rounded-xl border border-border p-5 space-y-4"
      >
        <h2 className="text-xl font-bold">Net return using your inputs</h2>
        {scored.map((r) => (
          <p key={r.id}>
            <strong>{r.name}:</strong>{" "}
            {r.rate === null
              ? "Enter a positive duration"
              : new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                }).format(r.rate) + " per hour"}
          </p>
        ))}
        <p className="text-sm text-muted-foreground">
          A zero duration has no defined hourly rate. A loss remains negative.
        </p>
      </section>
    </div>
  );
}
