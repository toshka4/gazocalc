import type { Lead, Calculation } from "@prisma/client";
import { telegramProvider } from "./telegram.provider.js";
import { emailProvider } from "./email.provider.js";

interface Logger {
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

const fallbackLogger: Logger = {
  info: () => {},
  warn: (...args) => console.warn(...args),
  error: (...args) => console.error(...args),
};

export const notificationsService = {
  /**
   * Отправить все уведомления о новой заявке.
   * Каждый провайдер вызывается независимо — сбой одного не блокирует остальные.
   */
  async notifyNewLead(lead: Lead, calc: Calculation, log?: Logger): Promise<void> {
    const logger = log ?? fallbackLogger;

    const results = await Promise.allSettled([
      telegramProvider
        .sendLeadNotification(lead, calc)
        .then(() => logger.info({ provider: "telegram", leadId: lead.id }, "Notification sent"))
        .catch((err) => {
          logger.error({ provider: "telegram", err, leadId: lead.id }, "Notification failed");
        }),
      emailProvider
        .sendLeadNotification(lead, calc)
        .then(() => logger.info({ provider: "email", leadId: lead.id }, "Notification sent"))
        .catch((err) => {
          logger.error({ provider: "email", err, leadId: lead.id }, "Notification failed");
        }),
    ]);

    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length > 0) {
      logger.warn({ failedCount: failed.length, leadId: lead.id }, "Some notifications had unhandled errors");
    }
  },
};
