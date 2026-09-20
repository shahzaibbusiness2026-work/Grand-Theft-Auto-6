import { SiteShell } from "@/components/shells";
import { AIClient } from "./ai-client";
import { Bot, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ask GTA 6 AI — Grounded Intelligence Companion | GTA 6 Atlas",
  description:
    "Ask any question about Grand Theft Auto VI. Grounded in verified Rockstar trailers, leaks, and disclosures with strict confidence ratings and zero hallucinated facts.",
};

export default function AIPage() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        {/* Header Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary mb-3">
            <Bot className="h-3 w-3" /> Grounded Intelligence Assistant
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            ASK <span className="bg-gradient-to-r from-primary via-accent to-amber-400 bg-clip-text text-transparent">GTA 6 AI</span>
          </h1>
          <p className="mt-3 text-sm text-slate-300 max-w-2xl">
            Instant answers on verified vehicles, armory stats, safehouses, and heist strategies.
            Every response is strictly grounded in official Rockstar disclosures and validated leak archives.
          </p>
        </div>

        <AIClient />
      </div>
    </SiteShell>
  );
}
