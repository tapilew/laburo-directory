import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border px-2 py-0.5 text-label transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)]",
  {
    variants: {
      variant: {
        default:
          "border-[var(--color-border)] bg-transparent text-[var(--color-fg-secondary)]",
        primary:
          "border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]",
        success:
          "border-[var(--color-success)] bg-[var(--color-success-subtle)] text-[var(--color-success)]",
        warning:
          "border-[var(--color-warning)] bg-[var(--color-warning-subtle)] text-[var(--color-warning)]",
        error:
          "border-[var(--color-error)] bg-[var(--color-error-subtle)] text-[var(--color-error)]",
        muted:
          "border-[var(--color-border)] bg-transparent text-[var(--color-fg-muted)]",
      },
      size: {
        default: "rounded-sm",
        pill: "rounded-full px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  dotColor?: "success" | "warning" | "error" | "accent";
}

function Badge({
  className,
  variant,
  size,
  dot,
  dotColor = "success",
  children,
  ...props
}: BadgeProps) {
  const dotColorClasses = {
    success: "bg-[var(--color-success)]",
    warning: "bg-[var(--color-warning)]",
    error: "bg-[var(--color-error)]",
    accent: "bg-[var(--color-accent)]",
  };

  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "mr-1.5 h-1.5 w-1.5 rounded-full animate-pulse-dot",
            dotColorClasses[dotColor]
          )}
        />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
