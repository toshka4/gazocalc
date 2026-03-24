import { AUTH_STORAGE_KEY } from "@/lib/constants"
import type { ApiResponse } from "@/types"

class ApiClient {
  private baseUrl = "/api"

  private getAuthHeader(): Record<string, string> {
    const key = sessionStorage.getItem(AUTH_STORAGE_KEY)
    if (!key) return {}
    return { Authorization: `Bearer ${key}` }
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      ...this.getAuthHeader(),
    }
    if (options.body) {
      headers["Content-Type"] = "application/json"
    }
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers as Record<string, string>,
      },
    })

    const json = await response.json() as ApiResponse<T>

    if (!response.ok) {
      if (response.status === 401) {
        sessionStorage.removeItem(AUTH_STORAGE_KEY)
        window.location.href = "/login"
      }
      throw new ApiError(
        json.error?.message ?? "Ошибка сервера",
        json.error?.code ?? "UNKNOWN",
        response.status,
        json.error?.details,
      )
    }

    return json
  }

  async get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<ApiResponse<T>> {
    const searchParams = new URLSearchParams()
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== "") {
          searchParams.set(key, String(value))
        }
      }
    }
    const query = searchParams.toString()
    return this.request<T>(`${path}${query ? `?${query}` : ""}`)
  }

  async post<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async patch<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    })
  }

  async delete<T>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: "DELETE" })
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export const apiClient = new ApiClient()
