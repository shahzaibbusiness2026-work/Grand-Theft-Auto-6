import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover",
        solid:
          "bg-accent text-accent-foreground shadow-sm hover:brightness-105",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-muted",
        "outline-pink":
          "border border-border bg-transparent text-foreground hover:bg-muted",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70",
        ghost: "text-foreground hover:bg-muted",
        link: "text-primary underline-offset-4 hover:underline",
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
