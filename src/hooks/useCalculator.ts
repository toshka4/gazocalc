import { useState, useMemo, useCallback, useEffect } from "react";
import type { CalculatorInput, CalculatorResult, BlockSize } from "@/types";
import { BLOCK_SIZES, DEFAULT_CALCULATOR_VALUES, STORAGE_KEY } from "@/data/constants";
import { calculateAeratedConcrete } from "@/lib/calculate";

export interface UseCalculatorReturn {
  input: CalculatorInput;
  result: CalculatorResult;
  isCustomBlock: boolean;
  setField: <K extends keyof CalculatorInput>(key: K, value: CalculatorInput[K]) => void;
  setBlockPreset: (index: number) => void;
  setCustomBlock: (block: BlockSize) => void;
  enableCustomBlock: () => void;
  reset: () => void;
}

function buildDefaultInput(): CalculatorInput {
  const d = DEFAULT_CALCULATOR_VALUES;
  return {
    houseLength: d.houseLength,
    houseWidth: d.houseWidth,
    wallHeight: d.wallHeight,
    wallThickness: d.wallThickness,
    blockSize: BLOCK_SIZES[0],
    density: d.density,
    windowArea: d.windowArea,
    doorArea: d.doorArea,
    reservePercent: d.reservePercent,
    pricePerCubicMeter: d.pricePerCubicMeter,
    glueBagPrice: d.glueBagPrice,
    deliveryCost: d.deliveryCost,
    hasPartitions: d.hasPartitions,
    partitionArea: d.partitionArea,
    hasPediments: d.hasPediments,
    pedimentArea: d.pedimentArea,
    hasDelivery: d.hasDelivery,
  };
}

/** Пытаемся восстановить состояние из localStorage */
function loadPersistedInput(): CalculatorInput | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    // Базовая проверка структуры — наличие ключевых полей
    if (
      typeof parsed.houseLength !== "number" ||
      typeof parsed.houseWidth !== "number" ||
      typeof parsed.wallHeight !== "number"
    ) {
      return null;
    }
    // Восстанавливаем blockSize — если сохранённый объект валиден
    const bs = parsed.blockSize;
    if (
      !bs ||
      typeof bs !== "object" ||
      typeof (bs as BlockSize).length !== "number"
    ) {
      return null;
    }
    return { ...buildDefaultInput(), ...(parsed as Partial<CalculatorInput>) };
  } catch {
    return null;
  }
}

function persistInput(input: CalculatorInput): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(input));
  } catch {
    // quota exceeded — молча игнорируем
  }
}

/** Определяем, является ли blockSize кастомным (не из пресетов) */
function isBlockCustom(blockSize: BlockSize): boolean {
  return !BLOCK_SIZES.some(
    (b) =>
      b.length === blockSize.length &&
      b.height === blockSize.height &&
      b.width === blockSize.width,
  );
}

export function useCalculator(): UseCalculatorReturn {
  const [input, setInput] = useState<CalculatorInput>(() => {
    return loadPersistedInput() ?? buildDefaultInput();
  });

  const [isCustomBlock, setIsCustomBlock] = useState(() =>
    isBlockCustom(input.blockSize),
  );

  // Persist on every change (debounce не нужен — JSON.stringify быстрый на таком объёме)
  useEffect(() => {
    persistInput(input);
  }, [input]);

  const result = useMemo(() => calculateAeratedConcrete(input), [input]);

  const setField = useCallback(
    <K extends keyof CalculatorInput>(key: K, value: CalculatorInput[K]) => {
      setInput((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const setBlockPreset = useCallback((index: number) => {
    const preset = BLOCK_SIZES[index];
    if (!preset) return;
    setIsCustomBlock(false);
    setInput((prev) => ({ ...prev, blockSize: preset }));
  }, []);

  const setCustomBlock = useCallback((block: BlockSize) => {
    setIsCustomBlock(true);
    setInput((prev) => ({ ...prev, blockSize: block }));
  }, []);

  const enableCustomBlock = useCallback(() => {
    setIsCustomBlock(true);
  }, []);

  const reset = useCallback(() => {
    setInput(buildDefaultInput());
    setIsCustomBlock(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return {
    input,
    result,
    isCustomBlock,
    setField,
    setBlockPreset,
    setCustomBlock,
    enableCustomBlock,
    reset,
  };
}
