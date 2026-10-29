import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "GTA 6 Vehicle Catalog — Evidence & Comparisons",
  description:
    "GTA 6 vehicle catalog: cars, bikes, boats and aircraft spotted in official GTA 6 footage, with evidence labels for every identification. Performance, prices and availability stay unverified unless Rockstar sources them.",
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
