import type { Calculation } from "@/types"

interface CalculationDetailsProps {
  calc: Calculation
}

export function CalculationDetails({ calc }: CalculationDetailsProps) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Параметры расчёта
      </h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        <Detail label="Длина дома" value={`${calc.houseLength} м`} />
        <Detail label="Ширина дома" value={`${calc.houseWidth} м`} />
        <Detail label="Высота стен" value={`${calc.wallHeight} м`} />
        <Detail label="Толщина стен" value={`${calc.wallThickness} мм`} />
        <Detail label="Блок (Д×В×Ш)" value={`${calc.blockLength}×${calc.blockHeight}×${calc.blockThickness} мм`} />
        <Detail label="Плотность" value={calc.density} />
        <Detail label="Площадь окон" value={`${calc.windowArea} м²`} />
        <Detail label="Площадь дверей" value={`${calc.doorArea} м²`} />
        <Detail label="Запас" value={`${calc.reservePercent}%`} />
        {calc.hasPartitions && <Detail label="Перегородки" value={`${calc.partitionArea} м²`} />}
        {calc.hasPediments && <Detail label="Фронтоны" value={`${calc.pedimentArea} м²`} />}
        <Detail label="Доставка" value={calc.hasDelivery ? "Да" : "Нет"} />
      </div>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  )
}
