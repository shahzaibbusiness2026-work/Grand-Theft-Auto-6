import * as React from "react";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: number; barClassName?: string }
>(({ className, value, barClassName, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("relative h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}
      {...props}
    >
      <div
        suppressHydrationWarning
        className={cn(
          "h-full rounded-full bg-gradient-to-r from-primary to-accent",
          barClassName
        )}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
});
Progress.displayName = "Progress";

export { Progress };
