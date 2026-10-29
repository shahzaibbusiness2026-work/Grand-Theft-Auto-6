import Link from "next/link";
import { SiteShell } from "@/components/shells";
export const metadata = {
  title: "Editorial & Evidence Policy",
  description:
    "How Taish Gaming sources GTA 6 claims: official announcements, direct observations, attributed reporting and speculation, kept strictly separate.",
  alternates: { canonical: "/editorial-policy" },
  openGraph: {
    type: "website",
    url: "/editorial-policy",
    title: "Editorial & Evidence Policy",
    description:
      "How Taish Gaming sources GTA 6 claims: official announcements, direct observations, attributed reporting and speculation, kept strictly separate.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Editorial & Evidence Policy",
    description:
      "How Taish Gaming sources GTA 6 claims, and why unknowns stay unknown.",
  },
};
export default function Page() {
  return (
    <SiteShell>
      <article className="container-site max-w-3xl py-12 space-y-6 leading-relaxed">
        <h1 className="font-display text-4xl font-bold">
          Editorial & Evidence Policy
        </h1>
        <p>
          We distinguish official announcements, direct observations, attributed
          reporting and speculation. A source must support the specific claim
          being made. A car appearing in footage does not confirm its model
          name, top speed, price or customization.
        </p>
        <h2 className="text-2xl font-bold">Sources and review</h2>
        <p>
          Prefer Rockstar Games announcements and official footage. Record the
          source URL, page section or video timestamp, exact field supported,
          review date and reviewer. Attribute third-party reporting. Anonymous
          claims and community guesses remain labelled as speculation.
        </p>
        <h2 className="text-2xl font-bold">Unknowns stay unknown</h2>
        <p>
          Do not fill missing GTA VI data with GTA V values, class averages or
          invented numbers. Catalog statistics and comparison winners require
          approved field-specific evidence. Calculators are illustrative
          scenarios using user-entered assumptions, not predictions of the game
          economy.
        </p>
        <h2 className="text-2xl font-bold">Publishing and updates</h2>
        <p>
          Guides need a substantive body before publication. Reading time is
          calculated from that body. Incomplete guides and unreviewed catalog
          detail pages are excluded from the sitemap and marked noindex.
          Corrections should identify what changed and why; an update timestamp
          must reflect a real content change.
        </p>
        <h2 className="text-2xl font-bold">Independence and attribution</h2>
        <p>
          We are an unofficial fan publication. We do not claim special access
          or endorsement. AI-assisted drafts require the same human source
          review as other drafts. Promotional or affiliate relationships, if
          used, must be disclosed on the relevant page.
        </p>
        <p>
          <Link href="/corrections" className="underline">
            Send a correction or source
          </Link>{" "}
          ·{" "}
          <Link href="/team" className="underline">
            About the editorial byline
          </Link>
        </p>
      </article>
    </SiteShell>
  );
}
