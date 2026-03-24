import { FAQ_ITEMS } from "@/data/constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-20 bg-slate-50/70 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <HelpCircle className="h-4 w-4" />
            Частые вопросы
          </div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Вопросы о расчёте газобетона для строительства
          </h2>
          <p className="mt-3 text-muted-foreground">
            Ответы на частые вопросы о кладке из газоблоков, расходе клея,
            выборе плотности и подсчёте количества блоков на дом
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl">
          <Accordion className="space-y-3">
            {FAQ_ITEMS.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="rounded-lg border bg-white px-5 shadow-sm"
              >
                <AccordionTrigger className="py-5 text-left text-sm font-semibold hover:no-underline sm:text-base">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
