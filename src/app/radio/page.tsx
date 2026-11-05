import type { Metadata } from "next";
import { SiteShell } from "@/components/shells";
import { RadioClient } from "./radio-client";
import { getWorldMedia } from "@/lib/world-media";
const radioImage = getWorldMedia("/radio")!;
export const metadata: Metadata = {
  title: "GTA 6 Radio Stations: Official Reveals",
  description:
    "Six GTA VI radio stations and hosts listed by Rockstar, with direct sources. Official reveals separated from trailer music and legacy stations.",
  alternates: { canonical: "/radio" },
  openGraph: {
    url: "/radio",
    images: [
      {
        url: radioImage.src,
        alt: radioImage.alt,
        width: radioImage.width,
        height: radioImage.height,
      },
    ],
  },
  twitter: { card: "summary_large_image", images: [radioImage.src] },
  robots: { index: true, follow: true, "max-image-preview": "large" },
};
export default function RadioPage() {
  return (
    <SiteShell>
      <RadioClient />
    </SiteShell>
  );
}
