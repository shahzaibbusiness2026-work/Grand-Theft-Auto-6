import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Vehicles",
  description: "Browse all 450+ confirmed vehicles in GTA 6 — cars, motorcycles, boats, helicopters and more across Leonida.",
  openGraph: {
    title: "GTA 6 Vehicles — Complete Database",
    description: "Browse all 450+ vehicles in GTA 6: cars, bikes, boats, helicopters and planes.",
    images: [{ url: "/img/car-purple.jpg", width: 1200, height: 630, alt: "GTA 6 super car" }],
  },
  alternates: { canonical: "/vehicles" },
};
