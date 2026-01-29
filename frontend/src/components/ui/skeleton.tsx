import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "card" | "text" | "circle";
}

function Skeleton({
  className,
  variant = "default",
  ...props
}: SkeletonProps) {
  const variantClasses = {
    default: "rounded-[var(--radius-md)]",
    card: "rounded-none",
    text: "rounded-sm h-4",
    circle: "rounded-full",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[var(--color-bg-secondary)]",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {/* Shimmer overlay */}
      <div
        className="absolute inset-0 -translate-x-full animate-shimmer"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)",
        }}
      />
    </div>
  );
}

/* Preset skeleton layouts */
function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-6 rounded-none",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <Skeleton variant="text" className="w-2/3 h-6" />
        <Skeleton variant="text" className="w-20 h-5" />
      </div>
      <Skeleton variant="text" className="w-full mb-2" />
      <Skeleton variant="text" className="w-full mb-2" />
      <Skeleton variant="text" className="w-3/4 mb-6" />
      <div className="flex gap-2 mb-6">
        <Skeleton variant="text" className="w-16 h-5" />
        <Skeleton variant="text" className="w-20 h-5" />
        <Skeleton variant="text" className="w-14 h-5" />
      </div>
      <div className="border-t border-[var(--color-divider)] pt-4 flex justify-between items-center">
        <div>
          <Skeleton variant="text" className="w-12 h-3 mb-1" />
          <Skeleton variant="text" className="w-20 h-5" />
        </div>
        <Skeleton variant="text" className="w-24 h-9 rounded-[var(--radius-md)]" />
      </div>
    </div>
  );
}

function SkeletonStats({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-3 gap-4", className)}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-4 rounded-none"
        >
          <Skeleton variant="text" className="w-16 h-3 mb-2" />
          <Skeleton variant="text" className="w-24 h-8" />
        </div>
      ))}
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonStats };
