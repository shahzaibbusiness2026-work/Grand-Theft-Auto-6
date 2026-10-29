import React from "react";
import { Metadata } from "next";
import { SiteShell } from "@/components/shells";

export const metadata: Metadata = {
  openGraph: { url: "/terms" },
  title: "Terms of Service",
  description: "Terms of service for Taish Gaming, including accounts, tools and estimates, advertising, and acceptable use.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <SiteShell>
      <div className="container-site py-12 sm:py-16 max-w-4xl space-y-10">
        <div className="space-y-3">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Legal &amp; Compliance
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-foreground tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-muted-foreground">
            Last Updated: October 29, 2026
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            These terms govern your use of Taish Gaming. Taish Gaming is an independent, unofficial fan site — it is not affiliated with, endorsed by, or connected to Rockstar Games or Take-Two Interactive. If you do not agree to these terms, please do not use the site.
          </p>
        </div>

        <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Taish Gaming website, tools, interactive maps, or APIs, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground">2. Intellectual Property &amp; Fair Use</h2>
            <p>
              Grand Theft Auto, GTA, Rockstar Games, Take-Two Interactive, and their associated logos, characters, artwork, and titles are trademarks and/or registered trademarks of Take-Two Interactive Software, Inc. and Rockstar Games.
            </p>
            <p>
              All game content, screenshots, and references displayed on this site are utilized strictly for informational, educational, and commentary purposes under fair use doctrine. Original commentary, database curation, software code, and UI design are the property of Taish Gaming.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground">3. Your Account</h2>
            <p>
              Some features, such as the player dashboard and favorites, require a Taish Gaming account. You are responsible for keeping your login details safe and for everything done under your account. Do not share your password, and tell us through the contact page if you believe your account has been misused. We may suspend or close accounts that abuse the site or break these terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground">4. Acceptable Use Policy</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Deploy automated scrapers, bots, or extraction scripts that impose disproportionate load on our infrastructure.</li>
              <li>Attempt to circumvent security headers, reverse-engineer API endpoints, or conduct unauthorized vulnerability scanning.</li>
              <li>Transmit harmful payloads, spam, or malicious commentary through interactive forms.</li>
              <li>Impersonate another person, or submit someone else’s private information through any form on this site.</li>
              <li>Present our tools’ estimates or fan-made content as official Rockstar Games information.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground">5. Tools, Calculators &amp; Estimates</h2>
            <p>
              The tools and calculators on this site are fan-made planning helpers. Stats, prices, earnings, and completion figures shown by them are estimates or community-sourced values unless they are explicitly labelled as officially published. They do not generate in-game money, RP, items, or unlocks, and they do not connect to Rockstar Games servers or to any player account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground">6. Third-Party Links &amp; Advertising</h2>
            <p>
              This site may link to third-party websites and may display third-party advertisements. We are not responsible for the content, accuracy, or privacy practices of external sites or advertisers, and linking to them or showing their ads does not imply endorsement. Advertisers are solely responsible for the content of their advertisements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground">7. Disclaimer of Warranties</h2>
            <p>
              Taish Gaming is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind, either express or implied. Information regarding unreleased gameplay mechanics or release windows is subject to change at any time by Rockstar Games, and pre-launch information on this site may turn out to be incomplete or incorrect.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground">8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Taish Gaming is not liable for any loss or damage arising from your use of, or reliance on, pre-launch information, estimates, or fan-made tools on this site. Use the site’s information at your own judgment, and verify important details against official Rockstar Games sources.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground">9. Changes to These Terms</h2>
            <p>
              We may update these terms from time to time. When we do, the “Last Updated” date at the top of this page changes. Continued use of the site after an update means you accept the updated terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground">10. Contact</h2>
            <p>
              If you have any questions about these terms, please reach out through our{" "}
              <a href="/contact" className="text-foreground underline">
                contact page
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
