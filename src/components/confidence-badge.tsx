import { ShieldCheck, CheckCircle, AlertTriangle, HelpCircle, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConfidenceLevel } from "@/lib/canonical-data";

export interface ConfidenceBadgeProps {
  level?: ConfidenceLevel;
  confidence?: ConfidenceLevel;
  source?: string;
  className?: string;
  size?: "sm" | "md";
}

export function ConfidenceBadge({
  level,
  confidence,
  source,
  className,
  size = "sm",
}: ConfidenceBadgeProps) {
  const activeLevel = level || confidence || "CONFIRMED";

  const configs: Record<
    ConfidenceLevel,
    { label: string; icon: any; border: string; bg: string; text: string }
  > = {
    OFFICIAL: {
      label: "Official Rockstar",
      icon: ShieldCheck,
      border: "border-emerald-500/40",
      bg: "bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
    },
    CONFIRMED: {
      label: "Confirmed Asset",
      icon: CheckCircle,
      border: "border-cyan-500/40",
      bg: "bg-cyan-500/10",
      text: "text-cyan-700 dark:text-[#00F0FF]",
    },
    REPORTED: {
      label: "Reported Leak",
      icon: Eye,
      border: "border-amber-500/40",
      bg: "bg-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
    },
    RUMORED: {
      label: "Rumored",
      icon: AlertTriangle,
      border: "border-purple-500/40",
      bg: "bg-purple-500/10",
      text: "text-purple-600 dark:text-purple-400",
    },
    SPECULATION: {
      label: "Speculation",
      icon: HelpCircle,
      border: "border-border",
      bg: "bg-muted",
      text: "text-muted-foreground",
    },
  };

  const config = configs[activeLevel] || configs.CONFIRMED;
  const Icon = config.icon;

  return (
    <span
      title={source ? `Source: ${source}` : `Confidence Level: ${config.label}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-black uppercase tracking-wider",
        config.border,
        config.bg,
        config.text,
        size === "sm" ? "px-2.5 py-0.5 text-[9px]" : "px-3 py-1 text-[11px]",
        className
      )}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      <span>{config.label}</span>
    </span>
  );
}
