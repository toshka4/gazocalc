import { formatCurrency, formatNumber } from "@/lib/utils"
import type { Calculation } from "@/types"

interface CalculationResultsProps {
  calc: Calculation
}

export function CalculationResults({ calc }: CalculationResultsProps) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Результаты расчёта
      </h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        <Result label="Объём блоков" value={`${calc.totalVolume.toFixed(2)} м³`} />
        <Result label="Кол-во блоков" value={`${formatNumber(calc.totalBlocks)} шт`} />
        <Result label="Поддонов" value={`${calc.totalPallets} шт`} />
        <Result label="Мешков клея" value={`${calc.totalGlueBags} шт`} />
        <Result label="Вес" value={`${formatNumber(Math.round(calc.totalWeight))} кг`} />
      </div>

      <div className="mt-4 border-t pt-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Блоки</span>
            <span className="font-medium">{formatCurrency(calc.blocksCost)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Клей</span>
            <span className="font-medium">{formatCurrency(calc.glueCost)}</span>
          </div>
          {calc.deliveryCost > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Доставка</span>
              <span className="font-medium">{formatCurrency(calc.deliveryCost)}</span>
            </div>
          )}
          <div className="flex justify-between border-t pt-2">
            <span className="font-semibold">Итого</span>
            <span className="text-lg font-bold text-primary">{formatCurrency(calc.totalCost)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  )
}
