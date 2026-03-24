import { Link } from "react-router-dom"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { formatDate, formatCurrency } from "@/lib/utils"
import type { LeadStatus } from "@/lib/constants"
import type { Lead } from "@/types"

interface RecentLeadsProps {
  leads: Lead[]
}

export function RecentLeads({ leads }: RecentLeadsProps) {
  if (leads.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-sm font-medium text-muted-foreground">Последние заявки</h3>
        <p className="mt-4 text-sm text-muted-foreground">Заявок пока нет</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card">
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Последние заявки</h3>
          <Link
            to="/leads"
            className="text-xs font-medium text-primary hover:text-primary/80"
          >
            Все заявки →
          </Link>
        </div>
      </div>
      <div className="divide-y">
        {leads.map((lead) => (
          <Link
            key={lead.id}
            to={`/leads/${lead.id}`}
            className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-accent/50"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{lead.name}</p>
              <p className="text-xs text-muted-foreground">
                {lead.city} · {formatDate(lead.createdAt)}
              </p>
            </div>
            <div className="ml-4 flex items-center gap-3">
              {lead.calculation && (
                <span className="hidden text-sm font-medium sm:inline">
                  {formatCurrency(lead.calculation.totalCost)}
                </span>
              )}
              <StatusBadge status={lead.status as LeadStatus} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
