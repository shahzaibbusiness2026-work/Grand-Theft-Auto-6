import { Metadata } from "next";
import { SiteShell } from "@/components/shells";
import { ContactClient } from "./contact-client";

export const metadata: Metadata = {
    openGraph: { url: "/contact" },
  title: "Contact Us",
  description: "Get in touch with the Taish Gaming community team, report bugs, suggest map POIs, or ask inquiries.",
  alternates: { canonical: "/contact" },
  };

export default function ContactPage() {
  return (
    <SiteShell>
      <ContactClient />
    </SiteShell>
  );
}
