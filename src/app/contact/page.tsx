import { Metadata } from "next";
import { SiteShell } from "@/components/shells";
import { ContactClient } from "./contact-client";
import { faqs } from "@/lib/data";
import { serializeJsonLd } from "@/lib/utils";
import { pageOpenGraph } from "@/lib/page-metadata";

export const metadata: Metadata = {
    openGraph: pageOpenGraph("/contact"),
  title: "Contact Us",
  description: "Get in touch with the Taish Gaming community team, report bugs, suggest map POIs, or ask inquiries.",
  alternates: { canonical: "/contact" },
  };

export default function ContactPage() {
  // FAQPage mirrors the visible FAQ section below (same Q&As from @/lib/data).
  // Ahrefs, Nov 2026: this was the one FAQ page missing FAQPage schema.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
      />
      <ContactClient />
    </SiteShell>
  );
}
