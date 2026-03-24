import { z } from "zod";

/** Валидатор UUID v4 для параметров маршрутов */
export const uuidSchema = z.string().uuid("Некорректный идентификатор");
