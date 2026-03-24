import type { Lead, Calculation } from "@prisma/client";

export function buildLeadEmailHtml(lead: Lead, calc: Calculation): string {
  return `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:24px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06)">

        <!-- Header -->
        <tr>
          <td style="background:#2563eb;padding:24px 32px">
            <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700">
              🏠 Новая заявка с сайта
            </h1>
          </td>
        </tr>

        <!-- Client Info -->
        <tr>
          <td style="padding:24px 32px 0">
            <h2 style="margin:0 0 12px;font-size:16px;color:#1e293b">Данные клиента</h2>
            <table width="100%" cellpadding="6" cellspacing="0" style="font-size:14px;color:#334155">
              <tr><td style="color:#64748b;width:140px">Имя</td><td style="font-weight:600">${esc(lead.name)}</td></tr>
              <tr><td style="color:#64748b">Телефон</td><td style="font-weight:600">${esc(lead.phone)}</td></tr>
              ${lead.email ? `<tr><td style="color:#64748b">Email</td><td>${esc(lead.email)}</td></tr>` : ""}
              <tr><td style="color:#64748b">Город</td><td>${esc(lead.city)}</td></tr>
              ${lead.comment ? `<tr><td style="color:#64748b">Комментарий</td><td>${esc(lead.comment)}</td></tr>` : ""}
            </table>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="padding:16px 32px"><hr style="border:none;border-top:1px solid #e2e8f0"></td></tr>

        <!-- Calculation Parameters -->
        <tr>
          <td style="padding:0 32px">
            <h2 style="margin:0 0 12px;font-size:16px;color:#1e293b">Параметры расчёта</h2>
            <table width="100%" cellpadding="6" cellspacing="0" style="font-size:13px;color:#334155">
              <tr><td style="color:#64748b;width:200px">Размеры дома</td><td>${calc.houseLength} × ${calc.houseWidth} × ${calc.wallHeight} м</td></tr>
              <tr><td style="color:#64748b">Толщина стен</td><td>${calc.wallThickness} мм</td></tr>
              <tr><td style="color:#64748b">Блок</td><td>${calc.blockLength}×${calc.blockHeight}×${calc.blockThickness} мм, ${esc(calc.density)}</td></tr>
              <tr><td style="color:#64748b">Площадь окон / дверей</td><td>${calc.windowArea} / ${calc.doorArea} м²</td></tr>
              <tr><td style="color:#64748b">Запас</td><td>${calc.reservePercent}%</td></tr>
            </table>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="padding:16px 32px"><hr style="border:none;border-top:1px solid #e2e8f0"></td></tr>

        <!-- Results -->
        <tr>
          <td style="padding:0 32px">
            <h2 style="margin:0 0 12px;font-size:16px;color:#1e293b">Результаты расчёта</h2>
            <table width="100%" cellpadding="6" cellspacing="0" style="font-size:13px;color:#334155">
              <tr><td style="color:#64748b;width:200px">Объём газобетона</td><td style="font-weight:600">${calc.totalVolume} м³</td></tr>
              <tr><td style="color:#64748b">Количество блоков</td><td style="font-weight:600">${calc.totalBlocks} шт</td></tr>
              <tr><td style="color:#64748b">Поддонов</td><td>${calc.totalPallets} шт</td></tr>
              <tr><td style="color:#64748b">Клей</td><td>${calc.totalGlueBags} мешков</td></tr>
              <tr><td style="color:#64748b">Ориентировочный вес</td><td>${Math.round(calc.totalWeight)} кг</td></tr>
            </table>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="padding:16px 32px"><hr style="border:none;border-top:1px solid #e2e8f0"></td></tr>

        <!-- Cost -->
        <tr>
          <td style="padding:0 32px">
            <h2 style="margin:0 0 12px;font-size:16px;color:#1e293b">Стоимость</h2>
            <table width="100%" cellpadding="6" cellspacing="0" style="font-size:14px;color:#334155">
              <tr><td style="color:#64748b;width:200px">Блоки</td><td>${fmtRub(calc.blocksCost)}</td></tr>
              <tr><td style="color:#64748b">Клей</td><td>${fmtRub(calc.glueCost)}</td></tr>
              <tr><td style="color:#64748b">Доставка</td><td>${fmtRub(calc.deliveryCost)}</td></tr>
              <tr style="font-size:16px">
                <td style="color:#2563eb;font-weight:700;padding-top:12px">Итого</td>
                <td style="color:#2563eb;font-weight:700;padding-top:12px">${fmtRub(calc.totalCost)}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 32px;font-size:12px;color:#94a3b8;text-align:center">
            Заявка создана: ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fmtRub(n: number): string {
  return n.toLocaleString("ru-RU") + " ₽";
}
