import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Vehicles",
  description: "Browse the confirmed GTA 6 vehicle roster — cars, motorcycles, boats, helicopters and more across Leonida.",
  openGraph: {
    title: "GTA 6 Vehicles — Complete Database",
    description: "Browse the GTA 6 vehicle database: cars, bikes, boats, helicopters and planes.",
    images: [{ url: "/img/car-purple.jpg", width: 1200, height: 630, alt: "GTA 6 super car" }],
  },
  alternates: { canonical: "/vehicles" },
};
