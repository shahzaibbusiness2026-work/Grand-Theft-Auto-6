import { useId } from "react";
import { cn } from "@/lib/utils";

interface DonutProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string;
  sublabel?: string;
  from?: string;
  to?: string;
  color?: string;
}

/** Gradient circular progress ring (SVG, responsive text scaling, no deps). */
export function Donut({
  value,
  size = 120,
  strokeWidth = 10,
  className,
  label,
  sublabel,
  from = "#00e5ff",
  to = "#0284c7",
}: DonutProps) {
  const id = useId().replace(/[:]/g, "");
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const filled = (Math.min(100, Math.max(0, value)) / 100) * c;

  const isLarge = size >= 160;
  const isMedium = size >= 90 && size < 160;
  const isSmall = size < 90;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center select-none", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${value}% ${sublabel ?? "completed"}`}
    >
      {/* Background ambient radar glow for large circles */}
      {isLarge && (
        <div
          className="absolute inset-2 rounded-full bg-primary/[0.04] backdrop-blur-[1px]"
          aria-hidden="true"
        />
      )}

      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          className="opacity-75"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${c - filled}`}
          className="transition-all duration-700 ease-out"
        />
      </svg>

      {/* Centered text display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center pointer-events-none">
        {label && (
          <span
            className={cn(
              "font-display font-extrabold tabular-nums leading-none tracking-tight",
              isLarge &&
                "text-4xl sm:text-5xl font-black bg-gradient-to-b from-sky-300 via-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow",
              isMedium && "text-2xl text-foreground font-black",
              isSmall && "text-[12px] font-bold text-foreground"
            )}
          >
            {label}
          </span>
        )}
        {sublabel && (
          <span
            className={cn(
              "font-bold uppercase text-muted-foreground",
              isLarge && "mt-2 max-w-[130px] text-[11px] tracking-[0.22em] text-foreground/80",
              isMedium && "mt-0.5 text-[9px] tracking-wider",
              isSmall && "sr-only"
            )}
          >
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
