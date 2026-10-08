"use client";

import { useState } from "react";
import { Mail, CheckCircle2, BellRing } from "lucide-react";
import { subscribeNewsletter } from "@/lib/services/newsletter";

/**
 * Email capture shown directly under the hero countdown.
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
        className="mx-auto mt-6 flex w-full max-w-md items-center justify-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4"
        role="status"
      >
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
          You&apos;re on the list — we&apos;ll notify you at launch.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-6 w-full max-w-md">
      <form
        onSubmit={handleSubmit}
        aria-label="Get notified when GTA 6 tools go live"
        className="flex items-center gap-2 rounded-2xl border border-border bg-card p-2 pl-4 shadow-sm transition-shadow focus-within:shadow-md focus-within:border-primary/50"
      >
        <Mail className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
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
          placeholder="Enter your email address"
          className="h-10 min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-hover active:scale-95 disabled:opacity-60"
        >
          <BellRing className="h-4 w-4" aria-hidden="true" />
          {loading ? "Joining…" : "Notify me"}
        </button>
      </form>
      <p className="mt-2.5 text-center text-xs leading-relaxed text-muted-foreground">
        Be first to know when the weapons database, interactive map and money
        calculator go live. No spam, unsubscribe anytime.
      </p>
      {status === "error" && (
        <p role="alert" className="mt-1.5 text-center text-xs font-semibold text-red-600 dark:text-red-400">
          Something went wrong — please try again.
        </p>
      )}
    </div>
  );
}
