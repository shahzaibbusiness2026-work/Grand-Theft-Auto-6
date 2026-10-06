import type { Metadata } from "next";
import { SafeImage } from "@/components/safe-image";
import { ArrowRight, Clock } from "lucide-react";
import { SiteShell } from "@/components/shells";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/section-header";
import { NewsletterBar } from "@/components/newsletter-bar";
import { ArticleCard, PopularRow, CategoryList } from "@/components/article-card";
import { popularPosts } from "@/lib/data";
import { getPublicArticles } from "@/lib/services/queries";
import { getCategories } from "@/lib/services/categories";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "GTA 6 blog — the latest news, in-depth articles, exclusive insights and behind-the-scenes stories from Leonida.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const [liveArticles, categoriesData] = await Promise.all([
    getPublicArticles(),
    getCategories(),
  ]);

  const featured = liveArticles[0];
  const listArticles = liveArticles.slice(1);
  const blogCategories = categoriesData.map((c) => ({ label: c.name, count: c.count }));
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
      {featured && (
        <section className="container-site grid gap-6 py-7 lg:grid-cols-[1fr_300px]">
          <div>
            <SectionHeader title="Featured Article" />
            <a href={featured.slug ? `/news/${featured.slug}` : "/news"} className="card-surface block overflow-hidden">
              <div className="relative h-64">
                <SafeImage
                  src={featured.img || "/img/vice-sunset.svg"}
                  alt={`${featured.title} - GTA 6 Blog`}
                  fill
                  sizes="(max-width: 768px) 100vw, 700px"
                  className="object-cover"
                  loading="lazy"
                />
                <Badge variant="solid" className="absolute left-3 top-3 z-10">Featured</Badge>
              </div>
              <div className="p-6">
                <p className="section-eyebrow text-accent">{featured.tag || "News"}</p>
                <h2 className="mt-2 font-display text-xl font-extrabold">
                  {featured.title}
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  {featured.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-accent" /> By Atlas Team
                  </span>
                  <span>{featured.date}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {featured.read}
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1 font-semibold text-accent">
                    Read More <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </a>
          </div>
          <div className="space-y-6">
            <CategoryList categories={blogCategories} />
            <div>
              <h3 className="section-eyebrow mb-3">Popular Posts</h3>
              <div className="card-surface divide-y divide-border px-4 py-1">
                {popular.map((p) => (
                  <PopularRow key={p.slug || p.title} article={p} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* GRID */}
      <section className="container-site pb-8">
        <SectionHeader title="Latest from the Blog" />
        {listArticles.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {listArticles.map((a) => (
              <ArticleCard key={a.slug || a.title} article={a} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No articles published yet — check back soon.
          </p>
        )}
      </section>

      <section className="container-site pb-10">
        <NewsletterBar title="Never Miss an Update" text="Subscribe to our newsletter and get the latest GTA 6 news, trailers and exclusive content straight to your inbox." />
      </section>
    </SiteShell>
  );
}
