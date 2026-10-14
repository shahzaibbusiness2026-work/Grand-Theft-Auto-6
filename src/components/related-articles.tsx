import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { getPublicArticles } from "@/lib/services/articles";
import { ArticleCard } from "@/components/article-card";

interface RelatedArticlesProps {
  /** Article category to match (case-insensitive), e.g. "Vehicles". Falls back to latest articles. */
  category: string;
  /** Section heading. */
  title?: string;
  /** "View all" link target. */
  viewAllHref?: string;
  /** "View all" link label. */
  viewAllLabel?: string;
}

/**
 * Server-rendered "Related articles" section for database/listing pages.
 * Matches the related-articles pattern from news/[slug]: same-category first,
 * then fills with the latest articles, capped at 3.
 */
export async function RelatedArticles({
  category,
  title = "Related Guides & News",
  viewAllHref = "/news",
  viewAllLabel = "All news",
}: RelatedArticlesProps) {
  const all = await getPublicArticles();
  const norm = (s?: string | null) => (s || "").toLowerCase().trim();
  const matched = all.filter((a) => norm(a.category) === norm(category));
  const rest = all.filter((a) => !matched.includes(a));
  const items = [...matched, ...rest].slice(0, 3);

  if (items.length === 0) return null;

  return (
    <section className="container-site pb-10" aria-label={title}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 font-display text-xl font-extrabold text-foreground">
          <Newspaper className="h-5 w-5 text-primary" aria-hidden="true" />
          {title}
        </h2>
        <Link
          href={viewAllHref}
          className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-accent"
        >
          {viewAllLabel} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((a) => (
          <ArticleCard key={a.slug || a.title} article={a} />
        ))}
      </div>
    </section>
  );
}
