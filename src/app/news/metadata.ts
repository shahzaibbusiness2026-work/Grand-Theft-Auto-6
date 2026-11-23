import type { Metadata } from "next";
const title = "GTA 6 News, Updates & Analysis";
const description = "Read the latest GTA 6 news, Rockstar announcements, gameplay analysis and Leonida guides from the independent Taish Gaming editorial team.";
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
