import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { AUTH_STORAGE_KEY } from "@/lib/constants"
import { apiClient, ApiError } from "@/lib/api-client"

interface AuthContextValue {
  isAuthenticated: boolean
  isLoading: boolean
  login: (apiKey: string) => Promise<void>
  logout: () => void
  error: string | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Проверяем сохранённый ключ при маунте
  useEffect(() => {
    const key = sessionStorage.getItem(AUTH_STORAGE_KEY)
    if (key) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (apiKey: string) => {
    setError(null)
    setIsLoading(true)
    try {
      // Сохраняем ключ до запроса, чтобы api-client его видел
      sessionStorage.setItem(AUTH_STORAGE_KEY, apiKey)
      await apiClient.post("/admin/login", { apiKey })
      setIsAuthenticated(true)
    } catch (err) {
      sessionStorage.removeItem(AUTH_STORAGE_KEY)
      setIsAuthenticated(false)
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Ошибка подключения к серверу")
      }
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY)
    setIsAuthenticated(false)
    setError(null)
  }, [])

  const value = useMemo(
    () => ({ isAuthenticated, isLoading, login, logout, error }),
    [isAuthenticated, isLoading, login, logout, error],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
