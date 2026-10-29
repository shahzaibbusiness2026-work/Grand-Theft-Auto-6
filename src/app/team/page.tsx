import { CONTRIBUTOR_CREDITS, authorIdentity } from "@/lib/editorial-authors";
import Link from "next/link";
import { SiteShell } from "@/components/shells";
export const metadata = {
  title: "Taish Gaming Editorial Team",
  alternates: { canonical: "/team" },
  openGraph: { url: "/team" },
};
export default function Page() {
  return (
    <SiteShell>
      <article className="container-site max-w-3xl py-12 space-y-6 leading-relaxed">
        <h1 id="editorial-team" className="font-display text-4xl font-bold">
          Taish Gaming Editorial Team
        </h1>
        <p>
          Taish Gaming is an independent fan publication about Grand Theft Auto
          VI, based in Pakistan. Articles attributed to the Taish Gaming
          Editorial Team use a shared editorial byline. That byline represents
          the publication, not a named individual.
        </p>
        <p>
          We have not published verified individual staff biographies or
          professional credentials. A shared byline should not be interpreted as
          proof of firsthand access to Rockstar Games, review copies or inside
          information.
        </p>
        <section aria-labelledby="contributor-credits" className="space-y-4">
          <h2 id="contributor-credits" className="text-2xl font-bold">
            Contributor credits
          </h2>
          <p>
            Some earlier articles retain named contributor credits from our
            publishing records. We have not verified individual biographies,
            credentials or first-hand access for these names. The publication
            remains the contact for corrections and authorship enquiries; these
            credits are not endorsements or verified professional profiles.
          </p>
          {CONTRIBUTOR_CREDITS.map((name) => (
            <section
              key={name}
              id={authorIdentity(name).path.split("#")[1]}
              className="rounded-xl border border-border p-4"
            >
              <h3 className="font-bold">{name}</h3>
              <p>
                Historical contributor credit. Verified biography and
                credentials have not been published. Include the article URL
                when contacting the editorial team.
              </p>
            </section>
          ))}
        </section>
        <p>
          Readers can reach the publication through our{" "}
          <Link href="/contact" className="underline">
            contact form
          </Link>
          . Please include the article URL when asking about its sourcing or
          authorship.
        </p>
        <p>
          Taish Gaming is not affiliated with Rockstar Games or Take-Two
          Interactive. GTA names, artwork and trademarks belong to their
          respective owners.
        </p>
      </article>
    </SiteShell>
  );
}
