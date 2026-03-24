import { Link } from "react-router-dom"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { EmptyState } from "@/components/shared/EmptyState"
import { TableRowSkeleton } from "@/components/shared/LoadingSkeleton"
import { formatDate, formatCurrency } from "@/lib/utils"
import type { LeadStatus } from "@/lib/constants"
import type { Lead, PaginationMeta } from "@/types"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface LeadsTableProps {
  leads: Lead[]
  meta: PaginationMeta | undefined
  isLoading: boolean
  page: number
  onPageChange: (page: number) => void
}

export function LeadsTable({ leads, meta, isLoading, page, onPageChange }: LeadsTableProps) {
  if (!isLoading && leads.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="rounded-xl border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Клиент</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">Город</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">Сумма</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Статус</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Дата</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)
              : leads.map((lead) => (
                  <tr key={lead.id} className="transition-colors hover:bg-accent/50">
                    <td className="px-4 py-3">
                      <Link to={`/leads/${lead.id}`} className="group">
                        <p className="font-medium group-hover:text-primary">{lead.name}</p>
                        <p className="text-xs text-muted-foreground">{lead.phone}</p>
                      </Link>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                      {lead.city}
                    </td>
                    <td className="hidden px-4 py-3 font-medium md:table-cell">
                      {lead.calculation
                        ? formatCurrency(lead.calculation.totalCost)
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={lead.status as LeadStatus} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(lead.createdAt)}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Показано {(page - 1) * meta.limit + 1}–{Math.min(page * meta.limit, meta.total)} из{" "}
            {meta.total}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(meta.totalPages, 5) }).map((_, i) => {
              const pageNum = getPageNumber(page, meta.totalPages, i)
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`min-w-[32px] rounded-lg px-2 py-1 text-xs font-medium transition-colors ${
                    pageNum === page
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= meta.totalPages}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function getPageNumber(current: number, total: number, index: number): number {
  const maxVisible = Math.min(total, 5)
  let start = Math.max(1, current - Math.floor(maxVisible / 2))
  const end = start + maxVisible - 1
  if (end > total) {
    start = Math.max(1, total - maxVisible + 1)
  }
  return start + index
}
