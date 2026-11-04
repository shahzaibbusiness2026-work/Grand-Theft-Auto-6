import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "GTA 6 Weapons List",
  description:
    "GTA 6 weapons list: every weapon spotted in official footage, with evidence labels. No damage or availability stats are claimed.",
  alternates: { canonical: "/weapons" },
  openGraph: {
    type: "website",
    url: "/weapons",
    title: "GTA 6 Weapons List",
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
