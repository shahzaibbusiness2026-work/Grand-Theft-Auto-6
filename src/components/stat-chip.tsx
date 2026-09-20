import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatChipProps {
  icon: LucideIcon;
  value: string;
  label: string;
  colorClass?: string;
  className?: string;
}

/** Icon + value + label stat card used across heroes and dashboards. */
export function StatChip({ icon: Icon, value, label, colorClass, className }: StatChipProps) {
  return (
    <div
      className={cn(
        "card-surface flex flex-col items-center gap-1.5 px-4 py-4 text-center",
        className
      )}
    >
      <Icon className={cn("h-5 w-5", colorClass ?? "text-primary")} />
      <span className="font-display text-lg font-extrabold text-foreground">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
