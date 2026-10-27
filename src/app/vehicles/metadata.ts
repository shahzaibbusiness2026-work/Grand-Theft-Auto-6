import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "GTA 6 Vehicle Catalog — Evidence & Comparisons",
  description:
    "Browse editorial GTA VI identifications, save favorites and compare reviewed evidence. Performance, prices and availability remain unverified unless sourced.",
  alternates: { canonical: "/vehicles" },
  openGraph: {
    url: "/vehicles",
    title: "GTA 6 Vehicle Catalog",
    description:
      "Editorial identifications and field-specific evidence. Unknown values stay unverified.",
    images: [
      {
        url: "/img/car-purple.jpg",
        alt: "Editorial illustration for the vehicle catalog",
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/img/car-purple.jpg"] },
};
