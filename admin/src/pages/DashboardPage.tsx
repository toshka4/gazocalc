import { Users, TrendingUp, Calculator, DollarSign } from "lucide-react"
import { useDashboard } from "@/hooks/use-dashboard"
import { PageHeader } from "@/components/shared/PageHeader"
import { SummaryCard } from "@/components/dashboard/SummaryCard"
import { RecentLeads } from "@/components/dashboard/RecentLeads"
import { ErrorState } from "@/components/shared/ErrorState"
import { CardSkeleton } from "@/components/shared/LoadingSkeleton"
import { formatCurrency, formatNumber } from "@/lib/utils"

export function DashboardPage() {
  const { data, isLoading, error, refetch } = useDashboard()

  if (error) {
    return <ErrorState message={error.message} onRetry={() => refetch()} />
  }

  return (
    <div>
      <PageHeader
        title="Дашборд"
        description="Обзор заявок и ключевые метрики"
      />

      {/* Summary Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : data ? (
          <>
            <SummaryCard
              title="Всего заявок"
              value={formatNumber(data.totalLeads)}
              icon={Users}
              description={`Новых: ${data.byStatus["NEW"] ?? 0}`}
            />
            <SummaryCard
              title="В работе"
              value={formatNumber((data.byStatus["IN_PROGRESS"] ?? 0) + (data.byStatus["CONTACTED"] ?? 0))}
              icon={TrendingUp}
              description={`Квалифицировано: ${data.byStatus["QUALIFIED"] ?? 0}`}
            />
            <SummaryCard
              title="Средний чек"
              value={formatCurrency(data.avgCost)}
              icon={Calculator}
              description={`Расчётов: ${formatNumber(data.calculationsCount)}`}
            />
            <SummaryCard
              title="Общая сумма"
              value={formatCurrency(data.totalRevenue)}
              icon={DollarSign}
              description={`Выиграно: ${data.byStatus["WON"] ?? 0}`}
            />
          </>
        ) : null}
      </div>

      {/* Recent Leads */}
      {isLoading ? (
        <CardSkeleton />
      ) : data ? (
        <RecentLeads leads={data.recentLeads} />
      ) : null}
    </div>
  )
}
