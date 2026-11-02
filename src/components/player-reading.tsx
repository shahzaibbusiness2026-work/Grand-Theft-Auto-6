import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "@/components/player-tool-link";
import { getPublicArticleBySlug } from "@/lib/services/articles";
import { getPublicGuideBySlug } from "@/lib/services/guides";
import { articleBodyMarkdown, hasGuideBody } from "@/lib/editorial-quality";
import { PlayerBookmarkButton } from "./player-bookmark-button";
export async function PlayerReading({
  kind,
  slug,
}: {
  kind: "article" | "guide";
  slug: string;
}) {
  const record =
    kind === "article"
      ? await getPublicArticleBySlug(slug)
      : await getPublicGuideBySlug(slug);
  if (!record || (kind === "guide" && !hasGuideBody(record))) notFound();
  const path = `/${kind === "article" ? "news" : "guides"}/${slug}`;
  return (
    <article className="player-panel mx-auto max-w-4xl">
      <Link
        href={kind === "article" ? "/news" : "/guides"}
        className="text-sm text-gold-light"
      >
        ← Back to {kind === "article" ? "news" : "guides"}
      </Link>
      <h1 className="my-5 text-3xl font-bold leading-tight">{record.title}</h1>
      <PlayerBookmarkButton title={record.title} path={path} kind={kind} />
      <div className="player-reading mt-5 space-y-4 text-slate-200">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ href, children }) => (
              <Link href={href || "#"} className="text-gold-light underline">
                {children}
              </Link>
            ),
            h2: ({ children }) => (
              <h2 className="mt-8 text-2xl font-bold">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="mt-6 text-xl font-bold">{children}</h3>
            ),
            p: ({ children }) => <p className="leading-7">{children}</p>,
            ul: ({ children }) => (
              <ul className="list-disc space-y-2 pl-6">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal space-y-2 pl-6">{children}</ol>
            ),
          }}
        >
          {articleBodyMarkdown(record.content || "", record.title)}
        </ReactMarkdown>
      </div>
    </article>
  );
}
