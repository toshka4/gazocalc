import { Search, X } from "lucide-react"
import { LEAD_STATUSES, STATUS_LABELS, type LeadStatus } from "@/lib/constants"
import type { LeadsListParams } from "@/types"

interface LeadsFiltersProps {
  params: LeadsListParams
  onChange: (updates: Partial<LeadsListParams>) => void
}

export function LeadsFilters({ params, onChange }: LeadsFiltersProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Поиск по имени, телефону, городу..."
          value={params.search ?? ""}
          onChange={(e) => onChange({ search: e.target.value || undefined, page: 1 })}
          className="h-9 w-full rounded-lg border bg-background pl-9 pr-8 text-sm outline-none ring-ring focus:ring-2"
        />
        {params.search && (
          <button
            onClick={() => onChange({ search: undefined, page: 1 })}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Status filter */}
      <select
        value={params.status ?? ""}
        onChange={(e) =>
          onChange({
            status: (e.target.value || undefined) as LeadStatus | undefined,
            page: 1,
          })
        }
        className="h-9 rounded-lg border bg-background px-3 text-sm outline-none ring-ring focus:ring-2"
      >
        <option value="">Все статусы</option>
        {LEAD_STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={`${params.sortBy ?? "createdAt"}_${params.sortOrder ?? "desc"}`}
        onChange={(e) => {
          const [sortBy, sortOrder] = e.target.value.split("_") as [
            LeadsListParams["sortBy"],
            LeadsListParams["sortOrder"],
          ]
          onChange({ sortBy, sortOrder })
        }}
        className="h-9 rounded-lg border bg-background px-3 text-sm outline-none ring-ring focus:ring-2"
      >
        <option value="createdAt_desc">Сначала новые</option>
        <option value="createdAt_asc">Сначала старые</option>
        <option value="totalCost_desc">Сумма ↓</option>
        <option value="totalCost_asc">Сумма ↑</option>
        <option value="city_asc">Город А-Я</option>
        <option value="city_desc">Город Я-А</option>
      </select>
    </div>
  )
}
