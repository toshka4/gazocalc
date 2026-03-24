import { NavLink, Outlet } from "react-router-dom"
import { LayoutDashboard, Users, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"

const navigation = [
  { to: "/", label: "Дашборд", icon: LayoutDashboard },
  { to: "/leads", label: "Заявки", icon: Users },
  { to: "/settings", label: "Настройки", icon: Settings },
]

export function AdminLayout() {
  const { logout } = useAuth()

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-border bg-white md:flex md:flex-col">
        <div className="flex h-14 items-center border-b px-6">
          <span className="text-lg font-semibold text-foreground">
            Газоблок <span className="text-primary">CRM</span>
          </span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t p-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <LogOut className="h-4 w-4" />
            Выйти
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex h-14 items-center border-b bg-white px-4 md:hidden">
          <span className="text-lg font-semibold">
            Газоблок <span className="text-primary">CRM</span>
          </span>
        </header>

        {/* Mobile nav */}
        <nav className="flex border-b bg-white px-2 md:hidden">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-medium transition-colors",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground",
                )
              }
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={logout}
            className="ml-auto flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-muted-foreground"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </nav>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
