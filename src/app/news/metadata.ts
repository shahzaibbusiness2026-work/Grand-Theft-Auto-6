import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "News & Articles",
  description: "Stay updated with the latest GTA 6 news, trailers, gameplay reveals, character updates and community articles.",
  openGraph: {
    title: "GTA 6 News & Articles",
    description: "Latest news, articles and updates from the world of GTA 6.",
    images: [{ url: "/img/hero-dark.jpg", width: 1200, height: 630, alt: "GTA 6 news" }],
  },
  alternates: { canonical: "/news" },
};
