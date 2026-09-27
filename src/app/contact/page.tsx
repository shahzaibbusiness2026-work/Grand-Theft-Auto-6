import { Metadata } from "next";
import { SiteShell } from "@/components/shells";
import { ContactClient } from "./contact-client";

export const metadata: Metadata = {
  title: "Contact Us | GTA 6 Atlas",
  description: "Get in touch with the GTA 6 Atlas community team, report bugs, suggest map POIs, or ask inquiries.",
};

export default function ContactPage() {
  return (
    <SiteShell>
      <ContactClient />
    </SiteShell>
  );
}
