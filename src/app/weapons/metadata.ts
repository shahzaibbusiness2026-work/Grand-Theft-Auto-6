import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "GTA 6 Weapons List: Full Catalog",
  description:
    "Every GTA 6 weapon spotted in official footage, with evidence labels. Compare guns and melee weapons; unknown damage, prices and availability stay unverified.",
  alternates: { canonical: "/weapons" },
  openGraph: {
    type: "website",
    url: "/weapons",
    title: "GTA 6 Weapons List: Full Catalog",
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
