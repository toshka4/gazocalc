import { useState } from "react"
import { useUpdateLead } from "@/hooks/use-lead-mutations"
import { Save } from "lucide-react"

interface NotesEditorProps {
  leadId: string
  initialNotes: string
}

export function NotesEditor({ leadId, initialNotes }: NotesEditorProps) {
  const [notes, setNotes] = useState(initialNotes)
  const { mutate, isPending } = useUpdateLead(leadId)
  const isDirty = notes !== initialNotes

  const handleSave = () => {
    if (!isDirty) return
    mutate({ managerNotes: notes })
  }

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Заметки менеджера
        </h3>
        {isDirty && (
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            {isPending ? "Сохранение..." : "Сохранить"}
          </button>
        )}
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Добавьте заметку..."
        className="min-h-[120px] w-full resize-y rounded-lg border bg-background p-3 text-sm outline-none ring-ring placeholder:text-muted-foreground focus:ring-2"
        maxLength={2000}
      />
      <p className="mt-1 text-right text-xs text-muted-foreground">{notes.length}/2000</p>
    </div>
  )
}
