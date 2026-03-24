import { config } from "../../config/index.js";
import type { Lead, Calculation } from "@prisma/client";

const TELEGRAM_API = "https://api.telegram.org";

function formatLeadMessage(lead: Lead, calc: Calculation): string {
  const lines = [
    "🏠 <b>Новая заявка с сайта!</b>",
    "",
    `👤 <b>Клиент:</b> ${esc(lead.name)}`,
    `📱 <b>Телефон:</b> ${esc(lead.phone)}`,
  ];

  if (lead.email) {
    lines.push(`📧 <b>Email:</b> ${esc(lead.email)}`);
  }

  lines.push(`🏙 <b>Город:</b> ${esc(lead.city)}`);

  if (lead.comment) {
    lines.push(`💬 <b>Комментарий:</b> ${esc(lead.comment)}`);
  }

  lines.push(
    "",
    "📊 <b>Расчёт:</b>",
    `• Объём газобетона: ${calc.totalVolume} м³`,
    `• Количество блоков: ${calc.totalBlocks} шт`,
    `• Количество поддонов: ${calc.totalPallets} шт`,
    `• Клей: ${calc.totalGlueBags} мешков`,
    `• Вес: ${Math.round(calc.totalWeight)} кг`,
    "",
    "💰 <b>Стоимость:</b>",
    `• Блоки: ${formatRub(calc.blocksCost)}`,
    `• Клей: ${formatRub(calc.glueCost)}`,
    `• Доставка: ${formatRub(calc.deliveryCost)}`,
    `• <b>Итого: ${formatRub(calc.totalCost)}</b>`,
    "",
    `🕐 ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}`,
  );

  return lines.join("\n");
}

function esc(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Telegram API error ${response.status}: ${body}`);
    }
  },
};
