import type { FastifyInstance } from "fastify";
import { leadsService } from "../leads/leads.service.js";
import { generateLeadPdf, isPdfAvailable } from "./pdf.service.js";
import { AppError } from "../../common/errors.js";
import { successResponse } from "../../common/response.js";
import { requireAdminKey } from "../../common/auth.js";
import { uuidSchema } from "../../common/validation.js";

export async function pdfRoutes(app: FastifyInstance) {
  /** POST /api/pdf/generate/:leadId — сгенерировать PDF расчёта (admin) */
  app.post<{ Params: { leadId: string } }>("/pdf/generate/:leadId", async (request, reply) => {
    requireAdminKey(request);

    const leadId = uuidSchema.safeParse(request.params.leadId);
    if (!leadId.success) throw AppError.badRequest("Некорректный ID заявки");

    if (!isPdfAvailable()) {
      throw AppError.badRequest(
        "PDF generation unavailable. Place Roboto-Regular.ttf in backend/fonts/ directory.",
      );
    }

    const lead = await leadsService.findById(leadId.data);

    if (!lead.calculation) {
      throw AppError.notFound("У заявки нет данных расчёта");
    }

    const pdfBuffer = await generateLeadPdf(lead, lead.calculation);

    request.log.info({ leadId: leadId.data }, "PDF generated");

    return reply
      .header("Content-Type", "application/pdf")
      .header(
        "Content-Disposition",
        `attachment; filename="raschet-${lead.id.slice(0, 8)}.pdf"`,
      )
      .send(pdfBuffer);
  });

  /** GET /api/pdf/status — проверить доступность PDF-генерации */
  app.get("/pdf/status", async (_request, reply) => {
    return reply.send(
      successResponse({ available: isPdfAvailable() }),
    );
  });
}
