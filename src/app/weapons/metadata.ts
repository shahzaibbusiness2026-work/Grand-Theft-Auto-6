import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "GTA 6 Weapon Catalog — Evidence & Comparisons",
  description:
    "GTA 6 weapon catalog: pistols, rifles, shotguns and melee weapons seen in official GTA 6 footage, with evidence labels for every identification. Damage, prices and availability stay unverified unless Rockstar sources them.",
  alternates: { canonical: "/weapons" },
  openGraph: {
    type: "website",
    url: "/weapons",
    title: "GTA 6 Weapon Catalog",
    description:
      "GTA 6 weapons seen in official footage, with evidence labels. Unknown values stay unverified.",
    images: [
      {
        url: "/img/hero-dark.jpg",
        alt: "Editorial illustration for the weapon catalog",
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/img/hero-dark.jpg"] },
};
