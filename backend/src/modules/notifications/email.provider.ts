import { createTransport } from "nodemailer";
import type { Lead, Calculation } from "@prisma/client";
import { config } from "../../config/index.js";
import { buildLeadEmailHtml } from "./email.template.js";

function getTransport() {
  return createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });
}

export const emailProvider = {
  async sendLeadNotification(lead: Lead, calc: Calculation): Promise<void> {
    if (!config.smtp.enabled) return;

    const html = buildLeadEmailHtml(lead, calc);

    const transport = getTransport();
    await transport.sendMail({
      from: config.smtp.from,
      to: config.smtp.managerEmail,
      subject: `Новая заявка: ${lead.name}, ${lead.city} — ${calc.totalCost.toLocaleString("ru-RU")} ₽`,
      html,
    });
  },
};
