import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteShell } from "@/components/shells";
import { readPublicShowcase } from "@/lib/player-showcase-server";
import { portfolioTotals } from "@/lib/player-portfolio";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Player collection | Taish Gaming",
  robots: { index: false, follow: false },
};
export default async function PublicCollection({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await readPublicShowcase(id);
  if (!profile) notFound();
  const totals = portfolioTotals(
    profile.assets.map((item) => ({
      ...item,
      notes: "",
      garageId: "",
      catalogPath: "",
      showcase: true,
      updatedAt: profile.publishedAt,
    })),
  );
  return (
    <SiteShell>
      <article className="container-site py-10 space-y-6">
        <header className="card-surface rounded-2xl p-6 flex flex-wrap gap-5 items-center">
          {profile.image && (
            <img
              src={profile.image}
              alt={profile.name ? `${profile.name} profile image` : "Player profile image"}
              width={80}
              height={80}
              className="h-20 w-20 rounded-full object-cover"
            />
          )}
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">
              Shared player collection
            </p>
            <h1 className="font-display text-3xl font-bold break-words">
              {profile.name}
            </h1>
            <p className="mt-3 whitespace-pre-wrap break-words">
              {profile.bio}
            </p>
          </div>
        </header>
        <p className="text-sm text-muted-foreground">
          Manually maintained player records, not connected to Rockstar or proof
          of game ownership. Snapshot published{" "}
          {new Date(profile.publishedAt).toLocaleDateString("en-GB", {
            timeZone: "UTC",
          })}
          .
        </p>
        {profile.showValues && (
          <p className="font-bold">
            Recorded owned value: GTA${" "}
            {totals.knownValue.toLocaleString("en-US")} ·{" "}
            {totals.unknownBaseValues} owned items have an unknown base value.
            Wishlist items are excluded.
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profile.assets.map((item) => (
            <section
              key={item.id}
              className="card-surface rounded-2xl overflow-hidden border border-border"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="aspect-video w-full object-cover"
                  loading="lazy"
                />
              )}
              <div className="p-5 space-y-2">
                <p className="text-xs uppercase text-muted-foreground">
                  {item.kind} · {item.status}
                </p>
                <h2 className="font-display text-xl font-bold break-words">
                  {item.name}
                </h2>
                {profile.showValues && (
                  <p className="text-sm">
                    Base:{" "}
                    {item.baseValue === null
                      ? "Unknown"
                      : `GTA$ ${item.baseValue.toLocaleString("en-US")}`}{" "}
                    · Upgrades:{" "}
                    {item.upgradeValue === null
                      ? "Unknown"
                      : `GTA$ ${item.upgradeValue.toLocaleString("en-US")}`}
                  </p>
                )}
              </div>
            </section>
          ))}
        </div>
      </article>
    </SiteShell>
  );
}
