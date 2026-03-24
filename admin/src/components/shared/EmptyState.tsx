import { FileQuestion } from "lucide-react"

interface EmptyStateProps {
  title?: string
  description?: string
}

export function EmptyState({
  title = "Данные не найдены",
  description = "Попробуйте изменить параметры фильтрации",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <FileQuestion className="mb-4 h-12 w-12 text-muted-foreground/50" />
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
