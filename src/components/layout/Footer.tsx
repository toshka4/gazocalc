import { Building2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-white">ГазоБлок</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Онлайн-калькулятор газобетона — бесплатный расчёт количества газобетонных
              блоков, расхода клея для кладки и стоимости строительства стен.
              Подбор газоблока по плотности и толщине для дома, дачи, гаража и бани.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Навигация
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#calculator" className="transition-colors hover:text-white">
                  Калькулятор
                </a>
              </li>
              <li>
                <a href="#recommendations" className="transition-colors hover:text-white">
                  Подбор блока
                </a>
              </li>
              <li>
                <a href="#faq" className="transition-colors hover:text-white">
                  Частые вопросы
                </a>
              </li>
              <li>
                <a href="#lead-form" className="transition-colors hover:text-white">
                  Отправить заявку
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Контакты
            </h4>
            <ul className="space-y-2 text-sm">
              <li>125130, г. Москва, вн.тер.г. Муниципальный Округ Войковский, ул Зои И Александра Космодемьянских, д. 9 к. 2</li>
              <li>Email: info@gazocalc.ru</li>
              <li>Пн–Пт: 9:00–18:00</li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-slate-700" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} ГазоБлок. Все расчёты носят ориентировочный характер.</p>
          <p>Разработано с любовью к строительству</p>
        </div>
      </div>
    </footer>
  );
}
