import { DashboardView } from "./dashboard-view";
import { getDashboardStats } from "@/lib/services/queries";
import type { Metadata } from "next";
import { requirePlayer } from "@/lib/auth/player-account";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "View your saved GTA 6 vehicles, weapons, map progress and loadouts alongside Taish Gaming's current catalog.",
  // Personal progress tool, not indexable content.
  robots: { index: false, follow: false },
};

// Personalized pages require a current, verified account session.
export const dynamic = "force-dynamic";

/**
 * Dashboard Server Page — fetches live Supabase data and passes it to the client view.
 * Private progress is synchronized by the player provider; public catalog
 * counts and articles come from the published data source.
 */
export default async function DashboardPage() {
  const [stats, { account }] = await Promise.all([
    getDashboardStats(),
    requirePlayer(),
  ]);
  return (
    <DashboardView
      liveStats={stats}
      playerName={account.display_name || account.first_name || "Player"}
    />
  );
}
