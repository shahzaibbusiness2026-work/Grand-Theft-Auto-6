import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { getPublicGuideBySlug, getPublicGuides } from "@/lib/services/guides";
import ReactMarkdown from "react-markdown";
import { hasGuideBody, readingTime } from "@/lib/editorial-quality";
import { serializeJsonLd } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getPublicGuideBySlug(slug);
  if (!guide) return { title: "Guide Not Found" };
  return {
    robots: hasGuideBody(guide)
      ? { index: true, follow: true, "max-image-preview": "large" }
      : { index: false, follow: true },
    title: guide.title,
    description: guide.description || undefined,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      title: guide.title,
      description: guide.description || undefined,
      url: `/guides/${guide.slug}`,
      images: guide.image ? [guide.image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description || undefined,
    },
  };
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await getPublicGuideBySlug(slug);
  if (!guide) notFound();

  const all = await getPublicGuides();
  const sameCategory = all.filter(
    (g) => g.slug !== guide.slug && g.category === guide.category,
  );
  const related = (
    sameCategory.length > 0
      ? sameCategory
      : all.filter((g) => g.slug !== guide.slug)
  ).slice(0, 4);
  const ready = hasGuideBody(guide);

  return (
    <AppShell>
      {ready && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: guide.title,
              description: guide.description || undefined,
              image: guide.image || undefined,
              mainEntityOfPage: `/guides/${guide.slug}`,
            }),
          }}
        />
      )}
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 md:px-8">
        <nav
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span aria-hidden="true">›</span>
          <Link href="/guides" className="hover:text-foreground">
            Guides
          </Link>
          <span aria-hidden="true">›</span>
          <span className="text-foreground">{guide.title}</span>
        </nav>

        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default" className="normal-case">
              {guide.category}
            </Badge>
            {ready && (
              <span className="text-xs text-muted-foreground">
                {readingTime(guide.content || "")}
              </span>
            )}
          </div>
          <h1 className="mt-3 font-display text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl">
            {guide.title}
          </h1>
        </div>

        {guide.image && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-border">
            <img
              src={guide.image}
              alt={guide.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="mt-6 space-y-4">
          {ready ? (
            <div className="article-body">
              <ReactMarkdown>{guide.content || ""}</ReactMarkdown>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-muted/40 p-5">
              <h2 className="text-lg font-bold">
                This guide is not ready for publication
              </h2>
              <p className="mt-2 leading-relaxed">
                A complete, source-reviewed guide has not been published here.
                We do not have verified instructions, rewards or completion
                requirements to offer for this topic yet.
              </p>
              <Link
                href="/news"
                className="mt-3 inline-flex min-h-11 items-center font-semibold text-accent underline"
              >
                Read current GTA 6 reporting and sources
              </Link>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-start">
          <Link
            href="/guides"
            className="text-sm font-semibold text-accent hover:underline"
          >
            ← Back to all guides
          </Link>
        </div>

        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-extrabold uppercase tracking-wider text-foreground">
              Related Guides
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {related.map((g) => (
                <Link
                  key={g.slug || g.title}
                  href={g.slug ? `/guides/${g.slug}` : "/guides"}
                  className="group card-surface overflow-hidden"
                >
                  {g.image && (
                    <div className="relative h-32 overflow-hidden">
                      <img
                        loading="lazy"
                        src={g.image}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground">
                      {g.category}
                      {g.read_time ? ` • ${g.read_time}` : ""}
                    </p>
                    <h3 className="mt-1.5 font-display text-sm font-bold leading-snug group-hover:text-accent">
                      {g.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}
