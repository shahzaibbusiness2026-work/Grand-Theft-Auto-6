import Link from "next/link";
import { CommunityMapWorkspace } from "@/components/community-map-workspace";
import { MapExplorerWorkspace } from "@/components/map-explorer-workspace";
import { applyCommunityOverrides } from "@/lib/community-map";
import { explorerPlaces } from "@/lib/map-explorer";
import type { AdminMapMarker } from "@/lib/admin-store";
import { ROCKSTAR_LEONIDA_MAP_URL } from "@/lib/regions";
export function MapClient({ view, initialPlace, markers = [], embedded = false }: {
  view: "explore" | "planner";
  initialPlace?: string;
  markers?: AdminMapMarker[];
  embedded?: boolean;
}) {
  const current = applyCommunityOverrides(markers);
  const positioned = current.filter((item) => item.position);
  const named = positioned.filter((item) => !item.name.startsWith("Unnamed "));
  return (
    <div>
      <header className="container-site pt-4 sm:pt-6 pb-4 space-y-3">
        <nav
          aria-label="Breadcrumb"
          className="hidden sm:block text-sm text-muted-foreground"
        >
          <Link href="/" className="underline">
            Home
          </Link>
          <span aria-hidden="true"> / </span>
          <span>GTA 6 map</span>
        </nav>
        <h1 className="font-display text-2xl sm:text-4xl font-black">
          GTA 6 Interactive Map: Leonida & Vice City
        </h1>
        {view === "explore" ? (
          <p className="max-w-3xl text-sm text-muted-foreground">
            Explore Leonida’s community-mapped roads, towns and islands. <a href={ROCKSTAR_LEONIDA_MAP_URL} className="font-semibold text-primary underline">Get Rockstar’s official printable map</a>.
          </p>
        ) : (
          <p className="max-w-3xl text-sm text-muted-foreground">
            Browse {named.length.toLocaleString("en-US")} named community locations and manage your planning pins. Community positions are estimates.
          </p>
        )}
        {!embedded && <nav aria-label="Leonida map sources" className="flex flex-wrap gap-2">
          <Link href="/map" scroll={false} aria-current={view === "explore" ? "page" : undefined}
            className="rounded-lg border border-border px-3 py-2 text-sm font-semibold aria-[current=page]:border-primary aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground">Explore map</Link>
          <Link href="/map?view=community" scroll={false} aria-current={view === "planner" ? "page" : undefined}
            className="rounded-lg border border-border px-3 py-2 text-sm font-semibold aria-[current=page]:border-primary aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground">Map planner</Link>
        </nav>}
      </header>
      <section
        className="container-site pb-8"
        aria-label="Interactive Leonida map"
      >
        {view === "explore" ? (
          <MapExplorerWorkspace key={initialPlace || "explore"} initialPlace={initialPlace} places={explorerPlaces(current)} />
        ) : <CommunityMapWorkspace markers={markers} />}
      </section>
      
      
    </div>
  );
}
