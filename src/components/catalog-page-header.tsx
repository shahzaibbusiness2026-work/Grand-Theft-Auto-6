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
        src={vehicles ? "/img/car-purple.jpg" : "/img/world-evidence/gta-6-handgun-robbery-scene-trailer-1.webp"}
        alt=""
        fill
        sizes="100vw"
        className={styles.heroImage}
        priority
      />
      <div className={styles.heroShade} />
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
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
          {compare ? "Compare evidence" : "Field-specific evidence"}
        </p>
        <h1 className={styles.title}>
          GTA 6{" "}
          <span className={styles.titleAccent}>
            {compare ? `${vehicles ? "Vehicle" : "Weapon"} Comparison` : `${label} Database`}
          </span>
        </h1>
        <p className={styles.heroDescription}>
          {compare
            ? `Compare up to four ${kind} side by side. Open a source review to see which GTA 6 details each source supports.`
            : vehicles
              ? "Browse GTA 6 cars, motorcycles, boats and aircraft. See source reviews for reported appearances and compare your picks."
              : "Browse the GTA 6 weapon catalog, from handguns to melee items. See source reviews for reported appearances and compare your picks."}
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
