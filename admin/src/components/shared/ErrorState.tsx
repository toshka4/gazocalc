import { AlertCircle } from "lucide-react"

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  message = "Произошла ошибка при загрузке данных",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="mb-4 h-12 w-12 text-destructive/50" />
      <h3 className="text-sm font-medium text-foreground">Ошибка</h3>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Попробовать снова
        </button>
      )}
    </div>
  )
}
