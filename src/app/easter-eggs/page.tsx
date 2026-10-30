import Link from "next/link";
import { SiteShell } from "@/components/shells";
import type { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: { url: "/easter-eggs" },
  title: "GTA 6 Easter Eggs: Correction Notice",
  description: "The earlier Taish Gaming Easter egg list has been withdrawn pending source-level verification of its claims.",
  alternates: { canonical: "/easter-eggs" },
  robots: { index: false, follow: true },
};

type Egg = { title: string; desc: string; status: "Withdrawn"; source: string };

const EGGS: Egg[] = [
  {
    title: "Previous list withdrawn",
    desc: "The earlier catalog named supposed references, locations, and trailer details without enough precise, independently reviewable evidence for each claim. Those entries are withdrawn. This page will return to search only after each item has a direct source and a careful verification.",
    status: "Withdrawn",
    source: "Taish Gaming correction log · October 30, 2026",
  },
];

const STATUS_STYLE: Record<Egg["status"], string> = {
  Withdrawn: "bg-amber-500/15 text-amber-400 border-amber-500/40",
};
export default function EasterEggsPage() {
  return (
    <SiteShell>
      <div className="container-site py-8">
        <div className="max-w-3xl mb-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">
            Hidden Details
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-foreground mt-2">
            Easter Eggs
          </h1>
          <p className="text-foreground/70 mt-3">
            This fan catalog is not currently making verified easter egg claims.
            Earlier entries have been withdrawn pending source-level review.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {EGGS.map((egg) => (
            <article
              key={egg.title}
              className="rounded-xl border border-white/10 bg-black/20 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-bold text-lg leading-snug">{egg.title}</h2>
                <span
                  className={`shrink-0 text-xs font-black px-2 py-1 rounded-full border ${STATUS_STYLE[egg.status]}`}
                >
                  {egg.status}
                </span>
              </div>
              <p className="text-sm text-foreground/70 mt-2 leading-relaxed">
                {egg.desc}
              </p>
              <p className="text-xs text-foreground/50 mt-3">
                Source: {egg.source}
              </p>
            </article>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-8">
          Browse our{" "}
          <Link href="/news" className="text-primary font-bold underline">
            published news and source reviews
          </Link>
          , or explore the{" "}
          <Link href="/map" className="text-primary font-bold underline">
            fan map
          </Link>
          . Exact locations and activity requirements need their own evidence.
        </p>
      </div>
    </SiteShell>
  );
}
