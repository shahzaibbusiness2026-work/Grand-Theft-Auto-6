export { metadata } from './metadata';
// ISR: cache this public content page for 1 hour. Content changes
// infrequently via the CMS; per-request SSR was causing multi-second loads.
export const revalidate = 3600;


import Link from "next/link";
import { ArrowRight, Clock, Gamepad2 } from "lucide-react";
import { SiteShell } from "@/components/shells";
import { SafeImage } from "@/components/safe-image";
import type { Article } from "@/lib/data";
import { authorIdentity } from "@/lib/editorial-authors";
import { getPublicArticles } from "@/lib/services/articles";
import { serializeJsonLd } from "@/lib/utils";
import { absoluteUrl, itemListJsonLd } from "@/lib/page-metadata";
import { NewsArticleList } from "./news-article-list";
import { NewsSidebarNewsletter } from "./news-client";
import styles from "./news.module.css";

const featuredReading = [
  ["gta-6-watercraft-aircraft-guide", "Dodo seaplane location"],
  ["vice-city-wildlife-ecosystem", "Alligators and other wildlife"],
  ["gta-6-port-gellhorn-forgotten-coast-guide", "Port Gellhorn map and Chapter 2 landmarks"],
  ["gta-6-map-guide-leonida-regions-size", "Official Leonida map download"],
  ["gta-6-release-date-pre-order-editions", "GTA 6 release date, platforms and editions"],
  ["gta-6-fps-performance", "PS5 and Xbox performance comparison"],
  ["gta-6-file-size-210-gb-ps5-storage-guide", "Download size and storage requirements"],
] as const;

export default async function NewsPage() {
  const liveArticles = (await getPublicArticles()).filter(
    (article): article is Article & { slug: string } => Boolean(article.slug),
  );
  const heroArticle = liveArticles[0];
  const listArticles = liveArticles.slice(1);
  const liveSlugs = new Set(liveArticles.map(({ slug }) => slug));
  const categoryCounts = new Map<string, { label: string; count: number }>();
  for (const article of liveArticles) {
    const label = article.category?.trim() || "News";
    const key = label.toLowerCase();
    const category = categoryCounts.get(key);
    if (category) category.count += 1;
    else categoryCounts.set(key, { label, count: 1 });
  }
  const categories = [...categoryCounts.values()].sort(
    (a, b) => b.count - a.count || a.label.localeCompare(b.label),
  );

  return (
    <SiteShell footerVariant="news">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            itemListJsonLd(
              "GTA 6 News & Articles",
              "Published GTA 6 news and articles from Taish Gaming.",
              liveArticles.map((article) => ({
                name: article.title,
                url: absoluteUrl(`/news/${article.slug}`),
              })),
            ),
          ),
        }}
      />
      {heroArticle ? (
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
              <h1 className={styles.heroLabel}>GTA 6 News &amp; Articles</h1>
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
                  {authorIdentity(heroArticle.authorName).name}
                </span>
                {heroArticle.publishedAt && (
                  <>
                    <span aria-hidden="true">·</span>
                    <time dateTime={heroArticle.publishedAt}>{heroArticle.date}</time>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {heroArticle.read}
                </span>
              </p>
              <Link href={`/news/${heroArticle.slug}`} className={styles.heroAction}>
                Read the featured story <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <h1 className="container-site pt-8 font-display text-3xl font-extrabold">
          GTA 6 News &amp; Articles
        </h1>
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
                Latest GTA 6 News
              </h2>
            </div>
          </div>
          <NewsArticleList articles={listArticles} />
        </div>

        <aside className="space-y-5 lg:self-start">
          <section className="card-surface space-y-3 p-4" aria-labelledby="news-reference-heading">
            <h2 id="news-reference-heading" className="font-display text-lg font-extrabold">GTA 6 essentials</h2>
            <ul className="space-y-2 text-sm">
              {featuredReading.filter(([slug]) => liveSlugs.has(slug)).map(([slug, label]) => (
                <li key={slug}><Link className="underline" href={`/news/${slug}`}>{label}</Link></li>
              ))}
              <li><Link className="underline" href="/guides">Walkthroughs and controls guides</Link></li>
            </ul>
          </section>
          {categories.length > 0 && (
            <section className="card-surface p-4" aria-labelledby="news-categories">
              <h2 id="news-categories" className="mb-3 font-display text-lg font-extrabold">
                Article categories
              </h2>
              <div className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
                {categories.map(({ label, count }) => (
                  <div key={label} className="flex justify-between gap-2 text-sm">
                    <span>{label}</span>
                    <span className="text-muted-foreground" aria-label={`${count} articles`}>
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <NewsSidebarNewsletter />
        </aside>
      </section>
    </SiteShell>
  );
}
