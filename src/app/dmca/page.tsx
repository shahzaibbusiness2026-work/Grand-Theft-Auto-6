import React from "react";
import { Metadata } from "next";
import { SiteShell } from "@/components/shells";

export const metadata: Metadata = {
  title: "DMCA & Copyright Policy | GTA 6 Atlas",
  description: "DMCA takedown and copyright infringement policy for GTA 6 Atlas. How to submit a copyright complaint or counter-notice.",
  alternates: { canonical: "/dmca" },
};

export default function DMCAPage() {
  return (
    <SiteShell>
      <div className="container-site py-12 sm:py-16 max-w-4xl space-y-10">
        <div className="space-y-3">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Legal & Compliance
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-foreground tracking-tight">
            DMCA & Copyright Policy
          </h1>
          <p className="text-xs text-muted-foreground">
            Last Updated: October 18, 2026
          </p>
        </div>

        <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground">1. Our Commitment</h2>
            <p>
              GTA 6 Atlas respects the intellectual property rights of others and complies with the Digital Millennium Copyright Act (DMCA) and applicable international copyright laws. We respond promptly to valid takedown notices and take repeat infringement seriously.
            </p>
            <p>
              GTA 6 Atlas is an unofficial fan site. We do not claim ownership of Grand Theft Auto, GTA, Rockstar Games, Take-Two Interactive, or any associated trademarks, characters, artwork, or titles — these belong to their respective owners.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground">2. Filing a Takedown Notice</h2>
            <p>
              If you believe that content on GTA 6 Atlas infringes your copyright, you may submit a takedown notice. Under the DMCA, your notice must include:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>A physical or electronic signature of the copyright owner or authorized agent.</li>
              <li>Identification of the copyrighted work claimed to have been infringed.</li>
              <li>Identification of the infringing material, including the specific URL(s) on our site.</li>
              <li>Your contact information: name, address, telephone number, and email address.</li>
              <li>A statement that you have a good faith belief that the use is not authorized by the copyright owner, its agent, or the law.</li>
              <li>A statement that the information in the notice is accurate, and under penalty of perjury, that you are authorized to act on behalf of the copyright owner.</li>
            </ul>
            <p>
              Send takedown notices to our designated copyright agent via the <a href="/contact" className="underline font-semibold hover:text-foreground">contact page</a> with the subject line &quot;DMCA Takedown Request&quot;.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground">3. Counter-Notice Procedure</h2>
            <p>
              If your content was removed due to a takedown notice and you believe the removal was a mistake or misidentification, you may file a counter-notice including:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Your physical or electronic signature.</li>
              <li>Identification of the removed material and its prior location (URL).</li>
              <li>A statement under penalty of perjury that you have a good faith belief the material was removed by mistake or misidentification.</li>
              <li>Your name, address, telephone number, and consent to the jurisdiction of the federal courts in your district.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground">4. Repeat Infringers</h2>
            <p>
              In accordance with the DMCA, we maintain a policy of terminating accounts and access for users who are determined to be repeat infringers of copyrighted material.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground">5. Fair Use</h2>
            <p>
              Content on GTA 6 Atlas — including game references, database entries, commentary, and analysis — is published for informational, educational, and commentary purposes. All original commentary, database curation, software code, and UI design are the property of GTA 6 Atlas.
            </p>
            <p>
              Trailer videos embedded on this site are hosted by YouTube and streamed from Rockstar Games&apos; official channel. We do not host or redistribute copyrighted video files.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground">6. Contact</h2>
            <p>
              For all copyright-related inquiries, please use our <a href="/contact" className="underline font-semibold hover:text-foreground">contact page</a> with the subject line &quot;DMCA&quot; or &quot;Copyright&quot;. We aim to respond to valid notices within 48 hours.
            </p>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
