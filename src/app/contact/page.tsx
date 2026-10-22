import { Metadata } from "next";
import { SiteShell } from "@/components/shells";
import { ContactClient } from "./contact-client";

export const metadata: Metadata = {
  title: "Contact Us | PixelSpot Gaming",
  description: "Get in touch with the PixelSpot Gaming community team, report bugs, suggest map POIs, or ask inquiries.",
  alternates: { canonical: "/contact" },
  };

export default function ContactPage() {
  return (
    <SiteShell>
      <ContactClient />
    </SiteShell>
  );
}
