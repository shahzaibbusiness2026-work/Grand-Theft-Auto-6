import Link from "next/link";
import { cn } from "@/lib/utils";

/** Marketing logo — stacked amber/gold "TAISH" + technical cyan "GAMING" identifier. */
export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex shrink-0 flex-col leading-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00F0FF]/60 rounded-md transition-opacity hover:opacity-95",
        className
      )}
      aria-label="Taish Gaming Home"
    >
      <span className="text-primary font-display text-[21px] font-black tracking-tight">
        TAISH
      </span>
      <span className="mt-1 flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-[0.38em] text-[#00F0FF] opacity-90 drop-shadow-[0_0_6px_rgba(0,240,255,0.3)]">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#00F0FF] shadow-[0_0_4px_#00F0FF]" aria-hidden="true" />
        GAMING
      </span>
    </Link>
  );
}

/** App-shell logo — "TG" monogram circle + "TAISH GAMING". */
export function AppLogo({ className, href = "/dashboard" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("flex shrink-0 items-center gap-3", className)}>
      <span className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#00F0FF] shadow-[0_0_16px_rgba(0,240,255,0.4)]">
        <span className="font-display text-xs font-black tracking-wide text-gold dark:text-gold-light" aria-hidden="true">
          TG
        </span>
      </span>
      <span className="leading-none">
        <span className="block font-display text-lg font-black tracking-wide text-foreground">
          TAISH
        </span>
        <span className="block text-xs font-bold uppercase tracking-[0.4em] text-gold dark:text-gold-light">
          Gaming
        </span>
      </span>
    </Link>
  );
}
