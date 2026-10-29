import Link from "next/link";

export function ConceptNotice({ subject }: { subject: string }) {
  return (
    <aside
      className="mb-6 rounded-xl border border-amber-600/40 bg-amber-500/10 p-4 text-sm leading-relaxed"
      aria-label="Evidence status"
    >
      <strong>Fan concept: {subject}.</strong> These are editorial planning
      examples, not confirmed GTA VI records or walkthroughs. Names, placement,
      prices, rewards, hours and gameplay details have not passed field-specific
      source review. Any numbers describe the fictional example only. Saved
      progress records your choices on this device, not verified game
      completion.{" "}
      <Link href="/editorial-policy" className="font-semibold underline">
        Evidence policy
      </Link>
      {" · "}
      <Link href="/corrections" className="font-semibold underline">
        Submit a source
      </Link>
    </aside>
  );
}
