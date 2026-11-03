import Link from "next/link";
import {
  ArrowRight,
  Car,
  Crosshair,
  ChevronRight,
  Layers2,
} from "lucide-react";
import { SafeImage } from "@/components/safe-image";
import type { CatalogKind } from "@/lib/catalog-evidence";
import styles from "./catalog-ui.module.css";

export function CatalogPageHeader({
  kind,
  compare = false,
  count,
  categories,
}: {
  kind: CatalogKind;
  compare?: boolean;
  count: number;
  categories: number;
}) {
  const vehicles = kind === "vehicles";
  const label = vehicles ? "Vehicles" : "Weapons";
  const Icon = vehicles ? Car : Crosshair;
  return (
    <header className={styles.hero}>
      <SafeImage
        src={vehicles ? "/img/car-purple.jpg" : "/img/hero-vice-skyline-hd.jpg"}
        alt={vehicles ? "GTA 6 vehicle showcase" : "Vice City skyline, GTA 6 artwork"}
        fill
        sizes="100vw"
        className={styles.heroImage}
        priority
      />
      <div className={styles.heroShade} />
      <div className={styles.heroInner}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
          <Link href="/">Home</Link>
          <ChevronRight size={12} aria-hidden="true" />
          {compare ? (
            <>
              <Link href={"/" + kind}>{label}</Link>
              <ChevronRight size={12} aria-hidden="true" />
              <span aria-current="page">Comparison</span>
            </>
          ) : (
            <span aria-current="page">{label}</span>
          )}
        </nav>
        <p className={styles.eyebrow}>
          <Icon size={15} aria-hidden="true" />
          {compare ? "Side by side. Every detail." : "The Leonida collection"}
        </p>
        <h1 className={styles.title}>
          {compare ? (
            <>
              {label === "Vehicles" ? "Vehicle" : "Weapon"}{" "}
              <span className={styles.titleAccent}>comparison.</span>
            </>
          ) : (
            <>
              Explore the{" "}
              <span className={styles.titleAccent}>
                {vehicles ? "garage." : "armory."}
              </span>
            </>
          )}
        </h1>
        <p className={styles.heroDescription}>
          {compare
            ? `Build your ${vehicles ? "garage" : "loadout"} shortlist. Compare up to four ${kind}, explore every field, and check the evidence behind each detail.`
            : `Discover the GTA VI ${vehicles ? "vehicle" : "weapon"} catalog. Find your favorites, inspect source reviews, and bring your picks into a detailed comparison.`}
        </p>
        <div className={styles.heroActions}>
          <Link
            className={styles.primary}
            href={compare ? "#comparison-workspace" : "#catalog-browser"}
          >
            {compare ? (
              <>
                <Layers2 size={16} aria-hidden="true" />
                Build comparison
              </>
            ) : (
              <>
                Browse {kind}
                <ArrowRight size={16} aria-hidden="true" />
              </>
            )}
          </Link>
          <Link
            className={styles.secondary}
            href={(compare ? "/" : "/compare/") + kind}
          >
            {compare ? `Browse all ${kind}` : `Compare ${kind}`}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <div className={styles.heroStats}>
          <span>
            <strong>{count}</strong> catalog entries
          </span>
          <span>
            <strong>{categories}</strong> categories
          </span>
          <span>Field-specific source reviews</span>
        </div>
      </div>
    </header>
  );
}

export function CatalogSwitcher({
  kind,
  compare = false,
}: {
  kind: CatalogKind;
  compare?: boolean;
}) {
  return (
    <nav
      aria-label={compare ? "Comparison tools" : "Catalogs"}
      className={styles.switcher}
    >
      {(["vehicles", "weapons"] as const).map((k) => {
        const Icon = k === "vehicles" ? Car : Crosshair;
        return (
          <Link
            key={k}
            href={(compare ? "/compare/" : "/") + k}
            aria-current={kind === k ? "page" : undefined}
          >
            <Icon size={16} aria-hidden="true" />
            {k === "vehicles" ? "Vehicles" : "Weapons"}
          </Link>
        );
      })}
    </nav>
  );
}
