import { useState, useCallback } from "react";
import { Building2, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "#calculator", label: "Калькулятор" },
  { href: "#recommendations", label: "Подбор блока" },
  { href: "#faq", label: "Вопросы" },
  { href: "#lead-form", label: "Заявка" },
] as const;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const close = useCallback(() => setMobileOpen(false), []);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#" className="flex items-center gap-2">
          <Building2 className="h-7 w-7 text-primary" />
          <span className="text-lg font-bold text-foreground">ГазоБлок</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden gap-6 text-sm font-medium text-muted-foreground md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#lead-form"
            className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:inline-flex"
          >
            Получить расчёт
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:hidden"
            aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <nav className="border-t bg-white px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-3 text-sm font-medium text-muted-foreground">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={close}
                  className="block rounded-lg px-3 py-2 transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#lead-form"
                onClick={close}
                className="mt-1 block rounded-lg bg-primary px-3 py-2 text-center font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Получить расчёт
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
