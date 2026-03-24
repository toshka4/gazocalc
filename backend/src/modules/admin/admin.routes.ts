import type { FastifyInstance } from "fastify";
import { requireAdminKey } from "../../common/auth.js";
import { successResponse } from "../../common/response.js";
import { leadsService } from "../leads/leads.service.js";
import { config } from "../../config/index.js";
import { AppError } from "../../common/errors.js";
import { z } from "zod";

const loginSchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
});

export async function adminRoutes(app: FastifyInstance) {
  /** POST /api/admin/login — проверить API key */
  app.post("/admin/login", async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) {
      throw AppError.validation(parsed.error.flatten().fieldErrors);
    }

    if (!config.adminApiKey || parsed.data.apiKey !== config.adminApiKey) {
      throw AppError.unauthorized("Неверный API ключ");
    }

    return reply.send(successResponse({ authenticated: true }));
  });

  /** GET /api/admin/dashboard — метрики (admin) */
  app.get("/admin/dashboard", async (request, reply) => {
    requireAdminKey(request);
    const data = await leadsService.dashboard();
    return reply.send(successResponse(data));
  });
}
