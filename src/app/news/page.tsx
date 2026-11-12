export { metadata } from './metadata';
// ISR: cache this public content page for 1 hour. Content changes
// infrequently via the CMS; per-request SSR was causing multi-second loads.
export const revalidate = 3600;


import Link from "next/link";
import { ArrowRight, Clock, Flame, Gamepad2 } from "lucide-react";
import { SiteShell } from "@/components/shells";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/safe-image";
import { CategoryList } from "@/components/article-card";
import { getPublicArticles } from "@/lib/services/queries";
import { getCategories } from "@/lib/services/categories";
import { serializeJsonLd, toIsoDate } from "@/lib/utils";
import { itemListJsonLd } from "@/lib/page-metadata";
import { NewsArticleGrid, NewsLaunchCountdown, NewsSidebarNewsletter } from "./news-client";


export default async function NewsPage() {
  const [liveArticles, categoriesData] = await Promise.all([
    getPublicArticles(),
    getCategories(),
  ]);
  const heroArticle = liveArticles[0];
  const listArticles = liveArticles.slice(1);
  const categories = categoriesData.map((c) => ({ label: c.name, count: c.count }));
  // Trending sidebar reflects live content only — no static filler.
  const popular = liveArticles.slice(0, 5);

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            itemListJsonLd(
              "GTA 6 News & Articles",
              "Published GTA 6 news and articles from Taish Gaming.",
              liveArticles
                .filter((a) => a.slug)
                .map((a) => ({
                  name: a.title,
                  url: `https://www.taishgaming.com/news/${a.slug}`,
                })),
            ),
          ),
        }}
      />
      <h1 className="sr-only">GTA 6 News &amp; Articles</h1>

      {/* FEATURED — split hero: story left, artwork right */}
      {heroArticle && (
        <section className="container-site pt-6">
          <article className="card-surface grid overflow-hidden md:grid-cols-2">
            <div className="flex flex-col justify-center p-6 sm:p-10">
              <span className="inline-flex w-fit rounded-full border border-[#ff2e9a]/60 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-[#ff2e9a]">
                Featured
              </span>
              <h2 className="mt-4 font-display text-3xl font-black leading-tight sm:text-4xl">
                <Link
                  href={heroArticle.slug ? `/news/${heroArticle.slug}` : "/news"}
                  className="hover:text-primary"
                >
                  {heroArticle.title}
                </Link>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                {heroArticle.excerpt}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 font-semibold text-foreground">
                  <Gamepad2 className="h-4 w-4 text-[#ff2e9a]" aria-hidden="true" />
                  Taish Gaming
                </span>
                <span aria-hidden="true">•</span>
                <time dateTime={toIsoDate(heroArticle.date)}>{heroArticle.date}</time>
                <span aria-hidden="true">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" aria-hidden="true" /> {heroArticle.read}
                </span>
              </div>
              <Button
                href={heroArticle.slug ? `/news/${heroArticle.slug}` : "/news"}
                size="default"
                className="mt-6 w-fit min-h-[44px]"
              >
                Read Full Article <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </div>
            <div className="relative aspect-video">
              <SafeImage
                src={heroArticle.img}
                alt={`${heroArticle.title} - Featured GTA 6 Article`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-top"
                loading="lazy"
              />
            </div>
          </article>
        </section>
      )}

      {/* LATEST + SIDEBAR */}
      <section className="container-site grid gap-6 pb-10 pt-8 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-5 flex items-start gap-3">
            <span
              className="mt-1.5 h-8 w-1.5 shrink-0 rounded-full bg-[#ff2e9a]"
              aria-hidden="true"
            />
            <div>
              <h2 className="font-display text-2xl font-extrabold">
                Latest Gaming News
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                The newest updates, leaks, and stories from the world of GTA 6
                and gaming.
              </p>
            </div>
          </div>
          <NewsArticleGrid articles={listArticles} />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <CategoryList categories={categories} />

          <div className="rounded-2xl border border-pink-100 bg-pink-50 p-4 dark:border-pink-900/50 dark:bg-pink-950/40">
            <h3 className="flex items-center gap-2 font-display text-base font-extrabold">
              <Flame className="h-5 w-5 text-[#ff2e9a]" aria-hidden="true" />
              Trending Now
            </h3>
            <div className="mt-3 space-y-3">
              {popular.map((p) => (
                <Link
                  key={p.slug || p.title}
                  href={p.slug ? `/news/${p.slug}` : "/news"}
                  className="group flex items-center gap-3"
                >
                  <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                    <SafeImage
                      src={p.img}
                      alt={p.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                      loading="lazy"
                    />
                  </span>
                  <span className="line-clamp-2 text-[13px] font-semibold leading-snug group-hover:text-primary">
                    {p.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <NewsSidebarNewsletter />

          <NewsLaunchCountdown />
        </aside>
      </section>
    </SiteShell>
  );
}
