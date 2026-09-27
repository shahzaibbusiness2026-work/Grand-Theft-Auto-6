import { AppShell } from "@/components/app-shell";
import { VehiclesDbClient } from "./vehicles-db-client";

export default function VehicleDatabasePage() {
  return (
    <AppShell>
      <VehiclesDbClient />
    </AppShell>
  );
}
