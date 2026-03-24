import type { CalculatorInput, CalculatorResult } from "@/types";
import {
  GLUE_BAGS_PER_CUBIC_METER,
  CUBIC_METERS_PER_PALLET,
  DENSITY_WEIGHT_MAP,
} from "@/data/constants";

/** Безопасный clamp: гарантирует, что число не NaN и в диапазоне */
function clamp(value: number, min: number, max: number): number {
  const n = Number.isFinite(value) ? value : 0;
  return Math.min(Math.max(n, min), max);
}

export function calculateAeratedConcrete(input: CalculatorInput): CalculatorResult {
  // Безопасные значения — все числа clamp-ятся, чтобы исключить NaN и отрицательные
  const houseLength = clamp(input.houseLength, 0, 200);
  const houseWidth = clamp(input.houseWidth, 0, 200);
  const wallHeight = clamp(input.wallHeight, 0, 50);
  const wallThickness = clamp(input.wallThickness, 0, 1000);
  const windowArea = clamp(input.windowArea, 0, 10000);
  const doorArea = clamp(input.doorArea, 0, 10000);
  const reservePercent = clamp(input.reservePercent, 0, 50);
  const pricePerCubicMeter = clamp(input.pricePerCubicMeter, 0, 1_000_000);
  const glueBagPrice = clamp(input.glueBagPrice, 0, 100_000);
  const deliveryCost = clamp(input.deliveryCost, 0, 1_000_000);
  const partitionArea = clamp(input.partitionArea, 0, 10000);
  const pedimentArea = clamp(input.pedimentArea, 0, 10000);

  const { blockSize, density, hasPartitions, hasPediments, hasDelivery } = input;

  // Периметр дома
  const perimeter = (houseLength + houseWidth) * 2;

  // Площадь наружных стен
  const grossWallArea = perimeter * wallHeight;

  // Чистая площадь (минус окна и двери)
  const netWallArea = Math.max(0, grossWallArea - windowArea - doorArea);

  // Общая площадь с перегородками и фронтонами
  let totalArea = netWallArea;
  if (hasPartitions && partitionArea > 0) {
    totalArea += partitionArea;
  }
  if (hasPediments && pedimentArea > 0) {
    totalArea += pedimentArea;
  }

  // Толщина стены в метрах
  const wallThicknessM = wallThickness / 1000;

  // Объём газобетона
  const concreteVolume = totalArea * wallThicknessM;

  // Объём одного блока (размеры в мм → переводим в метры)
  const bLen = clamp(blockSize.length, 1, 1000);
  const bHeight = clamp(blockSize.height, 1, 1000);
  const bWidth = clamp(blockSize.width, 1, 1000);
  const singleBlockVolume = (bLen / 1000) * (bHeight / 1000) * (bWidth / 1000);

  // Количество блоков (без запаса) — safe division
  const rawBlockCount = singleBlockVolume > 0 ? concreteVolume / singleBlockVolume : 0;

  // С запасом, округление вверх
  const blockCount = Math.ceil(rawBlockCount * (1 + reservePercent / 100));

  // Количество поддонов
  const palletCount = Math.ceil(concreteVolume / CUBIC_METERS_PER_PALLET);

  // Количество мешков клея
  const glueBagCount = Math.ceil(concreteVolume * GLUE_BAGS_PER_CUBIC_METER);

  // Ориентировочный вес
  const densityWeight = DENSITY_WEIGHT_MAP[density] ?? 500;
  const estimatedWeight = concreteVolume * densityWeight;

  // Стоимость
  const blocksCost = concreteVolume * pricePerCubicMeter;
  const glueCost = glueBagCount * glueBagPrice;
  const finalDeliveryCost = hasDelivery ? deliveryCost : 0;
  const totalCost = blocksCost + glueCost + finalDeliveryCost;

  return {
    perimeter: round2(perimeter),
    grossWallArea: round2(grossWallArea),
    netWallArea: round2(netWallArea),
    totalArea: round2(totalArea),
    concreteVolume: round2(concreteVolume),
    singleBlockVolume: round6(singleBlockVolume),
    blockCount: safeInt(blockCount),
    palletCount: safeInt(palletCount),
    glueBagCount: safeInt(glueBagCount),
    estimatedWeight: safeInt(estimatedWeight),
    blocksCost: safeInt(blocksCost),
    glueCost: safeInt(glueCost),
    deliveryCost: safeInt(finalDeliveryCost),
    totalCost: safeInt(totalCost),
  };
}

function round2(n: number): number {
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
}

function round6(n: number): number {
  return Number.isFinite(n) ? Math.round(n * 1000000) / 1000000 : 0;
}

function safeInt(n: number): number {
  return Number.isFinite(n) ? Math.round(n) : 0;
}
