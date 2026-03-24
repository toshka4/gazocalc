import {
  Zap,
  Target,
  BadgePercent,
  Clock,
} from "lucide-react";

const ADVANTAGES = [
  {
    icon: Zap,
    title: "Мгновенный расчёт газоблока",
    text: "Количество газобетонных блоков, объём кладки и расход клея обновляются автоматически при изменении параметров",
  },
  {
    icon: Target,
    title: "Точность до блока",
    text: "Учитываем оконные и дверные проёмы, перегородки, фронтоны и запас на подрезку газобетона",
  },
  {
    icon: BadgePercent,
    title: "Полная смета строительства",
    text: "Считаем стоимость газобетонных блоков, клея для кладки и доставки — итоговая цена без скрытых расходов",
  },
  {
    icon: Clock,
    title: "Экономия времени",
    text: "Заменяет ручной расчёт стен из газобетона — укажите размеры дома и получите результат",
  },
];

export function AdvantagesSection() {
  return (
    <section className="border-b bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {ADVANTAGES.map((adv) => (
            <div key={adv.title} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <adv.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-1.5 text-sm font-semibold text-foreground">{adv.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{adv.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
