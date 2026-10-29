import { SiteShell } from "@/components/shells";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { REGION_PAGES, getRegionPage } from "@/lib/regions";

export function generateStaticParams() {
  return REGION_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getRegionPage(slug);
  if (!page) return {};
  return {
    title: page.seoTitle,
    description: page.seoDescription,
    alternates: { canonical: `/regions/${page.slug}` },
    openGraph: {
      title: page.seoTitle,
      description: page.seoDescription,
      url: `/regions/${page.slug}`,
      images: [{ url: page.hero, alt: page.heroAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.seoTitle,
      description: page.seoDescription,
      images: [page.hero],
    },
  };
}

export default async function RegionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getRegionPage(slug);
  if (!page) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Regions", item: "/regions" },
      {
        "@type": "ListItem",
        position: 3,
        name: page.name,
        item: `/regions/${page.slug}`,
      },
    ],
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-[#000713] text-white">
        <section className="container-site px-4 pt-10 pb-6">
          <p className="text-sm text-white/50">
            <Link href="/regions" className="hover:text-white">
              Regions
            </Link>{" "}
            / {page.name}
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#34D399]">
            Rockstar confirmed region
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
            {page.title}
          </h1>
          <p className="mt-3 text-lg text-white/70">
            Rockstar’s tagline: “{page.tagline}”
          </p>
          <div className="relative mt-6 overflow-hidden rounded-2xl border border-white/10">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={page.hero}
                alt={page.heroAlt}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-white/50">
            Image: {page.heroSource}
          </p>
        </section>

        <section className="container-site px-4 pb-8">
          <div className="max-w-3xl space-y-4 text-white/80">
            {page.intro.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>

        {page.images.length > 0 && (
          <section className="container-site px-4 pb-10">
            <h2 className="text-2xl font-bold">In the region</h2>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              {page.images.map((img) => (
                <figure
                  key={img.src}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                >
                  <div className="relative aspect-[16/9] w-full">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <figcaption className="p-4 text-sm text-white/70">
                    {img.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        <section className="container-site px-4 pb-10">
          <h2 className="text-2xl font-bold">What Rockstar confirmed</h2>
          <ul className="mt-4 max-w-3xl list-disc space-y-2 pl-5 text-white/80">
            {page.confirmed.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="container-site px-4 pb-10">
          <div className="max-w-3xl rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5">
            <h2 className="text-xl font-bold text-amber-300">
              Not confirmed
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-white/80">
              {page.notConfirmed.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="container-site px-4 pb-16">
          <h2 className="text-2xl font-bold">Related</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {page.related.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-white/20 px-4 py-2 text-sm hover:border-white/50"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
