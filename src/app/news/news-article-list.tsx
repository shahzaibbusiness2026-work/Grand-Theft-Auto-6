import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import { SafeImage } from "@/components/safe-image";
import type { Article } from "@/lib/data";
import { authorIdentity } from "@/lib/editorial-authors";

type PublishedArticle = Article & { slug: string };

function NewsArticleCard({ article }: { article: PublishedArticle }) {
  const badge = article.tag || article.category;

  return (
    <Link
      href={`/news/${article.slug}`}
      className="group card-surface block overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <SafeImage
          src={article.img}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {badge && (
          <span className="absolute bottom-3 left-3 z-10 rounded-md bg-[#ff2e9a] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            {badge}
          </span>
        )}
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="font-display text-base font-bold leading-snug group-hover:text-primary">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
          {article.excerpt}
        </p>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Gamepad2 className="h-4 w-4 text-[#ff2e9a]" aria-hidden="true" />
          <span className="font-semibold text-foreground">
            {authorIdentity(article.authorName).name}
          </span>
          {article.publishedAt && (
            <>
              <span aria-hidden="true">•</span>
              <time dateTime={article.publishedAt}>{article.date}</time>
            </>
          )}
        </p>
      </div>
    </Link>
  );
}

export function NewsArticleList({ articles }: { articles: PublishedArticle[] }) {
  if (!articles.length) {
    return <p className="text-sm text-muted-foreground">No further articles yet.</p>;
  }

  const latest = articles.slice(0, 4);
  const archive = articles.slice(4);
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        {latest.map((article) => <NewsArticleCard key={article.slug} article={article} />)}
      </div>
      {archive.length > 0 && (
        <details className="card-surface mt-8 p-5">
          <summary className="min-h-11 cursor-pointer rounded py-3 font-bold text-primary">
            Browse older articles
          </summary>
          <ol className="divide-y divide-border/60">
            {archive.map((article) => (
              <li key={article.slug} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 py-3 text-sm">
                <Link
                  href={`/news/${article.slug}`}
                  className="min-w-0 font-semibold text-accent underline-offset-4 hover:underline"
                  prefetch={false}
                >
                  {article.title}
                </Link>
                {article.publishedAt && (
                  <time dateTime={article.publishedAt} className="shrink-0 text-xs text-muted-foreground">
                    {article.date}
                  </time>
                )}
              </li>
            ))}
          </ol>
        </details>
      )}
    </>
  );
}
