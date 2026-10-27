import Link from "next/link";
import { SiteShell } from "@/components/shells";
import { verifyNewsletterToken } from "@/lib/newsletter-tokens";
import { unsubscribe } from "./actions";
export const metadata = {
  title: "Unsubscribe from Taish Gaming",
  robots: { index: false, follow: true },
  referrer: "no-referrer" as const,
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const p = await searchParams;
  const token = typeof p.token === "string" ? p.token : "";
  const valid = verifyNewsletterToken(token);
  return (
    <SiteShell>
      <section className="container-site max-w-xl py-12 space-y-6">
        <h1 className="text-3xl font-bold">Newsletter unsubscribe</h1>
        {p.status === "removed" ? (
          <p role="status">
            This subscription has been removed, or was already absent. A later
            subscription made with the same address is not affected by an older
            link.
          </p>
        ) : p.status === "unavailable" ? (
          <p role="alert">
            We could not update the subscription. Please try the link again or
            contact us.
          </p>
        ) : valid ? (
          <>
            <p>
              Confirm to remove the subscription associated with this email
              link. Opening the link alone does not change your subscription.
            </p>
            <form action={unsubscribe}>
              <input type="hidden" name="token" value={token} />
              <button
                type="submit"
                className="min-h-11 rounded-xl bg-primary px-5 font-bold text-primary-foreground"
              >
                Confirm unsubscribe
              </button>
            </form>
          </>
        ) : (
          <p>
            Use the unsubscribe link in a recent Taish Gaming email. Older links
            containing only an email address require a request through our
            contact form.
          </p>
        )}
        <Link href="/contact" className="block underline">
          Contact Taish Gaming
        </Link>
        <Link href="/privacy" className="block underline">
          Privacy policy
        </Link>
      </section>
    </SiteShell>
  );
}
