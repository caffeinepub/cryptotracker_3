import { cn } from "../lib/utils";

interface SkeletonCardProps {
  className?: string;
  lines?: number;
  showAvatar?: boolean;
}

/** Generic skeleton card for list items */
export function SkeletonCard({
  className,
  lines = 2,
  showAvatar = true,
}: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg bg-card/40 border border-border/40",
        className,
      )}
      aria-hidden="true"
    >
      {showAvatar && (
        <div className="w-9 h-9 rounded-full bg-muted/30 animate-pulse flex-shrink-0" />
      )}
      <div className="flex-1 space-y-2 min-w-0">
        <div className="h-3 bg-muted/30 rounded animate-pulse w-3/5" />
        {lines >= 2 && (
          <div className="h-2.5 bg-muted/20 rounded animate-pulse w-2/5" />
        )}
      </div>
      <div className="space-y-2 text-right flex-shrink-0">
        <div className="h-3 bg-muted/30 rounded animate-pulse w-16" />
        {lines >= 2 && (
          <div className="h-2.5 bg-muted/20 rounded animate-pulse w-12 ml-auto" />
        )}
      </div>
    </div>
  );
}

/** Skeleton loader for the dashboard header balance area */
export function SkeletonBalance() {
  return (
    <div className="space-y-2 py-1" aria-hidden="true">
      <div className="h-10 w-56 bg-muted/30 rounded animate-pulse" />
      <div className="h-5 w-40 bg-muted/20 rounded-full animate-pulse" />
    </div>
  );
}

/** Skeleton for a chart placeholder */
export function SkeletonChart({ height = 160 }: { height?: number }) {
  return (
    <div
      className="mx-4 rounded-lg bg-card/30 border border-border/40 overflow-hidden"
      style={{ height }}
      aria-hidden="true"
    >
      <div className="px-4 py-3">
        <div className="h-2.5 w-32 bg-muted/30 rounded animate-pulse" />
      </div>
      <div className="px-4 pb-4 space-y-2">
        {[65, 45, 72, 55, 80, 60, 75].map((w, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: decorative skeleton bars
            key={i}
            className="h-2 bg-muted/20 rounded animate-pulse"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
    </div>
  );
}
