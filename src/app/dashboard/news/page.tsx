import Link from "next/link";
import { getPublicArticles } from "@/lib/services/articles";
export default async function PlayerNewsPage() {
  const articles = await getPublicArticles();
  return (
    <section className="player-panel">
      <h1 className="text-2xl font-bold">News and updates</h1>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {articles.map((article) => (
          <Link
            href={`/dashboard/news/${article.slug}`}
            key={article.slug}
            className="rounded-xl border border-white/10 p-4"
          >
            <h2 className="font-bold">{article.title}</h2>
            <p className="mt-2 text-sm text-slate-400">{article.excerpt}</p>
          </Link>
        ))}
      </div>
      {!articles.length && (
        <p className="mt-4 text-sm text-slate-400">
          No published articles are available.
        </p>
      )}
    </section>
  );
}
