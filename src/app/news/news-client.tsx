"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, CheckCircle, Gamepad2, Mail } from "lucide-react";
import { SafeImage } from "@/components/safe-image";
import type { Article } from "@/lib/data";
import { toIsoDate } from "@/lib/utils";
import { subscribeNewsletter } from "@/lib/services/newsletter";

const PAGE_SIZE = 6;

/* News-only article card (matches the news-page mockup). ArticleCard in
   components/article-card.tsx is shared with the blog + article pages, so
   the news design lives here instead of restyling it globally. */
function NewsArticleCard({ article }: { article: Article }) {
  const href = article.slug ? `/news/${article.slug}` : "/news";
  const badge = article.tag || article.category;
  return (
    <Link
      href={href}
      className="group card-surface block overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <SafeImage
          src={article.img}
          alt={article.title}
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
          <span className="font-semibold text-foreground">Taish Gaming</span>
          <span aria-hidden="true">•</span>
          <time dateTime={toIsoDate(article.date)}>{article.date}</time>
        </p>
      </div>
    </Link>
  );
}

/* Latest-articles grid with a "Load More News" reveal (mockup button).
   All articles stay reachable — this only paginates the first paint. */
export function NewsArticleGrid({ articles }: { articles: Article[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const shown = articles.slice(0, visible);
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        {shown.map((a) => (
          <NewsArticleCard key={a.slug || a.title} article={a} />
        ))}
        {shown.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No further articles yet — check back soon.
          </p>
        )}
      </div>
      {visible < articles.length && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-full border-2 border-[#ff2e9a] px-8 py-3 text-sm font-bold text-[#ff2e9a] transition-colors hover:bg-[#ff2e9a] hover:text-white"
          >
            Load More News <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </>
  );
}

/* Dark magenta newsletter card for the news sidebar (mockup). Same
   subscribe action as the site-wide NewsletterBar, so sign-ups work. */
export function NewsSidebarNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const res = await subscribeNewsletter(email);
    setLoading(false);
    if (res.success) {
      setMessage(
        res.message || "Check your email to confirm your subscription.",
      );
      setStatus("success");
      setEmail("");
    } else {
      setStatus("error");
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#8a0f56] via-[#4d0a34] to-[#200619] p-5 text-white">
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#ff2e9a]/30 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ff2e9a]"
          aria-hidden="true"
        >
          <Mail className="h-5 w-5 text-white" />
        </span>
        <h3 className="mt-3 font-display text-xl font-extrabold leading-tight">
          Get the Latest Gaming News
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-white/80">
          Subscribe to Taish Gaming and never miss a GTA 6 update, leak, or
          major announcement.
        </p>
        {status === "success" ? (
          <p className="mt-4 flex items-start gap-2 rounded-xl bg-white/10 px-3 py-3 text-sm font-semibold">
            <CheckCircle
              className="mt-0.5 h-4 w-4 shrink-0"
              aria-hidden="true"
            />
            {message}
          </p>
        ) : (
          <form
            className="mt-4"
            onSubmit={handleSubmit}
            aria-label="Newsletter sign-up"
          >
            <label htmlFor="news-sidebar-email" className="sr-only">
              Email address
            </label>
            <input
              id="news-sidebar-email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading}
              className="h-11 w-full rounded-lg bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[#ff2e9a]"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-2.5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#ff2e9a] text-sm font-bold text-white transition-colors hover:bg-[#e01e87] disabled:opacity-60"
            >
              {loading ? "..." : "Subscribe"}{" "}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            {status === "error" && (
              <p className="mt-2 text-xs font-semibold text-rose-200">
                Something went wrong — please try again.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
