import { STATUS_LABELS, STATUS_COLORS, type LeadStatus } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: LeadStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colors = STATUS_COLORS[status]
  const label = STATUS_LABELS[status]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        colors.bg,
        colors.text,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", colors.dot)} />
      {label}
    </span>
  )
}
