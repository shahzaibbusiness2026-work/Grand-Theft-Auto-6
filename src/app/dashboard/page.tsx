import { DashboardView } from "./dashboard-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "100% Player Completion Tracker | GTA 6 Atlas",
  description: "Track your story missions, side jobs, collectibles, activities and Leonida completion progress with local sync.",
};

export default function DashboardPage() {
  return <DashboardView />;
}
