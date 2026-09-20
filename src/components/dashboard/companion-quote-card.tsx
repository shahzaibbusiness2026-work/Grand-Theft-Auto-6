"use client";

export function CompanionQuoteCard() {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#0a0f1d]/90 p-6 shadow-xl backdrop-blur-xl">
      {/* Background neon ambient blur */}
      <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-amber-500/10 blur-[60px] pointer-events-none" />

      {/* Quote text */}
      <div className="relative z-10 pt-2">
        <blockquote className="font-serif italic text-base sm:text-lg leading-relaxed text-slate-200">
          &ldquo;A bigger, brighter, wilder world is waiting.&rdquo;
        </blockquote>
        <p className="mt-2 text-xs font-semibold text-slate-400">
          — GTA 6
        </p>
      </div>

      {/* Rockstar Games emblem in bottom right */}
      <div className="relative z-10 flex justify-end pt-4">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] font-black text-xs text-slate-400 select-none shadow-sm hover:text-white transition-colors"
          title="Rockstar Games"
        >
          <span className="font-mono font-black text-[13px] tracking-tighter">
            R<span className="text-amber-400">★</span>
          </span>
        </div>
      </div>
    </div>
  );
}
