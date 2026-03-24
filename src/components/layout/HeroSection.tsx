import {
  Calculator,
  ShieldCheck,
  Truck,
  ArrowDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PERKS = [
  { icon: Calculator, text: "Расчёт газоблока за 30 секунд" },
  { icon: ShieldCheck, text: "Учёт запаса на подрезку и расхода клея" },
  { icon: Truck, text: "Количество поддонов и стоимость доставки" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.08),transparent)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
            Бесплатный онлайн-калькулятор
          </Badge>

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Калькулятор газобетона онлайн{" "}
            <span className="text-primary">— расчёт блоков, клея</span> и стоимости
            строительства
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Рассчитайте количество газобетонных блоков, расход клея для кладки
            и ориентировочную стоимость стен из газобетона за несколько кликов.
            Учёт проёмов, перегородок, фронтонов и доставки — бесплатно и без регистрации.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#calculator"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
            >
              Рассчитать газобетон
              <ArrowDown className="ml-2 h-4 w-4" />
            </a>
            <a
              href="#lead-form"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-white px-8 text-base font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Получить точный расчёт
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            {PERKS.map((perk) => (
              <div
                key={perk.text}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <perk.icon className="h-5 w-5 text-primary" />
                <span>{perk.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
