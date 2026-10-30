import React from "react";
import { Metadata } from "next";
import { SiteShell } from "@/components/shells";

export const metadata: Metadata = {
  openGraph: { url: "/disclaimer" },
  title: "Disclaimer",
  description:
    "Taish Gaming is an unofficial GTA VI fan site, not affiliated with Rockstar Games or Take-Two. Read our content, advertising, correction and takedown notices.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <SiteShell>
      <div className="container-site py-12 sm:py-16 max-w-4xl space-y-10">
        <div className="space-y-3">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Legal &amp; Compliance
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-foreground tracking-tight">
            Disclaimer
          </h1>
          <p className="text-xs text-muted-foreground">
            Last Updated: October 29, 2026
          </p>
        </div>

        <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground">1. Unofficial Fan Site</h2>
            <p>
              Taish Gaming is an unofficial fan site. It is not affiliated with,
              endorsed by, sponsored by, or connected to Rockstar Games or
              Take-Two Interactive in any way. Grand Theft Auto, GTA, GTA VI,
              and Rockstar Games names, logos, and artwork are trademarks or
              registered trademarks of their respective owners, and all rights
              remain with those owners.
            </p>
            <p>
              Screenshots, trailer stills, and artwork shown on this site are
              the property of Rockstar Games and are used for non-commercial
              editorial commentary only. A small number of game screenshots
              come from public game catalogs and are credited on the page
              where they appear. We claim no ownership over any of this
              imagery, and we do not remove source watermarks. If you are a
              rights holder and would like an image removed, please reach out
              through our contact page — takedown requests are handled first.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground">2. Pre-Launch Information</h2>
            <p>
              Grand Theft Auto VI has not been released yet (launch is scheduled
              for November 19, 2026). The information on this site is based on
              official trailers, previews, and public reporting. Anything that
              has not been officially confirmed is labelled with its evidence
              level — observed in official media, credible report, community
              identification, or speculation — and content will be corrected
              with first-hand gameplay information after launch.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground">3. No Guarantees</h2>
            <p>
              All content on this site is provided for general information and
              entertainment purposes only, on an as-is basis. We make no
              warranties about the accuracy, completeness, or reliability of any
              information, and we recommend verifying important details against
              official Rockstar Games sources.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground">4. Tools and Calculators</h2>
            <p>
              The tools and calculators on this site are fan-made planning
              helpers. They do not generate in-game money, RP, items, or
              unlocks, and they do not connect to Rockstar Games servers or to
              any player account. Figures they show are estimates or
              community-sourced values unless explicitly labelled as officially
              published.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground">5. Advertising</h2>
            <p>
              This site may display third-party advertisements. Advertisements
              are not endorsements: advertisers are solely responsible for the
              content of their ads, and an ad appearing on this site does not
              mean we recommend the advertised product or service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground">6. What We Do Not Publish</h2>
            <p>
              We do not publish cheats, money or RP generators, mod menus,
              exploits, or fake giveaways, and we do not present fan-made
              content as official Rockstar Games material. If you see anything
              on this site that looks like it breaks this rule, please report
              it through our contact page.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground">7. Corrections &amp; Takedowns</h2>
            <p>
              Pre-launch information changes fast and mistakes happen. When an
              error is pointed out to us, we correct it. Rights holders may
              request the removal of an image or other material at any time
              through our contact page, and such requests are prioritized.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground">8. External Links</h2>
            <p>
              This site may link to third-party websites. We are not
              responsible for the content, accuracy, or privacy practices of
              those external sites, and linking to them does not imply
              endorsement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground">9. Contact</h2>
            <p>
              If you have any questions about this disclaimer, please reach out
              through our{" "}
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
