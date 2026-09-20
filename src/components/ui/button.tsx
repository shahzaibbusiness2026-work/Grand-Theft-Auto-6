import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-display text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 text-white font-bold shadow-neon-cyan hover:from-sky-600 hover:via-cyan-600 hover:to-blue-700 hover:shadow-lg active:scale-[0.99]",
        solid: "bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-black shadow-neon-amber hover:brightness-105 hover:shadow-lg",
        outline:
          "border border-amber-500/50 bg-transparent text-amber-500 dark:text-amber-400 hover:bg-amber-500/10",
        "outline-pink":
          "border border-amber-500/50 bg-transparent text-amber-500 dark:text-amber-400 hover:bg-amber-500/10",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70",
        ghost: "text-foreground hover:bg-muted",
        link: "text-amber-500 dark:text-amber-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-8 rounded-md px-3 text-[13px]",
        lg: "h-12 rounded-xl px-7 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, href, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }));
    if (href) {
      return (
        <Link href={href} className={classes}>
          {(props as { children?: React.ReactNode }).children}
        </Link>
      );
    }
    return <button ref={ref} className={classes} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
