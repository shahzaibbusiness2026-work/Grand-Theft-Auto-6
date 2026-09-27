import { AppShell } from "@/components/app-shell";
import { WeaponsDbClient } from "./weapons-db-client";

export default function WeaponDatabasePage() {
  return (
    <AppShell>
      <WeaponsDbClient />
    </AppShell>
  );
}
