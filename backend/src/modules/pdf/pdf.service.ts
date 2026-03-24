import PDFDocument from "pdfkit";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { Lead, Calculation } from "@prisma/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FONT_DIR = path.resolve(__dirname, "../../../fonts");
const FONT_REGULAR = path.join(FONT_DIR, "Roboto-Regular.ttf");
const FONT_BOLD = path.join(FONT_DIR, "Roboto-Bold.ttf");

/** Доступен ли кириллический шрифт для PDF */
export function isPdfAvailable(): boolean {
  return existsSync(FONT_REGULAR);
}

/** Генерация PDF-расчёта. Возвращает Buffer. */
export async function generateLeadPdf(lead: Lead, calc: Calculation): Promise<Buffer> {
  if (!isPdfAvailable()) {
    throw new Error(
      "PDF generation unavailable: place Roboto-Regular.ttf (and optionally Roboto-Bold.ttf) in backend/fonts/",
    );
  }

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    const doc = new PDFDocument({ size: "A4", margin: 50 });

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Регистрация шрифтов
    doc.registerFont("Main", FONT_REGULAR);
    if (existsSync(FONT_BOLD)) {
      doc.registerFont("Bold", FONT_BOLD);
    } else {
      doc.registerFont("Bold", FONT_REGULAR);
    }

    const blue = "#2563eb";
    const dark = "#1e293b";
    const gray = "#64748b";
    const pageWidth = doc.page.width - 100; // margin * 2

    // ── Header ─────────────────────────────────────
    doc
      .font("Bold")
      .fontSize(22)
      .fillColor(blue)
      .text("ГазоБлок", 50, 50);

    doc
      .font("Main")
      .fontSize(10)
      .fillColor(gray)
      .text("Расчёт газобетонных блоков", 50, 76);

    doc
      .font("Main")
      .fontSize(9)
      .fillColor(gray)
      .text(
        `Дата: ${new Date().toLocaleDateString("ru-RU")}`,
        50,
        50,
        { align: "right", width: pageWidth },
      );

    // Линия
    doc
      .moveTo(50, 100)
      .lineTo(50 + pageWidth, 100)
      .strokeColor("#e2e8f0")
      .stroke();

    let y = 115;

    // ── Данные клиента ─────────────────────────────
    y = sectionTitle(doc, "Данные клиента", y, dark);
    y = row(doc, "Имя", lead.name, y, gray, dark);
    y = row(doc, "Телефон", lead.phone, y, gray, dark);
    if (lead.email) y = row(doc, "Email", lead.email, y, gray, dark);
    y = row(doc, "Город", lead.city, y, gray, dark);
    if (lead.comment) y = row(doc, "Комментарий", lead.comment, y, gray, dark);

    y += 10;

    // ── Параметры расчёта ──────────────────────────
    y = sectionTitle(doc, "Параметры расчёта", y, dark);
    y = row(doc, "Размеры дома", `${calc.houseLength} × ${calc.houseWidth} × ${calc.wallHeight} м`, y, gray, dark);
    y = row(doc, "Толщина стен", `${calc.wallThickness} мм`, y, gray, dark);
    y = row(doc, "Блок", `${calc.blockLength}×${calc.blockHeight}×${calc.blockThickness} мм`, y, gray, dark);
    y = row(doc, "Плотность", calc.density, y, gray, dark);
    y = row(doc, "Площадь окон", `${calc.windowArea} м²`, y, gray, dark);
    y = row(doc, "Площадь дверей", `${calc.doorArea} м²`, y, gray, dark);
    y = row(doc, "Запас", `${calc.reservePercent}%`, y, gray, dark);

    y += 10;

    // ── Результаты ─────────────────────────────────
    y = sectionTitle(doc, "Результаты расчёта", y, dark);
    y = row(doc, "Объём газобетона", `${calc.totalVolume} м³`, y, gray, dark);
    y = row(doc, "Количество блоков", `${calc.totalBlocks} шт`, y, gray, dark);
    y = row(doc, "Поддонов", `${calc.totalPallets} шт`, y, gray, dark);
    y = row(doc, "Клей для кладки", `${calc.totalGlueBags} мешков`, y, gray, dark);
    y = row(doc, "Ориентировочный вес", `${Math.round(calc.totalWeight)} кг`, y, gray, dark);

    y += 10;

    // ── Стоимость ──────────────────────────────────
    y = sectionTitle(doc, "Стоимость", y, dark);
    y = row(doc, "Блоки", fmtRub(calc.blocksCost), y, gray, dark);
    y = row(doc, "Клей", fmtRub(calc.glueCost), y, gray, dark);
    y = row(doc, "Доставка", fmtRub(calc.deliveryCost), y, gray, dark);

    // Итого — выделено
    y += 5;
    doc
      .font("Bold")
      .fontSize(14)
      .fillColor(blue)
      .text("Итого:", 50, y);
    doc
      .font("Bold")
      .fontSize(14)
      .fillColor(blue)
      .text(fmtRub(calc.totalCost), 250, y);
    y += 30;

    // ── Disclaimer ─────────────────────────────────
    doc
      .moveTo(50, y)
      .lineTo(50 + pageWidth, y)
      .strokeColor("#e2e8f0")
      .stroke();
    y += 10;

    doc
      .font("Main")
      .fontSize(8)
      .fillColor(gray)
      .text(
        "Расчёт носит ориентировочный характер и не является коммерческим предложением. " +
        "Для точного расчёта свяжитесь с менеджером.",
        50,
        y,
        { width: pageWidth },
      );

    doc.end();
  });
}

// ── Helpers ──────────────────────────────────────────

function sectionTitle(doc: PDFKit.PDFDocument, title: string, y: number, color: string): number {
  doc.font("Bold").fontSize(13).fillColor(color).text(title, 50, y);
  return y + 22;
}

function row(
  doc: PDFKit.PDFDocument,
  label: string,
  value: string,
  y: number,
  labelColor: string,
  valueColor: string,
): number {
  doc.font("Main").fontSize(10).fillColor(labelColor).text(label, 50, y);
  doc.font("Main").fontSize(10).fillColor(valueColor).text(value, 250, y);
  return y + 18;
}

function fmtRub(n: number): string {
  return n.toLocaleString("ru-RU") + " ₽";
}
