import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { WeaponsDbClient, type DbWeaponCard, type DbTopWeapon } from "./weapons-db-client";
import { getPublicWeaponCatalog, type WeaponCatalogRow } from "@/lib/services/weapons";
import { canonicalWeapons } from "@/lib/canonical-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Weapon Database",
  description:
    "Browse every confirmed GTA 6 weapon with live stats — damage, fire rate, range and handling, updated from the Atlas CMS.",
  alternates: { canonical: "/database/weapons" },
};

function parseScore(s?: string | null): number {
  const n = parseInt((s || "").split("/")[0], 10);
  return Number.isFinite(n) ? Math.min(99, n) : 50;
}

export default async function WeaponDatabasePage() {
  // Live published catalog from Supabase via the public anon client;
  // falls back to the built-in sample client-side when empty.
  let weapons: DbWeaponCard[] = [];
  let top: DbTopWeapon[] = [];
  try {
    const published: WeaponCatalogRow[] = await getPublicWeaponCatalog();
    weapons = published.map((w) => {
      const canonical = canonicalWeapons.find(
        (c) => c.id.toLowerCase() === w.id.toLowerCase() || c.name.toLowerCase() === w.name.toLowerCase()
      );
      // notes embeds "Handling X/100 • Reload ... • $price • Rarity: Y"
      const priceMatch = /\$\d[\d,]*/.exec(w.notes || "");
      const rarityMatch = /Rarity:\s*(\w+)/.exec(w.notes || "");
      return {
        name: w.name,
        klass: w.category,
        price: canonical?.priceDisplay || w.price_display || priceMatch?.[0] || "TBD",
        rarity: canonical?.rarity || w.rarity || rarityMatch?.[1] || "Common",
        stats: [
          parseScore(w.damage),
          parseScore(w.rate_of_fire),
          parseScore(w.range),
          Math.max(20, Math.min(99, 100 - parseScore(w.damage))),
        ],
      };
    });
    top = [...published]
      .sort((a, b) => parseScore(b.damage) - parseScore(a.damage))
      .slice(0, 5)
      .map((w, i) => ({
        rank: i + 1,
        name: w.name,
        klass: w.category,
        score: (parseScore(w.damage) / 10).toFixed(1),
      }));
  } catch {
    // Static fallback renders
  }

  return (
    <AppShell>
      <WeaponsDbClient weapons={weapons} top={top} />
    </AppShell>
  );
}
