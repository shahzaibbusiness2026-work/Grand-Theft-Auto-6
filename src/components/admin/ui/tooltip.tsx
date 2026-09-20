"use client";

import React, { useState, useRef, useId } from "react";
import { cn } from "@/lib/utils";

export type TooltipPosition = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content: React.ReactNode;
  position?: TooltipPosition;
  delayMs?: number;
  className?: string;
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = "top",
  delayMs = 200,
  className,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipId = useId();

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delayMs);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  const positionStyles: Record<TooltipPosition, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const childProps = children.props as React.HTMLAttributes<HTMLElement>;

  const trigger = React.cloneElement(children, {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      showTooltip();
      childProps.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      hideTooltip();
      childProps.onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      showTooltip();
      childProps.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      hideTooltip();
      childProps.onBlur?.(e);
    },
    "aria-describedby": isVisible ? tooltipId : undefined,
  } as React.HTMLAttributes<HTMLElement>);

  return (
    <div className="relative inline-flex items-center">
      {trigger}
      {isVisible && content && (
        <div
          id={tooltipId}
          role="tooltip"
          className={cn(
            "absolute z-50 px-2.5 py-1 text-[11px] font-medium text-[var(--admin-text)] bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-lg shadow-xl shadow-black/50 backdrop-blur-md pointer-events-none whitespace-nowrap transition-all duration-150 animate-in fade-in zoom-in-95",
            positionStyles[position],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};
