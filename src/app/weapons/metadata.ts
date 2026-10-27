import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "GTA 6 Weapon Catalog — Evidence & Comparisons",
  description:
    "Browse editorial GTA VI identifications, save favorites and compare reviewed evidence. Performance, prices and availability remain unverified unless sourced.",
  alternates: { canonical: "/weapons" },
  openGraph: {
    url: "/weapons",
    title: "GTA 6 Weapon Catalog",
    description:
      "Editorial identifications and field-specific evidence. Unknown values stay unverified.",
    images: [
      {
        url: "/img/hero-dark.jpg",
        alt: "Editorial illustration for the weapon catalog",
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/img/hero-dark.jpg"] },
};
