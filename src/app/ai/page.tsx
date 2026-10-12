import { SiteShell } from "@/components/shells";
import { AIClient } from "./ai-client";
import { Bot } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ask GTA 6 AI — Grounded Intelligence Companion | GTA 6 Atlas",
  description:
    "Ask any question about Grand Theft Auto VI with our beta knowledge-base assistant. Grounded in verified Rockstar trailers, leaks, and disclosures with strict confidence ratings and zero hallucinated facts.",
  alternates: { canonical: "/ai" },
  };

export default function AIPage() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        {/* Header Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-primary mb-3">
            <Bot className="h-3 w-3" /> Grounded Intelligence Assistant
            <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-gold-dark dark:text-gold-light">Beta</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
            ASK <span className="text-primary">GTA 6 AI</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
            Instant answers on verified vehicles, armory stats, safehouses, and heist strategies.
            Every response is strictly grounded in official Rockstar disclosures and validated leak archives.
          </p>
          <p className="mt-2 text-xs text-muted-foreground/80 max-w-2xl">
            Knowledge-base assistant — answers are matched from our verified GTA 6 database, not a live language model.
          </p>
        </div>

        <AIClient />
      </div>
    </SiteShell>
  );
}
