import type { LeadStatus } from "@/lib/constants"

export interface Calculation {
  id: string
  leadId: string
  houseLength: number
  houseWidth: number
  wallHeight: number
  wallThickness: number
  blockLength: number
  blockHeight: number
  blockThickness: number
  density: string
  windowArea: number
  doorArea: number
  reservePercent: number
  hasPartitions: boolean
  partitionArea: number
  hasPediments: boolean
  pedimentArea: number
  hasDelivery: boolean
  pricePerM3: number
  glueBagPrice: number
  deliveryPrice: number
  totalVolume: number
  totalBlocks: number
  totalPallets: number
  totalGlueBags: number
  totalWeight: number
  blocksCost: number
  glueCost: number
  deliveryCost: number
  totalCost: number
  pdfUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface Lead {
  id: string
  name: string
  phone: string
  email: string
  city: string
  comment: string
  source: string
  status: LeadStatus
  managerNotes: string | null
  crmExportedAt: string | null
  calculation: Calculation | null
  createdAt: string
  updatedAt: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
  meta?: PaginationMeta
}

export interface DashboardData {
  totalLeads: number
  byStatus: Record<string, number>
  avgCost: number
  totalRevenue: number
  calculationsCount: number
  recentLeads: Lead[]
}

export interface LeadsListParams {
  page?: number
  limit?: number
  status?: LeadStatus
  search?: string
  sortBy?: "createdAt" | "status" | "city" | "totalCost"
  sortOrder?: "asc" | "desc"
}
