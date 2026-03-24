import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().min(1).max(65535).default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  APP_BASE_URL: z.string().url().default("http://localhost:5173"),

  // Список допустимых origin через запятую (в production обязателен)
  CORS_ORIGIN: z.string().default(""),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // Admin API key для защиты admin-эндпоинтов (GET/PATCH /api/leads)
  ADMIN_API_KEY: z.string().default(""),

  TELEGRAM_BOT_TOKEN: z.string().default(""),
  TELEGRAM_CHAT_ID: z.string().default(""),

  SMTP_HOST: z.string().default(""),
  SMTP_PORT: z.coerce.number().min(1).max(65535).default(587),
  SMTP_USER: z.string().default(""),
  SMTP_PASS: z.string().default(""),
  SMTP_FROM: z.string().default("noreply@gazocalc.ru"),
  MANAGER_EMAIL: z.string().default(""),

  // Rate limiting
  RATE_LIMIT_MAX: z.coerce.number().min(1).default(5),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().min(1000).default(60_000),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Invalid environment variables:");
    console.error(result.error.flatten().fieldErrors);
    process.exit(1);
  }

  return result.data;
}
