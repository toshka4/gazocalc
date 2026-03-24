import { z } from "zod";
import { calculationInputSchema, calculationResultSchema } from "../calculations/calculations.schema.js";

// ── Статусы заявки ────────────────────────────────────

export const leadStatuses = [
  "NEW", "CONTACTED", "IN_PROGRESS", "QUALIFIED", "WON", "LOST", "ARCHIVED",
] as const;

export type LeadStatusValue = (typeof leadStatuses)[number];

// ── Создание заявки ───────────────────────────────────

export const createLeadPayloadSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа").max(100),
  phone: z
    .string()
    .min(6, "Введите номер телефона")
    .max(20)
    .regex(/^\+?[\d\s\-()]{6,20}$/, "Неверный формат телефона"),
  email: z.string().email("Некорректный email").or(z.literal("")).default(""),
  city: z.string().min(2, "Укажите город").max(100),
  comment: z.string().max(1000, "Комментарий слишком длинный").default(""),
  calculation: z.object({
    input: calculationInputSchema,
    result: calculationResultSchema,
  }),
});

export type CreateLeadPayload = z.infer<typeof createLeadPayloadSchema>;

// ── Список заявок (query) ─────────────────────────────

export const leadListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(leadStatuses).optional(),
  search: z.string().max(100).optional(),
  sortBy: z.enum(["createdAt", "status", "city", "totalCost"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type LeadListQuery = z.infer<typeof leadListQuerySchema>;

// ── Обновление заявки (для админки) ───────────────────

export const updateLeadSchema = z.object({
  status: z.enum(leadStatuses).optional(),
  managerNotes: z.string().max(2000).optional(),
}).refine(
  (data) => data.status !== undefined || data.managerNotes !== undefined,
  { message: "Нужно указать хотя бы status или managerNotes" },
);

export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
