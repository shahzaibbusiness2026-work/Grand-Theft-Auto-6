import { PrivacyControls } from "@/components/optional-integrations";
import Link from "next/link";
import { SiteShell } from "@/components/shells";
export const metadata = {
  title: "Privacy Policy",
  description:
    "What Taish Gaming stores when you browse, subscribe, contact us or create an account, including cookies, advertising and deletion requests.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    type: "website",
    url: "/privacy",
    title: "Privacy Policy",
    description:
      "What Taish Gaming stores when you browse, subscribe, contact us or create an account.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy",
    description:
      "What Taish Gaming stores, including cookies, advertising and deletion requests.",
  },
};
export default function Page() {
  return (
    <SiteShell>
      <article className="container-site max-w-3xl py-12 space-y-6 leading-relaxed">
        <h1 className="font-display text-4xl font-bold">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">
          Updated October 28, 2026
        </p>
        <p>
          The operator is Taish Gaming, based in Pakistan. Taish Gaming is an
          independent fan website. This page describes the features implemented
          on the site. For privacy questions, deletion requests or to identify
          the operator responsible for a request, use our{" "}
          <Link href="/contact?topic=privacy" className="underline">
            contact form
          </Link>
          . A postal contact address has not been provided for publication.
        </p>
        <h2 className="text-2xl font-bold">Browser storage</h2>
        <p>
          The site uses browser storage for theme preferences, favorites,
          tracker progress, notes, loadouts and recently viewed entries. This
          local data can remain until you clear it in your browser. Signing in
          does not by itself provide a verified cross-device backup of these
          records. Clearing browser storage can remove local progress.
        </p>
        <h2 className="text-2xl font-bold">Accounts and security</h2>
        <p>
          Account creation sends your email address, supplied profile names and
          authentication information to the server. Site accounts store password
          hashes, recovery-code hashes, provider associations and sign-in
          metadata; plaintext passwords and recovery codes are not stored as
          account records. Account and admin sessions use cookies. Supabase
          supports database storage and authentication integrations. Optional
          sign-in providers process information under their own policies.
        </p>
        <h2 className="text-2xl font-bold">Newsletter and contact forms</h2>
        <p>
          Newsletter signup stores your email address and subscription date on
          the server. The current form adds your address directly; it does not
          require an email confirmation. Email delivery uses Resend when
          configured. Contact submissions send the fields you provide, including
          your message and contact details, to the server for review and
          replies. New newsletter emails include signed unsubscribe links with a
          confirmation page. Use the contact form for older unsubscribe links or
          to request deletion of account or contact records. We may need to
          verify control of an account before acting.
        </p>
        <h2 className="text-2xl font-bold">Technical data and third parties</h2>
        <p>
          Hosting and security systems may process network addresses, request
          paths, browser information and timestamps for delivery, diagnostics
          and abuse prevention. Rate limiting processes request identifiers.
          YouTube videos load third-party content when you activate a video.
          Links to external sites are governed by their policies.
        </p>
        <p>
          Plausible analytics and Google AdSense are optional integrations
          enabled by site configuration. They load on public pages only after
          you allow optional services in this browser. When allowed, requests
          are sent to those providers; advertising can use cookies or similar
          technologies. You can change your choice at any time in the cookie
          controls on this page, and in your browser settings.
        </p>
        <PrivacyControls />
        <h2 className="text-2xl font-bold">Retention and deletion</h2>
        <p>
          Effective 28 October 2026, Taish Gaming uses the following manual
          review policy. These are operational targets; an automatic cleanup job
          is not currently running.
        </p>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Contact messages:</strong> review resolved messages for
            deletion 90 days after the enquiry is closed. Keep an unresolved
            thread only while it is needed to handle the request, a dispute or
            abuse prevention, and review the reason for keeping it.
          </li>
          <li>
            <strong>Newsletter subscriptions:</strong> retain your address while
            subscribed. A successful signed unsubscribe removes the matching
            subscription from our active subscriber list. Previously delivered
            emails and provider delivery logs may remain under the email
            provider&apos;s own retention settings.
          </li>
          <li>
            <strong>Accounts:</strong> retain account records while the account
            is active or needed for the service. Review accounts after 12 months
            of inactivity. This review does not automatically delete an account
            or promise an automatic notification; verified deletion requests can
            be made at any time.
          </li>
          <li>
            <strong>Access and deletion requests:</strong> target a response and
            action within 30 days after verifying the request and identifying
            the records. If more time or information is needed, explain it
            through the contact channel. This is a service target, not a
            guarantee of an automated deadline.
          </li>
          <li>
            <strong>Browser storage:</strong> favorites, notes and other local
            records remain on your device until you clear them. Server-side
            account deletion does not clear browser storage for you.
          </li>
        </ul>
        <p>
          <Link
            href="/contact?topic=privacy"
            className="font-semibold underline"
          >
            Start a privacy, access or deletion request
          </Link>
          . Describe the category of record and the address associated with it.
          Do not send passwords, recovery codes, payment information or identity
          documents in the initial message. We may ask you to verify control of
          the relevant address or account before acting.
        </p>
        <p>
          Some hosting, security and email-provider records have separate
          retention settings that we have not fully verified. We do not promise
          deletion from a provider&apos;s backups or logs on the same timetable
          as our active records. The operator reviews outstanding requests and
          records the date, action and any continuing reason for retention.
        </p>
        <h2 className="text-2xl font-bold">Security and policy changes</h2>
        <p>
          We use HTTPS and access controls, but no service can guarantee
          complete security. Material changes to this description should be
          dated here. The public contact channel is the form linked above. A
          postal address has not been supplied for publication. Provider
          retention settings, relevant processing terms and regional consent
          requirements remain subject to operational review.
        </p>
        <Link className="block underline" href="/cookies">
          Cookie and storage information
        </Link>
      </article>
    </SiteShell>
  );
}
