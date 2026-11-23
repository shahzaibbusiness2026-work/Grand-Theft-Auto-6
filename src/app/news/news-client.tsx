"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Mail } from "lucide-react";
import { subscribeNewsletter } from "@/lib/services/newsletter";

/* Dark magenta newsletter card for the news sidebar (mockup). Same
   subscribe action as the site-wide NewsletterBar, so sign-ups work. */
export function NewsSidebarNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const res = await subscribeNewsletter(email);
    setLoading(false);
    if (res.success) {
      setMessage(
        res.message || "Check your email to confirm your subscription.",
      );
      setStatus("success");
      setEmail("");
    } else {
      setStatus("error");
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-[#2b1837] p-5 text-white">
      <h3 className="flex items-start gap-3 font-display text-xl font-extrabold leading-tight">
        <Mail className="mt-0.5 h-6 w-6 shrink-0 text-pink-300" aria-hidden="true" />
        Get the Latest Gaming News
      </h3>
      <p className="mt-2 text-[13px] leading-relaxed text-white/80">
        Subscribe to Taish Gaming and never miss a GTA 6 update, leak, or
        major announcement.
      </p>
      {status === "success" ? (
        <p className="mt-4 flex items-start gap-2 rounded-xl bg-white/10 px-3 py-3 text-sm font-semibold">
          <CheckCircle
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          {message}
        </p>
      ) : (
        <form
          className="mt-4"
          onSubmit={handleSubmit}
          aria-label="Newsletter sign-up"
        >
          <label htmlFor="news-sidebar-email" className="sr-only">
            Email address
          </label>
          <input
            id="news-sidebar-email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={loading}
            className="h-11 w-full rounded-lg bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[#ff2e9a]"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-2.5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#c70062] text-sm font-bold text-white transition-colors hover:bg-[#a90053] disabled:opacity-60"
          >
            {loading ? "..." : "Subscribe"}{" "}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
          {status === "error" && (
            <p className="mt-2 text-xs font-semibold text-rose-200">
              Something went wrong — please try again.
            </p>
          )}
        </form>
      )}
    </div>
  );
}
