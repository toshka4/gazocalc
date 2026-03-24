import type { Lead } from "@/types"
import { Phone, Mail, MapPin, MessageSquare, Globe } from "lucide-react"

interface ClientInfoProps {
  lead: Lead
}

export function ClientInfo({ lead }: ClientInfoProps) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Клиент
      </h3>
      <div className="space-y-3">
        <div>
          <p className="text-lg font-semibold">{lead.name}</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <a href={`tel:${lead.phone}`} className="hover:text-primary">
            {lead.phone}
          </a>
        </div>
        {lead.email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <a href={`mailto:${lead.email}`} className="hover:text-primary">
              {lead.email}
            </a>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{lead.city}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{lead.source}</span>
        </div>
        {lead.comment && (
          <div className="flex items-start gap-2 text-sm">
            <MessageSquare className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <p className="text-muted-foreground">{lead.comment}</p>
          </div>
        )}
      </div>
    </div>
  )
}
