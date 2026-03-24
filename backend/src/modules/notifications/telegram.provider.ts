import { config } from "../../config/index.js";
import type { Lead, Calculation } from "@prisma/client";

const TELEGRAM_API = "https://api.telegram.org";

function formatLeadMessage(lead: Lead, calc: Calculation): string {
  const lines = [
    "🏠 *Новая заявка с сайта!*",
    "",
    `👤 *Клиент:* ${escapeMarkdown(lead.name)}`,
    `📱 *Телефон:* ${escapeMarkdown(lead.phone)}`,
  ];

  if (lead.email) {
    lines.push(`📧 *Email:* ${escapeMarkdown(lead.email)}`);
  }

  lines.push(`🏙 *Город:* ${escapeMarkdown(lead.city)}`);

  if (lead.comment) {
    lines.push(`💬 *Комментарий:* ${escapeMarkdown(lead.comment)}`);
  }

  lines.push(
    "",
    "📊 *Расчёт:*",
    `• Объём газобетона: ${calc.totalVolume} м³`,
    `• Количество блоков: ${calc.totalBlocks} шт`,
    `• Количество поддонов: ${calc.totalPallets} шт`,
    `• Клей: ${calc.totalGlueBags} мешков`,
    `• Вес: ${Math.round(calc.totalWeight)} кг`,
    "",
    "💰 *Стоимость:*",
    `• Блоки: ${formatRub(calc.blocksCost)}`,
    `• Клей: ${formatRub(calc.glueCost)}`,
    `• Доставка: ${formatRub(calc.deliveryCost)}`,
    `• *Итого: ${formatRub(calc.totalCost)}*`,
    "",
    `🕐 ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}`,
  );

  return lines.join("\n");
}

function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}

function formatRub(n: number): string {
  return n.toLocaleString("ru-RU") + " ₽";
}

export const telegramProvider = {
  async sendLeadNotification(lead: Lead, calc: Calculation): Promise<void> {
    if (!config.telegram.enabled) return;

    const text = formatLeadMessage(lead, calc);

    const url = `${TELEGRAM_API}/bot${config.telegram.token}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: config.telegram.chatId,
        text,
        parse_mode: "MarkdownV2",
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Telegram API error ${response.status}: ${body}`);
    }
  },
};
