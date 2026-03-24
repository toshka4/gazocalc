import type { CalculatorResult } from "@/types";
import { CUBIC_METERS_PER_PALLET, GLUE_BAG_WEIGHT_KG } from "@/data/constants";
import { formatNumber, formatCurrency } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Separator } from "@/components/ui/separator";
import {
  Box,
  Layers,
  Palette,
  Weight,
  Banknote,
  Package,
  Info,
} from "lucide-react";

interface ResultsBlockProps {
  result: CalculatorResult;
}

export function ResultsBlock({ result }: ResultsBlockProps) {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-2xl font-bold tracking-tight sm:text-3xl">
            Результаты расчёта
          </h2>

          {/* Основные показатели */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              icon={Box}
              label="Объём газобетона"
              value={`${formatNumber(result.concreteVolume)} м³`}
              sub={`Площадь стен: ${formatNumber(result.totalArea)} м²`}
            />
            <StatCard
              icon={Layers}
              label="Количество блоков"
              value={`${formatNumber(result.blockCount)} шт`}
              sub="С учётом запаса"
            />
            <StatCard
              icon={Package}
              label="Поддонов"
              value={`${result.palletCount} шт`}
              sub={`≈ ${CUBIC_METERS_PER_PALLET} м³ на поддон`}
            />
            <StatCard
              icon={Palette}
              label="Клей для кладки"
              value={`${result.glueBagCount} мешков`}
              sub={`Мешки по ${GLUE_BAG_WEIGHT_KG} кг`}
            />
            <StatCard
              icon={Weight}
              label="Ориентировочный вес"
              value={`${formatNumber(result.estimatedWeight)} кг`}
              sub={`≈ ${formatNumber(Math.round(result.estimatedWeight / 1000))} т`}
            />
            <StatCard
              icon={Banknote}
              label="Стоимость блоков"
              value={formatCurrency(result.blocksCost)}
            />
          </div>

          <Separator className="my-8" />

          {/* Итоговая стоимость */}
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 via-white to-blue-50 shadow-lg">
            <CardContent className="p-6 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Блоки
                  </p>
                  <p className="text-lg font-semibold">{formatCurrency(result.blocksCost)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Клей
                  </p>
                  <p className="text-lg font-semibold">{formatCurrency(result.glueCost)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Доставка
                  </p>
                  <p className="text-lg font-semibold">{formatCurrency(result.deliveryCost)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-primary">
                    Итого
                  </p>
                  <p className="text-2xl font-extrabold text-primary">
                    {formatCurrency(result.totalCost)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Рекомендация */}
          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/50 p-5">
            <div className="flex gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Рекомендация по толщине:</strong>{" "}
                  для несущих наружных стен жилого дома используйте блоки толщиной от 300 мм
                  и плотностью D500–D600.
                </p>
                <p>
                  Результат носит <strong className="text-foreground">ориентировочный характер</strong>.
                  Для точного расчёта с учётом особенностей проекта отправьте заявку нашему
                  менеджеру.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
