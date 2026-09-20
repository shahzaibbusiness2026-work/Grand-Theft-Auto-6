import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  id?: string;
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
}

export function SectionHeader({
  id,
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = "View All",
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-6 flex items-end justify-between gap-4", className)}>
      <div>
        <h2 id={id} className="font-display text-xl font-extrabold uppercase tracking-wider text-foreground">
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {viewAllHref && (
        <Link href={viewAllHref} className="flex shrink-0 items-center gap-1 text-[13px] font-semibold text-accent hover:underline">
          {viewAllLabel} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
