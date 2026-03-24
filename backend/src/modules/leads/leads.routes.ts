import type { FastifyInstance } from "fastify";
import { leadsService } from "./leads.service.js";
import {
  createLeadPayloadSchema,
  leadListQuerySchema,
  updateLeadSchema,
} from "./leads.schema.js";
import { AppError } from "../../common/errors.js";
import { successResponse } from "../../common/response.js";
import { requireAdminKey } from "../../common/auth.js";
import { uuidSchema } from "../../common/validation.js";
import { config } from "../../config/index.js";

export async function leadsRoutes(app: FastifyInstance) {
  /** POST /api/leads — создать заявку + расчёт + уведомления */
  app.post("/leads", {
    config: {
      rateLimit: {
        max: config.rateLimit.max,
        timeWindow: config.rateLimit.timeWindow,
      },
    },
  }, async (request, reply) => {
    const parsed = createLeadPayloadSchema.safeParse(request.body);
    if (!parsed.success) {
      throw AppError.validation(parsed.error.flatten().fieldErrors);
    }

    const result = await leadsService.create(parsed.data, request.log);
    return reply.status(201).send(successResponse(result));
  });

  /** GET /api/leads — список заявок с пагинацией (admin) */
  app.get("/leads", async (request, reply) => {
    requireAdminKey(request);

    const parsed = leadListQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      throw AppError.validation(parsed.error.flatten().fieldErrors);
    }

    const { leads, meta } = await leadsService.list(parsed.data);
    return reply.send(successResponse(leads, meta));
  });

  /** GET /api/leads/:id — детали заявки с расчётом (admin) */
  app.get<{ Params: { id: string } }>("/leads/:id", async (request, reply) => {
    requireAdminKey(request);

    const id = uuidSchema.safeParse(request.params.id);
    if (!id.success) throw AppError.badRequest("Некорректный ID заявки");

    const lead = await leadsService.findById(id.data);
    return reply.send(successResponse(lead));
  });

  /** PATCH /api/leads/:id — обновить заявку (admin) */
  app.patch<{ Params: { id: string } }>("/leads/:id", async (request, reply) => {
    requireAdminKey(request);

    const id = uuidSchema.safeParse(request.params.id);
    if (!id.success) throw AppError.badRequest("Некорректный ID заявки");

    const parsed = updateLeadSchema.safeParse(request.body);
    if (!parsed.success) {
      throw AppError.validation(parsed.error.flatten().fieldErrors);
    }

    const lead = await leadsService.update(id.data, parsed.data);
    request.log.info({ leadId: id.data, changes: Object.keys(parsed.data) }, "Lead updated by admin");
    return reply.send(successResponse(lead));
  });

  /** DELETE /api/leads/:id — удалить заявку (admin) */
  app.delete<{ Params: { id: string } }>("/leads/:id", async (request, reply) => {
    requireAdminKey(request);

    const id = uuidSchema.safeParse(request.params.id);
    if (!id.success) throw AppError.badRequest("Некорректный ID заявки");

    await leadsService.remove(id.data);
    request.log.info({ leadId: id.data }, "Lead deleted by admin");
    return reply.send(successResponse(null));
  });
}
