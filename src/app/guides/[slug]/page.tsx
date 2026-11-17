import remarkGfm from "remark-gfm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { getPublicGuideBySlug, getPublicGuides } from "@/lib/services/guides";
import ReactMarkdown from "react-markdown";
import { hasGuideBody, readingTime } from "@/lib/editorial-quality";
import { absoluteUrl } from "@/lib/page-metadata";
import { serializeJsonLd } from "@/lib/utils";
import { PlayerBookmarkButton } from "@/components/player-bookmark-button";

export const revalidate = 3600;

/* Short SERP titles for guides (≤45 chars so the rendered title stays
   ≤60 after the layout appends " | Taish Gaming"). The guides table has
   no seo_title column, so the full guide.title is the H1 and the OG title
   — this map overrides only the <title> (and OG/Twitter titles) so the
   on-page headings keep their full wording. Add a row here whenever a new
   guide's title exceeds 45 characters. */
const GUIDE_SEO_TITLES: Record<string, string> = {
  "100-percent-completion-guide": "GTA 6 100% Completion Guide",
  "all-main-characters-explained": "GTA 6 Characters: Jason, Lucia & Cast",
  "best-gta-6-settings-ps5": "Best GTA 6 Settings for PS5",
  "best-gta-6-settings-ps5-pro": "GTA 6 PS5 Pro Settings Guide",
  "best-gta-6-settings-xbox-series-x": "Best GTA 6 Settings for Xbox",
  "best-weapons-tier-list": "GTA 6 Weapons Guide & Tier List",
  "complete-beginner-guide": "GTA 6 Story, Map & Characters Guide",
  "gta-6-beginners-guide": "GTA 6 Beginner's Guide: 10 Things to Do",
  "gta-6-ps5-controls": "GTA 6 PS5 Controls: Button Guide",
  "gta-6-standard-vs-ultimate-edition": "GTA 6 Standard vs Ultimate Edition",
  "gta-6-xbox-controls": "GTA 6 Xbox Controls: Button Guide",
  "heists-big-score-guide": "GTA 6 Heists & Robberies Guide",
  "make-money-fast": "How to Make Money in GTA 6",
};

function guideSeoTitle(guide: { slug?: string | null; title: string }) {
  return GUIDE_SEO_TITLES[guide.slug ?? ""] ?? guide.title;
}

// Prerender guide pages at build (SSG + ISR) so they are served cached.
// Without this the route is fully dynamic and every request pays a
// Supabase round-trip (~1.4s TTFB, Ahrefs Nov 2026 slow-page flag).
export async function generateStaticParams() {
  const guides = await getPublicGuides();
  return guides
    .filter((g) => g.slug)
    .map((g) => ({ slug: g.slug as string }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getPublicGuideBySlug(slug);
  if (!guide) return { title: "Guide Not Found" };
  const seoTitle = guideSeoTitle(guide);
  return {
    robots: hasGuideBody(guide)
      ? { index: true, follow: true, "max-image-preview": "large" }
      : { index: false, follow: true },
    title: seoTitle,
    description: guide.description || undefined,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      type: "article",
      title: seoTitle,
      description: guide.description || undefined,
      url: `/guides/${guide.slug}`,
      images: guide.image ? [guide.image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: guide.description || undefined,
      images: guide.image ? [guide.image] : undefined,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                // Google requires absolute URLs in breadcrumb items;
                // relative paths were flagged unvalidatable (audit 12 Nov 2026).
                item: absoluteUrl("/"),
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Guides",
                item: absoluteUrl("/guides"),
              },
              {
                "@type": "ListItem",
                position: 3,
                name: guide.title,
                item: absoluteUrl(`/guides/${guide.slug}`),
              },
            ],
          }),
        }}
      />
      {ready && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: guide.title,
              description: guide.description || undefined,
              image: guide.image ? absoluteUrl(guide.image) : undefined,
              // Real recorded timestamp from the guides table (also used
              // as the sitemap lastmod); omitted when absent, never invented.
              ...(guide.updated_at
                ? { dateModified: guide.updated_at }
                : {}),
              author: {
                "@type": "Organization",
                "@id":
                  "https://www.taishgaming.com/team#editorial-team",
                name: "Taish Gaming Editorial Team",
                url: "https://www.taishgaming.com/team",
              },
              mainEntityOfPage: absoluteUrl(`/guides/${guide.slug}`),
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
          <PlayerBookmarkButton title={guide.title} path={`/guides/${guide.slug}`} kind="guide" />
        </div>

        {guide.image && (
          <div className="mt-6 aspect-video overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-[#0c1222] to-[#1a2340]">
            <img
              src={guide.image}
              alt={guide.title}
              className="h-full w-full object-contain"
            />
          </div>
        )}

        <div className="mt-6 space-y-4">
          {ready ? (
            <div className="article-body">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  table: ({ children }) => (
                    <div
                      role="region"
                      tabIndex={0}
                      aria-label="Scrollable guide table"
                      className="overflow-x-auto"
                    >
                      <table className="w-full border-collapse text-left [&_th]:border [&_td]:border [&_th]:p-3 [&_td]:p-3">
                        {children}
                      </table>
                    </div>
                  ),
                }}
              >
                {guide.content || ""}
              </ReactMarkdown>
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
                    <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-[#0c1222] to-[#1a2340]">
                      <img
                        loading="lazy"
                        src={g.image}
                        alt={g.title}
                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
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
