import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "GTA 6 Vehicles List: Cars, Boats & Evidence",
  description:
    "Browse editorial GTA 6 vehicle identifications and reviewed evidence. Compare cars, bikes, boats and aircraft; unsupported prices and performance stay unknown.",
  alternates: { canonical: "/vehicles" },
  openGraph: {
    type: "website",
    url: "/vehicles",
    title: "GTA 6 Vehicles List: Cars, Boats & Evidence",
    description:
      "GTA 6 vehicle identifications, source reviews and comparisons. Unsupported model names and gameplay values remain unverified.",
    images: [
      {
        url: "/img/car-purple.jpg",
        alt: "Editorial illustration for the vehicle catalog",
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/img/car-purple.jpg"] },
};
