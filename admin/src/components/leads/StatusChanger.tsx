import { LEAD_STATUSES, STATUS_LABELS, type LeadStatus } from "@/lib/constants"
import { useUpdateLead } from "@/hooks/use-lead-mutations"
import { StatusBadge } from "@/components/shared/StatusBadge"

interface StatusChangerProps {
  leadId: string
  currentStatus: LeadStatus
}

export function StatusChanger({ leadId, currentStatus }: StatusChangerProps) {
  const { mutate, isPending } = useUpdateLead(leadId)

  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Статус
      </h3>
      <div className="mb-3">
        <StatusBadge status={currentStatus} />
      </div>
      <div className="flex flex-wrap gap-2">
        {LEAD_STATUSES.filter((s) => s !== currentStatus).map((status) => (
          <button
            key={status}
            onClick={() => mutate({ status })}
            disabled={isPending}
            className="rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent disabled:opacity-50"
          >
            → {STATUS_LABELS[status]}
          </button>
        ))}
      </div>
    </div>
  )
}
