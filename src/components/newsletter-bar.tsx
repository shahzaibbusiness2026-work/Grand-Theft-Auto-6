"use client";

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface NewsletterBarProps {
  title?: string;
  text?: string;
  className?: string;
}

export function NewsletterBar({
  title = "Stay Updated",
  text = "Get the latest mission updates, guides & more.",
  className,
}: NewsletterBarProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setStatus("success");
    setEmail("");
  }

  return (
    <div className={cn("card-surface relative overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-transparent" />
      <div className="relative flex flex-col gap-5 px-6 py-6 md:flex-row md:items-center">
        <span className="icon-tile h-14 w-14 shrink-0 rounded-full border border-primary/50 bg-primary/10 text-primary shadow-neon-cyan" aria-hidden="true">
          <Mail className="h-6 w-6" />
        </span>
        <div className="flex-1">
          <h3 className="font-display text-base font-bold uppercase tracking-wide text-primary">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{text}</p>
        </div>
        {status === "success" ? (
          <div className="flex items-center gap-2 rounded-xl border border-neon-green/40 bg-neon-green/10 px-4 py-3">
            <CheckCircle className="h-4 w-4 text-neon-green" aria-hidden="true" />
            <p className="text-sm font-semibold text-neon-green">Subscribed!</p>
          </div>
        ) : (
          <form className="flex w-full max-w-md gap-2" onSubmit={handleSubmit} aria-label="Newsletter sign-up">
            <div className="flex-1">
              <label htmlFor="newsletter-bar-email" className="sr-only">Email address</label>
              <Input
                id="newsletter-bar-email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>
            <Button type="submit" className="shrink-0" disabled={loading}>
              {loading ? "..." : "Subscribe"} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
