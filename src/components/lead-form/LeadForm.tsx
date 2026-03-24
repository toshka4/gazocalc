import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import type { CalculatorInput, CalculatorResult } from "@/types";
import { buildLeadPayload, submitLead, downloadPdf } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Send, FileText, MessageSquare } from "lucide-react";

const leadSchema = z.object({
  name: z.string().min(2, "Введите имя (минимум 2 символа)"),
  phone: z
    .string()
    .min(6, "Введите номер телефона")
    .regex(/^\+?[\d\s\-()]{6,20}$/, "Неверный формат телефона"),
  email: z.string().email("Введите корректный email").or(z.literal("")),
  city: z.string().min(2, "Укажите город"),
  comment: z.string().optional(),
});

type LeadSchema = z.infer<typeof leadSchema>;

interface LeadFormProps {
  calculatorInput: CalculatorInput | null;
  calculatorResult: CalculatorResult | null;
}

export function LeadForm({ calculatorInput, calculatorResult }: LeadFormProps) {
  const [lastLeadId, setLastLeadId] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LeadSchema>({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: "", phone: "", email: "", city: "", comment: "" },
  });

  const onSubmit = async (data: LeadSchema) => {
    if (!calculatorInput || !calculatorResult) {
      toast.error("Сначала заполните параметры расчёта");
      return;
    }

    try {
      const payload = buildLeadPayload(
        { ...data, comment: data.comment ?? "" },
        calculatorInput,
        calculatorResult,
      );
      const result = await submitLead(payload);
      setLastLeadId(result.data?.id ?? null);
      toast.success("Заявка отправлена!", {
        description: "Наш менеджер свяжется с вами в ближайшее время.",
      });
      reset();
    } catch (err) {
      toast.error("Ошибка отправки", {
        description: err instanceof Error ? err.message : "Попробуйте позже",
      });
    }
  };

  const onDownloadPdf = async () => {
    if (!lastLeadId) {
      toast.info("Сначала отправьте заявку", {
        description: "PDF будет доступен после отправки заявки.",
      });
      return;
    }
    try {
      const blob = await downloadPdf(lastLeadId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `raschet-${lastLeadId.slice(0, 8)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("Ошибка генерации PDF", {
        description: err instanceof Error ? err.message : "Попробуйте позже",
      });
    }
  };

  return (
    <section id="lead-form" className="scroll-mt-20 bg-slate-50/70 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Получите точный расчёт от менеджера
          </h2>
          <p className="mt-3 text-muted-foreground">
            Оставьте заявку — мы подготовим детальный расчёт с учётом вашего региона, объёма
            и актуальных цен
          </p>
        </div>

        <Card className="mx-auto mt-10 max-w-xl shadow-lg">
          <CardHeader className="border-b pb-5">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5 text-primary" />
              Форма заявки
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Имя *</Label>
                <Input
                  id="name"
                  placeholder="Иван Иванов"
                  {...register("name")}
                  className="h-10"
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    {...register("phone")}
                    className="h-10"
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive">{errors.phone.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    {...register("email")}
                    className="h-10"
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="city">Город *</Label>
                <Input
                  id="city"
                  placeholder="Москва"
                  {...register("city")}
                  className="h-10"
                />
                {errors.city && (
                  <p className="text-xs text-destructive">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="comment">Комментарий</Label>
                <Textarea
                  id="comment"
                  placeholder="Опишите ваш проект или задайте вопрос..."
                  rows={3}
                  {...register("comment")}
                />
              </div>

              <Separator />

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? "Отправка..." : "Получить точный расчёт"}
                </button>
                <button
                  type="button"
                  onClick={onDownloadPdf}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border bg-white px-6 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  <FileText className="h-4 w-4" />
                  Скачать PDF
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
