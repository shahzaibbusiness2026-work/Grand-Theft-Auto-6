import { AppShell } from "@/components/app-shell";
import { VehiclesDbClient, type DbVehicleCard, type DbTopVehicle } from "./vehicles-db-client";
import { getAdminVehicles } from "@/lib/services/vehicles";
import { canonicalVehicles } from "@/lib/canonical-data";

export const dynamic = "force-dynamic";

function parseSpeed(s?: string | null): number {
  const n = parseInt(s || "", 10);
  return Number.isFinite(n) ? Math.min(99, Math.round(n / 2.4)) : 70;
}
function parseAccel(s?: string | null): number {
  const n = parseFloat(s || "");
  return Number.isFinite(n) ? Math.max(40, Math.min(99, Math.round(110 - n * 15))) : 70;
}
function parseHandling(s?: string | null): number {
  const n = parseInt(s || "", 10);
  return Number.isFinite(n) ? n : 70;
}
function parseBraking(v: { handling?: string; weight?: string }): number {
  const n = parseInt(v.handling || "", 10);
  return Number.isFinite(n) ? Math.max(40, Math.min(99, 100 - Math.round(n / 4))) : 70;
}

export default async function VehicleDatabasePage() {
  // Live catalog from Supabase; falls back to the built-in sample client-side.
  let vehicles: DbVehicleCard[] = [];
  let top: DbTopVehicle[] = [];
  try {
    const rows = await getAdminVehicles();
    const published = rows.filter((v) => v.status === "published");
    vehicles = published.map((v) => {
      const canonical = canonicalVehicles.find(
        (c) => c.id.toLowerCase() === v.id.toLowerCase() || c.name.toLowerCase() === v.name.toLowerCase()
      );
      return {
        name: v.name,
        klass: `${v.class} • ${v.manufacturer}`,
        price: canonical?.priceDisplay || "TBD",
        img: v.images?.[0] || canonical?.img || "/img/car-orange.jpg",
        stats: [parseSpeed(v.topSpeed), parseAccel(v.acceleration), parseHandling(v.handling), parseBraking({ handling: v.handling })],
      };
    });
    top = [...published]
      .sort((a, b) => parseSpeed(b.topSpeed) - parseSpeed(a.topSpeed))
      .slice(0, 5)
      .map((v, i) => ({
        rank: i + 1,
        name: v.name,
        stat: v.topSpeed || "—",
        img: v.images?.[0] || "/img/car-orange.jpg",
      }));
  } catch {
    // Static fallback renders
  }

  return (
    <AppShell>
      <VehiclesDbClient vehicles={vehicles} top={top} />
    </AppShell>
  );
}
