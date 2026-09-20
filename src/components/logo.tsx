import Link from "next/link";
import { cn } from "@/lib/utils";

/** Marketing logo — stacked amber/gold "GTA6" + technical cyan "ATLAS" identifier. */
export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex shrink-0 flex-col leading-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00F0FF]/60 rounded-md transition-opacity hover:opacity-95",
        className
      )}
      aria-label="GTA 6 Atlas Home"
    >
      <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 bg-clip-text font-display text-[21px] font-black tracking-tight text-transparent drop-shadow-[0_2px_10px_rgba(245,158,11,0.25)]">
        GTA6
      </span>
      <span className="mt-1 flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#00F0FF] opacity-90 drop-shadow-[0_0_6px_rgba(0,240,255,0.3)]">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#00F0FF] shadow-[0_0_4px_#00F0FF]" aria-hidden="true" />
        ATLAS
      </span>
    </Link>
  );
}

/** App-shell logo — neon palm circle + "GTA 6 ATLAS". */
export function AppLogo({ className, href = "/dashboard" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("flex shrink-0 items-center gap-3", className)}>
      <span className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#00F0FF] shadow-[0_0_16px_rgba(0,240,255,0.4)]">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
          <path d="M12 21v-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-[#00F0FF]" />
          <path
            d="M12 13c-1-3-4-4-7-3 2-3 6-3 7-1 1-2 5-2 7 1-3-1-6 0-7 2Zm0-2c0-3 2-5 5-5-1 3-3 5-5 5Zm0 0c0-3-2-5-5-5 1 3 3 5 5 5Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
            className="text-amber-500 dark:text-amber-400"
          />
        </svg>
      </span>
      <span className="leading-none">
        <span className="block font-display text-lg font-black tracking-wide text-foreground">
          GTA 6
        </span>
        <span className="block text-xs font-bold uppercase tracking-[0.4em] text-amber-500 dark:text-amber-400">
          Atlas
        </span>
      </span>
    </Link>
  );
}
