export { metadata } from './metadata';
// ISR: cache this public content page for 1 hour. Content changes
// infrequently via the CMS; per-request SSR was causing multi-second loads.
export const revalidate = 3600;


import Link from "next/link";
import { ArrowRight, Clock, Flame, Gamepad2 } from "lucide-react";
import { SiteShell } from "@/components/shells";
import { SafeImage } from "@/components/safe-image";
import { CategoryList } from "@/components/article-card";
import { getPublicArticles } from "@/lib/services/queries";
import { getCategories } from "@/lib/services/categories";
import { serializeJsonLd, toIsoDate } from "@/lib/utils";
import { itemListJsonLd } from "@/lib/page-metadata";
import { NewsArticleGrid, NewsLaunchCountdown, NewsSidebarNewsletter } from "./news-client";
import styles from "./news.module.css";


export default async function NewsPage() {
  const [liveArticles, categoriesData] = await Promise.all([
    getPublicArticles(),
    getCategories(),
  ]);
  const heroArticle = liveArticles[0];
  const heroHref = heroArticle?.slug ? `/news/${heroArticle.slug}` : "/news";
  const listArticles = liveArticles.slice(1);
  const categories = categoriesData.map((c) => ({ label: c.name, count: c.count }));
  // Trending sidebar reflects live content only — no static filler.
  const popular = listArticles.slice(0, 4);

  return (
    <SiteShell footerVariant="news">
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

      {heroArticle && (
        <section className={styles.hero} aria-labelledby="news-featured-title">
          <div className={styles.heroArtwork}>
            <SafeImage
              src="/img/gta6-hero-official.webp"
              alt=""
              fill
              priority
              sizes="100vw"
              className={styles.heroImage}
            />
          </div>
          <div className={`container-site ${styles.heroInner}`}>
            <div className={styles.heroStory}>
              <p className={styles.heroLabel}>Featured story</p>
              <h2 id="news-featured-title" className={`font-display ${styles.heroTitle}`}>
                {heroArticle.title}
              </h2>
              {heroArticle.excerpt && (
                <p className="mt-4 line-clamp-3 leading-relaxed text-slate-100">
                  {heroArticle.excerpt}
                </p>
              )}
              <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-100 sm:text-sm">
                <span className="flex items-center gap-1.5 font-semibold text-white">
                  <Gamepad2 className="h-4 w-4 text-pink-300" aria-hidden="true" />
                  Taish Gaming
                </span>
                <span aria-hidden="true">·</span>
                <time dateTime={toIsoDate(heroArticle.date)}>{heroArticle.date}</time>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {heroArticle.read}
                </span>
              </p>
              <Link href={heroHref} className={styles.heroAction}>
                Read the featured story <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
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
              <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
                Latest Gaming News
              </h2>
            </div>
          </div>
          <NewsArticleGrid articles={listArticles} />
        </div>

        <aside className="space-y-5 lg:self-start">
          {popular.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-border bg-card text-card-foreground">
              <h3 className="flex items-center gap-2 bg-pink-50 px-4 py-3 font-display text-lg font-extrabold dark:bg-pink-950/40">
                <Flame className="h-5 w-5 text-[#ff2e9a]" aria-hidden="true" />
                Trending Now
              </h3>
              <div className="space-y-3 p-4">
                {popular.map((p) => (
                  <Link
                    key={p.slug || p.title}
                    href={p.slug ? `/news/${p.slug}` : "/news"}
                    className="group flex items-center gap-3"
                  >
                    <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                      <SafeImage
                        src={p.img}
                        alt=""
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
          )}

          <NewsSidebarNewsletter />

          <NewsLaunchCountdown />

          {categories.length > 0 && <CategoryList categories={categories} />}
        </aside>
      </section>
    </SiteShell>
  );
}
