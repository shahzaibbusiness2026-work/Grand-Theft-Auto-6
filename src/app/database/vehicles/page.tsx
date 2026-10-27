import { permanentRedirect } from "next/navigation";
export default function LegacyCatalog() {
  permanentRedirect("/vehicles");
}
