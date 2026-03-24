import { useSearchParams } from "react-router-dom"
import { useLeads } from "@/hooks/use-leads"
import { PageHeader } from "@/components/shared/PageHeader"
import { LeadsFilters } from "@/components/leads/LeadsFilters"
import { LeadsTable } from "@/components/leads/LeadsTable"
import { ErrorState } from "@/components/shared/ErrorState"
import type { LeadsListParams } from "@/types"
import type { LeadStatus } from "@/lib/constants"
import { LEAD_STATUSES } from "@/lib/constants"
import { useCallback } from "react"

function parseParams(searchParams: URLSearchParams): LeadsListParams {
  const status = searchParams.get("status") as LeadStatus | null
  const sortBy = searchParams.get("sortBy") as LeadsListParams["sortBy"] | null
  const sortOrder = searchParams.get("sortOrder") as LeadsListParams["sortOrder"] | null

  return {
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 20,
    status: status && LEAD_STATUSES.includes(status) ? status : undefined,
    search: searchParams.get("search") || undefined,
    sortBy: sortBy ?? "createdAt",
    sortOrder: sortOrder ?? "desc",
  }
}

export function LeadsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const params = parseParams(searchParams)
  const { data, isLoading, error, refetch } = useLeads(params)

  const updateParams = useCallback(
    (updates: Partial<LeadsListParams>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        for (const [key, value] of Object.entries(updates)) {
          if (value === undefined || value === "") {
            next.delete(key)
          } else {
            next.set(key, String(value))
          }
        }
        return next
      })
    },
    [setSearchParams],
  )

  if (error) {
    return <ErrorState message={error.message} onRetry={() => refetch()} />
  }

  return (
    <div>
      <PageHeader
        title="Заявки"
        description={data ? `Всего: ${data.meta.total}` : undefined}
      />

      <LeadsFilters params={params} onChange={updateParams} />

      <LeadsTable
        leads={data?.leads ?? []}
        meta={data?.meta}
        isLoading={isLoading}
        page={params.page ?? 1}
        onPageChange={(page) => updateParams({ page })}
      />
    </div>
  )
}
