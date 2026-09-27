import { AppShell } from "@/components/app-shell";
import { GuidesClient } from "./guides-client";
import { getPublicGuides } from "@/lib/services/guides";

export const dynamic = "force-dynamic";

export default async function GuidesPage() {
  // Live guides from Supabase; empty array falls back to the static set client-side.
  let guides = [] as Awaited<ReturnType<typeof getPublicGuides>>;
  try {
    guides = await getPublicGuides();
  } catch {
    // Static fallback renders
  }

  return (
    <AppShell>
      <GuidesClient guides={guides} />
    </AppShell>
  );
}
