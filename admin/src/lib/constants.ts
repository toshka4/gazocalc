export const LEAD_STATUSES = [
  "NEW", "CONTACTED", "IN_PROGRESS", "QUALIFIED", "WON", "LOST", "ARCHIVED",
] as const

export type LeadStatus = (typeof LEAD_STATUSES)[number]

export const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "Новая",
  CONTACTED: "Связались",
  IN_PROGRESS: "В работе",
  QUALIFIED: "Квалифицирована",
  WON: "Выиграна",
  LOST: "Проиграна",
  ARCHIVED: "Архив",
}

export const STATUS_COLORS: Record<LeadStatus, { bg: string; text: string; dot: string }> = {
  NEW: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  CONTACTED: { bg: "bg-cyan-50", text: "text-cyan-700", dot: "bg-cyan-500" },
  IN_PROGRESS: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  QUALIFIED: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  WON: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  LOST: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  ARCHIVED: { bg: "bg-gray-50", text: "text-gray-500", dot: "bg-gray-400" },
}

export const AUTH_STORAGE_KEY = "gazoblock_admin_key"
