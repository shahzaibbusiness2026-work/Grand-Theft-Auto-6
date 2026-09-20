"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, Send } from "lucide-react";

const SUGGESTIONS = [
  "Best money method?",
  "What should I do next?",
  "Where are collectibles near me?",
  "Which vehicle is worth buying?",
];

export function CompanionAiCard() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    router.push(`/ai?q=${encodeURIComponent(query.trim())}`);
  };

  const handleChipClick = (text: string) => {
    setQuery(text);
    router.push(`/ai?q=${encodeURIComponent(text)}`);
  };

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0a0f1d]/90 p-5 sm:p-6 shadow-xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display text-sm font-extrabold uppercase tracking-wider text-white">
            ASK GTA 6 AI
          </h3>
          <p className="text-xs text-slate-400">
            Get quick answers, tips, and personalized recommendations.
          </p>
        </div>
      </div>

      {/* Query Input form */}
      <form onSubmit={handleSubmit} className="my-3">
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you want to know about GTA 6?"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-4 pr-12 text-xs text-white placeholder:text-slate-500 shadow-inner focus:border-amber-500/50 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.35)] transition-all hover:brightness-105 active:scale-95"
            aria-label="Submit query"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>

      {/* Suggestion Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {SUGGESTIONS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => handleChipClick(chip)}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-semibold text-slate-300 transition-all hover:border-[#00F0FF]/40 hover:bg-[#00F0FF]/10 hover:text-white active:scale-95"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
