// ── Блоки и плотность ──────────────────────────────────

export interface BlockSize {
  label: string;
  length: number; // мм
  height: number; // мм
  width: number;  // мм
}

export type DensityGrade = "D400" | "D500" | "D600";

export interface DensityOption {
  value: DensityGrade;
  label: string;
  kgPerM3: number;
}

// ── Ввод калькулятора ─────────────────────────────────

export interface CalculatorInput {
  houseLength: number;    // м
  houseWidth: number;     // м
  wallHeight: number;     // м
  wallThickness: number;  // мм

  blockSize: BlockSize;
  density: DensityGrade;

  windowArea: number;     // м²
  doorArea: number;       // м²
  reservePercent: number; // %

  pricePerCubicMeter: number;  // руб/м³
  glueBagPrice: number;        // руб/мешок
  deliveryCost: number;        // руб

  hasPartitions: boolean;
  partitionArea: number;  // м²

  hasPediments: boolean;  // фронтоны
  pedimentArea: number;   // м²

  hasDelivery: boolean;
}

// ── Результат расчёта ─────────────────────────────────

export interface CalculatorResult {
  perimeter: number;              // м
  grossWallArea: number;          // м²
  netWallArea: number;            // м²
  totalArea: number;              // м² (включая перегородки и фронтоны)
  concreteVolume: number;         // м³
  singleBlockVolume: number;      // м³
  blockCount: number;             // шт
  palletCount: number;            // шт
  glueBagCount: number;           // шт
  estimatedWeight: number;        // кг
  blocksCost: number;             // руб
  glueCost: number;               // руб
  deliveryCost: number;           // руб
  totalCost: number;              // руб
}

// ── Форма лида ────────────────────────────────────────

export interface LeadFormData {
  name: string;
  phone: string;
  email: string;
  city: string;
  comment: string;
}

// Payload для отправки на backend
export interface LeadSubmitPayload extends LeadFormData {
  calculatorResult: CalculatorResult | null;
  calculatorInput: CalculatorInput | null;
  submittedAt: string;
}

// ── Контент ───────────────────────────────────────────

export type RecommendationIcon = "home" | "trees" | "layout" | "warehouse" | "flame";

export interface RecommendationCard {
  id: string;
  title: string;
  description: string;
  thickness: string;
  density: string;
  icon: RecommendationIcon;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
