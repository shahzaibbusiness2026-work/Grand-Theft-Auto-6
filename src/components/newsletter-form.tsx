"use client";

import { useState } from "react";
import { ArrowRight, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { subscribeNewsletter } from "@/lib/services/newsletter";

/**
 * Newsletter subscription form with proper success/error state feedback.
 * Persists email subscriptions to Supabase site_settings.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
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
      <div className="mt-7 flex max-w-md items-center gap-3 rounded-xl border border-neon-green/40 bg-neon-green/10 px-5 py-4">
        <CheckCircle className="h-5 w-5 shrink-0 text-neon-green" aria-hidden="true" />
        <p className="text-sm font-semibold text-neon-green">
          You&apos;re subscribed! Welcome to the Atlas community.
        </p>
      </div>
    );
  }

  return (
    <form
      className="mt-7 flex max-w-md flex-col gap-2 sm:flex-row"
      onSubmit={handleSubmit}
      aria-label="Newsletter subscription form"
    >
      <div className="relative flex-1">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          id="newsletter-email"
          type="email"
          placeholder="Enter your email address"
          className="h-12 pl-9"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          disabled={loading}
        />
      </div>
      <Button type="submit" size="lg" className="shrink-0" disabled={loading}>
        {loading ? "Subscribing…" : "Subscribe Now"} <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Button>
      {status === "error" && (
        <p role="alert" className="mt-1 text-xs text-destructive">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
