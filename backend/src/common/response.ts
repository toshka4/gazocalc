export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function successResponse<T>(data: T, meta?: PaginationMeta): ApiResponse<T> {
  return { success: true, data, ...(meta ? { meta } : {}) };
}

export function errorResponse(code: string, message: string, details?: unknown): ApiResponse {
  return {
    success: false,
    error: { code, message, ...(details !== undefined ? { details } : {}) },
  };
}
