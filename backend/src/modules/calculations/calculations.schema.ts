import { z } from "zod";

const positiveFloat = z.number().min(0);
const positiveInt = z.number().int().min(0);

// ── Входные параметры расчёта ─────────────────────────

export const calculationInputSchema = z.object({
  houseLength: z.number().min(0.1, "Длина должна быть > 0").max(200),
  houseWidth: z.number().min(0.1, "Ширина должна быть > 0").max(200),
  wallHeight: z.number().min(0.1, "Высота должна быть > 0").max(50),
  wallThickness: z.number().min(50).max(1000),
  blockLength: z.number().int().min(50).max(1000),
  blockHeight: z.number().int().min(50).max(1000),
  blockThickness: z.number().int().min(50).max(1000),
  density: z.string().min(1),
  windowArea: positiveFloat.max(10000),
  doorArea: positiveFloat.max(10000),
  reservePercent: positiveFloat.max(50),
  pricePerM3: positiveFloat.max(1_000_000),
  glueBagPrice: positiveFloat.max(100_000),
  deliveryPrice: positiveFloat.max(1_000_000),
  hasPartitions: z.boolean().default(false),
  partitionArea: positiveFloat.max(10000).default(0),
  hasPediments: z.boolean().default(false),
  pedimentArea: positiveFloat.max(10000).default(0),
  hasDelivery: z.boolean().default(false),
});

// ── Результаты расчёта ────────────────────────────────

export const calculationResultSchema = z.object({
  totalVolume: positiveFloat,
  totalBlocks: positiveInt,
  totalPallets: positiveInt,
  totalGlueBags: positiveInt,
  totalWeight: positiveFloat,
  blocksCost: positiveFloat,
  glueCost: positiveFloat,
  deliveryCost: positiveFloat,
  totalCost: positiveFloat,
});

export type CalculationInput = z.infer<typeof calculationInputSchema>;
export type CalculationResult = z.infer<typeof calculationResultSchema>;
