import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
  className?: string
  lines?: number
}

export function LoadingSkeleton({ className, lines = 3 }: LoadingSkeletonProps) {
  return (
    <div className={cn("animate-pulse space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 rounded bg-muted",
            i === lines - 1 ? "w-3/4" : "w-full",
          )}
        />
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border bg-card p-6">
      <div className="mb-4 h-4 w-1/3 rounded bg-muted" />
      <div className="h-8 w-1/2 rounded bg-muted" />
    </div>
  )
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded bg-muted" />
        </td>
      ))}
    </tr>
  )
}
