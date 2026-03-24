import { PageHeader } from "@/components/shared/PageHeader"
import { AUTH_STORAGE_KEY } from "@/lib/constants"
import { Shield, Server, ExternalLink } from "lucide-react"

export function SettingsPage() {
  const hasKey = Boolean(sessionStorage.getItem(AUTH_STORAGE_KEY))

  return (
    <div>
      <PageHeader
        title="Настройки"
        description="Конфигурация админ-панели"
      />

      <div className="space-y-6">
        {/* Auth status */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <Shield className="h-4 w-4" />
            Аутентификация
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Статус</span>
              <span className={hasKey ? "text-emerald-600 font-medium" : "text-red-600 font-medium"}>
                {hasKey ? "Авторизован" : "Не авторизован"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Метод</span>
              <span>API Key (Bearer Token)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Хранение</span>
              <span>Session Storage</span>
            </div>
          </div>
        </div>

        {/* API Info */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <Server className="h-4 w-4" />
            API
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Base URL</span>
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/api</code>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Dashboard</span>
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">GET /api/admin/dashboard</code>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Leads</span>
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">GET /api/leads</code>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 text-sm font-semibold">Полезные ссылки</h3>
          <div className="space-y-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Калькулятор (публичный сайт)
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
