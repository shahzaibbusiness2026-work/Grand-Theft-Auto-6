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
          Updated October 29, 2026
        </p>
        <p>
          The operator is Taish Gaming, based in Pakistan. Taish Gaming is an
          independent fan website. This page describes the features implemented
          on the site. For privacy questions, deletion requests or to identify
          the operator responsible for a request, use our{" "}
          <Link href="/contact" className="underline">
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
        <h2 className="text-2xl font-bold">Retention and your choices</h2>
        <p>
          Server-held accounts, subscriptions and contact messages are kept
          only as long as needed to provide the service, respond to your
          request, or meet a legal obligation, and are deleted when you ask
          us to delete them through the contact form. You can clear local
          browser data, sign out to end the current session, and avoid
          optional video playback at any time.
        </p>
        <h2 className="text-2xl font-bold">Security and policy changes</h2>
        <p>
          We use HTTPS and access controls, but no service can guarantee
          complete security. Material changes to this policy are dated at the
          top of this page. The operator can be contacted through the contact
          form; a postal address is not published on this site.
        </p>
        <Link className="block underline" href="/cookies">
          Cookie and storage information
        </Link>
      </article>
    </SiteShell>
  );
}
