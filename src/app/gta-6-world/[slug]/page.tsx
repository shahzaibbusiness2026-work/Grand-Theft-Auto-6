import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { SiteShell } from "@/components/shells";
import {
  WORLD_CATEGORIES,
  WORLD_SECTIONS,
  getWorldCategory,
  type EvidenceTier,
} from "@/lib/gta-world";
import { serializeJsonLd } from "@/lib/utils";
import { SafeImage } from "@/components/safe-image";

export function generateStaticParams() {
  return WORLD_CATEGORIES.map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getWorldCategory(slug);
  if (!category) notFound();
  return {
    openGraph: { url: `/gta-6-world/${category.slug}` },
    title: category.seoTitle,
    description: category.seoDescription,
    alternates: { canonical: `/gta-6-world/${category.slug}` },
  };
}

const TIER_STYLES: Record<EvidenceTier, string> = {
  "Rockstar confirmed":
    "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  "Observed in official media":
    "border-cyan-400/40 bg-cyan-400/10 text-cyan-300",
  "Community identification":
    "border-amber-400/40 bg-amber-400/10 text-amber-300",
};

function sectionColorFor(slug: string): string {
  const href = `/gta-6-world/${slug}`;
  const section = WORLD_SECTIONS.find((s) =>
    s.cards.some((c) => c.href === href),
  );
  return section?.color ?? "#F13AAE";
}

export default async function GTAWorldCategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getWorldCategory(slug);
  if (!category) notFound();
  const accent = sectionColorFor(category.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.taishgaming.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "GTA VI World",
        item: "https://www.taishgaming.com/gta-6-world",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.title,
        item: `https://www.taishgaming.com/gta-6-world/${category.slug}`,
      },
    ],
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <div className="bg-[#000713] text-white">
        <div className="container-site py-8">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-white/60"
          >
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href="/gta-6-world"
              className="transition-colors hover:text-white"
            >
              GTA VI World
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-white">{category.title}</span>
          </nav>

          <header className="max-w-3xl">
            <p
              className="text-xs font-black uppercase tracking-[0.22em]"
              style={{ color: accent }}
            >
              GTA VI World
            </p>
            <h1 className="mt-2 font-display text-3xl font-black leading-tight sm:text-4xl">
              {category.title}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-white/75">
              {category.intro}
            </p>
          </header>

          <figure className="mt-6 overflow-hidden rounded-2xl border border-white/10">
            <SafeImage
              src={category.image}
              alt={category.imageAlt}
              width={1200}
              height={675}
              className="h-auto w-full object-cover"
            />
          </figure>

          <div className="mt-6 flex flex-wrap gap-2" aria-label="Evidence key">
            {(Object.keys(TIER_STYLES) as EvidenceTier[]).map((tier) => (
              <span
                key={tier}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${TIER_STYLES[tier]}`}
              >
                {tier}
              </span>
            ))}
          </div>

          {category.entries.length > 0 && (
            <section aria-label={`${category.title} entries`} className="mt-8">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {category.entries.map((entry) => (
                  <article
                    key={entry.name}
                    className="rounded-xl border border-white/10 bg-white/5 p-5"
                  >
                    <figure className="mb-4 overflow-hidden rounded-lg border border-white/10">
                      <SafeImage
                        src={category.image}
                        alt=""
                        width={600}
                        height={338}
                        className="h-32 w-full object-cover"
                      />
                    </figure>
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-base font-bold leading-snug text-white">
                        {entry.name}
                      </h2>
                      <span
                        className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${TIER_STYLES[entry.tier]}`}
                      >
                        {entry.tier}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">
                      {entry.observation}
                    </p>
                    <p className="mt-3 text-xs text-white/45">
                      Source:{" "}
                      {entry.sourceHref ? (
                        <a
                          className="underline text-white/80"
                          href={entry.sourceHref}
                        >
                          {entry.source}
                        </a>
                      ) : (
                        <>{entry.source} · exact source link pending review</>
                      )}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section
            aria-label="What is not confirmed yet"
            className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5"
          >
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              What is NOT confirmed yet
            </h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-white/70">
              {category.notConfirmed.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </section>

          <section aria-label="Related pages" className="mt-8">
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              Explore more
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {category.related.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-sm font-semibold text-white/85 transition-colors hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  {link.label}
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>

          <Link
            href="/gta-6-world"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to GTA VI World
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
