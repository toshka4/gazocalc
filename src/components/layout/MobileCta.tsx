import { useState } from "react";
import { ArrowUp, Calculator, X } from "lucide-react";

export function MobileCta() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white/95 p-3 backdrop-blur-md md:hidden">
      <div className="flex gap-2">
        <a
          href="#calculator"
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow"
        >
          <Calculator className="h-4 w-4" />
          Рассчитать
        </a>
        <a
          href="#lead-form"
          className="inline-flex h-11 items-center justify-center rounded-lg border bg-white px-4 text-sm font-semibold text-foreground"
        >
          <ArrowUp className="h-4 w-4" />
        </a>
        <button
          onClick={() => setDismissed(true)}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Скрыть панель"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
