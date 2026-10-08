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
import { getCategories } from "@/lib/services/categories";


export default async function NewsPage() {
  const [liveArticles, categoriesData] = await Promise.all([
    getPublicArticles(),
    getCategories(),
  ]);
  const heroArticle = liveArticles[0] || featuredArticle;
  const listArticles = liveArticles.slice(1);
  const categories = categoriesData.map((c) => ({ label: c.name, count: c.count }));
  // Popular sidebar reflects live content; static list only when DB is empty.
  const popular = liveArticles.length > 0 ? liveArticles.slice(0, 5) : popularPosts;

  return (
    <SiteShell>
      {/* HERO */}
      <section className="container-site pt-6">
        <div className="card-surface relative overflow-hidden bg-gradient-to-br from-card via-card/85 to-primary/5">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute right-1/3 bottom-0 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative px-6 py-12 sm:px-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-accent mb-3">News & Articles</div>
            <h1 className="mt-3 max-w-lg font-display text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-foreground">
              Stay Updated with the Latest from <span className="text-primary">Leonida</span>
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Breaking news, in-depth articles, exclusive insights and everything GTA 6.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED + CATEGORIES */}
      <section className="container-site grid gap-6 py-7 lg:grid-cols-[1fr_300px]">
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
            <Button
              href={heroArticle.slug ? `/news/${heroArticle.slug}` : "/blog"}
              size="sm"
              className="mt-5 w-fit"
            >
              Read More <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </article>
        <CategoryList categories={categories} />
      </section>

      {/* LATEST + POPULAR */}
      <section className="container-site grid gap-6 pb-8 lg:grid-cols-[1fr_300px]">
        <div>
          <SectionHeader title="Latest Articles" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {listArticles.map((a) => (
              <ArticleCard key={a.slug || a.title} article={a} />
            ))}
            {listArticles.length === 0 && (
              <p className="text-sm text-muted-foreground">No further articles yet — check back soon.</p>
            )}
          </div>
        </div>
        <div>
          <SectionHeader title="Popular Posts" />
          <div className="card-surface divide-y divide-border px-4 py-1">
            {popular.map((p) => (
              <PopularRow key={p.title} article={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-site pb-10">
        <NewsletterBar title="Never Miss an Update" text="Subscribe to our newsletter and get the latest GTA 6 news & exclusive articles straight to your inbox." />
      </section>
    </SiteShell>
  );
}

