import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Lock, Eye, EyeOff } from "lucide-react"

export function LoginPage() {
  const { login, error, isLoading } = useAuth()
  const [apiKey, setApiKey] = useState("")
  const [showKey, setShowKey] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!apiKey.trim()) return
    try {
      await login(apiKey.trim())
    } catch {
      // error is handled by auth context
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Газоблок CRM</h1>
          <p className="mt-1 text-sm text-muted-foreground">Введите API ключ для входа</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="mb-1.5 block text-sm font-medium">
              API Ключ
            </label>
            <div className="relative">
              <input
                id="apiKey"
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Введите ключ..."
                className="h-10 w-full rounded-lg border bg-background px-3 pr-10 text-sm outline-none ring-ring focus:ring-2"
                autoFocus
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading || !apiKey.trim()}
            className="h-10 w-full rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? "Проверка..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  )
}
