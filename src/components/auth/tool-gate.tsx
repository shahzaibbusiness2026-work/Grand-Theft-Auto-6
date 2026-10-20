"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { isLoggedIn } from "@/lib/user-store";

/**
 * Members gate for interactive tools.
 *
 * Information pages (articles, vehicles, weapons, map) stay open for SEO
 * and ad traffic. Tools render only for signed-in users; everyone else
 * gets a friendly lock screen with a free signup call-to-action.
 */
export function ToolGate({
  children,
  feature = "this tool",
}: {
  children: React.ReactNode;
  feature?: string;
}) {
  const [state, setState] = useState<"loading" | "in" | "out">("loading");

  useEffect(() => {
    setState(isLoggedIn() ? "in" : "out");
  }, []);

  if (state === "loading") {
    return (
      <div className="py-20 text-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (state === "in") {
    return <>{children}</>;
  }

  return (
    <div className="mx-auto max-w-md py-16 sm:py-20 text-center space-y-5 px-4">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-primary/50 bg-primary/10 shadow-[0_0_24px_rgba(201,168,106,0.25)]">
        <Lock className="h-7 w-7 text-primary" />
      </div>
      <h2 className="font-display text-2xl sm:text-3xl font-black text-foreground tracking-tight">
        Members Only
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {feature} is free for Tahzaib Gaming members. Sign up with just your
        email — it takes 10 seconds — and unlock all 15 tools, your personal
        dashboard, favorites, and progress tracker.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/login"
          className="inline-flex min-h-[44px] items-center rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 shadow-[0_0_20px_rgba(201,168,106,0.35)]"
        >
          Login / Sign Up — Free
        </Link>
        <Link
          href="/tools"
          className="inline-flex min-h-[44px] items-center rounded-full border border-border px-6 py-2.5 text-sm font-bold text-foreground transition-colors hover:border-primary/60"
        >
          Browse All Tools
        </Link>
      </div>
      <p className="text-xs text-muted-foreground/70">
        Reading articles, vehicles, weapons, and the map is always free — no
        account needed.
      </p>
    </div>
  );
}
