"use client";

import { useState } from "react";
import { BellRing, CheckCircle2 } from "lucide-react";
import { subscribeNewsletter } from "@/lib/services/newsletter";

/**
 * Compact email capture shown directly under the hero countdown.
 * Reuses the existing `subscribeNewsletter` server action (stores in
 * private_settings via service-role — never anon-readable).
 *
 * Purpose: bank pre-launch visitors as a day-one audience before the
 * GTA 6 tools (weapons, map, money calculator) go live at game launch.
 */
export function HeroSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    const res = await subscribeNewsletter(email);
    setLoading(false);
    if (res.success) {
      setStatus("success");
      setEmail("");
    } else {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className="mx-auto mt-6 flex h-[52px] max-w-md items-center justify-center gap-2.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 backdrop-blur"
        role="status"
      >
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
        <p className="text-[13px] font-semibold text-emerald-700 dark:text-emerald-300">
          You&apos;re on the list — we&apos;ll ping you when the tools go live.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-6 w-full max-w-md">
      <form
        className="flex h-[52px] items-center gap-2 rounded-full border border-white/15 bg-black/40 py-1.5 pl-5 pr-1.5 backdrop-blur-xl"
        onSubmit={handleSubmit}
        aria-label="Get notified when GTA 6 tools go live"
      >
        <label htmlFor="hero-signup-email" className="sr-only">
          Email address
        </label>
        <input
          id="hero-signup-email"
          type="email"
          required
          autoComplete="email"
          disabled={loading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Get launch-day tool alerts"
          className="h-full min-w-0 flex-1 bg-transparent text-[13px] leading-none text-white placeholder:text-slate-400 focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-full shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 px-5 text-[13px] font-bold text-white transition-all hover:from-sky-400 hover:to-indigo-500 active:scale-95 disabled:opacity-60"
        >
          <BellRing className="h-3.5 w-3.5" aria-hidden="true" />
          {loading ? "Joining…" : "Notify me"}
        </button>
      </form>
      <p className="mt-2 text-center text-[11px] text-slate-500 dark:text-slate-400">
        Weapons, map, money calculator &amp; guides — straight to your inbox. No spam.
      </p>
      {status === "error" && (
        <p role="alert" className="mt-1.5 text-center text-[11px] font-semibold text-red-600 dark:text-red-400">
          Something went wrong — please try again.
        </p>
      )}
    </div>
  );
}
