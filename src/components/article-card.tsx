import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Article } from "@/lib/data";
import { cn } from "@/lib/utils";

export function ArticleCard({ article, className }: { article: Article; className?: string }) {
  return (
    <article className={cn("group card-surface overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-neon-cyan", className)}>
      <div className="relative h-40 overflow-hidden">
        <Image
          src={article.img}
          alt={`${article.title} - GTA 6 Article`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {article.tag && (
          <Badge variant="solid" className="absolute left-2 top-2 z-10">{article.tag}</Badge>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <time dateTime={article.date}>{article.date}</time>
          <span className="text-border" aria-hidden="true">•</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden="true" /> {article.read}
          </span>
        </div>
        <h3 className="mt-2 font-display text-sm font-bold leading-snug group-hover:text-primary">
          {article.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
          {article.excerpt}
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
          Read More <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}

export function PopularRow({ article }: { article: Article }) {
  return (
    <Link href="/blog" className="flex items-center gap-3 py-2.5 hover:text-accent transition-colors">
      <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-md">
        <Image
          src={article.img}
          alt={article.title}
          fill
          sizes="56px"
          className="object-cover"
          loading="lazy"
        />
      </div>
      <div>
        <p className="line-clamp-2 text-[13px] font-semibold leading-snug">{article.title}</p>
        <time className="mt-0.5 block text-[11px] text-muted-foreground" dateTime={article.date}>
          {article.date}
        </time>
      </div>
    </Link>
  );
}

export function CategoryList({ categories }: { categories: { label: string; count: number }[] }) {
  return (
    <div className="card-surface p-4">
      <h3 className="section-eyebrow mb-3">Categories</h3>
      <ul className="space-y-1">
        {categories.map((c, i) => (
          <li key={c.label}>
            <a
              href="/news"
              className={cn(
                "flex items-center justify-between rounded-md px-2.5 py-2 text-[13px] transition-colors hover:bg-muted",
                i === 0 ? "text-accent" : "text-muted-foreground"
              )}
            >
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                {c.label}
              </span>
              <span className="text-[11px]" aria-label={`${c.count} articles`}>{c.count}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
