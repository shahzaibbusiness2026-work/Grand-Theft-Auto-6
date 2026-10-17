import { SiteShell } from "@/components/shells";
import { serializeJsonLd } from "@/lib/utils";
import { CharacterQuizClient } from "./character-quiz-client";
import { UserCheck, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Which GTA 6 Character Are You? — Personality Quiz",
  description: "Take the GTA 6 personality quiz and find out which character matches you: Lucia, Jason, Brian, Cal, Boobie, or Raul.",

  alternates: { canonical: "/tools/character-quiz" },
};

export default function CharacterQuizPage() {
  return (
        <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: "https://grand-theft-auto-6-5ap5.vercel.app/" },
                  { "@type": "ListItem", position: 2, name: "Tools", item: "https://grand-theft-auto-6-5ap5.vercel.app/tools" },
                  { "@type": "ListItem", position: 3, name: "Which GTA 6 Character Are You? \u2014 Personality Quiz", item: "https://grand-theft-auto-6-5ap5.vercel.app/tools/character-quiz" },
                ],
              },
              {
                "@type": "WebApplication",
                name: "Which GTA 6 Character Are You? \u2014 Personality Quiz",
                description: "Take the GTA 6 personality quiz and find out which character matches you: Lucia, Jason, Brian, Cal, Boobie, or Raul.",
                url: "https://grand-theft-auto-6-5ap5.vercel.app/tools/character-quiz",
                applicationCategory: "UtilitiesApplication",
                operatingSystem: "Web",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              },
            ],
          }),
        }}
      />
      <div className="container-site py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/tools" className="hover:text-primary transition-colors">Tools</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-bold">Character Quiz</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/40 bg-violet-500/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-violet-400 mb-3">
            <UserCheck className="h-3 w-3" /> Personality Quiz
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
            GTA 6 <span className="text-primary">CHARACTER QUIZ</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Answer 8 quick questions about how you&apos;d survive Vice City and discover which GTA 6 character matches your personality — Lucia, Jason, Brian, Cal, Boobie, or Raul.
          </p>
        </div>

        <CharacterQuizClient />
      </div>
    </SiteShell>
  );
}
