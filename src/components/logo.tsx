import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Marketing logo — one-line "TAISHGAMING" lockup from the reference design:
 * gamepad mark, TAISH in foreground, GAMING in the pink-to-violet gradient. */
export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex shrink-0 items-center gap-2 leading-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2E9A]/60 rounded-md transition-opacity hover:opacity-95",
        className
      )}
      aria-label="Taish Gaming Home"
    >
      <Gamepad2 className="h-7 w-7 text-[#FF2E9A]" aria-hidden="true" />
      <span className="font-display text-[21px] font-black tracking-tight">
        <span className="text-foreground">TAISH</span>
        {" "}
        <span className="bg-gradient-to-r from-[#FF2E9A] to-violet-500 bg-clip-text text-transparent">
          GAMING
        </span>
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
