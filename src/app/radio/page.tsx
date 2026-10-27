import type { Metadata } from "next";
import { SiteShell } from "@/components/shells";
import { RadioClient } from "./radio-client";
export const metadata: Metadata = {
  title: "GTA 6 Radio Stations: Official Reveals and Sources",
  description:
    "Six GTA VI radio stations and hosts listed by Rockstar, with direct sources and a clear distinction between official reveals, trailer music and legacy stations.",
  alternates: { canonical: "/radio" },
  openGraph: { url: "/radio" },
  robots: { index: true, follow: true, "max-image-preview": "large" },
};
export default function RadioPage() {
  return (
    <SiteShell>
      <RadioClient />
    </SiteShell>
  );
}
