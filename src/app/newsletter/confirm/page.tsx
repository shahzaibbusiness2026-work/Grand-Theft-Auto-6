import Link from "next/link";
import { CheckCircle2, AlertTriangle, MailWarning } from "lucide-react";
import { confirmNewsletterSubscription } from "@/lib/services/newsletter";

export const metadata = {
  title: "Confirm subscription | Taish Gaming",
  description: "Confirm your Taish Gaming newsletter subscription.",
  robots: { index: false, follow: false },
};

export default async function NewsletterConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const { result } = token
    ? await confirmNewsletterSubscription(token)
    : { result: "invalid" as const };

  const states = {
    confirmed: {
      icon: <CheckCircle2 className="h-12 w-12 text-emerald-500" aria-hidden="true" />,
      title: "You're subscribed!",
      body: "Your email is confirmed. You'll get Taish Gaming launch alerts and updates.",
    },
    already: {
      icon: <CheckCircle2 className="h-12 w-12 text-emerald-500" aria-hidden="true" />,
      title: "Already subscribed",
      body: "This email address is already on the list.",
    },
    expired: {
      icon: <MailWarning className="h-12 w-12 text-amber-500" aria-hidden="true" />,
      title: "Link expired",
      body: "This confirmation link expired (links are valid for 24 hours). Please sign up again to get a fresh one.",
    },
    invalid: {
      icon: <AlertTriangle className="h-12 w-12 text-red-500" aria-hidden="true" />,
      title: "Invalid link",
      body: "This confirmation link isn't valid. It may have already been used — try signing up again.",
    },
  } as const;

  const state = states[result];

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 py-20 text-center">
      {state.icon}
      <h1 className="mt-6 text-2xl font-bold">{state.title}</h1>
      <p className="mt-3 text-muted-foreground">{state.body}</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-xl bg-[#C9A86A] px-6 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:brightness-110"
      >
        Back to the Atlas
      </Link>
    </main>
  );
}
