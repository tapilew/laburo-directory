import * as React from "react";
import { cn } from "@/lib/utils";

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
  label?: string;
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    {
      className,
      orientation = "horizontal",
      decorative = true,
      label,
      ...props
    },
    ref
  ) => {
    const isHorizontal = orientation === "horizontal";

    if (label) {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center gap-4",
            isHorizontal ? "w-full" : "h-full flex-col",
            className
          )}
          {...props}
        >
          <div
            className={cn(
              "bg-[var(--color-divider)]",
              isHorizontal ? "flex-1 h-px" : "w-px flex-1"
            )}
          />
          <span className="text-label text-[var(--color-fg-muted)] whitespace-nowrap">
            {label}
          </span>
          <div
            className={cn(
              "bg-[var(--color-divider)]",
              isHorizontal ? "flex-1 h-px" : "w-px flex-1"
            )}
          />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role={decorative ? "none" : "separator"}
        aria-orientation={decorative ? undefined : orientation}
        className={cn(
          "shrink-0 bg-[var(--color-divider)]",
          isHorizontal ? "h-px w-full" : "h-full w-px",
          className
        )}
        {...props}
      />
    );
  }
);
Separator.displayName = "Separator";

export { Separator };
