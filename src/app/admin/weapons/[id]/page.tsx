import { getAdminWeaponById } from "@/lib/services/weapons";
import { WeaponEditor } from "./weapon-editor";

export const dynamic = "force-dynamic";

export default async function WeaponEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const weapon = await getAdminWeaponById(id);
  return <WeaponEditor initialWeapon={weapon} weaponId={id} />;
}
