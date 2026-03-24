import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { DashboardData } from "@/types"

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await apiClient.get<DashboardData>("/admin/dashboard")
      return res.data!
    },
    refetchInterval: 60_000,
  })
}
