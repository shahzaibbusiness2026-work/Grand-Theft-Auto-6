import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  requirePlayer,
  PlayerError,
  publicPlayerProfile,
} from "@/lib/auth/player-account";
import { DashboardShell } from "./dashboard-shell";
export const metadata: Metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default async function PlayerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let initialProfile;
  try {
    const { account } = await requirePlayer();
    initialProfile = publicPlayerProfile(account);
  } catch (error) {
    if (error instanceof PlayerError && error.status === 401)
      redirect("/login");
    throw error;
  }
  return (
    <DashboardShell initialProfile={initialProfile}>{children}</DashboardShell>
  );
}
