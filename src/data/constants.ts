import type {
  BlockSize,
  DensityGrade,
  DensityOption,
  RecommendationCard,
  FaqItem,
} from "@/types";

// ── Размеры блоков (длина × высота × толщина, мм) ────

export const BLOCK_SIZES: BlockSize[] = [
  // Стеновые блоки
  { label: "600×200×200",  length: 600, height: 200, width: 200 },
  { label: "600×200×250",  length: 600, height: 200, width: 250 },
  { label: "600×200×300",  length: 600, height: 200, width: 300 },
  { label: "600×250×300",  length: 600, height: 250, width: 300 },
  { label: "600×200×375",  length: 600, height: 200, width: 375 },
  { label: "600×200×400",  length: 600, height: 200, width: 400 },
  { label: "625×250×200",  length: 625, height: 250, width: 200 },
  { label: "625×250×250",  length: 625, height: 250, width: 250 },
  { label: "625×250×300",  length: 625, height: 250, width: 300 },
  { label: "625×250×375",  length: 625, height: 250, width: 375 },
  { label: "625×250×400",  length: 625, height: 250, width: 400 },
  { label: "625×250×500",  length: 625, height: 250, width: 500 },
  // Перегородочные блоки
  { label: "600×250×75",   length: 600, height: 250, width: 75 },
  { label: "600×250×100",  length: 600, height: 250, width: 100 },
  { label: "625×250×100",  length: 625, height: 250, width: 100 },
  { label: "625×250×150",  length: 625, height: 250, width: 150 },
];

// ── Плотность ─────────────────────────────────────────

export const DENSITY_OPTIONS: DensityOption[] = [
  { value: "D400", label: "D400", kgPerM3: 400 },
  { value: "D500", label: "D500", kgPerM3: 500 },
  { value: "D600", label: "D600", kgPerM3: 600 },
];

export const DENSITY_WEIGHT_MAP: Record<DensityGrade, number> = {
  D400: 400,
  D500: 500,
  D600: 600,
};

// ── Расчётные константы ───────────────────────────────

/** Расход клея: мешков (25 кг) на 1 м³ газобетона при толщине шва 2–3 мм */
export const GLUE_BAGS_PER_CUBIC_METER = 1.5;

/** Среднее количество м³ газобетона на одном поддоне */
export const CUBIC_METERS_PER_PALLET = 1.8;

/** Вес одного мешка клея, кг */
export const GLUE_BAG_WEIGHT_KG = 25;

// ── Ограничения ввода ─────────────────────────────────

export const INPUT_LIMITS = {
  houseLength: { min: 1, max: 100 },
  houseWidth: { min: 1, max: 100 },
  wallHeight: { min: 1, max: 20 },
  wallThickness: { min: 50, max: 600 },
  area: { min: 0, max: 10000 },
  reservePercent: { min: 0, max: 30 },
  price: { min: 0, max: 100000 },
  blockDimension: { min: 50, max: 1000 },
} as const;

// ── Значения по умолчанию ─────────────────────────────

export const DEFAULT_CALCULATOR_VALUES = {
  houseLength: 10,
  houseWidth: 8,
  wallHeight: 3,
  wallThickness: 300,
  density: "D500" as DensityGrade,
  windowArea: 12,
  doorArea: 4,
  reservePercent: 5,
  pricePerCubicMeter: 5500,
  glueBagPrice: 350,
  deliveryCost: 15000,
  hasPartitions: false,
  partitionArea: 0,
  hasPediments: false,
  pedimentArea: 0,
  hasDelivery: false,
} as const;

/** Ключ в localStorage для сохранения состояния калькулятора */
export const STORAGE_KEY = "gazoblock-calc-state";

// ── Контент: рекомендации ─────────────────────────────

export const RECOMMENDATIONS: RecommendationCard[] = [
  {
    id: "house",
    title: "Для дома постоянного проживания",
    description:
      "Для несущих наружных стен капитального дома рекомендуется использовать блоки повышенной плотности с достаточной толщиной для теплоизоляции.",
    thickness: "375–400 мм",
    density: "D500–D600",
    icon: "home",
  },
  {
    id: "dacha",
    title: "Для дачи",
    description:
      "Для сезонного проживания можно использовать блоки меньшей толщины — тепловые потери не так критичны.",
    thickness: "250–300 мм",
    density: "D400–D500",
    icon: "trees",
  },
  {
    id: "partitions",
    title: "Для перегородок",
    description:
      "Внутренние ненесущие перегородки возводятся из тонких блоков с хорошей звукоизоляцией.",
    thickness: "100–150 мм",
    density: "D500–D600",
    icon: "layout",
  },
  {
    id: "garage",
    title: "Для гаража",
    description:
      "Гаражные стены не требуют утепления как жилые, но должны быть прочными и устойчивыми.",
    thickness: "200–300 мм",
    density: "D500–D600",
    icon: "warehouse",
  },
  {
    id: "bath",
    title: "Для бани",
    description:
      "Для бани важна паропроницаемость и устойчивость к влаге. Газобетон подходит при правильной гидроизоляции.",
    thickness: "250–300 мм",
    density: "D400–D500",
    icon: "flame",
  },
];

// ── Контент: FAQ ──────────────────────────────────────

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-how-to-calc",
    question: "Как рассчитать количество газобетонных блоков на дом?",
    answer:
      "Для расчёта газобетона нужно знать периметр дома, высоту стен и толщину кладки. Онлайн-калькулятор вычисляет общую площадь наружных стен, вычитает оконные и дверные проёмы, определяет объём газобетона в кубических метрах и переводит его в штуки блоков с учётом запаса на подрезку.",
  },
  {
    id: "faq-reserve",
    question: "Какой запас газоблока закладывать при строительстве?",
    answer:
      "При кладке газобетонных стен рекомендуется запас 5–10%. Он покрывает подрезку блоков на углах и проёмах, бой при транспортировке и ошибки при монтаже. Для домов сложной планировки с множеством углов лучше заложить 10%.",
  },
  {
    id: "faq-glue",
    question: "Сколько клея нужно для кладки 1 м³ газобетона?",
    answer:
      "Средний расход клея для газобетонных блоков — 1–1,5 мешка (25 кг) на 1 м³ кладки при толщине шва 2–3 мм. Фактический расход зависит от геометрии газоблока, ровности поверхности и квалификации каменщика. Калькулятор автоматически рассчитывает количество мешков.",
  },
  {
    id: "faq-cost",
    question: "Что влияет на стоимость строительства из газобетона?",
    answer:
      "Основные факторы цены: объём газобетонных блоков, марка плотности (D400, D500, D600), расход клея, стоимость доставки поддонов. Также влияют регион строительства, сезонность и объём закупки — при крупных партиях возможны скидки от производителя.",
  },
  {
    id: "faq-bearing",
    question: "Какой газоблок выбрать для несущих стен дома?",
    answer:
      "Для несущих наружных стен жилого дома из газобетона рекомендуются блоки плотностью D500–D600 толщиной 300–400 мм. Газоблоки D400 подходят для ненесущих конструкций, перегородок и утепления. При выборе учитывайте этажность дома и климатическую зону.",
  },
  {
    id: "faq-partitions",
    question: "Как рассчитать газобетон для внутренних перегородок?",
    answer:
      "Включите переключатель «Внутренние перегородки» в калькуляторе и укажите их суммарную площадь. Расчёт добавит перегородки к общему объёму газобетона. Для перегородок обычно используют газоблоки толщиной 100–150 мм плотностью D500–D600.",
  },
];
