import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Characters",
  description: "Meet all confirmed and rumored characters in GTA 6 — protagonists, antagonists, law enforcement and civilians of Leonida.",
  openGraph: {
    title: "GTA 6 Characters — Meet the People of Leonida",
    description: "Explore detailed profiles of all characters in GTA 6.",
    images: [{ url: "/img/char-lucia.jpg", width: 1200, height: 630, alt: "Lucia Caminos" }],
  },
  alternates: { canonical: "/characters" },
};
