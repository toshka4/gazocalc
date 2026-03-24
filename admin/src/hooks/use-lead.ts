import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { Lead } from "@/types"

export function useLead(id: string) {
  return useQuery({
    queryKey: ["lead", id],
    queryFn: async () => {
      const res = await apiClient.get<Lead>(`/leads/${id}`)
      return res.data!
    },
    enabled: Boolean(id),
  })
}
