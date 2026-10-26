/**
 * Shared honesty banner for every page that shows pre-release numbers.
 * The game has not launched, so no performance figure or price on this
 * site has been measured in-game. Everything numeric is an estimate
 * from official footage analysis and community research, and will be
 * replaced with measured data after launch.
 */
export function EstimatedDataNote({ className = "" }: { className?: string }) {
  return (
    <p
      className={`rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-xs leading-relaxed text-amber-800 dark:text-amber-200 ${className}`}
    >
      <strong>Pre-release estimates:</strong> all performance figures and
      prices on this page are estimates based on official footage analysis
      and community research — not measured in-game. They will be replaced
      with measured data after launch.
    </p>
  );
}
