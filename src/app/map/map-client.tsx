import Link from "next/link";
import { CommunityMapWorkspace } from "@/components/community-map-workspace";
import { applyCommunityOverrides } from "@/lib/community-map";
import type { AdminMapMarker } from "@/lib/admin-store";
import { ROCKSTAR_LEONIDA_MAP_URL } from "@/lib/regions";
export function MapClient({ markers = [] }: { markers?: AdminMapMarker[] }) {
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
        <p className="sm:hidden text-sm text-muted-foreground">
          Search Leonida’s community map. Positions and boundaries remain
          unofficial.
        </p>
        <p className="hidden sm:block max-w-3xl text-sm text-muted-foreground">
          Search community-mapped landmarks, explore categories and keep your
          own notes and planning marks. This reconstruction is unofficial:
          positions, identities and boundaries can change.
        </p>
        <a href={ROCKSTAR_LEONIDA_MAP_URL} className="inline-block text-sm font-semibold text-primary underline">
          Rockstar’s official printable map
        </a>
        <div className="hidden sm:flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <span>
            <strong>{positioned.length.toLocaleString("en-US")}</strong>{" "}
            community records with positions
          </span>
          <span>
            <strong>{named.length.toLocaleString("en-US")}</strong> named
            places
          </span>
          <span>
            <strong>{current.length - positioned.length}</strong> records
            still need coordinates
          </span>
        </div>
        <p className="hidden sm:block max-w-3xl text-xs text-muted-foreground">
          Those are the full community dataset totals — the map itself shows
          the named places first. Everyday categories such as bus stops,
          housing and generic shops stay hidden until you switch them on in
          Filters.
        </p>
      </header>
      <section
        className="container-site pb-8"
        aria-label="Interactive Leonida map"
      >
        <CommunityMapWorkspace markers={markers} />
      </section>
      
      
    </div>
  );
}
