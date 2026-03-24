import type { FastifyRequest } from "fastify";
import { config } from "../config/index.js";
import { AppError } from "./errors.js";

/**
 * Проверяет API-ключ в заголовке Authorization: Bearer <key>.
 * Используется для защиты admin-эндпоинтов.
 * Если ADMIN_API_KEY не задан в env — все admin-эндпоинты отключены (403).
 */
export function requireAdminKey(request: FastifyRequest): void {
  if (!config.adminApiKey) {
    throw AppError.forbidden("Admin API is not configured");
  }

  const header = request.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw AppError.unauthorized("Missing or invalid Authorization header");
  }

  const token = header.slice(7);
  if (token !== config.adminApiKey) {
    throw AppError.unauthorized("Invalid API key");
  }
}
