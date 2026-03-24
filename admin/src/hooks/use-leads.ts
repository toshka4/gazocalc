import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { Lead, PaginationMeta, LeadsListParams } from "@/types"

interface LeadsResponse {
  leads: Lead[]
  meta: PaginationMeta
}

export function useLeads(params: LeadsListParams) {
  return useQuery({
    queryKey: ["leads", params],
    queryFn: async () => {
      const res = await apiClient.get<Lead[]>("/leads", params as Record<string, string | number | undefined>)
      return {
        leads: res.data!,
        meta: res.meta!,
      } as LeadsResponse
    },
  })
}
