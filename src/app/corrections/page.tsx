import Link from "next/link";
import { SiteShell } from "@/components/shells";
export const metadata = {
  title: "Corrections & Source Submissions",
  description:
    "Report an error on Taish Gaming or submit a primary source for a GTA 6 claim: include the page URL, the disputed statement and the source.",
  alternates: { canonical: "/corrections" },
  openGraph: {
    type: "website",
    url: "/corrections",
    title: "Corrections & Source Submissions",
    description:
      "Report an error on Taish Gaming or submit a primary source for a GTA 6 claim.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Corrections & Source Submissions",
    description:
      "Report an error or submit a primary source for a GTA 6 claim.",
  },
};
export default function Page() {
  return (
    <SiteShell>
      <article className="container-site max-w-3xl py-12 space-y-6 leading-relaxed">
        <h1 className="font-display text-4xl font-bold">
          Corrections & Source Submissions
        </h1>
        <p>
          Use our{" "}
          <Link href="/contact" className="underline">
            contact form
          </Link>{" "}
          to report an error. Include the page URL, the exact disputed
          statement, a proposed correction and a primary source URL or video
          timestamp where possible. Do not include passwords or other private
          credentials.
        </p>
        <p>
          The editorial team reviews the evidence before changing a claim.
          Submitting a source does not automatically verify an entry. Material
          corrections should be described on the affected article with the date
          and reason for the change.
        </p>
        <p>
          We cannot promise a response time. Reports about privacy, account data
          or artwork rights can use the same contact form and should clearly
          state the nature of the request.
        </p>
        <p>
          <Link href="/editorial-policy" className="underline">
            Our editorial policy
          </Link>{" "}
          explains how evidence is assessed.
        </p>
      </article>
    </SiteShell>
  );
}
