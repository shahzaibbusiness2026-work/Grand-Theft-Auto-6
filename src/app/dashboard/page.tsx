import { DashboardView } from "./dashboard-view";
import { getDashboardStats } from "@/lib/services/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "100% Player Completion Tracker | GTA 6 Atlas",
  description:
    "Track your story missions, side jobs, collectibles, activities and Leonida completion progress with local sync.",
};

// Revalidate every 60 seconds so dashboard data stays fresh without full SSR cost
export const revalidate = 60;

/**
 * Dashboard Server Page — fetches live Supabase data and passes it to the client view.
 * Player-specific progress (completion %, activities) remains in localStorage
 * for zero-auth local tracking. Site-wide data (articles, DB counts) comes from Supabase.
 */
export default async function DashboardPage() {
  const stats = await getDashboardStats();
  return <DashboardView liveStats={stats} />;
}
