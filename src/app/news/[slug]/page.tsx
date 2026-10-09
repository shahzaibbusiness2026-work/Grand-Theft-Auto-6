import type { Metadata } from "next";
import { SafeImage } from "@/components/safe-image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ArrowLeft } from "lucide-react";
import { SiteShell } from "@/components/shells";
import { ArticleCard } from "@/components/article-card";
import { NewsletterBar } from "@/components/newsletter-bar";
import { getPublicArticleBySlug, getPublicArticles } from "@/lib/services/articles";
import { getSeoSettings } from "@/lib/services/seo";
import { serializeJsonLd } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublicArticleBySlug(slug);
  if (!article) {
    notFound();
  }

  const seo = await getSeoSettings();
  const base = seo.canonicalBaseUrl?.startsWith("http")
    ? seo.canonicalBaseUrl
    : "https://gta6atlas.com";
  const canonical = article.canonical_url || `${base}/news/${article.slug}`;
  const ogImage = article.og_image || article.cover_image || seo.socialPreviewImage;
  const title = article.seo_title || article.title;
  const description = article.seo_description || article.excerpt;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      publishedTime: article.published_at || undefined,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

function formatDate(value?: string | null): string {
  if (!value) return "Recent";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getPublicArticleBySlug(slug);
  if (!article) notFound();

  const all = await getPublicArticles();
  const related = all
    .filter((a) => a.slug !== article.slug && a.category === article.category)
    .concat(all.filter((a) => a.slug !== article.slug && a.category !== article.category))
    .slice(0, 3);

  const paragraphs = (article.content || article.excerpt || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const seo = await getSeoSettings();
  const base = seo.canonicalBaseUrl?.startsWith("http")
    ? seo.canonicalBaseUrl
    : "https://gta6atlas.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
          { "@type": "ListItem", position: 2, name: "News", item: `${base}/news` },
          { "@type": "ListItem", position: 3, name: article.title, item: `${base}/news/${article.slug}` },
        ],
      },
      {
        "@type": "Article",
        headline: article.seo_title || article.title,
        description: article.seo_description || article.excerpt,
        image: [article.og_image || article.cover_image || `${base}/img/hero-dark.jpg`],
        datePublished: article.published_at || undefined,
        dateModified: article.updated_at || article.published_at || undefined,
        author: { "@type": "Person", name: article.author_name || "Atlas Editorial" },
        publisher: { "@type": "Organization", name: "GTA 6 Atlas" },
        mainEntityOfPage: `${base}/news/${article.slug}`,
        articleSection: article.category,
        keywords: Array.isArray(article.tags) ? article.tags.join(", ") : undefined,
      },
    ],
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <article className="container-site pt-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <span className="text-border">/</span>
          <Link href="/news" className="hover:text-accent transition-colors">News</Link>
          <span className="text-border">/</span>
          <span className="text-foreground line-clamp-1">{article.title}</span>
        </nav>

        {/* Hero */}
        <header className="card-surface mt-4 overflow-hidden bg-gradient-to-br from-card via-card/85 to-primary/5">
          <div className="relative h-56 sm:h-72">
            <SafeImage
              src={article.cover_image || "/img/hero-dark.jpg"}
              alt={article.seo_title || article.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 900px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
              <span className="inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary border border-primary/30">
                {article.category}
              </span>
              <h1 className="mt-3 max-w-3xl font-display text-3xl sm:text-4xl font-extrabold leading-tight">
                {article.title}
              </h1>
              {article.subtitle && (
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{article.subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 border-t border-border px-6 py-3 text-xs text-muted-foreground sm:px-10">
            <span className="font-semibold text-foreground">{article.author_name}</span>
            {article.author_role && <span>• {article.author_role}</span>}
            <span className="text-border">•</span>
            <time dateTime={article.published_at || undefined}>{formatDate(article.published_at)}</time>
            <span className="text-border">•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden="true" /> {article.read_time || "4 min read"}
            </span>
          </div>
        </header>

        {/* Body */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0">
            <div className="card-surface p-6 sm:p-10">
              <p className="border-l-2 border-primary/60 pl-4 text-base leading-relaxed text-foreground/90">
                {article.excerpt}
              </p>
              <div className="mt-6 space-y-5 text-base leading-[1.75] text-foreground/90">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {article.tags && article.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2 border-t border-border pt-6">
                  {article.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <Link
              href="/news"
              className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-accent transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Back to all news
            </Link>
          </div>

          <aside className="space-y-6">
            <div className="card-surface p-5">
              <h2 className="section-eyebrow mb-3">Related Articles</h2>
              <div className="space-y-4">
                {related.map((a) => (
                  <Link
                    key={a.slug || a.title}
                    href={a.slug ? `/news/${a.slug}` : "/news"}
                    className="flex items-center gap-3 py-1 hover:text-accent transition-colors"
                  >
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md">
                      <SafeImage src={a.img} alt={a.title} fill sizes="64px" className="object-cover" />
                    </div>
                    <p className="line-clamp-2 text-[13px] font-semibold leading-snug">{a.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-8 pb-4">
            <h2 className="font-display text-xl font-extrabold">More from GTA 6 Atlas</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={`grid-${a.slug || a.title}`} article={a} />
              ))}
            </div>
          </section>
        )}

        <section className="pb-10">
          <NewsletterBar
            title="Never Miss an Update"
            text="Subscribe to our newsletter and get the latest GTA 6 news & exclusive articles straight to your inbox."
          />
        </section>
      </article>
    </SiteShell>
  );
}
