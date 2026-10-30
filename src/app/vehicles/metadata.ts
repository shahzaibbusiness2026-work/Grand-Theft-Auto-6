import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "GTA 6 Vehicle Catalog — Evidence & Comparisons",
  description:
    "Browse GTA 6 vehicle identifications with evidence labels. Compare cars, bikes, boats and aircraft; unknown prices and performance stay unverified.",
  alternates: { canonical: "/vehicles" },
  openGraph: {
    type: "website",
    url: "/vehicles",
    title: "GTA 6 Vehicle Catalog",
    description:
      "GTA 6 vehicles spotted in official footage, with evidence labels. Unknown values stay unverified.",
    images: [
      {
        url: "/img/car-purple.jpg",
        alt: "Editorial illustration for the vehicle catalog",
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/img/car-purple.jpg"] },
};
