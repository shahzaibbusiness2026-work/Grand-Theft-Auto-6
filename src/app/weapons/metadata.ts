import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "GTA 6 Weapons List",
  description:
    "Browse editorial GTA 6 weapon identifications, field-level evidence and source links. Unverified damage and availability stay unknown.",
  alternates: { canonical: "/weapons" },
  openGraph: {
    type: "website",
    url: "/weapons",
    title: "GTA 6 Weapons List",
    description:
      "GTA 6 weapon identifications and source reviews. Unsupported model names and gameplay values remain unverified.",
    images: [
      {
        url: "/img/ammu-nation.jpg",
        alt: "Ammu-Nation gun store in GTA VI",
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/img/ammu-nation.jpg"] },
};
