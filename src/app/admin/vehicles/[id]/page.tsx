import { getAdminVehicleById } from "@/lib/services/vehicles";
import { VehicleEditor } from "./vehicle-editor";

export const dynamic = "force-dynamic";

export default async function VehicleEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicle = await getAdminVehicleById(id);
  return <VehicleEditor initialVehicle={vehicle} vehicleId={id} />;
}
