export { metadata } from './metadata';

import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { SiteShell } from "@/components/shells";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/section-header";
import { NewsletterBar } from "@/components/newsletter-bar";
import { ArticleCard, PopularRow, CategoryList } from "@/components/article-card";
import { popularPosts, newsCategories, featuredArticle } from "@/lib/data";
import { getPublicArticles } from "@/lib/services/queries";


export default async function NewsPage() {
  const liveArticles = await getPublicArticles();
  const heroArticle = liveArticles[0] || featuredArticle;
  const listArticles = liveArticles.length > 1 ? liveArticles.slice(1, 7) : liveArticles;

  return (
    <SiteShell>
      {/* HERO */}
      <section className="container-site pt-8">
        <div className="card-surface relative overflow-hidden bg-gradient-to-br from-card via-card/85 to-primary/5">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute right-1/3 bottom-0 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative px-6 py-12 sm:px-10">
            <p className="section-eyebrow text-accent">News & Articles</p>
            <h1 className="mt-3 max-w-lg font-display text-4xl font-extrabold leading-tight">
              Stay Updated with the Latest from <span className="text-primary">Leonida</span>
            </h1>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Breaking news, in-depth articles, exclusive insights and everything GTA 6.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED + CATEGORIES */}
      <section className="container-site grid gap-6 py-10 lg:grid-cols-[1fr_300px]">
        <article className="card-surface grid overflow-hidden md:grid-cols-2">
          <div className="relative h-56 md:h-full min-h-[220px]">
            <Image
              src={heroArticle.img}
              alt={`${heroArticle.title} - Featured GTA 6 Article`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top"
              loading="lazy"
            />
            <Badge variant="solid" className="absolute left-3 top-3 z-10">Featured</Badge>
          </div>
          <div className="flex flex-col justify-center p-6">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <time dateTime={heroArticle.date}>{heroArticle.date}</time>
              <span className="text-border" aria-hidden="true">•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" aria-hidden="true" /> {heroArticle.read}
              </span>
            </div>
            <h2 className="mt-3 font-display text-lg font-extrabold leading-snug">
              {heroArticle.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{heroArticle.excerpt}</p>
            <Button href="/blog" size="sm" className="mt-5 w-fit">
              Read More <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </article>
        <CategoryList categories={newsCategories} />
      </section>

      {/* LATEST + POPULAR */}
      <section className="container-site grid gap-6 pb-12 lg:grid-cols-[1fr_300px]">
        <div>
          <SectionHeader title="Latest Articles" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {listArticles.map((a) => (
              <ArticleCard key={a.title} article={a} />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button variant="outline" size="sm" className="h-10 px-6">
              Load More Articles
            </Button>
          </div>
        </div>
        <div>
          <SectionHeader title="Popular Posts" />
          <div className="card-surface divide-y divide-border px-4 py-1">
            {popularPosts.map((p) => (
              <PopularRow key={p.title} article={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-site pb-16">
        <NewsletterBar title="Never Miss an Update" text="Subscribe to our newsletter and get the latest GTA 6 news & exclusive articles straight to your inbox." />
      </section>
    </SiteShell>
  );
}

