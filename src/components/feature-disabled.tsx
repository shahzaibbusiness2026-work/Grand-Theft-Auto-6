import Link from "next/link";
import { PauseCircle } from "lucide-react";

/**
 * Shown when the site owner has disabled a public feature from
 * Admin → Settings → Enabled Tools. Real gate, real message —
 * the feature comes back the moment the owner re-enables it.
 */
export function FeatureDisabled({ title }: { title: string }) {
  return (
    <div className="container-site py-16">
      <div className="card-surface mx-auto max-w-xl p-8 text-center">
        <PauseCircle className="mx-auto h-10 w-10 text-gold" aria-hidden="true" />
        <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-foreground">
          {title} is temporarily paused
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The site owner has switched this section off in the admin dashboard for now.
          Everything else on Tahzaib Gaming is still open — check back soon.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90"
        >
          Back to homepage
        </Link>
      </div>
    </div>
  );
}
