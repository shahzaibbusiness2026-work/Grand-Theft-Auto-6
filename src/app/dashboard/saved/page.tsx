import { requirePlayer } from "@/lib/auth/player-account";
import { SavedWorkspace } from "./saved-client";
import { getEvidenceCatalog } from "@/lib/services/evidence-catalog";
export default async function SavedWorkspacePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { account, supabase } = await requirePlayer();
  const params = await searchParams;
  const favorites = account.workspace?.favorites;
  const labels: Record<string, string> = {};
  const links: Record<string, string> = {};
  const categories = [
    "vehicles",
    "weapons",
    "locations",
    "properties",
  ] as const;
  const results = await Promise.allSettled(
    categories.map(async (category) => {
      if (category === "vehicles" || category === "weapons") {
        const records = await getEvidenceCatalog(category);
        for (const item of records) {
          labels[`${category}:${item.id}`] = item.name;
          links[`${category}:${item.id}`] = `/${category}/${item.slug}`;
        }
        return;
      }
      const ids = favorites?.[category] || [];
      if (!ids.length) return;
      const field = "name";
      let query = supabase.from(category).select(`id,${field}`).in("id", ids);
      if (["vehicles", "weapons", "properties"].includes(category))
        query = query.eq("status", "published");
      const { data, error } = await query;
      if (error) throw error;
      for (const item of (data || []) as unknown as Record<string, string>[])
        labels[`${category}:${item.id}`] = item[field];
    }),
  );
  const catalogUnavailable = results.some(
    (result) => result.status === "rejected",
  );
  return (
    <SavedWorkspace
      labels={labels}
      links={links}
      initialType={params.type || "all"}
      catalogUnavailable={catalogUnavailable}
    />
  );
}
