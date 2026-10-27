import { SITE_CONFIG } from "@/lib/constants";
export const PUBLICATION = {
  name: "Taish Gaming",
  teamName: "Taish Gaming Editorial Team",
  teamPath: "/team",
  logo: "/img/taish-gaming-logo.png",
};
export function canonicalOrigin(candidate?: string | null) {
  try {
    const u = new URL(candidate || SITE_CONFIG.url);
    if (
      u.protocol === "https:" &&
      !u.username &&
      !u.password &&
      !u.hostname.endsWith("gta6atlas.com")
    )
      return u.origin;
  } catch {}
  return SITE_CONFIG.url;
}
