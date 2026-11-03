import { ConceptNotice } from "@/components/concept-notice";
import { publicLocation } from "@/lib/world-evidence";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  ArrowLeft,
  ChevronRight,
  Car,
  Crosshair,
  Navigation,
} from "lucide-react";
import { SiteShell } from "@/components/shells";
import { fitTitle, serializeJsonLd } from "@/lib/utils";
import {
  canonicalLocations,
  canonicalVehicles,
  canonicalWeapons,
  type CanonicalLocation,
} from "@/lib/canonical-data";
import { getLocations } from "@/lib/services/locations";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { FavoriteButton } from "@/components/favorite-button";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Resolve a location from live Supabase data, mapped to the canonical shape. */
async function resolveLocation(
  slug: string,
): Promise<CanonicalLocation | undefined> {
  const canonical = canonicalLocations.find(
    (l) => l.slug === slug || l.id === slug,
  );
  try {
    const dbRows = (await getLocations()) as Array<{
      id: string;
      slug?: string;
      name: string;
      district: string;
      category?: string;
      verification: string;
      coordinates?: string;
      description?: string;
      hours?: string;
      threat_level?: string;
      img?: string;
      confidence?: string;
      source?: string;
    }>;
    const row = dbRows?.find(
      (r) =>
        r.slug === slug ||
        r.id === slug ||
        r.name.toLowerCase() === slug.replace(/-/g, " "),
    );
    if (row) {
      const coordMatch = /top\s+([\d.]+%?),\s*left\s+([\d.]+%?)/.exec(
        row.coordinates || "",
      );
      return publicLocation({
        id: row.id,
        slug: row.slug || slug,
        name: row.name,
        district: row.district,
        category:
          (row.category as CanonicalLocation["category"]) ||
          canonical?.category ||
          "Point of Interest",
        desc: row.description || canonical?.desc || "",
        top: coordMatch?.[1] || canonical?.top || "",
        left: coordMatch?.[2] || canonical?.left || "",
        relatedVehicles: canonical?.relatedVehicles,
        relatedWeapons: canonical?.relatedWeapons,
        relatedMissions: canonical?.relatedMissions,
        confidence: (row.confidence as CanonicalLocation["confidence"]) || canonical?.confidence || "SPECULATION",
        source: row.source || canonical?.source || "Unknown",
        img: row.img || canonical?.img || "",
        verified: row.verification === "verified",
      });
    }
  } catch {
    // DB unreachable — canonical lookup stands
  }
  return canonical ? publicLocation(canonical) : undefined;
}

/** Resolve a catalog slug to a display name + detail link. Raw slugs are
 * never shown to visitors; unknown slugs fall back to a formatted name. */
function formatSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}
function vehicleAsset(slug: string): { label: string; href: string | null } {
  const entry = canonicalVehicles.find((v) => v.slug === slug || v.id === slug);
  return entry
    ? { label: entry.name, href: `/vehicles/${entry.slug}` }
    : { label: formatSlug(slug), href: null };
}
function weaponAsset(slug: string): { label: string; href: string | null } {
  const entry = canonicalWeapons.find((w) => w.slug === slug || w.id === slug);
  return entry
    ? { label: entry.name, href: `/weapons/${entry.slug}` }
    : { label: formatSlug(slug), href: null };
}

export async function generateStaticParams() {
  return canonicalLocations.map((l) => ({
    slug: l.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const loc = await resolveLocation(slug);

  if (!loc) {
    notFound();
  }

  return {
    title: fitTitle(loc.name),
    description: `Provisional fan-map entry for ${loc.name}. Placement, opening hours and gameplay remain unverified.`,
    alternates: { canonical: `/locations/${loc.slug}` },
    robots: { index: false, follow: true },
    openGraph: { url: `/locations/${loc.slug}` },
  };
}

export default async function LocationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const loc = await resolveLocation(slug);

  if (!loc) {
    notFound();
  }

  const nearbyLocations = canonicalLocations
    .map(publicLocation)
    .filter((l) => l.id !== loc.id && l.district === loc.district)
    .slice(0, 3);


  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: "https://www.taishgaming.com/",
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Locations",
                    item: "https://www.taishgaming.com/locations",
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: loc.name,
                    item: `https://www.taishgaming.com/locations/${loc.slug}`,
                  },
                ],
              },
              {
                "@type": "Place",
                name: loc.name,
                description: `Point of interest in ${loc.district}, State of Leonida.`,
                url: `https://www.taishgaming.com/locations/${loc.slug}`,
              },
            ],
          }),
        }}
      />
      <div className="container-site py-8">
        <ConceptNotice subject="location records and fan-map placements" />
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6 font-mono">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link
            href="/locations"
            className="hover:text-primary transition-colors"
          >
            Locations
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground truncate max-w-xs">{loc.name}</span>
        </nav>

        {/* Back link */}
        <div className="mb-6">
          <Link
            href="/locations"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors font-semibold"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to All Locations
          </Link>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Dossier Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Hero */}
            <div className="card-carbon p-6 md:p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-primary/20 text-primary border border-primary/30">
                    {loc.category}
                  </span>
                  <ConfidenceBadge confidence={loc.confidence} source={loc.source} />
                </div>
                <FavoriteButton type="locations" id={loc.id} />
              </div>

              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-foreground leading-tight">
                {loc.name}
              </h1>

              <div className="flex items-center gap-2 text-sm text-accent font-semibold">
                <MapPin className="h-4 w-4" />
                <span>{loc.district}, State of Leonida</span>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed pt-2">
                {loc.desc}
              </p>
            </div>

            {/* Photo / Visual */}
            {loc.img ? (
              <div className="card-carbon overflow-hidden">
                <div className="relative h-72 sm:h-96 w-full bg-background">
                  <img loading="lazy" src={loc.img} alt={loc.name} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  {loc.top && loc.left ? (
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-muted-foreground bg-muted/50 backdrop-blur-md px-4 py-2.5 rounded-xl border border-border">
                      <span className="font-mono text-muted-foreground min-w-0 truncate">
                        Map Grid: Top {loc.top} / Left {loc.left}
                      </span>
                      <Link
                        href={`/map?poi=${loc.id}&top=${loc.top}&left=${loc.left}`}
                        className="btn-primary text-xs px-3 py-2.5 min-h-[44px] font-bold flex items-center gap-1.5"
                      >
                        <Navigation className="h-3.5 w-3.5" /> Open fan-map pin
                      </Link>
                    </div>
                  ) : (
                    <div className="absolute bottom-4 left-4 right-4 text-xs text-muted-foreground bg-muted/50 backdrop-blur-md px-4 py-2.5 rounded-xl border border-border">
                      Map position unconfirmed
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* Related Vehicles & Armory */}
            {((loc.relatedVehicles?.length || 0) > 0 ||
              (loc.relatedWeapons?.length || 0) > 0) && (
              <div className="card-carbon p-6 space-y-4">
                <h3 className="font-display text-base font-bold text-foreground uppercase tracking-wider">
                  Associated Field Assets
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(loc.relatedVehicles?.length || 0) > 0 && (
                    <div className="p-4 rounded-xl bg-card border border-border space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                        <Car className="h-4 w-4" /> Spawning Vehicles
                      </div>
                      <ul className="text-xs text-foreground space-y-1">
                        {loc.relatedVehicles?.map((v) => {
                          const asset = vehicleAsset(v);
                          return (
                            <li key={v} className="flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                              {asset.href ? (
                                <Link
                                  href={asset.href}
                                  className="hover:text-primary hover:underline"
                                >
                                  {asset.label}
                                </Link>
                              ) : (
                                asset.label
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {(loc.relatedWeapons?.length || 0) > 0 && (
                    <div className="p-4 rounded-xl bg-card border border-border space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-light">
                        <Crosshair className="h-4 w-4" /> Available Armory
                      </div>
                      <ul className="text-xs text-foreground space-y-1">
                        {loc.relatedWeapons?.map((w) => {
                          const asset = weaponAsset(w);
                          return (
                            <li key={w} className="flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-gold-light" />
                              {asset.href ? (
                                <Link
                                  href={asset.href}
                                  className="hover:text-primary hover:underline"
                                >
                                  {asset.label}
                                </Link>
                              ) : (
                                asset.label
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Quick Action Map Launcher */}
            <div className="card-carbon p-6 space-y-4 border-accent/30 bg-accent/5">
              <h3 className="font-display text-base font-bold text-foreground uppercase tracking-wider">
                Tactical Navigation
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Open this provisional placement for {loc.name} on the fan-made
                map. Notes stay on this device.
              </p>
              <Link
                href={`/map?poi=${loc.id}`}
                className="btn-accent w-full py-2.5 text-xs flex items-center justify-center gap-2 font-bold uppercase tracking-wider"
              >
                <Navigation className="h-4 w-4" /> Open Interactive Map
              </Link>
            </div>

            {/* Nearby District POIs */}
            <div className="card-carbon p-6 space-y-4">
              <h4 className="font-display text-sm font-bold text-foreground uppercase tracking-wider">
                Nearby in {loc.district}
              </h4>
              {nearbyLocations.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No other provisional entries in this sector yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {nearbyLocations.map((item) => (
                    <Link
                      key={item.id}
                      href={`/locations/${item.slug}`}
                      className="block p-3 rounded-lg bg-card border border-border hover:border-primary/40 transition-colors group"
                    >
                      <div className="text-xs uppercase font-bold text-muted-foreground mb-0.5">
                        {item.category}
                      </div>
                      <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {item.name}
                      </div>
                      <div className="text-xs text-accent mt-1 flex items-center gap-1">
                        <MapPin className="h-2.5 w-2.5" /> {item.district}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
