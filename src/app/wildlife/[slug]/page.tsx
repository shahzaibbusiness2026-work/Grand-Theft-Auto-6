import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SiteShell } from "@/components/shells";
import { WILDLIFE_PAGES, getWildlifePage } from "@/lib/wildlife";
import type { EvidenceTier } from "@/lib/gta-world";
import { serializeJsonLd } from "@/lib/utils";
import { SafeImage } from "@/components/safe-image";

export function generateStaticParams() {
  return WILDLIFE_PAGES.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getWildlifePage(slug);
  if (!page) notFound();
  return {
    title: page.seoTitle,
    description: page.seoDescription,
    alternates: { canonical: `/wildlife/${page.slug}` },
    openGraph: { url: `/wildlife/${page.slug}` },
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

export default async function WildlifePage({ params }: Props) {
  const { slug } = await params;
  const page = getWildlifePage(slug);
  if (!page) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.taishgaming.com/" },
      { "@type": "ListItem", position: 2, name: "GTA 6 Wildlife", item: "https://www.taishgaming.com/wildlife" },
      { "@type": "ListItem", position: 3, name: page.title, item: `https://www.taishgaming.com/wildlife/${page.slug}` },
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
            <Link href="/wildlife" className="transition-colors hover:text-white">
              GTA 6 Wildlife
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-white">{page.name}</span>
          </nav>

          <header className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">
              GTA VI Wildlife
            </p>
            <h1 className="mt-2 font-display text-3xl font-black leading-tight sm:text-4xl">
              {page.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2">
              <span
                className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${TIER_STYLES[page.tier]}`}
              >
                {page.tier}
              </span>
            </div>
            {page.intro.map((paragraph, i) => (
              <p key={i} className="mt-3 text-base leading-relaxed text-white/75">
                {paragraph}
              </p>
            ))}
          </header>

          {page.correction && (
            <div className="mt-6 max-w-3xl rounded-xl border border-amber-400/40 bg-amber-400/10 p-5">
              <p className="text-sm leading-relaxed text-amber-200">
                {page.correction}
              </p>
            </div>
          )}

          <figure className="mt-6 overflow-hidden rounded-2xl border border-white/10">
            <SafeImage
              src={page.hero}
              alt={page.heroAlt}
              width={1200}
              height={675}
              className="h-auto w-full object-cover"
            />
          </figure>

          <section className="mt-10 max-w-3xl">
            <h2 className="text-xl font-black leading-tight">What the footage shows</h2>
            <div className="mt-5 space-y-6">
              {page.footage.map((frame) => (
                <figure
                  key={frame.src + frame.caption}
                  className="overflow-hidden rounded-xl border border-white/10 bg-white/5"
                >
                  <SafeImage
                    src={frame.src}
                    alt={frame.alt}
                    width={1200}
                    height={675}
                    className="h-auto w-full object-cover"
                  />
                  <figcaption className="p-4 text-sm leading-relaxed text-white/70">
                    {frame.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section className="mt-10 max-w-3xl">
            <h2 className="text-xl font-black leading-tight">What Rockstar confirmed</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-white/75">
              {page.confirmed.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-10 max-w-3xl rounded-xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-black leading-tight">Not confirmed</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-white/70">
              {page.notConfirmed.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-10 max-w-3xl">
            <h2 className="text-xl font-black leading-tight">Related</h2>
            <ul className="mt-4 space-y-2">
              {page.related.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-bold text-white underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/wildlife"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-white/75 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to GTA 6 Wildlife
            </Link>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
