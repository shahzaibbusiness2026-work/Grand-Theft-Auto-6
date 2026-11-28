import type { Metadata } from "next";
const title = "GTA 6 News & Updates: Rockstar, PS5 and Xbox";
const description = "Follow GTA 6 news, Rockstar announcements, console performance, map updates and documented locations in Leonida.";
export const metadata: Metadata = {
  title,
  description,
  openGraph: { type: "website", url: "/news",
    title,
    description,
    images: [{ url: "/img/hero-vice-skyline-hd.jpg", width: 1200, height: 630, alt: "GTA 6 news" }],
  },
  alternates: { canonical: "/news" },
};
