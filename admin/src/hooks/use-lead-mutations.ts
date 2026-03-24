import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { Lead } from "@/types"
import type { LeadStatus } from "@/lib/constants"

interface UpdateLeadInput {
  status?: LeadStatus
  managerNotes?: string
}

export function useUpdateLead(leadId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateLeadInput) => {
      const res = await apiClient.patch<Lead>(`/leads/${leadId}`, data)
      return res.data!
    },
    onSuccess: (updatedLead) => {
      queryClient.setQueryData(["lead", leadId], updatedLead)
      queryClient.invalidateQueries({ queryKey: ["leads"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}
