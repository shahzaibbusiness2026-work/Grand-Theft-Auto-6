"use client";

import { useState, useMemo } from "react";
import {
  Users,
  Plus,
  Trash2,
  Scale,
  Copy,
  Check,
  AlertTriangle,
  Trophy,
  HandCoins,
  RotateCcw,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Member = { id: number; name: string; cut: number };

const HEIST_PRESETS = [
  { label: "Pacific Standard — $1,250,000", take: 1250000 },
  { label: "Diamond Casino — $2,100,000", take: 2100000 },
  { label: "Cayo Perico — $1,800,000", take: 1800000 },
];

const MAX_MEMBERS = 6;
const MIN_MEMBERS = 2;

export function HeistPayoutSplitterClient() {
  const [take, setTake] = useState<number>(1250000);
  const [members, setMembers] = useState<Member[]>([
    { id: 1, name: "Player 1", cut: 50 },
    { id: 2, name: "Player 2", cut: 50 },
  ]);
  const [nextId, setNextId] = useState(3);
  const [copied, setCopied] = useState(false);

  const totalCut = useMemo(() => {
    const sum = members.reduce((acc, m) => acc + (Number.isFinite(m.cut) ? m.cut : 0), 0);
    return Math.round(sum * 10) / 10;
  }, [members]);

  const isBalanced = totalCut === 100;

  const activePresetLabel = useMemo(() => {
    const preset = HEIST_PRESETS.find((p) => p.take === take);
    return preset ? preset.label : "Custom";
  }, [take]);

  const results = useMemo(() => {
    const highestPayout = Math.max(...members.map((m) => (take * m.cut) / 100));
    return members.map((m) => {
      const payout = (take * m.cut) / 100;
      return { ...m, payout, isHighest: payout === highestPayout && payout > 0 };
    });
  }, [members, take]);

  const updateMember = (id: number, patch: Partial<Member>) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  };

  const setCut = (id: number, value: number) => {
    const clamped = Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));
    updateMember(id, { cut: clamped });
  };

  const addMember = () => {
    if (members.length >= MAX_MEMBERS) return;
    setMembers((prev) => [...prev, { id: nextId, name: `Player ${nextId}`, cut: 0 }]);
    setNextId((n) => n + 1);
  };

  const removeMember = (id: number) => {
    if (members.length <= MIN_MEMBERS) return;
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const distributeEvenly = () => {
    const n = members.length;
    if (n === 0) return;
    const each = Math.floor((100 / n) * 10) / 10;
    const remainder = Math.round((100 - each * n) * 10) / 10;
    setMembers((prev) =>
      prev.map((m, i) => ({
        ...m,
        cut: i === prev.length - 1 ? Math.round((each + remainder) * 10) / 10 : each,
      }))
    );
  };

  const handleReset = () => {
    setTake(1250000);
    setMembers([
      { id: 1, name: "Player 1", cut: 50 },
      { id: 2, name: "Player 2", cut: 50 },
    ]);
    setNextId(3);
  };

  const handleCopySummary = () => {
    const lines = results.map(
      (r) => `- ${r.name}: $${Math.round(r.payout).toLocaleString()} (${r.cut}%)`
    );
    const summary = `GTA 6 Heist Payout Split (estimates)
Heist: ${activePresetLabel}
Total Take: $${take.toLocaleString()} (est.)
Cuts total: ${totalCut}%
${lines.join("\n")}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10">
      {/* Heist Presets Bar */}
      <div className="card-surface p-4 rounded-2xl border border-border flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-2 flex items-center gap-1">
          <HandCoins className="h-3.5 w-3.5 text-gold-light" /> Heist Presets:
        </span>
        {HEIST_PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => setTake(p.take)}
            className={cn(
              "min-h-[44px] rounded-xl px-3 py-1.5 text-xs font-semibold transition-all border",
              take === p.take
                ? "border-accent bg-accent/20 text-foreground font-bold shadow-sm"
                : "border-border bg-muted/60 text-muted-foreground hover:border-border hover:text-foreground"
            )}
          >
            {p.label}
          </button>
        ))}
        <span
          className={cn(
            "rounded-xl px-3 py-1.5 text-xs font-bold border",
            activePresetLabel === "Custom"
              ? "border-gold/40 bg-gold/10 text-gold-light"
              : "border-border bg-muted/60 text-muted-foreground"
          )}
        >
          Custom
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* INPUTS COLUMN (5 cols) */}
        <div className="lg:col-span-5 card-surface p-6 rounded-3xl border border-border shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h2 className="font-display text-base font-black uppercase text-foreground flex items-center gap-2">
              <HandCoins className="h-4 w-4 text-accent" /> Heist Details
            </h2>
            <button
              onClick={handleReset}
              className="min-h-[44px] inline-flex items-center px-3 text-xs text-muted-foreground hover:text-foreground gap-1 transition-colors"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>

          {/* Total Take */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5 flex justify-between">
              <span>Total Heist Take ($, est.)</span>
              <span className="font-mono text-emerald-400 font-bold">${take.toLocaleString()}</span>
            </label>
            <input
              type="number"
              min={0}
              step={50000}
              value={take}
              onChange={(e) => setTake(Math.max(0, Number(e.target.value)))}
              className="w-full rounded-xl border border-border bg-muted/70 p-3 text-sm font-mono text-foreground focus:border-accent focus:outline-none"
            />
          </div>

          {/* Crew Members */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-gold-light" /> Crew Members ({members.length}/{MAX_MEMBERS})
              </span>
              <button
                onClick={addMember}
                disabled={members.length >= MAX_MEMBERS}
                className="min-h-[44px] inline-flex items-center gap-1 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 text-xs font-bold text-emerald-400 transition-all hover:bg-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="h-3.5 w-3.5" /> Add Member
              </button>
            </div>

            <div className="space-y-4">
              {members.map((m) => (
                <div key={m.id} className="rounded-2xl border border-border bg-muted/60 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={m.name}
                      maxLength={24}
                      onChange={(e) => updateMember(m.id, { name: e.target.value })}
                      placeholder="Crew member name"
                      className="flex-1 min-w-0 rounded-xl border border-border bg-muted/70 p-3 text-sm font-semibold text-foreground focus:border-accent focus:outline-none"
                    />
                    {members.length > MIN_MEMBERS && (
                      <button
                        onClick={() => removeMember(m.id)}
                        aria-label={`Remove ${m.name}`}
                        className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-red-500/50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-muted-foreground">Cut %</span>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        value={m.cut}
                        onChange={(e) => setCut(m.id, Number(e.target.value))}
                        className="w-20 rounded-lg border border-border bg-muted/70 p-2 text-sm font-mono font-bold text-foreground text-right focus:border-accent focus:outline-none"
                      />
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={m.cut}
                      onChange={(e) => setCut(m.id, Number(e.target.value))}
                      className="w-full accent-gold py-3"
                      aria-label={`${m.name} cut percentage`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Distribute evenly */}
          <Button
            onClick={distributeEvenly}
            variant="outline"
            className="w-full min-h-[44px] text-xs font-bold"
          >
            <Scale className="h-3.5 w-3.5 mr-1" /> Distribute Evenly ({members.length} members)
          </Button>
        </div>

        {/* OUTPUTS COLUMN (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Validation banner */}
          {!isBalanced && (
            <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold text-foreground">
                  Cuts total {totalCut}% — they must equal 100%
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  Adjust the sliders above or hit &ldquo;Distribute Evenly&rdquo; before locking in the split.
                </p>
              </div>
            </div>
          )}

          {/* Results Card */}
          <div className="card-surface p-6 rounded-3xl border border-border shadow-2xl">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-border">
              <div>
                <span className="text-xs uppercase font-bold text-muted-foreground">Total Take (est.)</span>
                <div className="font-display text-3xl sm:text-4xl font-black text-foreground mt-0.5">
                  ${take.toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <span
                  className={cn(
                    "font-mono text-2xl font-black",
                    isBalanced ? "text-emerald-400" : "text-amber-400"
                  )}
                >
                  {totalCut}%
                </span>
                <span className="block text-xs uppercase font-bold text-muted-foreground">Cuts Total</span>
              </div>
            </div>

            {/* Member payout cards */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {results.map((r) => (
                <div
                  key={r.id}
                  className={cn(
                    "rounded-2xl border p-4 transition-all",
                    r.isHighest
                      ? "border-gold/40 bg-gold/10 shadow-lg"
                      : "border-border bg-muted/60"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-sm font-bold text-foreground truncate">
                      {r.name || `Player ${r.id}`}
                    </span>
                    {r.isHighest && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 border border-gold/40 px-2 py-0.5 text-xs font-black text-gold-light uppercase tracking-wider shrink-0">
                        <Trophy className="h-3 w-3" /> Top Cut
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-2xl font-black text-foreground mt-1">
                    ${Math.round(r.payout).toLocaleString()}
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">
                    {r.cut}% of the take (est.)
                  </span>
                </div>
              ))}
            </div>

            {/* Copy action */}
            <div className="mt-6 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
              <Button
                onClick={handleCopySummary}
                className="bg-muted/50 hover:bg-muted/60 text-foreground text-xs font-bold min-h-[44px]"
              >
                {copied ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                <span>{copied ? "Split Copied!" : "Copy Results"}</span>
              </Button>
              <span className="text-xs text-muted-foreground">
                {isBalanced ? "Cuts are balanced — ready to lock in." : "Waiting for cuts to total 100%."}
              </span>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="card-surface p-6 rounded-3xl border border-border">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-gold-light" /> Good To Know
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              All heist takes and payout figures are <strong>estimates</strong> based on prior GTA Online heist
              values and announced GTA 6 content — actual payouts may differ at launch. Lester&apos;s cut
              and setup costs are not included, so treat these numbers as a starting point for your crew agreement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
