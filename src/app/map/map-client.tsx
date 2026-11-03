import Link from "next/link";
import { CommunityMapWorkspace } from "@/components/community-map-workspace";
import {
  applyCommunityOverrides,
  communityCategory,
} from "@/lib/community-map";
import type { AdminMapMarker } from "@/lib/admin-store";
const destinations = [
  { name: "Vice City", slug: "vice-city" },
  { name: "Leonida Keys", slug: "leonida-keys" },
  { name: "Grassrivers", slug: "grassrivers" },
  { name: "Port Gellhorn", slug: "port-gellhorn" },
  { name: "Ambrosia", slug: "ambrosia" },
  { name: "Mount Kalaga", slug: "mount-kalaga" },
];
export function MapClient({ markers = [] }: { markers?: AdminMapMarker[] }) {
  const current = applyCommunityOverrides(markers);
  const positioned = current.filter((item) => item.position);
  const named = positioned.filter((item) => !item.name.startsWith("Unnamed "));
  const categories = [
    { id: "poi", name: "Landmarks" },
    { id: "properties", name: "Buildings & properties" },
    { id: "shops", name: "Shops & food" },
    { id: "vehicles", name: "Vehicle-related places" },
    { id: "nature", name: "Nature & landscape" },
    { id: "transport", name: "Transport & roads" },
    { id: "garages", name: "Garage-related places" },
  ];
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
        <div className="hidden sm:flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <span>
            <strong>{positioned.length.toLocaleString("en-US")}</strong>{" "}
            positioned community records
          </span>
          <span>
            <strong>{named.length.toLocaleString("en-US")}</strong> named
            records
          </span>
          <span>
            <strong>{current.length - positioned.length}</strong> records
            without coordinates
          </span>
        </div>
      </header>
      <section
        className="container-site pb-8"
        aria-label="Interactive Leonida map"
      >
        <CommunityMapWorkspace markers={markers} />
      </section>
      <section
        className="container-site pb-8 space-y-5"
        aria-labelledby="map-directory"
      >
        <h2 id="map-directory" className="font-display text-2xl font-bold">
          Explore the map by category
        </h2>
        <p className="text-sm text-muted-foreground">
          Categories reflect contributor classifications, not verified gameplay
          services. Unpositioned records are kept off the map instead of being
          given invented coordinates.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <a
              href={`/map?category=${category.id}`}
              key={category.id}
              className="card-surface rounded-xl border border-border p-4 hover:border-gold"
            >
              <h3 className="font-bold">{category.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {
                  positioned.filter(
                    (item) => communityCategory(item.types) === category.id,
                  ).length
                }{" "}
                positioned community records · Open filter
              </p>
            </a>
          ))}
        </div>
        <details className="card-surface rounded-xl border border-border p-5">
          <summary className="cursor-pointer font-bold min-h-11">
            Browse named community locations
          </summary>
          <p className="mb-4 text-sm text-muted-foreground">
            A selection of named records from the snapshot. Search the map for
            the full set. Names and placements are contributor interpretations.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {named.slice(0, 60).map((item) => (
              <li key={item.id}>
                <a
                  href={`/map?poi=${encodeURIComponent(item.id)}`}
                  className="block rounded-lg border border-border p-3 text-sm hover:border-gold"
                >
                  <strong>{item.name}</strong>
                  <span className="block mt-1 text-muted-foreground">
                    {item.area || "Area unclassified"}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </details>
      </section>
      <section
        className="container-site pb-10 space-y-5"
        aria-labelledby="official-destinations"
      >
        <h2
          id="official-destinations"
          className="font-display text-2xl font-bold"
        >
          Six destinations named by Rockstar
        </h2>
        <p className="text-sm text-muted-foreground">
          Rockstar names these destinations in its{" "}
          <a
            href="https://www.rockstargames.com/VI/only-in-leonida"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Only in Leonida guide
          </a>
          . Their names are separate from the community map’s proposed
          coordinates.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((item) => (
            <Link
              className="card-surface rounded-xl border border-border p-5 hover:border-gold"
              href={`/regions/${item.slug}`}
              key={item.slug}
            >
              <h3 className="font-display text-xl font-bold">{item.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Read destination background and source context →
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
