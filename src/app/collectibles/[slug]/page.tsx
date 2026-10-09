import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Trophy,
  ArrowLeft,
  CheckCircle2,
  Compass,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { SiteShell } from "@/components/shells";
import { canonicalCollectibles } from "@/lib/canonical-data";
import { ConfidenceBadge } from "@/components/confidence-badge";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return canonicalCollectibles.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collectible = canonicalCollectibles.find((c) => c.slug === slug);

  if (!collectible) {
    notFound();
  }

  return {
    title: `${collectible.title} — Location & Guide | GTA 6 Atlas`,
    description: `Complete guide and coordinate location for ${collectible.title} in ${collectible.district}. Requirements: ${collectible.requirements}.`,
    alternates: { canonical: `/collectibles/${collectible.slug}` },
  };
}

export default async function CollectibleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const collectible = canonicalCollectibles.find((c) => c.slug === slug);

  if (!collectible) {
    notFound();
  }

  const related = canonicalCollectibles
    .filter((c) => c.id !== collectible.id)
    .slice(0, 3);

  return (
    <SiteShell>
      <div className="container-site py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6 font-mono">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/collectibles" className="hover:text-primary transition-colors">
            Collectibles
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground truncate max-w-xs">{collectible.title}</span>
        </nav>

        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/collectibles"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors font-semibold"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to All Collectibles
          </Link>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Hero */}
            <div className="card-carbon p-6 md:p-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-primary/20 text-primary border border-primary/30">
                  {collectible.category}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                  <MapPin className="h-3.5 w-3.5 text-accent" /> {collectible.district}
                </span>
                <ConfidenceBadge confidence={collectible.confidence} source={collectible.source} />
              </div>

              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-foreground leading-tight">
                {collectible.title}
              </h1>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {collectible.description}
              </p>
            </div>

            {/* Photo / Image */}
            <div className="card-carbon overflow-hidden">
              <div className="relative h-72 sm:h-96 w-full bg-background">
                <img loading="lazy"
                  src={collectible.img}
                  alt={collectible.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-muted-foreground bg-muted/50 backdrop-blur-md px-3 py-2 rounded-lg border border-border">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Compass className="h-4 w-4 text-accent" /> Relative Map Coordinates: Top {collectible.coordinates.top} / Left {collectible.coordinates.left}
                  </span>
                  <Link
                    href={`/map?poi=${collectible.id}&top=${collectible.coordinates.top}&left=${collectible.coordinates.left}`}
                    className="text-primary hover:underline flex items-center gap-1 font-bold"
                  >
                    Open Live Map <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Step-by-Step Guide Tip */}
            <div className="card-carbon p-6 space-y-3 border-accent/30 bg-accent/5">
              <div className="flex items-center gap-2 text-accent font-bold text-sm uppercase tracking-wider">
                <Lightbulb className="h-4 w-4" /> Discovery Guide & Tactics
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {collectible.guideTip}
              </p>
            </div>

            {/* Requirements & Unlock Details */}
            <div className="card-carbon p-6 space-y-4">
              <h3 className="font-display text-base font-bold text-foreground uppercase tracking-wide">
                Requirements & Unlocks
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-card border border-border space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Prerequisites
                  </span>
                  <p className="text-xs text-foreground font-mono">
                    {collectible.requirements}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-gold/20 space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-gold-light flex items-center gap-1">
                    <Trophy className="h-3 w-3" /> Reward Upon Collection
                  </span>
                  <p className="text-xs text-amber-300 font-mono font-semibold">
                    {collectible.reward}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Action Box */}
            <div className="card-carbon p-6 space-y-4 border-primary/30">
              <h3 className="font-display text-base font-bold text-foreground uppercase tracking-wider">
                Atlas Status
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Track this collectible along with all other 100% completion milestones across Leonida.
              </p>
              <Link
                href="/tracker"
                className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2 font-bold uppercase tracking-wider"
              >
                <CheckCircle2 className="h-4 w-4" /> Open 100% Tracker
              </Link>
              <Link
                href="/map"
                className="btn-secondary w-full py-2.5 text-xs flex items-center justify-center gap-2 font-bold uppercase tracking-wider"
              >
                <MapPin className="h-4 w-4" /> View On Satellite Map
              </Link>
            </div>

            {/* Data Source Audit */}
            <div className="card-carbon p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> Data Confidence Audit
              </div>
              <div className="text-xs space-y-2">
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Classification:</span>
                  <span className="font-bold text-foreground">{collectible.confidence}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Verified Source:</span>
                  <span className="text-muted-foreground text-right truncate max-w-[160px]">
                    {collectible.source}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">District:</span>
                  <span className="text-accent font-semibold">{collectible.district}</span>
                </div>
              </div>
            </div>

            {/* Related Collectibles */}
            <div className="card-carbon p-6 space-y-4">
              <h4 className="font-display text-sm font-bold text-foreground uppercase tracking-wider">
                Other Collectibles
              </h4>
              <div className="space-y-3">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/collectibles/${item.slug}`}
                    className="block p-3 rounded-lg bg-card border border-border hover:border-primary/40 transition-colors group"
                  >
                    <div className="text-xs uppercase font-bold text-muted-foreground mb-0.5">
                      {item.category}
                    </div>
                    <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {item.title}
                    </div>
                    <div className="text-xs text-accent mt-1 flex items-center gap-1">
                      <MapPin className="h-2.5 w-2.5" /> {item.district}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
