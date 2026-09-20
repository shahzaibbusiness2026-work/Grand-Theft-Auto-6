import Image from "next/image";
import { ArrowRight, Clock, Eye, Bookmark } from "lucide-react";
import { SiteShell } from "@/components/shells";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/section-header";
import { NewsletterBar } from "@/components/newsletter-bar";
import { ArticleCard, PopularRow, CategoryList } from "@/components/article-card";
import { articles, popularPosts } from "@/lib/data";

const blogCategories = [
  { label: "All Posts", count: 128 },
  { label: "News", count: 34 },
  { label: "Trailers", count: 18 },
  { label: "Gameplay", count: 24 },
  { label: "Characters", count: 16 },
  { label: "Vehicles", count: 12 },
  { label: "Guides", count: 10 },
  { label: "Updates", count: 14 },
];

export default function BlogPage() {
  const featured = articles[5]; // Release date article w/ vice sign vibe
  return (
    <SiteShell>
      {/* HERO */}
      <section className="container-site pt-8">
        <div className="card-surface relative overflow-hidden bg-gradient-to-br from-card via-card/85 to-primary/5">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute right-1/3 bottom-0 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative px-6 py-12 sm:px-10">
            <p className="section-eyebrow text-accent">Our Blog</p>
            <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight">
              News, Stories & <span className="text-primary">Updates</span>
            </h1>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Stay up to date with the latest GTA 6 news, in-depth articles, exclusive insights and behind-the-scenes stories from Leonida.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="container-site grid gap-6 py-10 lg:grid-cols-[1fr_300px]">
        <div>
          <SectionHeader title="Featured Article" />
          <article className="card-surface overflow-hidden">
            <div className="relative h-64">
              <Image
                src="/img/vice-sunset.svg"
                alt="Vice City Sunset - GTA 6 Blog"
                fill
                sizes="(max-width: 768px) 100vw, 700px"
                className="object-cover"
                loading="lazy"
              />
              <Badge variant="solid" className="absolute left-3 top-3 z-10">Featured</Badge>
            </div>
            <div className="p-6">
              <p className="section-eyebrow text-accent">News</p>
              <h2 className="mt-2 font-display text-xl font-extrabold">
                GTA 6 Trailer 2 Breakdown: Everything We Know So Far
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                A deep dive into the second trailer. Hidden details, new characters, gameplay leaks and more.
              </p>
              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-accent" /> By Atlas Team
                </span>
                <span>{featured.date}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> 8 min read
                </span>
                <span className="ml-auto inline-flex items-center gap-1 font-semibold text-accent">
                  Read More <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </article>
        </div>
        <div className="space-y-6">
          <CategoryList categories={blogCategories} />
          <div>
            <h3 className="section-eyebrow mb-3">Popular Posts</h3>
            <div className="card-surface divide-y divide-border px-4 py-1">
              {popularPosts.map((p) => (
                <PopularRow key={p.title} article={p} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="container-site pb-12">
        <SectionHeader title="Latest from the Blog" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((a) => (
            <ArticleCard key={a.title} article={a} />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button variant="outline" size="sm" className="h-10 px-6">
            Load More Articles
          </Button>
        </div>
      </section>

      <section className="container-site pb-16">
        <NewsletterBar title="Never Miss an Update" text="Subscribe to our newsletter and get the latest GTA 6 news, trailers and exclusive content straight to your inbox." />
      </section>
    </SiteShell>
  );
}
