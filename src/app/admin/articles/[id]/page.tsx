import { getAdminArticleById } from "@/lib/services/articles";
import { ArticleEditor } from "./article-editor";

export const dynamic = "force-dynamic";

export default async function ArticleEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getAdminArticleById(id);
  return <ArticleEditor initialArticle={article} articleId={id} />;
}
