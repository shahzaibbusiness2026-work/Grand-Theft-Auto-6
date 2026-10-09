import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider",
  {
    variants: {
      variant: {
        default: "border-transparent bg-gold/15 text-gold-dark dark:text-gold-light",
        pink: "border-transparent bg-gold/15 text-gold-dark dark:text-gold-light",
        solid: "border-transparent bg-gold text-slate-950 font-black",
        green: "border-transparent bg-emerald-500/15 text-emerald-500",
        orange: "border-transparent bg-orange-500/15 text-orange-500",
        gray: "border-transparent bg-muted text-muted-foreground",
        blue: "border-transparent bg-sky-500/15 text-sky-500",
        yellow: "border-transparent bg-yellow-500/15 text-yellow-500",
        outline: "text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
