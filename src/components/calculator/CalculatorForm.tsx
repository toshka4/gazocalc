import type { CalculatorInput, BlockSize, DensityGrade } from "@/types";
import { BLOCK_SIZES, DENSITY_OPTIONS } from "@/data/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { NumberField } from "@/components/ui/number-field";
import { SwitchRow } from "@/components/ui/switch-row";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Calculator, RotateCcw, Settings2 } from "lucide-react";

interface CalculatorFormProps {
  input: CalculatorInput;
  isCustomBlock: boolean;
  setField: <K extends keyof CalculatorInput>(key: K, value: CalculatorInput[K]) => void;
  setBlockPreset: (index: number) => void;
  setCustomBlock: (block: BlockSize) => void;
  enableCustomBlock: () => void;
  onReset: () => void;
}

export function CalculatorForm({
  input,
  isCustomBlock,
  setField,
  setBlockPreset,
  setCustomBlock,
  enableCustomBlock,
  onReset,
}: CalculatorFormProps) {
  return (
    <section id="calculator" className="scroll-mt-20 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Расчёт газобетонных блоков для вашего дома
          </h2>
          <p className="mt-3 text-muted-foreground">
            Укажите размеры дома, толщину стен и марку газоблока — калькулятор
            мгновенно рассчитает объём кладки, количество блоков, расход клея и стоимость
            строительства
          </p>
        </div>

        <Card className="mx-auto max-w-4xl shadow-xl shadow-slate-200/60">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Calculator className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-xl">Параметры расчёта</CardTitle>
            </div>
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
              Сбросить
            </button>
          </CardHeader>

          <CardContent className="pt-6">
            {/* ── Основные размеры ──────── */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <NumberField
                label="Длина дома"
                unit="м"
                value={input.houseLength}
                onChange={(v) => setField("houseLength", v)}
                step={0.1}
                hint="Наружный размер"
              />
              <NumberField
                label="Ширина дома"
                unit="м"
                value={input.houseWidth}
                onChange={(v) => setField("houseWidth", v)}
                step={0.1}
                hint="Наружный размер"
              />
              <NumberField
                label="Высота стен"
                unit="м"
                value={input.wallHeight}
                onChange={(v) => setField("wallHeight", v)}
                step={0.1}
              />
              <NumberField
                label="Толщина стены"
                unit="мм"
                value={input.wallThickness}
                onChange={(v) => setField("wallThickness", v)}
                step={50}
                hint="Обычно 300–400 мм"
              />
            </div>

            <Separator className="my-6" />

            {/* ── Блок и плотность ──────── */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Размер блока</Label>
                <Select
                  value={isCustomBlock ? "custom" : input.blockSize.label}
                  onValueChange={(val) => {
                    if (val === "custom") {
                      enableCustomBlock();
                    } else {
                      const idx = BLOCK_SIZES.findIndex((b) => b.label === val);
                      if (idx >= 0) setBlockPreset(idx);
                    }
                  }}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Выберите размер" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Стеновые</SelectLabel>
                      {BLOCK_SIZES.filter((b) => b.width >= 200).map((b) => (
                        <SelectItem key={b.label} value={b.label}>
                          {b.label} мм
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Перегородочные</SelectLabel>
                      {BLOCK_SIZES.filter((b) => b.width < 200).map((b) => (
                        <SelectItem key={b.label} value={b.label}>
                          {b.label} мм
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectItem value="custom">Свой размер</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Плотность блока</Label>
                <Select
                  value={input.density}
                  onValueChange={(v) => setField("density", v as DensityGrade)}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DENSITY_OPTIONS.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label} ({d.kgPerM3} кг/м³)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Пользовательский размер блока */}
            {isCustomBlock && (
              <div className="mt-4 grid gap-4 rounded-lg border border-dashed p-4 sm:grid-cols-3">
                <NumberField
                  label="Длина блока"
                  unit="мм"
                  value={input.blockSize.length}
                  onChange={(v) =>
                    setCustomBlock({ ...input.blockSize, label: "Свой", length: v })
                  }
                />
                <NumberField
                  label="Высота блока"
                  unit="мм"
                  value={input.blockSize.height}
                  onChange={(v) =>
                    setCustomBlock({ ...input.blockSize, label: "Свой", height: v })
                  }
                />
                <NumberField
                  label="Ширина блока"
                  unit="мм"
                  value={input.blockSize.width}
                  onChange={(v) =>
                    setCustomBlock({ ...input.blockSize, label: "Свой", width: v })
                  }
                />
              </div>
            )}

            <Separator className="my-6" />

            {/* ── Проёмы и запас ──────── */}
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField
                label="Площадь окон"
                unit="м²"
                value={input.windowArea}
                onChange={(v) => setField("windowArea", v)}
                step={0.5}
                hint="Суммарная площадь всех окон"
              />
              <NumberField
                label="Площадь дверей"
                unit="м²"
                value={input.doorArea}
                onChange={(v) => setField("doorArea", v)}
                step={0.5}
              />
              <NumberField
                label="Запас"
                unit="%"
                value={input.reservePercent}
                onChange={(v) => setField("reservePercent", v)}
                hint="Рекомендуется 5–10%"
              />
            </div>

            <Separator className="my-6" />

            {/* ── Перегородки / фронтоны ──────── */}
            <div className="space-y-4">
              <SwitchRow
                title="Внутренние перегородки"
                description="Добавить площадь внутренних перегородок к расчёту"
                checked={input.hasPartitions}
                onCheckedChange={(v) => setField("hasPartitions", v)}
              >
                <NumberField
                  label="Площадь перегородок"
                  unit="м²"
                  value={input.partitionArea}
                  onChange={(v) => setField("partitionArea", v)}
                  step={0.5}
                />
              </SwitchRow>

              <SwitchRow
                title="Фронтоны"
                description="Учесть площадь фронтонов в расчёте"
                checked={input.hasPediments}
                onCheckedChange={(v) => setField("hasPediments", v)}
              >
                <NumberField
                  label="Площадь фронтонов"
                  unit="м²"
                  value={input.pedimentArea}
                  onChange={(v) => setField("pedimentArea", v)}
                  step={0.5}
                />
              </SwitchRow>
            </div>

            <Separator className="my-6" />

            {/* ── Стоимость и доставка ──────── */}
            <div className="mb-4 flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">
                Стоимость и доставка
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField
                label="Цена за м³"
                unit="₽"
                value={input.pricePerCubicMeter}
                onChange={(v) => setField("pricePerCubicMeter", v)}
                step={100}
              />
              <NumberField
                label="Цена мешка клея"
                unit="₽"
                value={input.glueBagPrice}
                onChange={(v) => setField("glueBagPrice", v)}
                step={10}
                hint="Мешок 25 кг"
              />
              <NumberField
                label="Стоимость доставки"
                unit="₽"
                value={input.deliveryCost}
                onChange={(v) => setField("deliveryCost", v)}
                step={500}
              />
            </div>

            <div className="mt-4">
              <SwitchRow
                title="Учитывать доставку"
                description="Добавить стоимость доставки к итогу"
                checked={input.hasDelivery}
                onCheckedChange={(v) => setField("hasDelivery", v)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
