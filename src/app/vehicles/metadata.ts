import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "GTA 6 Vehicles: Complete Cars List",
  description:
    "Every GTA 6 vehicle and car spotted in official footage, with evidence labels. Compare cars, bikes, boats and aircraft; unknown prices stay unverified.",
  alternates: { canonical: "/vehicles" },
  openGraph: {
    type: "website",
    url: "/vehicles",
    title: "GTA 6 Vehicles: Complete Cars List",
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
