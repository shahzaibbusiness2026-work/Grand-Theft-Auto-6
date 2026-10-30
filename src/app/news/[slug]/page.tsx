import { authorIdentity } from "@/lib/editorial-authors";
import remarkGfm from "remark-gfm";
import type { Metadata } from "next";
import { SafeImage } from "@/components/safe-image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Clock, ArrowLeft, ListOrdered } from "lucide-react";
import { extractHeadings, createHeadingIdAllocator } from "@/lib/toc";
import { SiteShell } from "@/components/shells";
import { ArticleCard } from "@/components/article-card";
import { NewsletterBar } from "@/components/newsletter-bar";
import {
  getPublicArticleBySlug,
  getPublicArticles,
} from "@/lib/services/articles";
import { getSeoSettings } from "@/lib/services/seo";
import { serializeJsonLd } from "@/lib/utils";
import {
  articleBodyMarkdown,
  readingTime,
  publicationImage,
} from "@/lib/editorial-quality";
import { PUBLICATION, canonicalOrigin } from "@/lib/site-identity";

export const revalidate = 300;
// An explicit runtime path list enables ISR for newly published CMS slugs.
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article: any = await getPublicArticleBySlug(slug);
  if (!article) {
    notFound();
  }

  const seo = await getSeoSettings();
  const base = canonicalOrigin(seo.canonicalBaseUrl);
  const canonical = article.canonical_url || `${base}/news/${article.slug}`;
  const rawOgImage = publicationImage(
    article.og_image || article.cover_image || seo.socialPreviewImage,
    article.slug,
  );
  // Social platforms require absolute image URLs
  const ogImage = rawOgImage?.startsWith("/")
    ? `${base}${rawOgImage}`
    : rawOgImage;
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
      authors: [authorIdentity(article.author_name).name],
      images: [
        {
          url: ogImage,
          ...(rawOgImage === "/img/port-gellhorn-official.jpg"
            ? { width: 3840, height: 2160 }
            : {}),
        },
      ],
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
  const subtitle = article.subtitle?.trim();
  const showSubtitle = subtitle && subtitle !== article.excerpt?.trim();

  const bodyMarkdown = articleBodyMarkdown(
    article.content || article.excerpt || "",
    article.title,
  );
  const toc = extractHeadings(bodyMarkdown);
  // Shared per-render allocator so rendered heading ids match the TOC exactly
  const allocateHeadingId = createHeadingIdAllocator();
  const markdownComponents = {
    table: ({ children }: any) => (
      <div
        role="region"
        tabIndex={0}
        aria-label="Scrollable article table"
        className="overflow-x-auto"
      >
        <table className="w-full border-collapse text-left [&_th]:border [&_td]:border [&_th]:p-3 [&_td]:p-3">
          {children}
        </table>
      </div>
    ),
    h2: ({ node, children, ...props }: any) => (
      <h2
        {...props}
        id={allocateHeadingId(children)}
        className="scroll-mt-24 text-2xl font-bold mt-8 text-foreground"
      >
        {children}
      </h2>
    ),
    h3: ({ node, children, ...props }: any) => (
      <h3
        {...props}
        id={allocateHeadingId(children)}
        className="scroll-mt-24 text-xl font-bold mt-6 text-foreground"
      >
        {children}
      </h3>
    ),
  };

  const all = await getPublicArticles();
  const related = all
    .filter((a) => a.slug !== article.slug && a.category === article.category)
    .concat(
      all.filter(
        (a) => a.slug !== article.slug && a.category !== article.category,
      ),
    )
    .slice(0, 3);

  const seo = await getSeoSettings();
  const base = canonicalOrigin(seo.canonicalBaseUrl);
  const byline = authorIdentity(article.author_name);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
          {
            "@type": "ListItem",
            position: 2,
            name: "News",
            item: `${base}/news`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: article.title,
            item: `${base}/news/${article.slug}`,
          },
        ],
      },
      {
        "@type": "Article",
        headline: article.seo_title || article.title,
        description: article.seo_description || article.excerpt,
        image: [
          new URL(
            publicationImage(
              article.og_image || article.cover_image,
              article.slug,
            ),
            base,
          ).href,
        ],
        datePublished: article.published_at || undefined,
        dateModified: article.updated_at || article.published_at || undefined,
        "@id": `${base}/news/${article.slug}#article`,
        isPartOf: { "@id": `${base}/#website` },
        author: {
          "@type": byline.collective ? "Organization" : "Person",
          "@id": `${base}${byline.path}`,
          name: byline.name,
          url: `${base}${byline.path}`,
        },
        publisher: {
          "@type": "Organization",
          name: "Taish Gaming",
          "@id": `${base}/#organization`,
          logo: { "@type": "ImageObject", url: `${base}${PUBLICATION.logo}` },
        },
        mainEntityOfPage: `${base}/news/${article.slug}`,
        articleSection: article.category,
        keywords: Array.isArray(article.tags)
          ? article.tags.join(", ")
          : undefined,
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
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-muted-foreground"
        >
          <Link href="/" className="hover:text-accent transition-colors">
            Home
          </Link>
          <span className="text-border">/</span>
          <Link href="/news" className="hover:text-accent transition-colors">
            News
          </Link>
          <span className="text-border">/</span>
          <span className="text-foreground line-clamp-1">{article.title}</span>
        </nav>

        {/* Hero */}
        <header className="card-surface mt-4 overflow-hidden bg-gradient-to-br from-card via-card/85 to-primary/5">
          <div className="relative min-h-56 sm:min-h-72">
            <SafeImage
              src={publicationImage(article.cover_image, article.slug)}
              alt={article.seo_title || article.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 900px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-card/90" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
              <span className="inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary border border-primary/30">
                {article.category}
              </span>
              <h1 className="mt-3 max-w-3xl font-display text-3xl sm:text-4xl font-extrabold leading-tight">
                {article.title}
              </h1>
              {showSubtitle && (
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 border-t border-border px-6 py-3 text-xs text-muted-foreground sm:px-10">
            <Link
              href={byline.path}
              className="font-semibold text-foreground underline"
            >
              {byline.name}
            </Link>
            <span>• {byline.role}</span>
            <span className="text-border">•</span>
            <time dateTime={article.published_at || undefined}>
              {formatDate(article.published_at)}
            </time>
            <span className="text-border">•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden="true" />{" "}
              {readingTime(bodyMarkdown)}
            </span>
          </div>
        </header>

        {/* Body */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0">
            <div className="card-surface mb-5 border-l-4 border-primary p-5">
              <p className="font-semibold leading-relaxed">{article.excerpt}</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Read the sources and uncertainty notes below.{" "}
                <Link
                  href="/editorial-policy"
                  className="text-accent underline"
                >
                  Our sourcing policy
                </Link>{" "}
                ·{" "}
                <Link href="/corrections" className="text-accent underline">
                  Request a correction
                </Link>
              </p>
            </div>
            {toc.length >= 2 && (
              <details
                aria-label="Table of contents"
                className="card-surface mb-6 p-5 sm:p-6"
              >
                <summary className="flex min-h-11 cursor-pointer items-center gap-2.5 font-semibold">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                    <ListOrdered className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-bold uppercase tracking-[0.14em] text-foreground">
                    Table of Contents
                  </span>
                </summary>
                <ol className="mt-4 divide-y divide-border/60">
                  {toc.map((item, i) => (
                    <li
                      key={item.id}
                      className={item.level === 3 ? "pl-5" : ""}
                    >
                      <a
                        href={`#${item.id}`}
                        className="group flex items-baseline gap-2.5 py-2.5 text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        <span className="shrink-0 font-bold tabular-nums text-foreground/60 group-hover:text-primary">
                          {i + 1}.
                        </span>
                        <span className="leading-snug group-hover:underline group-hover:underline-offset-4">
                          {item.text}
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </details>
            )}
            <div className="card-surface p-6 sm:p-10">
              <div className="mt-6 space-y-5 overflow-x-auto break-words text-base leading-[1.75] text-foreground/90 prose-headings:font-bold prose-headings:text-foreground prose-h2:text-2xl prose-h2:mt-8 prose-h3:text-xl prose-h3:mt-6 prose-p:my-4 prose-strong:text-foreground prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-li:my-1 prose-a:text-accent prose-a:underline hover:prose-a:text-foreground prose-blockquote:border-l-4 prose-blockquote:border-accent/40 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {bodyMarkdown}
                </ReactMarkdown>
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
                      <SafeImage
                        src={a.img}
                        alt={a.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <p className="line-clamp-2 text-[13px] font-semibold leading-snug">
                      {a.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-8 pb-4">
            <h2 className="font-display text-xl font-extrabold">
              More from Taish Gaming
            </h2>
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
