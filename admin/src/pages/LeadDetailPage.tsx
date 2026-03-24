import { useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Trash2 } from "lucide-react"
import { useLead } from "@/hooks/use-lead"
import { apiClient } from "@/lib/api-client"
import { PageHeader } from "@/components/shared/PageHeader"
import { ClientInfo } from "@/components/leads/ClientInfo"
import { CalculationDetails } from "@/components/leads/CalculationDetails"
import { CalculationResults } from "@/components/leads/CalculationResults"
import { StatusChanger } from "@/components/leads/StatusChanger"
import { NotesEditor } from "@/components/leads/NotesEditor"
import { ErrorState } from "@/components/shared/ErrorState"
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import type { LeadStatus } from "@/lib/constants"

export function LeadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: lead, isLoading, error, refetch } = useLead(id!)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm("Вы уверены, что хотите удалить эту заявку? Это действие необратимо.")) return
    setDeleting(true)
    try {
      await apiClient.delete(`/leads/${id}`)
      navigate("/leads")
    } catch {
      alert("Не удалось удалить заявку")
      setDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton lines={2} />
        <div className="grid gap-6 lg:grid-cols-3">
          <LoadingSkeleton lines={6} />
          <LoadingSkeleton lines={6} />
          <LoadingSkeleton lines={4} />
        </div>
      </div>
    )
  }

  if (error || !lead) {
    return <ErrorState message={error?.message} onRetry={() => refetch()} />
  }

  return (
    <div>
      <div className="mb-2">
        <Link
          to="/leads"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Назад к заявкам
        </Link>
      </div>

      <PageHeader
        title={lead.name}
        description={`Заявка от ${formatDate(lead.createdAt)}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          <ClientInfo lead={lead} />
          {lead.calculation && (
            <>
              <CalculationDetails calc={lead.calculation} />
              <CalculationResults calc={lead.calculation} />
            </>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <StatusChanger leadId={lead.id} currentStatus={lead.status as LeadStatus} />
          <NotesEditor leadId={lead.id} initialNotes={lead.managerNotes ?? ""} />
          <Button
            variant="destructive"
            className="w-full"
            disabled={deleting}
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {deleting ? "Удаление…" : "Удалить заявку"}
          </Button>
        </div>
      </div>
    </div>
  )
}
