import type { Metadata } from "next";
import { SiteShell } from "@/components/shells";
import { RadioClient } from "./radio-client";
import { getWorldMedia } from "@/lib/world-media";
const radioImage = getWorldMedia("/radio")!;
export const metadata: Metadata = {
  title: "GTA 6 Radio Stations, Hosts and Official Previews",
  description:
    "Find GTA 6 radio stations by genre or host, listen to Rockstar's seven station previews, and find the soundtrack or original score.",
  alternates: { canonical: "/radio" },
  openGraph: { type: "website",
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
