import { getAdminArticleById } from "@/lib/services/articles";
import { ArticleEditor } from "./article-editor";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ArticleEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getAdminArticleById(id);
  if (id !== "new" && !article) notFound();
  return <ArticleEditor initialArticle={article} articleId={id} />;
}
